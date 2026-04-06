import { useState } from 'react'
import InfoCard from './InfoCard.jsx'
import {
  formatDate,
  formatSource,
  mapVerdictToLabel,
  verdictToTruthScore,
} from '../utils/scripts.js'
import { LoaderCircle } from 'lucide-react'
import { Archive, Undo2 } from 'lucide-react'
import { useEffect } from 'react'

export default function ArticleCard({
  score,
  groupLength,
  onArchive,
  onUnarchive,
}) {
  const verdictLabel = mapVerdictToLabel(score.verdict)
  const truthScore = verdictToTruthScore(score.verdict)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isFading, setIsFading] = useState(false)
  const [isArchiving, setIsArchiving] = useState(false)
  const [showArchive, setShowArchive] = useState(
    onArchive && !score.archived && isHovered && groupLength > 1,
  )
  const [showUnarchive, setShowUnarchive] = useState(
    onUnarchive && score.archived && isHovered,
  )

  const handleUrlClick = (e) => {
    e.stopPropagation()
    e.preventDefault()
    chrome.tabs.create({ url: score.url })
  }

  // Only allow archive if there is more than 1 evidence in the current group
  // Show archive/unarchive button only if hovered and allowed
  useEffect(() => {
    setShowArchive(onArchive && !score.archived && isHovered && !isArchiving)
    setShowUnarchive(onUnarchive && score.archived && isHovered)
  }, [onArchive, onUnarchive, score, isHovered, groupLength, isArchiving])

  // Fade-out using Tailwind only, keep logic separate
  const handleArchiveClick = (e) => {
    e.stopPropagation()
    setIsArchiving(true)
    setIsFading(true)
    setTimeout(() => {
      setIsFading(false)
      setIsArchiving(false)
      onArchive(score.id)
    }, 300)
  }
  // Fade-out and then unarchive
  const handleUnarchiveClick = (e) => {
    e.stopPropagation()
    setIsFading(true)
    setTimeout(() => {
      setIsFading(false)
      onUnarchive(score.id)
    }, 300)
  }

  return (
    <div
      className={`w-full border px-3 py-2 cursor-pointer transition-opacity duration-300 ${
        verdictLabel === 'true'
          ? 'border-l-4 border-l-green-500 hover:bg-green-100/60'
          : verdictLabel === 'fake'
            ? 'border-l-4 border-l-red-500 hover:bg-red-100/60'
            : 'border-l-4 border-l-yellow-500 hover:bg-yellow-100/60'
      } ${isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      onClick={() => setIsExpanded(!isExpanded)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/*Header with Icon and Title*/}
      <div className="flex flex-row items-center justify-between h-auto gap-2">
        <div className="flex-1 min-w-0">
          <p
            className={`text-sm font-bold text-gray-800 transition-all duration-300 ease-in-out ${!isExpanded ? 'line-clamp-3' : ''}`}
          >
            {formatSource(score.source)}:{' '}
            <span className="font-semibold overflow-ellipsis">
              "{score.title}"
            </span>
          </p>
        </div>
        {/* Archive/Unarchive Button */}
        {score.is_aggregated && (
          <div
            className="flex items-center justify-end"
            style={{ width: 40, minWidth: 40 }}
          >
            {groupLength > 1 && showArchive && !showUnarchive && (
              <button
                disabled={isArchiving}
                className="p-1 bg-transparent border-none shadow-none outline-none ring-0 focus:outline-none focus:ring-0 active:outline-none active:ring-0 text-gray-500 hover:text-red-600 transition-all duration-300 ease-in-out opacity-100 translate-x-0 pointer-events-auto"
                style={{
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  boxShadow: 'none',
                  pointerEvents: isArchiving ? 'none' : 'auto',
                  opacity: isArchiving ? 0.5 : 1,
                }}
                onClick={handleArchiveClick}
                title="Archive this article"
                aria-label="Archive"
                tabIndex={0}
              >
                <Archive size={18} />
              </button>
            )}
            {showUnarchive && !showArchive && (
              <button
                className="p-1 bg-transparent border-none shadow-none outline-none ring-0 focus:outline-none focus:ring-0 active:outline-none active:ring-0 text-gray-500 hover:text-green-600 transition-all duration-300 ease-in-out opacity-100 translate-x-0 pointer-events-auto"
                style={{
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  boxShadow: 'none',
                }}
                onClick={handleUnarchiveClick}
                title="Unarchive this article"
                aria-label="Unarchive"
                tabIndex={0}
              >
                <Undo2 size={18} />
              </button>
            )}
          </div>
        )}

        {/* Accordion Chevron */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className={`size-5 text-gray-600 transition-transform duration-300 shrink-0 ${isExpanded ? 'rotate-180' : ''}`}
        >
          <path
            fillRule="evenodd"
            d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        {/*Remarks Section*/}
        <div className="mb-3 mt-3 flex flex-row gap-4">
          <div className="flex flex-col items-center gap-0">
            {verdictLabel === 'true' ? (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-9 text-green-500"
                >
                  <path
                    fill-rule="evenodd"
                    d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                    clip-rule="evenodd"
                  />
                </svg>
                <p className="italic font-bold text-green-400 text-[10px] -mt-1">
                  Support
                </p>
              </>
            ) : verdictLabel === 'fake' ? (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-9 text-red-500"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="italic font-bold text-red-400 text-[10px] -mt-1">
                  Refute
                </p>
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-9 text-yellow-500"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm3.75 9.75a.75.75 0 0 0 0-1.5H8.25a.75.75 0 0 0 0 1.5h7.5Z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="italic font-bold text-yellow-400 text-[10px] -mt-1">
                  Neutral
                </p>
              </>
            )}
          </div>
          <div>
            <p className="text-gray-700 text-sm">
              <span className="font-bold">Published Date:</span>{' '}
              <span>{formatDate(score.publish_date)}</span>
            </p>

            <p
              className={`text-sm text-gray-700 ${score.remarks ? '' : 'flex items-center gap-1'}`}
            >
              <span className="font-bold">Remarks:</span>{' '}
              {score.remarks ? (
                score.remarks
              ) : (
                <LoaderCircle
                  className="animate-spin"
                  style={{ animationDuration: '4s' }}
                />
              )}
            </p>
          </div>
        </div>

        {/*Divider*/}
        <div className="border-t-2 border-gray-400 mb-2"></div>

        {/*Footer with Verdict Bar and Link*/}
        <div className="flex items-center justify-between gap-4 py-1">
          <div className="flex gap-2 flex-1">
            <div className="flex items-center gap-1">
              <span className="text-[12px] font-semibold text-gray-800 whitespace-nowrap">
                Verdict
              </span>
              <InfoCard
                title="Verdict"
                definition="Indicates this article's assessed support strength for the statement on a 0–100 scale; higher values lean supportive (green), lower values lean refuting (red)."
              />
              <span className="text-[10px] font-semibold text-gray-800">:</span>
            </div>
            <div className="w-full flex flex-col gap-0">
              <div className="flex items-center -mt-2.5 justify-between text-[7px] text-gray-600 font-bold flex-1">
                <span>Sup</span>
                <span>Neu</span>
                <span>Ref</span>
              </div>
              <div className="h-2 flex-1 bg-red-800 rounded-full overflow-hidden relative">
                <div
                  className="h-3.5 bg-green-700 rounded-full"
                  style={{ width: `${truthScore}%` }}
                ></div>
              </div>
            </div>
            <span className="text-[12px] font-bold text-gray-800 whitespace-nowrap">
              {truthScore}%
            </span>
          </div>
          <a
            href="#"
            className="text-xs text-blue-600 underline whitespace-nowrap"
            onClick={handleUrlClick}
          >
            [Link to Article]
          </a>
        </div>
      </div>
    </div>
  )
}
