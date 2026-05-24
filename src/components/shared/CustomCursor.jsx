import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function CustomCursor() {
  const dotRef  = useRef(null)
  const ringRef = useRef(null)
  const mouseRef = useRef({ x: -100, y: -100 })
  const ringPos  = useRef({ x: -100, y: -100 })

  useEffect(() => {
    const dot  = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    /* ── Move dot instantly ── */
    const onMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
      gsap.set(dot, { x: e.clientX, y: e.clientY })
    }

    /* ── Ring lags behind ── */
    const tickerId = gsap.ticker.add(() => {
      ringPos.current.x += (mouseRef.current.x - ringPos.current.x) * 0.12
      ringPos.current.y += (mouseRef.current.y - ringPos.current.y) * 0.12
      gsap.set(ring, { x: ringPos.current.x, y: ringPos.current.y })
    })

    /* ── Hover states ── */
    const onEnterLink = () => {
      gsap.to(ring, { scale: 2, opacity: 0.5, duration: 0.3, ease: 'power2.out' })
      gsap.to(dot,  { scale: 0, duration: 0.2, ease: 'power2.out' })
    }
    const onEnterBtn = () => {
      gsap.to(ring, {
        scale: 2.5, opacity: 0.25,
        backgroundColor: '#6c3bff',
        border: 'none',
        duration: 0.3, ease: 'power2.out',
      })
      gsap.to(dot, { scale: 0, duration: 0.2 })
    }
    const onLeave = () => {
      gsap.to(ring, {
        scale: 1, opacity: 1,
        backgroundColor: 'transparent',
        border: '1px solid rgba(108,59,255,0.8)',
        duration: 0.4, ease: 'elastic.out(1, 0.5)',
      })
      gsap.to(dot, { scale: 1, duration: 0.3, ease: 'elastic.out(1, 0.5)' })
    }

    const attachListeners = () => {
      document.querySelectorAll('a').forEach((el) => {
        el.addEventListener('mouseenter', onEnterLink)
        el.addEventListener('mouseleave', onLeave)
      })
      document.querySelectorAll('button').forEach((el) => {
        el.addEventListener('mouseenter', onEnterBtn)
        el.addEventListener('mouseleave', onLeave)
      })
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    attachListeners()

    const observer = new MutationObserver(attachListeners)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener('mousemove', onMove)
      gsap.ticker.remove(tickerId)
      observer.disconnect()
    }
  }, [])

  const BASE = {
    position: 'fixed',
    top: 0,
    left: 0,
    pointerEvents: 'none',
    /* ✅ Must be above everything, including section backgrounds */
    zIndex: 999999,
    willChange: 'transform',
    /* ✅ translate so (0,0) is center of cursor element */
    transform: 'translate(-50%, -50%)',
  }

  return (
    <>
      {/* Dot — sharp, fast */}
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          ...BASE,
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: '#ffffff',
        }}
      />
      {/* Ring — slow, lagging */}
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          ...BASE,
          width: 34,
          height: 34,
          borderRadius: '50%',
          border: '1px solid rgba(108,59,255,0.8)',
          background: 'transparent',
        }}
      />
    </>
  )
}