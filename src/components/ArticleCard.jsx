import { useState } from 'react';
import InfoCard from './InfoCard.jsx';

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date)) return dateString;
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

export default function ArticleCard({oddEven, support, source, title, Remarks, VerdictScore, ArticleLink, publishedDate}) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (

        <div 
            className={`w-full border px-3 py-2 cursor-pointer transition-colors duration-200 ${
                support === 'support'
                    ? '{/*bg-green-50*/} border-l-4 border-l-green-500 hover:bg-green-100/60'
                    : support === 'refute'
                        ? '{/*bg-red-50*/} border-l-4 border-l-red-500 hover:bg-red-100/60'
                        : '{/*bg-yellow-50*/} border-l-4 border-l-yellow-500 hover:bg-yellow-100/60'
            }`}
            onClick={() => setIsExpanded(!isExpanded)}
        >
        
        {/*Header with Icon and Title*/}
        <div className="flex flex-row items-center justify-between h-12">
            <div className="flex flex-row items-center gap-2 flex-1">

                <div className="flex-1">
                    <p className="text-sm font-bold text-gray-800">{source}: <span className="font-semibold">"{title}"</span></p>
                </div>
            </div>
            {/* Accordion Chevron */}
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="currentColor" 
                className={`size-5 text-gray-600 transition-transform duration-300 shrink-0 ${isExpanded ? 'rotate-180' : ''}`}
            >
                <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z" clipRule="evenodd" />
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
                    {support === 'support' ? (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-9 text-green-500">
                                    <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clip-rule="evenodd" />
                            </svg>
                            <p className="italic font-bold text-green-400 text-[10px] -mt-1">Support</p>
                        </>
                    ) : support === 'refute' ? (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-9 text-red-500">
                                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" clipRule="evenodd" />
                            </svg>
                            <p className="italic font-bold text-red-400 text-[10px] -mt-1">Refute</p>
                        </>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-9 text-yellow-500">
                                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm3.75 9.75a.75.75 0 0 0 0-1.5H8.25a.75.75 0 0 0 0 1.5h7.5Z" clipRule="evenodd" />
                            </svg>
                            <p className="italic font-bold text-yellow-400 text-[10px] -mt-1">Neutral</p>
                        </>
                    )}

                </div>
                <div>
                <p className='text-gray-700 text-sm'><span className='font-bold'>Published Date:</span> <span>{formatDate(publishedDate)}</span></p>
                <p className="text-sm text-gray-700"><span className="font-bold">Remarks:</span> {Remarks}</p>
                </div>
            </div>

            {/*Divider*/}
            <div className="border-t-2 border-gray-400 mb-2"></div>

            {/*Footer with Verdict Bar and Link*/}
            <div className="flex items-center justify-between gap-4 py-1">
                <div className="flex gap-2 flex-1">
                    <div className="flex items-center gap-1">
                        <span className="text-[12px] font-semibold text-gray-800 whitespace-nowrap">Verdict</span>
                        <InfoCard title="Verdict" definition="Indicates this article's assessed support strength for the statement on a 0–100 scale; higher values lean supportive (green), lower values lean refuting (red)." />
                        <span className="text-[10px] font-semibold text-gray-800">:</span>
                    </div>
                    <div className='w-full flex flex-col gap-0'>
                        <div className="flex items-center -mt-2.5 justify-between text-[7px] text-gray-600 font-bold flex-1">
                            <span>Sup</span>
                            <span>Neu</span>
                            <span>Ref</span>
                        </div>
                        <div className="h-2 flex-1 bg-red-800 rounded-full overflow-hidden relative">
                            <div className="h-3.5 bg-green-700 rounded-full" style={{ width: `${VerdictScore}%` }}></div>
                        </div>
                    </div>
                    <span className="text-[12px] font-bold text-gray-800 whitespace-nowrap">{VerdictScore}%</span>
                </div>
                <a href="#" className="text-xs text-blue-600 underline whitespace-nowrap" onClick={(e) => e.stopPropagation()}>[Link to Article]</a>
            </div>
        </div>

        </div>
    );

}