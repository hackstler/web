import { useReveal } from '../hooks/useReveal'
import { useEffect, useState, useRef, useCallback } from 'react'

/* ─── Typing effect hook ─────────────────────────────────── */

function useTyping(text: string, speed = 60, delay = 500) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    let i = 0
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        i++
        setDisplayed(text.slice(0, i))
        if (i >= text.length) {
          clearInterval(interval)
          setDone(true)
        }
      }, speed)
      return () => clearInterval(interval)
    }, delay)
    return () => clearTimeout(timeout)
  }, [text, speed, delay])

  return { displayed, done }
}

/* ─── Scroll-aware nav hook ──────────────────────────────── */

function useScrollNav() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return visible
}

/* ─── Mouse-tracking glow hook ───────────────────────────── */

function useMouseGlow() {
  const ref = useRef<HTMLDivElement>(null)

  const handleMouse = useCallback((e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`)
    el.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`)
  }, [])

  return { ref, handleMouse }
}

/* ─── Logo SVG ───────────────────────────────────────────── */

function Logo({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="logo-g" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="50%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="14" fill="#09090b" />
      <rect x="2" y="2" width="60" height="60" rx="12" fill="none" stroke="url(#logo-g)" strokeWidth="1.5" opacity="0.5" />
      <text x="32" y="44" textAnchor="middle" fontFamily="SF Mono, ui-monospace, monospace" fontWeight="700" fontSize="32" fill="url(#logo-g)">H</text>
    </svg>
  )
}

/* ─── Section wrapper with reveal ────────────────────────── */

function Section({ children, className = '', id }: { children: React.ReactNode; className?: string; id?: string }) {
  const { ref, visible } = useReveal(0.1)
  return (
    <section
      ref={ref}
      id={id}
      className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}
    >
      {children}
    </section>
  )
}

/* ─── Philosophy Pillar (immersive) ──────────────────────── */

interface PillarBlockProps {
  index: string
  keyword: string
  title: string
  description: string
  manifesto: string
  accentColor: string
  glowColor: string
  codeSnippet: string[]
  reverse?: boolean
}

