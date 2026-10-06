import images from '../data/images.json'

// Responsive AVIF/WebP with intrinsic width/height so layout never shifts.
// Widths and ratios come from the manifest written by scripts/optimize-images.mjs.
export default function Picture({ name, alt, sizes = '100vw', eager = false, className }) {
  const img = images[name]
  const { widths, ratio } = img
  const max = widths[widths.length - 1]
  const set = (ext) => widths.map((w) => `/img/${name}-${w}.${ext} ${w}w`).join(', ')

  return (
    <picture>
      <source type="image/avif" srcSet={set('avif')} sizes={sizes} />
      <source type="image/webp" srcSet={set('webp')} sizes={sizes} />
      <img
        src={`/img/${name}-${max}.webp`}
        srcSet={set('webp')}
        sizes={sizes}
        width={max}
        height={Math.round(max * ratio)}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        fetchpriority={eager ? 'high' : undefined}
        className={className}
      />
    </picture>
  )
}
