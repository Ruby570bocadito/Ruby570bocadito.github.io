import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

// Idioma de la web: español por defecto (es lo que va prerenderizado en el HTML). En el navegador se usa el idioma
// guardado o, la primera vez, el del navegador; el botón ES | EN del menú lo cambia y lo recuerda.
export const LANGS = ['es', 'en'];

// Textos de la interfaz. Los del contenido (proyectos, certificados…) están en content.js y library.js como { es, en }.
const UI = {
  es: {
    'meta.title': 'Rafael Gálvez Silipo — Blue Team · SOC',
    'meta.desc': 'Rafael Gálvez Silipo, estudiante de ciberseguridad en Málaga enfocado en SOC, Blue Team e ingeniería de detección. Aprendo construyendo.',
    'skip': 'Saltar al contenido',
    'nav.label': 'Secciones', 'nav.home': 'Rafa, inicio', 'avail': 'Disponible para prácticas', 'lang.switch': 'Idioma',
    'hero.tag': 'Hola a todos', 'hero.line1': 'Soy Rafa Gálvez,', 'hero.line3': 'que aprende construyendo',
    'hero.work': 'Ver mi trabajo', 'hero.contact': 'Contacto', 'hero.bubble': '¡Hola! Soy Peri 🍐 Tócame',
    'hero.periLabel': 'Peri, la mascota de FriendlyPear: tócala y te da un consejo de seguridad',
    'badge.caption': 'Credencial de Rafa: toca para girarla', 'badge.role': 'Analista Blue Team en formación', 'badge.hint': 'Toca para girar ↻', 'badge.avatar': 'Avatar de Rafa',
    'term.focusFile': 'foco.txt', 'term.projects': 'proyectos/', 'term.whoami': 'rafa · blue team en formación', 'term.focus': 'SOC · detección · DFIR · hardening', 'term.status': 'disponible para prácticas',
    'featured.kicker': 'Ahora mismo', 'featured.title': 'Lo último que he construido', 'featured.alt': 'Peri, una pera de arcilla, saludando en una colina verde',
    'scan.sms': 'Revisando un SMS…', 'scan.trap': '¡Trampa! Avisa a la familia', 'scan.wa': 'Revisando un WhatsApp…', 'scan.ok': 'Todo bien, es de verdad',
    'projects.kicker': 'Proyectos', 'projects.title': 'Mis herramientas Blue Team', 'projects.lead': 'Cada uno nació de una pregunta real sobre cómo detectar, investigar o frenar un ataque. Capturas reales, código abierto.',
    'projects.github': 'Ver en GitHub', 'projects.open': 'Abrir {name} en GitHub', 'projects.shot': 'Captura de {name}', 'projects.more': 'Y más investigación defensiva', 'projects.toLibrary': 'Ver todos mis proyectos en la biblioteca',
    'red.title': 'Donde aprendí cómo atacan', 'red.sub': 'Mi etapa Red Team · {n} proyectos en laboratorios aislados',
    'red.lead': 'Empecé por el lado ofensivo. Entender cómo funcionan los ataques es justo lo que me llevó a defender. Todo se ejecuta en laboratorios aislados y autorizados.',
    'events.kicker': 'Logros y eventos', 'events.title': 'Donde pongo a prueba lo que aprendo', 'events.lead': 'Competiciones y hackatones: en equipo, con poco tiempo y presión real.',
    'status.done': 'Participé ✓', 'status.live': '¡Ahora mismo!', 'status.tomorrow': 'Mañana', 'status.days': 'Faltan {n} días',
    'skills.kicker': 'Habilidades', 'skills.title': 'Lo que sé hacer', 'skills.lead': 'Defensa primero, con el conocimiento ofensivo como ventaja: sé cómo piensa quien ataca.',
    'certs.kicker': 'Certificaciones y formación', 'certs.title': 'Lo que he estudiado', 'certs.lead': 'Certificaciones, formación reglada y muchas horas de cursos y laboratorio.',
    'certs.udemy': '{n} cursos de Udemy', 'certs.toLibrary': 'Ver todas las fichas en la biblioteca',
    'about.kicker': 'Sobre mí', 'about.title': 'Un poco sobre mí', 'about.contact': 'Contacto',
    'contact.kicker': 'Contacto', 'contact.title': 'Construyamos herramientas que detecten lo que otros no ven.',
    'contact.lead': 'Busco prácticas y oportunidades junior en ciberseguridad, sobre todo SOC y Blue Team. Suelo responder en menos de 24 horas.',
    'contact.write': 'Escríbeme', 'contact.copy': 'Copiar email', 'contact.copied': '¡Copiado! ✓',
    'footer.made': 'Hecho con curiosidad, código y demasiado café ☕',
    'peri.companion': 'Peri, la mascota de la web', 'peri.tap': 'Peri: tócala y te da un consejo de seguridad', 'peri.hide': 'Ocultar a Peri', 'peri.show': 'Volver a mostrar a Peri',
    'lib.kicker': 'Biblioteca', 'lib.title': 'Todo lo que he hecho, en estanterías', 'lib.lead': 'Proyectos, certificaciones y hackatones. Filtra, busca y saca cualquier libro para ver su ficha completa.',
    'lib.show': 'Qué mostrar', 'lib.search': 'Busca por nombre, tecnología o tema…', 'lib.searchLabel': 'Buscar en la biblioteca', 'lib.view': 'Vista', 'lib.shelves': 'Estantería', 'lib.list': 'Lista',
    'lib.book': 'libro', 'lib.books': 'libros', 'lib.for': ' para «{q}»', 'lib.empty': 'No encuentro nada con «{q}». Prueba con otra palabra 🤔',
    'lib.open': 'Abrir la ficha de {title} ({shelf})', 'lib.bookend': 'Peri, la bibliotecaria: tócala',
    'ficha.sig': 'Signatura', 'ficha.author': 'Autor', 'ficha.org': 'Entidad', 'ficha.date': 'Fecha', 'ficha.edition': 'Edición', 'ficha.lang': 'Lenguaje', 'ficha.stars': 'Estrellas',
    'ficha.starsValue': '★ {n} en GitHub', 'ficha.github': 'Ver en GitHub', 'ficha.repo': 'Repositorio', 'ficha.close': 'Cerrar la ficha', 'ficha.full': 'Abrir el certificado a tamaño completo',
    'ficha.cert': 'Certificado: {title}', 'ficha.loading': 'Buscando el README…', 'ficha.error': 'No he podido cargar el README.', 'ficha.openGithub': 'Ábrelo en GitHub', 'ficha.state': 'Estado: {s}',
    'empty.red': 'El detalle, el alcance y el uso responsable están en su repositorio.',
    'empty.cert': 'La imagen de este certificado todavía no está en la biblioteca.', 'empty.hack': '¡Un reto más en equipo!', 'empty.project': 'Todo el código está en su repositorio.'
  },
  en: {
    'meta.title': 'Rafael Gálvez Silipo — Blue Team · SOC',
    'meta.desc': 'Rafael Gálvez Silipo, cybersecurity student in Málaga focused on SOC, Blue Team and detection engineering. I learn by building.',
    'skip': 'Skip to content',
    'nav.label': 'Sections', 'nav.home': 'Rafa, home', 'avail': 'Open to internships', 'lang.switch': 'Language',
    'hero.tag': 'Hello everyone', 'hero.line1': 'I’m Rafa Gálvez,', 'hero.line3': 'who learns by building',
    'hero.work': 'See my work', 'hero.contact': 'Contact', 'hero.bubble': 'Hi! I’m Peri 🍐 Tap me',
    'hero.periLabel': 'Peri, the FriendlyPear mascot: tap her for a security tip',
    'badge.caption': 'Rafa’s badge: tap to flip it', 'badge.role': 'Blue Team analyst in training', 'badge.hint': 'Tap to flip ↻', 'badge.avatar': 'Rafa’s avatar',
    'term.focusFile': 'focus.txt', 'term.projects': 'projects/', 'term.whoami': 'rafa · blue team in training', 'term.focus': 'SOC · detection · DFIR · hardening', 'term.status': 'open to internships',
    'featured.kicker': 'Right now', 'featured.title': 'The latest thing I built', 'featured.alt': 'Peri, a clay pear, waving on a green hill',
    'scan.sms': 'Checking a text message…', 'scan.trap': 'A trap! Telling the family', 'scan.wa': 'Checking a WhatsApp…', 'scan.ok': 'All good, it’s genuine',
    'projects.kicker': 'Projects', 'projects.title': 'My Blue Team tools', 'projects.lead': 'Each one started from a real question about detecting, investigating or stopping an attack. Real screenshots, open source.',
    'projects.github': 'View on GitHub', 'projects.open': 'Open {name} on GitHub', 'projects.shot': 'Screenshot of {name}', 'projects.more': 'And more defensive research', 'projects.toLibrary': 'See all my projects in the library',
    'red.title': 'Where I learned how attacks work', 'red.sub': 'My Red Team stage · {n} projects in isolated labs',
    'red.lead': 'I started on the offensive side. Understanding how attacks work is exactly what led me to defense. Everything runs in isolated, authorized labs.',
    'events.kicker': 'Achievements & events', 'events.title': 'Where I put what I learn to the test', 'events.lead': 'Competitions and hackathons: in a team, against the clock, under real pressure.',
    'status.done': 'Took part ✓', 'status.live': 'Happening now!', 'status.tomorrow': 'Tomorrow', 'status.days': 'In {n} days',
    'skills.kicker': 'Skills', 'skills.title': 'What I can do', 'skills.lead': 'Defense first, with offensive knowledge as an edge: I know how attackers think.',
    'certs.kicker': 'Certifications & training', 'certs.title': 'What I’ve studied', 'certs.lead': 'Certifications, formal education and many hours of courses and labs.',
    'certs.udemy': '{n} Udemy courses (in Spanish)', 'certs.toLibrary': 'See every record in the library',
    'about.kicker': 'About me', 'about.title': 'A little about me', 'about.contact': 'Contact',
    'contact.kicker': 'Contact', 'contact.title': 'Let’s build tools that catch what others miss.',
    'contact.lead': 'I’m looking for internships and junior roles in cybersecurity, especially SOC and Blue Team. I usually reply within 24 hours.',
    'contact.write': 'Email me', 'contact.copy': 'Copy email', 'contact.copied': 'Copied! ✓',
    'footer.made': 'Made with curiosity, code and too much coffee ☕',
    'peri.companion': 'Peri, the site’s mascot', 'peri.tap': 'Peri: tap her for a security tip', 'peri.hide': 'Hide Peri', 'peri.show': 'Show Peri again',
    'lib.kicker': 'Library', 'lib.title': 'Everything I’ve done, on bookshelves', 'lib.lead': 'Projects, certifications and hackathons. Filter, search and pull out any book to see its full record.',
    'lib.show': 'What to show', 'lib.search': 'Search by name, technology or topic…', 'lib.searchLabel': 'Search the library', 'lib.view': 'View', 'lib.shelves': 'Shelves', 'lib.list': 'List',
    'lib.book': 'book', 'lib.books': 'books', 'lib.for': ' for “{q}”', 'lib.empty': 'Nothing found for “{q}”. Try another word 🤔',
    'lib.open': 'Open the record for {title} ({shelf})', 'lib.bookend': 'Peri, the librarian: tap her',
    'ficha.sig': 'Call number', 'ficha.author': 'Author', 'ficha.org': 'Issuer', 'ficha.date': 'Date', 'ficha.edition': 'Edition', 'ficha.lang': 'Language', 'ficha.stars': 'Stars',
    'ficha.starsValue': '★ {n} on GitHub', 'ficha.github': 'View on GitHub', 'ficha.repo': 'Repository', 'ficha.close': 'Close the record', 'ficha.full': 'Open the certificate at full size',
    'ficha.cert': 'Certificate: {title}', 'ficha.loading': 'Fetching the README…', 'ficha.error': 'I couldn’t load the README.', 'ficha.openGithub': 'Open it on GitHub', 'ficha.state': 'Status: {s}',
    'empty.red': 'The details, scope and responsible use are in its repository.',
    'empty.cert': 'This certificate’s image isn’t in the library yet.', 'empty.hack': 'One more team challenge!', 'empty.project': 'All the code is in its repository.'
  }
};

