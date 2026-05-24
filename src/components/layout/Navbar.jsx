import { useEffect, useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import MagneticButton from '@/components/shared/MagneticButton'

const NAV_LINKS = [
  { label: 'About',    href: '#about'    },
  { label: 'Skills',   href: '#skills'   },
  { label: 'Projects', href: '#projects' },
  { label: 'Gallery',  href: '#gallery'  },
  { label: 'Contact',  href: '#contact'  },
]

/* ── Smooth scroll helper — works with or without Lenis ── */
function scrollToSection(href) {
  /* Try Lenis first */
  if (window.__lenis) {
    window.__lenis.scrollTo(href, {
      offset: -80,
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })
    return
  }
  /* Native fallback */
  const el = document.querySelector(href)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export default function Navbar() {
  const navRef   = useRef(null)
  const [scrolled,  setScrolled]  = useState(false)
  const [menuOpen,  setMenuOpen]  = useState(false)
  const [isMobile,  setIsMobile]  = useState(false)
  const menuRef  = useRef(null)

  /* ── Detect mobile ── */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check, { passive: true })
    return () => window.removeEventListener('resize', check)
  }, [])

  /* ── Entrance animation ── */
  useGSAP(() => {
    if (!navRef.current) return
    gsap.fromTo(
      navRef.current,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.4 }
    )
  }, { scope: navRef })

  /* ── Shrink on scroll ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* ── Mobile menu open animation ── */
  useEffect(() => {
    if (!menuOpen || !menuRef.current) return

    const links = menuRef.current.querySelectorAll('.mobile-nav-link')
    gsap.fromTo(
      links,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.08,
        duration: 0.55,
        ease: 'power3.out',
        delay: 0.1,
      }
    )
  }, [menuOpen])

  /* ── Lock body scroll when menu open ── */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const handleNav = useCallback((e, href) => {
    e.preventDefault()
    setMenuOpen(false)
    /* Small delay so menu closes before scroll fires */
    setTimeout(() => scrollToSection(href), menuOpen ? 350 : 0)
  }, [menuOpen])

  /* ── Nav background styles ── */
  const navStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    /* ✅ Transition height/padding/background */
    padding: scrolled ? '0.75rem 0' : '1.5rem 0',
    background: scrolled
      ? 'rgba(10, 10, 15, 0.85)'
      : 'transparent',
    backdropFilter: scrolled ? 'blur(20px)' : 'none',
    WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
    borderBottom: scrolled
      ? '1px solid rgba(255,255,255,0.06)'
      : '1px solid transparent',
    transition: 'padding 0.4s ease, background 0.4s ease, border-color 0.4s ease',
  }

  const innerStyle = {
    maxWidth: 1280,
    margin: '0 auto',
    padding: '0 1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  }

  return (
    <>
      {/* ══════════ Desktop / Main Nav ══════════ */}
      <nav ref={navRef} style={navStyle} aria-label="Main navigation">
        <div style={innerStyle}>

          {/* Logo */}
          <MagneticButton strength={0.3}>
            <a
              href="#hero"
              onClick={(e) => handleNav(e, '#hero')}
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.85rem',
                letterSpacing: '0.15em',
                color: 'rgba(255,255,255,0.8)',
                textDecoration: 'none',
                transition: 'color 0.25s ease',
                cursor: 'none',
              }}
            >
              <span style={{ color: '#6c3bff' }}>&lt;</span>
              alex.dev
              <span style={{ color: '#6c3bff' }}>/&gt;</span>
            </a>
          </MagneticButton>

          {/* Desktop links — hidden on mobile */}
          {!isMobile && (
            <ul
              role="list"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '2.5rem',
                listStyle: 'none',
                margin: 0,
                padding: 0,
              }}
            >
              {NAV_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <NavLink
                    href={href}
                    label={label}
                    onClick={(e) => handleNav(e, href)}
                  />
                </li>
              ))}
            </ul>
          )}

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Resume CTA — desktop only */}
            {!isMobile && (
              <MagneticButton strength={0.3}>
                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noreferrer noopener"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.55rem 1.25rem',
                    borderRadius: 9999,
                    border: '1px solid #6c3bff',
                    color: '#9d6fff',
                    fontSize: '0.82rem',
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 500,
                    textDecoration: 'none',
                    transition: 'background 0.3s ease, color 0.3s ease',
                    cursor: 'none',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#6c3bff'
                    e.currentTarget.style.color = '#fff'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = '#9d6fff'
                  }}
                >
                  Resume ↗
                </a>
              </MagneticButton>
            )}

            {/* Hamburger — mobile only */}
            {isMobile && (
              <HamburgerButton
                open={menuOpen}
                onClick={() => setMenuOpen((v) => !v)}
              />
            )}
          </div>
        </div>
      </nav>

      {/* ══════════ Mobile Full-Screen Menu ══════════ */}
      {menuOpen && (
        <div
          ref={menuRef}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
            /* ✅ Proper glass background */
            background: 'rgba(10, 10, 15, 0.96)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2rem',
          }}
        >
          {/* Close hint */}
          <p
            style={{
              position: 'absolute',
              top: '5rem',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.6rem',
              color: 'rgba(255,255,255,0.2)',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
            }}
          >
            TAP LINK TO NAVIGATE
          </p>

          {NAV_LINKS.map(({ label, href }, i) => (
            <a
              key={href}
              href={href}
              className="mobile-nav-link"
              onClick={(e) => handleNav(e, href)}
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 'clamp(2rem, 8vw, 3rem)',
                fontWeight: 800,
                color: '#ffffff',
                textDecoration: 'none',
                opacity: 0,               /* GSAP animates this */
                letterSpacing: '-0.02em',
                cursor: 'none',
                transition: 'color 0.25s ease',
                /* Numbered prefix */
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#9d6fff'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#ffffff'
              }}
            >
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.7rem',
                  color: '#6c3bff',
                  letterSpacing: '0.1em',
                  alignSelf: 'flex-start',
                  marginTop: '0.5rem',
                }}
              >
                0{i + 1}
              </span>
              {label}
            </a>
          ))}

          {/* Mobile resume link */}
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noreferrer noopener"
            className="mobile-nav-link"
            style={{
              marginTop: '1rem',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.75rem',
              color: '#6c3bff',
              textDecoration: 'none',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              opacity: 0,
              border: '1px solid rgba(108,59,255,0.4)',
              padding: '0.6rem 1.5rem',
              borderRadius: 9999,
              cursor: 'none',
            }}
          >
            Download Resume ↗
          </a>
        </div>
      )}
    </>
  )
}

