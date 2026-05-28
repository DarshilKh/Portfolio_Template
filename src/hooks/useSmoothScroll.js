import { useEffect, useRef } from 'react'

/**
 * Access the global Lenis instance via a custom event.
 * Provides a `scrollTo` helper for programmatic scrolling.
 */
export function useSmoothScroll() {
  const lenisRef = useRef(null)

  useEffect(() => {
    /* 
     * Lenis is instantiated in App.jsx and stored globally
     * on window so hooks across the tree can access it. 
     */
    if (window.__lenis) {
      lenisRef.current = window.__lenis
    }
  }, [])

  const scrollTo = (target, options = {}) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, {
        offset: 0,
        duration: 1.4,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        ...options,
      })
    } else {
      /* Fallback for when Lenis isn't ready yet */
      const el =
        typeof target === 'string' ? document.querySelector(target) : target
      el?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return { scrollTo }
}