// Todo el texto del portfolio, en español e inglés.
// Fuentes: el contenido que me pasaste (Ciberseguridad, Programación, Certificaciones,
// IA y hackatones, Robótica, Objetivo) + la web actual (proyectos, métricas, formación, enlaces).

export type Lang = 'es' | 'en';
export type L = { es: string; en: string };
const l = (es: string, en: string): L => ({ es, en });

export const links = {
  email: 'rafagasi09@gmail.com',
  github: 'https://github.com/Ruby570bocadito',
  linkedin: 'https://www.linkedin.com/in/rafael-g%C3%A1lvez-silipo-07445a409/',
  cv: '/cv.pdf',
  cvName: 'CV Rafael Galvez Silipo.pdf',
  previousSite: '/'
};

export const meta = {
  title: l(
    'Rafael Gálvez Silipo — Ciberseguridad · Programación · IA · Robótica',
    'Rafael Gálvez Silipo — Cybersecurity · Programming · AI · Robotics'
  ),
  description: l(
    'Portfolio de Rafael Gálvez Silipo: hacking ético, pentesting y seguridad defensiva (SOC), programación en Python y Bash, inteligencia artificial y robótica. Málaga, España.',
    'Portfolio of Rafael Gálvez Silipo: ethical hacking, pentesting and defensive security (SOC), Python and Bash programming, artificial intelligence and robotics. Málaga, Spain.'
  )
};

export const nav = [
  { id: 'about', label: l('Sobre mí', 'About') },
  { id: 'areas', label: l('Áreas', 'Focus') },
  { id: 'projects', label: l('Proyectos', 'Projects') },
  { id: 'contact', label: l('Contacto', 'Contact') }
];

export const floatingNav = [
  { id: 'about', label: l('Sobre mí', 'About') },
  { id: 'areas', label: l('Áreas', 'Focus') },
  { id: 'projects', label: l('Proyectos', 'Projects') },
  { id: 'training', label: l('Formación', 'Training') },
  { id: 'robotics', label: l('Robótica', 'Robotics') },
  { id: 'contact', label: l('Contacto', 'Contact') }
];

export const ui = {
  contactMe: l('Contáctame', 'Contact me'),
  viewOnGithub: l('Ver en GitHub', 'View on GitHub'),
  downloadCv: l('Descargar CV', 'Download CV'),
  emailMe: l('Escríbeme', 'Email me'),
  copied: l('Correo copiado', 'Email copied'),
  copyEmail: l('Copiar correo', 'Copy email'),
  backToTop: l('Volver arriba', 'Back to top'),
  langLabel: l('Cambiar idioma', 'Change language'),
  skip: l('Saltar al contenido', 'Skip to content'),
  menu: l('Menú', 'Menu'),
  close: l('Cerrar', 'Close')
};

export const hero = {
  heading: l('Hola, soy Rafael', 'Hi, I’m Rafael'),
  status: l('Disponible para prácticas', 'Open to internships'),
  tagline: l(
    'Ciberseguridad, programación, IA y robótica: aprendo construyendo herramientas reales',
    'Cybersecurity, code, AI and robotics: I learn by building real tools'
  ),
  portraitAlt: l('Retrato de Rafael Gálvez Silipo', 'Portrait of Rafael Gálvez Silipo'),
  scannerHint: l('Pasa el cursor por el retrato', 'Hover the portrait')
};

