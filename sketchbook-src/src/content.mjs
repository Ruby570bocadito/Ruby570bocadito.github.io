// Contenido del portfolio (ES/EN). Fuente: portfolio actual (commit 71731b0) + documento
// "MI PORTAFOLIO TECNOLÓGICO" aportado por Rafael. Se usa en build-time (build.mjs) y por app.js.
//
// T: diccionario plano de traducciones  clave -> { es, en }   (puede llevar <b>, <em>, <br>).
// DATA: estructura de las secciones; las cadenas que empiezan por "@" son claves de T,
//       el resto son literales iguales en ambos idiomas (nombres propios, tecnologías…).

export const LANGS = ['es', 'en'];
export const DEFAULT_LANG = 'es';

export const T = {
  'meta.title': { es: 'Rafael Gálvez Silipo — Ciberseguridad · Seguridad Ofensiva · Red Team',
                  en: 'Rafael Gálvez Silipo — Cybersecurity · Offensive Security · Red Team' },
  'meta.desc': { es: 'Estudiante de ciberseguridad enfocado en Red Team y seguridad ofensiva. Construyo mis propias herramientas y proyectos de investigación para entender cómo funcionan los sistemas, cómo se atacan y cómo se protegen.',
                 en: 'Cybersecurity student focused on Red Team and offensive security. I build my own tools and research projects to understand how systems work, how they are attacked, and how they are defended.' },

  'brand': { es: 'Rafael Gálvez', en: 'Rafael Gálvez' },
  'ui.enter': { es: 'Entrar', en: 'Enter' },
  'ui.lang': { es: 'EN', en: 'ES' },
  'ui.menu': { es: 'Secciones', en: 'Sections' },
  'ui.close': { es: 'Cerrar', en: 'Close' },
  'ui.back_top': { es: 'Volver arriba', en: 'Back to top' },
  'ui.scroll': { es: 'Baja para explorar', en: 'Scroll to explore' },
  'ui.motion_off': { es: 'Reducir animación', en: 'Reduce motion' },
  'ui.motion_on': { es: 'Activar animación', en: 'Enable motion' },
  'ui.skip': { es: 'Saltar a la navegación', en: 'Skip to navigation' },
  'ui.open_project': { es: 'Ver proyecto', en: 'View project' },
  'ui.demo': { es: 'pasa el cursor · demo', en: 'hover · demo' },
  'ui.visit': { es: 'Visitar', en: 'Visit' },
  'ui.aria_nav': { es: 'Navegación del portfolio', en: 'Portfolio navigation' },

  // ── Nav / puertas ──
  'nav.about': { es: 'Sobre mí', en: 'About' },
  'nav.projects': { es: 'Proyectos', en: 'Projects' },
  'nav.cyber': { es: 'Ciberseguridad', en: 'Cybersecurity' },
  'nav.code': { es: 'Programación', en: 'Programming' },
  'nav.ai': { es: 'IA & Hackatones', en: 'AI & Hackathons' },
  'nav.robotics': { es: 'Robótica', en: 'Robotics' },
  'nav.certs': { es: 'Certificaciones', en: 'Certifications' },
  'nav.goal': { es: 'Objetivo', en: 'Goal' },
  'nav.contact': { es: 'Contacto', en: 'Contact' },

  // ── Entrada / héroe ──
  'hero.sign': { es: 'PORTFOLIO', en: 'PORTFOLIO' },
  'hero.pill': { es: 'Disponible para prácticas y roles junior', en: 'Open to internships & junior roles' },
  'hero.title': { es: 'Aprendo <em>construyendo.</em>', en: 'I learn <em>by building.</em>' },
  'hero.sub': { es: '<b>Rafael Gálvez Silipo</b> — estudiante de ciberseguridad enfocado en Red Team y seguridad ofensiva. En vez de solo usar herramientas, construyo las mías para entender cómo funcionan los sistemas, cómo se atacan y cómo se protegen.',
                en: '<b>Rafael Gálvez Silipo</b> — cybersecurity student focused on Red Team and offensive security. Instead of just using tools, I build my own to understand how systems work, how they are attacked, and how they are defended.' },
  'hero.hint': { es: 'Llama a la puerta — o baja para recorrer la casa', en: 'Knock on the door — or scroll to walk through the house' },

  // ── Pasillo ──
  'hall.title': { es: 'Elige una puerta', en: 'Pick a door' },
  'hall.sub': { es: 'Cada puerta abre una parte de lo que hago. Entra por donde quieras.',
                en: 'Each door opens a part of what I do. Enter wherever you like.' },

  // ── Sobre mí ──
  'about.kicker': { es: '01 — Sobre mí', en: '01 — About' },
  'about.title': { es: 'La curiosidad primero, <em>siempre.</em>', en: 'Curiosity first, <em>always.</em>' },
  'about.p1': { es: 'Empecé a programar con unos <b>10 años</b>, aprendiendo C# y Unity con el desarrollo de videojuegos. Con el tiempo mi curiosidad pasó de crear juegos a entender los sistemas que había debajo — y eso me llevó a la <b>ciberseguridad y la seguridad ofensiva</b>.',
               en: 'I started programming at around <b>10 years old</b>, learning C# and Unity through game development. Over time my curiosity shifted from making games to understanding the systems underneath them — and that led me to <b>cybersecurity and offensive security</b>.' },
  'about.p2': { es: 'Hoy estudio <b>Sistemas Microinformáticos y Redes (SMR)</b> y centro mi aprendizaje en Red Team, pentesting, Active Directory, Windows/Linux, OSINT, análisis de malware y ciberseguridad asistida por IA.',
               en: 'Today I study <b>Microcomputer Systems and Networks (SMR)</b> and focus my learning on Red Team, pentesting, Active Directory, Windows/Linux, OSINT, malware analysis and AI-assisted cybersecurity.' },
  'about.p3': { es: 'Aprendo sobre todo <b>construyendo</b>. Mi objetivo no es solo que algo funcione, sino entender <b>por qué</b> funciona — y acabar especializándome en operaciones Red Team e investigación de seguridad ofensiva.',
               en: 'I mostly learn <b>by building</b>. My goal is not just to make something work, but to understand <b>why</b> it works — and eventually specialize in Red Team operations and offensive security research.' },
  'about.journey': { es: 'Mi recorrido', en: 'My journey' },

  'jr.1.h': { es: 'Los videojuegos', en: 'Video games' },
  'jr.1.p': { es: 'Mi puerta de entrada: C#, Unity y la disciplina de terminar algo jugable. ~5 años de formación y práctica.',
             en: 'My entry door: C#, Unity and the discipline of shipping something playable. ~5 years of training and practice.' },
  'jr.2.h': { es: 'Formación SMR', en: 'SMR studies' },
  'jr.2.p': { es: 'Sistemas, redes, SO y fundamentos de ciberseguridad — la base formal de mi camino autodidacta.',
             en: 'Systems, networks, OS and cybersecurity fundamentals — the formal backbone of my self-taught path.' },
  'jr.3.h': { es: 'Ciberseguridad', en: 'Cybersecurity' },
  'jr.3.p': { es: 'Red Team, pentesting y seguridad ofensiva. Formado con eJPT, avanzando hacia CRTO y CPTES.',
             en: 'Red Team, pentesting and offensive security. eJPT-trained, working towards CRTO and CPTES.' },
  'jr.4.h': { es: 'Laboratorios', en: 'Labs' },
  'jr.4.p': { es: 'Todo corre en entornos aislados: dominios de AD, Hack The Box, infra C2 y purple teaming.',
             en: 'Everything runs in isolated environments: AD domains, Hack The Box, C2 infra and purple teaming.' },
  'jr.5.h': { es: 'Robótica', en: 'Robotics' },
  'jr.5.p': { es: 'Capitán de equipo y finalista nacional del ASTI Challenge. Liderazgo bajo presión real.',
             en: 'Team captain and national finalist of the ASTI Challenge. Leadership under real pressure.' },
  'jr.6.h': { es: 'Lo que viene', en: "What's next" },
  'jr.6.p': { es: 'Empezar mi carrera en ciberseguridad y especializarme en operaciones Red Team.',
             en: 'Start my career in cybersecurity and specialize in Red Team operations.' },

  'fact.loc': { es: 'Ubicación', en: 'Location' },
  'fact.locv': { es: 'Málaga, España', en: 'Málaga, Spain' },
  'fact.stu': { es: 'Estudios', en: 'Studies' },
  'fact.stuv': { es: 'SMR — Sistemas y Redes', en: 'SMR — Systems & Networks' },
  'fact.foc': { es: 'Enfoque', en: 'Focus' },
  'fact.focv': { es: 'Red Team · Seguridad Ofensiva', en: 'Red Team · Offensive Security' },
  'fact.sta': { es: 'Estado', en: 'Status' },
  'fact.stav': { es: 'Disponible para prácticas', en: 'Open to internships' },

  'stat.repos': { es: 'repositorios públicos', en: 'public repositories' },
  'stat.proj': { es: 'proyectos de seguridad', en: 'security projects' },
  'stat.tests': { es: 'tests automatizados escritos', en: 'automated tests written' },
  'stat.years': { es: 'años construyendo software', en: 'years building software' },

  // ── Proyectos ──
  'proj.kicker': { es: '02 — Proyectos', en: '02 — Projects' },
  'proj.title': { es: 'El tablón de <em>investigación.</em>', en: 'The research <em>board.</em>' },
  'proj.sub': { es: 'Proyectos construidos para responder una pregunta real sobre seguridad ofensiva. Capturas reales, uso real, sin maquetas.',
                en: 'Projects built to answer a real question about offensive security. Real screenshots, real usage, no mock-ups.' },
  'proj.active': { es: 'Investigación activa', en: 'Active research' },
  'proj.done': { es: 'Investigación completada', en: 'Research complete' },
  'proj.more': { es: 'El resto del arsenal', en: 'The rest of the arsenal' },

  'orq.role': { es: 'Orquestación Red Team asistida por IA', en: 'AI-assisted Red Team orchestration' },
  'orq.desc': { es: 'Plataforma para orquestar operaciones Red Team autorizadas con flujos asistidos por IA: automatización ofensiva con aprobación humana, control del alcance y auditoría completa.',
                en: 'A platform to orchestrate authorized Red Team operations through AI-assisted workflows: offensive automation with human approval, scope enforcement and full auditability.' },
  'wc2.role': { es: 'Plataforma de Mando y Control (C2)', en: 'Command & Control (C2) platform' },
  'wc2.desc': { es: 'Plataforma C2 como proyecto de investigación y aprendizaje: arquitectura de mando y control, comunicaciones cifradas, gestión de sesiones e infraestructura de operador.',
                en: 'A C2 platform built as a research and learning project: command-and-control architecture, encrypted comms, session management and operator infrastructure.' },
  'hive.role': { es: 'Investigación multi-agente distribuida', en: 'Distributed multi-agent research' },
  'hive.desc': { es: 'Proyecto experimental en Rust que explora coordinación multi-agente, sistemas distribuidos, concurrencia, consenso e investigación de seguridad asistida por IA.',
                 en: 'A Rust experiment exploring multi-agent coordination, distributed systems, concurrency, consensus and AI-assisted security research.' },
  'worm.role': { es: 'Investigación de malware y redes', en: 'Malware & network research' },
  'worm.desc': { es: 'Proyecto de investigación que explora el comportamiento del malware, la propagación por red y el machine learning en laboratorios aislados.',
                 en: 'A research project exploring malware behavior, network propagation and machine learning in isolated labs.' },

  'm.tests': { es: 'tests automatizados', en: 'automated tests' },
  'm.phases': { es: 'fases de orquestación', en: 'orchestration phases' },
  'm.transports': { es: 'transportes de recon', en: 'recon transports' },
  'm.fallbacks': { es: 'transportes de respaldo', en: 'transport fallbacks' },
  'm.rbac': { es: 'roles RBAC', en: 'RBAC roles' },
  'm.e2e': { es: 'tests E2E', en: 'browser E2E tests' },
  'm.passing': { es: 'tests superados', en: 'tests passing' },
  'm.crates': { es: 'crates en el workspace', en: 'crates in the workspace' },
  'm.modules': { es: 'módulos de exploit', en: 'gated exploit modules' },
  'm.services': { es: 'servicios de laboratorio', en: 'lab services' },

  'mc1.p': { es: 'Detección de amenazas en Windows en tiempo real: sensor ETW en Rust + motor conductual en Go + reglas MITRE ATT&CK + consola web.',
             en: 'Real-time Windows threat detection: Rust ETW sensor + Go behavioral engine + MITRE ATT&CK rules + web console.' },
  'mc2.p': { es: 'Motor de rootkit LKM para laboratorios red team autorizados en Linux — hooks de syscalls, técnicas de ocultación, give-root.',
             en: 'Linux LKM rootkit engine for authorized red-team labs — syscall hooks, hiding techniques, give-root.' },
  'mc3.p': { es: 'Escalada de privilegios en Linux automatizada: 15 escáneres de solo lectura, 75 técnicas de GTFOBins, lo más seguro primero.',
             en: 'Automated Linux privilege escalation: 15 read-only scanners, 75 GTFOBins techniques, safest-first.' },
  'mc4.p': { es: 'Framework de auditoría Bluetooth estilo Metasploit — 22 módulos, CLI + REPL + panel web, 100% offline.',
             en: 'Metasploit-style Bluetooth auditing framework — 22 modules, CLI + REPL + web dashboard, 100% offline.' },
  'mc5.p': { es: 'Framework red team en Python puro: 79 módulos nativos, barridos multi-host, workspaces, informes PDF.',
             en: 'Pure-Python red team framework: 79 native modules, multi-host sweeps, workspaces, PDF reports.' },
  'mc6.p': { es: 'Banco de trabajo del protocolo Kerberos: códec DER propio, cripto RFC 4120/3961, kerberoast, AS-REP roast.',
             en: 'Kerberos protocol workbench: own DER codec, RFC 4120/3961 crypto, kerberoast, AS-REP roast.' },
  'mc7.p': { es: 'Inteligencia de superficie de ataque con IA — OSINT y recon con IA local (Ollama), sin claves API, 100% gratis.',
             en: 'AI-powered attack surface intelligence — OSINT & recon with local AI (Ollama), no API keys, 100% free.' },
  'mc8.p': { es: 'Terminal de seguridad ofensiva con IA, 100% offline: LLM local, ejecución aislada, controles humanos en el bucle.',
             en: 'AI-powered offensive security terminal, 100% offline: local LLM, sandboxed execution, human-in-the-loop gates.' },
  'mc9.p': { es: 'AuraSOC — framework SOC de código abierto: Detección como Código + purple team + IA local. Go + Vue 3 + NATS + OpenSearch.',
             en: 'AuraSOC — open-source SOC framework: Detection-as-Code + purple team + local AI. Go + Vue 3 + NATS + OpenSearch.' },

  // ── Ciberseguridad ──
  'cyber.kicker': { es: '03 — Ciberseguridad', en: '03 — Cybersecurity' },
  'cyber.title': { es: 'El <em>laboratorio.</em>', en: 'The <em>lab.</em>' },
  'cyber.sub': { es: 'Donde estudio cómo se atacan los sistemas — y cómo defenderlos. Todo en entornos aislados y autorizados.',
                 en: 'Where I study how systems are attacked — and how to defend them. Always in isolated, authorized environments.' },
  'cyber.areas': { es: 'Áreas en las que trabajo', en: 'Areas I work in' },
  'cyber.courses': { es: 'Formación (Udemy)', en: 'Coursework (Udemy)' },
  'cyber.courses_sub': { es: '17 cursos completados en seguridad ofensiva y defensiva', en: '17 completed courses in offensive & defensive security' },

  'ca.1': { es: 'Hacking ético y pentesting', en: 'Ethical hacking & pentesting' },
  'ca.2': { es: 'Seguridad defensiva y análisis SOC', en: 'Defensive security & SOC analysis' },
  'ca.3': { es: 'EDR, SIEM, SOAR y Microsoft Defender', en: 'EDR, SIEM, SOAR & Microsoft Defender' },
  'ca.4': { es: 'Active Directory', en: 'Active Directory' },
  'ca.5': { es: 'Seguridad web, de redes y de dispositivos', en: 'Web, network & device security' },
  'ca.6': { es: 'Detección de phishing', en: 'Phishing detection' },
  'ca.7': { es: 'OSINT, privacidad y anonimato', en: 'OSINT, privacy & anonymity' },
  'ca.8': { es: 'Linux y escalada de privilegios', en: 'Linux & privilege escalation' },
  'ca.9': { es: 'Análisis de malware', en: 'Malware analysis' },

  // ── Programación ──
  'code.kicker': { es: '04 — Programación', en: '04 — Programming' },
  'code.title': { es: 'El <em>taller.</em>', en: 'The <em>workshop.</em>' },
  'code.sub': { es: 'Los cimientos sobre los que se apoya todo lo demás: lenguajes, sistemas y la costumbre de construir mis propias herramientas.',
                en: 'The foundations everything else stands on: languages, systems and the habit of building my own tools.' },
  'code.lang': { es: 'Lenguajes y tecnologías', en: 'Languages & technologies' },
  'code.games': { es: 'Desarrollo de videojuegos', en: 'Game development' },
  'code.games_p': { es: 'Mi origen como programador. Formación de curso básico a bootcamp, con ~5 años de trayectoria creando software jugable en C# y Unity.',
                    en: 'My origin as a programmer. Training from beginner course to bootcamp, with ~5 years shipping playable software in C# and Unity.' },
  'gc.1': { es: 'Curso básico', en: 'Beginner course' },
  'gc.2': { es: 'Curso medio', en: 'Intermediate course' },
  'gc.3': { es: 'Avanzado 1', en: 'Advanced 1' },
  'gc.4': { es: 'Avanzado 2', en: 'Advanced 2' },
  'gc.5': { es: 'Bootcamp de videojuegos', en: 'Game dev bootcamp' },

  // ── IA & Hackatones ──
  'ai.kicker': { es: '05 — IA & Hackatones', en: '05 — AI & Hackathons' },
  'ai.title': { es: 'La IA como <em>multiplicador.</em>', en: 'AI as a <em>force multiplier.</em>' },
  'ai.sub': { es: 'Uso la IA para investigar y construir más rápido — nunca como piloto automático a ciegas. El código generado se revisa, se prueba y se entiende.',
              en: 'I use AI to research and build faster — never as a blind autopilot. Generated code gets reviewed, tested and understood.' },
  'ai.training': { es: 'Formación en IA', en: 'AI training' },
  'ai.events': { es: 'Eventos y hackatones', en: 'Events & hackathons' },
  'ait.1': { es: 'ChatGPT aplicado al hacking ético', en: 'ChatGPT applied to ethical hacking' },
  'ait.2': { es: 'Iniciación a la inteligencia artificial', en: 'Introduction to artificial intelligence' },

  'ev.1.h': { es: 'Meta AI Developer Hackathon', en: 'Meta AI Developer Hackathon' },
  'ev.1.w': { es: 'Online · 2026', en: 'Online · 2026' },
  'ev.1.p': { es: 'Hackatón global para construir con los modelos de IA de Meta.', en: 'Global hackathon building with Meta’s AI models.' },
  'ev.2.h': { es: 'Megahackatón', en: 'Megahackathon' },
  'ev.2.w': { es: '4 de noviembre de 2026', en: 'November 4, 2026' },
  'ev.2.p': { es: 'Desarrollo, innovación y trabajo colaborativo contrarreloj.', en: 'Development, innovation and collaborative work against the clock.' },
  'ev.3.h': { es: 'Talent Land', en: 'Talent Land' },
  'ev.3.w': { es: '24–26 de noviembre de 2026', en: 'November 24–26, 2026' },
  'ev.3.p': { es: 'Encuentro tecnológico de innovación, talento y comunidad.', en: 'A tech gathering of innovation, talent and community.' },

  // ── Robótica ──
  'rob.kicker': { es: '06 — Robótica & Liderazgo', en: '06 — Robotics & Leadership' },
  'rob.title': { es: 'Evidencia que va <em>más allá del código.</em>', en: 'Evidence that goes <em>beyond code.</em>' },
  'rob.h': { es: 'ASTI Challenge — Finalista Nacional de Robótica', en: 'ASTI Challenge — National Robotics Finalist' },
  'rob.p': { es: 'Capitán de un equipo de robótica que quedó <b>1.º en Málaga</b> y se clasificó para la <b>final nacional</b> en España. Trabajé en el desarrollo del robot, la resolución de problemas, la coordinación del equipo y la estrategia de competición — bajo presión real y contra los mejores equipos del país.',
             en: 'Captain of a robotics team that finished <b>1st in Málaga</b> and qualified for the <b>national final</b> in Spain. I worked on robot development, problem-solving, team coordination and competition strategy — under real pressure and against the best teams in the country.' },
  'rob.skills': { es: 'Competencias', en: 'Skills' },
  'rk.1': { es: 'Liderazgo y coordinación', en: 'Leadership & coordination' },
  'rk.2': { es: 'Trabajo en equipo', en: 'Teamwork' },
  'rk.3': { es: 'Resolución de problemas técnicos', en: 'Technical problem-solving' },
  'rk.4': { es: 'Creatividad e innovación', en: 'Creativity & innovation' },
  'rob.tag1': { es: 'Capitán del equipo', en: 'Team captain' },
  'rob.tag2': { es: '1.º — Málaga', en: '1st — Málaga' },
  'rob.tag3': { es: 'Finalista nacional', en: 'National finalist' },

  // ── Certificaciones ──
  'cert.kicker': { es: '07 — Certificaciones', en: '07 — Certifications' },
  'cert.title': { es: 'Obtenidas, y <em>lo que viene.</em>', en: 'Obtained, and <em>what’s next.</em>' },
  'cert.obtained': { es: 'Obtenida', en: 'Obtained' },
  'cert.course': { es: 'Formación', en: 'Coursework' },
  'cert.prep': { es: 'En preparación', en: 'Preparing' },
  'cert.ejpt.p': { es: 'Certificación de pentesting (INE Security). Previa · caducó en julio de 2026, renovación prevista junto a los próximos hitos.',
                   en: 'Pentesting certification (INE Security). Previously certified · expired July 2026, renewal planned alongside the next milestones.' },
  'cert.cisco.p': { es: 'Ethical Hacker · Linux Unhatched · Python Essentials 1 · Conceptos básicos de redes · Introducción a la Ciberseguridad.',
                    en: 'Ethical Hacker · Linux Unhatched · Python Essentials 1 · Networking Basics · Introduction to Cybersecurity.' },
  'cert.hack4u.p': { es: 'Introducción al Hacking — formación en Red Team y pentesting.', en: 'Introduction to Hacking — Red Team & pentesting training.' },
  'cert.big.p': { es: 'Ciberseguridad y Hacking Ético · Iniciación con Inteligencia Artificial (certificados de asistencia).',
                  en: 'Cybersecurity & Ethical Hacking · Getting started with Artificial Intelligence (attendance certificates).' },
  'cert.crto.org': { es: 'Ruta Red Team Operator', en: 'Red Team Operator path' },
  'cert.crto.p': { es: 'Profundizando en emulación de adversarios y tradecraft de Red Team.', en: 'Deepening adversary emulation and Red Team tradecraft.' },
  'cert.cptes.org': { es: 'Ruta de pentesting', en: 'Penetration testing path' },
  'cert.cptes.p': { es: 'Preparación estructurada para certificaciones profesionales de pentesting.', en: 'Structured preparation for professional pentesting certifications.' },

  // ── Objetivo ──
  'goal.kicker': { es: '08 — Objetivo profesional', en: '08 — Professional goal' },
  'goal.title': { es: 'Hacia dónde <em>voy.</em>', en: 'Where I’m <em>headed.</em>' },
  'goal.sub': { es: 'Seguir creciendo en el sector tecnológico y transformar lo que aprendo en proyectos prácticos, con especial interés en:',
                en: 'Keep growing in tech and turn what I learn into practical projects, with special interest in:' },
  'gl.1': { es: 'Analista SOC y ciberseguridad defensiva', en: 'SOC analyst & defensive cybersecurity' },
  'gl.2': { es: 'Pentesting y hacking ético', en: 'Pentesting & ethical hacking' },
  'gl.3': { es: 'Automatización con Python y Bash', en: 'Automation with Python & Bash' },
  'gl.4': { es: 'Seguridad de sistemas, redes y aplicaciones', en: 'Systems, network & application security' },
  'gl.5': { es: 'Inteligencia artificial', en: 'Artificial intelligence' },
  'gl.6': { es: 'Desarrollo de software y videojuegos', en: 'Software & game development' },

  // ── Contacto ──
  'contact.kicker': { es: '09 — Contacto', en: '09 — Contact' },
  'contact.title': { es: 'Vamos a <em>conectar.</em>', en: 'Let’s <em>connect.</em>' },
  'contact.sub': { es: 'Me interesan prácticas, oportunidades junior en ciberseguridad y proyectos de seguridad ofensiva y Red Team. Suelo responder en menos de 24 horas.',
                   en: 'I’m interested in internships, junior cybersecurity roles and offensive security / Red Team projects. I usually reply within 24 hours.' },
  'contact.email': { es: 'Escríbeme', en: 'Email me' },
  'contact.copy': { es: 'Copiar correo', en: 'Copy email' },
  'contact.copied': { es: 'Correo copiado ✓', en: 'Email copied ✓' },
  'contact.cv': { es: 'Descargar CV', en: 'Download CV' },

  // ── Footer ──
  'foot.made': { es: 'Diseñado y construido por Rafael Gálvez. Ilustraciones generadas con IA (Meta Muse) y pintadas a mano digitalmente.',
                 en: 'Designed & built by Rafael Gálvez. Illustrations generated with AI (Meta Muse) and hand-finished digitally.' },
  'foot.copy': { es: '© 2026 Rafael Gálvez Silipo', en: '© 2026 Rafael Gálvez Silipo' },
  'foot.classic': { es: 'Ver versión anterior', en: 'See previous version' }
};

