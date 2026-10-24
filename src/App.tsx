import { Background } from './components/background/Background'
import { BackToTop } from './components/BackToTop'
import { Cursor } from './components/Cursor'
import { Loader } from './components/Loader'
import { Marquee } from './components/Marquee'
import { Nav } from './components/Nav'
import { About } from './sections/About'
import { Blog } from './sections/Blog'
import { Contact } from './sections/Contact'
import { Experience } from './sections/Experience'
import { Expertise } from './sections/Expertise'
import { Hero } from './sections/Hero'
import { Now } from './sections/Now'
import { Principles } from './sections/Principles'
import { Projects } from './sections/Projects'
import { Research } from './sections/Research'

export default function App() {
  return (
    <>
      <a
        href="#about"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[300] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-ink"
      >
        Skip to content
      </a>
      <Loader />
      <Background />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Now />
        <Experience />
        <Projects />
        <Expertise />
        <Principles />
        <Research />
        <Blog />
        <Contact />
      </main>
      <BackToTop />
      <Cursor />
    </>
  )
}
