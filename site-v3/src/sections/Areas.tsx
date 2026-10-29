import { useEffect, useRef, useState } from 'react';
import { FadeIn } from '../components/FadeIn';
import { useRiveArtboard } from '../components/RiveKit';
import { areas, type RiveIcon } from '../content';
import { useLang } from '../i18n';
import { useFinePointer } from '../lib/hooks';

function AreaIcon({ icon, active }: { icon: RiveIcon; active: boolean }) {
  const { RiveComponent, set } = useRiveArtboard({ artboard: icon, stateMachine: 'icon' });
  useEffect(() => set('hover', active), [active, set]);
  return <RiveComponent className="h-full w-full" aria-hidden="true" />;
}

function AreaRow({ item, index }: { item: (typeof areas.items)[number]; index: number }) {
  const { t } = useLang();
  const fine = useFinePointer();
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLLIElement>(null);

  // En táctil, la fila se "activa" al pasar por el centro de la pantalla.
  useEffect(() => {
    if (fine || !ref.current) return undefined;
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { rootMargin: '-42% 0px -42% 0px' });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [fine]);

  return (
    <FadeIn
      as="li"
      ref={ref}
      delay={index * 0.1}
      onMouseEnter={() => fine && setActive(true)}
      onMouseLeave={() => fine && setActive(false)}
      className="group relative flex items-start gap-5 border-t py-8 sm:gap-8 sm:py-10 md:items-center md:gap-12 md:py-12"
      style={{ borderColor: 'rgba(12, 12, 12, 0.15)' }}
    >
      <span
        className="font-black leading-none text-[#0C0C0C] transition-colors duration-300 group-hover:text-[#B600A8]"
        style={{ fontSize: 'clamp(3rem, 10vw, 140px)' }}
      >
        {String(index + 1).padStart(2, '0')}
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-2 md:gap-3">
        <h3 className="font-medium uppercase text-[#0C0C0C]" style={{ fontSize: 'clamp(1rem, 2.2vw, 2.1rem)' }}>
          {t(item.name)}
        </h3>
        <p className="max-w-2xl font-light leading-relaxed text-[#0C0C0C] opacity-60" style={{ fontSize: 'clamp(0.85rem, 1.6vw, 1.25rem)' }}>
          {t(item.desc)}
        </p>
        <ul className="mt-1 flex flex-wrap gap-1.5">
          {item.tags.map(tag => (
            <li key={typeof tag === 'string' ? tag : tag.es} className="rounded-full border border-[#0C0C0C]/15 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider text-[#0C0C0C]/70 sm:text-xs">
              {t(tag)}
            </li>
          ))}
        </ul>
      </div>
      <div className="hidden h-24 w-24 shrink-0 sm:block md:h-28 md:w-28 lg:h-32 lg:w-32">
        <AreaIcon icon={item.icon} active={active} />
      </div>
    </FadeIn>
  );
}

export function Areas() {
  const { t } = useLang();
  return (
    <section id="areas" className="relative z-0 rounded-t-[40px] bg-white px-5 py-20 sm:rounded-t-[50px] sm:px-8 sm:py-24 md:rounded-t-[60px] md:px-10 md:py-32">
      <FadeIn y={40}>
        <h2 className="mb-16 text-center font-black uppercase leading-none tracking-tight text-[#0C0C0C] sm:mb-20 md:mb-28" style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}>
          {t(areas.heading)}
        </h2>
      </FadeIn>
      <ul className="mx-auto max-w-5xl border-b" style={{ borderColor: 'rgba(12, 12, 12, 0.15)' }}>
        {areas.items.map((item, i) => (
          <AreaRow key={item.icon} item={item} index={i} />
        ))}
      </ul>
    </section>
  );
}