function PillarBlock({ index, keyword, title, description, manifesto, accentColor, glowColor, codeSnippet, reverse }: PillarBlockProps) {
  const { ref, visible } = useReveal(0.12)
  const { ref: cardRef, handleMouse } = useMouseGlow()

  return (
    <div
      ref={ref}
      className={`relative transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}
    >
      {/* Background glow for this pillar */}
      <div
        className="absolute -inset-20 pointer-events-none rounded-full blur-[160px] opacity-0 transition-opacity duration-1000"
        style={{ background: glowColor, opacity: visible ? 0.06 : 0 }}
      />

      <div className={`relative grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center ${reverse ? 'lg:direction-rtl' : ''}`}>
        {/* Text side */}
        <div className={`space-y-6 ${reverse ? 'lg:order-2 lg:direction-ltr' : ''}`}>
          {/* Index + keyword */}
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs tracking-widest" style={{ color: accentColor }}>
              {index}
            </span>
            <div className="h-px flex-1 max-w-16" style={{ background: `linear-gradient(90deg, ${accentColor}40, transparent)` }} />
          </div>

          {/* Keyword big */}
          <div
            className="font-mono text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter"
            style={{
              background: `linear-gradient(135deg, #fafafa 0%, ${accentColor} 100%)`,
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            {keyword}
          </div>

          {/* Title */}
          <h3 className="text-xl sm:text-2xl font-semibold text-text-bright leading-tight">
            {title}
          </h3>

          {/* Description */}
          <p className="text-text leading-relaxed max-w-lg">
            {description}
          </p>

          {/* Manifesto quote */}
          <div className="relative pl-4 border-l-2" style={{ borderColor: `${accentColor}40` }}>
            <p className="font-mono text-xs leading-relaxed" style={{ color: `${accentColor}cc` }}>
              "{manifesto}"
            </p>
          </div>
        </div>

        {/* Visual side — terminal/code card */}
        <div className={`${reverse ? 'lg:order-1 lg:direction-ltr' : ''}`}>
          <div
            ref={cardRef}
            onMouseMove={handleMouse}
            className="pillar-card relative rounded-[var(--radius-xl)] border border-border bg-surface/60 backdrop-blur-sm overflow-hidden p-6 sm:p-8"
            style={{ '--pillar-accent': accentColor } as React.CSSProperties}
          >
            {/* Gradient top edge */}
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${accentColor}40, transparent)` }} />

            {/* Code block */}
            <div className="font-mono text-xs sm:text-sm leading-loose text-text-muted">
              {codeSnippet.map((line, i) => (
                <div
                  key={i}
                  className={`transition-all duration-500 ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-6'}`}
                  style={{ transitionDelay: visible ? `${0.3 + i * 0.08}s` : '0s' }}
                >
                  {line.startsWith('//') ? (
                    <span className="text-text-dim">{line}</span>
                  ) : line.includes('=') || line.includes(':') ? (
                    <span>
                      <span style={{ color: accentColor }}>{line.split(/[=:]/)[0]}</span>
                      <span className="text-text-dim">{line.includes('=') ? '=' : ':'}</span>
                      <span className="text-text">{line.split(/[=:]/)[1]}</span>
                    </span>
                  ) : line.includes('✓') || line.includes('>>>') ? (
                    <span className="text-green">{line}</span>
                  ) : (
                    <span>{line}</span>
                  )}
                </div>
              ))}
              <span
                className="inline-block w-2 h-4 align-middle mt-1"
                style={{ backgroundColor: `${accentColor}80`, animation: 'typing-cursor 1s step-end infinite' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Tech badge ─────────────────────────────────────────── */

function TechBadge({ label, delay }: { label: string; delay: number }) {
  const { ref, visible } = useReveal(0.05)
  return (
    <span
      ref={ref}
      style={{ animationDelay: `${delay}s` }}
      className={`inline-block font-mono text-xs px-3 py-1.5 rounded-[var(--radius-sm)] border border-border bg-surface-hi/50 text-text-muted transition-all duration-500 hover:border-accent/30 hover:text-accent hover:bg-accent-dim cursor-default ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
    >
      {label}
    </span>
  )
}

/* ═══════════════════════════════════════════════════════════ */
/* ─── LANDING ────────────────────────────────────────────── */
/* ═══════════════════════════════════════════════════════════ */

export function Landing() {
  const { displayed, done } = useTyping('hackstler', 80, 800)
  const navVisible = useScrollNav()

  return (
    <div className="relative overflow-hidden">

      {/* ── Ambient orbs ─────────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[10%] left-[15%] w-[700px] h-[700px] bg-accent/[0.06] rounded-full blur-[200px]" style={{ animation: 'orb-drift 12s ease-in-out infinite, glow-pulse 6s ease-in-out infinite' }} />
        <div className="absolute bottom-[10%] right-[10%] w-[600px] h-[600px] bg-brand/[0.05] rounded-full blur-[180px]" style={{ animation: 'orb-drift 15s ease-in-out infinite reverse, glow-pulse 8s ease-in-out infinite 2s' }} />
        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-accent/[0.03] rounded-full blur-[150px]" style={{ animation: 'orb-drift 10s ease-in-out infinite 3s, glow-pulse 7s ease-in-out infinite 4s' }} />
      </div>

      {/* ══════════════════════════════════════════════════════ */}
      {/* HERO                                                  */}
      {/* ══════════════════════════════════════════════════════ */}
      <header className="relative min-h-screen flex flex-col justify-center items-center px-6 text-center overflow-hidden">
        {/* Grid background */}
        <div className="hero-grid absolute inset-0 pointer-events-none" />

        {/* Scan line */}
        <div className="hero-scan absolute inset-0 pointer-events-none overflow-hidden" />

        {/* Radial vignette */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_0%,#09090b_70%)]" />

        {/* Floating decorative elements */}
        <div className="absolute top-[20%] left-[8%] hidden md:block pointer-events-none animate-fade-in-up stagger-6">
          <div className="font-mono text-[10px] text-text-dim/40 leading-relaxed" style={{ animation: 'float 6s ease-in-out infinite' }}>
            <div>{'{'} agents: 6,</div>
            <div>&nbsp;&nbsp;tools: 14,</div>
            <div>&nbsp;&nbsp;plugins: 4 {'}'}</div>
          </div>
        </div>
        <div className="absolute bottom-[25%] right-[8%] hidden md:block pointer-events-none animate-fade-in-up stagger-7">
          <div className="font-mono text-[10px] text-text-dim/40 leading-relaxed" style={{ animation: 'float 7s ease-in-out infinite 1s' }}>
            <div>status: <span className="text-green/40">online</span></div>
            <div>latency: 12ms</div>
            <div>uptime: 99.97%</div>
          </div>
        </div>

        {/* Side accent lines */}
        <div className="absolute left-0 top-[30%] h-[40%] w-px hidden lg:block pointer-events-none">
          <div className="h-full w-full bg-gradient-to-b from-transparent via-accent/20 to-transparent" />
        </div>
        <div className="absolute right-0 top-[25%] h-[50%] w-px hidden lg:block pointer-events-none">
          <div className="h-full w-full bg-gradient-to-b from-transparent via-brand/20 to-transparent" />
        </div>

        {/* Gradient bar top */}
        <div className="gradient-bar h-[2px] fixed top-0 left-0 right-0 z-50" />

        {/* Nav — appears on scroll */}
        <nav className={`fixed top-[2px] left-0 right-0 z-40 glass border-b border-border transition-all duration-500 ${navVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'}`}>
          <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between">
            <a href="#" className="flex items-center gap-3 group">
              <Logo className="w-7 h-7 transition-transform duration-300 group-hover:scale-110" />
              <span className="font-mono text-sm font-semibold text-text-bright tracking-tight">HACKSTLER</span>
            </a>
            <div className="flex items-center gap-6">
              <a href="#philosophy" className="hidden sm:block font-mono text-[11px] text-text-muted hover:text-accent tracking-wider uppercase transition-colors">Philosophy</a>
              <a href="#work" className="hidden sm:block font-mono text-[11px] text-text-muted hover:text-brand tracking-wider uppercase transition-colors">Work</a>
              <a
                href="mailto:sergio@hackstler.com"
                className="btn-press font-mono text-[11px] font-semibold tracking-wider px-4 py-1.5 rounded-[var(--radius-sm)] border border-accent/30 text-accent hover:bg-accent-dim hover:border-accent/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all duration-300"
              >
                CONTACT
              </a>
            </div>
          </div>
        </nav>

        {/* Hero content */}
        <div className="max-w-4xl mx-auto relative z-10">
          {/* Terminal prompt line */}
          <div className="animate-fade-in-up stagger-1 mb-4">
            <span className="inline-flex items-center gap-2 font-mono text-xs sm:text-sm px-4 py-2 rounded-full border border-border bg-surface/40 backdrop-blur-sm text-text-muted">
              <span className="w-2 h-2 rounded-full bg-green shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
              <span className="text-accent">$</span> whoami <span className="text-brand">--verbose</span>
            </span>
          </div>

          {/* Main title with glitch — only after typing completes */}
          <h1
            className={`animate-fade-in-up stagger-2 font-mono text-5xl sm:text-7xl md:text-[8rem] font-bold tracking-tighter mb-2 ${done ? 'glitch-text' : ''}`}
            data-text={done ? 'hackstler' : ''}
          >
            <span className="gradient-text">{displayed}</span>
            <span
              className="inline-block w-[4px] h-[0.75em] bg-accent ml-1 align-middle shadow-[0_0_12px_rgba(59,130,246,0.6)]"
              style={{ animation: done ? 'typing-cursor 1s step-end infinite' : 'none' }}
            />
          </h1>

          {/* Decorative line under title */}
          <div className="animate-fade-in-up stagger-3 flex items-center justify-center gap-3 my-6">
            <div className="h-px w-12 sm:w-20 bg-gradient-to-r from-transparent to-accent/40" />
            <span className="font-mono text-[10px] text-accent/60 tracking-[0.3em] uppercase">hack &middot; build &middot; ship</span>
            <div className="h-px w-12 sm:w-20 bg-gradient-to-l from-transparent to-brand/40" />
          </div>

          {/* Tagline */}
          <p className="animate-fade-in-up stagger-4 text-lg sm:text-xl md:text-2xl text-text-muted max-w-2xl mx-auto leading-relaxed">
            We hack the rules. We hustle the craft.
          </p>
          <p className="animate-fade-in-up stagger-5 text-lg sm:text-xl md:text-2xl max-w-2xl mx-auto mt-2 leading-relaxed">
            <span className="text-text-bright font-medium">Building next-generation software</span>{' '}
            <span className="gradient-text-brand font-semibold">powered by AI.</span>
          </p>

          {/* Sub-tagline */}
          <p className="animate-fade-in-up stagger-6 font-mono text-xs text-text-dim mt-5 tracking-wide">
            {'>'} disruptive by design &mdash; engineered to break boundaries
          </p>

          {/* CTA */}
          <div className="animate-fade-in-up stagger-7 mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#philosophy"
              className="btn-press group relative font-mono text-sm font-semibold tracking-wider px-8 py-3.5 rounded-[var(--radius-lg)] bg-accent text-white hover:bg-accent-hover hover:shadow-[0_0_50px_rgba(59,130,246,0.5)] transition-all duration-300 overflow-hidden"
              style={{ animation: 'neon-flicker 6s ease-in-out infinite, neon-glow-flicker 6s ease-in-out infinite' }}
            >
              <span className="relative z-10">EXPLORE <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">&rarr;</span></span>
              {/* Shimmer — always alive, intensifies on hover */}
              <div className="absolute inset-0 overflow-hidden rounded-[inherit]">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" style={{ animation: 'btn-shimmer 4s ease-in-out infinite' }} />
              </div>
            </a>
            <a
              href="mailto:sergio@hackstler.com"
              className="btn-press font-mono text-sm font-semibold tracking-wider px-8 py-3.5 rounded-[var(--radius-lg)] border border-border text-text-muted hover:text-text-bright hover:border-accent/30 hover:bg-surface-hover hover:shadow-[0_0_24px_rgba(59,130,246,0.08)] transition-all duration-300"
            >
              GET IN TOUCH
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-fade-in-up stagger-9">
          <div className="flex flex-col items-center gap-2">
            <span className="font-mono text-[9px] text-text-dim tracking-widest uppercase">scroll</span>
            <div className="w-5 h-8 rounded-full border border-border-hi flex justify-center pt-2">
              <div className="w-1 h-1.5 bg-accent/60 rounded-full" style={{ animation: 'float 2s ease-in-out infinite' }} />
            </div>
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════ */}
      {/* PHILOSOPHY                                            */}
      {/* ══════════════════════════════════════════════════════ */}
      <section id="philosophy" className="relative py-24 sm:py-32 px-6">
        {/* Section intro */}
        <Section className="max-w-4xl mx-auto text-center mb-20 sm:mb-28">
          <span className="font-mono text-xs text-accent tracking-widest uppercase mb-4 block">
            // 001 &mdash; Philosophy
          </span>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-8">
            <span className="gradient-text">Not a company.</span>{' '}
            <span className="text-text-bright">A mindset.</span>
          </h2>
          <p className="text-lg text-text max-w-2xl mx-auto leading-relaxed">
            Born from the fusion of{' '}
            <span className="text-accent font-semibold">hacker</span> thinking and{' '}
            <span className="text-brand font-semibold">hustler</span> execution &mdash;
            the art of finding the smartest path through any problem,
            then putting in the relentless work to ship it.
          </p>
          {/* Decorative separator */}
          <div className="flex items-center justify-center gap-4 mt-12">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-accent/30" />
            <div className="w-1.5 h-1.5 rounded-full bg-accent/40" />
            <div className="w-1.5 h-1.5 rounded-full bg-brand/40" />
            <div className="w-1.5 h-1.5 rounded-full bg-brand-accent/40" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-brand-accent/30" />
          </div>
        </Section>

        {/* Pillar 1: HACK */}
        <div className="max-w-6xl mx-auto mb-24 sm:mb-32">
          <PillarBlock
            index="001"
            keyword="hack_"
            title="Every system has a crack. We find it."
            description="We don't accept the default path. Every process has a shortcut, every wall has a door that nobody tried. We reverse-engineer problems, find the hidden leverage points, and exploit them — not to destroy, but to build something fundamentally better."
            manifesto="Social engineering meets software engineering. The best code isn't written — it's discovered."
            accentColor="#3b82f6"
            glowColor="rgba(59,130,246,1)"
            codeSnippet={[
              '// mindset.hack()',
              'const problem = analyze(system)',
              'const cracks = problem.findVulnerabilities()',
              'const shortcut = cracks.exploit({',
              '  goal: "build_better",',
              '  method: "unconventional"',
              '})',
              '',
              '>>> shortcut.execute()',
              '✓ System improved. Rules rewritten.',
            ]}
          />
        </div>

        {/* Pillar 2: HUSTLE */}
        <div className="max-w-6xl mx-auto mb-24 sm:mb-32">
          <PillarBlock
            index="002"
            keyword="hustle_"
            title="Ideas die in silence. We ship loud."
            description="Ideas without execution are just daydreams. We grind. We ship. We iterate until the product speaks louder than any pitch deck ever could. Every line of code is a bet placed on ourselves, and we don't make bets we aren't willing to go all-in on."
            manifesto="The gap between vision and reality is closed with obsession, not planning."
            accentColor="#8b5cf6"
            glowColor="rgba(139,92,246,1)"
            reverse
            codeSnippet={[
              '// execution.hustle()',
              'while (!shipped) {',
              '  const iteration = build(fast)',
              '  const feedback = deploy(iteration)',
              '  learn(feedback)',
              '  adapt()',
              '}',
              '',
              '>>> product.status',
              '✓ Live. Iterating. Unstoppable.',
            ]}
          />
        </div>

        {/* Pillar 3: DISRUPT */}
        <div className="max-w-6xl mx-auto">
          <PillarBlock
            index="003"
            keyword="disrupt_"
            title="Convention is a vulnerability we exploit."
            description="We operate at the edge of what's accepted. Cyberpunk isn't just our aesthetic — it's how we think about software. Question every assumption. Automate ruthlessly. Build systems that feel like they come from the future, because they do."
            manifesto="The future doesn't ask permission. Neither do we."
            accentColor="#ec4899"
            glowColor="rgba(236,72,153,1)"
            codeSnippet={[
              '// paradigm.disrupt()',
              'const rules = industry.getConventions()',
              'const broken = rules.map(rule => {',
              '  return rule.challenge({',
              '    with: "first_principles",',
              '    bias: "none"',
              '  })',
              '})',
              '',
              '>>> broken.rebuild()',
              '✓ New paradigm established.',
            ]}
          />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════ */}
      {/* WHAT WE BUILD                                         */}
      {/* ══════════════════════════════════════════════════════ */}
      <Section id="work" className="py-24 sm:py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 sm:mb-20">
            <span className="font-mono text-xs text-brand tracking-widest uppercase mb-4 block">
              // 002 &mdash; What We Build
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold gradient-text tracking-tight mb-6">
              The next generation<br className="hidden sm:block" /> of AI-powered software.
            </h2>
            <p className="text-text max-w-2xl mx-auto leading-relaxed">
              We're pioneering a new paradigm: <span className="text-text-bright font-semibold">UIless SaaS</span>.
              Full enterprise-grade platforms controlled entirely through conversational channels &mdash;
              WhatsApp, Telegram, any chat. No dashboards to learn. No buttons to click.
              Just talk to your business.
            </p>
          </div>

          {/* Architecture showcase */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
            {/* Left: Terminal window */}
            <TerminalCard />

            {/* Right: Feature list */}
            <div className="flex flex-col gap-4 justify-center">
              <FeatureRow
                number="01"
                title="Multi-Agent Architecture"
                description="Coordinator agents that orchestrate specialized sub-agents. Each one a master of its domain &mdash; RAG, quoting, scheduling, analytics."
                delay={0}
              />
              <FeatureRow
                number="02"
                title="Conversational Interface"
                description="Your entire SaaS accessible through WhatsApp or Telegram. Send a message, get a quote. Ask a question, retrieve documents. No UI needed."
                delay={0.1}
              />
              <FeatureRow
                number="03"
                title="Enterprise RAG Pipeline"
                description="Hybrid vector search with pgvector, intelligent chunking, query transformation, and optional reranking. Your data, instantly searchable by AI."
                delay={0.2}
              />
              <FeatureRow
                number="04"
                title="Plugin Ecosystem"
                description="Modular plugin architecture with MCP integrations. Gmail, Calendar, CRM, billing &mdash; each plugin encapsulates an agent, tools, and routes."
                delay={0.3}
              />
            </div>
          </div>

          {/* Tech stack */}
          <div className="text-center">
            <p className="font-mono text-xs text-text-dim tracking-wider uppercase mb-6">Tech we work with</p>
            <div className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
              {[
                'TypeScript', 'React', 'Node.js', 'Hono', 'Mastra.ai',
                'pgvector', 'RAG', 'MCP', 'Gemini', 'Drizzle ORM',
                'WhatsApp API', 'Tailwind CSS', 'Vite', 'Vercel', 'Railway',
              ].map((tech, i) => (
                <TechBadge key={tech} label={tech} delay={i * 0.04} />
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ══════════════════════════════════════════════════════ */}
      {/* CONTACT / CTA                                         */}
      {/* ══════════════════════════════════════════════════════ */}
      <Section id="contact" className="py-24 sm:py-32 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <span className="font-mono text-xs text-brand-accent tracking-widest uppercase mb-4 block">
            // 003 &mdash; Get in Touch
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-6">
            <span className="gradient-text">Ready to build</span>{' '}
            <span className="text-text-bright">something</span>{' '}
            <span className="gradient-text-brand">disruptive?</span>
          </h2>
          <p className="text-text max-w-xl mx-auto leading-relaxed mb-10">
            Whether you need an AI-powered SaaS from scratch, a conversational interface for your existing product,
            or a team that thinks different about software &mdash; we should talk.
          </p>

          <a
            href="mailto:sergio@hackstler.com"
            className="btn-press group inline-flex items-center gap-3 font-mono text-sm font-semibold tracking-wider px-10 py-4 rounded-[var(--radius-lg)] bg-accent text-white hover:bg-accent-hover shadow-[var(--shadow-glow-accent)] hover:shadow-[0_0_50px_rgba(59,130,246,0.4)] transition-all duration-300"
          >
            <span>sergio@hackstler.com</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
          </a>

          <p className="font-mono text-xs text-text-dim mt-6 tracking-wide">
            // response time: &lt; 24h &mdash; usually faster
          </p>
        </div>
      </Section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Logo className="w-6 h-6" />
            <span className="font-mono text-xs text-text-dim tracking-tight">HACKSTLER</span>
          </div>
          <p className="font-mono text-xs text-text-dim">
            &copy; {new Date().getFullYear()} Hackstler. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  )
}

/* ─── Terminal Card sub-component ────────────────────────── */

function TerminalCard() {
  const { ref, visible } = useReveal(0.1)
  const lines = [
    { prompt: true, text: 'hackstler deploy --agent coordinator' },
    { prompt: false, text: '> Initializing plugin registry...' },
    { prompt: false, text: '> [rag] Loaded: searchDocuments, saveNote, searchWeb' },
    { prompt: false, text: '> [quote] Loaded: calculateBudget, generatePDF' },
    { prompt: false, text: '> [mcp] Connected: gmail, calendar, crm' },
    { prompt: false, text: '> Agent "Emilio" online. Listening on WhatsApp.' },
    { prompt: false, text: '', empty: true },
    { prompt: false, text: '> Ready. Waiting for messages...', success: true },
  ]

  return (
    <div
      ref={ref}
      className={`rounded-[var(--radius-xl)] border border-border bg-surface overflow-hidden shadow-[var(--shadow-card)] transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-surface-hi/50">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red/60" />
          <div className="w-3 h-3 rounded-full bg-yellow/60" />
          <div className="w-3 h-3 rounded-full bg-green/60" />
        </div>
        <span className="font-mono text-[11px] text-text-dim ml-2">hackstler@edge ~ /deploy</span>
      </div>
      {/* Lines */}
      <div className="p-5 font-mono text-xs sm:text-sm leading-loose">
        {lines.map((line, i) => (
          <div
            key={i}
            className={`transition-all duration-500 ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
            style={{ transitionDelay: visible ? `${i * 120}ms` : '0ms' }}
          >
            {(line as { empty?: boolean }).empty ? (
              <br />
            ) : line.prompt ? (
              <span>
                <span className="text-accent">$</span>{' '}
                <span className="text-text-bright">{line.text}</span>
              </span>
            ) : (line as { success?: boolean }).success ? (
              <span className="text-green">{line.text}</span>
            ) : (
              <span className="text-text-muted">{line.text}</span>
            )}
          </div>
        ))}
        {/* Blinking cursor */}
        <span
          className="inline-block w-2 h-4 bg-accent/80 align-middle mt-1"
          style={{ animation: 'typing-cursor 1s step-end infinite' }}
        />
      </div>
    </div>
  )
}

/* ─── Feature Row sub-component ──────────────────────────── */

function FeatureRow({ number, title, description, delay }: { number: string; title: string; description: string; delay: number }) {
  const { ref, visible } = useReveal(0.1)
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}s` }}
      className={`group flex gap-4 p-5 rounded-[var(--radius-lg)] border border-border/50 bg-surface/30 hover:bg-surface-hover hover:border-border-hi transition-all duration-400 cursor-default ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}
    >
      <span className="font-mono text-xs text-accent/50 group-hover:text-accent transition-colors shrink-0 mt-0.5">{number}</span>
      <div>
        <h4 className="text-sm font-semibold text-text-bright mb-1.5 group-hover:text-accent transition-colors">{title}</h4>
        <p className="text-xs text-text-muted leading-relaxed">{description}</p>
      </div>
    </div>
  )
}
