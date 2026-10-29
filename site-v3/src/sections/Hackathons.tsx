import { ArrowUpRight, CalendarDays, Cpu } from 'lucide-react';
import { useEffect, useState } from 'react';
import { FadeIn } from '../components/FadeIn';
import { hackathons } from '../content';
import { useLang } from '../i18n';
import { asset } from '../lib/hooks';

type Status = 'upcoming' | 'live' | 'past';
/** Estado según la fecha actual en Madrid (la web es estática: se calcula en el navegador). */
function statusOf(start: string, end: string, today: string): Status {
  if (today < start) return 'upcoming';
  if (today > end) return 'past';
  return 'live';
}

export function Hackathons() {
  const { t } = useLang();
  const [today, setToday] = useState<string | null>(null);
  useEffect(() => {
    setToday(new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Madrid' }).format(new Date()));
  }, []);

  return (
    <section id="hackathons" className="relative overflow-hidden px-5 py-24 sm:px-8 md:px-10 md:py-32">
      <img src={asset('img/obj-globe.webp')} alt="" aria-hidden="true" loading="lazy" className="pointer-events-none absolute -left-10 top-16 w-40 animate-[float_8s_ease-in-out_infinite] opacity-80 motion-reduce:animate-none md:left-[4%] md:w-56" />
      <img src={asset('img/obj-terminal.webp')} alt="" aria-hidden="true" loading="lazy" className="pointer-events-none absolute -right-10 top-24 w-32 animate-[float_9s_ease-in-out_infinite] opacity-80 motion-reduce:animate-none md:right-[4%] md:top-20 md:w-44" />
      <div className="relative mx-auto max-w-5xl">
        <FadeIn y={40} className="flex flex-col items-center gap-6">
          <h2 className="hero-heading text-center font-black uppercase leading-none tracking-tight" style={{ fontSize: 'clamp(2.6rem, 10vw, 140px)' }}>
            {t(hackathons.heading)}
          </h2>
          <p className="max-w-xl text-center text-sm font-light leading-relaxed text-[#D7E2EA]/75 sm:text-base">{t(hackathons.intro)}</p>
        </FadeIn>

        <ol className="relative mt-14 flex flex-col gap-4 md:mt-20">
          <span className="absolute bottom-6 left-[27px] top-6 hidden w-px bg-gradient-to-b from-[#E04BD6] via-[#7621B0] to-transparent sm:block" aria-hidden="true" />
          {hackathons.events.map((ev, i) => {
            const st = today ? statusOf(ev.start, ev.end, today) : null;
            const body = (
              <>
                <span className="relative z-10 hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#D7E2EA]/15 bg-[#0C0C0C] text-lg font-black text-white sm:flex">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="flex flex-1 flex-col gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xl font-semibold text-white md:text-2xl">{ev.name}</h3>
                    {st && (
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest ${
                          st === 'live' ? 'bg-emerald-400/15 text-emerald-300' : st === 'upcoming' ? 'bg-[#B600A8]/20 text-[#F3A6EC]' : 'bg-white/10 text-[#D7E2EA]/80'
                        }`}
                      >
                        {st === 'live' && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300" />}
                        {t(hackathons.status[st])}
                      </span>
                    )}
                  </div>
                  <p className="flex items-center gap-2 text-sm text-[#D7E2EA]/60">
                    <CalendarDays className="h-4 w-4" aria-hidden="true" /> {t(ev.when)}
                  </p>
                  <p className="font-light leading-relaxed text-[#D7E2EA]/85">{t(ev.desc)}</p>
                </div>
                {ev.href && <ArrowUpRight className="h-6 w-6 shrink-0 self-center text-[#D7E2EA]/50 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" aria-hidden="true" />}
              </>
            );
            const cls = 'glass-card group relative flex items-start gap-5 rounded-[28px] p-6 transition-colors duration-300 md:p-8';
            return (
              <FadeIn as="li" key={ev.name} y={24} delay={i * 0.1}>
                {ev.href ? (
                  <a href={ev.href} target="_blank" rel="noopener noreferrer" className={`${cls} hover:border-[#D7E2EA]/30`}>
                    {body}
                  </a>
                ) : (
                  <div className={cls}>{body}</div>
                )}
              </FadeIn>
            );
          })}
        </ol>

        <FadeIn y={24} className="mt-6 flex flex-col gap-4 rounded-[28px] border border-[#D7E2EA]/10 p-6 sm:flex-row sm:items-center md:p-8">
          <span className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-[#D7E2EA]/60">
            <Cpu className="h-4 w-4 text-[#E04BD6]" aria-hidden="true" /> {t(hackathons.aiTraining.title)}
          </span>
          <ul className="flex flex-wrap gap-2 sm:ml-auto">
            {hackathons.aiTraining.items.map(item => (
              <li key={item.es} className="rounded-full border border-[#D7E2EA]/15 px-3.5 py-1.5 text-sm text-[#D7E2EA]">
                {t(item)}
              </li>
            ))}
          </ul>
        </FadeIn>
      </div>
    </section>
  );
}
