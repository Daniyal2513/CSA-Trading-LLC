import { useState, useEffect, useRef } from 'react'

// ─── Types ───────────────────────────────────────────────────────────────────

interface CounterProps {
  end: number
  suffix?: string
  prefix?: string
  duration?: number
}

// ─── Animated Counter ────────────────────────────────────────────────────────

function AnimatedCounter({ end, suffix = '', prefix = '', duration = 2000 }: CounterProps) {
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true)
        }
      },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [started])

  useEffect(() => {
    if (!started) return
    const steps = 60
    const increment = end / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [started, end, duration])

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const links = ['Home', 'About Us', 'Services', 'Testimonials', 'Contact Us']

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled
          ? 'rgba(7, 11, 20, 0.92)'
          : 'rgba(7, 11, 20, 0.4)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: scrolled ? '1px solid rgba(0, 212, 255, 0.12)' : '1px solid transparent',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <a href="#home" className="flex items-center gap-2.5 group">
          <div
            className="w-8 h-8 flex items-center justify-center"
            style={{
              border: '1.5px solid rgba(0, 212, 255, 0.6)',
              background: 'rgba(0, 212, 255, 0.08)',
              clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
            }}
          >
            <span
              className="text-xs font-bold"
              style={{ fontFamily: "'Exo 2', sans-serif", color: '#00d4ff', letterSpacing: '0.05em' }}
            >
              C
            </span>
          </div>
          <span
            className="text-sm font-bold tracking-widest uppercase"
            style={{ fontFamily: "'Exo 2', sans-serif", color: '#e8edf5', letterSpacing: '0.18em' }}
          >
            CSA<span style={{ color: '#00d4ff' }}>.</span>TRADING
          </span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-sm transition-all duration-200"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 400,
                color: '#7a8499',
                letterSpacing: '0.04em',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#e8edf5')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#7a8499')}
            >
              {link}
            </a>
          ))}
        </div>

        {/* CTA */}
        <button
          className="hidden md:flex items-center gap-2 text-sm font-medium transition-all duration-200"
          style={{
            fontFamily: "'Exo 2', sans-serif",
            fontWeight: 600,
            color: '#070b14',
            background: '#00d4ff',
            padding: '8px 20px',
            letterSpacing: '0.06em',
            border: 'none',
            cursor: 'pointer',
            clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#33dcff'
            e.currentTarget.style.boxShadow = '0 0 24px rgba(0, 212, 255, 0.5)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#00d4ff'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          Let's Talk
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6h8M7 3l3 3-3 3" stroke="#070b14" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Mobile burger */}
        <button
          className="md:hidden p-2"
          style={{ color: '#00d4ff', background: 'none', border: 'none', cursor: 'pointer' }}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <div className="flex flex-col gap-1.5 w-5">
            <span
              className="block h-px transition-all duration-200"
              style={{
                background: '#00d4ff',
                transform: menuOpen ? 'rotate(45deg) translateY(5px)' : 'none',
              }}
            />
            <span
              className="block h-px transition-all duration-200"
              style={{
                background: '#00d4ff',
                opacity: menuOpen ? 0 : 1,
              }}
            />
            <span
              className="block h-px transition-all duration-200"
              style={{
                background: '#00d4ff',
                transform: menuOpen ? 'rotate(-45deg) translateY(-5px)' : 'none',
              }}
            />
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          className="md:hidden"
          style={{
            background: 'rgba(7, 11, 20, 0.97)',
            borderTop: '1px solid rgba(0, 212, 255, 0.1)',
            padding: '1.5rem 1.5rem',
          }}
        >
          <div className="flex flex-col gap-4">
            {links.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-sm"
                style={{ fontFamily: "'DM Sans', sans-serif", color: '#7a8499' }}
                onClick={() => setMenuOpen(false)}
              >
                {link}
              </a>
            ))}
            <button
              className="text-sm font-semibold mt-2"
              style={{
                fontFamily: "'Exo 2', sans-serif",
                color: '#070b14',
                background: '#00d4ff',
                padding: '10px 20px',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Let's Talk
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}

// ─── Hero Section ─────────────────────────────────────────────────────────────

function Hero() {
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 2800)
    return () => clearInterval(id)
  }, [])

  const metrics = [
    { label: 'Client Revenue Generated', value: '$4.8M+', delta: '+23% MoM', positive: true },
    { label: 'Avg. ROI Delivered', value: '312%', delta: '+18% vs industry', positive: true },
    { label: 'Active Campaigns', value: '94', delta: 'Live now', positive: true },
    { label: 'Conversion Rate', value: '8.4%', delta: '+2.1pp', positive: true },
  ]

  const liveItems = [
    'Campaign "BlackFriday24" converting at 11.2%',
    'New lead captured — finance vertical',
    'ROI milestone: $50K cleared for client #7',
    'A/B test concluded — variant B +34% CTR',
    'Brand audit complete — 3 opportunities flagged',
  ]

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center grid-bg overflow-hidden"
      style={{ paddingTop: '80px' }}
    >
      {/* Background radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 70% 50%, rgba(0, 212, 255, 0.06) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 w-full py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left: Typography */}
          <div className="space-y-8">
            <div
              className="inline-flex items-center gap-2 text-xs font-medium tracking-widest uppercase"
              style={{
                fontFamily: "'Exo 2', sans-serif",
                color: '#00d4ff',
                border: '1px solid rgba(0, 212, 255, 0.25)',
                padding: '6px 14px',
                background: 'rgba(0, 212, 255, 0.06)',
                letterSpacing: '0.15em',
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: '#00d4ff', animation: 'pulse-cyan 2s ease-in-out infinite' }}
              />
              Digital Marketing & Web Development
            </div>

            <h1
              className="leading-none"
              style={{ fontFamily: "'Exo 2', sans-serif" }}
            >
              <span
                className="block text-5xl lg:text-7xl font-extrabold"
                style={{ color: '#e8edf5', letterSpacing: '-0.02em', lineHeight: 1.05 }}
              >
                Scale Your
              </span>
              <span
                className="block text-5xl lg:text-7xl font-extrabold glow-cyan"
                style={{ color: '#00d4ff', letterSpacing: '-0.02em', lineHeight: 1.05 }}
              >
                Brand With
              </span>
              <span
                className="block text-5xl lg:text-7xl font-extrabold"
                style={{ color: '#e8edf5', letterSpacing: '-0.02em', lineHeight: 1.05 }}
              >
                Precision.
              </span>
            </h1>

            <p
              className="text-lg max-w-md leading-relaxed"
              style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, color: '#7a8499' }}
            >
              CSA Trading LLC engineers high-performance digital marketing systems and
              world-class web experiences that convert traffic into measurable revenue.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                className="flex items-center gap-2 text-sm font-semibold transition-all duration-200"
                style={{
                  fontFamily: "'Exo 2', sans-serif",
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  color: '#070b14',
                  background: '#00d4ff',
                  padding: '14px 28px',
                  border: 'none',
                  cursor: 'pointer',
                  clipPath: 'polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 32px rgba(0, 212, 255, 0.6)'
                  e.currentTarget.style.background = '#33dcff'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none'
                  e.currentTarget.style.background = '#00d4ff'
                }}
              >
                Get Started
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7h10M8 3l4 4-4 4" stroke="#070b14" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              <button
                className="flex items-center gap-2 text-sm font-medium transition-all duration-200"
                style={{
                  fontFamily: "'Exo 2', sans-serif",
                  fontWeight: 500,
                  letterSpacing: '0.06em',
                  color: '#e8edf5',
                  background: 'transparent',
                  padding: '14px 28px',
                  border: '1px solid rgba(255,255,255,0.12)',
                  cursor: 'pointer',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.4)'
                  e.currentTarget.style.color = '#00d4ff'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'
                  e.currentTarget.style.color = '#e8edf5'
                }}
              >
                View Our Work
              </button>
            </div>

            {/* Social proof numbers */}
            <div className="flex items-center gap-8 pt-2">
              {[
                { num: '200+', label: 'Clients Served' },
                { num: '98%', label: 'Satisfaction Rate' },
                { num: '5yr', label: 'Industry Expertise' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div
                    className="text-2xl font-bold"
                    style={{ fontFamily: "'Exo 2', sans-serif", color: '#00d4ff' }}
                  >
                    {stat.num}
                  </div>
                  <div
                    className="text-xs mt-0.5"
                    style={{ fontFamily: "'DM Sans', sans-serif", color: '#3a4255', letterSpacing: '0.04em' }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Glassmorphism Dashboard */}
          <div className="relative" style={{ animation: 'float 6s ease-in-out infinite' }}>
            <div
              className="glass rounded-none p-6 relative overflow-hidden"
              style={{
                border: '1px solid rgba(0, 212, 255, 0.2)',
                background: 'rgba(13, 20, 34, 0.8)',
                backdropFilter: 'blur(20px)',
              }}
            >
              {/* Scan line animation */}
              <div
                className="absolute inset-x-0 h-px pointer-events-none"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.6), transparent)',
                  animation: 'scan-line 4s linear infinite',
                  top: 0,
                }}
              />

              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div
                    className="text-xs font-semibold tracking-widest uppercase mb-1"
                    style={{ fontFamily: "'Exo 2', sans-serif", color: '#00d4ff', letterSpacing: '0.14em' }}
                  >
                    Live Marketing Dashboard
                  </div>
                  <div
                    className="text-xs"
                    style={{ fontFamily: "'DM Sans', sans-serif", color: '#3a4255' }}
                  >
                    Real-time client performance
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ background: '#00d4ff', animation: 'pulse-cyan 1.5s ease-in-out infinite' }}
                  />
                  <span
                    className="text-xs"
                    style={{ fontFamily: "'Exo 2', sans-serif", color: '#00d4ff', letterSpacing: '0.1em' }}
                  >
                    LIVE
                  </span>
                </div>
              </div>

              {/* Metrics grid */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                {metrics.map((m) => (
                  <div
                    key={m.label}
                    className="p-4"
                    style={{
                      background: 'rgba(0, 212, 255, 0.04)',
                      border: '1px solid rgba(0, 212, 255, 0.1)',
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0, 212, 255, 0.3)'
                      ;(e.currentTarget as HTMLElement).style.background = 'rgba(0, 212, 255, 0.08)'
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0, 212, 255, 0.1)'
                      ;(e.currentTarget as HTMLElement).style.background = 'rgba(0, 212, 255, 0.04)'
                    }}
                  >
                    <div
                      className="text-xl font-bold mb-1"
                      style={{ fontFamily: "'Exo 2', sans-serif", color: '#e8edf5' }}
                    >
                      {m.value}
                    </div>
                    <div
                      className="text-xs mb-2"
                      style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, color: '#3a4255' }}
                    >
                      {m.label}
                    </div>
                    <div
                      className="text-xs font-medium"
                      style={{ fontFamily: "'Exo 2', sans-serif", color: '#00d4ff' }}
                    >
                      ↑ {m.delta}
                    </div>
                  </div>
                ))}
              </div>

              {/* Live feed */}
              <div
                className="text-xs mb-3 font-semibold tracking-widest uppercase"
                style={{ fontFamily: "'Exo 2', sans-serif", color: '#3a4255', letterSpacing: '0.12em' }}
              >
                Live Activity Feed
              </div>
              <div className="space-y-2 overflow-hidden" style={{ height: '96px' }}>
                {liveItems.slice(tick % liveItems.length, (tick % liveItems.length) + 3).concat(
                  liveItems.slice(0, Math.max(0, 3 - (liveItems.length - (tick % liveItems.length))))
                ).map((item, i) => (
                  <div
                    key={`${tick}-${i}`}
                    className="flex items-center gap-2 text-xs"
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 300,
                      color: i === 0 ? '#7a8499' : '#3a4255',
                      animation: i === 0 ? 'slide-in-left 0.4s ease-out' : 'none',
                    }}
                  >
                    <span
                      className="w-1 h-1 rounded-full flex-shrink-0"
                      style={{ background: i === 0 ? '#00d4ff' : '#3a4255' }}
                    />
                    {item}
                  </div>
                ))}
              </div>

              {/* Bottom bar */}
              <div
                className="flex items-center justify-between mt-4 pt-4"
                style={{ borderTop: '1px solid rgba(0, 212, 255, 0.08)' }}
              >
                <div
                  className="text-xs"
                  style={{ fontFamily: "'DM Sans', sans-serif", color: '#3a4255' }}
                >
                  Updated 2s ago
                </div>
                <div className="flex items-center gap-1.5">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="w-6"
                      style={{
                        height: `${[12, 20, 16, 24, 18][i]}px`,
                        background: i < 3 ? '#00d4ff' : 'rgba(0, 212, 255, 0.2)',
                        transition: 'height 0.3s ease',
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Corner accent */}
            <div
              className="absolute -top-px -right-px w-12 h-12 pointer-events-none"
              style={{
                background: 'linear-gradient(135deg, #00d4ff 0%, transparent 60%)',
                opacity: 0.6,
                clipPath: 'polygon(100% 0%, 0% 0%, 100% 100%)',
              }}
            />
            <div
              className="absolute -bottom-px -left-px w-8 h-8 pointer-events-none"
              style={{
                background: 'linear-gradient(315deg, #00d4ff 0%, transparent 60%)',
                opacity: 0.4,
                clipPath: 'polygon(0% 100%, 0% 0%, 100% 100%)',
              }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── About Section ────────────────────────────────────────────────────────────

function About() {
  return (
    <section id="about-us" className="relative py-32 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 50% 60% at 20% 50%, rgba(0, 212, 255, 0.04) 0%, transparent 70%)',
        }}
      />
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

          {/* Left: Geometric wireframe */}
          <div className="relative h-80 lg:h-96 order-2 lg:order-1">
            <svg
              viewBox="0 0 400 380"
              className="w-full h-full"
              style={{ opacity: 0.8 }}
            >
              {/* Outer hexagon */}
              <polygon
                points="200,20 360,110 360,270 200,360 40,270 40,110"
                fill="none"
                stroke="rgba(0, 212, 255, 0.2)"
                strokeWidth="1"
              />
              {/* Mid hexagon */}
              <polygon
                points="200,60 320,130 320,250 200,320 80,250 80,130"
                fill="none"
                stroke="rgba(0, 212, 255, 0.12)"
                strokeWidth="1"
              />
              {/* Inner hexagon */}
              <polygon
                points="200,100 280,150 280,230 200,280 120,230 120,150"
                fill="none"
                stroke="rgba(0, 212, 255, 0.3)"
                strokeWidth="1.5"
              />
              {/* Cross lines */}
              <line x1="200" y1="20" x2="200" y2="360" stroke="rgba(0, 212, 255, 0.08)" strokeWidth="1"/>
              <line x1="40" y1="110" x2="360" y2="270" stroke="rgba(0, 212, 255, 0.08)" strokeWidth="1"/>
              <line x1="360" y1="110" x2="40" y2="270" stroke="rgba(0, 212, 255, 0.08)" strokeWidth="1"/>
              {/* Corner dots */}
              {[[200,20],[360,110],[360,270],[200,360],[40,270],[40,110]].map(([cx,cy], i) => (
                <circle key={i} cx={cx} cy={cy} r="3" fill="rgba(0, 212, 255, 0.6)" />
              ))}
              {/* Center circle */}
              <circle cx="200" cy="190" r="30" fill="none" stroke="rgba(0, 212, 255, 0.4)" strokeWidth="1.5"/>
              <circle cx="200" cy="190" r="4" fill="#00d4ff" />
              {/* Floating data points */}
              <circle cx="160" cy="150" r="2" fill="rgba(0, 212, 255, 0.5)"/>
              <circle cx="240" cy="150" r="2" fill="rgba(0, 212, 255, 0.5)"/>
              <circle cx="160" cy="230" r="2" fill="rgba(0, 212, 255, 0.5)"/>
              <circle cx="240" cy="230" r="2" fill="rgba(0, 212, 255, 0.5)"/>
              {/* Lines to center */}
              <line x1="160" y1="150" x2="200" y2="190" stroke="rgba(0, 212, 255, 0.2)" strokeWidth="1"/>
              <line x1="240" y1="150" x2="200" y2="190" stroke="rgba(0, 212, 255, 0.2)" strokeWidth="1"/>
              <line x1="160" y1="230" x2="200" y2="190" stroke="rgba(0, 212, 255, 0.2)" strokeWidth="1"/>
              <line x1="240" y1="230" x2="200" y2="190" stroke="rgba(0, 212, 255, 0.2)" strokeWidth="1"/>
              {/* Labels */}
              <text x="85" y="105" fill="rgba(0, 212, 255, 0.5)" fontSize="9" fontFamily="'Exo 2', sans-serif" letterSpacing="1">STRATEGY</text>
              <text x="280" y="105" fill="rgba(0, 212, 255, 0.5)" fontSize="9" fontFamily="'Exo 2', sans-serif" letterSpacing="1">GROWTH</text>
              <text x="62" y="280" fill="rgba(0, 212, 255, 0.5)" fontSize="9" fontFamily="'Exo 2', sans-serif" letterSpacing="1">ANALYTICS</text>
              <text x="280" y="280" fill="rgba(0, 212, 255, 0.5)" fontSize="9" fontFamily="'Exo 2', sans-serif" letterSpacing="1">SCALE</text>
            </svg>
          </div>

          {/* Right: Narrative */}
          <div className="space-y-8 order-1 lg:order-2">
            <div>
              <div
                className="text-xs font-semibold tracking-widest uppercase mb-4"
                style={{ fontFamily: "'Exo 2', sans-serif", color: '#00d4ff', letterSpacing: '0.18em' }}
              >
                — About Us
              </div>
              <h2
                className="text-4xl lg:text-5xl font-extrabold leading-tight mb-6"
                style={{ fontFamily: "'Exo 2', sans-serif", color: '#e8edf5', letterSpacing: '-0.02em' }}
              >
                Built for Brands
                <br />
                <span style={{ color: '#00d4ff' }}>That Mean Business.</span>
              </h2>
              <p
                className="text-base leading-loose mb-6"
                style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, color: '#7a8499' }}
              >
                CSA Trading LLC was founded on one conviction: results are the only language
                that matters in business. We combine data-driven marketing intelligence with
                precision web engineering to build systems that generate compounding returns —
                not just impressions.
              </p>
              <p
                className="text-base leading-loose"
                style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, color: '#7a8499' }}
              >
                Every strategy we deploy is backed by real-time analytics, tested assumptions,
                and a team obsessed with scaling what works. We don't guess — we measure,
                iterate, and execute.
              </p>
            </div>

            {/* Pillars */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              {[
                { icon: '◈', title: 'Data First', desc: 'Every decision is evidence-backed' },
                { icon: '◇', title: 'Precision Execution', desc: 'No wasted budget, no wasted effort' },
                { icon: '◉', title: 'Scalable Systems', desc: 'Built to compound, not plateau' },
                { icon: '▲', title: 'Full Transparency', desc: 'Real-time reporting, no black boxes' },
              ].map((p) => (
                <div
                  key={p.title}
                  className="p-4 transition-all duration-200"
                  style={{
                    border: '1px solid rgba(0, 212, 255, 0.1)',
                    background: 'rgba(0, 212, 255, 0.02)',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0, 212, 255, 0.25)'
                    ;(e.currentTarget as HTMLElement).style.background = 'rgba(0, 212, 255, 0.05)'
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0, 212, 255, 0.1)'
                    ;(e.currentTarget as HTMLElement).style.background = 'rgba(0, 212, 255, 0.02)'
                  }}
                >
                  <div className="text-lg mb-2" style={{ color: '#00d4ff' }}>{p.icon}</div>
                  <div
                    className="text-sm font-semibold mb-1"
                    style={{ fontFamily: "'Exo 2', sans-serif", color: '#e8edf5' }}
                  >
                    {p.title}
                  </div>
                  <div
                    className="text-xs"
                    style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, color: '#3a4255' }}
                  >
                    {p.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Services Section ─────────────────────────────────────────────────────────

function Services() {
  const services = [
    {
      num: '01',
      title: 'Digital Marketing',
      desc: 'Full-funnel performance campaigns across paid search, social, and programmatic — engineered for maximum ROI with real-time budget optimization.',
      tags: ['PPC', 'SEO', 'Social Ads', 'Email'],
      wide: true,
    },
    {
      num: '02',
      title: 'Web Development',
      desc: 'High-performance web applications and marketing websites built for speed, conversion, and scale.',
      tags: ['React', 'Next.js', 'Node', 'CMS'],
      wide: false,
    },
    {
      num: '03',
      title: 'Brand Scaling',
      desc: 'Strategic brand architecture and growth systems that turn early traction into market dominance.',
      tags: ['Identity', 'Positioning', 'Growth'],
      wide: false,
    },
    {
      num: '04',
      title: 'UI/UX Architecture',
      desc: 'Conversion-optimized interfaces that reduce friction, build trust, and drive measurable action at every touchpoint.',
      tags: ['UX Research', 'Prototyping', 'CRO', 'Systems'],
      wide: true,
    },
  ]

  return (
    <section id="services" className="relative py-32">
      <div
        className="absolute inset-0 pointer-events-none grid-bg"
        style={{ opacity: 0.4 }}
      />
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <div
            className="text-xs font-semibold tracking-widest uppercase mb-4"
            style={{ fontFamily: "'Exo 2', sans-serif", color: '#00d4ff', letterSpacing: '0.18em' }}
          >
            — What We Do
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <h2
              className="text-4xl lg:text-5xl font-extrabold leading-tight"
              style={{ fontFamily: "'Exo 2', sans-serif", color: '#e8edf5', letterSpacing: '-0.02em' }}
            >
              Services Built to
              <br />
              <span style={{ color: '#00d4ff' }}>Perform.</span>
            </h2>
            <p
              className="text-sm max-w-xs leading-loose"
              style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, color: '#3a4255' }}
            >
              Every service is a system — designed to compound results over time, not deliver one-off wins.
            </p>
          </div>
        </div>

        {/* Asymmetric grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ background: 'rgba(0, 212, 255, 0.08)' }}>
          {/* Row 1: Wide + Narrow */}
          <div
            className="md:col-span-2 p-8 group transition-all duration-300 cursor-pointer"
            style={{ background: '#070b14' }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(13, 20, 34, 1)'
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = '#070b14'
            }}
          >
            <ServiceCardContent service={services[0]} />
          </div>
          <div
            className="p-8 group transition-all duration-300 cursor-pointer"
            style={{ background: '#070b14' }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(13, 20, 34, 1)'
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = '#070b14'
            }}
          >
            <ServiceCardContent service={services[1]} />
          </div>
          {/* Row 2: Narrow + Wide */}
          <div
            className="p-8 group transition-all duration-300 cursor-pointer"
            style={{ background: '#070b14' }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(13, 20, 34, 1)'
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = '#070b14'
            }}
          >
            <ServiceCardContent service={services[2]} />
          </div>
          <div
            className="md:col-span-2 p-8 group transition-all duration-300 cursor-pointer"
            style={{ background: '#070b14' }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(13, 20, 34, 1)'
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = '#070b14'
            }}
          >
            <ServiceCardContent service={services[3]} />
          </div>
        </div>
      </div>
    </section>
  )
}

