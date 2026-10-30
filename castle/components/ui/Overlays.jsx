'use client';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useStore } from '@/lib/store';
import { useT, pick } from '@/lib/i18n';
import { useNav } from '@/lib/nav';
import { sfx } from '@/lib/audio';
import { CHANNELS, runChannel } from '@/lib/channels';
import { Hanko, PrintModal } from './bits';
import { DOOR_T } from '@/lib/walk';
import { ProjectDetail, CertDetail, KuraDetail, LetterForm } from './Details';
import profile from '@/content/profile.json';
import projects from '@/content/projects.json';
import rooms from '@/content/rooms.json';
import skills from '@/content/skills.json';
import certs from '@/content/certs.json';
import story from '@/content/story.json';
import offensive from '@/content/offensive.json';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

/** Espaciador de scroll: GSAP ScrollTrigger mapea el scroll a la cámara. */
function ScrollDriver({ vh, field }) {
  const ref = useRef();
  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: ref.current, start: 'top top', end: 'bottom bottom',
      onUpdate: (self) => useStore.setState({ [field]: self.progress }),
    });
    return () => st.kill();
  }, [field]);
  return <div ref={ref} style={{ height: `${vh}vh` }} aria-hidden="true" />;
}

/** Cartucho de título vertical (dai) + rótulo con el nombre de la sala. */
function Cartouche({ id, kanji, name, label }) {
  const lang = useStore((s) => s.lang);
  const r = rooms.find((x) => x.id === id);
  return (
    <div className="cartouche fade-up">
      <h1 className="cartouche-main" lang="ja" aria-label={`${r?.kanji || kanji} ${r?.name || name}`}>{kanji || r.kanji}</h1>
      <p className="cartouche-sub">
        <span className="name">{name || r.name}</span>
        <span className="label">{label || pick(r.label, lang)}</span>
      </p>
    </div>
  );
}

/** Barra inferior unificada: lista de elementos de la sala + pista. */
function Dock({ items, active, onPick, hint, label }) {
  return (
    <div className="dock">
      {items?.length ? (
        <nav className="dock-bar" aria-label={label}>
          {items.map((x) => (
            <button key={x.id} className={`dock-item ${active === x.id ? 'is-on' : ''}`} onClick={() => onPick(x.id)} onMouseEnter={x.onHover} aria-pressed={active === x.id}>
              {x.k ? <span className="k" lang="ja">{x.k}</span> : null}{x.name}
            </button>
          ))}
        </nav>
      ) : null}
      {hint ? <p className="dock-hint">{hint}</p> : null}
    </div>
  );
}

function Roles() {
  const [i, setI] = useState(0);
  useEffect(() => { const id = setInterval(() => setI((x) => (x + 1) % profile.roles.length), 1800); return () => clearInterval(id); }, []);
  return <span key={i} className="role-in inline-block text-ai">{profile.roles[i]}</span>;
}

/** Raíl lateral: posición en la pasarela y salto a cada puerta. */
function WalkRail() {
  const { walkT, nearDoor, lang } = useStore();
  const t = useT();
  const go = (k) => {
    const max = document.documentElement.scrollHeight - innerHeight;
    window.scrollTo({ top: k * max, behavior: useStore.getState().reduced ? 'auto' : 'smooth' });
  };
  return (
    <nav className="rail hidden md:block" aria-label={t('rooms')}>
      <div className="rail-line" />
      {rooms.map((r, i) => (
        <button key={r.id} className={`rail-mark ${nearDoor === i ? 'is-near' : ''}`} style={{ top: `${DOOR_T[i] * 100}%` }} onClick={() => go(DOOR_T[i])} aria-label={`${r.kanji} ${r.name}`}>
          <span className="lbl">{pick(r.label, lang)}</span>
          <span className="k" lang="ja">{r.kanji.length > 2 ? r.kanji.slice(0, 2) : r.kanji}</span>
        </button>
      ))}
      <span className="rail-dot" style={{ top: `${walkT * 100}%` }} aria-hidden="true" />
    </nav>
  );
}

