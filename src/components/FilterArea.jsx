import { useEffect } from 'react'
import { useState } from 'react'
import { capitalize, getItemsFromFilter } from '../utils/scripts'

export default function FilterArea({
  active,
  setActive,
  groupedItems,
  phase,
  bgClass,
}) {
  // Dynamic filter
  // If phase 0 or 1, we show filters Support, Neutral, Refute
  // If phase 2, we show filters Relevant, Supplementary, Archived
  const [baseFilters, setBaseFilters] = useState(
    Object.keys(groupedItems.supplementary),
  )

  // Layered filter, to be used during phase 2
  // Only shows if current baseFilter is Supplementary
  const [layeredFilters, setLayeredFilters] = useState(
    Object.keys(groupedItems.supplementary),
  )

  useEffect(() => {
    if (phase <= 1) {
      setBaseFilters(Object.keys(groupedItems.supplementary))
    } else {
      setBaseFilters(Object.keys(groupedItems))
    }
  }, [phase])

  const handleActiveClick = (newActive) => {
    if (newActive === 'supplementary') {
      newActive = 'all'
    }

    setActive(newActive)
  }

  // Centralized filter button rendering
  const FilterButton = ({ filter, isActive, onClick, showAllCount }) => {
    const count = showAllCount
      ? getItemsFromFilter('all', groupedItems).length
      : getItemsFromFilter(filter, groupedItems).length
    if (count === 0) return null
    return (
      <span
        key={filter}
        onClick={onClick}
        className={`
          cursor-pointer
          px-2 py-1
          text-[10px] font-semibold
          rounded-2xl
          transition-all duration-200
          ${
            isActive
              ? `bg-white/95 text-[#5A3200] shadow-sm`
              : `bg-white/20 text-white hover:bg-white/30`
          }
        `}
        style={{ userSelect: 'none' }}
      >
        {capitalize(filter)} {count}
      </span>
    )
  }

  return (
    <>
      <div className={`flex gap-1 px-1 pb-2 ${bgClass || ''}`}>
        {baseFilters.map((filter) => {
          let isActive = active === filter
          if (filter === 'supplementary' && layeredFilters.includes(active)) {
            isActive = true
          }
          return (
            <FilterButton
              filter={filter}
              isActive={isActive}
              onClick={() => handleActiveClick(filter)}
              showAllCount={filter === 'supplementary'}
            />
          )
        })}
      </div>
      {layeredFilters.includes(active) && phase === 2 && (
        <div className={`flex gap-1 px-1 pb-2 ${bgClass || ''}`}>
          {layeredFilters.map((filter) => (
            <FilterButton
              filter={filter}
              isActive={active === filter}
              onClick={() => setActive(filter)}
            />
          ))}
        </div>
      )}
    </>
  )
}