const GH = 'https://github.com/Ruby570bocadito';
export const LINKS = {
  github: GH,
  linkedin: 'https://www.linkedin.com/in/rafael-g%C3%A1lvez-silipo-07445a409/',
  email: 'rafagasi09@gmail.com',
  cv: '/cv.pdf',
  classic: '/classic/'
};

// Puertas del pasillo -> sección
export const DOORS = [
  { id: 'about', art: 'door-a', label: '@nav.about' },
  { id: 'projects', art: 'door-b', label: '@nav.projects' },
  { id: 'cyber', art: 'door-c', label: '@nav.cyber' },
  { id: 'code', art: 'door-a', label: '@nav.code' },
  { id: 'ai', art: 'door-b', label: '@nav.ai' },
  { id: 'robotics', art: 'door-c', label: '@nav.robotics' },
  { id: 'certs', art: 'door-a', label: '@nav.certs' },
  { id: 'goal', art: 'door-b', label: '@nav.goal' },
  { id: 'contact', art: 'door-c', label: '@nav.contact' }
];

export const JOURNEY = [
  { art: 'isl-start', h: '@jr.1.h', p: '@jr.1.p' },
  { art: 'isl-school', h: '@jr.2.h', p: '@jr.2.p' },
  { art: 'isl-castle', h: '@jr.3.h', p: '@jr.3.p' },
  { art: 'isl-lab', h: '@jr.4.h', p: '@jr.4.p' },
  { art: 'isl-robot', h: '@jr.5.h', p: '@jr.5.p' },
  { art: 'isl-rocket', h: '@jr.6.h', p: '@jr.6.p' }
];

