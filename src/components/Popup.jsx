import { useState, useEffect } from 'react'
import FilterArea from './FilterArea.jsx'
import BiasBar from './BiasBar.jsx'
import ArticleCard from './ArticleCard.jsx'
import InfoCard from './InfoCard.jsx'
import Spinner from './Spinner.jsx'
import TruthIcon from '../assets/Truth_Icon.png'
import FakeIcon from '../assets/Fake_Icon.png'
import NeedsContextIcon from '../assets/Needs_Context_Icon.png'
import { getItemsFromFilter, mapVerdictToLabel } from '../utils/scripts.js'
import SearchResultCard from './SearchResultCard.jsx'
import { Settings, RefreshCw } from 'lucide-react'
import ConfigPopup from './ConfigPopup.jsx'
import ClaimPopup from './ClaimPopup.jsx'
import EditPopup from './EditPopup.jsx'
import Skeleton from './Skeleton.js'

const getColorClasses = (verdictLabel, isAnalyzing = false) => {
  // Use neutral gray while loading
  if (isAnalyzing) {
    return {
      header: 'bg-gray-500',
      statement: 'bg-gray-700',
      hover: 'hover:text-gray-300',
      textColor: 'text-gray-700',
      icon: NeedsContextIcon,
      label: 'Analyzing...',
    }
  }

  switch (verdictLabel) {
    case 'true':
      return {
        header: 'bg-green-500',
        statement: 'bg-green-900',
        hover: 'hover:text-green-300',
        textColor: 'text-green-900',
        icon: TruthIcon,
        label: 'Likely True',
      }
    case 'fake':
      return {
        header: 'bg-red-500',
        statement: 'bg-red-900',
        hover: 'hover:text-red-300',
        textColor: 'text-red-900',
        icon: FakeIcon,
        label: 'Likely Fake',
      }
    case 'neutral':
      return {
        header: 'bg-yellow-500',
        statement: 'bg-yellow-800',
        hover: 'hover:text-yellow-300',
        textColor: 'text-yellow-700',
        icon: NeedsContextIcon,
        label: 'Needs Context',
      }
    default:
      return {
        header: 'bg-red-500',
        statement: 'bg-red-900',
        hover: 'hover:text-red-300',
        textColor: 'text-red-900',
        icon: FakeIcon,
        label: 'Likely Fake',
      }
  }
}

