import { createContext, forwardRef, useCallback, useContext, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { PERI_LINES, TIPS } from '../content.js';
import { useT } from '../i18n.jsx';
import { asset, prefersReducedMotion, useActiveSection } from './ui.jsx';

/* ------------------------------------------------------------------------------------------------------------------
   Peri en vivo, traída de la web de FriendlyPear (web/app/live-peri.tsx). En su ánimo "calm" es un rig (cuerpo, dos
   ojos y sus brillos): sus ojos siguen al cursor y parpadea. Con cualquier ánimo respira, se inclina hacia el cursor y
   salta con estrellas de arcilla al tocarla. Con "reducir movimiento" se queda quieta.
------------------------------------------------------------------------------------------------------------------ */

const RIG = {
  eyes: [
    { x: 0.3999, y: 0.4492, size: 0.0996, r: 0.0459, shine: { x: 0.019, y: -0.0181, w: 0.0234, h: 0.0225 } },
    { x: 0.6006, y: 0.4497, size: 0.0977, r: 0.0454, shine: { x: 0.019, y: -0.0171, w: 0.0225, h: 0.0234 } }
  ]
};
const EYE_TRAVEL = 0.26; // cuánto se mueve un ojo, en proporción a su radio
const SHINE_TRAVEL = 0.62;
const STARS = 7;
const pct = v => `${(v * 100).toFixed(3)}%`;
const peri = name => asset(`peri/${name}.webp`);

export const LivePeri = forwardRef(function LivePeri({ mood = 'calm', label, onTap, className = '' }, handle) {
  const root = useRef(null);
  const lean = useRef(null);
  const eyes = useRef([]);
  const shines = useRef([]);
  const face = useRef(null);
  const stars = useRef(null);
  const moodRef = useRef(mood);
  moodRef.current = mood;

  const burst = () => {
    const layer = stars.current;
    if (!layer || prefersReducedMotion()) return;
    layer.replaceChildren();
    for (let i = 0; i < STARS; i++) {
      const star = document.createElement('img');
      star.src = peri('star');
      star.alt = '';
      const angle = -Math.PI / 2 + (i / (STARS - 1) - 0.5) * Math.PI * 1.3;
      const reach = 300 + Math.random() * 220;
      star.style.setProperty('--dx', `${Math.cos(angle) * reach}%`);
      star.style.setProperty('--dy', `${Math.sin(angle) * reach}%`);
      star.style.setProperty('--spin', `${Math.round(Math.random() * 240 - 120)}deg`);
      star.style.animationDelay = `${i * 25}ms`;
      layer.append(star);
    }
  };
  const hop = () => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    el.classList.remove('peri-hop');
    void el.offsetWidth; // reinicia la animación
    el.classList.add('peri-hop');
  };
  useImperativeHandle(handle, () => ({ hop, celebrate: () => { hop(); burst(); } }));

  useEffect(() => {
    const el = root.current;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)');
    let target = { x: 0, y: 0 };
    let gaze = { x: 0, y: 0 };
    let frame = 0;
    let lastPointer = 0;
    let blinkTimer = 0;
    let glanceTimer = 0;
    let disposed = false;

    const render = () => {
      frame = 0;
      gaze = { x: gaze.x + (target.x - gaze.x) * 0.18, y: gaze.y + (target.y - gaze.y) * 0.18 };
      RIG.eyes.forEach((eye, i) => {
        const r = eye.r / eye.size;
        eyes.current[i]?.style.setProperty('translate', `${(gaze.x * EYE_TRAVEL * r * 100).toFixed(2)}% ${(gaze.y * EYE_TRAVEL * r * 100).toFixed(2)}%`);
        const shine = shines.current[i];
        if (shine) shine.style.translate = `${((gaze.x * SHINE_TRAVEL * eye.r) / eye.shine.w * 100).toFixed(1)}% ${((gaze.y * SHINE_TRAVEL * eye.r) / eye.shine.h * 100).toFixed(1)}%`;
      });
      if (!still.matches) lean.current?.style.setProperty('--lean', `${(gaze.x * 3).toFixed(2)}deg`);
      if (Math.abs(target.x - gaze.x) + Math.abs(target.y - gaze.y) > 0.002) frame = requestAnimationFrame(render);
    };
    const look = (x, y) => {
      target = { x, y };
      if (!frame) frame = requestAnimationFrame(render);
    };
    const onPointer = event => {
      if (event.pointerType === 'touch') return;
      lastPointer = performance.now();
      const box = el.getBoundingClientRect();
      if (!box.width || box.bottom < 0 || box.top > window.innerHeight) return;
      const cx = box.left + box.width * 0.5;
      const cy = box.top + box.height * RIG.eyes[0].y;
      const dx = event.clientX - cx;
      const dy = event.clientY - cy;
      const distance = Math.hypot(dx, dy) || 1;
      const pull = Math.min(1, distance / (box.width * 0.9));
      look((dx / distance) * pull, (dy / distance) * pull);
    };
    const blink = () => {
      if (disposed) return;
      el.classList.add('peri-blink');
      if (face.current && moodRef.current !== 'calm') face.current.src = peri(`${moodRef.current}_blink`);
      setTimeout(() => {
        el.classList.remove('peri-blink');
        if (face.current && moodRef.current !== 'calm') face.current.src = peri(moodRef.current);
        if (Math.random() < 0.2) setTimeout(() => { el.classList.add('peri-blink'); setTimeout(() => el.classList.remove('peri-blink'), 110); }, 180);
      }, 120);
      blinkTimer = window.setTimeout(blink, 2400 + Math.random() * 3600);
    };
    const glance = () => {
      if (disposed) return;
      // Sin cursor (un móvil, o un ratón quieto) mira alrededor por su cuenta.
      if (performance.now() - lastPointer > 2500) {
        const away = Math.random() < 0.35;
        look(away ? 0 : Math.random() * 1.6 - 0.8, away ? 0 : Math.random() * 0.8 - 0.3);
      }
      glanceTimer = window.setTimeout(glance, 1800 + Math.random() * 2600);
    };

    blinkTimer = window.setTimeout(blink, 1500);
    glanceTimer = window.setTimeout(glance, 2500);
    window.addEventListener('pointermove', onPointer, { passive: true });
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      clearTimeout(blinkTimer);
      clearTimeout(glanceTimer);
      window.removeEventListener('pointermove', onPointer);
    };
  }, []);

  useEffect(() => {
    if (face.current) face.current.src = peri(mood);
  }, [mood]);

  return (
    <button
      ref={root}
      type="button"
      className={`peri ${className}`}
      aria-label={label}
      onClick={() => { hop(); burst(); onTap?.(); }}
      onAnimationEnd={e => { if (e.animationName === 'peri-hop') root.current?.classList.remove('peri-hop'); }}
    >
      <span className="peri-shadow" aria-hidden="true" />
      <div ref={lean} className="peri-lean" aria-hidden="true">
        <div className="peri-breathe">
          <div className={`peri-rig${mood === 'calm' ? '' : ' peri-rig-hidden'}`}>
            <img className="peri-body" src={peri('body')} alt="" width="720" height="720" draggable={false} />
            {RIG.eyes.map((eye, i) => (
              <div key={i} className="peri-eye" style={{ left: pct(eye.x - eye.size / 2), top: pct(eye.y - eye.size / 2), width: pct(eye.size), height: pct(eye.size) }}>
                <div ref={n => { eyes.current[i] = n; }} className="peri-eye-ball">
                  <img src={peri(`eye-${i}`)} alt="" draggable={false} />
                  <img
                    ref={n => { shines.current[i] = n; }}
                    className="peri-shine"
                    src={peri(`shine-${i}`)}
                    alt=""
                    draggable={false}
                    style={{
                      left: pct(0.5 + (eye.shine.x - eye.shine.w / 2) / eye.size),
                      top: pct(0.5 + (eye.shine.y - eye.shine.h / 2) / eye.size),
                      width: pct(eye.shine.w / eye.size),
                      height: pct(eye.shine.h / eye.size)
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          {mood !== 'calm' && <img ref={face} className="peri-mood" src={peri(mood)} alt="" width="720" height="720" draggable={false} />}
        </div>
      </div>
      <div ref={stars} className="peri-stars" aria-hidden="true" />
    </button>
  );
});

/* -------------------------------- Estado compartido: en qué sección estás y si la zona roja está abierta -------- */

const SECTIONS = ['inicio', 'proyectos', 'logros', 'habilidades', 'certificaciones', 'biblioteca', 'sobre-mi', 'contacto'];
const PeriContext = createContext({ section: 'inicio', redOpen: false, setRedOpen: () => {} });

export function PeriProvider({ children }) {
  const section = useActiveSection(SECTIONS);
  const [redOpen, setRedOpen] = useState(false);
  const value = useMemo(() => ({ section, redOpen, setRedOpen }), [section, redOpen]);
  return <PeriContext.Provider value={value}>{children}</PeriContext.Provider>;
}

export const usePeri = () => useContext(PeriContext);

/* ------------------------------------------------------------------------------------------------------------------
   Peri con poses y animaciones de la app de FriendlyPear (public/peri/pose, 512×512). Una pose quieta, o una
   secuencia en bucle (idle), y de vez en cuando (every, en ms) una floritura: salto, ánimo o giro. Al tocarla también
   hace una. Con "reducir movimiento" se queda en su pose.
------------------------------------------------------------------------------------------------------------------ */

const SEQUENCES = {
  wave: { frames: ['wave1', 'wave2'], fps: 2.5 },
  dance: { frames: ['dance1', 'dance2', 'dance3', 'dance4'], fps: 4 },
  bow: { frames: ['bow1', 'bow2', 'bow2', 'bow1'], fps: 4 },
  // Más pausado: el salto entero dura algo más de un segundo, con un momento en lo alto.
  jump: { frames: ['jump_01', 'jump_02', 'jump_03', 'jump_04', 'jump_05', 'jump_05', 'jump_06', 'jump_07', 'jump_08', 'jump_09'], fps: 8 },
  cheer: { frames: ['cheer_01', 'cheer_02', 'cheer_03', 'cheer_04', 'cheer_03', 'cheer_02', 'cheer_01'], fps: 10 },
  spin: { frames: ['spin_01', 'spin_02', 'spin_03', 'spin_04', 'spin_01'], fps: 10 }
};
// Cuánto sube Peri en cada fotograma, en proporción a su altura (assets/peri/sprites/anim_offsets.json de FriendlyPear).
const LIFT = { jump_03: 0.073, jump_04: 0.153, jump_05: 0.198, jump_06: 0.177, cheer_02: 0.168, cheer_03: 0.218, spin_02: 0.135, spin_03: 0.16 };
const FLOURISHES = ['jump', 'cheer', 'spin'];
const poseSrc = name => asset(`peri/pose/${name}.webp`);
let flourishTurn = 0;
const nextFlourish = () => FLOURISHES[flourishTurn++ % FLOURISHES.length];

export const PeriSprite = forwardRef(function PeriSprite({ pose = 'wave1', idle = null, every = 0, label, className = '', onTap, decorative = false }, handle) {
  const [action, setAction] = useState(null);
  const [frame, setFrame] = useState(pose);
  const play = useCallback(name => {
    if (SEQUENCES[name] && !prefersReducedMotion()) setAction({ name, at: Date.now() });
  }, []);
  useImperativeHandle(handle, () => ({ play }), [play]);

  // Fotogramas: la acción en curso (una vez) o, sin acción, la secuencia de reposo en bucle; si no, la pose quieta.
  useEffect(() => {
    const seq = action ? SEQUENCES[action.name] : idle && !prefersReducedMotion() ? SEQUENCES[idle] : null;
    if (!seq) {
      setFrame(pose);
      return undefined;
    }
    let i = 0;
    setFrame(seq.frames[0]);
    const id = setInterval(() => {
      i += 1;
      if (i >= seq.frames.length) {
        if (action) {
          clearInterval(id);
          setAction(null);
          return;
        }
        i = 0;
      }
      setFrame(seq.frames[i]);
    }, 1000 / seq.fps);
    return () => clearInterval(id);
  }, [action, idle, pose]);

  useEffect(() => {
    if (!every || prefersReducedMotion()) return undefined;
    const id = setInterval(() => play(nextFlourish()), every);
    return () => clearInterval(id);
  }, [every, play]);

  // Precarga, para que no parpadee la primera vez que se mueve.
  useEffect(() => {
    const names = new Set([pose, ...(idle ? SEQUENCES[idle].frames : []), ...FLOURISHES.flatMap(n => SEQUENCES[n].frames)]);
    names.forEach(n => { new Image().src = poseSrc(n); });
  }, [pose, idle]);

  const lift = LIFT[frame] ?? 0;
  const body = (
    <>
      <span className="peri-sprite-shadow" aria-hidden="true" style={lift ? { transform: `scale(${(1 - lift * 1.6).toFixed(2)})`, opacity: 1 - lift * 2 } : undefined} />
      <img
        className="peri-sprite-img"
        src={poseSrc(frame)}
        alt=""
        width="512"
        height="512"
        draggable={false}
        style={lift ? { transform: `translateY(-${(lift * 100).toFixed(1)}%)` } : undefined}
      />
    </>
  );
  if (decorative) return <span className={`peri-sprite ${className}`} aria-hidden="true">{body}</span>;
  return (
    <button type="button" className={`peri-sprite ${className}`} aria-label={label} onClick={() => { play(nextFlourish()); onTap?.(); }}>
      {body}
    </button>
  );
});

/* -------------------------------- Peri de compañía: aparece al salir del hero y comenta cada sección ------------- */

export function PeriCompanion() {
  const { section, redOpen } = usePeri();
  const { t, tr } = useT();
  const [past, setPast] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [tip, setTip] = useState(null); // null: la frase de la sección; un número: el consejo que toca
  const next = useRef(0);
  const periRef = useRef(null);

  useEffect(() => {
    const hero = document.getElementById('inicio');
    if (!hero) return undefined;
    const io = new IntersectionObserver(([e]) => setPast(!e.isIntersecting), { threshold: 0.12 });
    io.observe(hero);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    try { setHidden(localStorage.getItem('peri-hidden') === '1'); } catch { /* sin almacenamiento */ }
  }, []);
  const key = redOpen && section === 'proyectos' ? 'red' : section;
  useEffect(() => {
    setTip(null);
    periRef.current?.play('jump'); // salta al cambiar de sección
  }, [key]);

  const { pose, idle, line } = PERI_LINES[key] ?? PERI_LINES.inicio;
  const tipping = tip !== null;
  const toggle = value => {
    setHidden(value);
    try { localStorage.setItem('peri-hidden', value ? '1' : '0'); } catch { /* sin almacenamiento */ }
  };

  return (
    <>
      <AnimatePresence>
        {past && !hidden && (
          <motion.aside
            className="companion"
            aria-label={t('peri.companion')}
            initial={{ y: 160, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 160, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            onAnimationComplete={() => periRef.current?.play('jump')}
          >
            <AnimatePresence mode="wait">
              <motion.p
                key={tipping ? `tip-${tip}` : key}
                className="bubble companion-bubble"
                aria-live="polite"
                initial={{ opacity: 0, y: 8, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.96 }}
                transition={{ duration: 0.22 }}
              >
                {tipping ? tr(TIPS[tip]) : tr(line)}
              </motion.p>
            </AnimatePresence>
            <PeriSprite
              ref={periRef}
              pose={tipping ? PERI_LINES.tip.pose : pose}
              idle={tipping ? null : idle}
              every={16000}
              className="companion-peri"
              label={t('peri.tap')}
              onTap={() => { setTip(next.current % TIPS.length); next.current += 1; }}
            />
            <button type="button" className="companion-close" onClick={() => toggle(true)} aria-label={t('peri.hide')}>×</button>
          </motion.aside>
        )}
      </AnimatePresence>
      {past && hidden && (
        <button type="button" className="companion-restore" onClick={() => toggle(false)} aria-label={t('peri.show')}>
          <img src={asset('img/peri-icon.png')} alt="" width="44" height="44" />
        </button>
      )}
    </>
  );
}