// Capturas reales de los proyectos + portadas (kv-*) generadas con Muse Image.
export type Tile = { src: string; alt: string; video?: string };
export const marquee: { top: Tile[]; bottom: Tile[] } = {
  top: [
    { src: 'img/tile-orq-panel.webp', alt: 'OrquestaRT — consola de operador' },
    { src: 'img/tile-kv-worldc2.webp', alt: 'WorldC2 — portada' },
    { src: 'img/tile-wc2-dashboard.webp', alt: 'WorldC2 — panel' },
    { src: 'img/tile-hive-console.webp', alt: 'HiveMind — consola de la colonia' },
    { src: 'img/tile-wormy-banner.webp', alt: 'Wormy — banner' },
    { src: 'img/tile-orq-hallazgos.webp', alt: 'OrquestaRT — hallazgos' },
    { src: 'img/tile-wc2-sessions.webp', alt: 'WorldC2 — sesiones' },
    { src: 'img/tile-kv-hivemind.webp', alt: 'HiveMind — portada' },
    { src: 'img/tile-wormy-report.webp', alt: 'Wormy — informe comparativo' },
    { src: 'img/tile-orq-roe.webp', alt: 'OrquestaRT — reglas de enfrentamiento' },
    { src: 'img/tile-hive-architecture.webp', alt: 'HiveMind — arquitectura' }
  ],
  bottom: [
    { src: 'img/poster-wormy-dashboard.webp', video: 'video/wormy-dashboard.mp4', alt: 'Wormy — panel de propagación (demo)' },
    { src: 'img/tile-kv-orquesta.webp', alt: 'OrquestaRT — portada' },
    { src: 'img/tile-wc2-terminal.webp', alt: 'WorldC2 — terminal' },
    { src: 'img/poster-hive-tui.webp', video: 'video/hive-tui.mp4', alt: 'HiveMind — TUI (demo)' },
    { src: 'img/tile-orq-equipo.webp', alt: 'OrquestaRT — equipo' },
    { src: 'img/tile-wormy-overview.webp', alt: 'Wormy — vista general' },
    { src: 'img/poster-wormy-cli.webp', video: 'video/wormy-cli.mp4', alt: 'Wormy — CLI (demo)' },
    { src: 'img/tile-kv-lab.webp', alt: 'Laboratorio — portada' },
    { src: 'img/tile-wc2-vault.webp', alt: 'WorldC2 — bóveda de credenciales' },
    { src: 'img/tile-orq-federado.webp', alt: 'OrquestaRT — acceso federado' }
  ]
};

export const about = {
  heading: l('Sobre mí', 'About me'),
  text: l(
    'Empecé a programar con unos 10 años creando videojuegos en C# y Unity. Las ganas de entender cómo funcionan los sistemas por dentro me llevaron a la ciberseguridad: hoy estudio SMR, me formo en hacking ético, pentesting y seguridad defensiva, y aprendo construyendo mis propias herramientas. ¡Construyamos algo increíble juntos!',
    'I started programming at around 10, building video games in C# and Unity. Wanting to understand how systems work underneath led me to cybersecurity: today I study Systems & Networks (SMR), train in ethical hacking, pentesting and defensive security, and learn by building my own tools. Let’s build something incredible together!'
  ),
  facts: [
    { k: l('Ubicación', 'Location'), v: l('Málaga, España', 'Málaga, Spain') },
    { k: l('Estudios', 'Studies'), v: l('SMR — Sistemas y Redes', 'SMR — Systems & Networks') },
    { k: l('Enfoque', 'Focus'), v: l('Seguridad ofensiva y defensiva', 'Offensive & defensive security') },
    { k: l('Estado', 'Status'), v: l('Disponible para prácticas', 'Open to internships') }
  ],
  stats: [
    { to: 18, suffix: '+', label: l('repositorios públicos', 'public repositories') },
    { to: 1400, suffix: '+', label: l('tests automatizados', 'automated tests') },
    { to: 30, suffix: '+', label: l('cursos y certificaciones', 'courses & certifications') },
    { to: 6, suffix: '+', label: l('años programando', 'years programming') }
  ]
};

