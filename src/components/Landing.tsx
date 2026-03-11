import { useReveal } from '../hooks/useReveal'
import { useEffect, useState } from 'react'

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

/* ─── Pillar card ────────────────────────────────────────── */

interface PillarProps {
  icon: React.ReactNode
  title: string
  description: string
  accent: string
  glow: string
  delay: number
}

function Pillar({ icon, title, description, accent, glow, delay }: PillarProps) {
  const { ref, visible } = useReveal(0.1)
  return (
    <div
      ref={ref}
      style={{ '--card-glow': glow, '--card-accent': accent, animationDelay: `${delay}s` } as React.CSSProperties}
      className={`glow-card p-6 sm:p-8 rounded-[var(--radius-xl)] border border-border bg-surface/60 backdrop-blur-sm transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
    >
      <div className="w-12 h-12 rounded-[var(--radius-lg)] flex items-center justify-center mb-5 text-2xl"
        style={{ background: `${glow}`.replace('0.12', '0.1'), boxShadow: `0 0 24px ${glow}` }}
      >
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-text-bright mb-3">{title}</h3>
      <p className="text-sm text-text leading-relaxed">{description}</p>
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

  return (
    <div className="relative overflow-hidden">

      {/* ── Ambient orbs ──────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[15%] left-[20%] w-[600px] h-[600px] bg-accent/[0.04] rounded-full blur-[180px]" style={{ animation: 'glow-pulse 6s ease-in-out infinite' }} />
        <div className="absolute bottom-[20%] right-[15%] w-[500px] h-[500px] bg-brand/[0.03] rounded-full blur-[150px]" style={{ animation: 'glow-pulse 8s ease-in-out infinite 2s' }} />
        <div className="absolute top-[60%] left-[50%] w-[400px] h-[400px] bg-brand-accent/[0.02] rounded-full blur-[120px]" style={{ animation: 'glow-pulse 7s ease-in-out infinite 4s' }} />
      </div>

      {/* ══════════════════════════════════════════════════════ */}
      {/* HERO                                                  */}
      {/* ══════════════════════════════════════════════════════ */}
      <header className="relative min-h-screen flex flex-col justify-center items-center px-6 text-center">
        {/* Gradient bar top */}
        <div className="gradient-bar h-[2px] fixed top-0 left-0 right-0 z-50" />

        {/* Nav */}
        <nav className="fixed top-[2px] left-0 right-0 z-40 glass border-b border-border">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Logo className="w-8 h-8" />
              <span className="font-mono text-sm font-semibold text-text-bright tracking-tight">HACKSTLER</span>
            </div>
            <a
              href="mailto:sergio@hackstler.com"
              className="btn-press font-mono text-xs font-semibold tracking-wider px-5 py-2 rounded-[var(--radius-md)] border border-accent/30 text-accent hover:bg-accent-dim hover:border-accent/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all duration-300"
            >
              CONTACT
            </a>
          </div>
        </nav>

        {/* Hero content */}
        <div className="max-w-4xl mx-auto">
          {/* Terminal typing */}
          <div className="animate-fade-in-up stagger-1 mb-6">
            <span className="font-mono text-sm text-text-muted">
              <span className="text-accent">$</span> whoami <span className="text-brand">--verbose</span>
            </span>
          </div>

          {/* Main title */}
          <h1 className="animate-fade-in-up stagger-2 font-mono text-5xl sm:text-7xl md:text-8xl font-bold tracking-tighter mb-2">
            <span className="gradient-text">{displayed}</span>
            <span
              className="inline-block w-[3px] h-[0.8em] bg-accent ml-1 align-middle"
              style={{ animation: done ? 'typing-cursor 1s step-end infinite' : 'none' }}
            />
          </h1>

          {/* Tagline */}
          <p className="animate-fade-in-up stagger-3 text-lg sm:text-xl text-text-muted max-w-2xl mx-auto mt-6 leading-relaxed">
            We hack the rules. We hustle the craft.{' '}
            <span className="text-text-bright">Building next-generation software powered by AI.</span>
          </p>

          {/* Sub-tagline */}
          <p className="animate-fade-in-up stagger-4 font-mono text-xs text-text-dim mt-4 tracking-wide">
            // disruptive by design &mdash; engineered to break boundaries
          </p>

          {/* CTA */}
          <div className="animate-fade-in-up stagger-5 mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#philosophy"
              className="btn-press group font-mono text-sm font-semibold tracking-wider px-8 py-3.5 rounded-[var(--radius-lg)] bg-accent text-white hover:bg-accent-hover shadow-[var(--shadow-glow-accent)] hover:shadow-[0_0_40px_rgba(59,130,246,0.4)] transition-all duration-300"
            >
              EXPLORE <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
            </a>
            <a
              href="mailto:sergio@hackstler.com"
              className="btn-press font-mono text-sm font-semibold tracking-wider px-8 py-3.5 rounded-[var(--radius-lg)] border border-border text-text-muted hover:text-text-bright hover:border-border-hi hover:bg-surface-hover transition-all duration-300"
            >
              GET IN TOUCH
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-fade-in-up stagger-7">
          <div className="w-5 h-8 rounded-full border-2 border-border-hi flex justify-center pt-1.5">
            <div className="w-1 h-2 bg-text-dim rounded-full" style={{ animation: 'float 2s ease-in-out infinite' }} />
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════ */}
      {/* PHILOSOPHY                                            */}
      {/* ══════════════════════════════════════════════════════ */}
      <Section id="philosophy" className="py-24 sm:py-32 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16 sm:mb-20">
            <span className="font-mono text-xs text-accent tracking-widest uppercase mb-4 block">
              // 001 &mdash; Philosophy
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold gradient-text tracking-tight mb-6">
              Hack the system.<br className="hidden sm:block" /> Hustle the outcome.
            </h2>
            <p className="text-text max-w-2xl mx-auto leading-relaxed">
              Hackstler is not a company. It's a mindset. Born from the fusion of{' '}
              <span className="text-accent font-semibold">hacker</span> thinking and{' '}
              <span className="text-brand font-semibold">hustler</span> execution &mdash;
              the art of finding the smartest path through any problem, then putting in the relentless work to ship it.
            </p>
          </div>

          {/* Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Pillar
              icon={<span>&#x2F2F;</span>}
              title="Hacker Mindset"
              description="We don't accept the default path. Every system has a crack, every process has a shortcut. We reverse-engineer problems, find the vulnerability, and exploit it &mdash; not to destroy, but to build something better. Social engineering meets software engineering."
              accent="#3b82f6"
              glow="rgba(59,130,246,0.12)"
              delay={0}
            />
            <Pillar
              icon={<span>&#x26A1;</span>}
              title="Hustler Execution"
              description="Ideas without execution are just daydreams. We grind. We ship. We iterate until the product speaks louder than any pitch deck ever could. Every line of code is a bet placed on ourselves, and we play to win."
              accent="#8b5cf6"
              glow="rgba(139,92,246,0.12)"
              delay={0.15}
            />
            <Pillar
              icon={<span>&#x2318;</span>}
              title="Disruptive by Design"
              description="We operate at the edge of convention. Cyberpunk is not just an aesthetic &mdash; it's how we think about software. Question everything. Automate ruthlessly. Build systems that feel like they come from the future, because they do."
              accent="#ec4899"
              glow="rgba(236,72,153,0.12)"
              delay={0.3}
            />
          </div>
        </div>
      </Section>

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
