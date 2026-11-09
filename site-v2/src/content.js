// Todo el texto de la web, en español e inglés. Un texto traducible es { es, en }; lo que no cambia con el idioma
// (nombres, enlaces, tecnologías) va tal cual. Los textos de la interfaz (botones, etiquetas) están en src/i18n.jsx.
export { RED } from './red.js';

// Avatares de Rafa en arcilla, como Peri (generados con Muse Image a partir de sus fotos), dentro de public/. Con null se ven las iniciales.
export const AVATAR = 'img/avatar.webp'; // la credencial del inicio
export const AVATAR_SIGN = 'img/avatar-sign.webp'; // la polaroid de "Sobre mí", con el cartel BLUE TEAM ya dibujado

export const LINKS = {
  email: 'rafagasi09@gmail.com',
  github: 'https://github.com/Ruby570bocadito',
  linkedin: 'https://www.linkedin.com/in/rafael-g%C3%A1lvez-silipo-07445a409/',
  cv: '/cv.pdf'
};

export const NAV = [
  { id: 'inicio', label: { es: 'Inicio', en: 'Home' } },
  { id: 'proyectos', label: { es: 'Proyectos', en: 'Projects' } },
  { id: 'logros', label: { es: 'Logros', en: 'Achievements' } },
  { id: 'habilidades', label: { es: 'Habilidades', en: 'Skills' } },
  { id: 'biblioteca', label: { es: 'Biblioteca', en: 'Library' } },
  { id: 'sobre-mi', label: { es: 'Sobre mí', en: 'About' } }
];

export const HERO = {
  roles: { es: ['Blue Team', 'analista SOC', 'threat hunter', 'DFIR'], en: ['Blue Team', 'SOC analyst', 'threat hunter', 'DFIR'] },
  sub: {
    es: 'Estudiante de ciberseguridad en Málaga. Construyo las herramientas que detectan, investigan y responden a los ataques.',
    en: 'Cybersecurity student in Málaga, Spain. I build the tools that detect, investigate and respond to attacks.'
  },
  stats: [
    { to: 125, label: { es: 'reglas ATT&CK en bluetardigrade', en: 'ATT&CK rules in bluetardigrade' } },
    { to: 24, suffix: '+', label: { es: 'repositorios públicos', en: 'public repositories' } },
    { to: 91, suffix: ' %', label: { es: 'estafas detectadas por FriendlyPear', en: 'of scams caught by FriendlyPear' } }
  ]
};

export const FEATURED = {
  kicker: 'Meta Global AI Developer Hackathon · Indie track',
  name: 'FriendlyPear',
  text: {
    es: 'Peri es una pera de arcilla que vive en tu móvil: frena las estafas antes de que se mueva el dinero y pregunta a la familia antes de cualquier paso arriesgado. Pensado para proteger a personas mayores.',
    en: 'Peri is a clay pear who lives in your phone: she stops scams before any money moves and checks with the family before anything risky happens. Built to protect older adults.'
  },
  stats: [
    { to: 91, suffix: ' %', label: { es: 'de 200 estafas nuevas detectadas', en: 'of 200 unseen scams flagged' } },
    { to: 4, suffix: ' %', label: { es: 'de falsas alarmas', en: 'false alarms' } },
    { to: 6, label: { es: 'modelos de Meta, uno por tarea', en: 'Meta models, one job each' } },
    { to: 401, label: { es: 'tests automatizados', en: 'automated tests' } }
  ],
  chips: ['Kotlin', 'Android', { es: 'IA en el dispositivo', en: 'On-device AI' }, 'Español · English'],
  links: [
    { label: { es: '▶ Demo de 3 min', en: '▶ 3-minute demo' }, href: 'https://youtu.be/RylxfEh_EoI' },
    { label: 'Web', href: 'https://ruby570bocadito.github.io/FriendlyPear/' },
    { label: { es: 'Código', en: 'Code' }, href: 'https://github.com/Ruby570bocadito/FriendlyPear' }
  ]
};

