import { AnimatePresence, motion } from 'framer-motion';
import { Award, BookOpen, Gamepad2, GraduationCap, Network, Sparkles, Target } from 'lucide-react';
import { useState } from 'react';
import { CountUp } from '../components/CountUp';
import { FadeIn } from '../components/FadeIn';
import { training, type CourseCat } from '../content';
import { useLang } from '../i18n';
import { asset } from '../lib/hooks';

const groupIcon = [Network, Target, Sparkles, Gamepad2];

function UdemyCourses() {
  const { t } = useLang();
  const [cat, setCat] = useState<CourseCat | 'all'>('all');
  const cats = Object.keys(training.udemy.cats) as CourseCat[];
  const list = training.udemy.courses.filter(c => cat === 'all' || c.c === cat);
  const count = (c: CourseCat) => training.udemy.courses.filter(x => x.c === c).length;

  return (
    <div className="glass-card rounded-[32px] p-6 sm:p-8 md:p-10">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="flex items-center gap-3">
          <BookOpen className="h-6 w-6 text-[#E04BD6]" aria-hidden="true" />
          <h3 className="text-2xl font-semibold uppercase text-white md:text-3xl">{t(training.udemy.title)}</h3>
        </div>
        <div role="tablist" aria-label={t(training.udemy.title)} className="flex flex-wrap gap-2">
          {(['all', ...cats] as const).map(c => {
            const selected = cat === c;
            return (
              <button
                key={c}
                role="tab"
                type="button"
                aria-selected={selected}
                onClick={() => setCat(c)}
                className={`relative rounded-full px-3.5 py-1.5 text-xs font-medium uppercase tracking-wider transition-colors duration-200 ${
                  selected ? 'text-[#0C0C0C]' : 'border border-[#D7E2EA]/20 text-[#D7E2EA]/80 hover:border-[#D7E2EA]/50 hover:text-white'
                }`}
              >
                {selected && <motion.span layoutId="udemy-pill" className="absolute inset-0 -z-0 rounded-full bg-[#D7E2EA]" transition={{ type: 'spring', stiffness: 500, damping: 40 }} />}
                <span className="relative">
                  {c === 'all' ? t(training.udemy.all) : t(training.udemy.cats[c])}
                  <span className="ml-1.5 opacity-60">{c === 'all' ? training.udemy.courses.length : count(c)}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <motion.ul layout className="mt-8 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {list.map(course => (
            <motion.li
              layout
              key={course.t}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              className="flex items-start gap-3 rounded-2xl border border-[#D7E2EA]/10 bg-[#0C0C0C]/60 px-4 py-3"
            >
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-br from-[#E04BD6] to-[#F07A2E]" />
              <span className="text-sm leading-snug text-[#D7E2EA]">
                {course.t}
                <span className="mt-0.5 block text-[10px] uppercase tracking-widest text-[#D7E2EA]/45">{t(training.udemy.cats[course.c])}</span>
              </span>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </div>
  );
}

export function Training() {
  const { t } = useLang();
  return (
    <section id="training" className="relative overflow-hidden px-5 py-24 sm:px-8 md:px-10 md:py-32">
      <div className="pointer-events-none absolute left-1/2 top-24 h-[480px] w-[900px] -translate-x-1/2 rounded-full bg-[#7621B0]/20 blur-[120px]" aria-hidden="true" />
      <div className="relative mx-auto max-w-6xl">
        <FadeIn y={40} className="flex flex-col items-center gap-6">
          <h2 className="hero-heading text-center font-black uppercase leading-none tracking-tight" style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}>
            {t(training.heading)}
          </h2>
          <p className="max-w-2xl text-center text-sm font-light leading-relaxed text-[#D7E2EA]/75 sm:text-base">{t(training.intro)}</p>
        </FadeIn>

        <FadeIn y={20} delay={0.1} className="mt-12 grid grid-cols-2 gap-4 md:mt-16 md:grid-cols-4">
          {training.counters.map(c => (
            <div key={c.label.es} className="glass-card rounded-3xl px-5 py-6 text-center">
              <CountUp to={c.to} className="block text-5xl font-semibold text-white md:text-6xl" />
              <span className="mt-2 block text-xs uppercase tracking-widest text-[#D7E2EA]/65">{t(c.label)}</span>
            </div>
          ))}
        </FadeIn>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1.15fr_1fr]">
          {/* Certificación destacada */}
          <FadeIn y={30} className="relative overflow-hidden rounded-[32px] border border-[#D7E2EA]/15 p-8 md:p-10" style={{ background: 'linear-gradient(140deg, rgba(182,0,168,0.22), rgba(118,33,176,0.12) 45%, rgba(12,12,12,0.6))' }}>
            <img src={asset('img/obj-shield.webp')} alt="" aria-hidden="true" loading="lazy" className="pointer-events-none absolute -right-6 -top-6 w-40 opacity-90 md:w-52" />
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium uppercase tracking-widest text-white">
              <Award className="h-3.5 w-3.5" aria-hidden="true" /> {training.ejpt.org}
            </span>
            <h3 className="mt-6 text-6xl font-black uppercase leading-none text-white md:text-7xl">{training.ejpt.title}</h3>
            <p className="mt-2 text-sm uppercase tracking-wider text-[#D7E2EA]/70">{training.ejpt.full}</p>
            <p className="mt-6 max-w-md font-light leading-relaxed text-[#D7E2EA]">{t(training.ejpt.desc)}</p>
            <p className="mt-4 text-xs text-[#D7E2EA]/50">{t(training.ejpt.note)}</p>
          </FadeIn>

          {/* Formación reglada */}
          <FadeIn y={30} delay={0.1} className="glass-card flex flex-col gap-6 rounded-[32px] p-8 md:p-10">
            <span className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-[#D7E2EA]/60">
              <GraduationCap className="h-4 w-4" aria-hidden="true" /> {t({ es: 'Formación reglada', en: 'Formal education' })}
            </span>
            {training.education.map(e => (
              <div key={e.org} className="border-l-2 border-[#B600A8] pl-4">
                <span className="text-xs uppercase tracking-widest text-[#D7E2EA]/50">{t(e.when)}</span>
                <h3 className="mt-1 text-lg font-medium leading-snug text-white">{t(e.title)}</h3>
                <p className="text-sm text-[#D7E2EA]/70">
                  {e.org} · <span className="text-[#E04BD6]">{t(e.tag)}</span>
                </p>
              </div>
            ))}
            <p className="mt-auto rounded-2xl border border-dashed border-[#D7E2EA]/20 px-4 py-3 text-sm text-[#D7E2EA]/70">{t(training.next)}</p>
          </FadeIn>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {training.groups.map((g, i) => {
            const Icon = groupIcon[i] ?? Award;
            return (
              <FadeIn key={i} y={24} delay={i * 0.08} className="glass-card rounded-[28px] p-6">
                <div className="flex items-center gap-2.5">
                  <Icon className="h-5 w-5 text-[#E04BD6]" aria-hidden="true" />
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-white">{t(g.org)}</h3>
                </div>
                <ul className="mt-4 flex flex-col gap-2">
                  {g.items.map(item => (
                    <li key={item.es} className="text-sm font-light leading-snug text-[#D7E2EA]/85">
                      {t(item)}
                    </li>
                  ))}
                </ul>
              </FadeIn>
            );
          })}
        </div>

        <FadeIn y={30} className="mt-4">
          <UdemyCourses />
        </FadeIn>
      </div>
    </section>
  );
}
