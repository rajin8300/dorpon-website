import About from './components/About'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Header from './components/Header'
import Hero from './components/Hero'
import Portfolio from './components/Portfolio'
import Videos from './components/Videos'
import { useReveal } from './hooks/useReveal'

export default function App() {
  useReveal()

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <Header />

      <main id="main">
        <Hero />
        <Portfolio />
        <Videos />
        <About />
        <Contact />
      </main>

      <Footer />
    </>
  )
}
