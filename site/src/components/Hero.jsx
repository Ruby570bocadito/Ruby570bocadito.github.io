import { useEffect, useRef, useState } from 'react';
import Threads from '../reactbits/Threads.jsx';
import DecryptedText from '../reactbits/DecryptedText.jsx';
import ShinyText from '../reactbits/ShinyText.jsx';
import { lines, Tx, useLang } from '../lang.jsx';
import content from '../content.json';
import { Icon, MagnetButton, Reveal } from './ui.jsx';

const DECODE_CHARS = '!<>-_\\/[]{}=+*^?#01';
const strip = s => s.replace(/^ +/, '');

/** Hora de Málaga, igual que el sitio original (en-GB, Europe/Madrid). */
export function useClock(withSeconds) {
  const [now, setNow] = useState(null);
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/Madrid', hour: '2-digit', minute: '2-digit',
      ...(withSeconds ? { second: '2-digit' } : {}), hour12: false, timeZoneName: 'short'
    });
    const tick = () => {
      try { setNow(fmt.format(new Date())); } catch (e) {}
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [withSeconds]);
  return now;
}

/** Secuencia del terminal (mismos comandos y salidas que el original). */
function useTerminal() {
  const { t, lang } = useLang();
  const seq = [
    { cmd: 'whoami', out: strip(t('term.whoami_out')), cls: 't-o' },
    { cmd: 'cat focus.txt', out: strip(t('term.focus_out')), cls: 't-o' },
    { cmd: './status --hiring', out: strip(t('term.status_out')), cls: 't-ok' },
    { cmd: 'ls projects/', out: strip(t('term.ls_out')), cls: 't-p' }
  ];
  const full = seq.flatMap(s => [{ cmd: s.cmd }, { out: s.out, cls: s.cls }]).concat({ cmd: '', cursor: true });
  const [rows, setRows] = useState(full);
  const seqRef = useRef(seq);
  seqRef.current = seq;

  useEffect(() => {
    const steps = seqRef.current;
    const final = steps.flatMap(s => [{ cmd: s.cmd }, { out: s.out, cls: s.cls }]).concat({ cmd: '', cursor: true });
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setRows(final);
      return undefined;
    }
    let alive = true;
    const wait = ms => new Promise(r => setTimeout(r, ms));
    (async () => {
      await wait(460);
      if (!alive) return;
      let acc = [];
      setRows(acc);
      for (const s of steps) {
        for (let i = 1; i <= s.cmd.length; i++) {
          if (!alive) return;
          setRows([...acc, { cmd: s.cmd.slice(0, i), cursor: true }]);
          await wait(22 + Math.random() * 40);
        }
        acc = [...acc, { cmd: s.cmd }];
        setRows(acc);
        await wait(150);
        if (!alive) return;
        acc = [...acc, { out: s.out, cls: s.cls }];
        setRows(acc);
        await wait(230);
      }
      if (alive) setRows([...acc, { cmd: '', cursor: true }]);
    })();
    return () => {
      alive = false;
    };
  }, [lang]);

  return rows;
}

function Terminal() {
  const { t } = useLang();
  const rows = useTerminal();
  const clock = useClock(true);
  return (
    <div className="term">
      <div className="term-bar"><i /><i /><i /><span>rafael@lab: ~</span></div>
      <div className="term-body">
        {rows.map((r, i) =>
          r.out != null ? (
            <div key={i} className={`t-out ${r.cls}`}>{r.out}</div>
          ) : (
            <div key={i}>
              <span className="t-dir">➜ </span><span className="t-c">{r.cmd}</span>
              {r.cursor && <span className="t-cur" />}
            </div>
          )
        )}
      </div>
      {clock && (
        <div className="t-live"><span className="ldot" /><span>{t('term.live')} — <span className="t-clock">{clock}</span></span></div>
      )}
    </div>
  );
}

function HeroTitle() {
  const { t, lang } = useLang();
  return (
    <h1 className="hero-title">
      {lines(t('hero.title')).map((segs, li) => (
        <span className="line" key={`${lang}-${li}`}>
          {segs.map((s, si) => (
            <span key={si} className={s.em ? 'em' : undefined}>
              <DecryptedText text={s.text} animateOn="view" sequential speed={34} revealDirection="start"
                characters={DECODE_CHARS} encryptedClassName="enc" />
            </span>
          ))}
        </span>
      ))}
    </h1>
  );
}

export default function Hero() {
  const { t } = useLang();
  return (
    <section className="hero" id="top">
      <div className="hero-threads" aria-hidden="true">
        <Threads color="#e7e5e4" accentColor="#8fc573" amplitude={1.6} distance={0.3} lineCount={80}
          thickness={0.55} softness={1.2} speed={0.45} waves={1.1} split={0.04} fray={0.5} angle={12}
          parting={0.35} taper={0.8} brightness={1.25} fade={0.42} opacity={0.95} enableMouseInteraction />
      </div>
      <div className="frame">
        <div className="announce">
          <span className="announce-chip"><i /></span>
          <Icon name="chevron" size={12} stroke={2} className="announce-sep" />
          <ShinyText color="#d6d3d1" shineColor="#ffffff" speed={3} delay={1.5}>{t('hero.pill')}</ShinyText>
        </div>
        <div className="hero-grid">
          <div className="hero-copy">
            <HeroTitle />
            <Reveal delay={0.25} distance={18}><Tx v="hero.sub" as="p" className="hero-sub" /></Reveal>
            <Reveal delay={0.4} distance={14} className="hero-ctas">
              <MagnetButton href="#projects">
                <span>{t('hero.cta1')}</span><Icon name="arrow" size={14} stroke={2.2} />
              </MagnetButton>
              <a className="btn btn-d" href="/cv.pdf" download="CV Practicas.pdf"><span>{t('nav.cv')}</span></a>
            </Reveal>
          </div>
          <Reveal delay={0.35} distance={30} className="hero-visual">
            <Terminal />
          </Reveal>
        </div>
        <Reveal className="trio" stagger={0.12} distance={20}>
          {content.trio.map((it, i) => (
            <div key={i}>
              <h3><span className="n">{it.n}</span> <Tx v={it.h} /></h3>
              <Tx v={it.p} as="p" />
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
