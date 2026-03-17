import { useReveal } from '../hooks/useReveal'
import { useEffect, useState, useRef, useCallback } from 'react'
import { useLanguage } from '../i18n'

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

/* ─── Random neon flicker hook ───────────────────────────── */

function useNeonFlicker() {
  const ref = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let timeout: ReturnType<typeof setTimeout>
    let cancelled = false

    function flickerBurst() {
      if (cancelled || !el) return
      const steps = 3 + Math.floor(Math.random() * 5) // 3-7 flicker steps
      let i = 0

      function step() {
        if (cancelled || !el || i >= steps) {
          if (el) {
            el.style.opacity = '1'
            el.style.boxShadow = ''
          }
          // Next burst in 1.5–4s (random)
          timeout = setTimeout(flickerBurst, 1500 + Math.random() * 2500)
          return
        }
        const opacity = 0.2 + Math.random() * 0.6
        const glowIntensity = Math.random() * 0.5
        el.style.opacity = `${opacity}`
        el.style.boxShadow = `0 0 ${10 + glowIntensity * 40}px rgba(59,130,246,${glowIntensity}), 0 0 ${20 + glowIntensity * 60}px rgba(59,130,246,${glowIntensity * 0.4})`
        i++
        timeout = setTimeout(step, 40 + Math.random() * 60) // 40-100ms per step
      }
      step()
    }

    // Start first burst after 2-4s
    timeout = setTimeout(flickerBurst, 2000 + Math.random() * 2000)
    return () => { cancelled = true; clearTimeout(timeout) }
  }, [])

  return ref
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

/* ─── Decorative section divider ─────────────────────────── */

function SectionDivider({ accent = 'accent' }: { accent?: 'accent' | 'brand' | 'brand-accent' }) {
  return (
    <div className="flex items-center justify-center py-2">
      <div className={`h-px w-16 sm:w-24 bg-gradient-to-r from-transparent to-${accent}/20`} />
      <div className={`w-1 h-1 rounded-full bg-${accent}/30 mx-3`} />
      <div className={`h-px w-16 sm:w-24 bg-gradient-to-l from-transparent to-${accent}/20`} />
    </div>
  )
}

/* ─── Chat Demo (animated step-by-step conversation) ─────── */

/* Speeds (ms) */
const USER_CHAR_SPEED = 35
const BOT_CHAR_SPEED = 18
const THINKING_DURATION = 1200
const PAUSE_AFTER_MSG = 400

const TAB_ACCENTS = ['#3b82f6', '#8b5cf6', '#ec4899'] as const

type DemoPhase =
  | { kind: 'idle' }
  | { kind: 'typing'; msgIndex: number; charIndex: number }
  | { kind: 'thinking'; msgIndex: number }
  | { kind: 'done' }

