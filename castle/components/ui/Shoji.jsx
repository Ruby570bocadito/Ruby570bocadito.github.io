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
  const panel = (side) => (
    <div
      className="shoji-panel"
      style={{
        [side]: 0,
        transform: closed ? 'translateX(0)' : `translateX(${side === 'left' ? '-102%' : '102%'})`,
      }}
    >
      <div className="shoji-grid">
        {Array.from({ length: 24 }, (_, i) => <span key={i} />)}
      </div>
      <span className="shoji-pull" style={{ [side === 'left' ? 'right' : 'left']: '22px' }} />
    </div>
  );
  return (
    <div className="pointer-events-none fixed inset-0 z-[80]" aria-hidden="true" style={{ visibility: state === 'open' ? 'hidden' : 'visible' }}>
      {panel('left')}
      {panel('right')}
    </div>
  );
}
