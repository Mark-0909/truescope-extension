import React from "react";

export default function FilterArea({ active, setActive, filters, bgClass }) {
  return (
    <div className={`flex gap-1 px-1 pb-2 ${bgClass || ""}`}>
      {filters.map((item) => {
        const isActive = active === item.label;

        return (
          <span
            key={item.label}
            onClick={() => setActive(item.label)}
            className={`
              cursor-pointer
              px-2 py-1
              text-[10px] font-semibold
              rounded-2xl
              transition-all duration-200
              
              ${
                isActive
                  ? `
                    bg-white/95
                    text-[#5A3200]
                    shadow-sm
                  `
                  : `
                    bg-white/20
                    text-white
                    hover:bg-white/30
                  `
              }
            `}
            style={{ userSelect: "none" }}
          >
            {item.label} ({item.count})
          </span>
        );
      })}
    </div>
  );
}
