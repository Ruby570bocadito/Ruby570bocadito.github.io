import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import { useFinePointer, usePrefersReducedMotion } from '../lib/hooks';

type MagnetProps = {
  children: ReactNode;
  /** Distancia (px) alrededor del elemento en la que el cursor lo atrae. */
  padding?: number;
  /** Cuanto mayor, menos se desplaza. */
  strength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
  className?: string;
  innerClassName?: string;
  style?: CSSProperties;
  onActiveChange?: (active: boolean) => void;
};

/** Efecto magnético: el contenido sigue al cursor cuando está cerca. */
export function Magnet({
  children,
  padding = 100,
  strength = 2,
  activeTransition = 'transform 0.3s ease-out',
  inactiveTransition = 'transform 0.6s ease-in-out',
  className,
  innerClassName,
  style,
  onActiveChange
}: MagnetProps) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const active = useRef(false);
  const onChange = useRef(onActiveChange);
  onChange.current = onActiveChange;
  const fine = useFinePointer();
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (!fine || reduced) return undefined;
    let frame = 0;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const el = outer.current;
        const target = inner.current;
        if (!el || !target) return;
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const near = Math.abs(cx - e.clientX) < r.width / 2 + padding && Math.abs(cy - e.clientY) < r.height / 2 + padding;
        if (near) {
          target.style.transition = activeTransition;
          target.style.transform = `translate3d(${(e.clientX - cx) / strength}px, ${(e.clientY - cy) / strength}px, 0)`;
        } else {
          target.style.transition = inactiveTransition;
          target.style.transform = 'translate3d(0, 0, 0)';
        }
        if (near !== active.current) {
          active.current = near;
          onChange.current?.(near);
        }
      });
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('mousemove', onMove);
    };
  }, [fine, reduced, padding, strength, activeTransition, inactiveTransition]);

  return (
    <div ref={outer} className={className} style={style}>
      <div ref={inner} className={innerClassName} style={{ willChange: 'transform' }}>
        {children}
      </div>
    </div>
  );
}
