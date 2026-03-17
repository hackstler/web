import { createContext, useContext, useState, type ReactNode } from 'react'

export type Lang = 'en' | 'es'

/* ─── English ─────────────────────────────────────────────── */

const en = {
  nav: {
    solutions: 'Solutions',
    whatWeDo: 'What we do',
    philosophy: 'Philosophy',
    requestDemo: 'REQUEST DEMO',
  },
  hero: {
    tagline1: 'Your business, powered by AI.',
    tagline2: 'Managed from WhatsApp.',
    description:
      'Generate quotes, search documents, send emails and schedule meetings — all by talking to your intelligent assistant.',
    subTagline: '> built by hackstler — AI-native software for real businesses',
    ctaPrimary: 'DISCOVER HOW',
    ctaSecondary: 'REQUEST DEMO',
  },
  whatWeDo: {
    sectionLabel: '// 001 — What we do',
    title: 'Everything your business needs.',
    titleAccent: 'From WhatsApp.',
    description: 'An AI assistant that manages your business from chat, custom automations for what your tools can\'t handle, and real training so your team actually uses it.',
    rows: [
      {
        tag: 'Product',
        title: 'Your AI assistant on WhatsApp',
        description: 'Generate quotes, search documents, send emails, manage your calendar \u2014 all from a conversation. Full dashboard with roles and permissions included.',
        highlight: 'Live in days',
      },
      {
        tag: 'Build',
        title: 'We automate what\u2019s broken',
        description: 'We audit your operations, find what bleeds time and money, and build what\u2019s missing \u2014 KPI dashboards, stock control, supplier reports, automated flows. Plugged into your assistant.',
        highlight: 'Done for you',
      },
      {
        tag: 'Train',
        title: 'Your team, AI-ready',
        description: 'Practical workshops where every person leaves with at least one AI tool working in their daily workflow. Not theory \u2014 tools running from day one.',
        highlight: 'Ready in 1 day',
      },
    ],
  },
  demo: {
    sectionLabel: '// 002 — In action',
    title: 'See it in action.',
    titleBarText: 'hackstler@assistant ~ /whatsapp',
    tabs: [
      {
        label: 'Quote',
        messages: [
          { role: 'user' as const, text: 'I need a quote for installing 3 air conditioning units' },
          { role: 'bot' as const, text: 'I found 3 products in your catalog that match. Want me to generate the quote?' },
          { role: 'user' as const, text: 'Yes, for client Martinez' },
          { role: 'bot' as const, text: 'Quote generated \u2713 \u2014 3 items, total \u20ac4,350.00 [PDF attached]' },
          { role: 'user' as const, text: 'Send it by email to the client' },
          { role: 'bot' as const, text: 'Done \u2713 Email sent to martinez@empresa.com' },
        ],
      },
      {
        label: 'Docs',
        messages: [
          { role: 'user' as const, text: 'What warranty does the PRO-2500 inverter have?' },
          { role: 'bot' as const, text: 'Searching your knowledge base...' },
          { role: 'bot' as const, text: 'The PRO-2500 has a 5-year manufacturer warranty. Technical specs available in "catalogo-inversores-2025.pdf", page 8.' },
          { role: 'user' as const, text: 'Send that page to my email' },
          { role: 'bot' as const, text: 'Done \u2713 Excerpt sent to your inbox' },
        ],
      },
      {
        label: 'Calendar',
        messages: [
          { role: 'user' as const, text: 'What do I have scheduled for tomorrow?' },
          { role: 'bot' as const, text: 'Tomorrow you have 2 events: 10:00 Site visit \u2014 Client Garc\u00eda (Av. Libertad 23) and 16:30 Call with supplier TechParts.' },
          { role: 'user' as const, text: 'Move the supplier call to Thursday at 11' },
          { role: 'bot' as const, text: 'Done \u2713 Rescheduled to Thursday 11:00. Calendar updated.' },
        ],
      },
    ],
  },
  philosophy: {
    sectionLabel: '// 003 \u2014 Philosophy',
    titleGradient: 'Not a company.',
    titleBright: 'A mindset.',
    introBefore: 'Born from the fusion of ',
    introHacker: 'hacker',
    introBetween: ' thinking and ',
    introHustler: 'hustler',
    introAfter:
      ' execution \u2014 the art of finding the smartest path through any problem, then putting in the relentless work to ship it.',
    pillars: [
      {
        title: 'Every problem has a shortcut. We find it.',
        description:
          "We don't follow the default path. Where others see a wall, we see a door nobody tried. We reverse-engineer problems until we find the lever that moves everything \u2014 then we pull it.",
        manifesto:
          "The best solution isn't the obvious one \u2014 it's the one nobody else thought to look for.",
      },
      {
        title: 'Ideas die in silence. We ship loud.',
        description:
          "Ideas without execution are daydreams. We build, we ship, we iterate until the product speaks louder than any pitch deck. Every line of code is a bet on ourselves \u2014 and we go all-in.",
        manifesto:
          'The gap between vision and reality is closed with obsession, not planning.',
      },
      {
        title: "If everyone does it that way, there's a better way.",
        description:
          "We question every assumption. Automate what others do by hand. Build tools that feel like they come from the future \u2014 because for most businesses, they do.",
        manifesto: "The future doesn't ask permission. Neither do we.",
      },
    ],
  },
  faq: {
    sectionLabel: '// 004 — FAQ',
    title: 'Frequently asked questions.',
    items: [
      {
        question: 'Do I need to change my current tools?',
        answer:
          'No. We connect to what you already use \u2014 your email, calendar, documents. No migrations needed.',
      },
      {
        question: 'Does it only work through WhatsApp?',
        answer:
          'No. You have a full dashboard with users, roles and permissions. WhatsApp is the fast lane, not the only way.',
      },
      {
        question: "What if the assistant doesn't know how to answer?",
        answer:
          'It tells you. It never makes up information. And you can always review and adjust its behavior.',
      },
      {
        question: 'Is my data secure?',
        answer:
          'Yes. Each organization is isolated, with role-based access control. Your data is yours.',
      },
      {
        question: 'How long does it take to get started?',
        answer:
          'In a few days your assistant is up and running, adapted to your business.',
      },
    ],
  },
  cta: {
    sectionLabel: "// 005 — Let's talk",
    title: 'Ready to see it in action?',
    description:
      "We'll show you how your intelligent assistant can transform the way your team works. No commitment.",
    ctaButton: 'REQUEST YOUR DEMO',
    ctaSubtext: '// response time: < 24h \u2014 usually faster',
  },
  footer: {
    rights: 'All rights reserved.',
    legalTitle: 'Legal Notice',
    legalHolder: 'Legal holder',
    legalAddress: 'Address',
    legalName: 'Sergio Perez Andrade',
    legalAddressText: 'Calle Echegaray 13, Planta 2, Puerta A, 33208 Gijón, Asturias, España',
  },
}