export type RiveIcon = 'icon_target' | 'icon_shield' | 'icon_code' | 'icon_neural' | 'icon_gear';
export type Text = string | L;
export const areas = {
  heading: l('Áreas', 'Focus'),
  items: [
    {
      icon: 'icon_target' as RiveIcon,
      name: l('Hacking ético y pentesting', 'Ethical hacking & pentesting'),
      desc: l(
        'Pentesting web, de redes y Wi-Fi, dispositivos Android y Active Directory; escalada de privilegios en Linux y Metasploit. Siempre con metodología y en entornos autorizados.',
        'Web, network and Wi-Fi pentesting, Android devices and Active Directory; Linux privilege escalation and Metasploit. Always methodical, always in authorized environments.'
      ),
      tags: ['Kali Linux', 'Metasploit', 'Active Directory', 'Web', 'Wi-Fi', 'Android']
    },
    {
      icon: 'icon_shield' as RiveIcon,
      name: l('Seguridad defensiva y SOC', 'Defensive security & SOC'),
      desc: l(
        'Análisis SOC con EDR, SIEM y Microsoft Defender, detección de phishing y análisis de malware: entender la amenaza para detectarla y responder a tiempo.',
        'SOC analysis with EDR, SIEM and Microsoft Defender, phishing detection and malware analysis: understanding threats to detect them and respond in time.'
      ),
      tags: ['EDR', 'SIEM', 'Microsoft Defender', 'Phishing', 'Malware', 'MITRE ATT&CK']
    },
    {
      icon: 'icon_code' as RiveIcon,
      name: l('Programación y automatización', 'Programming & automation'),
      desc: l(
        'Python y Bash para automatizar tareas de seguridad, además de Go, Rust y C# en mis proyectos de investigación. HTML y CSS para la web y Linux como entorno de trabajo diario.',
        'Python and Bash to automate security tasks, plus Go, Rust and C# in my research projects. HTML and CSS for the web, and Linux as my daily environment.'
      ),
      tags: ['Python', 'Bash', 'Go', 'Rust', 'C#', 'HTML/CSS']
    },
    {
      icon: 'icon_neural' as RiveIcon,
      name: l('Inteligencia artificial', 'Artificial intelligence'),
      desc: l(
        'IA aplicada a la ciberseguridad: LLMs locales, agentes y automatización. La uso como multiplicador, nunca como piloto automático: el código generado se revisa, se prueba y se entiende.',
        'AI applied to cybersecurity: local LLMs, agents and automation. A force multiplier, never an autopilot: generated code gets reviewed, tested and understood.'
      ),
      tags: [l('LLMs locales', 'Local LLMs'), l('Agentes', 'Agents'), 'RAG', l('Automatización', 'Automation')]
    },
    {
      icon: 'icon_gear' as RiveIcon,
      name: l('Robótica y videojuegos', 'Robotics & game development'),
      desc: l(
        'Líder de un equipo de robótica finalista nacional en el ASTI Challenge y unos cinco años de formación en programación de videojuegos con C# y Unity.',
        'Leader of a robotics team that reached the national final of the ASTI Challenge, and about five years of training in game programming with C# and Unity.'
      ),
      tags: ['ASTI Challenge', 'Unity', 'C#', l('Liderazgo', 'Leadership')]
    }
  ]
};

