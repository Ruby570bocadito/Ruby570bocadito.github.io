import { useCallback, useEffect, useRef } from 'react';
import { ContactButton } from '../components/Buttons';
import { FadeIn } from '../components/FadeIn';
import { FitText } from '../components/FitText';
import { LangToggle } from '../components/LangToggle';
import { Magnet } from '../components/Magnet';
import { useRiveArtboard } from '../components/RiveKit';
import { hero, nav, ui } from '../content';
import { useLang } from '../i18n';
import { asset, useFinePointer } from '../lib/hooks';

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
// Misma caja para la capa trasera (anillos) y el retrato, así quedan alineados.
const PORTRAIT_BOX =
  'pointer-events-none absolute left-1/2 top-1/2 w-[280px] -translate-x-1/2 -translate-y-1/2 sm:bottom-0 sm:top-auto sm:w-[min(360px,58vh)] sm:translate-y-0 md:w-[min(440px,60vh)] lg:w-[min(520px,62vh)]';

export function Hero() {
  const { t } = useLang();
  const fine = useFinePointer();
  const section = useRef<HTMLElement>(null);
  const back = useRiveArtboard({ artboard: 'hero', stateMachine: 'hero' });
  const front = useRiveArtboard({ artboard: 'hero_frame', stateMachine: 'hero' });
  const { set: setBack, fire: fireBack } = back;
  const { set: setFront } = front;

  // El escáner sigue al cursor por toda la sección.
  useEffect(() => {
    if (!fine) return undefined;
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = section.current?.getBoundingClientRect();
        if (!r || r.bottom < 0) return;
        const x = clamp(((e.clientX - r.left) / r.width) * 100, 0, 100);
        const y = clamp(((e.clientY - r.top) / r.height) * 100, 0, 100);
        setBack('x', x); setBack('y', y);
        setFront('x', x); setFront('y', y);
      });
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
    };
  }, [fine, setBack, setFront]);

  const onActive = useCallback(
    (active: boolean) => {
      setBack('active', active);
      setFront('active', active);
    },
    [setBack, setFront]
  );

  return (
    <section ref={section} id="top" className="relative flex h-[100svh] min-h-[620px] flex-col" style={{ overflowX: 'clip' }}>
      <FadeIn as="nav" delay={0} y={-20} aria-label="Principal" className="relative z-30 flex items-center justify-between gap-3 px-6 pt-6 md:px-10 md:pt-8">
        {nav.map(item => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="text-sm font-medium uppercase tracking-wider text-[#D7E2EA] transition-opacity duration-200 hover:opacity-70 md:text-lg lg:text-[1.4rem]"
          >
            {t(item.label)}
          </a>
        ))}
        <LangToggle id="hero-lang" className="hidden sm:inline-flex" />
      </FadeIn>

      {/* Capa trasera: halo + anillos Rive, por detrás del titular */}
      <div className={`${PORTRAIT_BOX} z-0`} aria-hidden="true">
        <FadeIn delay={0.6} y={30} className="relative aspect-[1040/1007]">
          <div
            className="absolute bottom-0 left-1/2 h-[75%] w-[115%] -translate-x-1/2"
            style={{ background: 'radial-gradient(closest-side, rgba(118,33,176,0.38), rgba(182,0,168,0.12) 55%, transparent 100%)' }}
          />
          <div className="absolute left-[48.5%] top-[38%] aspect-square w-[150%] -translate-x-1/2 -translate-y-1/2">
            <back.RiveComponent className="h-full w-full" />
          </div>
        </FadeIn>
      </div>

      <div className="relative z-[1] overflow-hidden px-4 sm:px-6 md:px-10">
        <FadeIn delay={0.15} y={40} className="mt-6 sm:mt-4 md:-mt-2">
          <FitText className="hero-heading pb-[0.04em] pr-[0.03em] font-black uppercase leading-none tracking-tight">
            {t(hero.heading)}
          </FitText>
        </FadeIn>
      </div>

      {/* Retrato (magnético) + corchetes Rive delante */}
      <div className={`${PORTRAIT_BOX} z-10`}>
        <FadeIn delay={0.6} y={30} className="relative">
          <Magnet padding={150} strength={3} activeTransition="transform 0.3s ease-out" inactiveTransition="transform 0.6s ease-in-out" onActiveChange={onActive}>
            <button
              type="button"
              onClick={() => fireBack('ping')}
              className="pointer-events-auto relative block w-full cursor-crosshair focus-visible:outline-none"
              aria-label={t(hero.portraitAlt)}
              title={t(hero.scannerHint)}
            >
              <img
                src={asset('img/portrait-1040.webp')}
                srcSet={`${asset('img/portrait-640.webp')} 640w, ${asset('img/portrait-1040.webp')} 1040w`}
                sizes="(min-width: 1024px) min(520px, 62vh), (min-width: 768px) min(440px, 60vh), (min-width: 640px) min(360px, 58vh), 280px"
                width={1040}
                height={1007}
                alt={t(hero.portraitAlt)}
                fetchPriority="high"
                className="mask-fade-b h-auto w-full select-none"
                draggable={false}
              />
              <div className="pointer-events-none absolute left-[48.5%] top-[38%] aspect-square w-[150%] -translate-x-1/2 -translate-y-1/2" aria-hidden="true">
                <front.RiveComponent className="h-full w-full" />
              </div>
            </button>
          </Magnet>
        </FadeIn>
      </div>

      <div className="relative z-20 mt-auto flex items-end justify-between gap-4 px-6 pb-7 sm:pb-8 md:px-10 md:pb-10">
        <FadeIn delay={0.35} y={20} className="flex flex-col items-start">
          <LangToggle id="hero-lang-m" className="mb-3 sm:hidden" />
          <span className="mb-3 inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-[#D7E2EA]/20 bg-[#0C0C0C]/60 px-3 py-1 text-[10px] font-medium uppercase tracking-widest text-[#D7E2EA] backdrop-blur sm:text-xs">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60 motion-reduce:hidden" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            {t(hero.status)}
          </span>
          <p className="max-w-[160px] font-light uppercase leading-snug tracking-wide text-[#D7E2EA] sm:max-w-[220px] md:max-w-[260px]" style={{ fontSize: 'clamp(0.75rem, 1.4vw, 1.5rem)' }}>
            {t(hero.tagline)}
          </p>
        </FadeIn>
        <FadeIn delay={0.5} y={20}>
          <ContactButton href="#contact">{t(ui.contactMe)}</ContactButton>
        </FadeIn>
      </div>
    </section>
  );
}
