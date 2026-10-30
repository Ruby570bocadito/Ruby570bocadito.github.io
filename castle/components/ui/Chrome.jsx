'use client';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useStore, STAMPS } from '@/lib/store';
import { useT, pick } from '@/lib/i18n';
import { useNav, roomFromPath } from '@/lib/nav';
import { initAudio, setVolumes, sfx } from '@/lib/audio';
import { Hanko, WoodButton } from './bits';
import rooms from '@/content/rooms.json';

const LANGS = [['es', 'ES'], ['en', 'EN'], ['ja', '日本語']];

/** Barra superior: volver, mapa, terminal, audio, sellos, idioma, 2D. */
export function TopBar() {
  const t = useT();
  const nav = useNav();
  const pathname = usePathname();
  const room = roomFromPath(pathname);
  const { panel, togglePanel, lang, setLang, stamps, phase, muted, mode } = useStore();
  const count = Object.keys(stamps).length;
  const back = () => {
    if (room !== 'home') return nav('/');
    if (phase === 'walk') { window.scrollTo({ top: 0 }); useStore.setState({ phase: 'intro', walkT: 0 }); }
  };
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40 flex items-start justify-between gap-2 p-2 md:p-3">
      <div className="pointer-events-auto flex items-center gap-2">
        {(room !== 'home' || phase === 'walk') && mode === '3d' ? (
          <WoodButton onClick={() => { sfx('wood'); back(); }} aria-label={t('back')}>← <span className="hidden sm:inline">{t('back')}</span></WoodButton>
        ) : null}
        <a href="/" onClick={(e) => { e.preventDefault(); nav('/'); }} className="flex items-center gap-2" aria-label="見張りの城 — home">
          <Hanko size="text-sm">見張</Hanko>
          <span className="hidden font-serif text-sm font-extrabold text-sumi drop-shadow-[0_1px_0_#F2E8D5] md:inline">{pick(rooms.find((r) => r.id === room)?.kanji, lang) || '見張りの城'}</span>
        </a>
      </div>
      <nav className="pointer-events-auto flex flex-wrap items-center justify-end gap-1.5" aria-label="UI">
        <WoodButton active={panel === 'map'} onClick={() => { sfx('paper'); togglePanel('map'); }} aria-expanded={panel === 'map'}>地図 <span className="hidden lg:inline">{t('map')}</span></WoodButton>
        <WoodButton onClick={() => useStore.setState({ terminal: true })} aria-label={t('terminal')} title={t('terminalHint')}>~ <span className="hidden lg:inline">{t('terminal')}</span></WoodButton>
        <WoodButton active={panel === 'audio'} onClick={() => togglePanel('audio')} aria-expanded={panel === 'audio'} aria-label={t('audio')}>{muted ? '音✕' : '音♪'} <span className="hidden lg:inline">{t('audio')}</span></WoodButton>
        <WoodButton active={panel === 'book'} onClick={() => { sfx('paper'); togglePanel('book'); }} aria-expanded={panel === 'book'} aria-label={t('stamps')}>
          印 <span className="font-mono text-xs">{count}/6</span>
        </WoodButton>
        <div className="ink flex bg-washi" role="group" aria-label="Language">
          {LANGS.map(([k, l]) => (
            <button key={k} onClick={() => setLang(k)} aria-pressed={lang === k} className={`px-2 py-1.5 font-serif text-xs font-bold ${lang === k ? 'bg-ai text-washi' : 'hover:bg-washi-dark'}`}>{l}</button>
          ))}
        </div>
        <WoodButton onClick={() => useStore.getState().setMode(mode === '3d' ? '2d' : '3d')} className="hidden md:inline-flex">
          {mode === '3d' ? t('to2d') : t('to3d')}
        </WoodButton>
      </nav>
    </header>
  );
}

