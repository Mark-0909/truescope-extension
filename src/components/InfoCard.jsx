import { useState, useRef } from 'react';

export default function InfoCard({title, definition}) {
    const [isHovered, setIsHovered] = useState(false);
    const iconRef = useRef(null);
    const [tooltipPos, setTooltipPos] = useState({});

    const handleMouseEnter = () => {
        if (iconRef.current) {
            const rect = iconRef.current.getBoundingClientRect();
            setTooltipPos({
                top: rect.top + rect.height / 2,
                right: window.innerWidth - rect.left + 8
            });
        }
        setIsHovered(true);
    };

    return(
        <div className="inline-flex items-center" onMouseEnter={handleMouseEnter} onMouseLeave={() => setIsHovered(false)} ref={iconRef}>
            <div className="w-4 h-4 rounded-full border-2 border-gray-500 flex items-center justify-center cursor-help hover:border-gray-700 transition-colors">
                <span className="text-[10px] font-bold text-gray-600">i</span>
            </div>

            {isHovered && (
                <div style={{position: 'fixed', top: tooltipPos.top, right: tooltipPos.right, transform: 'translateY(-50%)'}} className="bg-gray-900 text-white px-3 py-2 rounded shadow-lg text-xs z-50 pointer-events-none max-w-xs">
                    <p className="font-semibold">{title}</p>
                    {definition && <p className="text-gray-300 text-[11px] mt-1">{definition}</p>}
                </div>
            )}
        </div>
    )
}
    