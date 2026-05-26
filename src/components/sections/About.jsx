import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { motion } from 'motion/react'
import { padNumber } from '@/lib/utils'

gsap.registerPlugin(ScrollTrigger)

const STATS = [
  { number: '12+', label: 'Projects Built'   },
  { number: '3+',  label: 'Years Learning'   },
  { number: '99',  label: 'Lighthouse Score' },
  { number: '∞',   label: 'Passion for UI'   },
]

const TRAITS = [
  'React Enthusiast',
  'GSAP Animator',
  'Design Systems',
  'TypeScript',
  'Performance',
  'Accessibility',
]

export default function About() {
  const ref    = useRef(null)
  const imgRef = useRef(null)

  useGSAP(() => {
    gsap.fromTo(
      '.about-anim',
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 72%',
        },
      }
    )

    /* Parallax on image */
    gsap.fromTo(
      imgRef.current,
      { yPercent: -8 },
      {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top bottom',
          end:   'bottom top',
          scrub: 1.8,
        },
      }
    )
  }, { scope: ref })

  return (
    <section
      id="about"
      ref={ref}
      style={{
        padding: '8rem 1.5rem',
        background: '#0d0d14',
        position: 'relative',
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))',
          gap: '5rem',
          alignItems: 'center',
        }}
      >
        {/* ── Left: Image ── */}
        <div className="about-anim" style={{ opacity: 0 }}>
          <div
            style={{
              position: 'relative',
              maxWidth: 380,
              margin: '0 auto',
            }}
          >
            {/* Image frame */}
            <div
              style={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 28,
                aspectRatio: '4/5',
                border: '1px solid rgba(108,59,255,0.22)',
              }}
            >
              <div
                ref={imgRef}
                style={{ position: 'absolute', inset: '-10%', height: '120%' }}
              >
                <img
                  src="https://picsum.photos/seed/portrait/600/750"
                  alt="Alex — Frontend Developer"
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              </div>

              {/* Purple tint overlay */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(135deg, rgba(108,59,255,0.28) 0%, transparent 55%)',
                  zIndex: 1,
                }}
              />
            </div>

            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.6 }}
              style={{
                position: 'absolute',
                bottom: 20,
                left: 16,
                right: 16,
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 16,
                padding: '0.9rem 1.1rem',
                zIndex: 2,
              }}
            >
              <p
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.62rem',
                  color: 'rgba(255,255,255,0.4)',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  marginBottom: '0.25rem',
                }}
              >
                CURRENT FOCUS
              </p>
              <p
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: '#ffffff',
                }}
              >
                Frontend Internship Roles 🚀
              </p>
            </motion.div>

            {/* Dot grid decoration */}
            <div
              style={{
                position: 'absolute',
                top: -20,
                right: -20,
                width: 100,
                height: 100,
                backgroundImage:
                  'radial-gradient(circle, rgba(108,59,255,0.35) 1px, transparent 1px)',
                backgroundSize: '9px 9px',
                zIndex: -1,
              }}
            />
          </div>
        </div>

        {/* ── Right: Content ── */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.75rem',
          }}
        >
          {/* Section tag */}
          <div className="about-anim" style={{ opacity: 0 }}>
            <p
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.7rem',
                color: '#6c3bff',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                marginBottom: '1rem',
              }}
            >
              {padNumber(1)} — About Me
            </p>

            <h2
              style={{
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                fontWeight: 800,
                lineHeight: 1.1,
                color: '#ffffff',
                fontFamily: "'Syne', sans-serif",
              }}
            >
              Crafting the web,{' '}
              <span
                style={{
                  background: 'linear-gradient(90deg, #6c3bff, #9d6fff)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                one pixel at a time
              </span>
            </h2>
          </div>

          <p
            className="about-anim"
            style={{
              color: 'rgba(255,255,255,0.5)',
              lineHeight: 1.75,
              fontSize: '1.05rem',
              opacity: 0,
            }}
          >
            I'm a frontend developer with a deep passion for creating smooth,
            accessible, and visually stunning web experiences. I obsess over
            micro-interactions, performance, and design systems.
          </p>

          <p
            className="about-anim"
            style={{
              color: 'rgba(255,255,255,0.35)',
              lineHeight: 1.7,
              opacity: 0,
            }}
          >
            When I'm not pushing pixels, I'm exploring new animation techniques
            with GSAP, contributing to open source, or breaking down design
            systems from top companies.
          </p>

          {/* Trait chips */}
          <div
            className="about-anim"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.5rem',
              opacity: 0,
            }}
          >
            {TRAITS.map((t) => (
              <span
                key={t}
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.72rem',
                  padding: '5px 14px',
                  borderRadius: 9999,
                  border: '1px solid rgba(108,59,255,0.28)',
                  color: '#9d6fff',
                  background: 'rgba(108,59,255,0.06)',
                  transition: 'border-color 0.3s, background 0.3s',
                  cursor: 'default',
                }}
              >
                {t}
              </span>
            ))}
          </div>

          {/* Stats */}
          <div
            className="about-anim"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '0.75rem',
              opacity: 0,
            }}
          >
            {STATS.map(({ number, label }) => (
              <div
                key={label}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 16,
                  padding: '1rem 0.5rem',
                  textAlign: 'center',
                }}
              >
                <p
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: 800,
                    color: '#9d6fff',
                    fontFamily: "'Syne', sans-serif",
                    marginBottom: '0.25rem',
                  }}
                >
                  {number}
                </p>
                <p
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.6rem',
                    color: 'rgba(255,255,255,0.35)',
                    letterSpacing: '0.05em',
                  }}
                >
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}