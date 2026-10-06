import { Routes, Route } from 'react-router-dom'
import Nav from './components/Nav.jsx'
import Footer from './components/Footer.jsx'
import ScrollManager from './components/ScrollManager.jsx'
import RouteMeta from './components/RouteMeta.jsx'
import Home from './pages/Home.jsx'
import CaseStudy from './pages/CaseStudy.jsx'
import Resume from './pages/Resume.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <Nav />
      <div className="page" id="page">
        <main id="main" tabIndex={-1}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/work/:slug" element={<CaseStudy />} />
            <Route path="/resume" element={<Resume />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
      <ScrollManager />
      <RouteMeta />
    </>
  )
}
