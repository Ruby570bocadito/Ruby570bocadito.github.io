'use client';
import { useEffect, useRef } from 'react';
import { useStore } from '@/lib/store';
import { useT, pick } from '@/lib/i18n';
import { useNav } from '@/lib/nav';
import { CHANNELS, runChannel } from '@/lib/channels';
import { Hanko, WoodButton } from './bits';
import { ProjectDetail, CertDetail, KuraDetail, LetterForm } from './Details';
import { mountainSVG, cloudSVG, waveSVG, castle2dSVG, ninjaSVG, scrollSceneSVG, craneSVG } from '../three/art';
import profile from '@/content/profile.json';
import projects from '@/content/projects.json';
import rooms from '@/content/rooms.json';
import skills from '@/content/skills.json';
import certs from '@/content/certs.json';
import story from '@/content/story.json';
import offensive from '@/content/offensive.json';

const url = (svg) => 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);

/** Dispara un sello cuando el lector llega al final de la sección. */
function Sentinel({ stamp }) {
  const ref = useRef();
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && useStore.getState().award(stamp), { threshold: 1 });
    ref.current && io.observe(ref.current);
    return () => io.disconnect();
  }, [stamp]);
  return <div ref={ref} className="h-1" aria-hidden="true" />;
}

function RoomHeader({ id, sub }) {
  const lang = useStore((s) => s.lang);
  const r = rooms.find((x) => x.id === id);
  return (
    <header className="mb-8 border-b-[3px] border-sumi pb-4">
      <p className="font-serif text-sm font-bold uppercase tracking-[0.3em] text-ai">{pick(r.label, lang)}</p>
      <h1 className="mt-1 font-serif text-4xl font-extrabold md:text-6xl"><span className="mr-3 text-ai" lang="ja">{r.kanji}</span>{r.name}</h1>
      {sub ? <p className="mt-3 font-serif text-xl">{sub}</p> : null}
    </header>
  );
}

