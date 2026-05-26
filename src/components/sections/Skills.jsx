import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import {
  SiReact, SiTypescript, SiNextdotjs, SiTailwindcss,
  SiFramer, SiGreensock, SiVite, SiNodedotjs,
  SiGit, SiFigma, SiWebgl, SiJavascript,
} from 'react-icons/si'
import LogoLoop from '@/components/ui/LogoLoop/LogoLoop'
import { padNumber } from '@/lib/utils'

gsap.registerPlugin(ScrollTrigger)

const SKILLS = [
  { label: 'React 19',    icon: <SiReact />,       level: 92, color: '#61dafb' },
  { label: 'TypeScript',  icon: <SiTypescript />,  level: 85, color: '#3178c6' },
  { label: 'GSAP',        icon: <SiGreensock />,   level: 88, color: '#88ce02' },
  { label: 'Tailwind v4', icon: <SiTailwindcss />, level: 90, color: '#38bdf8' },
  { label: 'Next.js',     icon: <SiNextdotjs />,   level: 80, color: '#ffffff' },
  { label: 'Framer',      icon: <SiFramer />,      level: 78, color: '#8b5cf6' },
]

const LOGOS = [
  { node: <SiReact />,       title: 'React'      },
  { node: <SiTypescript />,  title: 'TypeScript' },
  { node: <SiNextdotjs />,   title: 'Next.js'    },
  { node: <SiTailwindcss />, title: 'Tailwind'   },
  { node: <SiFramer />,      title: 'Framer'     },
  { node: <SiGreensock />,   title: 'GSAP'       },
  { node: <SiVite />,        title: 'Vite'       },
  { node: <SiNodedotjs />,   title: 'Node.js'    },
  { node: <SiGit />,         title: 'Git'        },
  { node: <SiFigma />,       title: 'Figma'      },
  { node: <SiWebgl />,       title: 'WebGL'      },
  { node: <SiJavascript />,  title: 'JavaScript' },
]

function SkillBar({ label, icon, level, color, index }) {
  const barRef = useRef(null)

  useEffect(() => {
    if (!barRef.current) return

    // ✅ Set initial width to 0 explicitly
    gsap.set(barRef.current, { width: '0%' })

    const st = ScrollTrigger.create({
      trigger: barRef.current,
      start: 'top 88%',
      once: true,
      onEnter: () => {
        gsap.to(barRef.current, {
          width: `${level}%`,
          duration: 1.2,
          delay: index * 0.08,
          ease: 'power3.out',
        })
      },
    })

    return () => st.kill()
  }, [level, index])

  return (
    <div
      className="glass"
      style={{
        borderRadius: 16,
        padding: '1.5rem',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ color, fontSize: 22, display: 'flex' }}>{icon}</span>
          <span style={{ color: '#fff', fontWeight: 500 }}>{label}</span>
        </div>
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.8rem',
            color: 'rgba(255,255,255,0.35)',
          }}
        >
          {level}%
        </span>
      </div>

      {/* Track */}
      <div
        style={{
          height: 4,
          borderRadius: 9999,
          background: 'rgba(255,255,255,0.06)',
          overflow: 'hidden',
        }}
      >
        {/* Fill */}
        <div
          ref={barRef}
          style={{
            height: '100%',
            width: '0%',       /* ✅ explicit 0 */
            borderRadius: 9999,
            background: `linear-gradient(90deg, ${color}66, ${color})`,
            willChange: 'width',
          }}
        />
      </div>
    </div>
  )
}

export default function Skills() {
  const ref = useRef(null)

  useGSAP(() => {
    gsap.fromTo(
      '.skills-header',
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: ref.current, start: 'top 80%' },
      }
    )
  }, { scope: ref })

  return (
    <section
      id="skills"
      ref={ref}
      style={{
        padding: '8rem 1.5rem',
        background: '#0a0a0f',
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>

        {/* Header */}
        <div className="skills-header" style={{ textAlign: 'center', marginBottom: '5rem', opacity: 0 }}>
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
            {padNumber(2)} — Skills
          </p>
          <h2
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              fontWeight: 800,
              color: '#fff',
            }}
          >
            My Tech Stack
          </h2>
        </div>

        {/* Logo Loops */}
        <div style={{ overflow: 'hidden', marginBottom: '1rem' }}>
          <LogoLoop
            logos={LOGOS}
            speed={60}
            direction="left"
            logoHeight={34}
            gap={52}
            pauseOnHover
            fadeOut
            fadeOutColor="#0a0a0f"
            scaleOnHover
            ariaLabel="Tech logos row 1"
          />
        </div>

        <div style={{ overflow: 'hidden', marginBottom: '5rem' }}>
          <LogoLoop
            logos={[...LOGOS].reverse()}
            speed={60}
            direction="right"
            logoHeight={34}
            gap={52}
            pauseOnHover
            fadeOut
            fadeOutColor="#0a0a0f"
            scaleOnHover
            ariaLabel="Tech logos row 2"
          />
        </div>

        {/* Skill Bars — 2 column grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1rem',
          }}
        >
          {SKILLS.map((skill, i) => (
            <SkillBar key={skill.label} {...skill} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}