export type Project = {
  name: string;
  category: L;
  status: L;
  done: boolean;
  role: L;
  desc: L;
  stack: string;
  href: string;
  metrics: { v: string; label: L }[];
  images: { a: string; b: string; c: string; alt: L };
};
export const projects = {
  heading: l('Proyectos', 'Projects'),
  intro: l(
    'Cuatro proyectos de ingeniería, cada uno para responder a una pregunta real sobre seguridad. Capturas reales, sin maquetas.',
    'Four engineering projects, each one built to answer a real security question. Real screenshots, no mock-ups.'
  ),
  disclaimer: l(
    'Proyectos de investigación diseñados para laboratorios aislados y autorizados.',
    'Research projects designed for isolated, authorized lab environments.'
  ),
  items: [
    {
      name: 'OrquestaRT',
      category: l('Red Team · IA', 'Red Team · AI'),
      status: l('Investigación activa', 'Active research'),
      done: false,
      role: l('Plataforma de orquestación Red Team asistida por IA', 'AI-assisted Red Team orchestration platform'),
      desc: l(
        'Orquesta operaciones Red Team autorizadas mediante flujos asistidos por IA, combinando automatización ofensiva con aprobación humana, control del alcance y auditoría completa.',
        'Orchestrates authorized Red Team operations through AI-assisted workflows, combining offensive automation with human approval, scope enforcement and full auditability.'
      ),
      stack: 'Python · FastAPI · LangGraph · Next.js',
      href: 'https://github.com/Ruby570bocadito/orquesta-rt',
      metrics: [
        { v: '587', label: l('tests automatizados', 'automated tests') },
        { v: 'F0→F7', label: l('fases de orquestación', 'orchestration phases') },
        { v: '26+', label: l('transportes de recon', 'recon transports') }
      ],
      images: { a: 'img/kv-orquesta.webp', b: 'img/shot-orq-hallazgos.webp', c: 'img/shot-orq-panel.webp', alt: l('OrquestaRT', 'OrquestaRT') }
    },
    {
      name: 'WorldC2',
      category: l('Mando y control', 'Command & control'),
      status: l('Investigación activa', 'Active research'),
      done: false,
      role: l('Plataforma C2 para laboratorios de seguridad autorizados', 'C2 platform for authorized security labs'),
      desc: l(
        'Proyecto de investigación para entender la arquitectura de mando y control: comunicaciones cifradas, gestión de sesiones e infraestructura de operador.',
        'A research project to understand command-and-control architecture: encrypted communications, session management and operator infrastructure.'
      ),
      stack: 'Go · Vue 3 · Networking · Cryptography',
      href: 'https://github.com/Ruby570bocadito/WorldC2',
      metrics: [
        { v: '5', label: l('transportes de respaldo', 'transport fallbacks') },
        { v: '4', label: l('roles RBAC', 'RBAC roles') },
        { v: '14', label: l('tests E2E de navegador', 'browser E2E tests') }
      ],
      images: { a: 'img/kv-worldc2.webp', b: 'img/shot-wc2-sessions.webp', c: 'img/shot-wc2-dashboard.webp', alt: l('WorldC2', 'WorldC2') }
    },
    {
      name: 'HiveMind',
      category: l('Sistemas distribuidos · Rust', 'Distributed systems · Rust'),
      status: l('Investigación activa', 'Active research'),
      done: false,
      role: l('Investigación de seguridad multi-agente distribuida', 'Distributed multi-agent security research'),
      desc: l(
        'Proyecto experimental en Rust que explora la coordinación multi-agente, los sistemas distribuidos, la concurrencia, el consenso y la investigación asistida por IA.',
        'An experimental Rust project exploring multi-agent coordination, distributed systems, concurrency, consensus and AI-assisted research.'
      ),
      stack: 'Rust · Distributed Systems · Concurrency · AI',
      href: 'https://github.com/Ruby570bocadito/HiveMind',
      metrics: [
        { v: '282', label: l('tests superados', 'tests passing') },
        { v: '9', label: l('crates en el workspace', 'workspace crates') },
        { v: '0', label: l('puertos TCP entre agentes', 'TCP ports between agents') }
      ],
      images: { a: 'img/kv-hivemind.webp', b: 'img/shot-hive-architecture.webp', c: 'img/shot-hive-console.webp', alt: l('HiveMind', 'HiveMind') }
    },
    {
      name: 'Wormy',
      category: l('Malware · Machine Learning', 'Malware · Machine Learning'),
      status: l('Investigación completada', 'Research complete'),
      done: true,
      role: l('Investigación de malware y seguridad de redes', 'Malware & network security research'),
      desc: l(
        'Investigación experimental sobre el comportamiento del malware, la propagación por red y el aprendizaje automático, en entornos de laboratorio aislados.',
        'Experimental research into malware behaviour, network propagation and machine learning, in isolated lab environments.'
      ),
      stack: 'Python · Machine Learning · Networking · Docker',
      href: 'https://github.com/Ruby570bocadito/Wormy-ML-Network-Worm',
      metrics: [
        { v: '525', label: l('tests automatizados', 'automated tests') },
        { v: '44', label: l('módulos de exploit controlados', 'gated exploit modules') },
        { v: '15', label: l('servicios de laboratorio', 'lab services') }
      ],
      images: { a: 'img/shot-wormy-banner.webp', b: 'img/shot-wormy-report.webp', c: 'img/shot-wormy-overview.webp', alt: l('Wormy', 'Wormy') }
    }
  ] as Project[]
};

