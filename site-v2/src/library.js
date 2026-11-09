// La Biblioteca: proyectos, certificaciones y hackatones de Rafa, como libros en estanterías.
// Los proyectos salen de src/data/repos.json (npm run library los trae de GitHub) y aquí se les pone texto, estantería,
// logo y, si lo tiene, su README (npm run readmes lo deja en public/readmes). Los textos van como { es, en }.
// Un repo nuevo sin entrada aquí aparece solo, en "Herramientas y más", con su descripción de GitHub.
import repos from './data/repos.json';

const L = (es, en) => ({ es, en });

export const KINDS = [
  { id: 'todo', label: L('Todo', 'All') },
  { id: 'proyectos', label: L('Proyectos', 'Projects') },
  { id: 'certificaciones', label: L('Certificaciones', 'Certifications') },
  { id: 'hackatones', label: L('Hackatones', 'Hackathons') }
];

// code: prefijo de la signatura de cada libro, como en una biblioteca de verdad.
export const SHELVES = [
  { id: 'blue', kind: 'proyectos', label: 'Blue Team', emoji: '🛡️', code: 'BT' },
  { id: 'ai', kind: 'proyectos', label: L('IA y agentes', 'AI & agents'), emoji: '🤖', code: 'IA' },
  { id: 'red', kind: 'proyectos', label: L('Etapa Red Team', 'Red Team stage'), emoji: '🔴', code: 'RT', note: L('Proyectos de laboratorio: el detalle está en cada repositorio', 'Lab projects: the details are in each repository') },
  { id: 'tools', kind: 'proyectos', label: L('Herramientas y más', 'Tools & more'), emoji: '🧰', code: 'HM' },
  { id: 'hack', kind: 'hackatones', label: L('Hackatones y competiciones', 'Hackathons & competitions'), emoji: '🏆', code: 'HK' },
  { id: 'cert', kind: 'certificaciones', label: L('Certificaciones', 'Certifications'), emoji: '🏅', code: 'CE' },
  { id: 'study', kind: 'certificaciones', label: L('Formación', 'Education'), emoji: '🎓', code: 'FO' },
  { id: 'udemy', kind: 'certificaciones', label: L('Cursos de Udemy', 'Udemy courses'), emoji: '📚', code: 'UD' }
];

