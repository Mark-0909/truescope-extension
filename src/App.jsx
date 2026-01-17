import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="fixed top-0 right-0 h-screen w-1/4 max-w-md bg-white/70 text-gray-900 shadow-2xl z-50 flex flex-col rounded-l-md">
      
      {/* Header */}
        <div className="relative flex items-center justify-between px-3 py-2 bg-red-500 rounded-tl-md">
          <h2 className="text-lg font-bold text-white">TrueScope</h2>

            <button
              type="button"
              aria-label="Close panel"
              className="absolute -right-2 top-1/2 -translate-y-1/2 text-white text-xl font-bold hover:text-red-300 focus:outline-none transition p-2 rounded-md focus:ring-0"
              style={{ backgroundColor: 'transparent', border: 'none', outline: 'none', boxShadow: 'none' }}
            >
              ✕
            </button>
      </div>

      {/*Statement Area*/}
      <div className="flex flex-col items-center justify-center p-1 space-y-0 w-full bg-red-900">
        <p className="text-sm font-semibold italic text-white/80">"P20 rice distributed nationwide next week."</p>
        <p className="text-xs font-semibold bold text-white/50">Statement</p>
      </div>

      {/*Verdict/Summary Area*/}
      <div className='flex border-b-2 border-black/20'>
        <div className='flex flex-col items-center justify-center p-1 w-1/3 border-r-2 border-black/20 space-y-0'>
          <img className='w-20 h-20 object-contain' src="./src/assets/Fake_Icon.png" />
          <p className='m-0 text-sm -mt-1 font-bold italic text-red-950'>Likely Fake</p>
        </div>
        <div className=''>

        </div>
      </div>

      {/* Articles Area */}
      <div className="flex-1 min-h-0 p-4 overflow-y-auto flex items-center justify-center">
        {/* Article cards go here */}
      </div>

    </div>


  )
}

export default App
