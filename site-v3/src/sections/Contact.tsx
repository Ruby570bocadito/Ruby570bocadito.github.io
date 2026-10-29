import { AnimatePresence, motion } from 'framer-motion';
import { Check, Copy, Github, Linkedin, Mail } from 'lucide-react';
import { useState } from 'react';
import { ContactButton } from '../components/Buttons';
import { FadeIn } from '../components/FadeIn';
import { useRiveArtboard } from '../components/RiveKit';
import { contact, footer, links, ui } from '../content';
import { useLang } from '../i18n';
import { useMalagaClock } from '../lib/hooks';

function CvButton() {
  const { t } = useLang();
  const { RiveComponent, set } = useRiveArtboard({ artboard: 'lock', stateMachine: 'lock' });
  return (
    <ContactButton
      href={links.cv}
      download={links.cvName}
      onMouseEnter={() => set('hover', true)}
      onMouseLeave={() => {
        set('hover', false);
        set('open', false);
      }}
      onFocus={() => set('hover', true)}
      onBlur={() => {
        set('hover', false);
        set('open', false);
      }}
      onClick={() => set('open', true)}
      title={t(contact.cvHint)}
      className="!pl-5 sm:!pl-6"
    >
      <span className="-my-2 h-9 w-9 shrink-0 sm:h-10 sm:w-10" aria-hidden="true">
        <RiveComponent className="h-full w-full" />
      </span>
      {t(ui.downloadCv)}
    </ContactButton>
  );
}

export function Contact() {
  const { t } = useLang();
  const clock = useMalagaClock();
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(links.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${links.email}`;
    }
  };

  return (
    <section id="contact" className="relative overflow-hidden px-5 pb-16 pt-24 sm:px-8 md:px-10 md:pt-32">
      <div className="pointer-events-none absolute -bottom-40 left-1/2 h-[520px] w-[1100px] -translate-x-1/2 rounded-full bg-[#B600A8]/20 blur-[140px]" aria-hidden="true" />
      <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-10 text-center">
        <FadeIn y={40}>
          <h2 className="hero-heading font-black uppercase leading-none tracking-tight" style={{ fontSize: 'clamp(3.2rem, 15vw, 220px)' }}>
            {t(contact.heading)}
          </h2>
        </FadeIn>
        <FadeIn y={20} delay={0.05}>
          <p className="max-w-xl font-light leading-relaxed text-[#D7E2EA]/80 md:text-lg">{t(contact.text)}</p>
        </FadeIn>

        <FadeIn y={20} delay={0.1} className="flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={copy}
            className="group inline-flex items-center gap-3 rounded-full border border-[#D7E2EA]/15 px-5 py-3 text-lg font-medium text-white transition-colors hover:border-[#D7E2EA]/40 sm:text-2xl md:text-3xl"
            aria-label={`${t(ui.copyEmail)}: ${links.email}`}
          >
            {links.email}
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={copied ? 'ok' : 'copy'} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.6 }} transition={{ duration: 0.15 }}>
                {copied ? <Check className="h-5 w-5 text-emerald-400" aria-hidden="true" /> : <Copy className="h-5 w-5 text-[#D7E2EA]/60 group-hover:text-white" aria-hidden="true" />}
              </motion.span>
            </AnimatePresence>
          </button>
          <span aria-live="polite" className="h-4 text-xs uppercase tracking-widest text-emerald-400">
            {copied ? t(ui.copied) : ''}
          </span>
        </FadeIn>

        <FadeIn y={20} delay={0.15} className="flex flex-wrap items-center justify-center gap-3">
          <ContactButton href={`mailto:${links.email}`}>
            <Mail className="h-4 w-4" aria-hidden="true" /> {t(ui.emailMe)}
          </ContactButton>
          <CvButton />
        </FadeIn>

        <FadeIn y={20} delay={0.2} className="flex flex-wrap items-center justify-center gap-3">
          <a href={links.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border-2 border-[#D7E2EA] px-6 py-2.5 text-sm font-medium uppercase tracking-widest text-[#D7E2EA] transition-colors hover:bg-[#D7E2EA]/10">
            <Github className="h-4 w-4" aria-hidden="true" /> GitHub
          </a>
          <a href={links.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border-2 border-[#D7E2EA] px-6 py-2.5 text-sm font-medium uppercase tracking-widest text-[#D7E2EA] transition-colors hover:bg-[#D7E2EA]/10">
            <Linkedin className="h-4 w-4" aria-hidden="true" /> LinkedIn
          </a>
        </FadeIn>

        {clock && (
          <p className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#D7E2EA]/55">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> {t(contact.localTime)} · <span className="font-mono">{clock}</span>
          </p>
        )}
      </div>

      <footer className="relative mx-auto mt-24 flex max-w-6xl flex-col gap-4 border-t border-[#D7E2EA]/10 pt-8 text-xs text-[#D7E2EA]/50 md:flex-row md:items-center md:justify-between">
        <p>© 2026 Rafael Gálvez Silipo · {t(footer.made)}</p>
        <p className="md:text-right">
          {t(footer.credits)} ·{' '}
          <a href={links.previousSite} className="underline decoration-[#D7E2EA]/30 underline-offset-4 hover:text-white">
            {t(footer.previous)}
          </a>
        </p>
      </footer>
    </section>
  );
}