export function AudioPanel() {
  const t = useT();
  const { panel, muted, music, sfx: fx } = useStore();
  useEffect(() => setVolumes({ muted, music, sfx: fx }), [muted, music, fx]);
  if (panel !== 'audio') return null;
  return (
    <div className="washi woodframe fade-up fixed right-3 top-16 z-40 w-72 p-4" role="dialog" aria-label={t('audio')}>
      <button
        className={`ink mb-4 w-full px-3 py-2 font-serif font-bold ${muted ? 'bg-ai text-washi' : 'bg-washi'}`}
        onClick={() => { initAudio(); useStore.setState({ muted: !muted }); }}
      >
        {muted ? '♪ ' + t('unmute') : t('mute')}
      </button>
      {[['music', music], ['sfx', fx]].map(([k, v]) => (
        <label key={k} className="mb-3 block font-serif text-sm font-bold">
          {k === 'music' ? t('music') : t('effects')}
          <input type="range" min="0" max="1" step="0.05" value={v} onChange={(e) => useStore.setState({ [k]: +e.target.value })} className="mt-1 w-full accent-[#1F3A5F]" />
        </label>
      ))}
      <p className="text-xs text-sumi/70">風 · 水 · 風鈴 · 尺八</p>
    </div>
  );
}

/** Goshuinchō: libro de sellos con los 6 logros. */
export function StampBook() {
  const t = useT();
  const { panel, stamps, lang } = useStore();
  if (panel !== 'book') return null;
  const count = Object.keys(stamps).length;
  return (
    <div className="fixed inset-0 z-40 flex items-start justify-center bg-sumi/40 p-3 pt-20" onClick={() => useStore.setState({ panel: null })}>
      <div className="woodframe fade-up w-full max-w-3xl bg-ai p-3" role="dialog" aria-label={t('stamps')} onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-center justify-between px-1 text-washi">
          <h2 className="font-serif text-xl font-extrabold">御朱印帳 · {t('stamps')}</h2>
          <span className="font-mono text-lg">{count}/6</span>
        </div>
        <ol className="grid grid-cols-2 gap-1 sm:grid-cols-3">
          {STAMPS.map((s) => {
            const got = stamps[s.id];
            return (
              <li key={s.id} className="washi relative flex h-48 flex-col items-center justify-between border-2 border-sumi p-3">
                <span className="vertical absolute right-2 top-2 font-serif text-xs text-sumi/70">{s.kanji}</span>
                <div className="flex flex-1 items-center justify-center">
                  {got ? (
                    <span className="hanko stamp-in h-20 w-20 rounded-full text-2xl" style={{ borderRadius: '50%' }}>{s.kanji}</span>
                  ) : (
                    <span className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-dashed border-sumi/30 font-serif text-2xl text-sumi/20">{s.kanji}</span>
                  )}
                </div>
                <p className="text-center font-serif text-sm font-bold">{pick(s.label, lang)}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

export function StampToast() {
  const t = useT();
  const { toast, lang } = useStore();
  useEffect(() => {
    if (!toast) return;
    sfx('stamp');
    const id = setTimeout(() => useStore.setState({ toast: null }), 3200);
    return () => clearTimeout(id);
  }, [toast]);
  const s = STAMPS.find((x) => x.id === toast);
  if (!s) return null;
  return (
    <div className="washi woodframe fade-up fixed bottom-4 right-4 z-[60] flex items-center gap-3 p-3 pr-5" role="status" aria-live="polite">
      <span className="hanko stamp-in h-14 w-14 text-lg" style={{ borderRadius: '50%' }}>{s.kanji}</span>
      <div>
        <p className="font-serif text-xs font-bold uppercase tracking-wider text-sumi/70">{t('stampEarned')}</p>
        <p className="font-serif font-extrabold">{pick(s.label, lang)}</p>
      </div>
    </div>
  );
}

/** Mapa: pergamino con el plano del castillo; cada sala teletransporta. */
export function MapScroll() {
  const t = useT();
  const nav = useNav();
  const pathname = usePathname();
  const room = roomFromPath(pathname);
  const { panel, lang } = useStore();
  if (panel !== 'map') return null;
  const spots = [
    { id: 'home', x: 50, y: 82, kanji: '門', label: t('gate'), path: '/' },
    { id: 'about', x: 22, y: 64, kanji: '物語', path: '/about/' },
    { id: 'watchtower', x: 22, y: 50, kanji: '見張り台', path: '/watchtower/' },
    { id: 'dojo', x: 22, y: 37, kanji: '道場', path: '/dojo/' },
    { id: 'archive', x: 22, y: 24, kanji: '巻物庫', path: '/archive/' },
    { id: 'harbor', x: 84, y: 86, kanji: '港', path: '/harbor/' },
    { id: 'kura', x: 44, y: 12, kanji: '蔵', path: '/kura/' },
  ];
  return (
    <div className="fixed inset-0 z-40 flex items-start justify-center bg-sumi/40 p-3 pt-16" onClick={() => useStore.setState({ panel: null })}>
      <div className="fade-up relative w-full max-w-2xl" role="dialog" aria-label={t('map')} onClick={(e) => e.stopPropagation()}>
        <div className="wood h-4 rounded-full border-2 border-sumi" />
        <div className="washi relative mx-2 aspect-[4/3] border-x-2 border-sumi">
          <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full" aria-hidden="true">
            <defs><linearGradient id="sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3c5a80" stopOpacity=".2" /><stop offset="1" stopColor="#1F3A5F" /></linearGradient></defs>
            <rect x="0" y="230" width="400" height="70" fill="url(#sea)" />
            <path d="M0 236 C40 226 80 240 120 232 C160 224 200 240 240 232 C280 224 320 238 400 228" fill="none" stroke="#1A1A1A" strokeWidth="3" />
            <rect x="30" y="20" width="340" height="208" fill="#e2d3b5" stroke="#1A1A1A" strokeWidth="4" />
            <rect x="60" y="40" width="22" height="160" fill="#efe5d0" stroke="#1A1A1A" strokeWidth="3" />
            <path d="M88 200 L88 44" stroke="#8a6a43" strokeWidth="8" />
            <rect x="230" y="40" width="80" height="80" fill="#9d9584" stroke="#1A1A1A" strokeWidth="3" />
            <rect x="248" y="58" width="44" height="44" fill="#1F3A5F" stroke="#1A1A1A" strokeWidth="3" />
            <ellipse cx="160" cy="130" rx="30" ry="18" fill="#1F3A5F" stroke="#1A1A1A" strokeWidth="3" />
            <rect x="185" y="226" width="30" height="74" fill="#8a6a43" stroke="#1A1A1A" strokeWidth="3" />
            <rect x="160" y="216" width="80" height="16" fill="#1F3A5F" stroke="#1A1A1A" strokeWidth="3" />
            <rect x="320" y="250" width="60" height="10" fill="#8a6a43" stroke="#1A1A1A" strokeWidth="2" />
            {[[120, 60], [330, 160], [200, 90], [140, 190]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="10" fill="#4A6B4F" stroke="#1A1A1A" strokeWidth="2.5" />)}
            <text x="270" y="86" textAnchor="middle" fontSize="16" fontWeight="800" fill="#F2E8D5" fontFamily="Shippori Mincho, serif">天守</text>
          </svg>
          {spots.map((s) => {
            const here = s.id === room;
            const r = rooms.find((x) => x.id === s.id);
            return (
              <button
                key={s.id}
                onClick={() => nav(s.path)}
                className="group absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${s.x}%`, top: `${s.y}%` }}
                aria-current={here ? 'page' : undefined}
              >
                <span className={`ink block whitespace-nowrap px-2 py-1 font-serif text-xs font-extrabold transition-transform group-hover:scale-110 ${here ? 'bg-ochre' : 'bg-washi'}`}>
                  {s.kanji} <span className="font-sans text-[10px] font-semibold">{r ? pick(r.label, lang) : s.label}</span>
                </span>
                {here ? <span className="hanko stamp-in absolute -right-6 -top-6 h-9 w-9 text-[10px]" style={{ borderRadius: '50%' }} title={t('here')}>現在</span> : null}
              </button>
            );
          })}
        </div>
        <div className="wood h-4 rounded-full border-2 border-sumi" />
      </div>
    </div>
  );
}