function ServiceCardContent({ service }: { service: { num: string; title: string; desc: string; tags: string[] } }) {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-start justify-between mb-6">
        <span
          className="text-xs font-bold tracking-widest"
          style={{ fontFamily: "'Exo 2', sans-serif", color: 'rgba(0, 212, 255, 0.3)', letterSpacing: '0.2em' }}
        >
          {service.num}
        </span>
        <div
          className="w-8 h-8 flex items-center justify-center transition-all duration-200"
          style={{
            border: '1px solid rgba(0, 212, 255, 0.2)',
            color: '#00d4ff',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 7h10M8 3l4 4-4 4" stroke="#00d4ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      <h3
        className="text-xl font-bold mb-3"
        style={{ fontFamily: "'Exo 2', sans-serif", color: '#e8edf5', letterSpacing: '-0.01em' }}
      >
        {service.title}
      </h3>
      <p
        className="text-sm leading-loose flex-1 mb-6"
        style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, color: '#7a8499' }}
      >
        {service.desc}
      </p>

      <div className="flex flex-wrap gap-2">
        {service.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs px-2 py-1"
            style={{
              fontFamily: "'Exo 2', sans-serif",
              color: 'rgba(0, 212, 255, 0.6)',
              border: '1px solid rgba(0, 212, 255, 0.12)',
              letterSpacing: '0.08em',
              background: 'rgba(0, 212, 255, 0.03)',
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}

// ─── Stats Band ───────────────────────────────────────────────────────────────

function StatsBand() {
  return (
    <section
      className="relative py-16 overflow-hidden"
      style={{ background: 'rgba(0, 212, 255, 0.03)', borderTop: '1px solid rgba(0, 212, 255, 0.08)', borderBottom: '1px solid rgba(0, 212, 255, 0.08)' }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { end: 200, suffix: '+', label: 'Brands Scaled' },
            { end: 312, suffix: '%', label: 'Average ROI' },
            { end: 4800000, prefix: '$', suffix: '+', label: 'Revenue Generated' },
            { end: 98, suffix: '%', label: 'Client Retention' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div
                className="text-4xl font-extrabold mb-2"
                style={{ fontFamily: "'Exo 2', sans-serif", color: '#00d4ff' }}
              >
                <AnimatedCounter end={stat.end} suffix={stat.suffix} prefix={stat.prefix} />
              </div>
              <div
                className="text-xs uppercase tracking-widest"
                style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, color: '#3a4255', letterSpacing: '0.14em' }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Testimonials Section ─────────────────────────────────────────────────────

function Testimonials() {
  const [active, setActive] = useState(0)

  const testimonials = [
    {
      quote: "CSA Trading didn't just run our ads — they rebuilt our entire acquisition engine. ROI went from 180% to 340% in 90 days. The transparency and precision are unlike any agency we've worked with.",
      name: 'Marcus Reid',
      role: 'CEO',
      company: 'Apex Commerce Group',
      initials: 'MR',
      result: '+340% ROI',
    },
    {
      quote: "Our new website converted 3× better within the first month of launch. Their team understood both the technical architecture and the conversion psychology. Exceptional work.",
      name: 'Sophia Nakamura',
      role: 'Head of Growth',
      company: 'Prism Fintech',
      initials: 'SN',
      result: '3× Conversions',
    },
    {
      quote: "In eight months, CSA took us from a regional player to a nationally recognized brand. Their brand scaling framework is systematic, intelligent, and built for sustainable growth.",
      name: 'David Okafor',
      role: 'Founder',
      company: 'Meridian Health Co.',
      initials: 'DO',
      result: '8mo Brand Scale',
    },
    {
      quote: "The UI/UX overhaul reduced our bounce rate by 38% and increased checkout completions by 52%. Every decision was backed by data and tested before deployment. Brilliant process.",
      name: 'Layla Chen',
      role: 'VP Product',
      company: 'Stellar Retail',
      initials: 'LC',
      result: '−38% Bounce Rate',
    },
  ]

  return (
    <section id="testimonials" className="relative py-32 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 50% 60% at 80% 50%, rgba(0, 212, 255, 0.04) 0%, transparent 70%)',
        }}
      />
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <div
            className="text-xs font-semibold tracking-widest uppercase mb-4"
            style={{ fontFamily: "'Exo 2', sans-serif", color: '#00d4ff', letterSpacing: '0.18em' }}
          >
            — Client Results
          </div>
          <h2
            className="text-4xl lg:text-5xl font-extrabold leading-tight"
            style={{ fontFamily: "'Exo 2', sans-serif", color: '#e8edf5', letterSpacing: '-0.02em' }}
          >
            Proof, Not Promises.
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active testimonial */}
          <div
            className="lg:col-span-2 p-8 relative overflow-hidden"
            style={{
              background: 'rgba(13, 20, 34, 0.8)',
              border: '1px solid rgba(0, 212, 255, 0.2)',
            }}
          >
            <div
              className="text-5xl font-black mb-6 leading-none"
              style={{ fontFamily: "'Exo 2', sans-serif", color: 'rgba(0, 212, 255, 0.15)' }}
            >
              "
            </div>
            <p
              className="text-lg leading-loose mb-8"
              style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, color: '#e8edf5' }}
            >
              {testimonials[active].quote}
            </p>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div
                  className="w-11 h-11 flex items-center justify-center text-sm font-bold"
                  style={{
                    fontFamily: "'Exo 2', sans-serif",
                    background: 'rgba(0, 212, 255, 0.12)',
                    border: '1px solid rgba(0, 212, 255, 0.3)',
                    color: '#00d4ff',
                  }}
                >
                  {testimonials[active].initials}
                </div>
                <div>
                  <div
                    className="text-sm font-semibold"
                    style={{ fontFamily: "'Exo 2', sans-serif", color: '#e8edf5' }}
                  >
                    {testimonials[active].name}
                  </div>
                  <div
                    className="text-xs mt-0.5"
                    style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, color: '#3a4255' }}
                  >
                    {testimonials[active].role}, {testimonials[active].company}
                  </div>
                </div>
              </div>
              <div
                className="text-sm font-bold px-4 py-2"
                style={{
                  fontFamily: "'Exo 2', sans-serif",
                  color: '#00d4ff',
                  border: '1px solid rgba(0, 212, 255, 0.25)',
                  background: 'rgba(0, 212, 255, 0.06)',
                  letterSpacing: '0.06em',
                }}
              >
                {testimonials[active].result}
              </div>
            </div>
          </div>

          {/* Selector list */}
          <div className="flex flex-col gap-3">
            {testimonials.map((t, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className="p-5 text-left transition-all duration-200"
                style={{
                  background: active === i ? 'rgba(0, 212, 255, 0.06)' : 'rgba(13, 20, 34, 0.4)',
                  border: active === i ? '1px solid rgba(0, 212, 255, 0.3)' : '1px solid rgba(0, 212, 255, 0.08)',
                  cursor: 'pointer',
                }}
              >
                <div
                  className="text-xs font-semibold mb-1"
                  style={{
                    fontFamily: "'Exo 2', sans-serif",
                    color: active === i ? '#00d4ff' : '#3a4255',
                    letterSpacing: '0.04em',
                  }}
                >
                  {t.name}
                </div>
                <div
                  className="text-xs"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 300,
                    color: active === i ? '#7a8499' : '#3a4255',
                  }}
                >
                  {t.company}
                </div>
                <div
                  className="text-xs font-bold mt-2"
                  style={{
                    fontFamily: "'Exo 2', sans-serif",
                    color: active === i ? '#00d4ff' : 'rgba(0, 212, 255, 0.2)',
                  }}
                >
                  {t.result}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Contact Section ──────────────────────────────────────────────────────────

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '' })
  const [focused, setFocused] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const fields = [
    { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Marcus Reid' },
    { key: 'email', label: 'Email Address', type: 'email', placeholder: 'marcus@company.com' },
    { key: 'company', label: 'Company', type: 'text', placeholder: 'Apex Commerce Group' },
  ]

  return (
    <section id="contact-us" className="relative py-32">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 40% 50% at 50% 50%, rgba(0, 212, 255, 0.04) 0%, transparent 70%)',
        }}
      />
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">

          {/* Left */}
          <div className="space-y-8">
            <div>
              <div
                className="text-xs font-semibold tracking-widest uppercase mb-4"
                style={{ fontFamily: "'Exo 2', sans-serif", color: '#00d4ff', letterSpacing: '0.18em' }}
              >
                — Get In Touch
              </div>
              <h2
                className="text-4xl lg:text-5xl font-extrabold leading-tight mb-6"
                style={{ fontFamily: "'Exo 2', sans-serif", color: '#e8edf5', letterSpacing: '-0.02em' }}
              >
                Ready to Scale
                <br />
                <span style={{ color: '#00d4ff' }}>Intelligently?</span>
              </h2>
              <p
                className="text-base leading-loose"
                style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, color: '#7a8499' }}
              >
                Tell us about your brand and goals. We'll respond within 24 hours with a
                preliminary analysis and a roadmap tailored specifically to your situation.
              </p>
            </div>

            {/* Contact info */}
            <div className="space-y-4 pt-4">
              {[
                { icon: '◉', label: 'Email', value: 'contact@csatrading.com' },
                { icon: '◈', label: 'Location', value: 'Global · Remote-First Agency' },
                { icon: '▲', label: 'Response Time', value: 'Within 24 hours, guaranteed' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-4">
                  <div
                    className="w-9 h-9 flex items-center justify-center text-sm flex-shrink-0"
                    style={{
                      border: '1px solid rgba(0, 212, 255, 0.2)',
                      color: '#00d4ff',
                      background: 'rgba(0, 212, 255, 0.04)',
                    }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <div
                      className="text-xs uppercase tracking-widest mb-0.5"
                      style={{ fontFamily: "'Exo 2', sans-serif", color: '#3a4255', letterSpacing: '0.12em' }}
                    >
                      {item.label}
                    </div>
                    <div
                      className="text-sm"
                      style={{ fontFamily: "'DM Sans', sans-serif", color: '#7a8499' }}
                    >
                      {item.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Form */}
          <div>
            {submitted ? (
              <div
                className="h-full flex flex-col items-center justify-center text-center p-12"
                style={{
                  border: '1px solid rgba(0, 212, 255, 0.2)',
                  background: 'rgba(0, 212, 255, 0.03)',
                }}
              >
                <div className="text-4xl mb-4" style={{ color: '#00d4ff' }}>◎</div>
                <h3
                  className="text-2xl font-bold mb-3"
                  style={{ fontFamily: "'Exo 2', sans-serif", color: '#e8edf5' }}
                >
                  Message Received.
                </h3>
                <p
                  className="text-sm"
                  style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, color: '#7a8499' }}
                >
                  We'll be in touch within 24 hours with your tailored analysis.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {fields.map(({ key, label, type, placeholder }) => (
                  <div key={key} className="relative">
                    <label
                      className="block text-xs font-semibold tracking-widest uppercase mb-2 transition-all duration-200"
                      style={{
                        fontFamily: "'Exo 2', sans-serif",
                        color: focused === key ? '#00d4ff' : '#3a4255',
                        letterSpacing: '0.12em',
                      }}
                    >
                      {label}
                    </label>
                    <input
                      type={type}
                      value={form[key as keyof typeof form]}
                      placeholder={placeholder}
                      required
                      onFocus={() => setFocused(key)}
                      onBlur={() => setFocused(null)}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      className="w-full text-sm px-4 py-3 transition-all duration-200 outline-none"
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontWeight: 300,
                        color: '#e8edf5',
                        background: 'rgba(13, 20, 34, 0.8)',
                        border: focused === key
                          ? '1px solid rgba(0, 212, 255, 0.5)'
                          : '1px solid rgba(0, 212, 255, 0.12)',
                        boxShadow: focused === key ? '0 0 12px rgba(0, 212, 255, 0.1)' : 'none',
                        borderRadius: 0,
                      }}
                    />
                  </div>
                ))}

                <div>
                  <label
                    className="block text-xs font-semibold tracking-widest uppercase mb-2 transition-all duration-200"
                    style={{
                      fontFamily: "'Exo 2', sans-serif",
                      color: focused === 'message' ? '#00d4ff' : '#3a4255',
                      letterSpacing: '0.12em',
                    }}
                  >
                    Message
                  </label>
                  <textarea
                    value={form.message}
                    placeholder="Tell us about your brand, current challenges, and what growth looks like for you..."
                    required
                    rows={5}
                    onFocus={() => setFocused('message')}
                    onBlur={() => setFocused(null)}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full text-sm px-4 py-3 transition-all duration-200 outline-none resize-none"
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 300,
                      color: '#e8edf5',
                      background: 'rgba(13, 20, 34, 0.8)',
                      border: focused === 'message'
                        ? '1px solid rgba(0, 212, 255, 0.5)'
                        : '1px solid rgba(0, 212, 255, 0.12)',
                      boxShadow: focused === 'message' ? '0 0 12px rgba(0, 212, 255, 0.1)' : 'none',
                      borderRadius: 0,
                    }}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 text-sm font-bold tracking-widest uppercase transition-all duration-200"
                  style={{
                    fontFamily: "'Exo 2', sans-serif",
                    color: '#070b14',
                    background: '#00d4ff',
                    border: 'none',
                    cursor: 'pointer',
                    letterSpacing: '0.14em',
                    clipPath: 'polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#33dcff'
                    e.currentTarget.style.boxShadow = '0 0 32px rgba(0, 212, 255, 0.5)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#00d4ff'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  Send Message →
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  const navLinks = ['Home', 'About Us', 'Services', 'Testimonials', 'Contact Us']
  const socials = [
    { name: 'LinkedIn', icon: 'in', href: '#' },
    { name: 'Twitter', icon: 'X', href: '#' },
    { name: 'Instagram', icon: 'ig', href: '#' },
  ]

  return (
    <footer
      className="relative pt-16 pb-8"
      style={{
        borderTop: '1px solid rgba(0, 212, 255, 0.1)',
        background: 'rgba(7, 11, 20, 0.98)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div
                className="w-7 h-7 flex items-center justify-center"
                style={{
                  border: '1.5px solid rgba(0, 212, 255, 0.5)',
                  background: 'rgba(0, 212, 255, 0.06)',
                  clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                }}
              >
                <span className="text-xs font-bold" style={{ fontFamily: "'Exo 2'", color: '#00d4ff' }}>C</span>
              </div>
              <span
                className="text-sm font-bold tracking-widest"
                style={{ fontFamily: "'Exo 2', sans-serif", color: '#e8edf5', letterSpacing: '0.16em' }}
              >
                CSA<span style={{ color: '#00d4ff' }}>.</span>TRADING
              </span>
            </div>
            <p
              className="text-xs leading-loose max-w-xs"
              style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, color: '#3a4255' }}
            >
              Digital marketing and web development agency engineered for brands that demand measurable results.
            </p>
            <div className="flex items-center gap-3">
              {socials.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  className="w-8 h-8 flex items-center justify-center text-xs font-bold transition-all duration-200"
                  style={{
                    fontFamily: "'Exo 2', sans-serif",
                    border: '1px solid rgba(0, 212, 255, 0.15)',
                    color: '#3a4255',
                    background: 'transparent',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0, 212, 255, 0.5)'
                    ;(e.currentTarget as HTMLElement).style.color = '#00d4ff'
                    ;(e.currentTarget as HTMLElement).style.background = 'rgba(0, 212, 255, 0.06)'
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0, 212, 255, 0.15)'
                    ;(e.currentTarget as HTMLElement).style.color = '#3a4255'
                    ;(e.currentTarget as HTMLElement).style.background = 'transparent'
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <div
              className="text-xs font-bold uppercase tracking-widest mb-5"
              style={{ fontFamily: "'Exo 2', sans-serif", color: '#3a4255', letterSpacing: '0.16em' }}
            >
              Navigation
            </div>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-sm transition-all duration-150"
                    style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, color: '#3a4255', textDecoration: 'none' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#7a8499')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#3a4255')}
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div>
            <div
              className="text-xs font-bold uppercase tracking-widest mb-5"
              style={{ fontFamily: "'Exo 2', sans-serif", color: '#3a4255', letterSpacing: '0.16em' }}
            >
              Ready to Grow?
            </div>
            <p
              className="text-xs leading-loose mb-5"
              style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, color: '#3a4255' }}
            >
              Join 200+ brands scaling intelligently with CSA Trading LLC.
            </p>
            <a
              href="#contact-us"
              className="inline-block text-xs font-bold uppercase tracking-widest py-3 px-6 transition-all duration-200"
              style={{
                fontFamily: "'Exo 2', sans-serif",
                color: '#070b14',
                background: '#00d4ff',
                textDecoration: 'none',
                letterSpacing: '0.12em',
                clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = '#33dcff'
                ;(e.currentTarget as HTMLElement).style.boxShadow = '0 0 24px rgba(0, 212, 255, 0.4)'
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = '#00d4ff'
                ;(e.currentTarget as HTMLElement).style.boxShadow = 'none'
              }}
            >
              Let's Talk →
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8"
          style={{ borderTop: '1px solid rgba(0, 212, 255, 0.06)' }}
        >
          <div
            className="text-xs"
            style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, color: '#3a4255' }}
          >
            © 2025 CSA Trading LLC. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            {['Privacy Policy', 'Terms of Service'].map((link) => (
              <a
                key={link}
                href="#"
                className="text-xs transition-all duration-150"
                style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, color: '#3a4255', textDecoration: 'none' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#7a8499')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#3a4255')}
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <div style={{ background: '#070b14', minHeight: '100vh' }}>
      <Navbar />
      <Hero />
      <StatsBand />
      <About />
      <Services />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  )
}