function ChatDemo() {
  const { t } = useLanguage()
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const hasStarted = useRef(false)

  const [activeTab, setActiveTab] = useState(0)
  const messages = t.demo.tabs[activeTab].messages
  const [phase, setPhase] = useState<DemoPhase>({ kind: 'idle' })
  const [renderedMessages, setRenderedMessages] = useState<Array<{ role: 'user' | 'bot'; text: string }>>([])
  const [transitioning, setTransitioning] = useState(false)

  /* Switch tab — fade out, swap, fade in */
  const switchTab = useCallback((tabIndex: number) => {
    if (tabIndex === activeTab || transitioning) return
    setTransitioning(true)
    setTimeout(() => {
      setActiveTab(tabIndex)
      setRenderedMessages([])
      setPhase({ kind: 'typing', msgIndex: 0, charIndex: 0 })
      setTimeout(() => setTransitioning(false), 30)
    }, 150)
  }, [activeTab, transitioning])

  /* Auto-scroll chat to bottom */
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [renderedMessages, phase])

  /* Intersection observer — start animation when section enters viewport */
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted.current) {
          hasStarted.current = true
          setPhase({ kind: 'typing', msgIndex: 0, charIndex: 0 })
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  /* Animation engine */
  useEffect(() => {
    if (phase.kind === 'idle' || phase.kind === 'done') return

    if (phase.kind === 'typing') {
      const { msgIndex, charIndex } = phase
      const msg = messages[msgIndex]
      if (!msg) { setPhase({ kind: 'done' }); return }
      const speed = msg.role === 'user' ? USER_CHAR_SPEED : BOT_CHAR_SPEED

      if (charIndex < msg.text.length) {
        const timer = setTimeout(() => {
          const nextChar = charIndex + 1
          setRenderedMessages(prev => {
            const updated = [...prev]
            if (updated.length <= msgIndex) {
              updated.push({ role: msg.role, text: msg.text.slice(0, nextChar) })
            } else {
              updated[msgIndex] = { role: msg.role, text: msg.text.slice(0, nextChar) }
            }
            return updated
          })
          setPhase({ kind: 'typing', msgIndex, charIndex: nextChar })
        }, speed)
        return () => clearTimeout(timer)
      } else {
        const nextIndex = msgIndex + 1
        if (nextIndex >= messages.length) {
          const timer = setTimeout(() => setPhase({ kind: 'done' }), PAUSE_AFTER_MSG)
          return () => clearTimeout(timer)
        }
        const nextMsg = messages[nextIndex]
        if (nextMsg.role === 'bot') {
          const timer = setTimeout(() => setPhase({ kind: 'thinking', msgIndex: nextIndex }), PAUSE_AFTER_MSG)
          return () => clearTimeout(timer)
        } else {
          const timer = setTimeout(() => setPhase({ kind: 'typing', msgIndex: nextIndex, charIndex: 0 }), PAUSE_AFTER_MSG)
          return () => clearTimeout(timer)
        }
      }
    }

    if (phase.kind === 'thinking') {
      const timer = setTimeout(() => {
        setPhase({ kind: 'typing', msgIndex: phase.msgIndex, charIndex: 0 })
      }, THINKING_DURATION)
      return () => clearTimeout(timer)
    }
  }, [phase, messages])

  /* Render helper: colorize checkmarks in bot text */
  const renderBotText = (text: string) => {
    if (!text.includes('\u2713')) return <span className="text-text-muted">{text}</span>
    const parts = text.split('\u2713')
    return (
      <span className="text-text-muted">
        {parts[0]}<span className="text-green">{'\u2713'}</span>{parts.slice(1).join('\u2713')}
      </span>
    )
  }

  return (
    <div
      ref={containerRef}
      className="rounded-[var(--radius-xl)] border border-border bg-surface overflow-hidden shadow-[var(--shadow-card)]"
    >
      {/* Title bar with tabs */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-surface-hi/50">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red/60" />
          <div className="w-3 h-3 rounded-full bg-yellow/60" />
          <div className="w-3 h-3 rounded-full bg-green/60" />
        </div>
        <span className="font-mono text-[11px] text-text-dim ml-2">{t.demo.titleBarText}</span>
        {/* Tab selector */}
        <div className="ml-auto flex gap-1">
          {t.demo.tabs.map((tab, i) => (
            <button
              key={i}
              onClick={() => switchTab(i)}
              className="font-mono text-[10px] tracking-wider px-3 py-1 rounded-[var(--radius-sm)] transition-all duration-300 cursor-pointer"
              style={{
                color: activeTab === i ? TAB_ACCENTS[i] : undefined,
                backgroundColor: activeTab === i ? `${TAB_ACCENTS[i]}15` : 'transparent',
                borderBottom: activeTab === i ? `1px solid ${TAB_ACCENTS[i]}60` : '1px solid transparent',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div ref={scrollRef} className="p-5 sm:p-6 font-mono text-xs sm:text-sm leading-relaxed space-y-4 min-h-[260px] max-h-[400px] overflow-y-auto transition-opacity duration-150" style={{ opacity: transitioning ? 0 : 1 }}>
        {renderedMessages.map((msg, i) => (
          <div key={`${activeTab}-${i}`} className="flex gap-2 animate-fade-in-up" style={{ animationDuration: '0.3s' }}>
            {msg.role === 'user' ? (
              <>
                <span className="text-brand shrink-0">you &gt;</span>
                <span className="text-text-bright">{msg.text}</span>
                {phase.kind === 'typing' && phase.msgIndex === i && phase.charIndex < messages[i]?.text.length && (
                  <span className="inline-block w-[3px] h-[1em] bg-brand/80 align-middle ml-0.5" style={{ animation: 'typing-cursor 0.6s step-end infinite' }} />
                )}
              </>
            ) : (
              <>
                <span className="text-accent shrink-0">ast &gt;</span>
                {renderBotText(msg.text)}
                {phase.kind === 'typing' && phase.msgIndex === i && phase.charIndex < messages[i]?.text.length && (
                  <span className="inline-block w-[3px] h-[1em] bg-accent/80 align-middle ml-0.5" style={{ animation: 'typing-cursor 0.6s step-end infinite' }} />
                )}
              </>
            )}
          </div>
        ))}

        {/* Thinking dots */}
        {phase.kind === 'thinking' && (
          <div className="flex gap-2 animate-fade-in-up" style={{ animationDuration: '0.2s' }}>
            <span className="text-accent shrink-0">ast &gt;</span>
            <span className="inline-flex gap-1 items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-accent/60" style={{ animation: 'thinking-dot 1.4s ease-in-out infinite' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-accent/60" style={{ animation: 'thinking-dot 1.4s ease-in-out infinite 0.2s' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-accent/60" style={{ animation: 'thinking-dot 1.4s ease-in-out infinite 0.4s' }} />
            </span>
          </div>
        )}

        {/* Final blinking cursor when done */}
        {phase.kind === 'done' && (
          <div className="flex gap-2">
            <span className="text-green shrink-0">&gt;</span>
            <span className="text-green text-[11px]">session complete</span>
            <span className="inline-block w-2 h-4 bg-accent/80 align-middle" style={{ animation: 'typing-cursor 1s step-end infinite' }} />
          </div>
        )}

        {/* Idle state — waiting cursor */}
        {phase.kind === 'idle' && (
          <div className="flex gap-2 text-text-dim">
            <span>&gt;</span>
            <span>waiting for input...</span>
            <span className="inline-block w-2 h-4 bg-text-dim/40 align-middle" style={{ animation: 'typing-cursor 1s step-end infinite' }} />
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── FAQ Item (glassmorphism + terminal accent) ─────────── */

function FAQItem({ question, answer, accentColor, delay }: { question: string; answer: string; accentColor: string; delay: number }) {
  const [open, setOpen] = useState(false)
  const { ref, visible } = useReveal(0.1)

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}s` }}
      className={`rounded-[var(--radius-lg)] border overflow-hidden backdrop-blur-sm transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} ${open ? 'bg-surface/50 border-border-hi' : 'bg-surface/20 border-border/50'}`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left cursor-pointer group"
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="font-mono text-xs shrink-0" style={{ color: accentColor }}>&gt;</span>
          <span className="text-sm font-medium text-text-bright group-hover:text-white transition-colors">{question}</span>
        </div>
        <span
          className="font-mono text-sm shrink-0 transition-transform duration-300"
          style={{ color: accentColor, transform: open ? 'rotate(45deg)' : 'none' }}
        >+</span>
      </button>
      <div className={`overflow-hidden transition-all duration-400 ${open ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-5 pb-5 pl-11">
          <div className="h-px mb-3" style={{ background: `linear-gradient(90deg, ${accentColor}20, transparent)` }} />
          <p className="text-xs text-text-muted leading-relaxed">{answer}</p>
        </div>
      </div>
    </div>
  )
}

/* ─── Philosophy Terminal Boot ─────────────────────────────── */

const PILLAR_COMMANDS = ['hack_ --find-shortcut', 'hustle_ --ship-it', 'disrupt_ --no-defaults'] as const

function PhilosophyTerminal() {
  const { t } = useLanguage()
  const containerRef = useRef<HTMLDivElement>(null)
  const hasStarted = useRef(false)
  const hasFinished = useRef(false)
  const [started, setStarted] = useState(false)
  const [visibleSteps, setVisibleSteps] = useState(0) // 0..7 (init, then 2 per pillar: cmd+content, then final)

  /* Start once when terminal enters viewport — never restart */
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted.current) {
          hasStarted.current = true
          setStarted(true)
        }
      },
      { threshold: 0.2 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  /* Sequential reveal: each step appears after a delay */
  useEffect(() => {
    if (!started || hasFinished.current) return
    const totalSteps = 7 // init, cmd0, content0, cmd1, content1, cmd2, content2
    if (visibleSteps >= totalSteps) {
      hasFinished.current = true
      return
    }
    const delay = visibleSteps === 0 ? 400 : 500
    const timer = setTimeout(() => setVisibleSteps(s => s + 1), delay)
    return () => clearTimeout(timer)
  }, [started, visibleSteps])

  return (
    <div ref={containerRef} className="max-w-3xl mx-auto">
      <div className="rounded-[var(--radius-xl)] border border-border bg-surface overflow-hidden shadow-[var(--shadow-card)]">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-surface-hi/50">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red/60" />
            <div className="w-3 h-3 rounded-full bg-yellow/60" />
            <div className="w-3 h-3 rounded-full bg-green/60" />
          </div>
          <span className="font-mono text-[11px] text-text-dim ml-2">hackstler@core ~ /philosophy</span>
        </div>

        {/* Scanline overlay */}
        <div className="relative">
          <div
            className="absolute inset-0 pointer-events-none z-10 opacity-[0.03]"
            style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.04) 2px, rgba(255,255,255,0.04) 4px)' }}
          />

          {/* Terminal body */}
          <div className="p-6 sm:p-8 font-mono text-xs sm:text-sm leading-relaxed space-y-6">
            {/* Init line */}
            <div className={`transition-opacity duration-500 ${visibleSteps >= 1 ? 'opacity-100' : 'opacity-0'}`}>
              <span className="text-text-dim">{'>'} initializing hackstler.philosophy...</span>
            </div>

            {/* Pillar blocks */}
            {t.philosophy.pillars.map((pillar, i) => {
              const color = ACCENT_CYCLE[i]
              const cmdStep = 2 + i * 2     // steps 2, 4, 6
              const contentStep = 3 + i * 2  // steps 3, 5, 7
              const showCmd = visibleSteps >= cmdStep
              const showContent = visibleSteps >= contentStep

              return (
                <div key={i} className={`space-y-1.5 transition-opacity duration-400 ${showCmd ? 'opacity-100' : 'opacity-0'}`}>
                  {/* Command line */}
                  <div className="flex items-center gap-2">
                    <span className="text-text-dim select-none">$</span>
                    <span className="font-bold" style={{ color }}>{PILLAR_COMMANDS[i]}</span>
                  </div>

                  {/* Output: title */}
                  <div className={`transition-all duration-500 ${showContent ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-3'}`}>
                    <span className="text-text-dim select-none">&gt; </span>
                    <span className="text-text-bright">{pillar.title}</span>
                  </div>

                  {/* Output: manifesto */}
                  <div className={`transition-all duration-500 delay-150 ${showContent ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-3'}`}>
                    <span style={{ color: `${color}99` }}>&nbsp;&nbsp;"{pillar.manifesto}"</span>
                  </div>

                  {/* Checkmark */}
                  <div className={`transition-all duration-300 delay-300 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
                    <span className="text-green">{'\u2713'}</span>
                    <span className="text-text-dim ml-1">done</span>
                  </div>
                </div>
              )
            })}

            {/* Final cursor */}
            <div className={`transition-opacity duration-500 ${visibleSteps >= 7 ? 'opacity-100' : 'opacity-0'}`}>
              <span className="text-green">&gt;</span>
              <span className="text-green ml-1">philosophy.loaded</span>
              <span
                className="inline-block w-2 h-4 bg-accent/80 align-middle ml-2"
                style={{ animation: 'typing-cursor 1s step-end infinite' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════ */
/* ─── LANDING ────────────────────────────────────────────── */
/* ═══════════════════════════════════════════════════════════ */

const ACCENT_CYCLE = ['#3b82f6', '#8b5cf6', '#ec4899'] as const

export function Landing() {
  const { displayed, done } = useTyping('hackstler', 55, 300)
  const navVisible = useScrollNav()
  const { lang, setLang, t } = useLanguage()
  const flickerRef = useNeonFlicker()

  return (
    <div className="relative overflow-hidden">

      {/* ── Ambient orbs ─────────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[10%] left-[15%] w-[700px] h-[700px] bg-accent/[0.06] rounded-full blur-[200px]" style={{ animation: 'orb-drift 12s ease-in-out infinite' }} />
        <div className="absolute bottom-[10%] right-[10%] w-[600px] h-[600px] bg-brand/[0.05] rounded-full blur-[180px]" style={{ animation: 'orb-drift 15s ease-in-out infinite reverse' }} />
        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-accent/[0.03] rounded-full blur-[150px]" style={{ animation: 'orb-drift 10s ease-in-out infinite 3s' }} />
      </div>

      {/* ══════════════════════════════════════════════════════ */}
      {/* HERO                                                  */}
      {/* ══════════════════════════════════════════════════════ */}
      <header className="relative min-h-screen flex flex-col justify-center items-center px-6 text-center overflow-hidden">
        <div className="hero-grid absolute inset-0 pointer-events-none" />
        <div className="hero-scan absolute inset-0 pointer-events-none overflow-hidden" />
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

        {/* Nav */}
        <nav className={`fixed top-[2px] left-0 right-0 z-40 glass border-b border-border transition-all duration-500 ${navVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'}`}>
          <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between">
            <a href="#" className="flex items-center gap-3 group">
              <Logo className="w-7 h-7 transition-transform duration-300 group-hover:scale-110" />
              <span className="font-mono text-sm font-semibold text-text-bright tracking-tight">HACKSTLER</span>
            </a>
            <div className="flex items-center gap-6">
              <a href="#solutions" className="hidden sm:block font-mono text-[11px] text-text-muted hover:text-accent tracking-wider uppercase transition-colors">{t.nav.solutions}</a>
              <a href="#philosophy" className="hidden sm:block font-mono text-[11px] text-text-muted hover:text-brand tracking-wider uppercase transition-colors">{t.nav.philosophy}</a>
              <button
                onClick={() => setLang(lang === 'en' ? 'es' : 'en')}
                className="font-mono text-[11px] text-text-dim hover:text-text-bright tracking-wider uppercase transition-colors cursor-pointer"
              >
                {lang === 'en' ? 'ES' : 'EN'}
              </button>
              <a
                href="mailto:sergio@hackstler.com?subject=Demo%20Request"
                className="btn-press font-mono text-[11px] font-semibold tracking-wider px-4 py-1.5 rounded-[var(--radius-sm)] border border-accent/30 text-accent hover:bg-accent-dim hover:border-accent/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all duration-300"
              >
                {t.nav.requestDemo}
              </a>
            </div>
          </div>
        </nav>

        {/* Hero content */}
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="animate-fade-in-up stagger-1 mb-4">
            <span className="inline-flex items-center gap-2 font-mono text-xs sm:text-sm px-4 py-2 rounded-full border border-border bg-surface/40 backdrop-blur-sm text-text-muted">
              <span className="w-2 h-2 rounded-full bg-green shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
              <span className="text-accent">$</span> whoami <span className="text-brand">--verbose</span>
            </span>
          </div>

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

          <div className="animate-fade-in-up stagger-3 flex items-center justify-center gap-3 my-6">
            <div className="h-px w-12 sm:w-20 bg-gradient-to-r from-transparent to-accent/40" />
            <span className="font-mono text-[10px] text-accent/60 tracking-[0.3em] uppercase">hack &middot; build &middot; ship</span>
            <div className="h-px w-12 sm:w-20 bg-gradient-to-l from-transparent to-brand/40" />
          </div>

          <p className="animate-fade-in-up stagger-4 text-lg sm:text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed">
            <span className="text-text-bright font-medium">{t.hero.tagline1}</span>{' '}
            <span className="gradient-text-brand font-semibold">{t.hero.tagline2}</span>
          </p>
          <p className="animate-fade-in-up stagger-5 text-sm sm:text-base text-text-muted max-w-xl mx-auto mt-4 leading-relaxed">
            {t.hero.description}
          </p>

          <p className="animate-fade-in-up stagger-6 font-mono text-xs text-text-dim mt-5 tracking-wide">
            {t.hero.subTagline}
          </p>

          <div className="animate-fade-in-up stagger-7 mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              ref={flickerRef}
              href="#solutions"
              className="btn-press group relative font-mono text-sm font-semibold tracking-wider px-8 py-3.5 rounded-[var(--radius-lg)] bg-accent text-white hover:bg-accent-hover hover:shadow-[0_0_50px_rgba(59,130,246,0.5)] transition-[transform,background-color] duration-300 overflow-hidden shadow-[var(--shadow-glow-accent)]"
            >
              <span className="relative z-10">{t.hero.ctaPrimary} <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">&rarr;</span></span>
              <div className="absolute inset-0 overflow-hidden rounded-[inherit]">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" style={{ animation: 'btn-shimmer 4s ease-in-out infinite' }} />
              </div>
            </a>
            <a
              href="mailto:sergio@hackstler.com?subject=Demo%20Request"
              className="btn-press font-mono text-sm font-semibold tracking-wider px-8 py-3.5 rounded-[var(--radius-lg)] border border-border text-text-muted hover:text-text-bright hover:border-accent/30 hover:bg-surface-hover hover:shadow-[0_0_24px_rgba(59,130,246,0.08)] transition-all duration-300"
            >
              {t.hero.ctaSecondary}
            </a>
          </div>
        </div>

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
      {/* WHAT WE DO — unified section                          */}
      {/* ══════════════════════════════════════════════════════ */}
      <section id="solutions" className="relative py-24 sm:py-32 px-6">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-accent/[0.04] rounded-full blur-[200px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-brand/[0.03] rounded-full blur-[180px] pointer-events-none" />

        <Section className="max-w-4xl mx-auto">
          <div className="text-center mb-16 sm:mb-20">
            <span className="font-mono text-xs text-accent tracking-widest uppercase mb-4 block">
              {t.whatWeDo.sectionLabel}
            </span>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
              <span className="text-text-bright">{t.whatWeDo.title}</span>{' '}
              <span className="gradient-text">{t.whatWeDo.titleAccent}</span>
            </h2>
            <p className="text-sm sm:text-base text-text-muted max-w-2xl mx-auto mt-4 leading-relaxed">
              {t.whatWeDo.description}
            </p>
          </div>

          {/* Unified rows */}
          <div className="rounded-[var(--radius-xl)] border border-border bg-surface overflow-hidden shadow-[var(--shadow-card)]">
            {t.whatWeDo.rows.map((row, i) => {
              const color = ACCENT_CYCLE[i]
              const isLast = i === t.whatWeDo.rows.length - 1
              return (
                <div key={i} className={`relative p-6 sm:p-8 ${!isLast ? 'border-b border-border' : ''}`}>
                  <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ background: `linear-gradient(180deg, ${color}, ${color}20)` }} />

                  <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
                    <div className="flex items-center gap-3 sm:min-w-[120px] shrink-0">
                      <span className="font-mono text-2xl sm:text-3xl font-bold" style={{ color }}>{String(i + 1).padStart(2, '0')}</span>
                      <span className="font-mono text-[10px] tracking-widest uppercase" style={{ color: `${color}99` }}>{row.tag}</span>
                    </div>

                    <div className="space-y-2 flex-1">
                      <h4 className="text-sm sm:text-base font-semibold text-text-bright leading-tight">{row.title}</h4>
                      <p className="text-xs text-text-muted leading-relaxed">{row.description}</p>
                    </div>

                    <div className="shrink-0 self-start">
                      <span className="font-mono text-[11px] px-2.5 py-1 rounded-[var(--radius-sm)] border whitespace-nowrap" style={{ color, borderColor: `${color}25`, backgroundColor: `${color}08` }}>
                        {row.highlight}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </Section>
      </section>

      <SectionDivider accent="brand-accent" />

      {/* ══════════════════════════════════════════════════════ */}
      {/* DEMO                                                  */}
      {/* ══════════════════════════════════════════════════════ */}
      <section className="relative py-24 sm:py-32 px-6">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-brand-accent/[0.04] rounded-full blur-[200px] pointer-events-none" />

        <Section className="max-w-4xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <span className="font-mono text-xs text-brand-accent tracking-widest uppercase mb-4 block">
              {t.demo.sectionLabel}
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold gradient-text-brand tracking-tight mb-6">
              {t.demo.title}
            </h2>
          </div>

          <ChatDemo />
        </Section>
      </section>

      <SectionDivider accent="accent" />

      {/* ══════════════════════════════════════════════════════ */}
      {/* PHILOSOPHY                                            */}
      {/* ══════════════════════════════════════════════════════ */}
      <section id="philosophy" className="relative py-24 sm:py-32 px-6">
        <Section className="max-w-4xl mx-auto text-center mb-16 sm:mb-20">
          <span className="font-mono text-xs text-accent tracking-widest uppercase mb-4 block">
            {t.philosophy.sectionLabel}
          </span>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-8">
            <span className="gradient-text">{t.philosophy.titleGradient}</span>{' '}
            <span className="text-text-bright">{t.philosophy.titleBright}</span>
          </h2>
          <p className="text-lg text-text max-w-2xl mx-auto leading-relaxed">
            {t.philosophy.introBefore}
            <span className="text-accent font-semibold">{t.philosophy.introHacker}</span>
            {t.philosophy.introBetween}
            <span className="text-brand font-semibold">{t.philosophy.introHustler}</span>
            {t.philosophy.introAfter}
          </p>
        </Section>

        {/* Terminal boot sequence */}
        <PhilosophyTerminal />
      </section>

      <SectionDivider accent="accent" />

      {/* ══════════════════════════════════════════════════════ */}
      {/* FAQ                                                   */}
      {/* ══════════════════════════════════════════════════════ */}
      <section className="relative py-24 sm:py-32 px-6">
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[400px] h-[300px] bg-brand/[0.03] rounded-full blur-[160px] pointer-events-none" />

        <Section className="max-w-3xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <span className="font-mono text-xs text-brand tracking-widest uppercase mb-4 block">
              {t.faq.sectionLabel}
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold gradient-text tracking-tight">
              {t.faq.title}
            </h2>
          </div>

          <div className="space-y-3">
            {t.faq.items.map((item, i) => (
              <FAQItem
                key={i}
                question={item.question}
                answer={item.answer}
                accentColor={ACCENT_CYCLE[i % 3]}
                delay={i * 0.08}
              />
            ))}
          </div>
        </Section>
      </section>

      {/* ══════════════════════════════════════════════════════ */}
      {/* CONTACT / CTA                                         */}
      {/* ══════════════════════════════════════════════════════ */}
      <Section id="contact" className="py-24 sm:py-32 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <span className="font-mono text-xs text-brand-accent tracking-widest uppercase mb-4 block">
            {t.cta.sectionLabel}
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-6">
            <span className="gradient-text">{t.cta.title}</span>
          </h2>
          <p className="text-text max-w-xl mx-auto leading-relaxed mb-10">
            {t.cta.description}
          </p>

          <a
            href="mailto:sergio@hackstler.com?subject=Demo%20Request"
            className="btn-press group inline-flex items-center gap-3 font-mono text-sm font-semibold tracking-wider px-10 py-4 rounded-[var(--radius-lg)] bg-accent text-white hover:bg-accent-hover shadow-[var(--shadow-glow-accent)] hover:shadow-[0_0_50px_rgba(59,130,246,0.4)] transition-all duration-300"
          >
            <span>{t.cta.ctaButton}</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
          </a>

          <p className="font-mono text-xs text-text-dim mt-6 tracking-wide">
            {t.cta.ctaSubtext}
          </p>
          <p className="font-mono text-[10px] text-text-dim/60 mt-4">
            {t.footer.legalName} &mdash; {t.footer.legalAddressText}
          </p>
        </div>
      </Section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <Logo className="w-6 h-6" />
              <span className="font-mono text-xs text-text-dim tracking-tight">HACKSTLER</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setLang(lang === 'en' ? 'es' : 'en')}
                className="font-mono text-[10px] text-text-dim hover:text-text-muted tracking-wider uppercase transition-colors cursor-pointer"
              >
                {lang === 'en' ? 'ES' : 'EN'}
              </button>
              <a href="#legal" className="font-mono text-[10px] text-text-dim hover:text-text-muted tracking-wider uppercase transition-colors">
                {t.footer.legalTitle}
              </a>
              <p className="font-mono text-xs text-text-dim">
                &copy; {new Date().getFullYear()} Hackstler. {t.footer.rights}
              </p>
            </div>
          </div>

          {/* Legal notice — crawlable HTML text */}
          <div id="legal" className="border-t border-border/50 pt-5">
            <p className="font-mono text-[10px] text-text-dim tracking-widest uppercase mb-3">{t.footer.legalTitle}</p>
            <div className="font-mono text-xs text-text-dim leading-relaxed space-y-1">
              <p><span className="text-text-muted">{t.footer.legalHolder}:</span> {t.footer.legalName}</p>
              <p><span className="text-text-muted">{t.footer.legalAddress}:</span> {t.footer.legalAddressText}</p>
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}
