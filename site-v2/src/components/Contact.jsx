import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Magnet from '../reactbits/Magnet.jsx';
import SplitText from '../reactbits/SplitText.jsx';
import { LINKS } from '../content.js';
import { useT } from '../i18n.jsx';
import { Icon, RiveArt } from './ui.jsx';

export default function Contact() {
  const { t, lang } = useT();
  const [copied, setCopied] = useState(false);
  const [sent, setSent] = useState(0); // la flecha de "send.riv" sale volando cada vez que cambia entre 1 y 2

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(LINKS.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${LINKS.email}`;
    }
  };

  return (
    <section className="section contact" id="contacto">
      <div className="wrap">
        <p className="kicker">{t('contact.kicker')}</p>
        <SplitText key={lang} tag="h2" text={t('contact.title')} className="contact-title" splitType="words" delay={55} duration={0.9} textAlign="left" />
        <p className="lead">{t('contact.lead')}</p>
        <div className="contact-row">
          <div className="btns">
            <Magnet padding={60} magnetStrength={3.5}>
              <a className="btn btn-primary" href={`mailto:${LINKS.email}`} onPointerEnter={() => setSent(s => (s === 1 ? 2 : 1))} onFocus={() => setSent(s => (s === 1 ? 2 : 1))}>
                {t('contact.write')}
                <RiveArt src="send.riv" stateMachine="Send" input="sent" value={sent} className="btn-rive" fallback={<Icon.send />} />
              </a>
            </Magnet>
            <button type="button" className="btn btn-ghost" onClick={copy}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.span key={copied ? 'ok' : 'copy'} className="btn-swap" initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -12, opacity: 0 }} transition={{ duration: 0.18 }}>
                  {copied ? t('contact.copied') : <><Icon.copy width={18} height={18} /> {t('contact.copy')}</>}
                </motion.span>
              </AnimatePresence>
            </button>
            <a className="btn btn-ghost" href={LINKS.cv} download><Icon.download width={18} height={18} /> CV</a>
          </div>
          <ul className="social">
            {[
              { href: LINKS.github, label: 'GitHub', icon: <Icon.github /> },
              { href: LINKS.linkedin, label: 'LinkedIn', icon: <Icon.linkedin /> },
              { href: `mailto:${LINKS.email}`, label: 'Email', icon: <Icon.mail /> }
            ].map(s => (
              <li key={s.label}>
                <Magnet padding={30} magnetStrength={2.5}>
                  <a href={s.href} aria-label={s.label} target={s.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">{s.icon}</a>
                </Magnet>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
