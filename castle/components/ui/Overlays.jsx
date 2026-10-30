'use client';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useStore } from '@/lib/store';
import { useT, pick } from '@/lib/i18n';
import { useNav } from '@/lib/nav';
import { sfx } from '@/lib/audio';
import { CHANNELS, runChannel } from '@/lib/channels';
import { Hanko, PrintModal, WoodButton } from './bits';
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

const Hint = ({ children }) => (
  <p className="washi ink pointer-events-none fixed bottom-4 left-1/2 z-20 -translate-x-1/2 px-4 py-2 font-serif text-sm font-bold">{children}</p>
);

const RoomTitle = ({ id, sub }) => {
  const lang = useStore((s) => s.lang);
  const r = rooms.find((x) => x.id === id);
  return (
    <div className="pointer-events-none fixed left-3 top-16 z-20 md:left-6 md:top-20">
      <h1 className="font-serif text-3xl font-extrabold text-sumi drop-shadow-[2px_2px_0_#F2E8D5] md:text-5xl">
        <span className="mr-3 text-ai">{r.kanji}</span>{r.name}
      </h1>
      <p className="mt-1 font-serif text-base font-bold text-sumi drop-shadow-[1px_1px_0_#F2E8D5]">{sub || pick(r.label, lang)}</p>
    </div>
  );
};

function Roles() {
  const [i, setI] = useState(0);
  useEffect(() => { const id = setInterval(() => setI((x) => (x + 1) % profile.roles.length), 1800); return () => clearInterval(id); }, []);
  return <span key={i} className="fade-up inline-block text-ai">{profile.roles[i]}</span>;
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
          <div className="fixed bottom-6 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2">
            <button
              onClick={() => { sfx('wood'); useStore.setState({ phase: 'crossing' }); }}
              className="ink inkshadow bg-ai px-6 py-3 font-serif text-lg font-extrabold text-washi hover:-translate-y-0.5"
            >
              入城 · {t('enter')}
            </button>
            <p className="washi ink px-3 py-1 font-serif text-sm font-bold">{t('gateHint')}</p>
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
              <p className="mt-3 inline-block washi ink px-3 py-1 font-serif text-sm font-bold">↓ {t('scrollHint')}</p>
            </div>
          ) : null}
          {door || nearDoor === 5 ? (
            <div className="fade-up fixed bottom-6 left-1/2 z-20 -translate-x-1/2" key={nearDoor}>
              <button
                onClick={() => nav((door || rooms[5]).path)}
                className="ink inkshadow flex items-center gap-3 bg-ai px-5 py-3 font-serif text-washi hover:-translate-y-0.5"
              >
                <span className="text-3xl font-extrabold">{(door || rooms[5]).kanji}</span>
                <span className="text-left"><span className="block text-lg font-extrabold">{(door || rooms[5]).name}</span><span className="block text-sm">{t('enter')} · {pick((door || rooms[5]).label, lang)} →</span></span>
              </button>
            </div>
          ) : null}
          {/* índice lateral de la pasarela */}
          <ol className="fixed right-3 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-1 md:flex" aria-label={t('rooms')}>
            {rooms.map((r, i) => (
              <li key={r.id}>
                <button onClick={() => nav(r.path)} className={`ink w-full px-2 py-1 text-right font-serif text-xs font-extrabold ${nearDoor === i ? 'bg-ochre' : 'bg-washi/90 hover:bg-washi-dark'}`}>
                  {r.kanji} <span className="font-sans font-semibold">{pick(r.label, lang)}</span>
                </button>
              </li>
            ))}
          </ol>
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
      <RoomTitle id="about" />
      <ScrollDriver vh={800} field="scrollT" />
      <div key={idx + lang} className="washi woodframe fade-up fixed bottom-6 right-3 z-20 w-[min(92vw,420px)] p-5 md:right-8">
        {card}
        <div className="mt-3 flex gap-1" aria-hidden="true">{Array.from({ length: n }, (_, i) => <span key={i} className={`h-1.5 flex-1 ${i <= idx ? 'bg-ai' : 'bg-sumi/15'}`} />)}</div>
      </div>
      {scrollT < 0.02 ? <Hint>↓ {t('scrollRead')}</Hint> : null}
      {stamps.story && scrollT > 0.98 ? <Hint>物語 ✓</Hint> : null}
    </>
  );
}