// readme: el repo tiene su README en public/readmes/<nombre>.html.
const REPO_INFO = {
  bluetardigrade: { shelf: 'blue', emoji: '🐻', logo: 'logos/bluetardigrade.svg', readme: true, text: L('SOC autoalojado para endpoints Windows: sensor ETW en Rust, motor de detección en Go, 125 reglas mapeadas a MITRE ATT&CK y consola en vivo.', 'Self-hosted SOC for Windows endpoints: Rust ETW sensor, Go detection engine, 125 rules mapped to MITRE ATT&CK and a live console.'), tags: ['Rust', 'Go', 'Next.js', 'ATT&CK'] },
  'soc-shark': { shelf: 'blue', title: 'SOC Shark', emoji: '🦈', logo: 'logos/soc-shark.svg', readme: true, text: L('Análisis de tráfico para SOC: conversaciones en vez de paquetes y alertas agrupadas en historias, con qué hacer y su técnica ATT&CK.', 'Network traffic analysis for SOC: conversations instead of packets, and alerts grouped into stories with what to do and their ATT&CK technique.'), tags: ['Rust', 'JA4', 'DNS', 'SIEM'] },
  'Sabueso-Framework': { shelf: 'blue', title: 'Sabueso', emoji: '🔬', logo: 'logos/sabueso.svg', readme: true, text: L('Forense de Windows para peritos: de la imagen de disco al informe pericial firmado, con una cadena de custodia que se puede demostrar.', 'Windows forensics for expert witnesses: from disk image to signed expert report, with a chain of custody you can prove.'), tags: ['DFIR', 'Python', 'Sigma', 'YARA'] },
  'best-harden': { shelf: 'blue', title: 'Bastion', emoji: '🏰', readme: true, text: L('Auditoría y hardening de Windows, Windows Server y Linux: 155 controles, postura de seguridad mapeada a ATT&CK y rollback automático.', 'Auditing and hardening for Windows, Windows Server and Linux: 155 controls, security posture mapped to ATT&CK and automatic rollback.'), tags: ['Go', 'Hardening', 'CI/CD'] },
  ttpblast: { shelf: 'blue', emoji: '🧬', readme: true, text: L('Busca variantes de una cadena de ataque conocida en la telemetría de Sysmon, con alineamiento al estilo bioinformático y un E-value que dice si es casualidad.', 'Finds variants of a known attack chain in Sysmon telemetry using bioinformatics-style alignment, with an E-value that tells you whether it is chance.'), tags: ['Rust', 'Sysmon', L('Investigación', 'Research')] },
  rastro: { shelf: 'blue', emoji: '🕵️', readme: true, text: L('Investigación de campañas de phishing con fuentes públicas: dominios relacionados, patrones horarios y borradores de denuncia.', 'Phishing campaign investigation from public sources: related domains, timing patterns and abuse-report drafts.'), tags: ['Python', 'Phishing', 'OSINT'] },
  FriendlyPear: { shelf: 'ai', emoji: '🍐', logo: 'img/peri-icon.png', readme: true, text: L('Agente de voz con IA que protege a personas mayores de las estafas y pregunta a la familia antes de que se mueva el dinero. 91 % de 200 estafas nuevas detectadas.', 'AI voice agent that protects older adults from scams and checks with the family before any money moves. 91 % of 200 unseen scams flagged.'), tags: ['Kotlin', 'Android', 'Meta AI'], links: [{ label: 'Demo', href: 'https://youtu.be/RylxfEh_EoI' }, { label: 'Web', href: 'https://ruby570bocadito.github.io/FriendlyPear/' }] },
  'area-ai': { shelf: 'ai', title: 'area·ai', emoji: '⚔️', logo: 'logos/area-ai.svg', text: L('Laboratorio Red vs Blue con agentes de IA: el lado defensivo detecta, parchea y caza, y los dos bandos aprenden campaña tras campaña.', 'Red vs Blue lab with AI agents: the defenders detect, patch and hunt, and both sides learn campaign after campaign.'), tags: ['TypeScript', L('Agentes IA', 'AI agents')] },
  'T-100AI': { shelf: 'ai', emoji: '💬', text: L('Asistente de terminal con un modelo de lenguaje 100 % local (Ollama): sin telemetría ni nube, y con aprobación humana en cada paso.', 'Terminal assistant running a 100 % local language model (Ollama): no telemetry, no cloud, and human approval at every step.'), tags: ['Python', 'Ollama', L('LLM local', 'Local LLM')] },
  'Ruby570bocadito.github.io': { shelf: 'tools', title: L('Este portfolio', 'This portfolio'), emoji: '🖼️', text: L('La web que estás viendo: React, Vite, animaciones de React Bits, Rive y Peri.', 'The site you are looking at: React, Vite, React Bits animations, Rive and Peri.'), tags: ['React', 'Vite', 'Rive'] }
};

// Etapa Red Team: solo título y enlace al repositorio.
const RED = { 'orquesta-rt': 'OrquestaRT', WorldC2: 'WorldC2', HiveMind: 'HiveMind', 'Wormy-Network-ML': 'Wormy', charon: 'charon', 'Auto-Privilege': 'Auto-Privilege', 'OSINT-EYE': 'OSINT-EYE', bluesky: 'bluesky', REDHAVOC: 'REDHAVOC' };
const RED_TEXT = L('Proyecto de mi etapa Red Team, hecho y probado en laboratorio aislado y autorizado. Su repositorio explica el alcance y el uso responsable.', 'A project from my Red Team stage, built and tested in an isolated, authorized lab. Its repository explains the scope and responsible use.');
// Repos que no van como libro: el del Megahackatón cuelga de su ficha de evento.
const HIDDEN = new Set(['MegaHackaton-Generacion-FP-DIVERXIA', 'Vault-Kernel']);

