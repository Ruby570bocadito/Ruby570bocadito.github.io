import SplitText from '../reactbits/SplitText.jsx';
import AnimatedContent from '../reactbits/AnimatedContent.jsx';
import Magnet from '../reactbits/Magnet.jsx';
import { Tx, useLang } from '../lang.jsx';

/* ---------- iconos (trazo 1.6, estilo lucide) ---------- */
const paths = {
  arrow: <><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></>,
  chevron: <path d="m9 6 6 6-6 6" />,
  download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="m7 10 5 5 5-5" /><path d="M12 15V3" /></>,
  copy: <><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></>,
  globe: <><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></>,
  target: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" /></>,
  wrench: <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />,
  sparkles: <><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z" /><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z" /></>,
  server: <><rect x="3" y="4" width="18" height="7" rx="1.5" /><rect x="3" y="13" width="18" height="7" rx="1.5" /><path d="M7 7.5h.01M7 16.5h.01" /></>,
  activity: <path d="M22 12h-4l-3 9L9 3l-3 9H2" />,
  layers: <><path d="m12 2 10 5-10 5L2 7z" /><path d="m2 17 10 5 10-5" /><path d="m2 12 10 5 10-5" /></>,
  gauge: <><path d="M12 14l4-4" /><path d="M3.34 19a10 10 0 1 1 17.32 0" /></>,
  clock: <><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></>,
  plus: <><path d="M12 5v14" /><path d="M5 12h14" /></>
};

export function Icon({ name, size = 16, stroke = 1.6, ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...rest}>
      {paths[name]}
    </svg>
  );
}

export const GitHubIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.27-.01-1.17-.02-2.12-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.72-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.76.11 3.05.73.81 1.18 1.83 1.18 3.09 0 4.41-2.69 5.38-5.25 5.67.41.35.77 1.05.77 2.12 0 1.53-.01 2.76-.01 3.14 0 .31.21.67.8.56A10.52 10.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" /></svg>
);

export const LinkedInIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.55V9h3.57v11.45z" /></svg>
);

export const Shield = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <path d="M16 2.5 L27.5 7 V16 C27.5 23.5 22.5 28.5 16 30 C9.5 28.5 4.5 23.5 4.5 16 V7 Z" stroke="#8fc573" strokeWidth="2.4" strokeLinejoin="round" />
    <path d="M11 16.2 L14.6 19.8 L21.5 12.5" stroke="#8fc573" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ---------- tipografía animada ---------- */

/** Título a dos tonos (estilo Strand): el texto base en gris, el <em> en blanco. Aparece palabra a palabra (React Bits · SplitText). */
export function Heading({ k, as = 'h2', className = '' }) {
  const { t, lang } = useLang();
  const html = t(k);
  return (
    <SplitText key={`${lang}:${k}`} text={html} tag={as} className={`heading ${className}`} splitType="words"
      effect="blur" delay={38} duration={0.9} textAlign="inherit" threshold={0.15} rootMargin="-40px">
      <span dangerouslySetInnerHTML={{ __html: html }} />
    </SplitText>
  );
}

/** Aparición al hacer scroll (React Bits · AnimatedContent). */
export const Reveal = ({ children, delay = 0, distance = 28, className = '', ...rest }) => (
  <AnimatedContent distance={distance} duration={0.9} ease="power3.out" blur={6} delay={delay} threshold={0.12}
    className={className} {...rest}>
    {children}
  </AnimatedContent>
);

/** Etiqueta de sección "01 — About" con el punto verde. */
export const Label = ({ k, className = '' }) => (
  <p className={`label ${className}`}><i aria-hidden="true" /><Tx v={k} /></p>
);

export function SectionHead({ label, title, sub, center = false, children }) {
  return (
    <div className={`sec-head${center ? ' center' : ''}`}>
      <Reveal distance={16}><Label k={label} /></Reveal>
      <Heading k={title} />
      {sub && <Reveal delay={0.1}><Tx v={sub} as="p" className="sec-sub" /></Reveal>}
      {children}
    </div>
  );
}

export const Chip = ({ c }) => <Tx v={c} className={`chip${c.hot ? ' hot' : ''}`} />;

/** Botón principal con efecto imán (React Bits · Magnet). */
export const MagnetButton = ({ children, ...rest }) => (
  <Magnet padding={70} magnetStrength={5} maxOffset={10} wrapperClassName="magnet">
    <a className="btn btn-w" {...rest}>{children}</a>
  </Magnet>
);

/** Enlace "Explore more ›" de Strand: texto + círculo con flecha. */
export const ArrowLink = ({ children, ...rest }) => (
  <a className="arrow-link" {...rest}>
    <span>{children}</span>
    <i aria-hidden="true"><Icon name="chevron" size={12} stroke={2.2} /></i>
  </a>
);
