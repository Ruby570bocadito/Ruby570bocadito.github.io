import { animate, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useLang } from '../i18n';
import { usePrefersReducedMotion } from '../lib/hooks';

/** Número que cuenta desde 0 al entrar en pantalla. */
export function CountUp({ to, suffix = '', duration = 1.6, className }: { to: number; suffix?: string; duration?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const reduced = usePrefersReducedMotion();
  const { lang } = useLang();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return undefined;
    if (reduced) {
      setValue(to);
      return undefined;
    }
    const controls = animate(0, to, { duration, ease: [0.16, 1, 0.3, 1], onUpdate: v => setValue(Math.round(v)) });
    return () => controls.stop();
  }, [inView, to, duration, reduced]);

  return (
    <span ref={ref} className={className}>
      {value.toLocaleString(lang === 'es' ? 'es-ES' : 'en-US')}
      {suffix}
    </span>
  );
}