const projects = repos
  .filter(r => !HIDDEN.has(r.name))
  .map(r => {
    if (RED[r.name]) {
      return { kind: 'proyectos', shelf: 'red', title: RED[r.name], emoji: '🧪', year: r.created.slice(0, 4), lang: r.language, text: RED_TEXT, tags: [r.language].filter(Boolean), url: r.url, stamp: 'Solo laboratorio' };
    }
    const info = REPO_INFO[r.name] ?? { shelf: 'tools', emoji: '📦', text: r.description, tags: [r.language].filter(Boolean) };
    return { kind: 'proyectos', title: info.title ?? r.name, year: r.created.slice(0, 4), lang: r.language, stars: r.stars, url: r.url, stamp: 'Código abierto', ...info, readme: info.readme ? r.name : null };
  });

// image: el certificado escaneado en public/certs (sale en grande en la ficha).
const cisco = (title, image, date) => ({ shelf: 'cert', emoji: '🌐', title, org: 'Cisco Networking Academy', year: '2026', date, image, text: L('Curso de Cisco Networking Academy, con credencial verificable (código QR en el certificado).', 'Cisco Networking Academy course, with a verifiable credential (QR code on the certificate).'), stamp: 'Completado' });
const evad = (title, image, years, text) => ({ shelf: 'study', emoji: '🎮', title, org: L('EVAD · Escuela Superior de Videojuegos y Arte Digital', 'EVAD · School of Video Games and Digital Art'), year: years.slice(0, 4), date: years, image, text, stamp: 'Completado' });

