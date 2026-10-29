import { AnimatedText } from '../components/AnimatedText';
import { ContactButton } from '../components/Buttons';
import { CountUp } from '../components/CountUp';
import { FadeIn } from '../components/FadeIn';
import { about, ui } from '../content';
import { useLang } from '../i18n';
import { asset } from '../lib/hooks';

const corners = [
  { src: 'img/obj-padlock.webp', cls: 'top-[4%] left-[1%] w-[120px] sm:left-[2%] sm:w-[160px] md:left-[4%] md:w-[210px]', delay: 0.1, x: -80 },
  { src: 'img/obj-robot.webp', cls: 'bottom-[8%] left-[3%] w-[100px] sm:left-[6%] sm:w-[140px] md:left-[10%] md:w-[180px]', delay: 0.25, x: -80 },
  { src: 'img/obj-shield.webp', cls: 'top-[4%] right-[1%] w-[120px] sm:right-[2%] sm:w-[160px] md:right-[4%] md:w-[210px]', delay: 0.15, x: 80 },
  { src: 'img/obj-chip.webp', cls: 'bottom-[8%] right-[3%] w-[130px] sm:right-[6%] sm:w-[170px] md:right-[10%] md:w-[220px]', delay: 0.3, x: 80 }
];

export function About() {
  const { t } = useLang();
  return (
    <>
      <section id="about" className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-5 py-20 sm:px-8 md:px-10">
        {corners.map(c => (
          <FadeIn key={c.src} delay={c.delay} x={c.x} y={0} duration={0.9} className={`pointer-events-none absolute ${c.cls}`} aria-hidden="true">
            <img src={asset(c.src)} alt="" loading="lazy" decoding="async" className="h-auto w-full animate-[float_7s_ease-in-out_infinite] motion-reduce:animate-none" />
          </FadeIn>
        ))}

        <div className="relative z-10 flex flex-col items-center gap-16 sm:gap-20 md:gap-24">
          <div className="flex flex-col items-center gap-10 sm:gap-14 md:gap-16">
            <FadeIn delay={0} y={40}>
              <h2 className="hero-heading text-center font-black uppercase leading-none tracking-tight" style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}>
                {t(about.heading)}
              </h2>
            </FadeIn>
            <AnimatedText
              text={t(about.text)}
              className="max-w-[560px] text-center font-medium leading-relaxed text-[#D7E2EA]"
              style={{ fontSize: 'clamp(1rem, 2vw, 1.35rem)' }}
            />
          </div>
          <FadeIn delay={0.2} y={20}>
            <ContactButton href="#contact">{t(ui.contactMe)}</ContactButton>
          </FadeIn>
        </div>
      </section>

      {/* Datos rápidos: fuera de la composición de "Sobre mí" para no chocar con los objetos 3D */}
      <section aria-label={t({ es: 'Datos rápidos', en: 'Quick facts' })} className="relative px-5 pb-28 sm:px-8 md:px-10">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-12 border-t border-[#D7E2EA]/10 pt-14">
          <FadeIn delay={0.1} y={20} className="grid w-full max-w-4xl grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4">
            {about.stats.map(s => (
              <div key={s.label.es} className="text-center">
                <CountUp to={s.to} suffix={s.suffix} className="block text-4xl font-semibold text-white md:text-5xl" />
                <span className="mt-1 block text-xs font-light uppercase tracking-widest text-[#D7E2EA]/70 md:text-sm">{t(s.label)}</span>
              </div>
            ))}
          </FadeIn>
          <FadeIn delay={0.15} y={20}>
            <dl className="flex flex-wrap justify-center gap-2 sm:gap-3">
              {about.facts.map(f => (
                <div key={f.k.es} className="glass-card flex items-center gap-2 rounded-full px-4 py-2 text-xs sm:text-sm">
                  <dt className="uppercase tracking-widest text-[#D7E2EA]/55">{t(f.k)}</dt>
                  <dd className="font-medium text-[#D7E2EA]">{t(f.v)}</dd>
                </div>
              ))}
            </dl>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