// Sellos de la Biblioteca: se guardan en español y se muestran en el idioma activo.
const STAMPS = {
  'Código abierto': 'Open source', Completado: 'Completed', Participé: 'Took part', 'Solo laboratorio': 'Lab only',
  'Ahora mismo': 'Happening now', Obtenida: 'Earned', Próximamente: 'Coming up', 'En curso': 'In progress', Finalista: 'Finalist', Diploma: 'Diploma'
};

const LangContext = createContext({ lang: 'es', setLang: () => {} });

export function LangProvider({ children }) {
  const [lang, setLangState] = useState('es');
  useEffect(() => {
    let saved = null;
    try { saved = localStorage.getItem('lang'); } catch { /* sin almacenamiento */ }
    const initial = LANGS.includes(saved) ? saved : navigator.language?.toLowerCase().startsWith('es') ? 'es' : 'en';
    if (initial !== 'es') setLangState(initial);
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = UI[lang]['meta.title'];
    document.querySelector('meta[name="description"]')?.setAttribute('content', UI[lang]['meta.desc']);
  }, [lang]);
  const setLang = useCallback(next => {
    setLangState(next);
    try { localStorage.setItem('lang', next); } catch { /* sin almacenamiento */ }
  }, []);
  const value = useMemo(() => ({ lang, setLang }), [lang, setLang]);
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);

// t('clave', { n: 3 }) para textos de la interfaz; tr(valor) para un texto de contenido { es, en } (o uno fijo).
export function useT() {
  const { lang } = useContext(LangContext);
  return useMemo(() => {
    const tr = value => (value && typeof value === 'object' && !Array.isArray(value) && 'es' in value ? value[lang] ?? value.es : value);
    const t = (key, vars) => {
      let text = UI[lang][key] ?? UI.es[key] ?? key;
      if (vars) for (const [k, v] of Object.entries(vars)) text = text.replaceAll(`{${k}}`, v);
      return text;
    };
    const stamp = s => (lang === 'en' ? STAMPS[s] ?? s : s);
    return { lang, t, tr, stamp };
  }, [lang]);
}
