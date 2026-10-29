import { AnimatePresence, motion } from 'framer-motion';
import { Download, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { floatingNav, links, ui } from '../content';
import { useLang } from '../i18n';
import { LangToggle } from './LangToggle';

/** Barra flotante que aparece tras el hero, con la sección activa resaltada. */
export function FloatingNav() {
  const { t } = useLang();
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState<string>('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.85);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const els = floatingNav.map(n => document.getElementById(n.id)).filter((e): e is HTMLElement => !!e);
    const io = new IntersectionObserver(
      entries => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
          className="fixed inset-x-0 top-3 z-50 flex justify-center px-3"
        >
          <nav aria-label={t(ui.menu)} className="flex items-center gap-1 rounded-full border border-[#D7E2EA]/15 bg-[#0C0C0C]/75 p-1.5 shadow-[0_10px_40px_-12px_rgba(0,0,0,0.8)] backdrop-blur-xl">
            <a href="#top" className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#B600A8] via-[#7621B0] to-[#BE4C00] text-xs font-black text-white" aria-label={t(ui.backToTop)}>
              RG
            </a>
            <ul className="hidden items-center lg:flex">
              {floatingNav.map(n => (
                <li key={n.id}>
                  <a
                    href={`#${n.id}`}
                    className={`relative block rounded-full px-3.5 py-2 text-xs font-medium uppercase tracking-wider transition-colors ${active === n.id ? 'text-white' : 'text-[#D7E2EA]/65 hover:text-white'}`}
                  >
                    {active === n.id && <motion.span layoutId="fnav-active" className="absolute inset-0 rounded-full bg-white/10" transition={{ type: 'spring', stiffness: 400, damping: 36 }} />}
                    <span className="relative">{t(n.label)}</span>
                  </a>
                </li>
              ))}
            </ul>
            <LangToggle id="fnav-lang" className="ml-1 border-[#D7E2EA]/15 !p-0.5" />
            <a href={links.cv} download={links.cvName} className="ml-1 hidden h-9 items-center gap-1.5 rounded-full bg-[#D7E2EA] px-3.5 text-xs font-semibold uppercase tracking-wider text-[#0C0C0C] transition-colors hover:bg-white sm:inline-flex">
              <Download className="h-3.5 w-3.5" aria-hidden="true" /> CV
            </a>
            <button type="button" onClick={() => setOpen(o => !o)} className="ml-1 flex h-9 w-9 items-center justify-center rounded-full text-[#D7E2EA] hover:bg-white/10 lg:hidden" aria-expanded={open} aria-label={open ? t(ui.close) : t(ui.menu)}>
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </nav>
          <AnimatePresence>
            {open && (
              <motion.ul
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="absolute top-16 flex w-[min(92vw,360px)] flex-col gap-1 rounded-3xl border border-[#D7E2EA]/15 bg-[#0C0C0C]/95 p-3 backdrop-blur-xl lg:hidden"
              >
                {floatingNav.map(n => (
                  <li key={n.id}>
                    <a href={`#${n.id}`} onClick={() => setOpen(false)} className={`block rounded-2xl px-4 py-3 text-sm font-medium uppercase tracking-wider ${active === n.id ? 'bg-white/10 text-white' : 'text-[#D7E2EA]/80'}`}>
                      {t(n.label)}
                    </a>
                  </li>
                ))}
                <li>
                  <a href={links.cv} download={links.cvName} className="mt-1 flex items-center justify-center gap-2 rounded-2xl bg-[#D7E2EA] px-4 py-3 text-sm font-semibold uppercase tracking-wider text-[#0C0C0C]">
                    <Download className="h-4 w-4" aria-hidden="true" /> {t(ui.downloadCv)}
                  </a>
                </li>
              </motion.ul>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
