import { useLayoutEffect, useRef, type ReactNode } from 'react';

/**
 * Titular de una línea que se escala para ocupar exactamente el ancho disponible
 * (el texto cambia de longitud según el idioma).
 */
export function FitText({ children, className = '', max = 420, min = 28 }: { children: ReactNode; className?: string; max?: number; min?: number }) {
  const ref = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    const parent = el?.parentElement;
    if (!el || !parent) return undefined;
    const fit = () => {
      const cs = getComputedStyle(parent);
      const avail = parent.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      el.style.fontSize = '100px';
      const natural = el.getBoundingClientRect().width;
      if (!natural || !avail) return;
      el.style.fontSize = `${Math.max(min, Math.min(max, (100 * avail) / natural)).toFixed(2)}px`;
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(parent);
    document.fonts?.ready.then(fit).catch(() => undefined);
    return () => ro.disconnect();
  }, [children, max, min]);

  return (
    <h1 ref={ref} className={`w-max whitespace-nowrap ${className}`} style={{ fontSize: 'clamp(2.5rem, 11.4vw, 14rem)' }}>
      {children}
    </h1>
  );
}