export default function Popup({
  overallVerdict,
  selectedText,
  phase,
  searchHits,
  results,
  stats,
  active,
  setActive,
  isLoading,
  archivedIds,
  setArchivedIds,
  isStatsLoading,
  MIN_CHARS,
  onRerunVerify,
}) {
  const [verdictLabel, setVerdictLabel] = useState(
    mapVerdictToLabel(overallVerdict),
  )
  const [colors, setColors] = useState(
    getColorClasses(mapVerdictToLabel(overallVerdict), isLoading),
  )
  const [truthScore, setTruthScore] = useState(0)
  const [biasDivergence, setBiasDivergence] = useState(0)
  const [biasConsistency, setBiasConsistency] = useState(0)
  const [overallVerdictScore, setOverallVerdictScore] = useState(0)
  const [isConfigOpen, setIsConfigOpen] = useState(false)
  const [items, setItems] = useState(searchHits)
  const [groupedItems, setGroupedItems] = useState({
    relevant: [],
    supplementary: {
      all: [],
      true: [],
      fake: [],
      neutral: [],
    },
    archived: [],
  })
  const [displayItems, setDisplayItems] = useState([])
  const [isClaimOpened, setIsClaimOpened] = useState(false)
  const [isClaimEditorOpen, setIsClaimEditorOpen] = useState(false)
  // Handler to archive an article by id
  const handleArchive = (id) => {
    setArchivedIds((prev) => {
      const next = new Set(prev)
      next.add(id)
      return next
    })
  }

  // Handler to unarchive an article by id
  const handleUnarchive = (id) => {
    setArchivedIds((prev) => {
      const next = new Set(prev)
      next.delete(id)
      // Compute what the archived count will be after this operation
      const archivedCount =
        getItemsFromFilter('archived', groupedItems).length - 1
      if (archivedCount <= 0) {
        setActive('relevant')
      }
      return next
    })
  }

  const handleRerun = () => {
    onRerunVerify()
  }

  useEffect(() => {
    if (phase === 0) {
      setItems(searchHits)
    } else {
      setItems(results)
    }
  }, [searchHits, results, phase])

  useEffect(() => {
    const grouped = {
      relevant: [],
      supplementary: {
        all: [],
        true: [],
        fake: [],
        neutral: [],
      },
      archived: [],
    }

    items.forEach((item, idx) => {
      const isArchived = archivedIds.has(item.doc_id) || item.archived

      if (isArchived) {
        grouped.archived.push({ ...item, archived: true })
      } else if (item.is_aggregated) {
        grouped.relevant.push(item)
      } else {
        const verdict = mapVerdictToLabel(item.verdict)

        if (grouped.supplementary[verdict]) {
          grouped.supplementary[verdict].push(item)
        }

        grouped.supplementary.all.push(item)
      }
    })

    setGroupedItems(grouped)
  }, [items, archivedIds])

  useEffect(() => {
    setDisplayItems(getItemsFromFilter(active, groupedItems))
  }, [active, groupedItems])

  useEffect(() => {
    if (stats) {
      const newTruthScore = Math.round(
        (((stats.truth_confidence_score || 0) + 1) / 2) * 100,
      )
      const newBiasDivergence = Math.round(
        (((stats.bias_divergence || 0) + 1) / 2) * 100,
      )
      const newBiasConsistency = Math.round(
        (((stats.bias_consistency || 0) + 1) / 2) * 100,
      )

      setTruthScore(newTruthScore)
      setBiasDivergence(newBiasDivergence)
      setBiasConsistency(newBiasConsistency)

      // Update verdict label/colors and numeric score
      const overallVerdictValue = stats.overall_verdict ?? 0
      const newVerdictLabel = mapVerdictToLabel(overallVerdictValue)
      const newOverallVerdictScore = Math.round(
        ((overallVerdictValue + 1) / 2) * 100,
      )

      setVerdictLabel(newVerdictLabel)
      setColors(getColorClasses(newVerdictLabel, false))
      setOverallVerdictScore(newOverallVerdictScore)
    }
  }, [stats])

  // Update colors when loading state changes
  useEffect(() => {
    if (isLoading) {
      setColors(getColorClasses(verdictLabel, true))
    }
  }, [isLoading, verdictLabel])

  const TRUNCATION_LIMIT = 180
  const isTruncated = (selectedText || '').length > TRUNCATION_LIMIT
  const displayText = isTruncated
    ? (selectedText || '').substring(0, TRUNCATION_LIMIT) + '... '
    : selectedText || ''
  const isRerunDisabled = phase < 2

  return (
    <div className="w-full h-screen bg-white text-gray-900 flex flex-col overflow-hidden">
      {/*Statement Area*/}
      <div
        className={`p-4 ${colors.statement} w-full flex flex-col items-center justify-center space-y-1`}
      >
        <div className="text-center w-full leading-relaxed">
          <p className="text-[13.5px] font-medium text-white/90">
            <span className="italic mr-1">"{displayText}"</span>
            <span className="inline-flex items-center whitespace-nowrap">
              {isTruncated && (
                <>
                  <span
                    onClick={() => setIsClaimOpened(true)}
                    className="underline text-white/80 hover:text-white cursor-pointer transition-colors text-[13px]"
                  >
                    View full
                  </span>
                  <span className="mx-1.5 opacity-30 text-white">|</span>
                </>
              )}
              <span
                onClick={() => setIsClaimEditorOpen(true)}
                className="underline text-white/80 hover:text-white cursor-pointer transition-colors text-[13px]"
              >
                Edit
              </span>
            </span>
          </p>
        </div>
        <p className="text-xs font-semibold tracking-wider text-white/40">
          Statement
        </p>
      </div>

      {/*Verdict/Summary Area*/}
      <div className="flex border-b-3 border-black/20">
        {isLoading ? (
          <div className="flex items-center justify-center w-full p-8">
            <div className="flex flex-col items-center gap-2">
              <Spinner size={40} />
              <p className="text-sm text-gray-500 animate-pulse">
                Analyzing claim...
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="p-1 space-y-1 w-2/3">
              <div className="flex flex-col items-center w-full mt-1">
                <span
                  className={`font-bold text-3xl text-black mb-0 ${colors.textColor}`}
                >
                  {isStatsLoading ? (
                    <Skeleton width="3.5rem" height="2.5rem" />
                  ) : (
                    `${overallVerdictScore}%`
                  )}
                </span>
                <div className="flex items-center gap-1 text-[15px] font-semibold text-black/70">
                  <span>Overall Verdict</span>
                  <InfoCard
                    title="Overall Verdict"
                    definition="This is the final calculated truthfulness score, weighed across all gathered evidence."
                  />
                </div>
              </div>
              <BiasBar type="consistency" value={overallVerdictScore} />
              <div className="flex flex-row items-end justify-between p-1 w-full border-t-2 border-black/20 mt-2">
                {/* Truth Confidence */}
                <div className="flex flex-col items-center mt-0 flex-1">
                  <span className="font-semibold text-[22px] text-black mb-1">
                    {isStatsLoading ? (
                      <Skeleton width="2.5rem" height="2rem" />
                    ) : (
                      `${truthScore}%`
                    )}
                  </span>
                  <div className="relative flex flex-row items-center gap-1 text-[13px] text-black leading-tight">
                    <span>Truth</span>
                    <span className="absolute -right-4 -top-1">
                      <InfoCard
                        title="Consensus Score"
                        definition="Measures how much the different sources agree on the same facts. High means a strong consensus among journalists; low means the reporting is conflicting."
                      />
                    </span>
                  </div>
                  <span className="text-[13px] text-black mt-0">Consensus</span>
                </div>
                {/* Bias Divergence */}
                <div className="flex flex-col items-center mt-0 flex-1">
                  <span className="font-semibold text-[22px] text-black mb-1">
                    {isStatsLoading ? (
                      <Skeleton width="2.5rem" height="2rem" />
                    ) : (
                      `${biasDivergence}%`
                    )}
                  </span>
                  <div className="relative flex flex-row items-center gap-1 text-[13px] text-black leading-tight">
                    <span>Bias</span>
                    <span className="absolute -right-4 -top-1">
                      <InfoCard
                        title="Bias Divergence"
                        definition="Shows how much the news coverage comes from various political sides. High means multiple perspectives; low means sources are clustered on one side."
                      />
                    </span>
                  </div>
                  <span className="text-[13px] text-black mt-0">
                    Divergence
                  </span>
                </div>
                {/* Bias Consistency */}
                <div className="flex flex-col items-center mt-0 flex-1">
                  <span className="font-semibold text-[22px] text-black mb-1">
                    {isStatsLoading ? (
                      <Skeleton width="2.5rem" height="2rem" />
                    ) : (
                      `${biasConsistency}%`
                    )}
                  </span>
                  <div className="relative flex flex-row items-center gap-1 text-[13px] text-black leading-tight">
                    <span>Bias</span>
                    <span className="absolute -right-4 -top-1">
                      <InfoCard
                        title="Bias Consistency Scoring"
                        definition="Measures if reporting follows a predictable partisan pattern. High means sources are reporting based on their political background; low means they are following facts regardless of bias."
                      />
                    </span>
                  </div>
                  <span className="text-[13px] text-black mt-0">
                    Consistency
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center p-1 w-1/3 border-l-2 border-black/20 space-y-0">
              <img className="w-23 h-23 object-contain" src={colors.icon} />
              <p
                className={`m-0 text-sm -mt-1 font-bold italic ${colors.textColor}`}
              >
                {colors.label}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Articles Area */}
      <div
        className={`${colors.statement} text-white flex justify-between items-center pl-2 pr-1 py-2`}
      >
        <p className="font-bold text-[13px]">Supporting Articles</p>

        <div className="flex">
          <button
            onClick={handleRerun}
            disabled={isRerunDisabled}
            className="!bg-transparent !border-none !p-1 !rounded-full hover:opacity-60 hover:bg-white/10 transition-all duration-300 ease-in-out will-change-opacity flex items-center justify-center !outline-none focus:!ring-0 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:opacity-40 disabled:hover:bg-transparent disabled:pointer-events-none"
          >
            <RefreshCw
              size={17}
              strokeWidth={2.5}
              className={isRerunDisabled ? 'animate-spin' : ''}
              style={
                isRerunDisabled ? { animationDuration: '1.8s' } : undefined
              }
            />
          </button>
          <button
            onClick={() => setIsConfigOpen(!isConfigOpen)}
            className="!bg-transparent !border-none !p-1 !rounded-full opacity-100 hover:opacity-60 hover:bg-white/10 transition-all duration-300 ease-in-out will-change-opacity cursor-pointer flex items-center justify-center !outline-none focus:!ring-0"
          >
            <Settings size={17} />
          </button>
        </div>
      </div>

      {/* Filter bar outside colored area */}
      <FilterArea
        active={active}
        setActive={setActive}
        groupedItems={groupedItems}
        phase={phase}
        bgClass={colors.statement}
      />
      {/* Scrollable article list fills remaining space */}
      <div className="flex-1 bg-white min-h-0 p-0 overflow-hidden overflow-y-auto flex flex-col gap-0">
        {(() => {
          const Card = phase === 0 ? SearchResultCard : ArticleCard
          return displayItems.map((item, idx) =>
            phase === 0 ? (
              <Card key={item.doc_id || idx} searchHit={item} />
            ) : (
              <Card
                key={item.doc_id || idx}
                score={item}
                groupLength={displayItems.length}
                onArchive={!item.archived ? handleArchive : undefined}
                onUnarchive={item.archived ? handleUnarchive : undefined}
              />
            ),
          )
        })()}
      </div>
      {isConfigOpen && (
        <ConfigPopup onClose={() => setIsConfigOpen(false)} colors={colors} />
      )}
      {isClaimOpened && (
        <ClaimPopup
          selectedText={selectedText}
          onClose={() => setIsClaimOpened(false)}
          onEdit={() => {
            setIsClaimOpened(false)
            setIsClaimEditorOpen(true)
          }}
          colors={colors}
        />
      )}
      {isClaimEditorOpen && (
        <EditPopup
          selectedText={selectedText}
          onClose={() => setIsClaimEditorOpen(false)}
          colors={colors}
          MIN_CHARS={MIN_CHARS}
        />
      )}
    </div>
  )
}