export const FACTS = [
  ['@fact.loc', '@fact.locv'], ['@fact.stu', '@fact.stuv'],
  ['@fact.foc', '@fact.focv'], ['@fact.sta', '@fact.stav']
];

export const STATS = [
  { to: 18, suffix: '+', label: '@stat.repos' },
  { to: 12, suffix: '', label: '@stat.proj' },
  { to: 1400, suffix: '+', label: '@stat.tests' },
  { to: 6, suffix: '+', label: '@stat.years' }
];

export const PROJECTS = [
  { name: 'OrquestaRT', active: true, role: '@orq.role', desc: '@orq.desc',
    stack: 'Python · FastAPI · LangGraph · Next.js · +5', href: GH + '/orquesta-rt',
    img: '/assets/orquesta-console.png', gif: '/assets/orquesta-demo.gif',
    alt: 'OrquestaRT — consola de operador con feed de agentes y ROE legible por máquina',
    metrics: [['587', '@m.tests'], ['F0→F7', '@m.phases'], ['26+', '@m.transports']] },
  { name: 'WorldC2', active: true, role: '@wc2.role', desc: '@wc2.desc',
    stack: 'Go · Vue 3 · Networking · Cryptography · +3', href: GH + '/WorldC2',
    img: '/assets/worldc2-dashboard.png', gif: '/assets/worldc2-demo.gif',
    alt: 'WorldC2 — panel con sesiones, credenciales, tareas y estado de webhooks SIEM',
    metrics: [['5', '@m.fallbacks'], ['4', '@m.rbac'], ['14', '@m.e2e']] },
  { name: 'HiveMind', active: true, role: '@hive.role', desc: '@hive.desc',
    stack: 'Rust · Distributed Systems · Concurrency · AI · +2', href: GH + '/HiveMind',
    img: '/assets/hivemind-console.png', gif: '/assets/hivemind-demo.gif',
    alt: 'HiveMind — consola de la colonia: ritmo de beacons, agentes y pipeline de tareas',
    metrics: [['282', '@m.passing'], ['9', '@m.crates'], ['0', '@m.services']] },
  { name: 'Wormy', active: false, role: '@worm.role', desc: '@worm.desc',
    stack: 'Python · Machine Learning · Networking · Docker', href: GH + '/Wormy-ML-Network-Worm',
    img: '/assets/wormy-dashboard.png', gif: '/assets/wormy-demo.gif',
    alt: 'Wormy — panel de propagación: línea temporal, estado de hosts y severidad',
    metrics: [['525', '@m.tests'], ['44', '@m.modules'], ['15', '@m.services']] }
];

