import { useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { motion, AnimatePresence } from 'motion/react'
import MagneticButton from '@/components/shared/MagneticButton'
import { padNumber } from '@/lib/utils'

gsap.registerPlugin(ScrollTrigger)

const PROJECTS = [
  {
    id: 1,
    tag: '01',
    title: 'Aurora Dashboard',
    desc: 'Real-time analytics dashboard with WebGL backgrounds, GSAP animations, and complex data visualizations.',
    tech: ['React', 'GSAP', 'WebGL', 'TypeScript'],
    image: 'https://picsum.photos/seed/proj1/800/500',
    href: '#',
    color: '#6c3bff',
  },
  {
    id: 2,
    tag: '02',
    title: 'Particle CMS',
    desc: 'Headless CMS frontend with drag-and-drop, live preview, and buttery-smooth transitions.',
    tech: ['Next.js', 'Framer Motion', 'Tailwind', 'Zustand'],
    image: 'https://picsum.photos/seed/proj2/800/500',
    href: '#',
    color: '#9d6fff',
  },
  {
    id: 3,
    tag: '03',
    title: 'Design System Forge',
    desc: 'Token-based design system with 60+ accessible components, dark/light mode, full Storybook docs.',
    tech: ['React', 'Storybook', 'Radix UI', 'CSS'],
    image: 'https://picsum.photos/seed/proj3/800/500',
    href: '#',
    color: '#4ade80',
  },
  {
    id: 4,
    tag: '04',
    title: 'Motion Portfolio',
    desc: 'Award-worthy portfolio site with custom WebGL shader backgrounds and GSAP ScrollTrigger magic.',
    tech: ['React', 'GSAP', 'OGL', 'Lenis'],
    image: 'https://picsum.photos/seed/proj4/800/500',
    href: '#',
    color: '#f472b6',
  },
]

/* ─── Single Project Card ─── */
function ProjectCard({ project, index }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.article
      initial={{ opacity: 0, y: 70 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration: 0.75,
        delay: index * 0.12,
        ease: [0.25, 1, 0.5, 1],
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        background: 'rgba(255,255,255,0.03)',
        border: hovered
          ? `1px solid ${project.color}55`
          : '1px solid rgba(255,255,255,0.07)',
        borderRadius: 24,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: hovered
          ? `0 0 40px ${project.color}18`
          : '0 2px 20px rgba(0,0,0,0.3)',
        transition: 'border-color 0.4s ease, box-shadow 0.4s ease',
        cursor: 'none',
      }}
    >
      {/* ── Image area ── */}
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          aspectRatio: '16/9',
          flexShrink: 0,
        }}
      >
        <img
          src={project.image}
          alt={project.title}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            transform: hovered ? 'scale(1.06)' : 'scale(1)',
            transition: 'transform 0.7s cubic-bezier(0.25,1,0.5,1)',
          }}
        />

        {/* Color overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(135deg, ${project.color}44, transparent 60%)`,
            opacity: hovered ? 1 : 0.35,
            transition: 'opacity 0.4s ease',
          }}
        />

        {/* Bottom gradient so text is readable */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '50%',
            background: 'linear-gradient(to top, rgba(10,10,15,0.85), transparent)',
          }}
        />

        {/* Number tag */}
        <div
          style={{
            position: 'absolute',
            top: 14,
            left: 14,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.7rem',
            padding: '4px 10px',
            borderRadius: 9999,
            background: `${project.color}22`,
            border: `1px solid ${project.color}55`,
            color: project.color,
            letterSpacing: '0.05em',
          }}
        >
          {project.tag}
        </div>
      </div>

      {/* ── Text content ── */}
      <div
        style={{
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          flex: 1,
          background: '#0d0d14',
        }}
      >
        <h3
          style={{
            fontSize: '1.2rem',
            fontWeight: 700,
            color: hovered ? '#9d6fff' : '#ffffff',
            fontFamily: "'Syne', sans-serif",
            transition: 'color 0.3s ease',
            margin: 0,
          }}
        >
          {project.title}
        </h3>

        <p
          style={{
            fontSize: '0.88rem',
            color: 'rgba(255,255,255,0.48)',
            lineHeight: 1.65,
            margin: 0,
          }}
        >
          {project.desc}
        </p>

        {/* Tech chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {project.tech.map((t) => (
            <span
              key={t}
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.7rem',
                padding: '3px 10px',
                borderRadius: 6,
                background: 'rgba(255,255,255,0.05)',
                color: 'rgba(255,255,255,0.45)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              {t}
            </span>
          ))}
        </div>

        {/* CTA link */}
        <div style={{ marginTop: '0.5rem' }}>
          <MagneticButton strength={0.25}>
            <a
              href={project.href}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: '#9d6fff',
                textDecoration: 'none',
                fontFamily: "'Syne', sans-serif",
                transition: 'color 0.25s ease',
              }}
            >
              View Project
              <span
                style={{
                  display: 'inline-block',
                  transform: hovered ? 'translateX(4px)' : 'translateX(0)',
                  transition: 'transform 0.3s ease',
                }}
              >
                →
              </span>
            </a>
          </MagneticButton>
        </div>
      </div>
    </motion.article>
  )
}

/* ─── Section ─── */
export default function Projects() {
  const ref = useRef(null)

  useGSAP(() => {
    gsap.fromTo(
      '.projects-header-inner',
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.85,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 82%',
        },
      }
    )
  }, { scope: ref })

  return (
    <section
      id="projects"
      ref={ref}
      style={{
        padding: '8rem 1.5rem',
        background: '#0d0d14',
        position: 'relative',
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>

        {/* Header */}
        <div
          className="projects-header-inner"
          style={{
            textAlign: 'center',
            marginBottom: '4rem',
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
            {padNumber(3)} — Work
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
            Selected Projects
          </h2>

          <p
            style={{
              color: 'rgba(255,255,255,0.38)',
              fontSize: '1.05rem',
              maxWidth: 480,
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            A curated selection of projects that showcase my range and depth
          </p>
        </div>

        {/* Cards grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 480px), 1fr))',
            gap: '1.25rem',
          }}
        >
          {PROJECTS.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>

        {/* GitHub CTA */}
        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
          <MagneticButton>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer noopener"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.9rem 2rem',
                borderRadius: 9999,
                border: '1px solid rgba(255,255,255,0.12)',
                color: 'rgba(255,255,255,0.55)',
                fontFamily: "'Syne', sans-serif",
                fontSize: '0.9rem',
                textDecoration: 'none',
                transition: 'border-color 0.3s ease, color 0.3s ease',
              }}
            >
              View All on GitHub ↗
            </a>
          </MagneticButton>
        </div>
      </div>
    </section>
  )
}