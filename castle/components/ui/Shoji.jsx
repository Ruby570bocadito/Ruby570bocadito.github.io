'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useStore } from '@/lib/store';

/** Puertas shōji de papel que cierran y abren entre salas. */
export default function Shoji() {
  const state = useStore((s) => s.shoji);
  const pathname = usePathname();
  useEffect(() => {
    if (useStore.getState().shoji !== 'closed') return;
    let tries = 0;
    const id = setInterval(() => {
      tries++;
      if (useStore.getState().sceneReady || tries > 30) {
        clearInterval(id);
        useStore.setState({ shoji: 'opening' });
        setTimeout(() => useStore.setState({ shoji: 'open' }), 650);
      }
    }, 60);
    return () => clearInterval(id);
  }, [pathname]);
  const closed = state === 'closing' || state === 'closed';
  const panel = 'absolute top-0 h-full w-1/2 transition-transform duration-[550ms] ease-[cubic-bezier(.7,0,.3,1)] border-sumi';
  const lattice = {
    backgroundColor: '#F2E8D5',
    backgroundImage:
      'repeating-linear-gradient(90deg, #5e4429 0 6px, transparent 6px 25%), repeating-linear-gradient(180deg, #5e4429 0 6px, transparent 6px 16.66%)',
  };
  return (
    <div className="pointer-events-none fixed inset-0 z-[80]" aria-hidden="true">
      <div className={`${panel} left-0 border-r-[6px]`} style={{ ...lattice, transform: closed ? 'translateX(0)' : 'translateX(-100%)' }} />
      <div className={`${panel} right-0 border-l-[6px]`} style={{ ...lattice, transform: closed ? 'translateX(0)' : 'translateX(100%)' }} />
    </div>
  );
}
