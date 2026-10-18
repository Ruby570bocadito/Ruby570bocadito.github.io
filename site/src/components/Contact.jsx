import { useRef, useState } from 'react';
import Threads from '../reactbits/Threads.jsx';
import { Tx, useHtml, useLang } from '../lang.jsx';
import content from '../content.json';
import { useClock } from './Hero.jsx';
import { GitHubIcon, Heading, Icon, Label, LinkedInIcon, MagnetButton, Reveal, Shield } from './ui.jsx';

export function Contact() {
  const { t } = useLang();
  const clock = useClock(false);
  const [toast, setToast] = useState(false);
  const timer = useRef(0);
  const { email, links } = content.contact;

  const copy = () => {
    (navigator.clipboard ? navigator.clipboard.writeText(email) : Promise.reject()).then(
      () => {
        setToast(true);
        clearTimeout(timer.current);
        timer.current = setTimeout(() => setToast(false), 2200);
      },
      () => {
        window.location.href = `mailto:${email}`;
      }
    );
  };

  const icons = [<GitHubIcon key="g" />, <LinkedInIcon key="l" />, <Icon key="d" name="download" size={15} stroke={2} />];

  return (
    <section id="contact" className="contact">
      <div className="contact-threads" aria-hidden="true">
        <Threads color="#d6d3d1" accentColor="#8fc573" amplitude={1.1} distance={0.18} lineCount={48} thickness={0.5}
          softness={1.4} speed={0.35} waves={0.9} split={0.02} fray={0.4} angle={0} seed={3} taper={0.9}
          brightness={1.1} fade={0.55} opacity={0.6} />
      </div>
      <div className="frame">
        <Reveal distance={16}><Label k="sec.contact" className="center" /></Reveal>
        <Heading k="contact.h2" className="cta-title" />
        <Reveal delay={0.1}><Tx v="contact.sub" as="p" className="sec-sub" /></Reveal>
        <Reveal delay={0.15}>
          <p className="loc-time"><Tx v="contact.loc" /> <b>{clock || '--:--'}</b></p>
        </Reveal>
        <Reveal delay={0.2} className="contact-ctas">
          <MagnetButton href={`mailto:${email}`}>
            <span>{t('contact.email')}</span><Icon name="arrow" size={14} stroke={2.2} />
          </MagnetButton>
          <button type="button" className="btn btn-d" onClick={copy}>
            {email}<Icon name="copy" size={13} stroke={2} />
          </button>
        </Reveal>
        <Reveal delay={0.25} className="contact-links">
          {links.map((l, i) => (
            <a key={l.href} href={l.href} {...(l.href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : { download: 'CV Practicas.pdf' })}>
              {icons[i]}{l.label}
            </a>
          ))}
        </Reveal>
      </div>
      <div className={`toast${toast ? ' show' : ''}`} role="status">{toast ? t('toast.copy') : ''}</div>
    </section>
  );
}

export function Footer() {
  const html = useHtml();
  const f = content.footer;
  return (
    <footer>
      <div className="frame">
        <div className="f-grid">
          <div className="f-brand">
            <a className="logo" href="#top"><Shield size={20} />{f.brand}</a>
            <Tx v="foot.brand" as="p" />
          </div>
          {f.cols.map((col, i) => (
            <div className="f-col" key={i}>
              <Tx v={col.title} />
              {col.links.map(l => (
                <a key={l.href} href={l.href}
                  {...(l.ext ? { target: '_blank', rel: 'noreferrer' } : {})}
                  {...(l.download ? { download: l.download } : {})}
                  dangerouslySetInnerHTML={{ __html: html(l.label) }} />
              ))}
            </div>
          ))}
        </div>
        <div className="wordmark" aria-hidden="true">{f.brand}</div>
        <div className="f-bottom">
          <span>{f.copy}</span>
          <Tx v="foot.made" />
        </div>
      </div>
    </footer>
  );
}
