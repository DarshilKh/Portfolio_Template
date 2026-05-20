import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

import CustomCursor   from '@/components/shared/CustomCursor'
import ScrollProgress from '@/components/shared/ScrollProgress'
import Navbar         from '@/components/layout/Navbar'
import Footer         from '@/components/layout/Footer'
import Hero           from '@/components/sections/Hero'
import About          from '@/components/sections/About'
import Skills         from '@/components/sections/Skills'
import Projects       from '@/components/sections/Projects'
import Gallery        from '@/components/sections/Gallery'
import Contact        from '@/components/sections/Contact'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const lenisRef = useRef(null)

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.8,
    })

    // ✅ Expose globally so useSmoothScroll hook can access it
    window.__lenis = lenis
    lenisRef.current = lenis

    // ✅ Correct way to sync Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })
    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.destroy()
      window.__lenis = null
    }
  }, [])

  useGSAP(() => {
    gsap.set('body', { opacity: 1 })
    gsap.from('#root', {
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
    })
  })

  return (
    <>
      <CustomCursor />
      <ScrollProgress />
      <Navbar />
      <main className="relative">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Gallery />
        <Contact />
      </main>
      <Footer />
    </>
  )
}