/* ─── Spanish ─────────────────────────────────────────────── */

const es: typeof en = {
  nav: {
    solutions: 'Soluciones',
    whatWeDo: 'Qué hacemos',
    philosophy: 'Filosofía',
    requestDemo: 'SOLICITA DEMO',
  },
  hero: {
    tagline1: 'Tu negocio, potenciado por IA.',
    tagline2: 'Gestionado desde WhatsApp.',
    description:
      'Genera presupuestos, consulta documentos, envía emails y agenda reuniones — todo hablando con tu asistente inteligente.',
    subTagline: '> built by hackstler — software AI-native para negocios reales',
    ctaPrimary: 'DESCUBRE CÓMO',
    ctaSecondary: 'SOLICITA TU DEMO',
  },
  whatWeDo: {
    sectionLabel: '// 001 — Qué hacemos',
    title: 'Todo lo que tu negocio necesita.',
    titleAccent: 'Desde WhatsApp.',
    description: 'Un asistente IA que gestiona tu negocio desde el chat, automatizaciones a medida para lo que tus herramientas no cubren, y formación real para que tu equipo lo use de verdad.',
    rows: [
      {
        tag: 'Producto',
        title: 'Tu asistente IA en WhatsApp',
        description: 'Genera presupuestos, consulta documentos, envía emails, gestiona tu agenda — todo desde una conversación. Dashboard completo con roles y permisos incluido.',
        highlight: 'Activo en días',
      },
      {
        tag: 'Build',
        title: 'Automatizamos lo que falla',
        description: 'Auditamos tus operaciones, encontramos lo que te sangra tiempo y dinero, y construimos lo que falta — dashboards de KPIs, control de stock, informes de proveedores, flujos automáticos. Conectado a tu asistente.',
        highlight: 'Hecho para ti',
      },
      {
        tag: 'Formar',
        title: 'Tu equipo, AI-ready',
        description: 'Workshops prácticos donde cada persona sale con al menos una herramienta de IA funcionando en su día a día. No es teoría — herramientas operativas desde el primer día.',
        highlight: 'Listo en 1 día',
      },
    ],
  },
  demo: {
    sectionLabel: '// 002 — En acción',
    title: 'M\u00edralo en acci\u00f3n.',
    titleBarText: 'hackstler@assistant ~ /whatsapp',
    tabs: [
      {
        label: 'Presupuesto',
        messages: [
          { role: 'user' as const, text: 'Necesito un presupuesto para instalar 3 aires acondicionados' },
          { role: 'bot' as const, text: 'He encontrado 3 productos en tu cat\u00e1logo. \u00bfGenero el presupuesto?' },
          { role: 'user' as const, text: 'S\u00ed, para el cliente Mart\u00ednez' },
          { role: 'bot' as const, text: 'Presupuesto generado \u2713 \u2014 3 \u00edtems, total 4.350,00\u20ac [PDF adjunto]' },
          { role: 'user' as const, text: 'Env\u00edalo por email al cliente' },
          { role: 'bot' as const, text: 'Hecho \u2713 Email enviado a martinez@empresa.com' },
        ],
      },
      {
        label: 'Docs',
        messages: [
          { role: 'user' as const, text: '\u00bfQu\u00e9 garant\u00eda tiene el inversor PRO-2500?' },
          { role: 'bot' as const, text: 'Buscando en tu base de conocimiento...' },
          { role: 'bot' as const, text: 'El PRO-2500 tiene garant\u00eda de 5 a\u00f1os del fabricante. Ficha t\u00e9cnica disponible en "catalogo-inversores-2025.pdf", p\u00e1gina 8.' },
          { role: 'user' as const, text: 'Env\u00edame esa p\u00e1gina por email' },
          { role: 'bot' as const, text: 'Hecho \u2713 Extracto enviado a tu bandeja' },
        ],
      },
      {
        label: 'Agenda',
        messages: [
          { role: 'user' as const, text: '\u00bfQu\u00e9 tengo ma\u00f1ana?' },
          { role: 'bot' as const, text: 'Ma\u00f1ana tienes 2 eventos: 10:00 Visita obra \u2014 Cliente Garc\u00eda (Av. Libertad 23) y 16:30 Llamada proveedor TechParts.' },
          { role: 'user' as const, text: 'Mueve la llamada al proveedor al jueves a las 11' },
          { role: 'bot' as const, text: 'Hecho \u2713 Reprogramado para jueves 11:00. Calendario actualizado.' },
        ],
      },
    ],
  },
  philosophy: {
    sectionLabel: '// 003 \u2014 Filosof\u00eda',
    titleGradient: 'No somos una empresa.',
    titleBright: 'Somos una mentalidad.',
    introBefore: 'Nacidos de la fusi\u00f3n del pensamiento ',
    introHacker: 'hacker',
    introBetween: ' y la ejecuci\u00f3n ',
    introHustler: 'hustler',
    introAfter:
      ' \u2014 el arte de encontrar el camino m\u00e1s inteligente a trav\u00e9s de cualquier problema y luego poner el trabajo incansable para lanzarlo.',
    pillars: [
      {
        title: 'Todo problema tiene un atajo. Nosotros lo encontramos.',
        description:
          'No seguimos el camino por defecto. Donde otros ven un muro, nosotros vemos una puerta que nadie prob\u00f3. Desmontamos los problemas hasta encontrar la palanca que mueve todo \u2014 y tiramos de ella.',
        manifesto:
          'La mejor soluci\u00f3n no es la obvia \u2014 es la que nadie m\u00e1s se par\u00f3 a buscar.',
      },
      {
        title: 'Las ideas mueren en silencio. Nosotros las lanzamos.',
        description:
          'Las ideas sin ejecuci\u00f3n son sue\u00f1os. Construimos, lanzamos, iteramos hasta que el producto habla m\u00e1s alto que cualquier presentaci\u00f3n. Cada l\u00ednea de c\u00f3digo es una apuesta por nosotros mismos \u2014 y vamos all-in.',
        manifesto:
          'La distancia entre visi\u00f3n y realidad se cierra con obsesi\u00f3n, no con planificaci\u00f3n.',
      },
      {
        title: 'Si todos lo hacen as\u00ed, hay una forma mejor.',
        description:
          'Cuestionamos cada suposici\u00f3n. Automatizamos lo que otros hacen a mano. Construimos herramientas que parecen del futuro \u2014 porque para la mayor\u00eda de negocios, lo son.',
        manifesto: 'El futuro no pide permiso. Nosotros tampoco.',
      },
    ],
  },
  faq: {
    sectionLabel: '// 004 — FAQ',
    title: 'Preguntas frecuentes.',
    items: [
      {
        question: '\u00bfNecesito cambiar mis herramientas actuales?',
        answer:
          'No. Nos conectamos a lo que ya usas \u2014 tu email, calendario, documentos. Sin migraciones.',
      },
      {
        question: '\u00bfFunciona solo por WhatsApp?',
        answer:
          'No. Tienes un dashboard completo con usuarios, roles y permisos. WhatsApp es el canal r\u00e1pido, no el \u00fanico.',
      },
      {
        question: '\u00bfQu\u00e9 pasa si el asistente no sabe responder?',
        answer:
          'Te lo dice. Nunca inventa informaci\u00f3n. Y siempre puedes revisar y ajustar su comportamiento.',
      },
      {
        question: '\u00bfMis datos est\u00e1n seguros?',
        answer:
          'S\u00ed. Cada organizaci\u00f3n est\u00e1 aislada, con control de acceso por roles. Tus datos son tuyos.',
      },
      {
        question: '\u00bfCu\u00e1nto tarda en estar listo?',
        answer:
          'En pocos d\u00edas tu asistente est\u00e1 funcionando, adaptado a tu negocio.',
      },
    ],
  },
  cta: {
    sectionLabel: '// 005 — Hablemos',
    title: '\u00bfListo para verlo en acci\u00f3n?',
    description:
      'Te mostramos c\u00f3mo tu asistente inteligente puede transformar la forma en que trabaja tu equipo. Sin compromiso.',
    ctaButton: 'SOLICITA TU DEMO',
    ctaSubtext: '// tiempo de respuesta: < 24h \u2014 normalmente antes',
  },
  footer: {
    rights: 'Todos los derechos reservados.',
    legalTitle: 'Aviso Legal',
    legalHolder: 'Titular',
    legalAddress: 'Dirección',
    legalName: 'Sergio Perez Andrade',
    legalAddressText: 'Calle Echegaray 13, Planta 2, Puerta A, 33208 Gijón, Asturias, España',
  },
}

/* ─── Context ─────────────────────────────────────────────── */

const translations = { en, es } as const

export type Translations = typeof en

interface LangContextType {
  lang: Lang
  setLang: (l: Lang) => void
  t: Translations
}

const LangContext = createContext<LangContextType | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    if (typeof window === 'undefined') return 'en'
    const saved = localStorage.getItem('hackstler-lang') as Lang | null
    if (saved === 'en' || saved === 'es') return saved
    return navigator.language.startsWith('es') ? 'es' : 'en'
  })

  const changeLang = (l: Lang) => {
    setLang(l)
    localStorage.setItem('hackstler-lang', l)
    document.documentElement.lang = l
  }

  return (
    <LangContext.Provider value={{ lang, setLang: changeLang, t: translations[lang] }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
