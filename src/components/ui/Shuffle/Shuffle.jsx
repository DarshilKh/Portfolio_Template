import { useRef, useState, useMemo, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Shuffle.css'

gsap.registerPlugin(ScrollTrigger)

export default function ShuffleText({
  text,
  className     = '',
  style         = {},
  tag           = 'p',
  textAlign     = 'left',
  duration      = 0.5,
  stagger       = 0.025,
  ease          = 'power3.out',
  shuffleDirection = 'up',
  triggerOnce   = true,
  threshold     = 0.2,
  onComplete,
}) {
  const ref   = useRef(null)
  // ✅ Start as visible — we animate opacity instead of visibility
  const [ready, setReady] = useState(false)

  const chars = useMemo(() =>
    text.split('').map((ch, i) => ({
      ch: ch === ' ' ? '\u00A0' : ch,
      key: i,
    }))
  , [text])

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const letters = el.querySelectorAll('.shuffle-char')
    if (!letters.length) return

    const isVert = shuffleDirection === 'up' || shuffleDirection === 'down'
    const fromVars = {
      opacity: 0,
      ...(isVert
        ? { yPercent: shuffleDirection === 'up' ? 100 : -100 }
        : { xPercent: shuffleDirection === 'right' ? -100 : 100 }),
    }

    const st = ScrollTrigger.create({
      trigger: el,
      start: `top ${Math.round((1 - threshold) * 100)}%`,
      once: triggerOnce,
      onEnter: () => {
        gsap.fromTo(letters, fromVars, {
          opacity: 1,
          yPercent: 0,
          xPercent: 0,
          duration,
          ease,
          stagger,
          onComplete: () => {
            setReady(true)
            onComplete?.()
          },
        })
      },
    })

    return () => st.kill()
  }, [text, duration, stagger, ease, shuffleDirection, threshold, triggerOnce, onComplete])

  const Tag = tag

  return (
    <Tag
      ref={ref}
      className={`shuffle-parent is-ready ${className}`}
      style={{
        textAlign,
        /* ✅ Use opacity:0 on letters, not visibility:hidden on container */
        visibility: 'visible',
        ...style,
      }}
      aria-label={text}
    >
      {chars.map(({ ch, key }) => (
        <span
          key={key}
          style={{
            display: 'inline-block',
            overflow: 'hidden',
            verticalAlign: 'bottom',
          }}
          aria-hidden="true"
        >
          <span
            className="shuffle-char"
            style={{
              display: 'inline-block',
              opacity: 0,             /* ✅ start hidden via opacity, not visibility */
              willChange: 'transform, opacity',
            }}
          >
            {ch}
          </span>
        </span>
      ))}
    </Tag>
  )
}s