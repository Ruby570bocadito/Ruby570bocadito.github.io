import { Fragment, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import AnimatedContent from '../reactbits/AnimatedContent.jsx';
import BlurText from '../reactbits/BlurText.jsx';
import CountUp from '../reactbits/CountUp.jsx';
import DecryptedText from '../reactbits/DecryptedText.jsx';
import GlareHover from '../reactbits/GlareHover.jsx';
import Magnet from '../reactbits/Magnet.jsx';
import ScrollVelocity from '../reactbits/ScrollVelocity.jsx';
import SpotlightCard from '../reactbits/SpotlightCard.jsx';
import TiltedCard from '../reactbits/TiltedCard.jsx';
import { ABOUT, AVATAR, AVATAR_SIGN, CERTS, EVENTS, FEATURED, MARQUEE_TECH, MARQUEE_WORDS, MORE, PROJECTS, RED, SKILLS, UDEMY } from '../content.js';
import { useT } from '../i18n.jsx';
import { PeriSprite, usePeri } from './Peri.jsx';
import { Icon, RiveArt, SectionHead, asset, useInView, useMedia } from './ui.jsx';

const card = (extra = {}) => ({ '--spotlight-card-surface': 'var(--card)', '--spotlight-card-border': 'rgba(78, 94, 128, 0.12)', ...extra });
const keyOf = v => (typeof v === 'string' ? v : v.es);
function Chips({ items }) {
  const { tr } = useT();
  return <div className="chips">{items.map(c => <span key={keyOf(c)}>{tr(c)}</span>)}</div>;
}

/* ---------------------------------------------------------------- FriendlyPear ---------------------------------- */

// Peri revisando un mensaje con la animación Rive "scan" de FriendlyPear: mira, encuentra una trampa, mira, todo bien.
const SCAN_STEPS = [
  { state: 1, text: 'scan.sms', ms: 1700 },
  { state: 4, text: 'scan.trap', ms: 2200 },
  { state: 1, text: 'scan.wa', ms: 1700 },
  { state: 2, text: 'scan.ok', ms: 2000 }
];

function ScanDemo() {
  const { t } = useT();
  const [step, setStep] = useState(0);
  const [ref, visible] = useInView({ once: false });
  useEffect(() => {
    if (!visible) return undefined;
    const t = setTimeout(() => setStep(s => (s + 1) % SCAN_STEPS.length), SCAN_STEPS[step].ms);
    return () => clearTimeout(t);
  }, [step, visible]);
  const now = SCAN_STEPS[step];
  return (
    <div className={`scan scan-${now.state}`} ref={ref}>
      <RiveArt src="scan.riv" stateMachine="Scan" input="state" value={now.state} className="scan-rive" fallback={<span className="scan-still">🔍</span>} />
      <AnimatePresence mode="wait">
        <motion.span key={step} className="scan-text" initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -6 }} transition={{ duration: 0.2 }}>
          {t(now.text)}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

export function Featured() {
  const { t, tr } = useT();
  const small = useMedia('(max-width: 900px)');
  return (
    <div className="wrap">
      <SectionHead kicker={t('featured.kicker')} title={t('featured.title')} />
      <AnimatedContent distance={60} duration={0.9}>
        <SpotlightCard theme="light" className="featured" style={card()} spotlightColor="#7CC242" intensity={0.5} spotlightSize={420}>
          <div className="featured-art">
            <TiltedCard
              imageSrc={asset('img/fp-banner.webp')}
              altText={t('featured.alt')}
              containerWidth="100%"
              containerHeight={small ? '240px' : '380px'}
              imageWidth="100%"
              imageHeight={small ? '240px' : '380px'}
              rotateAmplitude={8}
              scaleOnHover={1.02}
              showTooltip={false}
              radius={18}
              glare={0.4}
              shadow={0.3}
              flipOnClick={false}
            />
            <ScanDemo />
          </div>
          <div className="featured-copy">
            <p className="kicker kicker-green">
              <DecryptedText text={FEATURED.kicker} animateOn="view" sequential revealDirection="start" speed={28} />
            </p>
            <h3 className="featured-title">
              <img src={asset('img/peri-icon.png')} alt="" width="52" height="52" /> {FEATURED.name}
            </h3>
            <p className="featured-text">{tr(FEATURED.text)}</p>
            <ul className="stats">
              {FEATURED.stats.map(s => (
                <li key={s.to}>
                  <span className="stat-num"><CountUp to={s.to} duration={2} />{s.suffix}</span>
                  <span className="stat-label">{tr(s.label)}</span>
                </li>
              ))}
            </ul>
            <Chips items={FEATURED.chips} />
            <div className="links">
              {FEATURED.links.map(l => (
                <a key={l.href} className="link-arrow" href={l.href} target="_blank" rel="noreferrer">{tr(l.label)} <Icon.external width={16} height={16} /></a>
              ))}
            </div>
          </div>
        </SpotlightCard>
      </AnimatedContent>
    </div>
  );
}

/* ---------------------------------------------------------------- Proyectos ------------------------------------- */

// Las fichas de la etapa Red Team solo tienen texto en español: en inglés se ve el nombre y su línea de datos.
function MiniCard({ p, red = false }) {
  const { tr, lang } = useT();
  const text = red && lang !== 'es' ? '' : tr(p.text);
  return (
    <SpotlightCard theme="light" className={`mini${red ? ' mini-red' : ''}`} style={card(red ? { '--spotlight-card-surface': '#FFF4EF' } : {})} spotlightColor={red ? '#E8735A' : '#4E5E80'} intensity={0.35}>
      <a href={p.url} target="_blank" rel="noreferrer" className="mini-link">
        <span className="mini-emoji" aria-hidden="true">{p.logo ? <img src={asset(p.logo)} alt="" width="30" height="30" /> : p.emoji}</span>
        <h4>{p.name}</h4>
        {text && <p>{text}</p>}
        <small>{tr(p.meta)}</small>
      </a>
    </SpotlightCard>
  );
}

export function Projects() {
  const { t, tr } = useT();
  const { redOpen, setRedOpen } = usePeri();
  return (
    <div className="wrap">
      <SectionHead kicker={t('projects.kicker')} title={t('projects.title')} lead={t('projects.lead')} />
      <div className="work">
        {PROJECTS.map((p, i) => (
          <AnimatedContent key={p.name} distance={70} duration={0.9}>
            <SpotlightCard theme="light" className={`wcard${i % 2 ? ' wcard-flip' : ''}`} style={card()} spotlightColor="#4E5E80" intensity={0.3} spotlightSize={380}>
              <div className="wcard-copy">
                <span className={`wcard-emoji${p.logo ? ' has-logo' : ''}`} aria-hidden="true">
                  {p.logo ? <img src={asset(p.logo)} alt="" width="40" height="40" /> : p.emoji}
                </span>
                <h3>{p.name}</h3>
                <p className="wcard-tagline">{tr(p.tagline)}</p>
                <p className="wcard-text">{tr(p.text)}</p>
                <div className="wcard-metric">
                  <span className="stat-num"><CountUp to={p.metric.to} duration={1.8} />{p.metric.suffix}</span>
                  <span className="stat-label">{tr(p.metric.label)}</span>
                </div>
                <Chips items={p.chips} />
                <a className="link-arrow" href={p.url} target="_blank" rel="noreferrer">{t('projects.github')} <Icon.arrow width={18} height={18} /></a>
              </div>
              <a className="wcard-shot" href={p.url} target="_blank" rel="noreferrer" aria-label={t('projects.open', { name: p.name })}>
                <div className="frame">
                  <div className="frame-bar"><i /><i /><i /><span>{tr(p.bar)}</span></div>
                  <img src={asset(`img/${p.img}`)} alt={t('projects.shot', { name: p.name })} width={p.w} height={p.h} loading="lazy" />
                </div>
              </a>
            </SpotlightCard>
          </AnimatedContent>
        ))}
      </div>

      <h3 className="subhead">{t('projects.more')}</h3>
      <div className="grid">
        {MORE.map((p, i) => (
          <AnimatedContent key={p.name} distance={40} delay={i * 0.08} duration={0.7}>
            <MiniCard p={p} />
          </AnimatedContent>
        ))}
      </div>

      <div className={`red${redOpen ? ' red-open' : ''}`}>
        <button type="button" className="red-toggle" aria-expanded={redOpen} aria-controls="red-panel" onClick={() => setRedOpen(o => !o)}>
          <span className="red-icon" aria-hidden="true">🔴</span>
          <span className="red-label">
            <b>{t('red.title')}</b>
            <small>{t('red.sub', { n: RED.length })}</small>
          </span>
          <motion.span className="red-plus" aria-hidden="true" animate={{ rotate: redOpen ? 45 : 0 }}>+</motion.span>
        </button>
        <AnimatePresence initial={false}>
          {redOpen && (
            <motion.div
              id="red-panel"
              className="red-panel"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="lead">{t('red.lead')}</p>
              <div className="grid">
                {RED.map((p, i) => (
                  <motion.div key={p.name} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i, duration: 0.4 }}>
                    <MiniCard p={p} red />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <p className="to-library"><a className="link-arrow" href="#biblioteca">{t('projects.toLibrary')} <Icon.arrow width={18} height={18} /></a></p>
    </div>
  );
}

/* ---------------------------------------------------------------- Franja animada -------------------------------- */

// Arriba, en serif grande con subrayado de rotulador; abajo, las tecnologías como etiquetas.
const MARQUEE_ROWS = [
  <span className="mq-row" key="words">
    {MARQUEE_WORDS.map(w => (
      <Fragment key={w}>
        <span className="mq-word">{w}</span>
        <span className="mq-sep">✦</span>
      </Fragment>
    ))}
  </span>,
  <span className="mq-row" key="tech">
    {MARQUEE_TECH.map(t => <span key={t} className="mq-pill">{t}</span>)}
  </span>
];

export function Marquee() {
  return (
    <div className="marquee" aria-hidden="true">
      <ScrollVelocity texts={MARQUEE_ROWS} velocity={40} numCopies={4} className="marquee-text" />
    </div>
  );
}

/* ---------------------------------------------------------------- Logros y eventos ------------------------------ */

const DAY = 864e5;
function status(e, now, t, tr) {
  if (!e.start) return { kind: 'win', label: tr(e.badge) };
  if (!now) return { kind: 'date', label: tr(e.when) };
  const start = new Date(`${e.start}T00:00:00`);
  const end = new Date(`${e.end}T23:59:59`);
  if (now > end) return { kind: 'done', label: t('status.done') };
  if (now >= start) return { kind: 'live', label: t('status.live') };
  const days = Math.ceil((start - now) / DAY);
  return { kind: 'soon', label: days === 1 ? t('status.tomorrow') : t('status.days', { n: days }) };
}

function EventCard({ e, now, i }) {
  const { t, tr } = useT();
  // El confeti de Rive solo sale al pasar el ratón (o tocar) y se va solo: nada brillando todo el rato.
  const [burst, setBurst] = useState(0);
  const timer = useRef(0);
  const celebrate = () => {
    if (!e.burst) return;
    setBurst(b => b + 1);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setBurst(0), 1900);
  };
  useEffect(() => () => clearTimeout(timer.current), []);
  const s = status(e, now, t, tr);
  return (
    <li className={`event event-${s.kind}`} style={{ '--i': i }}>
      <span className="event-dot" aria-hidden="true">
        {s.kind === 'soon' || s.kind === 'live'
          ? <RiveArt src="pulse.riv" stateMachine="Pulse" input="on" value={1} className="event-pulse" fallback={<span className="dot" />} />
          : <span className="dot" />}
      </span>
      <div className="event-card" onPointerEnter={celebrate} onClick={celebrate}>
        <div className="event-icon">
          {burst > 0 && <RiveArt key={burst} src="burst.riv" stateMachine="Burst" className="event-burst" />}
          <span aria-hidden="true">{e.icon}</span>
        </div>
        <p className="event-type">{tr(e.type)} · {tr(e.when)}</p>
        <h3>{e.url ? <a href={e.url} target="_blank" rel="noreferrer">{e.title}</a> : e.title}</h3>
        <p>{tr(e.text)}</p>
        <span className={`event-status status-${s.kind}`}>{s.label}</span>
      </div>
    </li>
  );
}

export function Events() {
  const { t } = useT();
  const [now, setNow] = useState(null);
  useEffect(() => setNow(new Date()), []);
  return (
    <section className="section" id="logros">
      <div className="wrap">
        <SectionHead center kicker={t('events.kicker')} title={t('events.title')} lead={t('events.lead')} />
        <AnimatedContent distance={50} duration={0.8}>
          <ol className="timeline">
            {EVENTS.map((e, i) => <EventCard key={e.title} e={e} now={now} i={i} />)}
          </ol>
        </AnimatedContent>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- Habilidades ----------------------------------- */

export function Skills() {
  const { t, tr } = useT();
  const { redOpen } = usePeri();
  const [safe, setSafe] = useState(false);
  const [ref, inView] = useInView();
  return (
    <section className="section section-alt" id="habilidades">
      <div className="wrap" ref={ref}>
        <SectionHead kicker={t('skills.kicker')} title={t('skills.title')} lead={t('skills.lead')} />
        <div className={`bento${inView ? ' is-in' : ''}`}>
          {SKILLS.map((s, i) => (
            <div key={s.id} className={`bento-item bento-${s.id}`}>
              <AnimatedContent distance={40} delay={i * 0.07} duration={0.7}>
                <SpotlightCard
                  theme="light"
                  className={`skill skill-${s.id}`}
                  style={card(s.id === 'red' ? { '--spotlight-card-surface': '#FFF4EF' } : {})}
                  spotlightColor={s.id === 'red' ? '#E8735A' : '#4E5E80'}
                  intensity={0.3}
                  onPointerEnter={s.id === 'blue' ? () => setSafe(true) : undefined}
                  onPointerLeave={s.id === 'blue' ? () => setSafe(false) : undefined}
                >
                  <div className="skill-head">
                    {s.id === 'blue'
                      ? <RiveArt src="shield.riv" stateMachine="Shield" input="level" value={redOpen ? 1 : safe ? 2 : 0} className="skill-shield" fallback={<span className="skill-icon">{s.icon}</span>} />
                      : <span className="skill-icon" aria-hidden="true">{s.icon}</span>}
                    <div>
                      <h3>{tr(s.title)}</h3>
                      <p className="skill-note">{tr(s.note)}</p>
                    </div>
                  </div>
                  <div className="chips chips-stagger">
                    {s.chips.map((c, j) => <span key={keyOf(c)} style={{ '--j': j }}>{tr(c)}</span>)}
                  </div>
                </SpotlightCard>
              </AnimatedContent>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- Certificaciones ------------------------------- */

export function Certs() {
  const { t, tr } = useT();
  const [open, setOpen] = useState(false);
  return (
    <section className="section" id="certificaciones">
      <div className="wrap">
        <SectionHead kicker={t('certs.kicker')} title={t('certs.title')} lead={t('certs.lead')} />
        <div className="certs">
          {CERTS.map((c, i) => (
            <AnimatedContent key={keyOf(c.org)} distance={40} delay={i * 0.06} duration={0.7}>
              <GlareHover className={`cert${c.star ? ' cert-star' : ''}`} width="100%" height="100%" background={c.star ? '#4E5E80' : 'var(--card)'} borderRadius="20px" borderColor={c.star ? 'transparent' : 'rgba(78,94,128,.12)'} glareColor="#ffffff" glareOpacity={c.star ? 0.35 : 0.7} blendMode={c.star ? 'screen' : 'normal'}>
                <div className="cert-inner">
                  <div className="cert-top">
                    <p className="cert-org">{tr(c.org)}</p>
                    {c.star && <RiveArt src="glint.riv" stateMachine="Glint" className="cert-seal" fallback={<span>🏅</span>} />}
                  </div>
                  {c.title && <h3>{tr(c.title)}</h3>}
                  {c.items && <ul>{c.items.map(x => <li key={keyOf(x)}>{tr(x)}</li>)}</ul>}
                  {c.state && <span className="cert-state">{tr(c.state)}</span>}
                </div>
              </GlareHover>
            </AnimatedContent>
          ))}
        </div>
        <div className={`udemy${open ? ' udemy-open' : ''}`}>
          <button type="button" className="udemy-toggle" aria-expanded={open} aria-controls="udemy-list" onClick={() => setOpen(o => !o)}>
            <span>📚 <b>{t('certs.udemy', { n: UDEMY.length })}</b></span>
            <motion.span className="red-plus" aria-hidden="true" animate={{ rotate: open ? 45 : 0 }}>+</motion.span>
          </button>
          <AnimatePresence initial={false}>
            {open && (
              <motion.ul id="udemy-list" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
                {UDEMY.map(u => <li key={u}>{u}</li>)}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
        <p className="to-library"><a className="link-arrow" href="#biblioteca">{t('certs.toLibrary')} <Icon.arrow width={18} height={18} /></a></p>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- Sobre mí -------------------------------------- */

export function About() {
  const { t, tr, lang } = useT();
  return (
    <section className="section section-alt about" id="sobre-mi">
      <div className="wrap about-grid">
        <div className="about-copy">
          <SectionHead kicker={t('about.kicker')} title={t('about.title')} />
          {ABOUT.paragraphs.map((p, i) => <p key={i}>{tr(p)}</p>)}
          <blockquote className="quote">
            <BlurText key={lang} text={tr(ABOUT.quote)} animateBy="words" delay={60} direction="bottom" className="quote-text" />
          </blockquote>
          <dl className="facts">
            {ABOUT.facts.map(f => <div key={keyOf(f.k)}><dt>{tr(f.k)}</dt><dd>{tr(f.v)}</dd></div>)}
          </dl>
          <Magnet padding={50} magnetStrength={3.5}>
            <a className="btn btn-ghost" href="#contacto">{t('about.contact')}</a>
          </Magnet>
        </div>
        <AnimatedContent distance={60} direction="horizontal" duration={0.9}>
          <div className="polaroid">
            <div className={`polaroid-photo${AVATAR_SIGN ? ' has-avatar' : ''}`}>
              {AVATAR_SIGN
                ? <img src={asset(AVATAR_SIGN)} alt={t('badge.avatar')} width="800" height="1200" loading="lazy" />
                : <>
                    {AVATAR ? <img src={asset(AVATAR)} alt={t('badge.avatar')} /> : <span className="badge-mono" aria-hidden="true">RG</span>}
                    <span className="sign">BLUE TEAM</span>
                  </>}
            </div>
            <p className="polaroid-caption">Málaga · 2026</p>
            <PeriSprite decorative idle="dance" pose="dance1" className="polaroid-peri" />
          </div>
        </AnimatedContent>
      </div>
    </section>
  );
}