export const PROJECTS = [
  {
    emoji: '🐻',
    logo: 'logos/bluetardigrade.svg',
    name: 'bluetardigrade',
    tagline: { es: 'Un SOC autoalojado para endpoints Windows', en: 'A self-hosted SOC for Windows endpoints' },
    text: {
      es: 'Sensor ETW en Rust, motor de detección en Go y consola en vivo. Correlación de kill chain, puntuación de riesgo por equipo y evidencias forenses por cada alerta.',
      en: 'Rust ETW sensor, Go detection engine and a live console. Kill-chain correlation, per-host risk scoring and a forensic evidence bundle for every alert.'
    },
    metric: { to: 125, label: { es: 'reglas mapeadas a MITRE ATT&CK', en: 'rules mapped to MITRE ATT&CK' } },
    chips: ['Rust', 'Go', 'Next.js', 'ETW', 'ATT&CK'],
    img: 'bluetardigrade.webp', w: 1600, h: 1000,
    bar: { es: 'bluetardigrade — alertas', en: 'bluetardigrade — alerts' },
    url: 'https://github.com/Ruby570bocadito/bluetardigrade'
  },
  {
    emoji: '🦈',
    logo: 'logos/soc-shark.svg',
    name: 'SOC Shark',
    tagline: { es: 'Tu red, explicada en lenguaje sencillo', en: 'Your network, explained in plain language' },
    text: {
      es: 'Una alternativa a Wireshark para analistas SOC: conversaciones en vez de paquetes, y alertas agrupadas en historias con qué hacer y su técnica ATT&CK.',
      en: 'A Wireshark alternative for SOC analysts: conversations instead of packets, and alerts grouped into stories with what to do and their ATT&CK technique.'
    },
    metric: { to: 3, label: { es: 'sistemas en vivo: Windows, Linux y macOS', en: 'live platforms: Windows, Linux and macOS' } },
    chips: ['Rust', 'JA4', 'Beaconing', 'DNS tunneling'],
    img: 'socshark.webp', w: 1440, h: 860,
    bar: { es: 'soc-shark — explicación', en: 'soc-shark — explanation' },
    url: 'https://github.com/Ruby570bocadito/soc-shark'
  },
  {
    emoji: '🔬',
    logo: 'logos/sabueso.svg',
    name: 'Sabueso',
    tagline: { es: 'Forense de Windows para peritos', en: 'Windows forensics for expert witnesses' },
    text: {
      es: 'De la imagen de disco al informe pericial firmado: gestión de casos, cadena de custodia demostrable, RAM, Sigma y YARA, súper-timeline y narrativa ATT&CK.',
      en: 'From disk image to signed expert report: case management, provable chain of custody, RAM, Sigma and YARA, super-timeline and an ATT&CK narrative.'
    },
    metric: { to: 20, suffix: '+', label: { es: 'módulos de artefactos', en: 'artifact modules' } },
    chips: ['DFIR', 'Sigma', 'YARA', 'STIX 2.1'],
    img: 'forense.webp', w: 1400, h: 900,
    bar: { es: 'sabueso — resumen del caso', en: 'sabueso — case summary' },
    url: 'https://github.com/Ruby570bocadito/Sabueso-Framework'
  },
  {
    emoji: '🏰',
    name: 'Bastion',
    tagline: { es: 'Auditoría y hardening de Windows y Linux', en: 'Windows and Linux auditing and hardening' },
    text: {
      es: 'Puntuación de postura mapeada a ATT&CK, vista de superficie de ataque y hardening seguro con snapshot y rollback automático. Listo para CI/CD.',
      en: 'Posture score mapped to ATT&CK, attack-surface view and safe hardening with snapshots and automatic rollback. CI/CD-ready.'
    },
    metric: { to: 155, label: { es: 'controles de seguridad', en: 'security controls' } },
    chips: ['Go', 'Hardening', 'Windows Server', 'CI/CD'],
    img: 'bastion.webp', w: 1280, h: 1000,
    bar: { es: 'bastion — consola', en: 'bastion — console' },
    url: 'https://github.com/Ruby570bocadito/best-harden'
  }
];

export const MORE = [
  { emoji: '🧬', name: 'ttpblast', text: { es: 'BLAST para telemetría: encuentra variantes de una cadena de ataque en Sysmon y te dice con un E-value si es casualidad.', en: 'BLAST for telemetry: finds variants of a known attack chain in Sysmon and tells you with an E-value whether it is chance.' }, meta: { es: 'Rust · investigación', en: 'Rust · research' }, url: 'https://github.com/Ruby570bocadito/ttpblast' },
  { emoji: '⚔️', logo: 'logos/area-ai.svg', name: 'area·ai', text: { es: 'Laboratorio Red vs Blue con agentes de IA: el lado defensivo detecta, parchea y caza, y los dos bandos aprenden campaña tras campaña.', en: 'Red vs Blue lab with AI agents: the defenders detect, patch and hunt, and both sides learn campaign after campaign.' }, meta: 'TypeScript · 514 tests', url: 'https://github.com/Ruby570bocadito/area-ai' },
  { emoji: '🕵️', name: 'rastro', text: { es: 'Pega un enlace de phishing y mira cómo se despliega la campaña: dominios hermanos, zona horaria del grupo y borradores de denuncia.', en: 'Paste a phishing link and watch the whole campaign unfold: sibling domains, the crew’s time zone and abuse-report drafts.' }, meta: 'Python · phishing', url: 'https://github.com/Ruby570bocadito/rastro' }
];

