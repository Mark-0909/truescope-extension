import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 flex items-center justify-center p-6">
      <div className="max-w-xl w-full">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Tailwind v4 + Vite + React</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          You’re all set. Tailwind utilities should work out of the box.
        </p>

        <div className="flex items-center gap-3">
          <button
            className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 font-medium shadow-sm"
            onClick={() => setCount((c) => c + 1)}
          >
            Count: {count}
          </button>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Try editing <code className="font-mono">src/App.jsx</code>
          </span>
        </div>
      </div>
    </div>
  )
}

export default App
