import Hero from '../sections/Hero.jsx'
import Work from '../sections/Work.jsx'
import About from '../sections/About.jsx'
import Capabilities from '../sections/Capabilities.jsx'
import Training from '../sections/Training.jsx'
import Beyond from '../sections/Beyond.jsx'
import Contact from '../sections/Contact.jsx'

// Landing page: sections in storytelling order
export default function Home() {
  return (
    <>
      <Hero />
      <Work />
      <About />
      <Capabilities />
      <Training />
      <Beyond />
      <Contact />
    </>
  )
}