// La franja animada: arriba lo que hago, abajo con qué lo hago (igual en los dos idiomas).
export const MARQUEE_WORDS = ['Blue Team', 'SOC', 'DFIR', 'Detection Engineering', 'Threat Hunting', 'Hardening'];
export const MARQUEE_TECH = ['Python', 'Rust', 'Go', 'Sigma', 'YARA', 'MITRE ATT&CK', 'Sysmon', 'ETW', 'Docker', 'AWS', 'Wireshark'];

// start/end en formato AAAA-MM-DD: con ellos se calcula "faltan X días" o "terminado".
export const EVENTS = [
  { icon: '🌱', type: { es: 'Competición', en: 'Competition' }, title: 'Desafío Cátedra Hedy Lamarr', text: { es: 'Fase 2 del desafío de la Universidad de Málaga y Ericsson: cómo mejorar el mundo a nuestro alrededor, de manera sostenible, con inteligencia artificial.', en: 'Phase 2 of the University of Málaga and Ericsson challenge: how to improve the world around us, sustainably, with artificial intelligence.' }, when: { es: 'Mar 2024 · ETSI Telecomunicación', en: 'Mar 2024 · ETSI Telecommunication' }, badge: { es: 'Diploma · Concurso Hilda Ericsson', en: 'Diploma · Hilda Ericsson Contest' } },
  { icon: '🏆', type: { es: 'Robótica', en: 'Robotics' }, title: 'ASTI Challenge', text: { es: 'Capitán de un equipo de robótica que quedó primero en Málaga y se clasificó para la final nacional. Robot, coordinación y estrategia bajo presión.', en: 'Captain of a robotics team that placed first in Málaga and qualified for the national final in Spain. Robot, coordination and strategy under pressure.' }, when: { es: 'Capitán del equipo', en: 'Team captain' }, badge: { es: '1.º Málaga · Finalista nacional', en: '1st in Málaga · National finalist' }, burst: true },
  { icon: '🍐', type: { es: 'Hackatón', en: 'Hackathon' }, title: 'Meta Global AI Developer Hackathon', text: { es: 'FriendlyPear: un agente de voz con IA que protege a personas mayores de las estafas. Todo el código, en nueve días.', en: 'FriendlyPear: an AI voice agent that protects older adults from scams. All the code, in nine days.' }, when: { es: '26 oct – 4 nov 2026', en: 'Oct 26 – Nov 4, 2026' }, start: '2026-10-26', end: '2026-11-04' },
  { icon: '⚡', type: { es: 'Hackatón', en: 'Hackathon' }, title: 'Megahackatón Generación FP', text: { es: 'Hackatón de Diverxia Consulting para estudiantes de FP: innovación y trabajo en equipo en un solo día.', en: 'Diverxia Consulting hackathon for vocational students: innovation and teamwork in a single day.' }, when: { es: '11 nov 2026', en: 'Nov 11, 2026' }, start: '2026-11-11', end: '2026-11-11' },
  { icon: '🤖', type: { es: 'Hackatón', en: 'Hackathon' }, title: 'Veritas AI High School Hackathon', text: { es: 'Hackatón internacional online de 48 horas: construir un proyecto de IA real en un fin de semana y presentarlo ante investigadores de laboratorios de IA.', en: 'International 48-hour online hackathon: build a real AI project in one weekend and pitch it to researchers from AI labs.' }, when: { es: '14 – 15 nov 2026 · online', en: 'Nov 14 – 15, 2026 · online' }, start: '2026-11-14', end: '2026-11-15', url: 'https://highschoolhackathon.org/' },
  { icon: '🚀', type: { es: 'Evento', en: 'Event' }, title: 'Talent Land', text: { es: 'Uno de los mayores eventos de tecnología e innovación, para aprender y conectar con la comunidad.', en: 'One of the biggest technology and innovation events, to learn and connect with the community.' }, when: { es: '24 – 26 nov 2026', en: 'Nov 24 – 26, 2026' }, start: '2026-11-24', end: '2026-11-26' }
];

const L = (es, en) => ({ es, en });

