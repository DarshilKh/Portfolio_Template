import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  memo,
} from 'react'
import './LogoLoop.css'

const ANIM = { SMOOTH_TAU: 0.25, MIN_COPIES: 2, COPY_HEADROOM: 2 }
const toCss = (v) => (typeof v === 'number' ? `${v}px` : v ?? undefined)

function useResizeObserver(cb, elements, deps) {
  useEffect(() => {
    if (!window.ResizeObserver) {
      window.addEventListener('resize', cb)
      cb()
      return () => window.removeEventListener('resize', cb)
    }
    const obs = elements.map((ref) => {
      if (!ref.current) return null
      const o = new ResizeObserver(cb)
      o.observe(ref.current)
      return o
    })
    cb()
    return () => obs.forEach((o) => o?.disconnect())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cb, ...deps])
}

function useImageLoader(seqRef, onLoad, deps) {
  useEffect(() => {
    const imgs = seqRef.current?.querySelectorAll('img') ?? []
    if (!imgs.length) { onLoad(); return }
    let remaining = imgs.length
    const done = () => { if (--remaining === 0) onLoad() }
    imgs.forEach((img) => {
      if (img.complete) done()
      else {
        img.addEventListener('load',  done, { once: true })
        img.addEventListener('error', done, { once: true })
      }
    })
    return () => imgs.forEach((img) => {
      img.removeEventListener('load',  done)
      img.removeEventListener('error', done)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onLoad, seqRef, ...deps])
}

function useAnimationLoop(
  trackRef, targetVelocity, seqW, seqH, isHovered, hoverSpeed, isVertical
) {
  const rafRef       = useRef(null)
  const lastTsRef    = useRef(null)
  const offsetRef    = useRef(0)
  const velocityRef  = useRef(0)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const seqSize = isVertical ? seqH : seqW

    const animate = (ts) => {
      if (lastTsRef.current === null) lastTsRef.current = ts
      const dt   = Math.max(0, ts - lastTsRef.current) / 1000
      lastTsRef.current = ts

      const target = isHovered && hoverSpeed !== undefined ? hoverSpeed : targetVelocity
      const ease   = 1 - Math.exp(-dt / ANIM.SMOOTH_TAU)
      velocityRef.current += (target - velocityRef.current) * ease

      if (seqSize > 0) {
        let next = ((offsetRef.current + velocityRef.current * dt) % seqSize + seqSize) % seqSize
        offsetRef.current = next
        const tv = isVertical
          ? `translate3d(0,${-next}px,0)`
          : `translate3d(${-next}px,0,0)`
        track.style.transform = tv
      }
      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => {
      cancelAnimationFrame(rafRef.current)
      lastTsRef.current = null
    }
  }, [targetVelocity, seqW, seqH, isHovered, hoverSpeed, isVertical, trackRef])
}

export const LogoLoop = memo(({
  logos,
  speed        = 80,
  direction    = 'left',
  width        = '100%',
  logoHeight   = 32,
  gap          = 48,
  pauseOnHover,
  hoverSpeed,
  fadeOut      = true,
  fadeOutColor,
  scaleOnHover = true,
  renderItem,
  ariaLabel    = 'Tech stack logos',
  className,
  style,
}) => {
  const containerRef = useRef(null)
  const trackRef     = useRef(null)
  const seqRef       = useRef(null)

  const [seqW,      setSeqW]      = useState(0)
  const [seqH,      setSeqH]      = useState(0)
  const [copyCount, setCopyCount] = useState(ANIM.MIN_COPIES)
  const [isHovered, setIsHovered] = useState(false)

  const effectiveHoverSpeed = useMemo(() => {
    if (hoverSpeed !== undefined) return hoverSpeed
    if (pauseOnHover === true)    return 0
    if (pauseOnHover === false)   return undefined
    return 0
  }, [hoverSpeed, pauseOnHover])

  const isVertical = direction === 'up' || direction === 'down'

  const targetVelocity = useMemo(() => {
    const mag  = Math.abs(speed)
    const dir  = isVertical
      ? (direction === 'up'   ? 1 : -1)
      : (direction === 'left' ? 1 : -1)
    return mag * dir * (speed < 0 ? -1 : 1)
  }, [speed, direction, isVertical])

  const updateDimensions = useCallback(() => {
    const cW = containerRef.current?.clientWidth ?? 0
    const rect = seqRef.current?.getBoundingClientRect?.()
    const sW = rect?.width  ?? 0
    const sH = rect?.height ?? 0

    if (isVertical) {
      const pH = containerRef.current?.parentElement?.clientHeight ?? 0
      if (containerRef.current && pH > 0)
        containerRef.current.style.height = `${Math.ceil(pH)}px`
      if (sH > 0) {
        setSeqH(Math.ceil(sH))
        const vp = containerRef.current?.clientHeight ?? pH
        setCopyCount(Math.max(ANIM.MIN_COPIES, Math.ceil(vp / sH) + ANIM.COPY_HEADROOM))
      }
    } else if (sW > 0) {
      setSeqW(Math.ceil(sW))
      setCopyCount(Math.max(ANIM.MIN_COPIES, Math.ceil(cW / sW) + ANIM.COPY_HEADROOM))
    }
  }, [isVertical])

  useResizeObserver(updateDimensions, [containerRef, seqRef], [logos, gap, logoHeight, isVertical])
  useImageLoader(seqRef, updateDimensions, [logos, gap, logoHeight, isVertical])
  useAnimationLoop(trackRef, targetVelocity, seqW, seqH, isHovered, effectiveHoverSpeed, isVertical)

  const cssVars = useMemo(() => ({
    '--logoloop-gap':        `${gap}px`,
    '--logoloop-logoHeight': `${logoHeight}px`,
    ...(fadeOutColor && { '--logoloop-fadeColor': fadeOutColor }),
  }), [gap, logoHeight, fadeOutColor])

  const rootClass = useMemo(() =>
    ['logoloop',
      isVertical     ? 'logoloop--vertical'   : 'logoloop--horizontal',
      fadeOut        && 'logoloop--fade',
      scaleOnHover   && 'logoloop--scale-hover',
      className,
    ].filter(Boolean).join(' ')
  , [isVertical, fadeOut, scaleOnHover, className])

  const onEnter = useCallback(() => {
    if (effectiveHoverSpeed !== undefined) setIsHovered(true)
  }, [effectiveHoverSpeed])
  const onLeave = useCallback(() => {
    if (effectiveHoverSpeed !== undefined) setIsHovered(false)
  }, [effectiveHoverSpeed])

  const renderLogoItem = useCallback((item, key) => {
    if (renderItem) return (
      <li className="logoloop__item" key={key} role="listitem">
        {renderItem(item, key)}
      </li>
    )
    const isNode = 'node' in item
    const content = isNode
      ? <span className="logoloop__node" aria-hidden>{item.node}</span>
      : <img src={item.src} srcSet={item.srcSet} alt={item.alt ?? ''} loading="lazy" decoding="async" draggable={false} />

    const label = isNode ? (item.ariaLabel ?? item.title) : (item.alt ?? item.title)
    const inner = item.href
      ? <a className="logoloop__link" href={item.href} aria-label={label} target="_blank" rel="noreferrer noopener">{content}</a>
      : content

    return (
      <li className="logoloop__item" key={key} role="listitem">{inner}</li>
    )
  }, [renderItem])

  const lists = useMemo(() =>
    Array.from({ length: copyCount }, (_, ci) => (
      <ul
        key={`copy-${ci}`}
        className="logoloop__list"
        role="list"
        aria-hidden={ci > 0}
        ref={ci === 0 ? seqRef : undefined}
      >
        {logos.map((item, ii) => renderLogoItem(item, `${ci}-${ii}`))}
      </ul>
    ))
  , [copyCount, logos, renderLogoItem])

  const containerStyle = useMemo(() => ({
    width: isVertical ? (toCss(width) !== '100%' ? toCss(width) : undefined) : (toCss(width) ?? '100%'),
    ...cssVars,
    ...style,
  }), [width, cssVars, style, isVertical])

  return (
    <div ref={containerRef} className={rootClass} style={containerStyle} role="region" aria-label={ariaLabel}>
      <div className="logoloop__track" ref={trackRef} onMouseEnter={onEnter} onMouseLeave={onLeave}>
        {lists}
      </div>
    </div>
  )
})

LogoLoop.displayName = 'LogoLoop'
export default LogoLoop