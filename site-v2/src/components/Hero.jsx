import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import CountUp from '../reactbits/CountUp.jsx';
import DotGrid from '../reactbits/DotGrid.jsx';
import Magnet from '../reactbits/Magnet.jsx';
import RotatingText from '../reactbits/RotatingText.jsx';
import SplitText from '../reactbits/SplitText.jsx';
import TiltedCard from '../reactbits/TiltedCard.jsx';
import { AVATAR, HERO, TIPS } from '../content.js';
import { useT } from '../i18n.jsx';
import { LivePeri, usePeri } from './Peri.jsx';
import { Icon, RiveArt, asset, useInView, useMedia } from './ui.jsx';

const rise = delay => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }
});

function BadgeFront({ level }) {
  const { t } = useT();
  return (
    <div className="badge">
      <div className="badge-top">
        <span className="badge-slot" aria-hidden="true" />
        <p className="badge-org"><b>SOC</b> · Blue Team</p>
        <RiveArt src="shield.riv" stateMachine="Shield" input="level" value={level} className="badge-shield" fallback={<span className="badge-shield-still">🛡️</span>} />
      </div>
      <div className="badge-photo">
        {AVATAR ? <img src={asset(AVATAR)} alt={t('badge.avatar')} /> : <span className="badge-mono" aria-hidden="true">RG</span>}
      </div>
      <p className="badge-name">Rafael Gálvez Silipo</p>
      <p className="badge-role">{t('badge.role')}</p>
      <dl className="badge-meta">
        <div><dt>Base</dt><dd>Málaga</dd></div>
        <div><dt>Cert.</dt><dd>eJPTv2</dd></div>
        <div><dt>ID</dt><dd>0570</dd></div>
      </dl>
      <div className="badge-foot">
        <span className="barcode" aria-hidden="true" />
        <span className="badge-hint">{t('badge.hint')}</span>
      </div>
    </div>
  );
}

function BadgeBack() {
  const { t } = useT();
  return (
    <div className="badge badge-back">
      <div className="term-bar"><i /><i /><i /><span>rafa@soc:~</span></div>
      <pre className="term">
        <b>$ whoami</b>{'\n'}{t('term.whoami')}{'\n\n'}
        <b>$ cat {t('term.focusFile')}</b>{'\n'}{t('term.focus')}{'\n\n'}
        <b>$ ls {t('term.projects')}</b>{'\n'}bluetardigrade  soc-shark{'\n'}sabueso  bastion  friendlypear{'\n\n'}
        <b>$ status</b>{'\n'}<span className="term-ok">●</span> {t('term.status')}
      </pre>
    </div>
  );
}

export default function Hero() {
  const { t, tr, lang } = useT();
  const { redOpen } = usePeri();
  const [hover, setHover] = useState(false);
  const [tip, setTip] = useState(null); // null: el saludo; un número: el consejo que toca
  const tipIndex = useRef(0);
  const [heroRef, heroVisible] = useInView({ once: false, rootMargin: '0px' });
  const small = useMedia('(max-width: 560px)');
  const level = redOpen ? 1 : hover ? 2 : 0;
  const size = small ? { w: 268, h: 392 } : { w: 330, h: 470 };
  const bubble = tip === null ? t('hero.bubble') : tr(TIPS[tip]);

  return (
    <section id="inicio" className="hero" ref={heroRef}>
      <div className="hero-dots" aria-hidden="true">
        <DotGrid dotSize={4} gap={26} baseColor="#F2CBA8" activeColor="#4E5E80" proximity={130} shockRadius={240} shockStrength={4} glow={0.2} paused={!heroVisible} />
      </div>
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <motion.span className="tag" {...rise(0.05)}>
            <span className="wave" aria-hidden="true">👋</span> {t('hero.tag')}
          </motion.span>
          <h1 className="hero-title">
            <SplitText key={`l1-${lang}`} tag="span" text={t('hero.line1')} className="hero-line" splitType="chars" delay={26} duration={0.9} textAlign="left" trigger="load" />
            <span className="hero-line hero-rot">
              <RotatingText
                key={lang}
                texts={tr(HERO.roles)}
                mainClassName="rot"
                splitLevelClassName="rot-split"
                staggerFrom="last"
                staggerDuration={0.022}
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '-120%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 400 }}
                rotationInterval={2600}
                splitBy="characters"
              />
            </span>
            <SplitText key={`l3-${lang}`} tag="span" text={t('hero.line3')} className="hero-line" splitType="words" delay={90} duration={0.9} textAlign="left" trigger="load" />
          </h1>
          <motion.p className="hero-sub" {...rise(0.45)}>{tr(HERO.sub)}</motion.p>
          <motion.div className="btns" {...rise(0.6)}>
            <Magnet padding={60} magnetStrength={3.5}>
              <a className="btn btn-primary" href="#proyectos">
                {t('hero.work')}
                <RiveArt src="next.riv" stateMachine="Next" className="btn-rive" fallback={<Icon.arrow />} />
              </a>
            </Magnet>
            <Magnet padding={60} magnetStrength={3.5}>
              <a className="btn btn-ghost" href="#contacto">{t('hero.contact')}</a>
            </Magnet>
          </motion.div>
          <motion.ul className="hero-stats" {...rise(0.75)}>
            {HERO.stats.map(s => (
              <li key={s.to}>
                <span className="stat-num"><CountUp to={s.to} duration={2.2} />{s.suffix}</span>
                <span className="stat-label">{tr(s.label)}</span>
              </li>
            ))}
          </motion.ul>
        </div>

        <motion.div className="hero-art" initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}>
          <div className="badge-wrap" onPointerEnter={() => setHover(true)} onPointerLeave={() => setHover(false)}>
            <span className="lanyard" aria-hidden="true" />
            <TiltedCard
              containerWidth={`${size.w}px`}
              containerHeight={`${size.h}px`}
              imageWidth={`${size.w}px`}
              imageHeight={`${size.h}px`}
              rotateAmplitude={9}
              scaleOnHover={1.03}
              showTooltip={false}
              radius={22}
              glare={0.35}
              shadow={0.35}
              captionText={t('badge.caption')}
              backContent={<BadgeBack />}
              className="badge-card"
            >
              <BadgeFront level={level} />
            </TiltedCard>
          </div>
          <div className="hero-peri-wrap">
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={bubble}
                className="bubble"
                aria-live="polite"
                initial={{ opacity: 0, y: 8, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.96 }}
                transition={{ duration: 0.22 }}
              >
                {bubble}
              </motion.p>
            </AnimatePresence>
            <LivePeri
              mood={redOpen ? 'worried' : tip === null ? 'calm' : 'happy'}
              className="hero-peri"
              label={t('hero.periLabel')}
              onTap={() => { setTip(tipIndex.current % TIPS.length); tipIndex.current += 1; }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
