import { TLink } from '../components/TLink.jsx'
import Arrow from '../components/Arrow.jsx'

export default function NotFound() {
  return (
    <section className="section notfound">
      <div className="container">
        <p className="eyebrow">404</p>
        <h1>This page does not exist.</h1>
        <p>The link may be old, or mistyped. The work is still here.</p>
        <TLink to="/" className="btn btn--primary">Back to the portfolio <Arrow /></TLink>
      </div>
    </section>
  )
}
