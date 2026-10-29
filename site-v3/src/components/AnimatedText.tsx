import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { useRef, type CSSProperties } from 'react';

function Char({ char, progress, range }: { char: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.2, 1]);
  return (
    <span className="relative">
      <span className="invisible">{char}</span>
      <motion.span className="absolute left-0 top-0" style={{ opacity }}>
        {char}
      </motion.span>
    </span>
  );
}

/** Texto que se "enciende" carácter a carácter según el scroll. */
export function AnimatedText({ text, className, style }: { text: string; className?: string; style?: CSSProperties }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.8', 'end 0.2'] });
  const words = text.split(' ');
  const total = text.length;
  let index = 0;

  return (
    <p ref={ref} className={className} style={style}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, wi) => {
          const chars = Array.from(word).map(char => {
            const start = index / total;
            const end = (index + 1) / total;
            index += 1;
            return { char, range: [start, end] as [number, number] };
          });
          index += 1; // espacio
          return (
            <span key={wi}>
              <span className="inline-block whitespace-nowrap">
                {chars.map((c, ci) => (
                  <Char key={ci} char={c.char} progress={scrollYProgress} range={c.range} />
                ))}
              </span>
              {wi < words.length - 1 ? ' ' : null}
            </span>
          );
        })}
      </span>
    </p>
  );
}
