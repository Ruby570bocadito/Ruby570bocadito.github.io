import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { ArrowUpRight, FlaskConical } from 'lucide-react';
import { useRef, type MouseEvent } from 'react';
import { LiveProjectButton } from '../components/Buttons';
import { FadeIn } from '../components/FadeIn';
import { moreProjects, projects, ui, type Project } from '../content';
import { useLang } from '../i18n';
import { asset } from '../lib/hooks';

const radius = 'rounded-[28px] sm:rounded-[40px] md:rounded-[50px] lg:rounded-[60px]';

function ProjectCard({ project, index, total, progress }: { project: Project; index: number; total: number; progress: MotionValue<number> }) {
  const { t } = useLang();
  const targetScale = 1 - (total - 1 - index) * 0.03;
  const scale = useTransform(progress, [index / total, 1], [1, targetScale]);

  return (
    <div className="sticky top-24 flex h-[85vh] items-start justify-center md:top-32">
      <motion.article
        style={{ scale, top: `${index * 28}px` }}
        className={`relative w-full max-w-6xl origin-top border-2 border-[#D7E2EA] bg-[#0C0C0C] p-4 sm:p-6 md:p-8 ${radius}`}
      >
        <div className="flex flex-col gap-4 md:gap-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex items-end gap-4 md:gap-6">
              <span className="font-black leading-[0.8] text-[#D7E2EA]" style={{ fontSize: 'clamp(3rem, 10vw, 140px)' }}>
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="flex flex-col gap-1 pb-1">
                <span className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-widest text-[#D7E2EA]/60 sm:text-xs">
                  <span className={`h-1.5 w-1.5 rounded-full ${project.done ? 'bg-[#D7E2EA]/60' : 'bg-emerald-400'}`} />
                  {t(project.category)} · {t(project.status)}
                </span>
                <h3 className="font-semibold uppercase leading-none text-white" style={{ fontSize: 'clamp(1.6rem, 4.2vw, 3.6rem)' }}>
                  {project.name}
                </h3>
                <p className="text-xs font-light text-[#D7E2EA]/70 sm:text-sm">{t(project.role)}</p>
              </div>
            </div>
            <p className="hidden max-w-sm text-sm font-light leading-relaxed text-[#D7E2EA]/75 xl:block">{t(project.desc)}</p>
            <LiveProjectButton href={project.href} target="_blank" rel="noopener noreferrer" className="group self-start !px-6 !py-2.5 !text-xs sm:!text-sm lg:self-end">
              {t(ui.viewOnGithub)}
            </LiveProjectButton>
          </div>

          <p className="line-clamp-3 max-w-3xl text-sm font-light leading-relaxed text-[#D7E2EA]/75 sm:line-clamp-none xl:hidden">{t(project.desc)}</p>
          <dl className="flex gap-4 sm:hidden">
            {project.metrics.map(m => (
              <div key={m.label.es} className="flex min-w-0 flex-col">
                <dt className="order-2 text-[10px] uppercase leading-tight tracking-wider text-[#D7E2EA]/60">{t(m.label)}</dt>
                <dd className="order-1 text-base font-semibold text-white">{m.v}</dd>
              </div>
            ))}
          </dl>

          <div className="grid grid-cols-[40%_1fr] gap-2.5 sm:gap-3 md:gap-4">
            <div className="flex flex-col gap-2.5 sm:gap-3 md:gap-4">
              <img
                src={asset(project.images.a)}
                alt={`${project.name} — ${t(project.category)}`}
                loading="lazy"
                decoding="async"
                className={`w-full object-cover ${radius}`}
                style={{ height: 'clamp(100px, min(13vw, 19vh), 200px)' }}
              />
              <img
                src={asset(project.images.b)}
                alt={`${project.name} — ${t({ es: 'captura', en: 'screenshot' })}`}
                loading="lazy"
                decoding="async"
                className={`w-full object-cover object-left-top ${radius}`}
                style={{ height: 'clamp(120px, min(17vw, 26vh), 270px)' }}
              />
            </div>
            <div className={`relative overflow-hidden ${radius}`}>
              <img src={asset(project.images.c)} alt={`${project.name} — ${t({ es: 'panel principal', en: 'main dashboard' })}`} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover object-left-top" />
              <div className="absolute inset-x-0 bottom-0 hidden bg-gradient-to-t from-[#0C0C0C]/95 via-[#0C0C0C]/60 to-transparent px-4 pb-4 pt-12 sm:block sm:px-6 sm:pb-6 md:px-8 md:pb-7">
                <div className="hidden flex-wrap gap-x-5 gap-y-2 sm:flex">
                  {project.metrics.map(m => (
                    <div key={m.label.es} className="flex items-baseline gap-1.5">
                      <span className="text-lg font-semibold text-white sm:text-2xl">{m.v}</span>
                      <span className="text-[10px] uppercase tracking-wider text-[#D7E2EA]/65 sm:text-xs">{t(m.label)}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-2 hidden font-mono text-[11px] text-[#D7E2EA]/50 sm:block">{project.stack}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.article>
    </div>
  );
}

function MoreCard({ item, index }: { item: (typeof moreProjects.items)[number]; index: number }) {
  const { t } = useLang();
  const onMove = (e: MouseEvent<HTMLAnchorElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
  };
  const dot: Record<string, string> = { Go: '#00ADD8', Python: '#3776AB', Rust: '#DEA584' };
  return (
    <FadeIn delay={(index % 3) * 0.08} y={24}>
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        onMouseMove={onMove}
        className="glass-card group relative flex h-full flex-col gap-3 overflow-hidden rounded-3xl p-6 transition-colors duration-300 hover:border-[#D7E2EA]/30"
      >
        <span
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: 'radial-gradient(360px circle at var(--mx) var(--my), rgba(182, 0, 168, 0.16), transparent 60%)' }}
          aria-hidden="true"
        />
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-mono text-base font-medium text-white">{item.name}</h3>
          <ArrowUpRight className="h-5 w-5 text-[#D7E2EA]/50 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" aria-hidden="true" />
        </div>
        <p className="flex-1 text-sm font-light leading-relaxed text-[#D7E2EA]/75">{t(item.desc)}</p>
        <div className="flex items-center justify-between text-xs uppercase tracking-wider text-[#D7E2EA]/55">
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full" style={{ background: dot[item.lang] ?? '#D7E2EA' }} />
            {item.lang}
          </span>
          <span>{t(item.note)}</span>
        </div>
      </a>
    </FadeIn>
  );
}

export function Projects() {
  const { t } = useLang();
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: container, offset: ['start start', 'end end'] });
  const items = projects.items;

  return (
    <section id="projects" className="relative z-10 -mt-10 rounded-t-[40px] bg-[#0C0C0C] px-4 pb-24 pt-20 sm:-mt-12 sm:rounded-t-[50px] sm:px-8 md:-mt-14 md:rounded-t-[60px] md:px-10 md:pt-28">
      <FadeIn y={40} className="flex flex-col items-center gap-6">
        <h2 className="hero-heading text-center font-black uppercase leading-none tracking-tight" style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}>
          {t(projects.heading)}
        </h2>
        <p className="max-w-xl text-center text-sm font-light leading-relaxed text-[#D7E2EA]/75 sm:text-base">{t(projects.intro)}</p>
        <p className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-[#D7E2EA]/45 sm:text-xs">
          <FlaskConical className="h-3.5 w-3.5" aria-hidden="true" />
          {t(projects.disclaimer)}
        </p>
      </FadeIn>

      <div ref={container} className="mt-12 md:mt-16">
        {items.map((p, i) => (
          <ProjectCard key={p.name} project={p} index={i} total={items.length} progress={scrollYProgress} />
        ))}
      </div>

      <div className="mx-auto mt-24 max-w-6xl md:mt-32">
        <FadeIn y={30} className="mb-10 flex flex-col items-center gap-3 md:mb-14">
          <h2 className="hero-heading text-center font-black uppercase leading-none tracking-tight" style={{ fontSize: 'clamp(2.2rem, 6vw, 84px)' }}>
            {t(moreProjects.heading)}
          </h2>
        </FadeIn>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {moreProjects.items.map((item, i) => (
            <MoreCard key={item.name} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