export const SKILLS = [
  { id: 'blue', icon: '🛡️', title: 'Blue Team', note: L('Mi enfoque principal', 'My main focus'), chips: [L('Análisis SOC', 'SOC analysis'), L('SIEM y EDR', 'SIEM & EDR'), 'Microsoft Defender', L('Ingeniería de detección', 'Detection engineering'), 'Sigma · YARA', 'MITRE ATT&CK', L('Respuesta a incidentes', 'Incident response'), L('Forense digital', 'Digital forensics'), 'Threat hunting', 'Hardening', L('Análisis de tráfico', 'Traffic analysis'), L('Detección de phishing', 'Phishing detection')] },
  { id: 'red', icon: '🔴', title: 'Red Team', note: L('Para entender a quien ataca', 'To understand attackers'), chips: [L('Pentesting web, redes y Wi-Fi', 'Web, network & Wi-Fi pentesting'), L('Hacking de Active Directory', 'Active Directory attacks'), L('Simulación de adversarios', 'Adversary emulation'), L('Ingeniería social', 'Social engineering'), L('Escalada de privilegios', 'Privilege escalation'), 'Metasploit', 'OSINT', L('Análisis de malware', 'Malware analysis'), L('Ingeniería inversa', 'Reverse engineering'), 'Android'] },
  { id: 'ai', icon: '🤖', title: L('IA aplicada', 'Applied AI'), note: L('Un multiplicador, nunca un piloto automático', 'A force multiplier, never an autopilot'), chips: [L('IA para defensa', 'AI for defense'), L('IA ofensiva', 'Offensive AI'), L('Agentes de IA', 'AI agents'), L('LLMs locales (Ollama)', 'Local LLMs (Ollama)'), L('Modelos de Meta', 'Meta models')] },
  { id: 'sys', icon: '🖥️', title: L('Sistemas y cloud', 'Systems & cloud'), note: L('Los cimientos', 'The foundations'), chips: [L('Windows a fondo', 'Windows in depth'), L('Linux a fondo', 'Linux in depth'), 'Active Directory', L('Redes', 'Networking'), 'AWS', L('Docker (uso y creación)', 'Docker (using & building)'), L('Virtualización', 'Virtualization')] },
  { id: 'code', icon: '💻', title: L('Lenguajes', 'Languages'), note: L('Del más usado al menos', 'Most used first'), chips: ['Python', 'Bash', 'PowerShell', 'Go', 'Rust', 'C#', 'TypeScript', 'Kotlin', 'HTML · CSS'] }
];

export const CERTS = [
  { org: 'INE Security', title: 'eJPTv2 — Junior Penetration Tester', state: L('Obtenida · julio 2026', 'Earned · July 2026'), star: true },
  { org: 'Palo Alto Networks', title: 'Cybersecurity Fundamentals', state: L('Completado', 'Completed') },
  { org: 'Cisco Networking Academy', items: ['Ethical Hacker', L('Introducción a la Ciberseguridad', 'Introduction to Cybersecurity'), L('Conceptos básicos de redes', 'Networking Basics'), 'Linux Unhatched', 'Python Essentials 1'] },
  { org: 'Hack4u · BIG school', items: [L('Introducción al Hacking (Hack4u)', 'Introduction to Hacking (Hack4u)'), L('Ciberseguridad y Hacking Ético (BIG school)', 'Cybersecurity & Ethical Hacking (BIG school)'), L('Iniciación al Desarrollo con IA (BIG school)', 'Intro to Building with AI (BIG school)')] },
  { org: L('DigitechFP · 2025 – actualidad', 'DigitechFP · 2025 – present'), title: L('SMR — Sistemas Microinformáticos y Redes', 'SMR — Computer Systems & Networks'), state: L('En curso', 'In progress') },
  { org: 'EVAD · 2019 – 2024', title: L('Programación de videojuegos — C# y Unity', 'Game programming — C# & Unity'), items: [L('Cursos inicial, medio, avanzado y avanzado II', 'Beginner, intermediate, advanced and advanced II courses'), L('Bootcamp de programación con Unity', 'Unity programming bootcamp')] }
];

// Títulos oficiales de los cursos (iguales en los dos idiomas).
export const UDEMY = [
  'Máster en Pentesting y Hacking Ético', 'Curso Completo de Hacking Ético y Ciberseguridad', 'Curso Completo de Hacking Ético: Aprende Todo',
  'Hacking Ético con Kali Linux', 'Hacking Ético con Metasploit Framework', 'Curso de Hacking Ético Web: Pentesting en Webs',
  'Hacking Ético a Redes Wi-Fi', 'Escalada de Privilegios en Linux', 'Hacking Ético: Virus, Troyanos, Spywares y Malware',
  'Hacking Ético a PC con Malware', 'Hacking Ético a Dispositivos Móviles Android', 'Hacking Ético desde Dispositivos Android',
  'Hacking Ético a Redes Sociales', 'Seguridad Informática desde Cero: Detectar y Defenderte del Phishing', 'Curso de OSINT para Principiantes',
  'Anonimato en la Red: Privacidad y Deep Web', 'ChatGPT para Hacking Ético'
];