/* ─────────────────────────────────────────
   Sub-component: Desktop Nav Link
───────────────────────────────────────── */
function NavLink({ href, label, onClick }) {
  const [hovered, setHovered] = useState(false)
  const lineRef = useRef(null)

  useEffect(() => {
    if (!lineRef.current) return
    gsap.to(lineRef.current, {
      scaleX: hovered ? 1 : 0,
      duration: 0.35,
      ease: hovered ? 'power3.out' : 'power3.in',
      transformOrigin: hovered ? 'left center' : 'right center',
    })
  }, [hovered])

  return (
    <a
      href={href}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        display: 'inline-block',
        fontFamily: "'Syne', sans-serif",
        fontSize: '0.85rem',
        fontWeight: 500,
        letterSpacing: '0.04em',
        color: hovered
          ? 'rgba(255,255,255,0.95)'
          : 'rgba(255,255,255,0.55)',
        textDecoration: 'none',
        transition: 'color 0.25s ease',
        cursor: 'none',
        paddingBottom: '2px',
      }}
    >
      {label}
      {/* Animated underline via GSAP scaleX */}
      <span
        ref={lineRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 1,
          background: '#6c3bff',
          transform: 'scaleX(0)',
          transformOrigin: 'left center',
        }}
      />
    </a>
  )
}

/* ─────────────────────────────────────────
   Sub-component: Hamburger Button
───────────────────────────────────────── */
function HamburgerButton({ open, onClick }) {
  const line1 = useRef(null)
  const line2 = useRef(null)
  const line3 = useRef(null)

  /* ✅ GSAP handles hamburger → X transform — no Tailwind needed */
  useEffect(() => {
    if (open) {
      gsap.to(line1.current, {
        rotate: 45,
        y: 6,
        duration: 0.35,
        ease: 'power3.out',
      })
      gsap.to(line2.current, {
        scaleX: 0,
        opacity: 0,
        duration: 0.2,
        ease: 'power2.out',
      })
      gsap.to(line3.current, {
        rotate: -45,
        y: -6,
        duration: 0.35,
        ease: 'power3.out',
      })
    } else {
      gsap.to([line1.current, line3.current], {
        rotate: 0,
        y: 0,
        duration: 0.35,
        ease: 'power3.out',
      })
      gsap.to(line2.current, {
        scaleX: 1,
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out',
      })
    }
  }, [open])

  return (
    <button
      onClick={onClick}
      aria-label={open ? 'Close menu' : 'Open menu'}
      aria-expanded={open}
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 5,
        padding: '0.5rem',
        background: 'none',
        border: 'none',
        cursor: 'none',
        /* ✅ Ensure it's above everything except the open menu */
        position: 'relative',
        zIndex: 1001,
      }}
    >
      {[line1, line2, line3].map((ref, i) => (
        <span
          key={i}
          ref={ref}
          aria-hidden="true"
          style={{
            display: 'block',
            width: 24,
            height: 1.5,
            background: '#ffffff',
            borderRadius: 9999,
            transformOrigin: 'center center',
            willChange: 'transform, opacity',
          }}
        />
      ))}
    </button>
  )
}