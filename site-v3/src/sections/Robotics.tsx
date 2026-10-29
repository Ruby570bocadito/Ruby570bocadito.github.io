import { Hand, Trophy } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { FadeIn } from '../components/FadeIn';
import { useRiveArtboard } from '../components/RiveKit';
import { robotics } from '../content';
import { useLang } from '../i18n';
import { asset, useFinePointer } from '../lib/hooks';

const clamp = (v: number) => Math.min(100, Math.max(0, v));

function RobotCanvas() {
  const { t } = useLang();
  const fine = useFinePointer();
  const box = useRef<HTMLDivElement>(null);
  const { RiveComponent, set, fire } = useRiveArtboard({ artboard: 'robot', stateMachine: 'robot', listeners: true });

  // Los ojos siguen al cursor esté donde esté.
  useEffect(() => {
    if (!fine) return undefined;
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = box.current?.getBoundingClientRect();
        if (!r) return;
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height * 0.56;
        set('x', clamp(50 + ((e.clientX - cx) / (window.innerWidth * 0.45)) * 50));
        set('y', clamp(50 + ((e.clientY - cy) / (window.innerHeight * 0.45)) * 50));
      });
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
    };
  }, [fine, set]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div ref={box} className="relative aspect-square w-full max-w-[460px]" role="img" aria-label={t(robotics.robotLabel)}>
        <div className="pointer-events-none absolute inset-[12%] rounded-full bg-[#B600A8]/25 blur-[70px]" aria-hidden="true" />
        <RiveComponent className="relative h-full w-full cursor-pointer" />
      </div>
      <p className="text-center text-xs uppercase tracking-widest text-[#D7E2EA]/50">{t(robotics.robotHint)}</p>
      <button
        type="button"
        onClick={() => fire('poke')}
        className="inline-flex items-center gap-2 rounded-full border border-[#D7E2EA]/25 px-4 py-2 text-xs font-medium uppercase tracking-widest text-[#D7E2EA] transition-colors hover:bg-white/10"
      >
        <Hand className="h-4 w-4" aria-hidden="true" /> {t(robotics.robotButton)}
      </button>
    </div>
  );
}

export function Robotics() {
  const { t } = useLang();
  return (
    <section id="robotics" className="relative overflow-hidden rounded-[40px] bg-gradient-to-b from-[#140A1C] to-[#0C0C0C] px-5 py-24 sm:mx-4 sm:rounded-[50px] sm:px-8 md:mx-6 md:rounded-[60px] md:px-10 md:py-32">
      <div className="noise pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="relative mx-auto max-w-6xl">
        <FadeIn y={40}>
          <h2 className="hero-heading text-center font-black uppercase leading-[0.95] tracking-tight" style={{ fontSize: 'clamp(2.6rem, 9vw, 128px)' }}>
            {t(robotics.heading)}
          </h2>
        </FadeIn>

        <div className="mt-14 grid items-center gap-12 md:mt-20 lg:grid-cols-2">
          <FadeIn y={30}>
            <RobotCanvas />
          </FadeIn>

          <div className="flex flex-col gap-8">
            <FadeIn y={30} className="flex items-center gap-4">
              <img src={asset('img/obj-trophy.webp')} alt="" aria-hidden="true" loading="lazy" className="w-20 md:w-24" />
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-[#B600A8]/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-[#F3A6EC]">
                  <Trophy className="h-3.5 w-3.5" aria-hidden="true" /> {t(robotics.badge)}
                </span>
                <h3 className="mt-3 text-2xl font-semibold leading-tight text-white md:text-3xl">{t(robotics.title)}</h3>
              </div>
            </FadeIn>

            <FadeIn y={30} delay={0.05} className="grid grid-cols-3 gap-3">
              {robotics.highlights.map(h => (
                <div key={h.label.es} className="glass-card rounded-3xl px-3 py-5 text-center">
                  <span className="accent-text block text-3xl font-black md:text-4xl">{t(h.v)}</span>
                  <span className="mt-1 block text-[11px] uppercase tracking-widest text-[#D7E2EA]/65">{t(h.label)}</span>
                </div>
              ))}
            </FadeIn>

            <FadeIn y={30} delay={0.1}>
              <p className="font-light leading-relaxed text-[#D7E2EA]/85 md:text-lg">{t(robotics.text)}</p>
            </FadeIn>

            <FadeIn y={30} delay={0.15}>
              <ul className="flex flex-wrap gap-2">
                {robotics.skills.map(s => (
                  <li key={s.es} className="rounded-full border border-[#D7E2EA]/15 px-4 py-2 text-sm text-[#D7E2EA]">
                    {t(s)}
                  </li>
                ))}
              </ul>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
