function Skeleton({ width = '2.5rem', height = '2.25rem' }) {
  return (
    <span
      className="inline-block bg-gray-200 rounded animate-pulse"
      style={{ width, height }}
    />
  )
}

export default Skeleton