export const MORE = [
  { name: 'security-framework', lang: 'Go', href: GH + '/security-framework', p: '@mc1.p', star: '★' },
  { name: 'Vault-Kernel', lang: 'Python', href: GH + '/Vault-Kernel', p: '@mc2.p', star: '★ 5' },
  { name: 'Auto-Privilege', lang: 'Go', href: GH + '/Auto-Privilege', p: '@mc3.p', star: '★ 7' },
  { name: 'bluesky', lang: 'Python', href: GH + '/bluesky', p: '@mc4.p', star: '★ 4' },
  { name: 'REDHAVOC', lang: 'Python', href: GH + '/REDHAVOC', p: '@mc5.p', star: '★ 2' },
  { name: 'charon', lang: 'Rust', href: GH + '/charon', p: '@mc6.p', star: '★' },
  { name: 'OSINT-EYE', lang: 'Python', href: GH + '/OSINT-EYE', p: '@mc7.p', star: '★ 1' },
  { name: 'T-100AI', lang: 'Python', href: GH + '/T-100AI', p: '@mc8.p', star: '★ 1' },
  { name: 'aura-soc', lang: 'Go', href: GH + '/aura-soc', p: '@mc9.p', star: '★' }
];

export const CYBER_AREAS = [
  { art: 'whiteboard', k: '@ca.1' }, { art: 'monitor', k: '@ca.2' }, { art: 'rack', k: '@ca.3' },
  { art: 'bookshelf', k: '@ca.4' }, { art: 'laptop', k: '@ca.5' }, { art: 'envelope', k: '@ca.6' },
  { art: 'magnifier', k: '@ca.7' }, { art: 'chair', k: '@ca.8' }, { art: 'bug', k: '@ca.9' }
];

