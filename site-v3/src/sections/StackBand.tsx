import { motion, useScroll, useTransform } from 'framer-motion';
import { Fragment, useRef } from 'react';
import { stackWords } from '../content';
import { useLang } from '../i18n';

/** Banda de tecnologías en dos filas que se desplazan en sentidos opuestos con el scroll. */
export function StackBand() {
  const { t } = useLang();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const x1 = useTransform(scrollYProgress, [0, 1], ['-8%', '-38%']);
  const x2 = useTransform(scrollYProgress, [0, 1], ['-38%', '-8%']);

  const row = (words: typeof stackWords.top, outlinedEven: boolean) =>
    [...words, ...words, ...words].map((w, i) => (
      <Fragment key={i}>
        <span
          className={`whitespace-nowrap font-black uppercase leading-none tracking-tight ${
            (i % 2 === 0) === outlinedEven ? 'text-transparent' : 'text-[#D7E2EA]'
          }`}
          style={(i % 2 === 0) === outlinedEven ? { WebkitTextStroke: '1.5px rgba(215,226,234,0.55)' } : undefined}
        >
          {t(w)}
        </span>
        <span className="accent-text select-none font-black leading-none" aria-hidden="true">
          ✦
        </span>
      </Fragment>
    ));

  return (
    <div ref={ref} className="relative overflow-hidden border-y border-[#D7E2EA]/10 py-10 md:py-14" aria-label="Tecnologías">
      <motion.div style={{ x: x1, fontSize: 'clamp(2.2rem, 7vw, 6.5rem)' }} className="flex w-max items-center gap-6 md:gap-10">
        {row(stackWords.top, true)}
      </motion.div>
      <motion.div style={{ x: x2, fontSize: 'clamp(2.2rem, 7vw, 6.5rem)' }} className="mt-3 flex w-max items-center gap-6 md:mt-5 md:gap-10">
        {row(stackWords.bottom, false)}
      </motion.div>
    </div>
  );
}