export const moreProjects = {
  heading: l('Más proyectos', 'More projects'),
  items: [
    { name: 'security-framework', lang: 'Go', href: 'https://github.com/Ruby570bocadito/security-framework', note: l('con web en vivo', 'live website'),
      desc: l('Detección de amenazas en Windows en tiempo real: sensor ETW en Rust, motor conductual en Go, reglas MITRE ATT&CK y consola web.', 'Real-time Windows threat detection: Rust ETW sensor, Go behavioural engine, MITRE ATT&CK rules and a web console.') },
    { name: 'aura-soc', lang: 'Go', href: 'https://github.com/Ruby570bocadito/aura-soc', note: l('lado blue team', 'blue team side'),
      desc: l('Framework SOC de código abierto: detección como código, purple team e IA local. Go, Vue 3, NATS y OpenSearch.', 'Open-source SOC framework: detection-as-code, purple teaming and local AI. Go, Vue 3, NATS and OpenSearch.') },
    { name: 'Auto-Privilege', lang: 'Go', href: 'https://github.com/Ruby570bocadito/Auto-Privilege', note: l('★ 7', '★ 7'),
      desc: l('Escalada de privilegios en Linux automatizada: 15 escáneres de solo lectura y 75 técnicas de GTFOBins, lo más seguro primero.', 'Automated Linux privilege escalation: 15 read-only scanners and 75 GTFOBins techniques, safest first.') },
    { name: 'Vault-Kernel', lang: 'Python', href: 'https://github.com/Ruby570bocadito/Vault-Kernel', note: l('★ 5', '★ 5'),
      desc: l('Motor de rootkit LKM para laboratorios red team autorizados: hooks de syscalls y técnicas de ocultación.', 'Linux LKM rootkit engine for authorized red-team labs: syscall hooks and hiding techniques.') },
    { name: 'bluesky', lang: 'Python', href: 'https://github.com/Ruby570bocadito/bluesky', note: l('★ 4', '★ 4'),
      desc: l('Framework de auditoría Bluetooth estilo Metasploit: 22 módulos, CLI, REPL y panel web, 100 % offline.', 'Metasploit-style Bluetooth auditing framework: 22 modules, CLI, REPL and web dashboard, 100% offline.') },
    { name: 'charon', lang: 'Rust', href: 'https://github.com/Ruby570bocadito/charon', note: l('formato real, sin mocks', 'real wire format, no mocks'),
      desc: l('Banco de trabajo del protocolo Kerberos: códec DER propio, cripto RFC 4120/3961, kerberoast y AS-REP roast.', 'Kerberos protocol workbench: own DER codec, RFC 4120/3961 crypto, kerberoasting and AS-REP roasting.') },
    { name: 'REDHAVOC', lang: 'Python', href: 'https://github.com/Ruby570bocadito/REDHAVOC', note: l('★ 2', '★ 2'),
      desc: l('Framework red team en Python puro: 79 módulos nativos, barridos multi-host, workspaces e informes PDF.', 'Pure-Python red team framework: 79 native modules, multi-host sweeps, workspaces and PDF reports.') },
    { name: 'OSINT-EYE', lang: 'Python', href: 'https://github.com/Ruby570bocadito/OSINT-EYE', note: l('★ 1', '★ 1'),
      desc: l('Inteligencia de superficie de ataque: OSINT y recon con IA local (Ollama), sin claves API.', 'Attack-surface intelligence: OSINT and recon with local AI (Ollama), no API keys.') },
    { name: 'T-100AI', lang: 'Python', href: 'https://github.com/Ruby570bocadito/T-100AI', note: l('★ 1', '★ 1'),
      desc: l('Terminal de seguridad ofensiva con IA 100 % offline: LLM local, ejecución aislada y controles humanos.', 'Offline AI-powered offensive security terminal: local LLM, sandboxed execution and human-in-the-loop gates.') }
  ]
};

