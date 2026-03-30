import { useState } from 'react'

interface StarRatingProps {
  value: number
  onChange: (val: number) => void
  size?: number
}

export function StarRating({ value, onChange, size = 28 }: StarRatingProps) {
  const [hover, setHover] = useState(0)

  return (
    <div className="stars-row">
      {[1, 2, 3, 4, 5].map(i => (
        <button
          key={i}
          type="button"
          className={`star-btn ${i <= (hover || value) ? 'filled' : ''}`}
          style={{ fontSize: size }}
          onClick={() => onChange(i)}
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(0)}
        >
          ★
        </button>
      ))}
    </div>
  )
}