// Cursos de Udemy (nombres propios: iguales en ambos idiomas, no se traducen).
export const UDEMY = [
  'Seguridad Informática desde Cero: Detectar y Defenderte del Phishing',
  'Máster en Pentesting y Hacking Ético',
  'Curso Completo de Hacking Ético y Ciberseguridad',
  'Hacking Ético a Dispositivos Móviles Android',
  'Anonimato en la Red: Privacidad y Deep Web',
  'Hacking Ético: Virus, Troyanos, Spywares y Malware',
  'Hacking Ético con Kali Linux',
  'Escalada de Privilegios en Linux',
  'Hacking Ético a PC con Malware',
  'Curso Completo de Hacking Ético',
  'Hacking Ético con Metasploit Framework',
  'Hacking Ético a Redes Wi-Fi',
  'ChatGPT para Hacking Ético',
  'Hacking Ético desde Dispositivos Android',
  'Hacking Ético a Redes Sociales',
  'Hacking Ético Web: Pentesting en Webs',
  'OSINT para Principiantes'
];

export const CODE_LANGS = ['Python', 'Bash', 'C#', 'HTML', 'CSS', 'Linux', 'Active Directory', 'Redes / Networking', 'Go', 'Rust', 'TypeScript', 'PowerShell'];
export const GAME_COURSES = ['@gc.1', '@gc.2', '@gc.3', '@gc.4', '@gc.5'];