export const stackWords = {
  top: ['Python', 'Bash', 'Linux', 'Active Directory', l('Redes', 'Networking'), 'Kali Linux', 'Metasploit', 'OSINT', 'HTML', 'CSS'] as (string | L)[],
  bottom: ['EDR', 'SIEM', 'Microsoft Defender', 'MITRE ATT&CK', 'Go', 'Rust', 'C#', 'Unity', 'Docker', 'BloodHound'] as (string | L)[]
};

export type CourseCat = 'pentest' | 'web' | 'mobile' | 'malware' | 'defense' | 'osint' | 'ai';
export const training = {
  heading: l('Formación', 'Training'),
  intro: l(
    'Certificación de pentesting, formación oficial de Cisco, cursos especializados y años de programación de videojuegos: la base práctica de todo lo que construyo.',
    'A pentesting certification, official Cisco training, specialised courses and years of game programming: the practical foundation behind everything I build.'
  ),
  counters: [
    { to: 1, label: l('certificación eJPTv2', 'eJPTv2 certification') },
    { to: 5, label: l('cursos de Cisco', 'Cisco courses') },
    { to: 17, label: l('cursos de Udemy', 'Udemy courses') },
    { to: 5, label: l('cursos de videojuegos', 'game dev courses') }
  ],
  ejpt: {
    title: 'eJPTv2',
    full: 'eLearnSecurity Junior Penetration Tester v2',
    org: 'INE Security',
    desc: l('Certificación práctica de pentesting: reconocimiento, explotación y post-explotación en un laboratorio real.', 'Hands-on pentesting certification: reconnaissance, exploitation and post-exploitation in a real lab.'),
    note: l('Obtenida · caducó en julio de 2026, renovación prevista', 'Earned · expired July 2026, renewal planned')
  },
  groups: [
    {
      org: 'Cisco Networking Academy',
      items: [l('Ethical Hacker', 'Ethical Hacker'), l('Linux Unhatched', 'Linux Unhatched'), l('Python Essentials 1', 'Python Essentials 1'), l('Conceptos básicos de redes', 'Networking Basics'), l('Introducción a la Ciberseguridad', 'Introduction to Cybersecurity')]
    },
    { org: 'Hack4u', items: [l('Introducción al Hacking', 'Introduction to Hacking')] },
    {
      org: 'BIG school',
      items: [l('Curso de Ciberseguridad y Hacking Ético (certificado de asistencia)', 'Cybersecurity & Ethical Hacking course (attendance certificate)'), l('Iniciación con Inteligencia Artificial', 'Introduction to Artificial Intelligence')]
    },
    {
      org: l('Programación de videojuegos', 'Game programming'),
      items: [l('Curso básico', 'Beginner course'), l('Curso medio', 'Intermediate course'), l('Avanzado 1', 'Advanced 1'), l('Avanzado 2', 'Advanced 2'), l('Bootcamp de programación de videojuegos', 'Game programming bootcamp')]
    }
  ] as { org: string | L; items: L[] }[],
  education: [
    { when: l('2025 — Actualidad', '2025 — Present'), title: l('SMR — Sistemas Microinformáticos y Redes', 'SMR — Microcomputer Systems & Networks'), org: 'DigitechFP', tag: l('En curso', 'In progress') },
    { when: l('2020 — 2024', '2020 — 2024'), title: l('Programación de videojuegos — C# / Unity', 'Video game programming — C# / Unity'), org: 'EVAD', tag: l('Completado', 'Completed') }
  ],
  next: l('Próximos objetivos: CRTO · CPTES', 'Next milestones: CRTO · CPTES'),
  udemy: {
    title: l('17 cursos de Udemy', '17 Udemy courses'),
    all: l('Todos', 'All'),
    cats: {
      pentest: l('Pentesting', 'Pentesting'),
      web: l('Web y redes', 'Web & networks'),
      mobile: l('Móvil', 'Mobile'),
      malware: l('Malware', 'Malware'),
      defense: l('Defensa', 'Defense'),
      osint: l('OSINT y privacidad', 'OSINT & privacy'),
      ai: l('IA', 'AI')
    } as Record<CourseCat, L>,
    // Títulos oficiales de los cursos (en el idioma en el que se cursaron).
    courses: [
      { t: 'Máster en Pentesting y Hacking Ético', c: 'pentest' },
      { t: 'Curso Completo de Hacking Ético y Ciberseguridad', c: 'pentest' },
      { t: 'Curso Completo de Hacking Ético: Aprende Todo', c: 'pentest' },
      { t: 'Hacking Ético con Kali Linux', c: 'pentest' },
      { t: 'Hacking Ético con Metasploit Framework', c: 'pentest' },
      { t: 'Escalada de Privilegios en Linux', c: 'pentest' },
      { t: 'Curso de Hacking Ético Web: Pentesting en Webs', c: 'web' },
      { t: 'Hacking Ético a Redes Wi-Fi', c: 'web' },
      { t: 'Hacking Ético a Redes Sociales', c: 'web' },
      { t: 'Hacking Ético a Dispositivos Móviles Android', c: 'mobile' },
      { t: 'Hacking Ético desde Dispositivos Android', c: 'mobile' },
      { t: 'Hacking Ético: Virus, Troyanos, Spywares y Malware', c: 'malware' },
      { t: 'Hacking Ético a PC con Malware', c: 'malware' },
      { t: 'Seguridad Informática desde Cero: Aprende a Detectar y Defenderte del Phishing', c: 'defense' },
      { t: 'Anonimato en la Red: Privacidad y Deep Web', c: 'osint' },
      { t: 'Curso de OSINT para Principiantes', c: 'osint' },
      { t: 'ChatGPT para Hacking Ético', c: 'ai' }
    ] as { t: string; c: CourseCat }[]
  }
};

