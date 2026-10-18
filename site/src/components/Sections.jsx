import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import SpotlightCard from '../reactbits/SpotlightCard.jsx';
import CountUp from '../reactbits/CountUp.jsx';
import ScrollReveal from '../reactbits/ScrollReveal.jsx';
import LogoLoop from '../reactbits/LogoLoop.jsx';
import GlareHover from '../reactbits/GlareHover.jsx';
import { plain, Tx, useHtml, useLang } from '../lang.jsx';
import content from '../content.json';
import { ArrowLink, Chip, Heading, Icon, Label, Reveal, SectionHead } from './ui.jsx';

const Spot = ({ className = '', children, ...rest }) => (
  <SpotlightCard className={`card ${className}`} spotlightColor="#f5f5f4" intensity={0.09} spotlightSize={320}
    borderGlow={0.5} {...rest}>
    {children}
  </SpotlightCard>
);

/* ---------- marquesina de tecnologías (React Bits · LogoLoop) ---------- */
export function Marquee() {
  const logos = content.marquee.map(name => ({ node: <span className="mq-item"><i />{name}</span>, title: name }));
  return (
    <div className="mq" aria-hidden="true">
      <div className="frame">
        <LogoLoop logos={logos} speed={42} gap={56} logoHeight={22} pauseOnHover fadeOut fadeOutWidth={0.14}
          draggable={false} intro={false} ariaLabel="Stack" />
      </div>
    </div>
  );
}

