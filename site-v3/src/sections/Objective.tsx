import { BrainCircuit, Crosshair, Gamepad2, Network, ShieldCheck, TerminalSquare, type LucideIcon } from 'lucide-react';
import { AnimatedText } from '../components/AnimatedText';
import { FadeIn } from '../components/FadeIn';
import { objective } from '../content';
import { useLang } from '../i18n';

const icons: Record<string, LucideIcon> = {
  shield: ShieldCheck,
  crosshair: Crosshair,
  terminal: TerminalSquare,
  network: Network,
  brain: BrainCircuit,
  gamepad: Gamepad2
};

export function Objective() {
  const { t } = useLang();
  return (
    <section id="goal" className="relative px-5 py-24 sm:px-8 md:px-10 md:py-32">
      <div className="mx-auto max-w-6xl">
        <FadeIn y={40}>
          <h2 className="hero-heading text-center font-black uppercase leading-none tracking-tight" style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}>
            {t(objective.heading)}
          </h2>
        </FadeIn>
        <FadeIn y={20} className="mt-8 text-center text-base font-light text-[#D7E2EA]/75 md:text-lg">
          {t(objective.lead)}
        </FadeIn>
        <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {objective.items.map((item, i) => {
            const Icon = icons[item.icon];
            return (
              <FadeIn as="li" key={item.t.es} y={24} delay={(i % 3) * 0.08} className="glass-card group flex items-center gap-4 rounded-3xl p-5 transition-colors duration-300 hover:border-[#D7E2EA]/30">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#B600A8] via-[#7621B0] to-[#BE4C00] text-white shadow-[0_8px_24px_-8px_rgba(182,0,168,0.6)] transition-transform duration-300 group-hover:scale-110">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <span className="text-base font-medium leading-snug text-white">{t(item.t)}</span>
              </FadeIn>
            );
          })}
        </ul>
        <AnimatedText
          text={t(objective.closing)}
          className="mx-auto mt-20 max-w-3xl text-center font-medium leading-relaxed text-[#D7E2EA] md:mt-28"
          style={{ fontSize: 'clamp(1.15rem, 2.4vw, 1.9rem)' }}
        />
      </div>
    </section>
  );
}
