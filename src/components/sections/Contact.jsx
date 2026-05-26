import { useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { motion } from 'motion/react'
import MagneticButton    from '@/components/shared/MagneticButton'
import VariableProximity from '@/components/ui/VariableProximity/VariableProximity'
import { padNumber } from '@/lib/utils'

gsap.registerPlugin(ScrollTrigger)

const LINKS = [
  { label: 'GitHub',   href: 'https://github.com',        symbol: '⌥' },
  { label: 'LinkedIn', href: 'https://linkedin.com',       symbol: '⌘' },
  { label: 'Email',    href: 'mailto:hey@alex.dev',        symbol: '⌃' },
  { label: 'Twitter',  href: 'https://twitter.com',        symbol: '⇧' },
]

export default function Contact() {
  const ref          = useRef(null)
  /* ✅ containerRef must wrap VariableProximity AND be position:relative */
  const proximityRef = useRef(null)
  const [copied, setCopied] = useState(false)

  useGSAP(() => {
    gsap.fromTo(
      '.contact-block',
      { opacity: 0, y: 48 },
      {
        opacity: 1,
        y: 0,
        duration: 0.85,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 75%',
        },
      }
    )
  }, { scope: ref })

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText('hey@alex.dev')
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    } catch {
      /* fallback silent */
    }
  }

  return (
    <section
      id="contact"
      ref={ref}
      style={{
        padding: '8rem 1.5rem 6rem',
        background: '#0d0d14',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Glow orb */}
      <div
        style={{
          position: 'absolute',
          width: 560,
          height: 560,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(108,59,255,0.18) 0%, transparent 70%)',
          bottom: -200,
          left: '50%',
          transform: 'translateX(-50%)',
          pointerEvents: 'none',
          zIndex: 0,
          filter: 'blur(40px)',
        }}
      />

      {/* ✅ Everything centered, max-width capped, relative z-index */}
      <div
        style={{
          maxWidth: 800,
          margin: '0 auto',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2rem',
        }}
      >
        {/* Section tag */}
        <p
          className="contact-block"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.7rem',
            color: '#6c3bff',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            opacity: 0,
            margin: 0,
          }}
        >
          {padNumber(5)} — Contact
        </p>

        {/* ── VariableProximity heading ── */}
        {/*
          CRITICAL FIX:
          - proximityRef wraps the div that contains VariableProximity
          - position: relative on the wrapper is required
          - The component measures mouse position relative to containerRef
          - width: 100% ensures it spans full width for correct centering
        */}
        <div
          ref={proximityRef}
          className="contact-block"
          style={{
            position: 'relative',
            width: '100%',
            opacity: 0,
          }}
        >
          <VariableProximity
            label="Let's Work Together"
            fromFontVariationSettings="'wght' 200, 'opsz' 8"
            toFontVariationSettings="'wght' 900, 'opsz' 40"
            containerRef={proximityRef}
            radius={220}
            falloff="gaussian"
            style={{
              display: 'block',
              width: '100%',
              textAlign: 'center',
              fontFamily: "'Roboto Flex', sans-serif",
              fontSize: 'clamp(2.8rem, 7vw, 6rem)',
              fontWeight: 700,
              color: '#ffffff',
              lineHeight: 1.05,
            }}
          />
        </div>

        {/* Sub text */}
        <p
          className="contact-block"
          style={{
            color: 'rgba(255,255,255,0.4)',
            fontSize: '1.05rem',
            lineHeight: 1.7,
            maxWidth: 460,
            margin: 0,
            opacity: 0,
          }}
        >
          I'm actively looking for frontend internship opportunities. Let's build
          something exceptional together.
        </p>

        {/* Email copy button */}
        <div className="contact-block" style={{ opacity: 0 }}>
          <MagneticButton>
            <button
              onClick={copyEmail}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '1.1rem 2.4rem',
                borderRadius: 9999,
                background: copied
                  ? 'rgba(74,222,128,0.15)'
                  : '#6c3bff',
                border: copied
                  ? '1px solid rgba(74,222,128,0.4)'
                  : '1px solid transparent',
                color: copied ? '#4ade80' : '#ffffff',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.95rem',
                fontWeight: 500,
                cursor: 'none',
                boxShadow: copied
                  ? '0 0 30px rgba(74,222,128,0.2)'
                  : '0 0 50px rgba(108,59,255,0.35)',
                transition: 'all 0.4s cubic-bezier(0.25,1,0.5,1)',
              }}
            >
              {copied ? '✓ Copied to clipboard!' : 'hey@alex.dev'}
              {!copied && (
                <span style={{ opacity: 0.55, fontSize: '0.8rem' }}>↗</span>
              )}
            </button>
          </MagneticButton>
        </div>

        {/* Social links row */}
        <div
          className="contact-block"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '0.75rem',
            opacity: 0,
          }}
        >
          {LINKS.map(({ label, href, symbol }) => (
            <MagneticButton key={label} strength={0.25}>
              <motion.a
                href={href}
                target="_blank"
                rel="noreferrer noopener"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.7rem 1.4rem',
                  borderRadius: 9999,
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.09)',
                  color: 'rgba(255,255,255,0.55)',
                  fontFamily: "'Syne', sans-serif",
                  fontSize: '0.88rem',
                  textDecoration: 'none',
                  transition: 'border-color 0.3s ease, color 0.3s ease',
                  cursor: 'none',
                }}
              >
                <span
                  style={{
                    color: '#6c3bff',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.8rem',
                  }}
                >
                  {symbol}
                </span>
                {label}
              </motion.a>
            </MagneticButton>
          ))}
        </div>

        {/* Bottom rule */}
        <div
          className="contact-block"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem',
            marginTop: '2rem',
            opacity: 0,
            width: '100%',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              height: 1,
              width: 80,
              background: 'rgba(255,255,255,0.08)',
            }}
          />
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.6rem',
              color: 'rgba(255,255,255,0.15)',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
            }}
          >
            Open to Remote &amp; Hybrid
          </span>
          <div
            style={{
              height: 1,
              width: 80,
              background: 'rgba(255,255,255,0.08)',
            }}
          />
        </div>
      </div>
    </section>
  )
}