export const AI_TRAINING = ['@ait.1', '@ait.2'];
export const EVENTS = [
  { art: 'bulb', h: '@ev.1.h', w: '@ev.1.w', p: '@ev.1.p', href: 'https://cerebralvalley.ai/e/meta-ai-developer-hackathon' },
  { art: 'rocket', h: '@ev.2.h', w: '@ev.2.w', p: '@ev.2.p' },
  { art: 'gear', h: '@ev.3.h', w: '@ev.3.w', p: '@ev.3.p' }
];

export const ROB_SKILLS = ['@rk.1', '@rk.2', '@rk.3', '@rk.4'];

export const CERTS = [
  { title: 'eJPTv2 — Junior Penetration Tester', org: 'INE Security', tag: '@cert.obtained', p: '@cert.ejpt.p', art: 'medal' },
  { title: 'Cisco Networking Academy', org: 'Cisco', tag: '@cert.course', p: '@cert.cisco.p', art: 'gradcap' },
  { title: 'Introducción al Hacking', org: 'Hack4u', tag: '@cert.course', p: '@cert.hack4u.p', art: 'gradcap' },
  { title: 'BIG School', org: 'BIG School', tag: '@cert.course', p: '@cert.big.p', art: 'gradcap' },
  { title: 'CRTO', org: '@cert.crto.org', tag: '@cert.prep', p: '@cert.crto.p', art: 'trophy', prep: true },
  { title: 'CPTES', org: '@cert.cptes.org', tag: '@cert.prep', p: '@cert.cptes.p', art: 'trophy', prep: true }
];

export const GOALS = ['@gl.1', '@gl.2', '@gl.3', '@gl.4', '@gl.5', '@gl.6'];
