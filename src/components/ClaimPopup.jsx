import { X, Pencil } from 'lucide-react'

export default function ClaimPopup({ selectedText, onClose, onEdit, colors }) {
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

  const themeColorMatch = colors?.statement?.match(/\[#([0-9a-fA-F]{6})\]/)
  const themeHex = themeColorMatch
    ? `#${themeColorMatch[1]}`
    : colorMap[colors?.statement] || '#6366F1'

  const handleCopy = () => {
    if (selectedText) {
      navigator.clipboard
        .writeText(selectedText)
        .then(() => console.log('Copied'))
        .catch((err) => console.error(err))
    }
  }

  return (
    <div className="fixed inset-0 !bg-black/40 flex items-center justify-center z-[150] backdrop-blur-[2px] transition-all duration-300">
      <div className="!bg-white rounded-2xl shadow-2xl w-[340px] max-h-[85vh] overflow-hidden flex flex-col border border-gray-100 transition-all duration-300">
        {/* Header */}
        <div className="flex justify-between items-center pl-6 pr-3 py-2.5 border-b border-gray-50/50">
          <h2 className="text-[18px] font-bold text-[#1E293B]">
            Statement Being Analyzed
          </h2>
          <button
            onClick={onClose}
            className="!p-1 hover:bg-gray-100 rounded-full transition-all duration-200 cursor-pointer text-gray-400 hover:text-gray-900 !outline-none focus:!ring-0 !border-none hover:rotate-90"
            style={{ backgroundColor: 'transparent' }}
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Content Area */}
        <div className="px-6 pb-3 pt-2 overflow-y-auto">
          <p className="text-[16px] leading-relaxed font-semibold italic text-gray-700 text-center">
            "{selectedText}"
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 flex items-center justify-between mt-auto !bg-gray-50/50 border-t border-gray-50">
          <button
            onClick={onEdit}
            className="flex items-center gap-2 px-5 py-2.5 text-[14px] font-bold text-gray-600 !bg-white hover:!bg-gray-100 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-95 !border !border-gray-200 !outline-none"
          >
            <Pencil size={18} strokeWidth={2.5} />
            Edit
          </button>

          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="px-6 py-2.5 text-[14px] font-bold text-gray-600 !bg-white hover:!bg-gray-100 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-95 !border !border-gray-200 !outline-none"
            >
              Copy
            </button>
            <button
              onClick={onClose}
              className="px-7 py-2.5 text-white text-[14px] font-bold rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-95 hover:shadow-lg hover:brightness-110 !outline-none"
              style={{
                backgroundColor: themeHex,
                boxShadow: `0 10px 15px -3px ${themeHex}33`,
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
