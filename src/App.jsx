import { useState, useEffect, useRef, useCallback } from 'react'
import { FileEdit, CircleAlert } from 'lucide-react'
import Popup from './components/Popup.jsx'
import { calculateStats, verifyClaim } from './services/apiService.js'

function App() {
  const [overallVerdict, setOverallVerdict] = useState(null)
  const [searchHits, setSearchHits] = useState([])
  const [results, setResults] = useState([])
  const [selectedText, setSelectedText] = useState(null)
  const [stats, setStats] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [config, setConfig] = useState({
    maxEvidence: 3,
    useNonFactcheck: true,
  })
  const [isStatsLoading, setIsStatsLoading] = useState(false)
  const [archivedIds, setArchivedIds] = useState(new Set())
  const [active, setActive] = useState('all')
  const wsRef = useRef(null)
  const configRef = useRef(config)

  const MIN_CHARS = 20
  const isTextTooShort = selectedText && selectedText.trim().length < MIN_CHARS

  // Phase 0 = Still searching for relevant articles. Displays initial search results.
  // Phase 1 = Filtered search results according to relevance, and compute scores for each.
  // Phase 2 = Aggregated results and overall stats.
  const [phase, setPhase] = useState(0)
  const pendingStats = {
    overall_verdict: 0,
    bias_divergence: 0,
    truth_confidence_score: 0,
    bias_consistency: 0,
    total_processed: 0,
  }

  const closeWebSocket = useCallback(() => {
    if (wsRef.current) {
      console.log('Closing previous WebSocket')
      wsRef.current.__clientClose = true
      wsRef.current.close()
      wsRef.current = null
    }
  }, [])

  const resetAnalysisState = useCallback(
    ({ isLoading = false, overallVerdict = null, stats = null } = {}) => {
      setPhase(0)
      setIsLoading(isLoading)
      setError(null)
      setSearchHits([])
      setResults([])
      setOverallVerdict(overallVerdict)
      setStats(stats)
      setIsStatsLoading(false)
      setArchivedIds(new Set())
      setActive('all')
    },
    [],
  )

  const resetAppState = useCallback(
    ({ clearSelectedText = false } = {}) => {
      closeWebSocket()

      resetAnalysisState()
      setSelectedText(null)

      if (clearSelectedText) {
        chrome.storage.local.remove('selectedText')
      }
    },
    [closeWebSocket, resetAnalysisState],
  )

  const runVerify = useCallback(() => {
    closeWebSocket()

    if (!selectedText || isTextTooShort) return

    resetAnalysisState({
      isLoading: true,
      overallVerdict: 0,
      stats: pendingStats,
    })

    verifyClaim(selectedText, configRef.current, {
      onSearchHit: (hits) => {
        setPhase(0)
        setSearchHits(hits)
      },
      onResult: (data) => {
        setPhase(1)

        // Only append if not skipped
        if (!data.skipped) {
          setResults((prev) => [...prev, { ...data.data, remarks: null }])
        }
      },
      onStats: (data) => {
        if (data.stats) {
          setOverallVerdict(data.stats.overall_verdict)
          setStats(data.stats)
        }

        // Mark results as aggregated and update potential_bias if provided
        if (data.doc_ids && Array.isArray(data.doc_ids)) {
          setResults((prevResults) =>
            prevResults.map((result) => {
              const updatedHit = data.results?.find(
                (r) => r.doc_id === result.doc_id,
              )
              return {
                ...result,
                is_aggregated: data.doc_ids.includes(result.doc_id),
                potential_bias: result.potential_bias || !!updatedHit,
                bias_reason: updatedHit?.bias_reason || result.bias_reason,
              }
            }),
          )
        }

        setPhase(2)
        setIsLoading(false)
      },
      onRemarks: (data) => {
        // Update specific result with the new remark
        setResults((prevResults) =>
          prevResults.map((result) =>
            result.doc_id === data.doc_id
              ? { ...result, remarks: data.remarks }
              : result,
          ),
        )
      },
      onError: (err) => {
        setError(err.message)
        setIsLoading(false)
        setSelectedText(null)
      },
      onWebSocketCreated: (ws) => {
        wsRef.current = ws
      },
    }).catch((err) => {
      setError(err.message)
      setIsLoading(false)
      setSelectedText(null)
    })
  }, [selectedText, isTextTooShort, closeWebSocket, resetAnalysisState])

  const handleSelectedTextChange = (selectedText) => {
    if (selectedText && selectedText.length > 0) {
      setSelectedText(selectedText)
    } else {
      setSelectedText(null)
    }
  }

  const consumeSelectedText = (nextSelectedText) => {
    handleSelectedTextChange(nextSelectedText)

    if (nextSelectedText && nextSelectedText.length > 0) {
      chrome.storage.local.remove('selectedText')
    }
  }

  useEffect(() => {
    configRef.current = config
  }, [config])

  useEffect(() => {
    chrome.storage.local.get(['selectedText', 'config'], (result) => {
      // Get selected text on initial load
      consumeSelectedText(result.selectedText)

      // Load config if there is any, initialize if not
      if (result.config) {
        configRef.current = result.config
        setConfig(result.config)
      } else {
        chrome.storage.local.set({ config: configRef.current })
      }
    })

    // Listen for storage changes (when user selects new text while panel is open)
    const handleStorageChange = (changes, areaName) => {
      if (areaName === 'local') {
        if (changes.selectedText) {
          if (changes.selectedText.newValue === undefined) return
          console.log('New text selected:', changes.selectedText.newValue)
          consumeSelectedText(changes.selectedText.newValue)
        }
        if (changes.config) {
          console.log('Config update detected:', changes.config.newValue)
          configRef.current = changes.config.newValue
          setConfig(changes.config.newValue)
        }
      }
    }

    chrome.storage.onChanged.addListener(handleStorageChange)

    // Cleanup listener on unmount
    return () => {
      chrome.storage.onChanged.removeListener(handleStorageChange)
    }
  }, [])

  useEffect(() => {
    runVerify()
  }, [runVerify])

  useEffect(() => {
    const handlePageHide = () => {
      resetAppState({ clearSelectedText: true })
    }

    const handleBeforeUnload = () => {
      resetAppState({ clearSelectedText: true })
    }

    window.addEventListener('pagehide', handlePageHide)
    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('pagehide', handlePageHide)
      window.removeEventListener('beforeunload', handleBeforeUnload)
      closeWebSocket()
    }
  }, [resetAppState, closeWebSocket])

  useEffect(() => {
    if (phase === 2) {
      setActive('relevant')
    }
  }, [phase])

  useEffect(() => {
    if (phase !== 2) return

    setIsStatsLoading(true)

    const nonArchivedEvidences = getNonArchivedEvidences(results, archivedIds)

    calculateStats(nonArchivedEvidences)
      .then((res) => {
        setStats(res)
        setOverallVerdict(res.overall_verdict)
      })
      .finally(() => {
        setIsStatsLoading(false)
      })
  }, [archivedIds])

  if (error) {
    console.error('Error occurred:', error)

    return (
      <div className="w-full h-screen bg-white flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
        <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mb-6 shadow-sm border border-amber-100">
          <CircleAlert
            size={32}
            className="text-amber-500 opacity-80"
            strokeWidth={1.5}
          />
        </div>
        <h2 className="text-[20px] font-bold text-slate-800 mb-2">
          Oops, something went wrong.
        </h2>
        <p className="text-[14px] text-slate-500 leading-relaxed max-w-[240px]">
          Please try again later.
        </p>
      </div>
    )
  }

  // Render logic for too short
  if (isTextTooShort) {
    return (
      <div className="w-full h-screen bg-white flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
        <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mb-6 shadow-sm border border-amber-100">
          <FileEdit
            size={32}
            className="text-amber-500 opacity-80"
            strokeWidth={1.5}
          />
        </div>
        <h2 className="text-[20px] font-bold text-slate-800 mb-2">
          Claim is too short
        </h2>
        <p className="text-[14px] text-slate-500 leading-relaxed max-w-[240px]">
          Please select more text to ensure a high-quality analysis.
        </p>
      </div>
    )
  }

  if (!selectedText) {
    return (
      <div className="w-full h-screen bg-white flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
        <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mb-6 shadow-sm border border-amber-100">
          <FileEdit
            size={32}
            className="text-amber-500 opacity-80"
            strokeWidth={1.5}
          />
        </div>
        <h2 className="text-[20px] font-bold text-slate-800 mb-2">
          No claim detected
        </h2>
        <p className="text-[14px] text-slate-500 leading-relaxed max-w-[240px]">
          Please select a text to verify.
        </p>
      </div>
    )
  }

  if (selectedText) {
    return (
      <Popup
        overallVerdict={overallVerdict || 0}
        selectedText={selectedText}
        phase={phase}
        searchHits={searchHits}
        results={results}
        stats={stats}
        active={active}
        setActive={setActive}
        isLoading={isLoading}
        archivedIds={archivedIds}
        setArchivedIds={setArchivedIds}
        isStatsLoading={isStatsLoading}
        MIN_CHARS={MIN_CHARS}
        onRerunVerify={runVerify}
      />
    )
  }

  return (
    <div className="w-full h-screen bg-white flex flex-col items-center justify-center p-8 text-center opacity-60">
      <p className="text-slate-400 font-medium tracking-tight">
        No statement selected yet
      </p>
    </div>
  )
}

export default App
