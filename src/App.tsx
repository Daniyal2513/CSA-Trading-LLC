import { useState, useEffect, useRef } from 'react'

// ─── Color constants ──────────────────────────────────────────────────────────
const G = '#00b96b'          // green accent
const G_HOVER = '#00d67a'    // lighter green for hover
const BG = '#ffffff'         // page background
const BG_PANEL = '#f5faf6'   // panel background
// const BG_CARD = '#edf6ef'    // card background
const TEXT = '#0a0f0a'       // primary text
const MUTED = '#4b5563'      // muted text
const DIM = '#9ca3af'        // dim text / labels
const BORDER = 'rgba(0, 185, 107, 0.18)'
const BORDER_STRONG = 'rgba(0, 185, 107, 0.35)'
const G_DIM = 'rgba(0, 185, 107, 0.08)'
const G_DIM2 = 'rgba(0, 185, 107, 0.14)'

// ─── WhatsApp config ───────────────────────────────────────────────────────────
// TODO: replace with the real WhatsApp number (with country code, no + or spaces)
// e.g. '923001234567'
const WHATSAPP_NUMBER = '17038633010'

// Smooth-scrolls to the contact section
function scrollToContact() {
  document.getElementById('contact-us')?.scrollIntoView({ behavior: 'smooth' })
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface CounterProps {
  end: number
  suffix?: string
  prefix?: string
  duration?: number
}

// ─── Animated Counter ─────────────────────────────────────────────────────────
function AnimatedCounter({ end, suffix = '', prefix = '', duration = 2000 }: CounterProps) {
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true) },
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
      if (current >= end) { setCount(end); clearInterval(timer) }
      else setCount(Math.floor(current))
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

  const links = ['Home', 'About Us', 'Services', 'Pricing', 'Testimonials', 'Contact Us']

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(255, 255, 255, 0.94)' : 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: scrolled ? `1px solid ${BORDER}` : '1px solid transparent',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <a href="#home" className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 flex items-center justify-center"
            style={{
              border: `1.5px solid rgba(0, 185, 107, 0.6)`,
              background: G_DIM,
              clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
            }}
          >
            <span className="text-xs font-bold" style={{ fontFamily: "'Exo 2'", color: G }}>C</span>
          </div>
          <span
            className="text-sm font-bold tracking-widest uppercase"
            style={{ fontFamily: "'Exo 2'", color: TEXT, letterSpacing: '0.18em' }}
          >
            CSA<span style={{ color: G }}>.</span>TRADING
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-sm transition-colors duration-200"
              style={{ fontFamily: "'DM Sans'", fontWeight: 400, color: MUTED, letterSpacing: '0.04em', textDecoration: 'none' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = TEXT)}
              onMouseLeave={(e) => (e.currentTarget.style.color = MUTED)}
            >
              {link}
            </a>
          ))}
        </div>

        {/* CTA */}
        <button
          className="hidden md:flex items-center gap-2 text-sm font-bold transition-all duration-200"
          style={{
            fontFamily: "'Exo 2'", fontWeight: 700, letterSpacing: '0.08em',
            color: BG, background: G, padding: '8px 20px', border: 'none', cursor: 'pointer',
            clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)',
          }}
          onClick={scrollToContact}
          onMouseEnter={(e) => { e.currentTarget.style.background = G_HOVER; e.currentTarget.style.boxShadow = `0 0 24px rgba(0, 185, 107, 0.4)` }}
          onMouseLeave={(e) => { e.currentTarget.style.background = G; e.currentTarget.style.boxShadow = 'none' }}
        >
          Let's Talk
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6h8M7 3l3 3-3 3" stroke={BG} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Mobile burger */}
        <button className="md:hidden p-2" style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setMenuOpen(!menuOpen)}>
          <div className="flex flex-col gap-1.5 w-5">
            {[0,1,2].map((i) => (
              <span key={i} className="block h-px transition-all duration-200" style={{
                background: TEXT,
                transform: i === 0 && menuOpen ? 'rotate(45deg) translateY(5px)' : i === 2 && menuOpen ? 'rotate(-45deg) translateY(-5px)' : 'none',
                opacity: i === 1 && menuOpen ? 0 : 1,
              }} />
            ))}
          </div>
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden" style={{ background: 'rgba(255,255,255,0.97)', borderTop: `1px solid ${BORDER}`, padding: '1.5rem' }}>
          <div className="flex flex-col gap-4">
            {links.map((link) => (
              <a key={link} href={`#${link.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-sm" style={{ fontFamily: "'DM Sans'", color: MUTED, textDecoration: 'none' }}
                onClick={() => setMenuOpen(false)}>{link}</a>
            ))}
            <button
              className="text-sm font-bold mt-2"
              style={{ fontFamily: "'Exo 2'", color: BG, background: G, padding: '10px 20px', border: 'none', cursor: 'pointer' }}
              onClick={() => { setMenuOpen(false); scrollToContact() }}
            >
              Let's Talk
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  const [tick, setTick] = useState(0)
  useEffect(() => { const id = setInterval(() => setTick((t) => t + 1), 2800); return () => clearInterval(id) }, [])

  const metrics = [
    { label: 'Client Revenue Generated', value: '$4.8M+', delta: '+23% MoM' },
    { label: 'Avg. ROI Delivered', value: '312%', delta: '+18% vs industry' },
    { label: 'Active Campaigns', value: '94', delta: 'Live now' },
    { label: 'Conversion Rate', value: '8.4%', delta: '+2.1pp' },
  ]
  const liveItems = [
    'Campaign "BlackFriday24" converting at 11.2%',
    'New lead captured — finance vertical',
    'ROI milestone: $50K cleared for client #7',
    'A/B test concluded — variant B +34% CTR',
    'Brand audit complete — 3 opportunities flagged',
  ]

  return (
    <section id="home" className="relative min-h-screen flex items-center grid-bg overflow-hidden" style={{ paddingTop: '80px' }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `radial-gradient(ellipse 60% 50% at 70% 50%, rgba(0, 185, 107, 0.07) 0%, transparent 70%)`,
      }} />

      <div className="max-w-7xl mx-auto px-6 w-full py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 text-xs font-medium tracking-widest uppercase"
              style={{ fontFamily: "'Exo 2'", color: G, border: `1px solid rgba(0,185,107,0.28)`, padding: '6px 14px', background: G_DIM, letterSpacing: '0.15em' }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: G, animation: 'pulse-green 2s ease-in-out infinite' }} />
              Digital Marketing & Web Development
            </div>

            <h1 style={{ fontFamily: "'Exo 2'" }}>
              <span className="block text-5xl lg:text-7xl font-extrabold" style={{ color: TEXT, letterSpacing: '-0.02em', lineHeight: 1.05 }}>Scale Your</span>
              <span className="block text-5xl lg:text-7xl font-extrabold glow-green" style={{ color: G, letterSpacing: '-0.02em', lineHeight: 1.05 }}>Brand With</span>
              <span className="block text-5xl lg:text-7xl font-extrabold" style={{ color: TEXT, letterSpacing: '-0.02em', lineHeight: 1.05 }}>Precision.</span>
            </h1>

            <p className="text-lg max-w-md leading-relaxed" style={{ fontFamily: "'DM Sans'", fontWeight: 300, color: MUTED }}>
              CSA Trading LLC engineers high-performance digital marketing systems and world-class web experiences that convert traffic into measurable revenue.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                className="flex items-center gap-2 text-sm font-bold transition-all duration-200"
                style={{ fontFamily: "'Exo 2'", fontWeight: 700, letterSpacing: '0.08em', color: BG, background: G, padding: '14px 28px', border: 'none', cursor: 'pointer', clipPath: 'polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)' }}
                onClick={scrollToContact}
                onMouseEnter={(e) => { e.currentTarget.style.background = G_HOVER; e.currentTarget.style.boxShadow = `0 0 32px rgba(0,185,107,0.45)` }}
                onMouseLeave={(e) => { e.currentTarget.style.background = G; e.currentTarget.style.boxShadow = 'none' }}
              >
                Get Started
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M8 3l4 4-4 4" stroke={BG} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              <button
                className="flex items-center gap-2 text-sm font-medium transition-all duration-200"
                style={{ fontFamily: "'Exo 2'", fontWeight: 500, letterSpacing: '0.06em', color: TEXT, background: 'transparent', padding: '14px 28px', border: `1px solid rgba(0,0,0,0.15)`, cursor: 'pointer' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = BORDER_STRONG; e.currentTarget.style.color = G }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.15)'; e.currentTarget.style.color = TEXT }}
              >
                View Our Services
              </button>
            </div>

            <div className="flex items-center gap-8 pt-2">
              {[{ num: '200+', label: 'Clients Served' }, { num: '98%', label: 'Satisfaction Rate' }, { num: '5yr', label: 'Industry Expertise' }].map((s) => (
                <div key={s.label}>
                  <div className="text-2xl font-bold" style={{ fontFamily: "'Exo 2'", color: G }}>{s.num}</div>
                  <div className="text-xs mt-0.5" style={{ fontFamily: "'DM Sans'", color: DIM, letterSpacing: '0.04em' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Dashboard */}
          <div className="relative" style={{ animation: 'float 6s ease-in-out infinite' }}>
            <div className="p-6 relative overflow-hidden" style={{
              background: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(20px)',
              border: `1px solid ${BORDER_STRONG}`,
              boxShadow: '0 8px 48px rgba(0, 185, 107, 0.1), 0 2px 16px rgba(0,0,0,0.06)',
            }}>
              <div className="absolute inset-x-0 h-px pointer-events-none" style={{
                background: `linear-gradient(90deg, transparent, rgba(0,185,107,0.6), transparent)`,
                animation: 'scan-line 4s linear infinite', top: 0,
              }} />

              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ fontFamily: "'Exo 2'", color: G, letterSpacing: '0.14em' }}>Live Marketing Dashboard</div>
                  <div className="text-xs" style={{ fontFamily: "'DM Sans'", color: DIM }}>Real-time client performance</div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ background: G, animation: 'pulse-green 1.5s ease-in-out infinite' }} />
                  <span className="text-xs" style={{ fontFamily: "'Exo 2'", color: G, letterSpacing: '0.1em' }}>LIVE</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-5">
                {metrics.map((m) => (
                  <div key={m.label} className="p-4 transition-all duration-200" style={{ background: G_DIM, border: `1px solid ${BORDER}` }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = G_DIM2; (e.currentTarget as HTMLElement).style.borderColor = BORDER_STRONG }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = G_DIM; (e.currentTarget as HTMLElement).style.borderColor = BORDER }}>
                    <div className="text-xl font-bold mb-1" style={{ fontFamily: "'Exo 2'", color: TEXT }}>{m.value}</div>
                    <div className="text-xs mb-2" style={{ fontFamily: "'DM Sans'", fontWeight: 300, color: DIM }}>{m.label}</div>
                    <div className="text-xs font-medium" style={{ fontFamily: "'Exo 2'", color: G }}>↑ {m.delta}</div>
                  </div>
                ))}
              </div>

              <div className="text-xs mb-3 font-semibold tracking-widest uppercase" style={{ fontFamily: "'Exo 2'", color: DIM, letterSpacing: '0.12em' }}>Live Activity Feed</div>
              <div className="space-y-2 overflow-hidden" style={{ height: '96px' }}>
                {liveItems.slice(tick % liveItems.length, (tick % liveItems.length) + 3).concat(
                  liveItems.slice(0, Math.max(0, 3 - (liveItems.length - (tick % liveItems.length))))
                ).map((item, i) => (
                  <div key={`${tick}-${i}`} className="flex items-center gap-2 text-xs"
                    style={{ fontFamily: "'DM Sans'", fontWeight: 300, color: i === 0 ? MUTED : DIM, animation: i === 0 ? 'slide-in-left 0.4s ease-out' : 'none' }}>
                    <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: i === 0 ? G : DIM }} />
                    {item}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between mt-4 pt-4" style={{ borderTop: `1px solid ${BORDER}` }}>
                <div className="text-xs" style={{ fontFamily: "'DM Sans'", color: DIM }}>Updated 2s ago</div>
                <div className="flex items-center gap-1.5">
                  {[12, 20, 16, 24, 18].map((h, i) => (
                    <div key={i} className="w-6" style={{ height: `${h}px`, background: i < 3 ? G : `rgba(0,185,107,0.2)` }} />
                  ))}
                </div>
              </div>
            </div>

            <div className="absolute -top-px -right-px w-12 h-12 pointer-events-none" style={{
              background: `linear-gradient(135deg, ${G} 0%, transparent 60%)`, opacity: 0.5,
              clipPath: 'polygon(100% 0%, 0% 0%, 100% 100%)',
            }} />
            <div className="absolute -bottom-px -left-px w-8 h-8 pointer-events-none" style={{
              background: `linear-gradient(315deg, ${G} 0%, transparent 60%)`, opacity: 0.3,
              clipPath: 'polygon(0% 100%, 0% 0%, 100% 100%)',
            }} />
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── About ────────────────────────────────────────────────────────────────────
function About() {
  return (
    <section id="about-us" className="relative py-32 overflow-hidden" style={{ background: BG_PANEL }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `radial-gradient(ellipse 50% 60% at 20% 50%, rgba(0,185,107,0.06) 0%, transparent 70%)`,
      }} />
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

          {/* Geometric SVG */}
          <div className="relative h-80 lg:h-96 order-2 lg:order-1">
            <svg viewBox="0 0 400 380" className="w-full h-full" style={{ opacity: 0.85 }}>
              <polygon points="200,20 360,110 360,270 200,360 40,270 40,110" fill="none" stroke={BORDER} strokeWidth="1"/>
              <polygon points="200,60 320,130 320,250 200,320 80,250 80,130" fill="none" stroke="rgba(0,185,107,0.1)" strokeWidth="1"/>
              <polygon points="200,100 280,150 280,230 200,280 120,230 120,150" fill="none" stroke={BORDER_STRONG} strokeWidth="1.5"/>
              <line x1="200" y1="20" x2="200" y2="360" stroke="rgba(0,185,107,0.07)" strokeWidth="1"/>
              <line x1="40" y1="110" x2="360" y2="270" stroke="rgba(0,185,107,0.07)" strokeWidth="1"/>
              <line x1="360" y1="110" x2="40" y2="270" stroke="rgba(0,185,107,0.07)" strokeWidth="1"/>
              {([[200,20],[360,110],[360,270],[200,360],[40,270],[40,110]] as [number,number][]).map(([cx,cy], i) => (
                <circle key={i} cx={cx} cy={cy} r="3" fill={`rgba(0,185,107,0.6)`} />
              ))}
              <circle cx="200" cy="190" r="30" fill="none" stroke={BORDER_STRONG} strokeWidth="1.5"/>
              <circle cx="200" cy="190" r="4" fill={G} />
              {([[160,150],[240,150],[160,230],[240,230]] as [number,number][]).map(([cx,cy], i) => (
                <g key={i}>
                  <circle cx={cx} cy={cy} r="2" fill={`rgba(0,185,107,0.5)`}/>
                  <line x1={cx} y1={cy} x2="200" y2="190" stroke="rgba(0,185,107,0.2)" strokeWidth="1"/>
                </g>
              ))}
              {[['STRATEGY', 85, 105], ['GROWTH', 280, 105], ['ANALYTICS', 62, 280], ['SCALE', 280, 280]].map(([t,x,y]) => (
                <text key={t as string} x={x} y={y} fill={`rgba(0,185,107,0.5)`} fontSize="9" fontFamily="'Exo 2'" letterSpacing="1">{t}</text>
              ))}
            </svg>
          </div>

          {/* Text */}
          <div className="space-y-8 order-1 lg:order-2">
            <div>
              <div className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ fontFamily: "'Exo 2'", color: G, letterSpacing: '0.18em' }}>— About Us</div>
              <h2 className="text-4xl lg:text-5xl font-extrabold leading-tight mb-6" style={{ fontFamily: "'Exo 2'", color: TEXT, letterSpacing: '-0.02em' }}>
                Built for Brands<br /><span style={{ color: G }}>That Mean Business.</span>
              </h2>
              <p className="text-base leading-loose mb-6" style={{ fontFamily: "'DM Sans'", fontWeight: 300, color: MUTED }}>
                CSA Trading LLC was founded on one conviction: results are the only language that matters in business. We combine data-driven marketing intelligence with precision web engineering to build systems that generate compounding returns — not just impressions.
              </p>
              <p className="text-base leading-loose" style={{ fontFamily: "'DM Sans'", fontWeight: 300, color: MUTED }}>
                Every strategy we deploy is backed by real-time analytics, tested assumptions, and a team obsessed with scaling what works. We don't guess — we measure, iterate, and execute.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              {[
                { icon: '◈', title: 'Data First', desc: 'Every decision is evidence-backed' },
                { icon: '◇', title: 'Precision Execution', desc: 'No wasted budget, no wasted effort' },
                { icon: '◉', title: 'Scalable Systems', desc: 'Built to compound, not plateau' },
                { icon: '▲', title: 'Full Transparency', desc: 'Real-time reporting, no black boxes' },
              ].map((p) => (
                <div key={p.title} className="p-4 transition-all duration-200" style={{ border: `1px solid ${BORDER}`, background: G_DIM }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = BORDER_STRONG; (e.currentTarget as HTMLElement).style.background = G_DIM2 }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = BORDER; (e.currentTarget as HTMLElement).style.background = G_DIM }}>
                  <div className="text-lg mb-2" style={{ color: G }}>{p.icon}</div>
                  <div className="text-sm font-semibold mb-1" style={{ fontFamily: "'Exo 2'", color: TEXT }}>{p.title}</div>
                  <div className="text-xs" style={{ fontFamily: "'DM Sans'", fontWeight: 300, color: DIM }}>{p.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Services ─────────────────────────────────────────────────────────────────
function Services() {
  const services = [
    { num: '01', title: 'Digital Marketing', desc: 'Full-funnel performance campaigns across paid search, social, and programmatic — engineered for maximum ROI with real-time budget optimization.', tags: ['PPC', 'SEO', 'Social Ads', 'Email'], wide: true },
    { num: '02', title: 'Web Development', desc: 'High-performance web applications and marketing websites built for speed, conversion, and scale.', tags: ['React', 'Next.js', 'Node', 'CMS'], wide: false },
    { num: '03', title: 'Brand Scaling', desc: 'Strategic brand architecture and growth systems that turn early traction into market dominance.', tags: ['Identity', 'Positioning', 'Growth'], wide: false },
    { num: '04', title: 'UI/UX Architecture', desc: 'Conversion-optimized interfaces that reduce friction, build trust, and drive measurable action at every touchpoint.', tags: ['UX Research', 'Prototyping', 'CRO', 'Systems'], wide: true },
  ]

  return (
    <section id="services" className="relative py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <div className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ fontFamily: "'Exo 2'", color: G, letterSpacing: '0.18em' }}>— What We Do</div>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <h2 className="text-4xl lg:text-5xl font-extrabold leading-tight" style={{ fontFamily: "'Exo 2'", color: TEXT, letterSpacing: '-0.02em' }}>
              Services Built to<br /><span style={{ color: G }}>Perform.</span>
            </h2>
            <p className="text-sm max-w-xs leading-loose" style={{ fontFamily: "'DM Sans'", fontWeight: 300, color: DIM }}>
              Every service is a system — designed to compound results over time, not deliver one-off wins.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ background: BORDER }}>
          <ServiceCard service={services[0]} className="md:col-span-2" />
          <ServiceCard service={services[1]} />
          <ServiceCard service={services[2]} />
          <ServiceCard service={services[3]} className="md:col-span-2" />
        </div>
      </div>
    </section>
  )
}

function ServiceCard({ service, className = '' }: { service: { num: string; title: string; desc: string; tags: string[] }; className?: string }) {
  return (
    <div className={`p-8 transition-all duration-300 cursor-pointer ${className}`}
      style={{ background: BG }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = BG_PANEL }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = BG }}>
      <div className="flex items-start justify-between mb-6">
        <span className="text-xs font-bold tracking-widest" style={{ fontFamily: "'Exo 2'", color: `rgba(0,185,107,0.35)`, letterSpacing: '0.2em' }}>{service.num}</span>
        <div className="w-8 h-8 flex items-center justify-center" style={{ border: `1px solid ${BORDER}`, color: G }}>
          {/* <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M8 3l4 4-4 4" stroke={G} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> */}
        </div>
      </div>
      <h3 className="text-xl font-bold mb-3" style={{ fontFamily: "'Exo 2'", color: TEXT, letterSpacing: '-0.01em' }}>{service.title}</h3>
      <p className="text-sm leading-loose flex-1 mb-6" style={{ fontFamily: "'DM Sans'", fontWeight: 300, color: MUTED }}>{service.desc}</p>
      <div className="flex flex-wrap gap-2">
        {service.tags.map((tag) => (
          <span key={tag} className="text-xs px-2 py-1" style={{ fontFamily: "'Exo 2'", color: G, border: `1px solid ${BORDER}`, letterSpacing: '0.08em', background: G_DIM }}>{tag}</span>
        ))}
      </div>
    </div>
  )
}

// ─── Pricing ──────────────────────────────────────────────────────────────────
interface PricingPlan {
  name: string
  price: string
  period: string
  tagline: string
  badge?: string
  features: string[]
  cta: string
  highlighted: boolean
}

function PricingCard({ plan, index }: { plan: PricingPlan; index: number }) {
  const [open, setOpen] = useState(false)

  return (
    <div
      className="relative overflow-hidden transition-all duration-300 cursor-pointer"
      style={{
        border: open || plan.highlighted ? `1.5px solid ${plan.highlighted ? G : BORDER_STRONG}` : `1px solid ${BORDER}`,
        background: plan.highlighted ? G_DIM2 : BG,
        boxShadow: open ? `0 8px 40px rgba(0,185,107,0.12)` : plan.highlighted ? `0 4px 24px rgba(0,185,107,0.08)` : 'none',
      }}
    >
      {/* Tier indicator bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
        background: plan.highlighted ? G : `rgba(0,185,107,0.25)`,
      }} />

      {/* Card header — always visible, click to toggle */}
      <button
        className="w-full text-left px-8 pt-8 pb-6 flex items-center justify-between gap-4"
        style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <div className="flex items-center gap-6 flex-1 min-w-0">
          {/* Index number */}
          <span
            className="text-4xl font-black flex-shrink-0"
            style={{ fontFamily: "'Exo 2'", color: plan.highlighted ? G : `rgba(0,185,107,0.18)`, letterSpacing: '-0.02em', lineHeight: 1 }}
          >
            0{index + 1}
          </span>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap mb-1">
              <span className="text-xl font-bold" style={{ fontFamily: "'Exo 2'", color: TEXT }}>{plan.name}</span>
              {plan.badge && (
                <span className="text-xs font-bold px-2 py-0.5 uppercase tracking-widest"
                  style={{ fontFamily: "'Exo 2'", background: G, color: BG, letterSpacing: '0.1em' }}>
                  {plan.badge}
                </span>
              )}
            </div>
            <p className="text-sm" style={{ fontFamily: "'DM Sans'", fontWeight: 300, color: MUTED }}>{plan.tagline}</p>
          </div>
        </div>

        {/* Price + toggle */}
        <div className="flex items-center gap-8 flex-shrink-0">
          <div className="text-right">
            <div className="text-3xl font-extrabold" style={{ fontFamily: "'Exo 2'", color: plan.highlighted ? G : TEXT, letterSpacing: '-0.02em' }}>{plan.price}</div>
            <div className="text-xs mt-0.5" style={{ fontFamily: "'DM Sans'", fontWeight: 300, color: DIM }}>{plan.period}</div>
          </div>
          <div
            className="w-9 h-9 flex items-center justify-center flex-shrink-0 transition-all duration-300"
            style={{
              border: `1px solid ${open ? G : BORDER}`,
              background: open ? G_DIM2 : 'transparent',
              transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 5l4 4 4-4" stroke={open ? G : MUTED} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </button>

      {/* Dropdown content */}
      <div
        style={{
          overflow: 'hidden',
          maxHeight: open ? '600px' : '0',
          opacity: open ? 1 : 0,
          transition: 'max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease',
        }}
      >
        <div className="px-8 pb-8" style={{ borderTop: `1px solid ${BORDER}` }}>
          <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Feature list */}
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-widest mb-4" style={{ fontFamily: "'Exo 2'", color: G, letterSpacing: '0.14em' }}>What's Included</div>
              {plan.features.map((f) => (
                <div key={f} className="flex items-start gap-3">
                  <div className="w-4 h-4 flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: G_DIM2, border: `1px solid ${BORDER}` }}>
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                      <path d="M1 4l2 2 4-4" stroke={G} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="text-sm" style={{ fontFamily: "'DM Sans'", fontWeight: 300, color: MUTED }}>{f}</span>
                </div>
              ))}
            </div>

            {/* CTA block */}
            <div className="flex flex-col items-start gap-4">
              <div className="p-5 w-full" style={{ background: BG_PANEL, border: `1px solid ${BORDER}` }}>
                <div className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ fontFamily: "'Exo 2'", color: DIM, letterSpacing: '0.12em' }}>Billing</div>
                <div className="text-lg font-bold" style={{ fontFamily: "'Exo 2'", color: TEXT }}>{plan.price} <span className="text-sm font-normal" style={{ color: DIM }}>{plan.period}</span></div>
                <div className="text-xs mt-1" style={{ fontFamily: "'DM Sans'", fontWeight: 300, color: DIM }}>No setup fees · Cancel anytime</div>
              </div>
              <a
                href="#contact-us"
                className="w-full flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-widest py-3 px-6 transition-all duration-200"
                style={{
                  fontFamily: "'Exo 2'", letterSpacing: '0.1em',
                  color: plan.highlighted ? BG : TEXT,
                  background: plan.highlighted ? G : 'transparent',
                  border: plan.highlighted ? 'none' : `1.5px solid ${BORDER_STRONG}`,
                  textDecoration: 'none',
                  clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = plan.highlighted ? G_HOVER : G
                  ;(e.currentTarget as HTMLElement).style.color = BG
                  ;(e.currentTarget as HTMLElement).style.boxShadow = `0 0 24px rgba(0,185,107,0.35)`
                  ;(e.currentTarget as HTMLElement).style.border = 'none'
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = plan.highlighted ? G : 'transparent'
                  ;(e.currentTarget as HTMLElement).style.color = plan.highlighted ? BG : TEXT
                  ;(e.currentTarget as HTMLElement).style.boxShadow = 'none'
                  ;(e.currentTarget as HTMLElement).style.border = plan.highlighted ? 'none' : `1.5px solid ${BORDER_STRONG}`
                }}
              >
                {plan.cta}
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Pricing() {
  const plans: PricingPlan[] = [
    {
      name: 'Starter',
      price: '$999',
      period: '/ month',
      tagline: 'For early-stage brands ready to build a digital foundation.',
      features: [
        'Digital marketing strategy & audit',
        '2 active paid ad campaigns (Google or Meta)',
        'Basic SEO setup & keyword research',
        'Monthly performance report',
        '1 landing page design & development',
        'Email campaign setup (up to 3/month)',
        'Dedicated account manager',
        'Response within 48 hours',
      ],
      cta: 'Start with Starter',
      highlighted: false,
    },
    {
      name: 'Growth',
      price: '$2,499',
      period: '/ month',
      tagline: 'For scaling brands that need serious marketing firepower.',
      badge: 'Most Popular',
      features: [
        'Everything in Starter, plus:',
        'Full-funnel paid media management (Google, Meta, LinkedIn)',
        'Advanced SEO & content marketing (4 articles/month)',
        'Custom web development — up to 5 pages',
        'UI/UX audit & conversion rate optimization',
        'Brand positioning & identity refinement',
        'Weekly performance reports & strategy calls',
        'A/B testing on all active campaigns',
        'Priority 24hr response time',
      ],
      cta: 'Accelerate Growth',
      highlighted: true,
    },
    {
      name: 'Enterprise',
      price: '$5,999',
      period: '/ month',
      tagline: 'For market leaders demanding total brand & digital dominance.',
      features: [
        'Everything in Growth, plus:',
        'Omnichannel marketing across 6+ platforms',
        'Dedicated creative team (copy, design, video)',
        'Full web application development & maintenance',
        'Complete UI/UX architecture system',
        'Brand scaling roadmap & quarterly reviews',
        'Programmatic advertising & retargeting',
        'Custom analytics dashboard & real-time reporting',
        '8 content pieces per month (articles, videos, ads)',
        'Direct line — 4hr emergency response SLA',
      ],
      cta: 'Go Enterprise',
      highlighted: false,
    },
  ]

  return (
    <section id="pricing" className="relative py-32" style={{ background: BG_PANEL }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `radial-gradient(ellipse 50% 40% at 50% 50%, rgba(0,185,107,0.05) 0%, transparent 70%)`,
      }} />
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-16 text-center">
          <div className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ fontFamily: "'Exo 2'", color: G, letterSpacing: '0.18em' }}>— Transparent Pricing</div>
          <h2 className="text-4xl lg:text-5xl font-extrabold mb-4" style={{ fontFamily: "'Exo 2'", color: TEXT, letterSpacing: '-0.02em' }}>
            Invest in <span style={{ color: G }}>Real Results.</span>
          </h2>
          <p className="text-base max-w-md mx-auto leading-loose" style={{ fontFamily: "'DM Sans'", fontWeight: 300, color: MUTED }}>
            Click any plan to reveal what's included. No hidden fees, no surprise invoices — only performance-backed value.
          </p>
        </div>

        <div className="flex flex-col gap-px" style={{ background: BORDER }}>
          {plans.map((plan, i) => (
            <PricingCard key={plan.name} plan={plan} index={i} />
          ))}
        </div>

        <p className="text-center text-xs mt-8" style={{ fontFamily: "'DM Sans'", fontWeight: 300, color: DIM }}>
          All plans billed monthly. Annual billing available at 15% discount. Custom enterprise scopes available on request.
        </p>
      </div>
    </section>
  )
}

// ─── Stats Band ───────────────────────────────────────────────────────────────
function StatsBand() {
  return (
    <section className="relative py-16 overflow-hidden" style={{ background: BG, borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { end: 200, suffix: '+', label: 'Brands Scaled' },
            { end: 312, suffix: '%', label: 'Average ROI' },
            { end: 4800000, prefix: '$', suffix: '+', label: 'Revenue Generated' },
            { end: 98, suffix: '%', label: 'Client Retention' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-4xl font-extrabold mb-2" style={{ fontFamily: "'Exo 2'", color: G }}>
                <AnimatedCounter end={stat.end} suffix={stat.suffix} prefix={stat.prefix} />
              </div>
              <div className="text-xs uppercase tracking-widest" style={{ fontFamily: "'DM Sans'", fontWeight: 300, color: DIM, letterSpacing: '0.14em' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
function Testimonials() {
  const [active, setActive] = useState(0)
  const testimonials = [
    { quote: "CSA Trading didn't just run our ads — they rebuilt our entire acquisition engine. ROI went from 180% to 340% in 90 days. The transparency and precision are unlike any agency we've worked with.", name: 'Marcus Reid', role: 'CEO', company: 'Apex Commerce Group', initials: 'MR', result: '+340% ROI' },
    { quote: "Our new website converted 3× better within the first month of launch. Their team understood both the technical architecture and the conversion psychology. Exceptional work.", name: 'Sophia Nakamura', role: 'Head of Growth', company: 'Prism Fintech', initials: 'SN', result: '3× Conversions' },
    { quote: "In eight months, CSA took us from a regional player to a nationally recognized brand. Their brand scaling framework is systematic, intelligent, and built for sustainable growth.", name: 'David Okafor', role: 'Founder', company: 'Meridian Health Co.', initials: 'DO', result: '8mo Brand Scale' },
    { quote: "The UI/UX overhaul reduced our bounce rate by 38% and increased checkout completions by 52%. Every decision was backed by data and tested before deployment. Brilliant process.", name: 'Layla Chen', role: 'VP Product', company: 'Stellar Retail', initials: 'LC', result: '−38% Bounce Rate' },
  ]

  return (
    <section id="testimonials" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `radial-gradient(ellipse 50% 60% at 80% 50%, rgba(0,185,107,0.05) 0%, transparent 70%)`,
      }} />
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <div className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ fontFamily: "'Exo 2'", color: G, letterSpacing: '0.18em' }}>— Client Results</div>
          <h2 className="text-4xl lg:text-5xl font-extrabold leading-tight" style={{ fontFamily: "'Exo 2'", color: TEXT, letterSpacing: '-0.02em' }}>Proof, Not Promises.</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 p-8 relative overflow-hidden" style={{ background: BG_PANEL, border: `1px solid ${BORDER_STRONG}` }}>
            <div className="text-5xl font-black mb-6 leading-none" style={{ fontFamily: "'Exo 2'", color: `rgba(0,185,107,0.18)` }}>"</div>
            <p className="text-lg leading-loose mb-8" style={{ fontFamily: "'DM Sans'", fontWeight: 300, color: TEXT }}>{testimonials[active].quote}</p>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 flex items-center justify-center text-sm font-bold"
                  style={{ fontFamily: "'Exo 2'", background: G_DIM2, border: `1px solid ${BORDER_STRONG}`, color: G }}>
                  {testimonials[active].initials}
                </div>
                <div>
                  <div className="text-sm font-semibold" style={{ fontFamily: "'Exo 2'", color: TEXT }}>{testimonials[active].name}</div>
                  <div className="text-xs mt-0.5" style={{ fontFamily: "'DM Sans'", fontWeight: 300, color: DIM }}>{testimonials[active].role}, {testimonials[active].company}</div>
                </div>
              </div>
              <div className="text-sm font-bold px-4 py-2" style={{ fontFamily: "'Exo 2'", color: G, border: `1px solid ${BORDER_STRONG}`, background: G_DIM }}>
                {testimonials[active].result}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {testimonials.map((t, i) => (
              <button key={i} onClick={() => setActive(i)} className="p-5 text-left transition-all duration-200"
                style={{ background: active === i ? G_DIM2 : BG_PANEL, border: active === i ? `1px solid ${BORDER_STRONG}` : `1px solid ${BORDER}`, cursor: 'pointer' }}>
                <div className="text-xs font-semibold mb-1" style={{ fontFamily: "'Exo 2'", color: active === i ? G : DIM }}>{t.name}</div>
                <div className="text-xs" style={{ fontFamily: "'DM Sans'", fontWeight: 300, color: active === i ? MUTED : DIM }}>{t.company}</div>
                <div className="text-xs font-bold mt-2" style={{ fontFamily: "'Exo 2'", color: active === i ? G : `rgba(0,185,107,0.25)` }}>{t.result}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Contact ──────────────────────────────────────────────────────────────────
function Contact() {
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '' })
  const [focused, setFocused] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const fields = [
    { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Marcus Reid' },
    { key: 'email', label: 'Email Address', type: 'email', placeholder: 'marcus@company.com' },
    { key: 'company', label: 'Company', type: 'text', placeholder: 'Apex Commerce Group' },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Build a WhatsApp message from the form fields
    const lines = [
      `New inquiry from CSA Trading website:`,
      ``,
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      `Company: ${form.company}`,
      `Message: ${form.message}`,
    ]
    const text = encodeURIComponent(lines.join('\n'))
    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`

    // Open WhatsApp (app or web) with the message pre-filled
    window.open(waUrl, '_blank')

    setSubmitted(true)
  }

  return (
    <section id="contact-us" className="relative py-32" style={{ background: BG_PANEL }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `radial-gradient(ellipse 40% 50% at 50% 50%, rgba(0,185,107,0.05) 0%, transparent 70%)`,
      }} />
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">

          <div className="space-y-8">
            <div>
              <div className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ fontFamily: "'Exo 2'", color: G, letterSpacing: '0.18em' }}>— Get In Touch</div>
              <h2 className="text-4xl lg:text-5xl font-extrabold leading-tight mb-6" style={{ fontFamily: "'Exo 2'", color: TEXT, letterSpacing: '-0.02em' }}>
                Ready to Scale<br /><span style={{ color: G }}>Intelligently?</span>
              </h2>
              <p className="text-base leading-loose" style={{ fontFamily: "'DM Sans'", fontWeight: 300, color: MUTED }}>
                Tell us about your brand and goals. We'll respond within 24 hours with a preliminary analysis and a roadmap tailored specifically to your situation.
              </p>
            </div>

            <div className="space-y-4 pt-4">
              {[
                { icon: '◉', label: 'Email', value: 'csatradingllc.dmu@gmail.com' },
                { icon: '◈', label: 'Location', value: '16797 Mill Station WayDumfries, VA 22025, USA' },
                { icon: '▲', label: 'Response Time', value: 'Within 24 hours, guaranteed' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-4">
                  <div className="w-9 h-9 flex items-center justify-center text-sm flex-shrink-0"
                    style={{ border: `1px solid ${BORDER}`, color: G, background: G_DIM }}>{item.icon}</div>
                  <div>
                    <div className="text-xs uppercase tracking-widest mb-0.5" style={{ fontFamily: "'Exo 2'", color: DIM, letterSpacing: '0.12em' }}>{item.label}</div>
                    <div className="text-sm" style={{ fontFamily: "'DM Sans'", color: MUTED }}>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-12"
                style={{ border: `1px solid ${BORDER_STRONG}`, background: G_DIM }}>
                <div className="text-4xl mb-4" style={{ color: G }}>◎</div>
                <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: "'Exo 2'", color: TEXT }}>Redirecting to WhatsApp…</h3>
                <p className="text-sm" style={{ fontFamily: "'DM Sans'", fontWeight: 300, color: MUTED }}>If a new tab didn't open, tap the button below.</p>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-5 text-xs font-bold uppercase tracking-widest py-3 px-6"
                  style={{ fontFamily: "'Exo 2'", color: BG, background: G, textDecoration: 'none', letterSpacing: '0.12em' }}
                >
                  Open WhatsApp
                </a>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {fields.map(({ key, label, type, placeholder }) => (
                  <div key={key}>
                    <label className="block text-xs font-semibold tracking-widest uppercase mb-2 transition-colors duration-200"
                      style={{ fontFamily: "'Exo 2'", color: focused === key ? G : DIM, letterSpacing: '0.12em' }}>{label}</label>
                    <input type={type} value={form[key as keyof typeof form]} placeholder={placeholder} required
                      onFocus={() => setFocused(key)} onBlur={() => setFocused(null)}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      className="w-full text-sm px-4 py-3 outline-none transition-all duration-200"
                      style={{ fontFamily: "'DM Sans'", fontWeight: 300, color: TEXT, background: BG,
                        border: focused === key ? `1px solid ${G}` : `1px solid rgba(0,0,0,0.12)`,
                        boxShadow: focused === key ? `0 0 12px rgba(0,185,107,0.1)` : 'none', borderRadius: 0 }} />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-semibold tracking-widest uppercase mb-2 transition-colors duration-200"
                    style={{ fontFamily: "'Exo 2'", color: focused === 'message' ? G : DIM, letterSpacing: '0.12em' }}>Message</label>
                  <textarea value={form.message} placeholder="Tell us about your brand, current challenges, and what growth looks like for you..." required rows={5}
                    onFocus={() => setFocused('message')} onBlur={() => setFocused(null)}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full text-sm px-4 py-3 outline-none resize-none transition-all duration-200"
                    style={{ fontFamily: "'DM Sans'", fontWeight: 300, color: TEXT, background: BG,
                      border: focused === 'message' ? `1px solid ${G}` : `1px solid rgba(0,0,0,0.12)`,
                      boxShadow: focused === 'message' ? `0 0 12px rgba(0,185,107,0.1)` : 'none', borderRadius: 0 }} />
                </div>
                <button type="submit" className="w-full py-4 text-sm font-bold tracking-widest uppercase transition-all duration-200"
                  style={{ fontFamily: "'Exo 2'", color: BG, background: G, border: 'none', cursor: 'pointer', letterSpacing: '0.14em', clipPath: 'polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = G_HOVER; e.currentTarget.style.boxShadow = `0 0 32px rgba(0,185,107,0.45)` }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = G; e.currentTarget.style.boxShadow = 'none' }}>
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
  const navLinks = ['Home', 'About Us', 'Services', 'Pricing', 'Testimonials', 'Contact Us']
  const socials = [{ name: 'LinkedIn', icon: 'in', href: '#' }, { name: 'Twitter', icon: 'X', href: '#' }, { name: 'Instagram', icon: 'ig', href: '#' }]

  return (
    <footer className="relative pt-16 pb-8" style={{ borderTop: `1px solid ${BORDER}`, background: BG }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 flex items-center justify-center"
                style={{ border: `1.5px solid rgba(0,185,107,0.5)`, background: G_DIM, clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
                <span className="text-xs font-bold" style={{ fontFamily: "'Exo 2'", color: G }}>C</span>
              </div>
              <span className="text-sm font-bold tracking-widest" style={{ fontFamily: "'Exo 2'", color: TEXT, letterSpacing: '0.16em' }}>
                CSA<span style={{ color: G }}>.</span>TRADING
              </span>
            </div>
            <p className="text-xs leading-loose max-w-xs" style={{ fontFamily: "'DM Sans'", fontWeight: 300, color: DIM }}>
              Digital marketing and web development agency engineered for brands that demand measurable results.
            </p>
            <div className="flex items-center gap-3">
              {socials.map((s) => (
                <a key={s.name} href={s.href} className="w-8 h-8 flex items-center justify-center text-xs font-bold transition-all duration-200"
                  style={{ fontFamily: "'Exo 2'", border: `1px solid rgba(0,0,0,0.1)`, color: DIM, textDecoration: 'none' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = BORDER_STRONG; (e.currentTarget as HTMLElement).style.color = G; (e.currentTarget as HTMLElement).style.background = G_DIM }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,0,0,0.1)'; (e.currentTarget as HTMLElement).style.color = DIM; (e.currentTarget as HTMLElement).style.background = 'transparent' }}>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs font-bold uppercase tracking-widest mb-5" style={{ fontFamily: "'Exo 2'", color: DIM, letterSpacing: '0.16em' }}>Navigation</div>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link}>
                  <a href={`#${link.toLowerCase().replace(/\s+/g, '-')}`} className="text-sm transition-colors duration-150"
                    style={{ fontFamily: "'DM Sans'", fontWeight: 300, color: DIM, textDecoration: 'none' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = MUTED)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = DIM)}>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-xs font-bold uppercase tracking-widest mb-5" style={{ fontFamily: "'Exo 2'", color: DIM, letterSpacing: '0.16em' }}>Ready to Grow?</div>
            <p className="text-xs leading-loose mb-5" style={{ fontFamily: "'DM Sans'", fontWeight: 300, color: DIM }}>Join 200+ brands scaling intelligently with CSA Trading LLC.</p>
            <a href="#contact-us" className="inline-block text-xs font-bold uppercase tracking-widest py-3 px-6 transition-all duration-200"
              style={{ fontFamily: "'Exo 2'", color: BG, background: G, textDecoration: 'none', letterSpacing: '0.12em', clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = G_HOVER; (e.currentTarget as HTMLElement).style.boxShadow = `0 0 24px rgba(0,185,107,0.35)` }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = G; (e.currentTarget as HTMLElement).style.boxShadow = 'none' }}>
              Let's Talk →
            </a>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8" style={{ borderTop: `1px solid rgba(0,0,0,0.06)` }}>
          <div className="text-xs" style={{ fontFamily: "'DM Sans'", fontWeight: 300, color: DIM }}>© 2025 CSA Trading LLC. All rights reserved.</div>
          <div className="flex items-center gap-6">
            {['Privacy Policy', 'Terms of Service'].map((link) => (
              <a key={link} href="#" className="text-xs transition-colors duration-150"
                style={{ fontFamily: "'DM Sans'", fontWeight: 300, color: DIM, textDecoration: 'none' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = MUTED)}
                onMouseLeave={(e) => (e.currentTarget.style.color = DIM)}>
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
    <div style={{ background: BG, minHeight: '100vh' }}>
      <Navbar />
      <Hero />
      <StatsBand />
      <About />
      <Services />
      <Pricing />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  )
}