export const hackathons = {
  heading: l('IA y hackatones', 'AI & hackathons'),
  intro: l(
    'Estas actividades amplían mi experiencia en desarrollo, innovación, inteligencia artificial y trabajo colaborativo.',
    'These activities broaden my experience in development, innovation, artificial intelligence and teamwork.'
  ),
  events: [
    {
      name: 'Meta Global AI Developer Hackathon',
      start: '2026-10-26', end: '2026-11-05',
      when: l('26 oct – 5 nov 2026 · Online', 'Oct 26 – Nov 5, 2026 · Online'),
      desc: l('Diez días construyendo con los modelos de IA más recientes de Meta, organizado con Cerebral Valley.', 'Ten days building with Meta’s latest AI models, hosted with Cerebral Valley.'),
      href: 'https://cerebralvalley.ai/e/meta-ai-developer-hackathon'
    },
    {
      name: 'Megahackatón',
      start: '2026-11-04', end: '2026-11-04',
      when: l('4 nov 2026', 'Nov 4, 2026'),
      desc: l('Maratón de desarrollo e innovación en equipo.', 'A team development and innovation marathon.')
    },
    {
      name: 'Talent Land',
      start: '2026-11-24', end: '2026-11-26',
      when: l('24–26 nov 2026', 'Nov 24–26, 2026'),
      desc: l('Tres días de tecnología, talento e innovación.', 'Three days of technology, talent and innovation.')
    }
  ],
  status: {
    upcoming: l('Próximamente', 'Upcoming'),
    live: l('En curso', 'Happening now'),
    past: l('Participación', 'Participated')
  },
  aiTraining: {
    title: l('Formación en IA', 'AI training'),
    items: [l('ChatGPT para Hacking Ético — Udemy', 'ChatGPT for Ethical Hacking — Udemy'), l('Iniciación con Inteligencia Artificial — BIG school', 'Introduction to Artificial Intelligence — BIG school')]
  }
};

