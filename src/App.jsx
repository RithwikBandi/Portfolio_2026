import { useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Nav from './components/Nav.jsx'
import Footer from './components/Footer.jsx'
import ScrollManager from './components/ScrollManager.jsx'
import RouteMeta from './components/RouteMeta.jsx'
import Home from './pages/Home.jsx'
import CaseStudy from './pages/CaseStudy.jsx'
import Resume from './pages/Resume.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  // Once the home page has been shown it stays mounted, hidden, while other pages are open. Going
  // back is then just un-hiding it: no re-render, no 3D scene or observers rebuilt, images still
  // decoded, so the return transition has a free main thread and stays smooth.
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  const [keepHome, setKeepHome] = useState(isHome)
  if (isHome && !keepHome) setKeepHome(true)

  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <Nav />
      <div className="page" id="page">
        <main id="main" tabIndex={-1}>
          {keepHome && <div className="home" hidden={!isHome}><Home /></div>}
          <Routes>
            <Route path="/" element={null} />
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
