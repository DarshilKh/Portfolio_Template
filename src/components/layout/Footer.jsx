import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const SOCIALS = [
  { label: 'GitHub',   href: 'https://github.com' },
  { label: 'LinkedIn', href: 'https://linkedin.com' },
  { label: 'Twitter',  href: 'https://twitter.com' },
  { label: 'Dribbble', href: 'https://dribbble.com' },
]

export default function Footer() {
  const ref = useRef(null)

  useGSAP(() => {
    gsap.fromTo(
      ref.current,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 95%',
        },
      }
    )
  }, { scope: ref })

  return (
    <footer
      ref={ref}
      className="
        relative border-t border-white/[0.06]
        py-12 px-6
      "
    >
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="font-mono text-xs text-white/30 tracking-widest">
          © {new Date().getFullYear()} ALEX.DEV — CRAFTED WITH ♥
        </p>

        <ul className="flex items-center gap-6">
          {SOCIALS.map(({ label, href }) => (
            <li key={label}>
              <a
                href={href}
                target="_blank"
                rel="noreferrer noopener"
                className="animated-underline font-sans text-sm text-white/40 hover:text-white transition-colors"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  )
}