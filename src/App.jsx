import { useState, useEffect, useRef } from 'react'
import Popup from './components/Popup.jsx'
import { verifyClaim } from './services/apiService.js'

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
  const wsRef = useRef(null)

  // Phase 0 = Still searching for relevant articles. Displays initial search results.
  // Phase 1 = Filtered search results according to relevance, and compute scores for each.
  // Phase 2 = Aggregated results and overall stats.
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    chrome.storage.local.get(['selectedText', 'config'], (result) => {
      // Get selected text on initial load
      if (result.selectedText) {
        setSelectedText(result.selectedText)
      }

      // Load config if there is any, initialize if not
      if (result.config) {
        setConfig(result.config)
      } else {
        chrome.storage.local.set(config)
      }
    })

    // Listen for storage changes (when user selects new text while panel is open)
    const handleStorageChange = (changes, areaName) => {
      if (areaName === 'local' && changes.selectedText) {
        console.log('New text selected:', changes.selectedText.newValue)
        setSelectedText(changes.selectedText.newValue)
      }
    }

    chrome.storage.onChanged.addListener(handleStorageChange)

    // Cleanup listener on unmount
    return () => {
      chrome.storage.onChanged.removeListener(handleStorageChange)
    }
  }, [])

  useEffect(() => {
    if (!selectedText) return

    // Close any previous WebSocket connection
    if (wsRef.current) {
      console.log('Closing previous WebSocket')
      wsRef.current.close()
      wsRef.current = null
    }

    // Reset all state for new claim
    setPhase(0)
    setIsLoading(true)
    setError(null)
    setSearchHits([])
    setResults([])
    setOverallVerdict(0)
    setStats({
      overall_verdict: 0,
      bias_divergence: 0,
      truth_confidence_score: 0,
      bias_consistency: 0,
      total_processed: 0,
    })

    verifyClaim(selectedText, config, {
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

        // Mark results as aggregated if their doc_id is in data.doc_ids
        if (data.doc_ids && Array.isArray(data.doc_ids)) {
          setResults((prevResults) =>
            prevResults.map((result) => ({
              ...result,
              is_aggregated: data.doc_ids.includes(result.doc_id),
            })),
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
      },
      onWebSocketCreated: (ws) => {
        wsRef.current = ws
      },
    }).catch((err) => {
      setError(err.message)
      setIsLoading(false)
    })

    // Cleanup function when component unmounts or selectedText changes
    return () => {
      if (wsRef.current) {
        console.log('Cleaning up WebSocket')
        wsRef.current.close()
        wsRef.current = null
      }
    }
  }, [selectedText])

  if (error) {
    console.error('Error occurred:', error) // Log error to console
    return (
      <div className="w-screen h-screen flex justify-center items-center text-slate-700">
        <div className="text-center">
          <p className="font-bold mb-2">Oops, something went wrong</p>
        </div>
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
        isLoading={isLoading}
      />
    )
  }

  return 'No relevant article found :('
}

export default App