const certs = [
  { shelf: 'cert', emoji: '🎯', title: 'eJPTv2 — Junior Penetration Tester', org: 'INE Security', year: '2026', date: L('5 de julio de 2026', 'July 5, 2026'), image: 'certs/ejpt.webp', text: L('Certificación práctica de pentesting de INE Security. ID de certificación 187259379.', 'Hands-on penetration testing certification from INE Security. Certification ID 187259379.'), stamp: 'Obtenida' },
  { shelf: 'cert', emoji: '🔥', title: 'Cybersecurity Fundamentals', org: 'Palo Alto Networks', text: L('Fundamentos de ciberseguridad: amenazas, seguridad de red, cloud y operaciones de seguridad.', 'Cybersecurity fundamentals: threats, network security, cloud and security operations.'), stamp: 'Completado' },
  cisco('Ethical Hacker', 'certs/cisco-ethical-hacker.webp', L('29 de marzo de 2026', 'March 29, 2026')),
  cisco(L('Introducción a la Ciberseguridad', 'Introduction to Cybersecurity'), 'certs/cisco-intro-cyber.webp', L('14 de enero de 2026', 'January 14, 2026')),
  cisco(L('Conceptos básicos de redes', 'Networking Basics'), 'certs/cisco-networking.webp', L('14 de enero de 2026', 'January 14, 2026')),
  cisco('Linux Unhatched', 'certs/cisco-linux.webp', L('13 de febrero de 2026', 'February 13, 2026')),
  cisco('Python Essentials 1', 'certs/cisco-python.webp', L('9 de febrero de 2026', 'February 9, 2026')),
  { shelf: 'cert', emoji: '💻', title: L('Introducción al Hacking', 'Introduction to Hacking'), org: 'Hack4u', text: L('Curso de introducción al hacking ético de Hack4u.', 'Introductory ethical hacking course from Hack4u.'), stamp: 'Completado' },
  { shelf: 'study', emoji: '🖧', title: L('SMR — Sistemas Microinformáticos y Redes', 'SMR — Computer Systems & Networks'), org: 'DigitechFP', year: '2025', date: L('2025 – actualidad', '2025 – present'), text: L('Administración de sistemas, redes, sistemas operativos y fundamentos de ciberseguridad.', 'Systems administration, networking, operating systems and cybersecurity fundamentals.'), stamp: 'En curso' },
  { shelf: 'study', emoji: '🛡️', title: L('Ciberseguridad y Hacking Ético', 'Cybersecurity & Ethical Hacking'), org: 'BIG school', year: '2026', date: L('10 de abril de 2026 · 6 horas', 'April 10, 2026 · 6 hours'), image: 'certs/bigschool-hacking.webp', text: L('Jornadas sobre técnicas de detección de vulnerabilidades y defensa digital.', 'Sessions on vulnerability detection techniques and digital defense.'), stamp: 'Completado' },
  { shelf: 'study', emoji: '🧠', title: L('Iniciación al Desarrollo con IA', 'Intro to Building with AI'), org: 'BIG school', year: '2026', date: L('14 de marzo de 2026 · 6 horas', 'March 14, 2026 · 6 hours'), image: 'certs/bigschool-ia.webp', text: L('Jornadas formativas «Desarrollo con IA: de 0 a Producción».', 'Training sessions “Building with AI: from 0 to Production”.'), stamp: 'Completado' },
  evad(L('Programación de videojuegos — Inicial', 'Game programming — Beginner'), 'certs/evad-inicial.webp', '2019 – 2020', L('Primer curso de programación de videojuegos: mi puerta de entrada a la programación.', 'First game programming course: my way into programming.')),
  evad(L('Programación de videojuegos — Medio', 'Game programming — Intermediate'), 'certs/evad-medio.webp', '2020 – 2021', L('Segundo curso: lógica de juego y C# con Unity.', 'Second course: game logic and C# with Unity.')),
  evad(L('Programación de videojuegos — Avanzado', 'Game programming — Advanced'), 'certs/evad-avanzado.webp', '2021 – 2022', L('Curso avanzado de programación de videojuegos.', 'Advanced game programming course.')),
  evad(L('Programación de videojuegos — Avanzado II', 'Game programming — Advanced II'), 'certs/evad-avanzado-2.webp', '2022 – 2023', L('Segundo curso avanzado de programación de videojuegos.', 'Second advanced game programming course.')),
  evad(L('Bootcamp de programación con Unity', 'Unity programming bootcamp'), 'certs/evad-bootcamp.webp', '2023 – 2024', L('Bootcamp de programación de videojuegos con Unity.', 'Game programming bootcamp with Unity.')),
  ...[
    'Máster en Pentesting y Hacking Ético', 'Curso Completo de Hacking Ético y Ciberseguridad', 'Curso Completo de Hacking Ético: Aprende Todo',
    'Hacking Ético con Kali Linux', 'Hacking Ético con Metasploit Framework', 'Hacking Ético Web: Pentesting en Webs',
    'Hacking Ético a Redes Wi-Fi', 'Escalada de Privilegios en Linux', 'Hacking Ético: Virus, Troyanos y Malware',
    'Hacking Ético a PC con Malware', 'Hacking Ético a Dispositivos Android', 'Hacking Ético desde Dispositivos Android',
    'Hacking Ético a Redes Sociales', 'Seguridad desde Cero: Detecta y Defiéndete del Phishing', 'OSINT para Principiantes',
    'Anonimato en la Red: Privacidad y Deep Web', 'ChatGPT para Hacking Ético'
  ].map(title => ({ shelf: 'udemy', emoji: '🎓', title, org: 'Udemy', text: L('Curso online de Udemy (en español).', 'Online Udemy course (in Spanish).'), stamp: 'Completado' }))
].map(c => ({ kind: 'certificaciones', ...c }));

