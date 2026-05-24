import { useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { motion } from 'motion/react'
import BounceCards       from '@/components/ui/BounceCards/BounceCards'
import VariableProximity from '@/components/ui/VariableProximity/VariableProximity'
import MagneticButton    from '@/components/shared/MagneticButton'
import { useSmoothScroll } from '@/hooks/useSmoothScroll'

const IMAGES = [
  'https://picsum.photos/seed/11/400/400',
  'https://picsum.photos/seed/22/400/400',
  'https://picsum.photos/seed/33/400/400',
  'https://picsum.photos/seed/44/400/400',
  'https://picsum.photos/seed/55/400/400',
]

const TRANSFORMS = [
  'rotate(8deg) translate(-150px)',
  'rotate(3deg) translate(-75px)',
  'rotate(-4deg)',
  'rotate(-9deg) translate(75px)',
  'rotate(4deg) translate(150px)',
]

export default function Hero() {
  const sectionRef    = useRef(null)
  const proximityRef  = useRef(null)
  const { scrollTo }  = useSmoothScroll()

  useGSAP(() => {
    const tl = gsap.timeline({ delay: 0.6 })

    tl.fromTo(
      '.hero-tag',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
    )
    .fromTo(
      '.hero-desc',
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
      '-=0.3'
    )
    .fromTo(
      '.hero-cta-btn',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.1 },
      '-=0.3'
    )
    .fromTo(
      '.hero-cards-wrap',
      { opacity: 0, scale: 0.85, y: 40 },
      { opacity: 1, scale: 1, y: 0, duration: 1, ease: 'power3.out' },
      '-=0.5'
    )
  }, { scope: sectionRef })

  return (
    <section
      id="hero"
      ref={sectionRef}
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        paddingTop: '7rem',
        paddingBottom: '5rem',
        paddingLeft: '1.5rem',
        paddingRight: '1.5rem',
        position: 'relative',
        /* ✅ overflow visible so BounceCards rotate/translate aren't clipped */
        overflow: 'visible',
      }}
    >
      {/* Background orbs */}
      <div
        className="orb"
        style={{
          width: 600,
          height: 600,
          background: 'rgba(108,59,255,0.18)',
          top: -200,
          left: -200,
          zIndex: 0,
        }}
      />
      <div
        className="orb"
        style={{
          width: 400,
          height: 400,
          background: 'rgba(157,111,255,0.10)',
          top: '40%',
          right: -100,
          zIndex: 0,
        }}
      />

      {/* ✅ Content grid — relative + z-index so it sits above orbs */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: 1280,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '4rem',
          alignItems: 'center',
        }}
      >
        {/* Left — Text */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Available badge */}
          <div
            className="hero-tag"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              opacity: 0,
            }}
          >
            <span
              style={{
                display: 'inline-flex',
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#4ade80',
                boxShadow: '0 0 8px #4ade80',
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.7rem',
                color: 'rgba(255,255,255,0.45)',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
              }}
            >
              Available for internship
            </span>
          </div>

          {/* Variable Proximity heading */}
          <div ref={proximityRef} style={{ position: 'relative' }}>
            <VariableProximity
              label="Building Beautiful Interfaces"
              fromFontVariationSettings="'wght' 300, 'opsz' 8"
              toFontVariationSettings="'wght' 900, 'opsz' 40"
              containerRef={proximityRef}
              radius={200}
              falloff="gaussian"
              style={{
                display: 'block',
                fontFamily: "'Roboto Flex', sans-serif",
                fontSize: 'clamp(2.2rem, 5.5vw, 4.5rem)',
                fontWeight: 700,
                lineHeight: 1.1,
                color: '#ffffff',
              }}
            />
          </div>

          {/* Description */}
          <p
            className="hero-desc"
            style={{
              fontSize: '1.1rem',
              color: 'rgba(255,255,255,0.48)',
              maxWidth: 440,
              lineHeight: 1.7,
              opacity: 0,
            }}
          >
            Frontend developer crafting exceptional digital experiences with
            React, GSAP animations, and meticulous attention to detail.
          </p>

          {/* CTA Buttons */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem',
              marginTop: '0.5rem',
            }}
          >
            <MagneticButton>
              <button
                className="hero-cta-btn"
                onClick={() => scrollTo('#projects')}
                style={{
                  padding: '1rem 2rem',
                  borderRadius: 9999,
                  background: '#6c3bff',
                  color: '#fff',
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  border: 'none',
                  cursor: 'none',
                  boxShadow: '0 0 40px rgba(108,59,255,0.35)',
                  transition: 'background 0.3s',
                  opacity: 0,
                }}
              >
                View Projects →
              </button>
            </MagneticButton>

            <MagneticButton>
              <button
                className="hero-cta-btn"
                onClick={() => scrollTo('#contact')}
                style={{
                  padding: '1rem 2rem',
                  borderRadius: 9999,
                  background: 'transparent',
                  color: 'rgba(255,255,255,0.65)',
                  fontFamily: "'Syne', sans-serif",
                  fontSize: '0.9rem',
                  border: '1px solid rgba(255,255,255,0.15)',
                  cursor: 'none',
                  transition: 'all 0.3s',
                  opacity: 0,
                }}
              >
                Get in Touch
              </button>
            </MagneticButton>
          </div>

          {/* Scroll hint */}
          <div
            className="hero-cta-btn"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginTop: '1.5rem',
              opacity: 0,
            }}
          >
            <div
              style={{
                width: 32,
                height: 1,
                background: 'rgba(255,255,255,0.15)',
              }}
            />
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.65rem',
                color: 'rgba(255,255,255,0.25)',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
              }}
            >
              Scroll to explore
            </span>
          </div>
        </div>

        {/* Right — BounceCards */}
        {/* ✅ Tall container so rotated/translated cards don't get clipped */}
        <div
          className="hero-cards-wrap"
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 360,
            opacity: 0,
          }}
        >
          <BounceCards
            className="custom-bounceCards"
            images={IMAGES}
            containerWidth={460}
            containerHeight={320}
            animationDelay={1.4}
            animationStagger={0.09}
            easeType="elastic.out(1, 0.5)"
            transformStyles={TRANSFORMS}
            enableHover
          />
        </div>
      </div>

      {/* Bottom fade */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 120,
          background: 'linear-gradient(to top, #0a0a0f, transparent)',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      />
    </section>
  )
}