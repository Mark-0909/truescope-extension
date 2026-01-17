import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="fixed top-0 right-0 h-screen w-1/4 max-w-md bg-white text-gray-900 shadow-2xl z-50 flex flex-col rounded-l-2xl">
      
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-red-600 rounded-tl-2xl">
        <h2 className="text-lg font-bold text-white">TrueScope</h2>

        <button
          aria-label="Close panel"
          className="text-white text-xl font-bold hover:text-red-300 focus:outline-none transition p-0 rounded-none"
          style={{ backgroundColor: 'transparent', border: 'none', padding: 0, borderRadius: 0 }}
        >
          ✕
        </button>

      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Result cards go here */}
      </div>

    </div>


  )
}

export default App
