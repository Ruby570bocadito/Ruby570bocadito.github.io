import { useEffect, useState } from 'react';
import DecryptedText from '../reactbits/DecryptedText.jsx';
import { useLang } from '../lang.jsx';
import { Icon, Shield } from './ui.jsx';

const NAV = [
  ['about', 'nav.about'],
  ['projects', 'nav.projects'],
  ['skills', 'nav.skills'],
  ['certs', 'nav.certs'],
  ['focus-now', 'nav.now'],
  ['contact', 'nav.contact']
];

export default function Header() {
  const { t, lang, setLang } = useLang();
  const [active, setActive] = useState('');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const bar = document.getElementById('sprog');
    const onScroll = () => {
      const d = document.documentElement;
      const max = d.scrollHeight - d.clientHeight;
      if (bar) bar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
      setScrolled(window.scrollY > 8);
    };
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    const io = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-35% 0px -55% 0px' }
    );
    document.querySelectorAll('section[id]').forEach(s => io.observe(s));
    return () => {
      removeEventListener('scroll', onScroll);
      io.disconnect();
    };
  }, []);

  return (
    <header className={scrolled ? 'scrolled' : ''}>
      <div className="frame nav">
        <a className="logo" href="#top" aria-label={t('aria.home')}>
          <Shield />
          Rafael Gálvez
        </a>
        <nav className="nav-links" aria-label={t('aria.main')}>
          {NAV.map(([id, k]) => (
            <a key={id} href={`#${id}`} className={active === id ? 'active' : ''}>
              <DecryptedText key={lang} text={t(k)} animateOn="hover" speed={28} maxIterations={8}
                characters="!<>-_/[]=+*^?" encryptedClassName="enc" />
            </a>
          ))}
        </nav>
        <div className="nav-cta">
          <div className="lang-switch" role="group" aria-label="Language / Idioma">
            <Icon name="globe" size={12} stroke={2} className="lang-globe" />
            {['en', 'es'].map(l => (
              <button key={l} type="button" className={`lang-btn${lang === l ? ' active' : ''}`}
                aria-pressed={lang === l} onClick={() => lang !== l && setLang(l)}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          <a className="btn btn-w btn-sm" href="/cv.pdf" download="CV Practicas.pdf">
            <Icon name="download" size={13} stroke={2.2} />
            <span className="btn-label">{t('nav.cv')}</span>
          </a>
        </div>
      </div>
    </header>
  );
}
