import { useState, useRef } from 'react';

export default function InfoCard({title, definition}) {
    const [isHovered, setIsHovered] = useState(false);
    const iconRef = useRef(null);
    const [tooltipPos, setTooltipPos] = useState({});
    const [showOnLeft, setShowOnLeft] = useState(false);

    const handleMouseEnter = () => {
        if (iconRef.current) {
            const rect = iconRef.current.getBoundingClientRect();
            const tooltipWidth = 300; // max-w-xs is roughly 300px
            const spaceOnRight = window.innerWidth - rect.right;
            const spaceOnLeft = rect.left;
            
            // Decide whether to show on left or right
            const shouldShowOnLeft = spaceOnRight < tooltipWidth && spaceOnLeft > spaceOnRight;
            setShowOnLeft(shouldShowOnLeft);
            
            if (shouldShowOnLeft) {
                // Position on the left
                setTooltipPos({
                    top: rect.top + rect.height / 2,
                    right: window.innerWidth - rect.left + 8
                });
            } else {
                // Position on the right
                setTooltipPos({
                    top: rect.top + rect.height / 2,
                    left: rect.right + 8
                });
            }
        }
        setIsHovered(true);
    };

    return(
        <div className="inline-flex items-center" onMouseEnter={handleMouseEnter} onMouseLeave={() => setIsHovered(false)} ref={iconRef}>
            <div className="w-3 h-3 rounded-full border-2 border-gray-500 flex items-center justify-center cursor-help hover:border-gray-700 transition-colors">
                <span className="text-[8px] font-bold text-gray-600">i</span>
            </div>

            {isHovered && (
                <div 
                    style={{
                        position: 'fixed', 
                        top: tooltipPos.top, 
                        ...(showOnLeft ? { right: tooltipPos.right } : { left: tooltipPos.left }),
                        transform: 'translateY(-50%)'
                    }} 
                    className="bg-gray-900 text-white px-3 py-2 rounded shadow-lg text-xs z-50 pointer-events-none max-w-xs"
                >
                    <p className="font-semibold">{title}</p>
                    {definition && <p className="text-gray-300 text-[11px] mt-1">{definition}</p>}
                </div>
            )}
        </div>
    )
}
    