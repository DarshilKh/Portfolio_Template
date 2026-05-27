import { useRef } from 'react'
import { gsap } from 'gsap'
import { cn } from '@/lib/utils'

/**
 * A button that magnetically attracts to the cursor on hover.
 * Wraps any children — pass className to style the outer shell.
 */
export default function MagneticButton({
  children,
  className = '',
  strength = 0.4,
  ...props
}) {
  const ref     = useRef(null)
  const innerRef = useRef(null)

  const onMouseMove = (e) => {
    const el   = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const cx   = rect.left + rect.width  / 2
    const cy   = rect.top  + rect.height / 2
    const dx   = (e.clientX - cx) * strength
    const dy   = (e.clientY - cy) * strength

    gsap.to(el, {
      x: dx,
      y: dy,
      duration: 0.5,
      ease: 'power3.out',
    })
    gsap.to(innerRef.current, {
      x: dx * 0.3,
      y: dy * 0.3,
      duration: 0.5,
      ease: 'power3.out',
    })
  }

  const onMouseLeave = () => {
    gsap.to([ref.current, innerRef.current], {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: 'elastic.out(1, 0.4)',
    })
  }

  return (
    <div
      ref={ref}
      className={cn('inline-block', className)}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <div ref={innerRef} {...props}>
        {children}
      </div>
    </div>
  )
}