// Architecture as a short left-to-right (or top-to-bottom) chain.
export default function Flow({ nodes }) {
  return (
    <ol className="flow">
      {nodes.map((n, i) => (
        <li key={n.title} className="flow__node">
          <span className="flow__n mono">{String(i + 1).padStart(2, '0')}</span>
          <strong>{n.title}</strong>
          <span className="flow__sub mono">{n.sub}</span>
        </li>
      ))}
    </ol>
  )
}
