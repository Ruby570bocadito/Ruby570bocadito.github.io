import { Component, useEffect, useRef, useState } from 'react';

export const asset = path => `${import.meta.env.BASE_URL}${path}`;

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false);

// [ref, visible]: si el elemento está en pantalla. Con once, se queda en true la primera vez que aparece.
export function useInView({ rootMargin = '0px 0px -10% 0px', threshold = 0, once = true } = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) io.disconnect();
        } else if (!once) setInView(false);
      },
      { rootMargin, threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin, threshold, once]);
  return [ref, inView];
}

// La sección que ocupa el centro de la pantalla.
export function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);
  const key = ids.join(',');
  useEffect(() => {
    const els = key.split(',').map(id => document.getElementById(id)).filter(Boolean);
    const io = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' }
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [key]);
  return active;
}

// Media query en el navegador; en el servidor (y en la hidratación) vale `initial`.
export function useMedia(query, initial = false) {
  const [match, setMatch] = useState(initial);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatch(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [query]);
  return match;
}

// Si una animación Rive falla, se queda su imagen fija en vez de tumbar la página entera.
class RiveBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

// Animación Rive de public/rive. El runtime se carga aparte y solo en el navegador, después de pintar la página;
// con "reducir movimiento" (o si Rive no carga) se queda el fallback estático.
export function RiveArt({ src, stateMachine, input, value, className = '', fallback = null, label }) {
  const [Player, setPlayer] = useState(null);
  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    let alive = true;
    import('./RivePlayer.jsx')
      .then(m => alive && setPlayer(() => m.default))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);
  return (
    <span className={`rive ${className}`} role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      {Player ? (
        <RiveBoundary fallback={fallback}>
          <Player src={src} stateMachine={stateMachine} input={input} value={value} />
        </RiveBoundary>
      ) : fallback}
    </span>
  );
}

export function SectionHead({ kicker, title, lead, center = false }) {
  return (
    <div className={`section-head${center ? ' center' : ''}`}>
      {kicker && <p className="kicker">{kicker}</p>}
      <h2>{title}</h2>
      {lead && <p className="lead">{lead}</p>}
    </div>
  );
}

const svg = { width: 22, height: 22, viewBox: '0 0 24 24', 'aria-hidden': true };

export const Icon = {
  arrow: p => (
    <svg {...svg} {...p} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
  ),
  external: p => (
    <svg {...svg} {...p} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" /></svg>
  ),
  send: p => (
    <svg {...svg} {...p} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>
  ),
  github: p => (
    <svg {...svg} {...p} fill="currentColor"><path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.7 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" /></svg>
  ),
  linkedin: p => (
    <svg {...svg} {...p} fill="currentColor"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" /></svg>
  ),
  mail: p => (
    <svg {...svg} {...p} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="3" /><path d="m22 7-10 6L2 7" /></svg>
  ),
  copy: p => (
    <svg {...svg} {...p} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="12" height="12" rx="2" /><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" /></svg>
  ),
  download: p => (
    <svg {...svg} {...p} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v12M7 10l5 5 5-5M5 21h14" /></svg>
  )
};