export function Nav2D() {
  const nav = useNav();
  const lang = useStore((s) => s.lang);
  return (
    <nav aria-label="Salas / Rooms" className="mt-16 border-t-[3px] border-sumi pt-6">
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {rooms.map((r) => (
          <li key={r.id}>
            <a href={r.path} onClick={(e) => { e.preventDefault(); nav(r.path); }} className="ink inkshadow block bg-ai p-3 text-center text-washi transition-transform hover:-translate-y-1">
              <span className="block font-serif text-2xl font-extrabold" lang="ja">{r.kanji}</span>
              <span className="block text-xs font-bold tracking-wider">{r.name}</span>
              <span className="block text-xs text-ochre">{pick(r.label, lang)}</span>
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-center text-sm text-sumi/70">
        © {profile.name} · <span lang="ja">{profile.mottoJa}</span> · <a className="underline" href="/classic/">{useT()('classic')}</a>
      </p>
    </nav>
  );
}

export function Home2D() {
  const t = useT();
  const nav = useNav();
  const { lang, stamps } = useStore();
  return (
    <div>
      <section className="woodframe relative overflow-hidden bokashi-dusk" aria-label="見張りの城">
        <div className="relative aspect-[16/10] w-full md:aspect-[16/7]">
          <img src={url(mountainSVG)} alt="" className="absolute bottom-[18%] left-[-10%] w-[80%] opacity-90" />
          <img src={url(cloudSVG('#F2E8D5', 3))} alt="" className="absolute left-[-5%] top-[22%] w-[55%]" />
          <img src={url(cloudSVG('#D9A441', 7))} alt="" className="absolute right-[-8%] top-[10%] w-[50%]" />
          <img src={url(craneSVG)} alt="" className="absolute left-[40%] top-[8%] w-[9%]" />
          <img src={url(craneSVG)} alt="" className="absolute left-[52%] top-[15%] w-[6%]" />
          <img src={url(castle2dSVG)} alt="Castillo japonés al atardecer en estilo ukiyo-e" className="absolute bottom-[10%] right-[8%] w-[46%] md:w-[34%]" />
          {!stamps.hunter ? (
            <button onClick={() => useStore.getState().award('hunter')} className="absolute bottom-[58%] right-[22%] w-[4%] min-w-6 opacity-90 md:bottom-[62%] md:right-[18%]" aria-label="?">
              <img src={url(ninjaSVG)} alt="" />
            </button>
          ) : null}
          <img src={url(waveSVG)} alt="" className="absolute bottom-0 left-0 w-1/2" />
          <img src={url(waveSVG)} alt="" className="absolute bottom-0 right-0 w-1/2" />
          <div className="absolute left-[4%] top-[8%] wood woodframe flex flex-col items-center px-3 py-4">
            <span className="vertical font-serif text-2xl font-extrabold tracking-[0.2em] text-washi md:text-5xl" lang="ja">{profile.katakana}</span>
            <span className="mt-3 max-w-[6rem] text-center font-serif text-xs font-extrabold text-washi md:text-sm">{profile.short}</span>
          </div>
        </div>
      </section>
      <section className="mt-10 grid gap-8 md:grid-cols-[1.4fr_1fr]">
        <div>
          <h1 className="font-serif text-4xl font-extrabold md:text-5xl">{profile.name}</h1>
          <p className="mt-2 font-serif text-xl text-ai">{profile.roles.join(' · ')}</p>
          <p className="mt-4 text-lg leading-relaxed">{pick(profile.bio, lang)}</p>
          <p className="mt-4 font-serif text-lg">“{profile.motto.en}” / <span lang="ja">{profile.mottoJa}</span></p>
          <div className="mt-6 flex flex-wrap gap-3">
            <WoodButton onClick={() => { useStore.getState().award('enter'); nav('/watchtower/'); }} className="bg-ai! text-washi! px-4! py-2!">入城 · {t('enter')} →</WoodButton>
            <WoodButton onClick={() => nav('/harbor/')}>港 {pick(rooms[4].label, lang)}</WoodButton>
          </div>
        </div>
        <aside className="washi woodframe p-5">
          <p className="font-serif text-sm font-bold uppercase tracking-widest text-sumi/70">Status</p>
          <p className="mt-2 font-serif text-xl font-extrabold"><Hanko>募集中</Hanko> {pick(profile.status, lang)}</p>
          <p className="mt-3">{pick(profile.location, lang)}</p>
          <ul className="mt-3 list-disc pl-5 text-sm">{profile.focus.map((f) => <li key={f}>{f}</li>)}</ul>
        </aside>
      </section>
      <Nav2D />
      <Sentinel stamp="patrol" />
    </div>
  );
}

export function About2D() {
  const lang = useStore((s) => s.lang);
  return (
    <div>
      <RoomHeader id="about" sub={pick(profile.bio, lang)} />
      <ol className="space-y-10">
        {story.scenes.map((s) => (
          <li key={s.id} className="grid items-center gap-5 md:grid-cols-[1.2fr_1fr]">
            <img src={url(scrollSceneSVG(s.id))} alt="" className="ink washi w-full" loading="lazy" />
            <div>
              <p className="font-serif font-bold text-ai"><Hanko size="text-sm">{s.kanji}</Hanko> {s.year}</p>
              <h2 className="mt-2 font-serif text-2xl font-extrabold">{pick(s.title, lang)}</h2>
              <p className="mt-2 leading-relaxed">{pick(s.text, lang)}</p>
            </div>
          </li>
        ))}
      </ol>
      <section className="mt-12">
        <h2 className="font-serif text-3xl font-extrabold">{pick(story.learn.title, lang)}</h2>
        <ol className="mt-4 grid gap-4 md:grid-cols-3">
          {story.learn.steps.map((st) => (
            <li key={st.name} className="washi woodframe p-5">
              <span className="font-serif text-5xl font-extrabold text-ai" lang="ja">{st.kanji}</span>
              <h3 className="mt-2 font-serif text-xl font-extrabold">{st.name}</h3>
              <p className="mt-1">{pick(st.text, lang)}</p>
            </li>
          ))}
        </ol>
      </section>
      <section className="washi woodframe mt-10 p-6">
        <h2 className="font-serif text-2xl font-extrabold"><Hanko>確認</Hanko> {pick(story.ai.title, lang)}</h2>
        <p className="mt-2 text-lg leading-relaxed">{pick(story.ai.text, lang)}</p>
      </section>
      <Sentinel stamp="story" />
      <Nav2D />
    </div>
  );
}

export function Watchtower2D() {
  return (
    <div>
      <RoomHeader id="watchtower" />
      <ul className="space-y-6">
        {projects.map((p) => (
          <li key={p.id} className={`washi woodframe ${p.featured ? 'ring-4 ring-ochre' : ''}`}>
            <details onToggle={(e) => e.currentTarget.open && useStore.getState().award('analyze')} open={p.featured}>
              <summary className="flex cursor-pointer list-none items-center gap-4 p-4 hover:bg-washi-dark">
                <span className="font-serif text-4xl font-extrabold text-ai" lang="ja" aria-hidden="true">{p.kanji}</span>
                <span className="font-serif text-xl font-extrabold">{p.name}</span>
                {p.band ? <span className="ink hidden bg-ochre px-2 text-xs font-bold sm:inline">{p.band}</span> : null}
                <span className="ml-auto font-mono text-sm">+</span>
              </summary>
              <div className="border-t-[3px] border-sumi"><ProjectDetail p={p} headingLevel={2} /></div>
            </details>
          </li>
        ))}
      </ul>
      <Nav2D />
    </div>
  );
}

export function Dojo2D() {
  const lang = useStore((s) => s.lang);
  return (
    <div>
      <RoomHeader id="dojo" sub={pick(skills.title, lang)} />
      <ul className="grid gap-5 md:grid-cols-2">
        {skills.categories.map((c) => (
          <li key={c.id} className="washi woodframe p-5">
            <h2 className="font-serif text-2xl font-extrabold"><span className="text-ai" lang="ja">{c.kanji}</span> {pick(c.name, lang)} <span className="text-sm font-bold text-sumi/60">· {pick(c.weaponName, lang)}</span></h2>
            <ul className="mt-3 flex flex-wrap gap-2">{c.items.map((s) => <li key={s}><Hanko size="text-sm">{s}</Hanko></li>)}</ul>
          </li>
        ))}
      </ul>
      <Nav2D />
    </div>
  );
}

export function Archive2D() {
  return (
    <div>
      <RoomHeader id="archive" />
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[...certs.items, ...certs.achievements].map((c) => <li key={c.id}><CertDetail c={c} /></li>)}
      </ul>
      <Nav2D />
    </div>
  );
}

export function Harbor2D() {
  const lang = useStore((s) => s.lang);
  return (
    <div>
      <RoomHeader id="harbor" sub={pick(profile.status, lang)} />
      <div className="grid gap-8 md:grid-cols-[1fr_1.3fr]">
        <ul className="space-y-3">
          {CHANNELS.filter((c) => c.id !== 'message').map((c) => (
            <li key={c.id}>
              <a
                href={c.href}
                {...(c.download ? { download: 'Rafael-Galvez-CV.pdf' } : /^https?:/.test(c.href) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                onClick={() => useStore.getState().award('contact')}
                className="ink inkshadow flex items-center justify-between bg-ai px-4 py-3 font-serif text-lg font-bold text-washi hover:-translate-y-0.5"
              >
                <span>{c.kind === 'boat' ? '舟' : '灯'} {pick(c.label, lang)}</span>
                <span className="text-sm text-ochre">{c.id === 'email' ? profile.email : '↗'}</span>
              </a>
            </li>
          ))}
        </ul>
        <LetterForm />
      </div>
      <Nav2D />
    </div>
  );
}

export function Kura2D() {
  const lang = useStore((s) => s.lang);
  return (
    <div>
      <RoomHeader id="kura" sub={pick(offensive.motto, lang)} />
      <p className="mb-6 text-sumi/80">{pick(offensive.disclaimer, lang)}</p>
      <ul className="grid gap-6 md:grid-cols-2">
        {offensive.items.map((k) => <li key={k.id} className="washi woodframe"><KuraDetail k={k} /></li>)}
      </ul>
      <Nav2D />
    </div>
  );
}

export const ROOMS_2D = { home: Home2D, about: About2D, watchtower: Watchtower2D, dojo: Dojo2D, archive: Archive2D, harbor: Harbor2D, kura: Kura2D };

export default function Room2D({ id }) {
  const C = ROOMS_2D[id] || Home2D;
  return <C />;
}
