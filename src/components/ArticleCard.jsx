import { useState } from 'react';
import InfoCard from './InfoCard.jsx';

export default function ArticleCard({oddEven, support, source, title, Remarks, VerdictScore, ArticleLink}) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (

        <div 
            className={`w-full shadow-md p-2 mb-0 cursor-pointer transition-all duration-200 ${oddEven === 'odd' ? 'bg-gray-200/30 hover:bg-gray-200/50 hover:shadow-lg' : 'bg-gray-300 hover:bg-gray-300/70 hover:shadow-lg'}`}
            onClick={() => setIsExpanded(!isExpanded)}
        >
        
        {/*Header with Icon and Title*/}
        <div className="flex flex-row items-center gap-2">
            <div className="flex flex-col items-center gap-0">
                {support === 'support' ? (
                    <>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-9 text-green-600">
                                <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clip-rule="evenodd" />
                        </svg>
                        <p className="italic font-bold text-green-600 text-[10px] -mt-1">Support</p>
                    </>
                ) : support === 'refute' ? (
                    <>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-9 text-red-600">
                            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" clipRule="evenodd" />
                        </svg>
                        <p className="italic font-bold text-red-600 text-[10px] -mt-1">Refute</p>
                    </>
                ) : (
                    <>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-9 text-yellow-600">
                            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm3.75 9.75a.75.75 0 0 0 0-1.5H8.25a.75.75 0 0 0 0 1.5h7.5Z" clipRule="evenodd" />
                        </svg>
                        <p className="italic font-bold text-yellow-600 text-[10px] -mt-1">Neutral</p>
                    </>
                )}

            </div>
            <div className="flex-1">
                <p className="text-sm font-bold text-gray-800">{source}: <span className="font-semibold">"{title}"</span></p>
            </div>
        </div>

        <div 
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
        >
            {/*Remarks Section*/}
            <div className="mb-3 mt-3">
                <p className="text-xs text-gray-700"><span className="font-bold">Remarks:</span> {Remarks}</p>
            </div>

            {/*Divider*/}
            <div className="border-t-2 border-gray-400 mb-2"></div>

            {/*Footer with Verdict Bar and Link*/}
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-1">
                    <span className="text-xs font-semibold text-gray-800">Verdict<InfoCard title="Verdict" definition="Indicates this article's assessed support strength for the statement on a 0–100 scale; higher leans supportive, lower leans refuting." />:</span>
                    <div className="h-3 flex-1 bg-red-800 rounded-full overflow-hidden relative">
                        <div className="h-3 bg-green-600 rounded-full" style={{ width: `${VerdictScore}%` }}></div>
                    </div>
                    <span className="text-xs font-bold text-gray-800">{VerdictScore}%</span>
                </div>
                <a href="#" className="text-xs text-blue-600 underline whitespace-nowrap" onClick={(e) => e.stopPropagation()}>[Link to Article]</a>
            </div>
        </div>

        </div>
    );

}