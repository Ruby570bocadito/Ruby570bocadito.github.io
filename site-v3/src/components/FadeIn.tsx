import { motion, type HTMLMotionProps } from 'framer-motion';
import { forwardRef, type ElementType, type ReactNode } from 'react';

type FadeInProps = Omit<HTMLMotionProps<'div'>, 'initial' | 'whileInView' | 'viewport' | 'transition' | 'ref'> & {
  as?: keyof JSX.IntrinsicElements;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  children?: ReactNode;
};

const cache = new Map<string, ElementType>();
function motionTag(tag: string): ElementType {
  let comp = cache.get(tag);
  if (!comp) {
    comp = motion.create(tag as 'div') as ElementType;
    cache.set(tag, comp);
  }
  return comp;
}

/** Aparece al entrar en pantalla (una sola vez). */
export const FadeIn = forwardRef<HTMLElement, FadeInProps>(function FadeIn(
  { as = 'div', delay = 0, duration = 0.7, x = 0, y = 30, children, ...rest },
  ref
) {
  const Comp = motionTag(as);
  return (
    <Comp
      ref={ref}
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '50px', amount: 0 }}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
      {...rest}
    >
      {children}
    </Comp>
  );
});
