'use client';
import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { useStore } from '@/lib/store';
import { useT } from '@/lib/i18n';
import { roomFromPath } from '@/lib/nav';
import Loader from './Loader';
import Shoji from './Shoji';
import Terminal from './Terminal';
import Overlays from './Overlays';
import { TopBar, AudioPanel, StampBook, StampToast, MapScroll } from './Chrome';

const Experience = dynamic(() => import('../three/Experience'), { ssr: false });

function hasWebGL() {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch { return false; }
}

export default function Shell({ children }) {
  const pathname = usePathname();
  const room = roomFromPath(pathname);
  const mode = useStore((s) => s.mode);
  const loaderDone = useStore((s) => s.loaderDone);
  const lang = useStore((s) => s.lang);
  const t = useT();

  // estado persistido + decisión 3D / 2D
  useEffect(() => {
    const had = (() => { try { return !!localStorage.getItem('castillo-vigia'); } catch { return false; } })();
    useStore.persist.rehydrate();
    if (!had) {
      const nl = (navigator.language || 'es').slice(0, 2);
      useStore.setState({ lang: nl === 'ja' ? 'ja' : nl === 'es' ? 'es' : 'en' });
    }
    const small = matchMedia('(max-width: 820px), (pointer: coarse)').matches;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const params = new URLSearchParams(location.search);
    const forced = params.get('mode');
    const pref = forced === '2d' || forced === '3d' ? forced : useStore.getState().modePref;
    const gl = hasWebGL();
    useStore.setState({ mode: !gl ? '2d' : pref || (small || reduced ? '2d' : '3d'), reduced });
  }, []);

  // entrar directamente a una sala salta la intro
  useEffect(() => {
    if (room !== 'home' && useStore.getState().phase === 'intro') useStore.setState({ phase: 'walk' });
  }, [room]);

  useEffect(() => { document.documentElement.lang = lang; }, [lang]);

  // progreso del loader
  useEffect(() => {
    if (!mode) return;
    const s = useStore.getState();
    if (s.loaderDone) return;
    if (mode === '2d' && s.reduced) { useStore.setState({ progress: 100, loaderDone: true }); return; }
    let p = s.progress;
    const id = setInterval(() => {
      const ready = mode === '2d' || useStore.getState().sceneReady;
      p = Math.min(ready ? 100 : 88, p + (ready ? (mode === '2d' ? 5 : 4) : 1.6));
      useStore.setState({ progress: p });
      if (p >= 100) { clearInterval(id); setTimeout(() => useStore.setState({ loaderDone: true }), 450); }
    }, 40);
    return () => clearInterval(id);
  }, [mode]);

  return (
    <>
      <a href="#main" className="skip-link ink bg-ochre px-4 py-2 font-serif font-bold" onClick={() => { useStore.getState().setMode('2d'); setTimeout(() => document.getElementById('main')?.focus(), 50); }}>
        {t('skip')}
      </a>
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <filter id="hanko-rough"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="4" /><feDisplacementMap in="SourceGraphic" scale="1.4" /></filter>
      </svg>
      <Loader />
      {mode === '3d' ? <Experience room={room} /> : null}
      {mode === '3d' ? <div className="washi-overlay" aria-hidden="true" /> : null}
      {mode === '3d' ? <div className="print-vignette" aria-hidden="true" /> : null}
      {mode === '3d' && loaderDone ? (
        <div className={`signature ${room === 'harbor' || room === 'kura' ? 'on-dark' : ''}`} aria-hidden="true">
          <span className="sig" lang="ja">ラファエル画</span>
          <span className="hanko text-[10px] leading-tight" style={{ padding: '3px 4px' }}>見<br />張</span>
        </div>
      ) : null}
      {mode ? <TopBar /> : null}
      <AudioPanel />
      <StampBook />
      <MapScroll />
      <StampToast />
      <Terminal />
      <Shoji />
      {mode === '3d' ? <Overlays room={room} /> : null}
      <main id="main" tabIndex={-1} className={mode === '3d' ? 'hidden' : 'washi relative z-10 mx-auto min-h-screen max-w-6xl px-4 pb-16 pt-20 md:px-8 outline-none'}>
        {children}
      </main>
    </>
  );
}
