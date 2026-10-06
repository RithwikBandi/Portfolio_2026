// Original bat emblem: one half-path mirrored, so it is symmetric and tiny.
const HALF = 'M100 36L103 20L109 10L111 30L148 24L198 46L176 48L166 62L152 56L142 72L128 64L118 82L108 76L100 98Z'

export function BatPaths() {
  return (
    <>
      <path d={HALF} />
      <path d={HALF} transform="matrix(-1 0 0 1 200 0)" />
    </>
  )
}

export default function BatMark({ size = 34, className }) {
  return (
    <svg className={className} width={size} height={size / 2} viewBox="0 0 200 100" fill="currentColor" aria-hidden="true">
      <BatPaths />
    </svg>
  )
}