function HomeOverlay() {
  const t = useT();
  const nav = useNav();
  const { phase, walkT, nearDoor, lang, savedScroll } = useStore();
  useEffect(() => {
    if (phase === 'walk' && savedScroll) {
      requestAnimationFrame(() => { window.scrollTo(0, savedScroll); useStore.setState({ savedScroll: 0 }); });
    }
  }, [phase, savedScroll]);
  const door = nearDoor >= 0 ? rooms[nearDoor] : null;
  return (
    <>
      {phase === 'intro' ? (
        <>
          {/* cartel vertical de madera con mi nombre */}
          <div className="fade-up fixed left-4 top-20 z-20 md:left-10 md:top-24">
            <div className="wood woodframe flex flex-col items-center px-4 py-5 md:px-6">
              <span className="vertical font-serif text-4xl font-extrabold tracking-[0.2em] text-washi md:text-6xl" lang="ja">{profile.katakana}</span>
              <span className="mt-4 max-w-[7rem] text-center font-serif text-sm font-extrabold leading-tight text-washi md:text-base">{profile.short}</span>
            </div>
            <div className="mx-auto h-10 w-3 border-x-2 border-sumi bg-[#5e4429]" />
          </div>
          <div className="dock">
            <button
              onClick={() => { sfx('wood'); useStore.setState({ phase: 'crossing' }); }}
              className="hud-btn !h-14 !bg-ai !px-7 font-serif text-xl font-extrabold !text-washi"
            >
              <span lang="ja">入城</span><span className="text-ochre">·</span>{t('enter')}
            </button>
            <p className="dock-hint">{t('gateHint')}</p>
          </div>
        </>
      ) : null}
      {phase === 'walk' ? (
        <>
          <ScrollDriver vh={900} field="walkT" />
          {walkT < 0.07 ? (
            <div className="fade-up pointer-events-none fixed bottom-6 left-1/2 z-20 w-[min(92vw,640px)] -translate-x-1/2 text-center">
              <div className="washi woodframe p-5">
                <p className="font-serif text-3xl font-extrabold">{profile.name}</p>
                <p className="mt-1 font-serif text-2xl font-extrabold" aria-label={profile.roles.join(' · ')}><Roles /></p>
                <p className="mt-1 text-xs tracking-widest text-sumi/60" aria-hidden="true">{profile.roles.join(' · ')}</p>
                <p className="mt-3 text-sm">“{profile.motto.en}” / <span lang="ja">{profile.mottoJa}</span> · <Hanko size="text-xs">{pick(profile.status, lang)}</Hanko></p>
              </div>
              <p className="dock-hint mt-3">↓ {t('scrollHint')}</p>
            </div>
          ) : null}
          {door || nearDoor === 5 ? (
            <div className="dock fade-up" key={nearDoor}>
              <button
                onClick={() => nav((door || rooms[5]).path)}
                className="hud-btn !h-auto !justify-start gap-3 !bg-ai !px-5 !py-3 font-serif !text-washi"
              >
                <span className="text-3xl font-extrabold">{(door || rooms[5]).kanji}</span>
                <span className="text-left"><span className="block text-lg font-extrabold">{(door || rooms[5]).name}</span><span className="block text-sm">{t('enter')} · {pick((door || rooms[5]).label, lang)} →</span></span>
              </button>
            </div>
          ) : null}
          <WalkRail />
        </>
      ) : null}
    </>
  );
}

function AboutOverlay() {
  const t = useT();
  const { scrollT, lang, stamps } = useStore();
  const n = story.scenes.length + 2;
  const idx = Math.min(n - 1, Math.floor(scrollT * n * 0.999));
  let card;
  if (idx < story.scenes.length) {
    const s = story.scenes[idx];
    card = <><p className="font-serif text-sm font-bold text-ai">{s.kanji} · {s.year}</p><h2 className="font-serif text-2xl font-extrabold">{pick(s.title, lang)}</h2><p className="mt-2 leading-relaxed">{pick(s.text, lang)}</p></>;
  } else if (idx === story.scenes.length) {
    card = <><h2 className="font-serif text-2xl font-extrabold">{pick(story.learn.title, lang)}</h2><ul className="mt-2 space-y-1">{story.learn.steps.map((st) => <li key={st.name}><b className="font-serif">{st.kanji} {st.name}</b> — {pick(st.text, lang)}</li>)}</ul></>;
  } else {
    card = <><h2 className="font-serif text-2xl font-extrabold">{pick(story.ai.title, lang)}</h2><p className="mt-2 leading-relaxed">{pick(story.ai.text, lang)}</p></>;
  }
  return (
    <>
      <Cartouche id="about" />
      <ScrollDriver vh={800} field="scrollT" />
      <div key={idx + lang} className="washi woodframe fade-up fixed bottom-6 right-3 z-20 w-[min(92vw,420px)] p-5 md:right-8">
        {card}
        <div className="mt-3 flex gap-1" aria-hidden="true">{Array.from({ length: n }, (_, i) => <span key={i} className={`h-1.5 flex-1 ${i <= idx ? 'bg-ai' : 'bg-sumi/15'}`} />)}</div>
      </div>
      {scrollT < 0.02 ? <Dock hint={'↓ ' + t('scrollRead')} /> : null}
    </>
  );
}

function WatchtowerOverlay() {
  const t = useT();
  const project = useStore((s) => s.project);
  const p = projects.find((x) => x.id === project);
  return (
    <>
      <Cartouche id="watchtower" />
      <Dock
        label="Projects"
        items={projects.map((x) => ({ id: x.id, k: x.kanji, name: x.name }))}
        active={project}
        onPick={(id) => { useStore.setState({ project: id }); useStore.getState().award('analyze'); }}
        hint={'⟷ ' + t('dragHint')}
      />
      <PrintModal open={!!p} onClose={() => useStore.setState({ project: null })} label={p?.name}>
        {p ? <ProjectDetail p={p} /> : null}
      </PrintModal>
    </>
  );
}

