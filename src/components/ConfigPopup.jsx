import { X } from 'lucide-react'

export default function ConfigPopup({
  onClose,
  colors,
  maxEvidence,
  includeFactChecks,
  onUpdate,
}) {
  // Simplified Color Map in ConfigPopup.jsx
  const colorMap = {
    'bg-red-900': '#7f1d1d',
    'bg-red-500': '#ef4444',
    'bg-green-900': '#14532d',
    'bg-green-500': '#22c55e',
    'bg-yellow-800': '#854d0e',
    'bg-yellow-500': '#eab308',
    'bg-gray-700': '#374151',
    'bg-gray-500': '#6b7280',
  }

  // Try to find a hex in the string (bg-[#...]) or use the map, fallback to indigo
  const themeColorMatch = colors?.statement?.match(/\[#([0-9a-fA-F]{6})\]/)
  const themeHex = themeColorMatch
    ? `#${themeColorMatch[1]}`
    : colorMap[colors?.statement] || '#6366F1'

  const themeClass = colors?.statement || '!bg-[#6366F1]'

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[100] backdrop-blur-[1px]">
      <div className="bg-white rounded-2xl shadow-2xl w-[350px] overflow-hidden flex flex-col pt-0 border border-gray-100">
        {/* Header */}
        <div className="flex justify-between items-center pl-6 pr-3 py-3">
          <h2 className="text-[18px] font-bold text-[#1E293B]">
            Display Settings
          </h2>
          <button
            onClick={onClose}
            className="!p-1 hover:bg-gray-100 rounded-full transition-colors cursor-pointer text-gray-400 hover:text-gray-600 !outline-none focus:!ring-0 !border-none"
            style={{ backgroundColor: 'transparent' }}
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        <div className="px-6 py-3 space-y-6">
          {/* Max Evidence Section */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[15px] font-semibold text-[#334155] opacity-80">
                Max Evidence to Show
              </span>
              <span
                className="text-[18px] font-bold"
                style={{ color: themeHex }}
              >
                {maxEvidence}
              </span>
            </div>

            <div className="relative pt-1 px-1">
              <input
                type="range"
                min="1"
                max="10"
                value={maxEvidence}
                onChange={(e) =>
                  onUpdate({ maxEvidence: parseInt(e.target.value) })
                }
                className="w-full h-1.5 bg-[#E5E7EB] rounded-lg appearance-none cursor-pointer"
                style={{ accentColor: themeHex }}
              />
              <div className="relative h-4 mt-1 px-0.5">
                <span className="absolute left-0 text-[10px] text-gray-400">
                  1
                </span>
                <span className="absolute right-0 text-[10px] text-gray-400">
                  10
                </span>
              </div>
            </div>
          </div>

          {/* Toggle Section */}
          <div className="bg-[#F8FAFC]/90 rounded-xl  flex items-center justify-between border border-gray-50 p-2">
            <div className="space-y-0.5">
              <p className="text-[15px] font-bold text-[#334155]">
                Include Fact-Check Articles
              </p>
              <p className="text-[12px] text-gray-500 font-medium">
                Show articles from fact-checking sources
              </p>
            </div>

            <button
              onClick={() =>
                onUpdate({ includeFactChecks: !includeFactChecks })
              }
              className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer !outline-none focus:!ring-0 !border-none !p-0"
              style={{
                backgroundColor: includeFactChecks ? themeHex : '#CBD5E1',
              }}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  includeFactChecks ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
