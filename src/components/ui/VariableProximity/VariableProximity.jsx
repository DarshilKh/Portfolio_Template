import { forwardRef, useMemo, useRef, useEffect } from 'react'
import { motion } from 'motion/react'
import './VariableProximity.css'

/* ── rAF loop ── */
function useAnimationFrame(cb) {
  useEffect(() => {
    let id
    const loop = () => { cb(); id = requestAnimationFrame(loop) }
    id = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(id)
  }, [cb])
}

/* ── Mouse position ref scoped to container ── */
function useMousePositionRef(containerRef) {
  const pos = useRef({ x: 0, y: 0 })
  useEffect(() => {
    const update = (x, y) => {
      if (containerRef?.current) {
        const r = containerRef.current.getBoundingClientRect()
        pos.current = { x: x - r.left, y: y - r.top }
      } else {
        pos.current = { x, y }
      }
    }
    const onMove  = (e) => update(e.clientX, e.clientY)
    const onTouch = (e) => update(e.touches[0].clientX, e.touches[0].clientY)
    window.addEventListener('mousemove',  onMove,  { passive: true })
    window.addEventListener('touchmove',  onTouch, { passive: true })
    return () => {
      window.removeEventListener('mousemove',  onMove)
      window.removeEventListener('touchmove',  onTouch)
    }
  }, [containerRef])
  return pos
}

const VariableProximity = forwardRef((props, ref) => {
  const {
    label,
    fromFontVariationSettings,
    toFontVariationSettings,
    containerRef,
    radius   = 80,
    falloff  = 'linear',
    className = '',
    onClick,
    style,
    ...rest
  } = props

  const letterRefs    = useRef([])
  const interpRef     = useRef([])
  const mousePos      = useMousePositionRef(containerRef)
  const lastPos       = useRef({ x: null, y: null })

  const parsedSettings = useMemo(() => {
    const parse = (s) =>
      new Map(s.split(',').map((p) => {
        const [name, val] = p.trim().split(' ')
        return [name.replace(/['"]/g, ''), parseFloat(val)]
      }))
    const from = parse(fromFontVariationSettings)
    const to   = parse(toFontVariationSettings)
    return [...from.entries()].map(([axis, fromV]) => ({
      axis,
      fromValue: fromV,
      toValue:   to.get(axis) ?? fromV,
    }))
  }, [fromFontVariationSettings, toFontVariationSettings])

  const dist = (x1, y1, x2, y2) => Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)

  const calcFalloff = (d) => {
    const n = Math.min(Math.max(1 - d / radius, 0), 1)
    if (falloff === 'exponential') return n ** 2
    if (falloff === 'gaussian')    return Math.exp(-((d / (radius / 2)) ** 2) / 2)
    return n
  }

  useAnimationFrame(() => {
    if (!containerRef?.current) return
    const { x, y } = mousePos.current
    if (lastPos.current.x === x && lastPos.current.y === y) return
    lastPos.current = { x, y }
    const cr = containerRef.current.getBoundingClientRect()

    letterRefs.current.forEach((el, i) => {
      if (!el) return
      const r  = el.getBoundingClientRect()
      const cx = r.left + r.width  / 2 - cr.left
      const cy = r.top  + r.height / 2 - cr.top
      const d  = dist(x, y, cx, cy)

      if (d >= radius) {
        el.style.fontVariationSettings = fromFontVariationSettings
        return
      }
      const f = calcFalloff(d)
      const settings = parsedSettings
        .map(({ axis, fromValue, toValue }) =>
          `'${axis}' ${fromValue + (toValue - fromValue) * f}`)
        .join(', ')
      interpRef.current[i] = settings
      el.style.fontVariationSettings = settings
    })
  })

  let letterIndex = 0
  const words = label.split(' ')

  return (
    <span
      ref={ref}
      className={`${className} variable-proximity`}
      onClick={onClick}
      style={{ display: 'inline', ...style }}
      {...rest}
    >
      {words.map((word, wi) => (
        <span key={wi} style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
          {word.split('').map((ch) => {
            const li = letterIndex++
            return (
              <motion.span
                key={li}
                ref={(el) => { letterRefs.current[li] = el }}
                style={{
                  display: 'inline-block',
                  fontVariationSettings: interpRef.current[li],
                }}
                aria-hidden="true"
              >
                {ch}
              </motion.span>
            )
          })}
          {wi < words.length - 1 && (
            <span style={{ display: 'inline-block' }}>&nbsp;</span>
          )}
        </span>
      ))}
      <span className="sr-only">{label}</span>
    </span>
  )
})

VariableProximity.displayName = 'VariableProximity'
export default VariableProximity