export const robotics = {
  heading: l('Robótica y liderazgo', 'Robotics & leadership'),
  badge: l('ASTI Challenge', 'ASTI Challenge'),
  title: l('Finalista nacional del ASTI Challenge', 'ASTI Challenge national finalist'),
  text: l(
    'Lideré un equipo de robótica que quedó primero en Málaga y se clasificó para la final nacional del ASTI Challenge. Trabajé en el desarrollo del robot, la resolución de problemas, la coordinación del equipo y la estrategia de competición, bajo presión real y frente a los mejores equipos del país.',
    'I led a robotics team that finished first in Málaga and qualified for the national final of the ASTI Challenge. I worked on robot development, problem-solving, team coordination and competition strategy, under real pressure and against the best teams in the country.'
  ),
  highlights: [
    { v: l('1.º', '1st'), label: l('puesto en Málaga', 'place in Málaga') },
    { v: 'Final', label: l('nacional en España', 'national final, Spain') },
    { v: l('Líder', 'Lead'), label: l('del equipo', 'of the team') }
  ] as { v: string | L; label: L }[],
  skills: [l('Liderazgo y coordinación', 'Leadership & coordination'), l('Trabajo en equipo', 'Teamwork'), l('Resolución de problemas técnicos', 'Technical problem-solving'), l('Creatividad e innovación', 'Creativity & innovation')],
  robotHint: l('Pasa el cursor por el robot o haz clic para saludarlo', 'Hover the robot or click it to say hi'),
  robotButton: l('Saludar al robot', 'Say hi to the robot'),
  robotLabel: l('Robot animado con Rive que sigue el cursor', 'Rive-animated robot that follows your cursor')
};

export const objective = {
  heading: l('Objetivo', 'Goal'),
  lead: l('Seguir desarrollándome en el sector tecnológico, con especial interés en:', 'To keep growing in the tech sector, with a special interest in:'),
  items: [
    { icon: 'shield', t: l('Analista SOC y ciberseguridad defensiva', 'SOC analyst & defensive security') },
    { icon: 'crosshair', t: l('Pentesting y hacking ético', 'Pentesting & ethical hacking') },
    { icon: 'terminal', t: l('Automatización de tareas con Python y Bash', 'Task automation with Python & Bash') },
    { icon: 'network', t: l('Seguridad de sistemas, redes y aplicaciones', 'Systems, network & application security') },
    { icon: 'brain', t: l('Inteligencia artificial', 'Artificial intelligence') },
    { icon: 'gamepad', t: l('Desarrollo de software y videojuegos', 'Software & game development') }
  ],
  closing: l(
    'Mi perfil combina formación en ciberseguridad, programación, inteligencia artificial y robótica, junto con experiencia de liderazgo y participación en iniciativas tecnológicas. Mi objetivo es transformar estos conocimientos en proyectos prácticos y seguir creciendo profesionalmente.',
    'My profile combines training in cybersecurity, programming, artificial intelligence and robotics, together with leadership experience and involvement in tech initiatives. My goal is to turn this knowledge into practical projects and keep growing professionally.'
  )
};

export const contact = {
  heading: l('Hablemos', 'Let’s talk'),
  text: l(
    'Busco prácticas y oportunidades junior en ciberseguridad (SOC, pentesting), además de proyectos de seguridad, IA o automatización. Suelo responder en menos de 24 horas.',
    'I’m looking for internships and junior cybersecurity roles (SOC, pentesting), as well as security, AI or automation projects. I usually reply within 24 hours.'
  ),
  localTime: l('Málaga — hora local', 'Málaga — local time'),
  cvHint: l('Pasa el cursor para abrir el candado', 'Hover to unlock')
};

export const footer = {
  made: l('Diseñado y desarrollado por Rafael Gálvez con React, Rive y Framer Motion.', 'Designed and built by Rafael Gálvez with React, Rive and Framer Motion.'),
  credits: l('Animaciones interactivas hechas con Rive · Objetos 3D generados con Muse Image (Meta).', 'Interactive animations made with Rive · 3D objects generated with Muse Image (Meta).'),
  previous: l('Ver la versión anterior', 'See the previous version')
};