export const ABOUT = {
  paragraphs: [
    L('Empecé a programar con unos 10 años, haciendo videojuegos con C# y Unity. Con el tiempo me interesó más entender cómo funcionan los sistemas por debajo, y eso me llevó a la ciberseguridad.',
      'I started programming at around 10, making video games with C# and Unity. Over time I became more interested in how systems work underneath, and that led me to cybersecurity.'),
    L('Mis primeros años en seguridad fueron en el lado ofensivo: C2, Active Directory, investigación de malware. Saber cómo funcionan los ataques es lo que me pasó al otro lado. Hoy construyo herramientas que los detectan, investigan y responden.',
      'My first years in security were on the offensive side. Knowing how attacks work is exactly what pulled me to the other side: today I build tools that detect, investigate and respond to them.')
  ],
  quote: L('No quiero solo saber usar una herramienta. Quiero entender cómo funciona, por qué funciona y cómo podría construirla yo.',
    'I don’t just want to know how to use a tool. I want to understand how it works, why it works, and how I could build it myself.'),
  facts: [
    { k: L('Ubicación', 'Location'), v: L('Málaga, España', 'Málaga, Spain') },
    { k: L('Estudios', 'Studies'), v: L('SMR — Sistemas y Redes', 'SMR — Systems & Networks') },
    { k: L('Objetivo', 'Goal'), v: L('Analista SOC · Blue Team', 'SOC analyst · Blue Team') },
    { k: 'Extra', v: L('Capitán de robótica', 'Robotics team captain') }
  ]
};

// Lo que dice Peri según la sección que se ve, con qué pose (public/peri/pose) y, si la hay, qué animación repite.
export const PERI_LINES = {
  inicio: { pose: 'wave1', idle: 'wave', line: L('¡Hola! Soy Peri 🍐 Te acompaño por la web de Rafa.', 'Hi! I’m Peri 🍐 I’ll walk you through Rafa’s site.') },
  proyectos: { pose: 'detective', line: L('Todo esto lo ha construido Rafa desde cero 🛠️', 'Rafa built all of this from scratch 🛠️') },
  red: { pose: 'surprised', line: L('¡Zona roja! Tranquilidad: todo en laboratorios aislados 🧪', 'Red zone! Don’t worry: all in isolated labs 🧪') },
  logros: { pose: 'medal', line: L('¡Capitán y finalista nacional! 🏆', 'Team captain and national finalist! 🏆') },
  habilidades: { pose: 'hero', line: L('Defensa primero, siempre 🛡️', 'Defense first, always 🛡️') },
  certificaciones: { pose: 'glasses', line: L('eJPTv2, Cisco, Palo Alto… y 17 cursos 📚', 'eJPTv2, Cisco, Palo Alto… and 17 courses 📚') },
  biblioteca: { pose: 'thumbsup', line: L('¡Bienvenido a la biblioteca! 📚 Saca el libro que quieras', 'Welcome to the library! 📚 Pull out any book you like') },
  'sobre-mi': { pose: 'tea', line: L('Empezó con 10 años haciendo videojuegos 🎮', 'He started at 10, making video games 🎮') },
  contacto: { pose: 'phone', line: L('¡Escríbele! Responde en menos de 24 h 💌', 'Write to him! He replies within 24 h 💌') },
  tip: { pose: 'idea' }
};

export const TIPS = [
  L('Si alguien te pide un código por teléfono, es una estafa. Cuelga 🔐', 'If someone asks for a code over the phone, it’s a scam. Hang up 🔐'),
  L('Activa la verificación en dos pasos en todo lo importante ✅', 'Turn on two-step verification for everything that matters ✅'),
  L('Las prisas son la mejor arma del estafador: respira y comprueba ⏱️', 'Rushing you is a scammer’s best weapon: breathe and check ⏱️'),
  L('Mira el dominio con calma antes de escribir tu contraseña 🔎', 'Check the domain calmly before typing your password 🔎'),
  L('¿Un familiar con número nuevo pidiendo dinero? Llámale al de siempre 📞', 'A relative with a new number asking for money? Call their usual one 📞')
];
