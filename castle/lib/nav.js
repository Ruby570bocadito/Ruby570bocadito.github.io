'use client';
import { useRouter, usePathname } from 'next/navigation';
import { useStore } from './store';
import { sfx } from './audio';

const norm = (p) => (p.endsWith('/') ? p : p + '/');

/** Navegación con puertas shōji: cierran → cambia la ruta → abren. */
export function useNav() {
  const router = useRouter();
  const pathname = usePathname();
  return (href) => {
    const s = useStore.getState();
    if (s.shoji !== 'open') return;
    if (norm(href) === norm(pathname)) { useStore.setState({ panel: null }); return; }
    if (norm(pathname) === '/' && typeof window !== 'undefined') useStore.setState({ savedScroll: window.scrollY });
    sfx('paper');
    const instant = s.mode !== '3d';
    useStore.setState({ shoji: instant ? 'open' : 'closing', panel: null, project: null, cert: null, kuraItem: null, letter: false });
    if (href === '/' || href === '/#') useStore.setState({ phase: 'walk' });
    if (instant) { router.push(href); return; }
    setTimeout(() => {
      useStore.setState({ shoji: 'closed' });
      router.push(href);
    }, 560);
  };
}

export function roomFromPath(pathname) {
  const seg = (pathname || '/').split('/').filter(Boolean)[0];
  return seg || 'home';
}