function DojoOverlay() {
  const t = useT();
  const { hovered, lang } = useStore();
  const cat = skills.categories.find((c) => c.id === hovered);
  return (
    <>
      <Cartouche id="dojo" label={pick(skills.title, lang)} />
      <div className="dock">
        <div className="washi woodframe w-full max-w-3xl p-4" role="region" aria-live="polite" aria-label={pick(skills.title, lang)}>
          {cat ? (
            <div key={cat.id} className="fade-up">
              <p className="font-serif text-lg font-extrabold"><span className="text-ai" lang="ja">{cat.kanji}</span> {pick(cat.name, lang)} <span className="text-sm font-bold text-sumi/60">· {pick(cat.weaponName, lang)}</span></p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {cat.items.map((s, i) => <li key={s} className="stamp-in" style={{ animationDelay: `${i * 60}ms` }}><Hanko size="text-sm">{s}</Hanko></li>)}
              </ul>
            </div>
          ) : <p className="font-serif font-bold text-sumi/70">{t('hoverHint')}</p>}
        </div>
        <nav className="dock-bar" aria-label="Skills" role="tablist">
          {skills.categories.map((c) => (
            <button key={c.id} role="tab" aria-selected={hovered === c.id} className={`dock-item ${hovered === c.id ? 'is-on' : ''}`} onClick={() => useStore.setState({ hovered: c.id })} onMouseEnter={() => useStore.setState({ hovered: c.id })}>
              <span className="k" lang="ja">{c.kanji}</span>{pick(c.name, lang)}
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}

function ArchiveOverlay() {
  const t = useT();
  const { cert } = useStore();
  const items = [...certs.items, ...certs.achievements];
  const c = items.find((x) => x.id === cert);
  return (
    <>
      <Cartouche id="archive" />
      <Dock
        label="Certifications"
        items={items.map((x) => ({ id: x.id, k: x.seal || certs.statuses[x.status].seal, name: x.title.split(' —')[0] }))}
        active={cert}
        onPick={(id) => useStore.setState({ cert: id })}
        hint={t('clickScroll')}
      />
      <PrintModal open={!!c} onClose={() => useStore.setState({ cert: null })} label={c?.title} wide={false}>
        {c ? <CertDetail c={c} /> : null}
      </PrintModal>
    </>
  );
}

function HarborOverlay() {
  const t = useT();
  const { letter, lang } = useStore();
  return (
    <>
      <Cartouche id="harbor" label={pick(profile.status, lang)} />
      <Dock label="Contact" items={CHANNELS.map((c) => ({ id: c.id, k: c.kind === 'boat' ? '舟' : '灯', name: pick(c.label, lang) }))} onPick={runChannel} hint={profile.email} />
      <PrintModal open={letter} onClose={() => useStore.setState({ letter: false })} label={t('sendMsg')} wide={false}>
        <div className="p-4 pt-14"><LetterForm onSent={() => setTimeout(() => useStore.setState({ letter: false }), 1200)} /></div>
      </PrintModal>
    </>
  );
}

function KuraOverlay() {
  const t = useT();
  const { kuraOpen, kuraItem, lang } = useStore();
  const k = offensive.items.find((x) => x.id === kuraItem);
  return (
    <>
      <Cartouche id="kura" label={pick(offensive.motto, lang)} />
      {!kuraOpen ? (
        <div className="dock">
          <button onClick={() => { sfx('wood'); useStore.setState({ kuraOpen: true }); }} className="hud-btn hud-btn-wide !h-12 !bg-ochre !px-5 font-serif text-lg font-extrabold">鍵 · {t('unlock')}</button>
          <p className="dock-hint">{pick(offensive.disclaimer, lang)}</p>
        </div>
      ) : (
        <Dock label="Offensive archive" items={offensive.items.map((x) => ({ id: x.id, k: x.kanji, name: x.name }))} active={kuraItem} onPick={(id) => useStore.setState({ kuraItem: id })} hint={pick(offensive.disclaimer, lang)} />
      )}
      <PrintModal open={!!k} onClose={() => useStore.setState({ kuraItem: null })} label={k?.name}>
        {k ? <KuraDetail k={k} /> : null}
      </PrintModal>
    </>
  );
}

export default function Overlays({ room }) {
  switch (room) {
    case 'about': return <AboutOverlay />;
    case 'watchtower': return <WatchtowerOverlay />;
    case 'dojo': return <DojoOverlay />;
    case 'archive': return <ArchiveOverlay />;
    case 'harbor': return <HarborOverlay />;
    case 'kura': return <KuraOverlay />;
    default: return <HomeOverlay />;
  }
}
