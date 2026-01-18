import { useState } from 'react'
import BiasBar from './components/BiasBar.jsx'
import ArticleCard from './components/ArticleCard.jsx' 


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
          <img className='w-20 h-20 object-contain' src="/src/assets/Fake_Icon.png" />
          <p className='m-0 text-sm -mt-1 font-bold italic text-red-900'>Likely Fake</p>
        </div>
        <div className='p-2 space-y-1 w-2/3'>
          <p className='text-xs font-semibold text-black/70'>Truth Confidence Score: <span className='font-bold text-xs'>49%</span></p>
          <p className='text-xs font-semibold text-black/70'>Bias Consistency Scoring:</p>
          <BiasBar type="consistency" value={20} />
          <p className='text-xs font-semibold text-black/70'>Bias Divergence: <span className='font-bold text-xs'>15%</span></p>
        </div>
      </div>

      {/* Articles Area */}
      <div className='bg-black/30 '>
        <p className='px-2 py-1 font-bold text-[13px]'>Articles</p>
      </div>
      <div className="flex-1 min-h-0 p-2 overflow-y-auto flex flex-col gap-0">
        {/* Article cards go here for loop...Need to add details from json*/}
        <ArticleCard />
        <ArticleCard />
        <ArticleCard />
        <ArticleCard />
        <ArticleCard />
        <ArticleCard />
      </div>

    </div>


  )
}

export default App
