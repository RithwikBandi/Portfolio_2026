// Browser-style frame that shows a project preview at its full, uncropped size.
export default function Frame({ host, children, caption, tt = false, plate }) {
  return (
    <figure className={`frame${tt ? ' frame--tt' : ''}`} data-plate={plate}>
      <div className="frame__bar" aria-hidden="true">
        <span className="frame__dots"><i /><i /><i /></span>
        <span className="frame__url mono">{host || 'local build'}</span>
      </div>
      <div className="frame__body">{children}</div>
      {caption && <figcaption className="frame__cap mono">{caption}</figcaption>}
    </figure>
  )
}
