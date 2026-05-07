import { useState } from 'react'
import { formatDate, formatSource } from '../utils/scripts.js'

export default function SearchResultCard({ searchHit }) {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleUrlClick = (e) => {
    e.stopPropagation()
    e.preventDefault()
    window.open(searchHit.url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div
      className="w-full border px-3 py-2 cursor-pointer transition-colors duration-200 border-l-4 border-l-gray-500 hover:bg-gray-100/60"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/*Header with Icon and Title*/}
      <div className="flex flex-row items-center justify-between h-auto">
        <div className="flex flex-row items-center gap-2 flex-1">
          <div className="flex-1">
            <p
              className={`text-sm font-bold text-gray-800 transition-all duration-300 ease-in-out ${!isExpanded ? 'line-clamp-3' : ''}`}
            >
              {formatSource(searchHit.source)}:{' '}
              <span className="font-semibold overflow-ellipsis">
                "{searchHit.title}"
              </span>
            </p>
          </div>
        </div>
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
        <div className="mb-3 mt-3 flex flex-row gap-4">
          <div>
            <p className="text-gray-700 text-sm">
              <span className="font-bold">Published Date:</span>{' '}
              <span>{formatDate(searchHit.publish_date)}</span>
            </p>
          </div>
        </div>

        {/*Divider*/}
        <div className="border-t-2 border-gray-400 mb-2"></div>

        {/*Footer with Verdict Bar and Link*/}
        <div className="flex items-center justify-end py-1">
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
