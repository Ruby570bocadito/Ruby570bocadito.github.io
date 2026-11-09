import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import ShinyText from '../reactbits/ShinyText.jsx';
import { NAV } from '../content.js';
import { LANGS, useLang, useT } from '../i18n.jsx';
import { usePeri } from './Peri.jsx';
import { RiveArt, asset } from './ui.jsx';

// Sección visible -> enlace del menú que se marca.
const NAV_OF = { certificaciones: 'habilidades', contacto: 'sobre-mi' };

export default function Header() {
  const { section } = usePeri();
  const { lang, setLang } = useLang();
  const { t, tr } = useT();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 12);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);
  const active = NAV_OF[section] ?? section;

  return (
    <header className={`nav${scrolled ? ' nav-scrolled' : ''}`}>
      <div className="wrap nav-row">
        <a className="brand" href="#inicio" aria-label={t('nav.home')}>
          <img src={asset('img/peri-icon.png')} alt="" width="34" height="34" />
          <span>Rafa<b>.</b></span>
        </a>
        <nav aria-label={t('nav.label')}>
          <ul className="nav-links">
            {NAV.map(item => (
              <li key={item.id}>
                <a href={`#${item.id}`} aria-current={active === item.id ? 'true' : undefined}>
                  {active === item.id && (
                    <motion.span layoutId="nav-pill" className="nav-pill" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />
                  )}
                  <span className="nav-label">{tr(item.label)}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="nav-end">
          <div className="lang" role="group" aria-label={t('lang.switch')}>
            {LANGS.map(l => (
              <button key={l} type="button" lang={l} aria-pressed={lang === l} onClick={() => setLang(l)}>
                {lang === l && <motion.span layoutId="lang-pill" className="lang-pill" transition={{ type: 'spring', stiffness: 460, damping: 34 }} />}
                <span>{l.toUpperCase()}</span>
              </button>
            ))}
          </div>
          <a className="avail" href="#contacto" aria-label={t('avail')}>
            <RiveArt src="pulse.riv" stateMachine="Pulse" input="on" value={1} className="avail-dot" fallback={<span className="dot" />} />
            <ShinyText key={lang} text={t('avail')} color="#403930" shineColor="#7CC242" speed={3.2} className="avail-text" />
          </a>
        </div>
      </div>
    </header>
  );
}