/* ---------- 01 About ---------- */
export function About() {
  return (
    <section id="about">
      <div className="frame">
        <SectionHead label="sec.about" title="about.h2" />
        <div className="about-grid">
          <Reveal className="about-copy" stagger={0.08}>
            {['about.p1', 'about.p2', 'about.p3', 'about.p4'].map(k => <Tx key={k} v={k} as="p" />)}
          </Reveal>
          <Reveal className="facts" stagger={0.06} distance={18}>
            {content.facts.map((f, i) => (
              <div className="fact" key={i}><Tx v={f.label} /><Tx v={f.value} as="b" /></div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------- 02 What I do ---------- */
const WHAT_ICONS = ['target', 'wrench', 'sparkles', 'server'];
export function WhatIDo() {
  return (
    <section id="focus">
      <div className="frame">
        <SectionHead label="sec.what" title="what.h2" />
        <Reveal className="cards4" stagger={0.08}>
          {content.what.map((c, i) => (
            <Spot key={i} className="wcard">
              <span className="ico"><Icon name={WHAT_ICONS[i]} size={18} /></span>
              <Tx v={c.h} as="h3" />
              <Tx v={c.p} as="p" />
              <div className="chips">{c.chips.map((ch, j) => <Chip key={j} c={ch} />)}</div>
            </Spot>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- cifras (React Bits · CountUp) ---------- */
const STAT_ICONS = ['layers', 'target', 'activity', 'clock'];
export function Stats() {
  const { locale } = useLang();
  return (
    <div className="band">
      <div className="frame">
        <Reveal className="stats" stagger={0.08}>
          {content.stats.map((s, i) => {
            const group = new Intl.NumberFormat(locale).formatToParts(s.to).find(p => p.type === 'group');
            return (
              <div className="stat" key={i}>
                <span className="ico"><Icon name={STAT_ICONS[i]} size={18} /></span>
                <b><CountUp key={locale} to={s.to} duration={1.6} separator={group ? group.value : ''} />{s.suffix}</b>
                <Tx v={s.label} />
              </div>
            );
          })}
        </Reveal>
      </div>
    </div>
  );
}

/* ---------- 03 Proyectos destacados (bloques tipo Cortex / Ask / Pulse) ---------- */
const METRIC_ICONS = ['activity', 'layers', 'gauge'];
function Project({ p, index }) {
  const html = useHtml();
  return (
    <article className="proj">
      <Reveal className="p-info" distance={24}>
        <span className="p-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
        <span className={`p-badge${p.done ? ' done' : ''}`}><i /><Tx v={p.badge} /></span>
        <h3>{p.name}</h3>
        <Tx v={p.role} as="p" className="p-role" />
        <Tx v={p.desc} as="p" className="p-desc" />
        <div className="p-metrics">
          {p.metrics.map((m, i) => (
            <div className="p-m" key={i}>
              <Icon name={METRIC_ICONS[i]} size={15} />
              <b>{m.v}</b>
              <Tx v={m.label} />
            </div>
          ))}
        </div>
        <p className="p-stack">{p.stack}</p>
        <ArrowLink href={p.href} target="_blank" rel="noreferrer">{plain(html(p.view))}</ArrowLink>
      </Reveal>
      <Reveal className="p-visual" delay={0.1} distance={36}>
        <GlareHover background="transparent" borderRadius="14px" borderColor="transparent" glareColor="#ffffff"
          glareOpacity={0.12} glareSize={60} transitionDuration={900} className="p-shot">
          <div className="shot-bar"><i /><i /><i /><Tx v={p.shot} /><Tx v={p.hover} as="em" /></div>
          <div className="shot-body">
            <img className="png" src={p.png} alt={p.alt} loading="lazy" />
            <img className="gif" src={p.gif} alt="" aria-hidden="true" loading="lazy" />
          </div>
        </GlareHover>
      </Reveal>
    </article>
  );
}

export function Projects() {
  return (
    <section id="projects">
      <div className="frame">
        <SectionHead label="sec.feat" title="proj.h2" sub="proj.sub" />
        <div className="projs">
          {content.projects.map((p, i) => <Project key={p.name} p={p} index={i} />)}
        </div>

        <div className="more-head">
          <Reveal distance={16}><Label k="sec.more" /></Reveal>
          <Heading k="more.h2" as="h2" className="h2-sm" />
        </div>
        <Reveal className="more" stagger={0.05} distance={20}>
          {content.more.map(m => (
            <a key={m.href} className="more-link" href={m.href} target="_blank" rel="noreferrer">
              <Spot className="mcard">
                <div className="m-top"><h4>{m.name}</h4><span className="m-lang">{m.lang}</span></div>
                <Tx v={m.p} as="p" />
                <div className="m-foot"><Tx v={m.star} className="m-star" /><Icon name="arrow" size={13} /></div>
              </Spot>
            </a>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- 05 Cómo aprendo (React Bits · ScrollReveal) ---------- */
export function Learn() {
  const { t, lang } = useLang();
  return (
    <section id="learn">
      <div className="frame">
        <div className="learn">
          <Reveal distance={16}><Label k="sec.learn" /></Reveal>
          <Heading k="learn.q" as="p" className="quote" />
          <div className="learn-body">
            {['learn.a', 'learn.b'].map(k => (
              <ScrollReveal key={`${lang}:${k}`} as="p" baseOpacity={0.14} enableBlur blurStrength={3} baseRotation={0}
                stagger={0.04} containerClassName="sr" textClassName="sr-text" wordAnimationEnd="bottom 55%">
                {plain(t(k))}
              </ScrollReveal>
            ))}
            <Reveal><Tx v="learn.g" as="p" className="learn-g" /></Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- 06 Habilidades ---------- */
export function Skills() {
  return (
    <section id="skills">
      <div className="frame">
        <SectionHead label="sec.skills" title="skills.h2" />
        <div className="srows">
          {content.skills.map((r, i) => (
            <Reveal className="srow" key={i} distance={16}>
              <div className="sl"><Tx v={r.label} as="b" /><Tx v={r.sub} /></div>
              <div className="chips">{r.chips.map((c, j) => <Chip key={j} c={c} />)}</div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- 07 Certificaciones ---------- */
export function Certs() {
  return (
    <section id="certs">
      <div className="frame">
        <SectionHead label="sec.certs" title="certs.h2" />
        <Reveal className="certs" stagger={0.07}>
          {content.certs.map((c, i) => (
            <Spot key={i} className={`ccard${c.prep ? ' prep' : ''}`}>
              <div className="c-top"><Tx v={c.title} as="h4" /><Tx v={c.tag} className="c-tag" /></div>
              <Tx v={c.org} as="p" className="c-org" />
              <Tx v={c.p} as="p" className="c-p" />
            </Spot>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- 08 Laboratorios ---------- */
export function Labs() {
  return (
    <section id="labs">
      <div className="frame">
        <SectionHead label="sec.labs" title="labs.h2" />
        <Reveal className="labs" stagger={0.08}>
          {content.labs.map((l, i) => (
            <div className="lcard" key={i}>
              <span className="n" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
              <Tx v={l.h} as="h4" />
              <Tx v={l.p} as="p" />
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- 09 Logros ---------- */
export function Achievement() {
  const a = content.achievement;
  return (
    <section id="achievements">
      <div className="frame">
        <SectionHead label="sec.ach" title="ach.h2" />
        <Reveal distance={30}>
          <Spot className="ach">
            <div className="ach-num">{a.num}<small>{a.small}</small></div>
            <div>
              <Tx v={a.h} as="h3" />
              <Tx v={a.p} as="p" />
              <div className="chips">{a.tags.map((tg, i) => <Tx key={i} v={tg} className="chip" />)}</div>
            </div>
          </Spot>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- 10 Formación ---------- */
export function Education() {
  return (
    <section id="education">
      <div className="frame">
        <SectionHead label="sec.edu" title="edu.h2" />
        <div className="edu">
          {content.education.map((e, i) => (
            <Reveal className="edu-item" key={i} distance={16}>
              <Tx v={e.when} className="e-when" />
              <div>
                <Tx v={e.title} as="h4" />
                <Tx v={e.org} as="p" className="e-org" />
                <Tx v={e.p} as="p" />
              </div>
              <Tx v={e.tag} className="c-tag" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- 11 Ahora (acordeón tipo FAQ de Strand) ---------- */
function AccItem({ it, open, onToggle, id }) {
  return (
    <div className={`acc-item${open ? ' open' : ''}`}>
      <button type="button" className="acc-q" aria-expanded={open} aria-controls={id} onClick={onToggle}>
        <Tx v={it.s} />
        <span className="pm" aria-hidden="true"><Icon name="plus" size={14} stroke={1.8} /></span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div id={id} className="acc-a" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}>
            <Tx v={it.b} as="p" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Now() {
  const [open, setOpen] = useState(-1);
  return (
    <section id="focus-now">
      <div className="frame now-grid">
        <div className="now-head">
          <Reveal distance={16}><Label k="sec.now" /></Reveal>
          <Heading k="now.h2" />
          <Reveal><Tx v="upd" as="p" className="upd" /></Reveal>
        </div>
        <Reveal className="acc" stagger={0.06} distance={14}>
          {content.now.map((it, i) => (
            <AccItem key={i} it={it} id={`acc-${i}`} open={open === i} onToggle={() => setOpen(open === i ? -1 : i)} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