// start/end en AAAA-MM-DD: con ellos el sello dice "Participé" o "Próximamente".
const events = [
  { emoji: '🌱', title: 'Desafío Cátedra Hedy Lamarr', org: L('Universidad de Málaga · Ericsson', 'University of Málaga · Ericsson'), year: '2024', date: L('15 de marzo de 2024', 'March 15, 2024'), image: 'certs/lamarr.webp', text: L('Fase 2 del desafío de la Cátedra Mujer y Tecnología Hedy Lamarr, en la ETSI Telecomunicación: cómo mejorar el mundo a nuestro alrededor, de manera sostenible, con inteligencia artificial. Diploma con acceso al Concurso Hilda Ericsson.', 'Phase 2 of the Hedy Lamarr Women & Technology Chair challenge, at the ETSI Telecommunication school: how to improve the world around us, sustainably, with artificial intelligence. Diploma granting entry to the Hilda Ericsson Contest.'), tags: [L('IA', 'AI'), L('Sostenibilidad', 'Sustainability')], stamp: 'Diploma' },
  { emoji: '🏆', title: 'ASTI Challenge', org: L('Robótica', 'Robotics'), text: L('Capitán de un equipo de robótica: primer puesto en Málaga y clasificación para la final nacional.', 'Captain of a robotics team: first place in Málaga and a place in the national final.'), tags: [L('Liderazgo', 'Leadership'), L('Robótica', 'Robotics')], stamp: 'Finalista' },
  { emoji: '🍐', title: 'Meta Global AI Developer Hackathon', org: 'Indie track', year: '2026', start: '2026-10-26', end: '2026-11-04', date: L('26 oct – 4 nov 2026', 'Oct 26 – Nov 4, 2026'), text: L('Mi proyecto: FriendlyPear, un agente de voz que protege de las estafas a personas mayores.', 'My project: FriendlyPear, a voice agent that protects older adults from scams.'), tags: [L('IA', 'AI'), 'Android'], url: 'https://github.com/Ruby570bocadito/FriendlyPear' },
  { emoji: '⚡', title: 'Megahackatón Generación FP', org: 'Diverxia Consulting', year: '2026', start: '2026-11-11', end: '2026-11-11', date: L('11 de noviembre de 2026', 'November 11, 2026'), text: L('Hackatón para estudiantes de FP: innovación y trabajo en equipo en un día.', 'Hackathon for vocational students: innovation and teamwork in one day.'), tags: [L('Equipo', 'Teamwork'), 'FP'], url: 'https://github.com/Ruby570bocadito/MegaHackaton-Generacion-FP-DIVERXIA' },
  { emoji: '🤖', title: 'Veritas AI High School Hackathon', org: 'Veritas AI · online', year: '2026', start: '2026-11-14', end: '2026-11-15', date: L('14 – 15 de noviembre de 2026', 'November 14 – 15, 2026'), text: L('Hackatón internacional online de 48 horas: un proyecto de IA real en un fin de semana, presentado ante investigadores de laboratorios de IA.', 'International 48-hour online hackathon: a real AI project in one weekend, pitched to researchers from AI labs.'), tags: [L('IA', 'AI'), L('48 horas', '48 hours')], links: [{ label: L('Web del hackatón', 'Hackathon website'), href: 'https://highschoolhackathon.org/' }] },
  { emoji: '🚀', title: 'Talent Land', org: L('Evento tecnológico', 'Tech event'), year: '2026', start: '2026-11-24', end: '2026-11-26', date: L('24 – 26 de noviembre de 2026', 'November 24 – 26, 2026'), text: L('Tecnología, innovación y comunidad durante tres días.', 'Three days of technology, innovation and community.'), tags: [L('Comunidad', 'Community')] }
].map(e => ({ kind: 'hackatones', shelf: 'hack', ...e }));

// Numera cada libro dentro de su estantería: la signatura queda como "BT-003".
const counters = {};
export const BOOKS = [...projects, ...events, ...certs].map(book => {
  const shelf = SHELVES.find(s => s.id === book.shelf) ?? SHELVES[3];
  counters[shelf.id] = (counters[shelf.id] ?? 0) + 1;
  return { ...book, id: `${shelf.code}-${String(counters[shelf.id]).padStart(3, '0')}`, shelfLabel: shelf.label };
});

// Sello de un evento según la fecha de hoy (solo en el navegador: en el servidor se queda el sello fijo).
export function eventStamp(book, now) {
  if (!book.start || !now) return book.stamp ?? null;
  if (now > new Date(`${book.end}T23:59:59`)) return 'Participé';
  if (now >= new Date(`${book.start}T00:00:00`)) return 'Ahora mismo';
  return 'Próximamente';
}
