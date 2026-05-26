import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import CircularGallery from '@/components/ui/CircularGallery/CircularGallery'
import { padNumber } from '@/lib/utils'

gsap.registerPlugin(ScrollTrigger)

const GALLERY_ITEMS = [
  { image: 'https://picsum.photos/seed/g1/800/600', text: 'UI Design'       },
  { image: 'https://picsum.photos/seed/g2/800/600', text: 'Web Animations'  },
  { image: 'https://picsum.photos/seed/g3/800/600', text: 'Design Systems'  },
  { image: 'https://picsum.photos/seed/g4/800/600', text: 'Interactions'    },
  { image: 'https://picsum.photos/seed/g5/800/600', text: 'Typography'      },
  { image: 'https://picsum.photos/seed/g6/800/600', text: 'Color Theory'    },
  { image: 'https://picsum.photos/seed/g7/800/600', text: 'Motion Design'   },
  { image: 'https://picsum.photos/seed/g8/800/600', text: 'Accessibility'   },
]

export default function Gallery() {
  const ref      = useRef(null)
  const titleRef = useRef(null)

  useGSAP(() => {
    gsap.fromTo(
      titleRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: titleRef.current,
          start: 'top 85%',
        },
      }
    )
  }, { scope: ref })

  return (
    <section
      id="gallery"
      ref={ref}
      style={{
        /* ✅ Enough padding so it never touches adjacent sections */
        paddingTop: '8rem',
        paddingBottom: '8rem',
        background: '#0a0a0f',
        position: 'relative',
        /* ✅ Clip the WebGL canvas inside this section only */
        overflow: 'hidden',
      }}
    >
      {/* Title */}
      <div
        ref={titleRef}
        style={{
          textAlign: 'center',
          marginBottom: '3rem',
          padding: '0 1.5rem',
          opacity: 0,
        }}
      >
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
          {padNumber(4)} — Inspiration
        </p>

        <h2
          style={{
            fontSize: 'clamp(2.5rem, 6vw, 5rem)',
            fontWeight: 800,
            color: '#ffffff',
            fontFamily: "'Syne', sans-serif",
            marginBottom: '1rem',
            lineHeight: 1.05,
          }}
        >
          Visual Gallery
        </h2>

        <p
          style={{
            color: 'rgba(255,255,255,0.35)',
            fontSize: '0.95rem',
            maxWidth: 400,
            margin: '0 auto',
            lineHeight: 1.6,
          }}
        >
          Drag to explore — design explorations and visual experiments
        </p>
      </div>

      {/* ✅ Fixed pixel height so the WebGL canvas renders correctly */}
      <div
        style={{
          width: '100%',
          height: 480,
          position: 'relative',
        }}
      >
        <CircularGallery
          items={GALLERY_ITEMS}
          bend={2}
          textColor="#9d6fff"
          borderRadius={0.06}
          scrollSpeed={2.5}
          scrollEase={0.06}
          font="bold 22px Syne, sans-serif"
        />
      </div>

      {/* Drag hint */}
      <p
        style={{
          textAlign: 'center',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.65rem',
          color: 'rgba(255,255,255,0.18)',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          marginTop: '2rem',
        }}
      >
        SCROLL OR DRAG ↔
      </p>
    </section>
  )
}