function WatchtowerOverlay() {
  const t = useT();
  const project = useStore((s) => s.project);
  const p = projects.find((x) => x.id === project);
  return (
    <>
      <RoomTitle id="watchtower" />
      <Hint>⟷ {t('dragHint')}</Hint>
      <nav className="fixed bottom-16 left-1/2 z-20 flex max-w-[95vw] -translate-x-1/2 flex-wrap justify-center gap-1" aria-label="Projects">
        {projects.map((x) => (
          <button key={x.id} onClick={() => { useStore.setState({ project: x.id }); useStore.getState().award('analyze'); }} className="ink bg-washi/90 px-2 py-1 font-serif text-xs font-bold hover:bg-ochre">
            {x.kanji} {x.name}
          </button>
        ))}
      </nav>
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
      <RoomTitle id="dojo" sub={pick(skills.title, lang)} />
      <div className="fixed bottom-4 left-1/2 z-20 w-[min(94vw,760px)] -translate-x-1/2">
        <div className="mb-2 flex flex-wrap justify-center gap-1" role="tablist" aria-label="Skills">
          {skills.categories.map((c) => (
            <button key={c.id} role="tab" aria-selected={hovered === c.id} onClick={() => useStore.setState({ hovered: c.id })} onMouseEnter={() => useStore.setState({ hovered: c.id })}
              className={`ink px-3 py-1.5 font-serif text-sm font-bold ${hovered === c.id ? 'bg-ochre' : 'bg-washi/90'}`}>
              {c.kanji} {pick(c.name, lang)}
            </button>
          ))}
        </div>
        <div className="washi woodframe min-h-28 p-4" role="tabpanel" aria-live="polite">
          {cat ? (
            <div key={cat.id} className="fade-up">
              <p className="font-serif text-lg font-extrabold">{cat.kanji} {pick(cat.name, lang)} <span className="text-sm font-bold text-sumi/60">· {pick(cat.weaponName, lang)}</span></p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {cat.items.map((s, i) => <li key={s} className="stamp-in" style={{ animationDelay: `${i * 60}ms` }}><Hanko size="text-sm">{s}</Hanko></li>)}
              </ul>
            </div>
          ) : <p className="font-serif font-bold text-sumi/70">{t('hoverHint')}</p>}
        </div>
      </div>
    </>
  );
}

function ArchiveOverlay() {
  const t = useT();
  const { cert, lang } = useStore();
  const items = [...certs.items, ...certs.achievements];
  const c = items.find((x) => x.id === cert);
  return (
    <>
      <RoomTitle id="archive" />
      <nav className="fixed bottom-14 left-1/2 z-20 flex max-w-[95vw] -translate-x-1/2 flex-wrap justify-center gap-1" aria-label="Certifications">
        {items.map((x) => (
          <button key={x.id} onClick={() => useStore.setState({ cert: x.id })} className="ink flex items-center gap-1 bg-washi/90 px-2 py-1 font-serif text-xs font-bold hover:bg-ochre">
            <span className="hanko text-[10px]">{x.seal || certs.statuses[x.status].seal}</span> {x.title.split(' —')[0]}
          </button>
        ))}
      </nav>
      <Hint>{t('clickScroll')}</Hint>
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
      <div className="pointer-events-none fixed left-3 top-16 z-20 md:left-6 md:top-20">
        <h1 className="font-serif text-3xl font-extrabold text-washi drop-shadow-[2px_2px_0_#1A1A1A] md:text-5xl"><span className="mr-3 text-ochre">港</span>THE HARBOR</h1>
        <p className="mt-1 font-serif text-base font-bold text-washi">{pick(profile.status, lang)}</p>
      </div>
      <nav className="fixed bottom-4 left-1/2 z-20 flex max-w-[95vw] -translate-x-1/2 flex-wrap justify-center gap-2" aria-label="Contact">
        {CHANNELS.map((c) => (
          <WoodButton key={c.id} onClick={() => runChannel(c.id)}>{c.kind === 'boat' ? '舟' : '灯'} {pick(c.label, lang)}</WoodButton>
        ))}
      </nav>
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
      <div className="pointer-events-none fixed left-3 top-16 z-20 max-w-xl md:left-6 md:top-20">
        <h1 className="font-serif text-3xl font-extrabold text-washi drop-shadow-[2px_2px_0_#1A1A1A] md:text-5xl"><span className="mr-3 text-ochre">蔵</span>KURA</h1>
        <p className="mt-1 font-serif text-lg font-bold text-washi">{pick(offensive.motto, lang)}</p>
        <p className="mt-1 text-sm text-washi/80">{pick(offensive.disclaimer, lang)}</p>
      </div>
      {!kuraOpen ? (
        <div className="fixed bottom-6 left-1/2 z-20 -translate-x-1/2">
          <button onClick={() => { sfx('wood'); useStore.setState({ kuraOpen: true }); }} className="ink inkshadow bg-ochre px-5 py-3 font-serif text-lg font-extrabold">鍵 · {t('unlock')}</button>
        </div>
      ) : (
        <nav className="fixed bottom-4 left-1/2 z-20 flex -translate-x-1/2 flex-wrap justify-center gap-1" aria-label="Offensive archive">
          {offensive.items.map((x) => <WoodButton key={x.id} onClick={() => useStore.setState({ kuraItem: x.id })}>{x.kanji} {x.name}</WoodButton>)}
        </nav>
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
