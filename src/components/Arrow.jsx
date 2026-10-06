const ROTATE = { right: 0, down: 90, left: 180, up: -90, ne: -45 }

// One stroke arrow used everywhere, so we never depend on font arrow glyphs.
export default function Arrow({ dir = 'right', size = 14 }) {
  return (
    <svg
      className="arrow"
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="square"
      style={{ '--r': `${ROTATE[dir]}deg` }}
    >
      <path d="M2 8h11M9 4l4 4-4 4" />
    </svg>
  )
}
