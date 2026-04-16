import { X, RefreshCw } from 'lucide-react'
import { useState } from 'react'

export default function EditPopup({
  selectedText,
  onClose,
  colors,
  MIN_CHARS,
}) {
  const [editedText, setEditedText] = useState(selectedText || '')
  const isValid = editedText.trim().length >= MIN_CHARS

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

  const handleSave = () => {
    if (!isValid) return

    if (
      typeof chrome !== 'undefined' &&
      chrome.storage &&
      chrome.storage.local
    ) {
      chrome.storage.local.set({ selectedText: editedText }, () => {
        console.log('Claim updated:', editedText)
        onClose()
      })
    } else {
      console.warn('Chrome storage not available')
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 !bg-black/40 flex items-center justify-center z-[150] backdrop-blur-[2px] transition-all duration-300">
      <div className="!bg-white rounded-2xl shadow-2xl w-[340px] overflow-hidden flex flex-col border border-gray-100 transition-all duration-300">
        {/* Header */}
        <div className="flex justify-between items-center pl-6 pr-3 py-2.5 border-b border-gray-50/50">
          <h2 className="text-[18px] font-bold text-[#1E293B]">
            Edit Statement
          </h2>
          <button
            onClick={onClose}
            className="!p-1 hover:bg-gray-100 rounded-full transition-all duration-200 cursor-pointer text-gray-400 hover:text-gray-900 !outline-none focus:!ring-0 !border-none hover:rotate-90"
            style={{ backgroundColor: 'transparent' }}
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-2">
          <textarea
            className="w-full h-44 p-4 text-[15px] font-medium text-gray-700 !bg-[#F8FAFC] border border-gray-100 rounded-[20px] !outline-none focus:ring-2 transition-all resize-none shadow-inner"
            style={{ focusRingColor: themeHex }}
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            placeholder="Type your statement here..."
          />
        </div>

        {/* Footer */}
        <div className="px-6 py-4 flex items-center justify-end gap-3 !bg-gray-50/50 border-t border-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-[14px] font-bold text-gray-500 !bg-white hover:!bg-gray-100 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-95 !outline-none"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!isValid}
            className={`flex items-center gap-2 px-6 py-2.5 text-white text-[14px] font-bold rounded-xl transition-all duration-200 transform !outline-none ${
              isValid
                ? 'hover:scale-[1.02] active:scale-95 shadow-xl hover:brightness-110 cursor-pointer'
                : 'opacity-40 grayscale cursor-not-allowed'
            }`}
            style={{
              backgroundColor: themeHex,
              boxShadow: isValid ? `0 10px 15px -3px ${themeHex}33` : 'none',
            }}
          >
            <RefreshCw size={18} strokeWidth={2.5} />
            Rerun Analysis
          </button>
        </div>
      </div>
    </div>
  )
}
