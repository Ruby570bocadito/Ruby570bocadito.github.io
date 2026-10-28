// Genera el sitio estático en la raíz del repo a partir de src/content.mjs.
//   node scripts/build.mjs            -> escribe ../index.html, ../404.html y ../sb/*
//   node scripts/build.mjs --out DIR  -> escribe en DIR (para previsualizar sin tocar la raíz)
// No toca el sitio anterior (queda en /classic y en /static); el nuevo vive bajo /sb.
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  T, LINKS, DOORS, JOURNEY, FACTS, STATS, PROJECTS, MORE, CYBER_AREAS,
  UDEMY, CODE_LANGS, GAME_COURSES, AI_TRAINING, EVENTS, ROB_SKILLS, CERTS, GOALS
} from '../src/content.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const site = resolve(here, '..');
const outArg = process.argv.indexOf('--out');
const root = outArg > -1 ? resolve(process.argv[outArg + 1]) : resolve(site, '..');

// ── helpers ──
const es = k => (T[k] ? T[k].es : (console.warn('clave i18n ausente:', k), ''));
const escAttr = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const art = id => `/sb/art/${id}.webp`;
// nodo con texto literal o traducible ('@clave')
const node = (tag, v, cls, extra = '') => {
  const c = cls ? ` class="${cls}"` : '';
  if (typeof v === 'string' && v[0] === '@') { const k = v.slice(1); return `<${tag}${c} data-i18n="${k}"${extra}>${es(k)}</${tag}>`; }
  return `<${tag}${c}${extra}>${v}</${tag}>`;
};
// span traducible/literal en línea
const sp = v => node('span', v);

const SHIELD = '<svg width="24" height="24" viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M16 2.5 L27.5 7 V16 C27.5 23.5 22.5 28.5 16 30 C9.5 28.5 4.5 23.5 4.5 16 V7 Z" stroke="#2f7d57" stroke-width="2.6" stroke-linejoin="round"/><path d="M11 16.2 L14.6 19.8 L21.5 12.5" stroke="#2f7d57" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

// ── Header + menú ──
const header = `
<header class="hdr" id="hdr">
  <a class="logo" href="#top" data-i18n-aria="aria.home">${SHIELD}Rafael&nbsp;Gálvez</a>
  <div class="hdr-actions">
    <button class="btn ghost sm" data-motion-toggle aria-pressed="false" data-i18n-aria="ui.motion_off"><span data-motion-label aria-hidden="true">❚❚</span></button>
    <button class="btn ghost sm" data-lang-toggle data-i18n-aria="ui.lang"><span data-lang-label>EN</span></button>
    <button class="btn sm" data-menu-open data-i18n-aria="ui.menu"><span aria-hidden="true">☰</span>${node('span', '@ui.menu', 'menu-txt')}</button>
  </div>
</header>`;

const navOverlay = `
<div class="nav-overlay" id="nav-overlay" role="dialog" aria-modal="true" data-i18n-aria="ui.aria_nav">
  <button class="btn sm nav-close" data-menu-close>${node('span', '@ui.close')}</button>
  ${node('h2', '@hall.title')}
  ${node('p', '@hall.sub', 'sub')}
  <div class="nav-grid">
    ${DOORS.map(d => `<a class="nav-door" href="#${d.id}"><img src="${art(d.art)}" alt="" loading="lazy">${node('span', d.label)}</a>`).join('')}
  </div>
</div>`;

// ── Hero / entrada ──
const hero = `
<section class="hero" id="home">
  <div class="scene" aria-hidden="true">
    <div class="layer brick" data-depth="0.015"></div>
    <div class="layer ground"></div>
    <img class="layer cloud-a" data-depth="-0.1" src="${art('clouds')}" alt="">
    <img class="layer cloud-b" data-depth="-0.07" src="${art('clouds2')}" alt="">
    <img class="layer tree" data-depth="0.05" src="${art('tree')}" alt="">
    <img class="layer lantern" data-depth="0.03" src="${art('lantern')}" alt="">
    <img class="layer sign" data-depth="0.01" src="${art('sign')}" alt="">
    <div class="layer sign-txt" data-depth="0.01">${node('span', '@hero.sign')}</div>
    <img class="layer window" data-depth="0.04" src="${art('avatar-window')}" alt="">
    <img class="layer door" data-depth="0.035" src="${art('door-main')}" alt="">
    <img class="layer planter" data-depth="0.05" src="${art('planter')}" alt="">
    <img class="layer mailbox" data-depth="0.055" src="${art('mailbox')}" alt="">
    <img class="layer path" data-depth="0.02" src="${art('path')}" alt="">
  </div>
  <div class="hero-card">
    <span class="pill"><span class="dot"></span>${node('span', '@hero.pill')}</span>
    ${node('h1', '@hero.title')}
    ${node('p', '@hero.sub', 'sub')}
    <div class="cta">
      <a class="btn accent" href="#about">${node('span', '@ui.enter')}</a>
      <a class="btn" href="#projects">${node('span', '@nav.projects')}</a>
    </div>
    <p class="hint">${node('span', '@hero.hint')} <span class="scroll-cue" aria-hidden="true">↓</span></p>
  </div>
</section>`;

// ── Pasillo 3D (corredor real que se recorre con scroll) ──
// Puertas empotradas en las paredes (con número grabado), lámparas colgando con
// luz, niebla de profundidad, cuadros y resplandor al final. app.js desplaza el
// "mundo" en Z. Escala a cualquier número de secciones: se alarga con DOORS.
const HW = 500, DSTEP = 300, DZ0 = -360;
const LASTZ = DZ0 - (DOORS.length - 1) * DSTEP;
const ENDZ = LASTZ - 560;

// Las puertas miran hacia la cámara (giradas ~26°) y se apoyan en el suelo, con
// una sombra de contacto que las "pega" al suelo (adiós aspecto de pegatina).
const DOORX = 360, DOORA = 26, FLOORY = 322;
const corridorDoors = DOORS.map((d, i) => {
  const left = i % 2 === 0;
  const x = left ? -DOORX : DOORX;
  const a = left ? DOORA : -DOORA;
  const z = DZ0 - i * DSTEP;
  return `<div class="cshadow" data-cz="${z}" style="transform:translate3d(${x}px,${FLOORY}px,${z}px) rotateX(90deg)" aria-hidden="true"></div>
    <div class="cbay ${left ? 'l' : 'r'}" data-cz="${z}" data-key="${d.label.slice(1)}" style="transform:translate3d(${x}px,140px,${z}px) rotateY(${a}deg)" aria-hidden="true">
      <span class="cbay-num">${('0' + (i + 1)).slice(-2)}</span>
      <a class="cdoor" href="#${d.id}" tabindex="-1"><img src="${art(d.art)}" alt=""></a>
    </div>`;
}).join('');

// Cuadros enmarcados colgados en las paredes, entre las puertas (galería al pasar).
const PICS = [
  { art: 'bug', frame: 'frame-simple' }, { art: 'gear', frame: 'frame-ornate' },
  { art: 'medal', frame: 'frame-simple' }, { art: 'duck', frame: 'frame-ornate' },
  { art: 'robot', frame: 'frame-simple' }, { art: 'magnifier', frame: 'frame-ornate' }
];
const corridorPics = PICS.map((pic, i) => {
  const z = DZ0 - 280 - i * DSTEP;
  const left = i % 2 !== 0;
  const x = left ? -(HW - 4) : (HW - 4);
  const a = left ? 90 : -90;
  return `<div class="cpic" data-cz="${z}" style="transform:translate3d(${x}px,-150px,${z}px) rotateY(${a}deg)" aria-hidden="true">
      <img class="cpic-in" src="${art(pic.art)}" alt=""><img class="cpic-frame" src="${art(pic.frame)}" alt="">
    </div>`;
}).join('');

// Lámparas colgando del techo, con su charco de luz.
const lampZs = [];
for (let z = -280; z > ENDZ + 160; z -= DSTEP) lampZs.push(z);
const corridorLamps = lampZs.map(z => `<img class="clamp" data-cz="${z}" src="${art('lamp')}" alt="" style="transform:translate3d(0,-262px,${z}px)"><div class="clamp-glow" data-cz="${z}" style="transform:translate3d(0,-120px,${z}px)"></div>`).join('');

// Planos de niebla: tiñen lo que queda por detrás -> profundidad atmosférica.
const fogZs = [0.42, 0.66, 0.88].map(t => Math.round(ENDZ * t));
const corridorFog = fogZs.map(z => `<div class="cfog" style="transform:translateZ(${z}px)"></div>`).join('');

const hall = `
<section class="corridor-journey" id="hall">
  <div class="corridor-stage" aria-hidden="true">
    <div class="corridor-world">
      <div class="cplane cfloor"></div>
      <div class="cplane cceil"></div>
      <div class="cplane cwall cwall-l"></div>
      <div class="cplane cwall cwall-r"></div>
      ${corridorPics}
      ${corridorDoors}
      ${corridorLamps}
      ${corridorFog}
      <a class="cend" href="#about" data-cz="${ENDZ}" style="transform:translateZ(${ENDZ}px)" aria-label="Entrar"><img src="${art('door-end')}" alt=""><span class="cend-cue">${node('span', '@hall.enter')}</span></a>
    </div>
    <div class="corridor-glow"></div>
    <div class="corridor-vignette"></div>
    <div class="corridor-hud">
      <div class="chud-now"><span class="chud-now-num"></span><span class="chud-now-label"></span></div>
      <div class="chud-bar"><span class="chud-fill"></span></div>
      ${node('p', '@hall.scroll', 'chud-hint')}
    </div>
  </div>
  <div class="frame hall-fallback">
    <div class="sec-head" style="margin-inline:auto;text-align:center">
      ${node('h2', '@hall.title')}
      ${node('p', '@hall.sub', 'lead')}
    </div>
    <nav class="hall-doors" data-i18n-aria="ui.aria_nav">
      ${DOORS.map((d, i) => `<a class="hall-door" href="#${d.id}"><span class="num">0${i + 1}</span><div class="d-img"><img src="${art(d.art)}" alt="" loading="lazy"></div>${node('span', d.label, 'lbl')}</a>`).join('')}
    </nav>
  </div>
</section>`;

// ── Sobre mí ──
const about = `
<section id="about">
  <div class="frame">
    <div class="sec-head reveal">${node('p', '@about.kicker', 'kicker')}${node('h2', '@about.title')}</div>
    <div class="about-grid">
      <div class="about-text reveal">
        ${node('p', '@about.p1')}${node('p', '@about.p2')}${node('p', '@about.p3')}
      </div>
      <div class="avatar-card reveal d1">
        <img src="${art('avatar')}" alt="Retrato a lápiz de Rafael Gálvez" width="320">
        <div class="facts">
          ${FACTS.map(([k, v]) => `<div class="fact">${node('div', k, 'k')}${node('div', v, 'v')}</div>`).join('')}
        </div>
      </div>
    </div>
    <div class="stats">
      ${STATS.map(s => `<div class="stat reveal"><div class="n" data-count="${s.to}" data-suffix="${s.suffix}">0</div>${node('div', s.label, 'l')}</div>`).join('')}
    </div>
    <div class="journey">
      ${node('h3', '@about.journey')}
      <div class="islands">
        ${JOURNEY.map((j, i) => `<div class="island reveal"><div class="float"><img src="${art(j.art)}" alt="" loading="lazy"></div><span class="step">0${i + 1}</span>${node('h4', j.h)}${node('p', j.p)}</div>`).join('')}
      </div>
    </div>
  </div>
</section>`;

// ── Proyectos ──
const pcard = p => `
<article class="pcard reveal">
  <div class="pshot">
    ${node('span', p.active ? '@proj.active' : '@proj.done', 'badge' + (p.active ? ' on' : ''))}
    <span class="hoverhint" aria-hidden="true" data-i18n="ui.demo">${es('ui.demo')}</span>
    <img src="${p.img}" alt="${escAttr(p.alt)}" loading="lazy">
    <img class="gif" src="${p.gif}" alt="" loading="lazy">
  </div>
  <h3>${p.name} ${node('span', p.role, 'role')}</h3>
  ${node('p', p.desc, 'desc')}
  <div class="metrics">${p.metrics.map(([v, l]) => `<div><b>${v}</b>${node('span', l)}</div>`).join('')}</div>
  <p class="stack">${p.stack}</p>
  <div class="foot"><a class="btn sm accent" href="${p.href}" target="_blank" rel="noopener">${node('span', '@ui.open_project')} ↗</a></div>
</article>`;

const mcard = m => `
<a class="mcard reveal" href="${m.href}" target="_blank" rel="noopener">
  <div class="top"><span class="name">${m.name}</span><span class="lang">${m.lang}</span></div>
  ${node('p', m.p)}
  <span class="star">${m.star}</span>
</a>`;

const projects = `
<section class="projects" id="projects">
  <div class="frame">
    <div class="sec-head reveal">${node('p', '@proj.kicker', 'kicker')}${node('h2', '@proj.title')}${node('p', '@proj.sub', 'lead')}</div>
    <div class="board">${PROJECTS.map(pcard).join('')}</div>
    <div class="more">
      ${node('h3', '@proj.more')}
      <div class="more-grid">${MORE.map(mcard).join('')}</div>
    </div>
  </div>
</section>`;

// ── Ciberseguridad ──
const cyber = `
<section class="cyber" id="cyber">
  <div class="frame">
    <div class="sec-head reveal">${node('p', '@cyber.kicker', 'kicker')}${node('h2', '@cyber.title')}${node('p', '@cyber.sub', 'lead')}</div>
    ${node('h3', '@cyber.areas', 'block-title reveal')}
    <div class="icards">
      ${CYBER_AREAS.map(a => `<div class="icard reveal"><div class="ic"><img src="${art(a.art)}" alt="" loading="lazy"></div>${node('h4', a.k)}</div>`).join('')}
    </div>
    <div class="notebook reveal">
      ${node('h3', '@cyber.courses')}
      ${node('p', '@cyber.courses_sub', 'nb-sub')}
      <ul class="checklist">${UDEMY.map(c => `<li>${c}</li>`).join('')}</ul>
    </div>
  </div>
</section>`;

// ── Programación ──
const code = `
<section id="code">
  <div class="frame">
    <div class="sec-head reveal">${node('p', '@code.kicker', 'kicker')}${node('h2', '@code.title')}${node('p', '@code.sub', 'lead')}</div>
    <div class="two-col">
      <div class="reveal">
        ${node('h3', '@code.lang', 'block-title')}
        <div class="chips">${CODE_LANGS.map(l => `<span class="chip">${l}</span>`).join('')}</div>
        ${node('h3', '@code.games', 'block-title')}
        ${node('p', '@code.games_p')}
        <div class="chips">${GAME_COURSES.map(g => node('span', g, 'chip')).join('')}</div>
      </div>
      <div class="panel-art reveal d1"><div class="float"><img src="${art('pegboard')}" alt="" loading="lazy"></div></div>
    </div>
  </div>
</section>`;

// ── IA & Hackatones ──
const ai = `
<section id="ai">
  <div class="frame">
    <div class="sec-head reveal">${node('p', '@ai.kicker', 'kicker')}${node('h2', '@ai.title')}${node('p', '@ai.sub', 'lead')}</div>
    <div class="two-col">
      <div class="reveal">
        ${node('h3', '@ai.training', 'block-title')}
        <ul class="checklist">${AI_TRAINING.map(a => node('li', a)).join('')}</ul>
      </div>
      <div class="panel-art reveal d1"><div class="float"><img src="${art('bulb')}" alt="" loading="lazy"></div></div>
    </div>
    ${node('h3', '@ai.events', 'block-title reveal')}
    <div class="icards">
      ${EVENTS.map(e => `<div class="icard reveal"><div class="ic"><img src="${art(e.art)}" alt="" loading="lazy"></div>${node('span', e.w, 'meta')}${node('h4', e.h)}${node('p', e.p)}${e.href ? `<a class="btn sm ghost" href="${e.href}" target="_blank" rel="noopener">${node('span', '@ui.visit')} ↗</a>` : ''}</div>`).join('')}
    </div>
  </div>
</section>`;

// ── Robótica ──
const robotics = `
<section class="robotics" id="robotics">
  <div class="frame">
    <div class="sec-head reveal">${node('p', '@rob.kicker', 'kicker')}${node('h2', '@rob.title')}</div>
    <div class="spotlight">
      <div class="trophy-wrap reveal"><div class="float"><img src="${art('trophy')}" alt="" loading="lazy"></div></div>
      <div class="award reveal d1">
        ${node('h3', '@rob.h')}
        <div class="badge-row">${node('span', '@rob.tag1', 'b')}${node('span', '@rob.tag2', 'b')}${node('span', '@rob.tag3', 'b')}</div>
        ${node('p', '@rob.p')}
        ${node('h4', '@rob.skills', 'block-title')}
        <div class="chips">${ROB_SKILLS.map(s => node('span', s, 'chip')).join('')}</div>
      </div>
    </div>
  </div>
</section>`;

// ── Certificaciones ──
const certTag = t => (t === '@cert.obtained' ? 'tag ok' : t === '@cert.prep' ? 'tag prep' : 'tag');
const certs = `
<section id="certs">
  <div class="frame">
    <div class="sec-head reveal">${node('p', '@cert.kicker', 'kicker')}${node('h2', '@cert.title')}</div>
    <div class="icards">
      ${CERTS.map(c => `<div class="icard reveal"><div class="ic"><img src="${art(c.art)}" alt="" loading="lazy"></div>${node('span', c.tag, certTag(c.tag))}${node('h4', c.title)}${node('span', c.org, 'meta')}${node('p', c.p)}</div>`).join('')}
    </div>
  </div>
</section>`;

// ── Objetivo ──
const goal = `
<section class="goal" id="goal">
  <div class="frame">
    <div class="sec-head reveal">${node('p', '@goal.kicker', 'kicker')}${node('h2', '@goal.title')}${node('p', '@goal.sub', 'lead')}</div>
    <div class="goal-list">
      ${GOALS.map(g => `<div class="goal-item reveal"><span class="arrow" aria-hidden="true">→</span>${node('span', g)}</div>`).join('')}
    </div>
    <div class="banner reveal"><img class="landscape" data-px="30" src="${art('landscape')}" alt="Camino de campo hacia montañas al amanecer" loading="lazy"></div>
  </div>
</section>`;

// ── Contacto ──
const contact = `
<section class="contact" id="contact">
  <div class="frame">
    <div class="sec-head reveal">${node('p', '@contact.kicker', 'kicker')}${node('h2', '@contact.title')}</div>
    <div class="contact-card reveal">
      ${node('p', '@contact.sub', 'lead')}
      <div class="contact-links">
        <a class="btn accent" href="mailto:${LINKS.email}">${node('span', '@contact.email')}</a>
        <button class="btn" type="button" data-copy-email="${LINKS.email}">${node('span', '@contact.copy')}</button>
        <a class="btn" href="${LINKS.github}" target="_blank" rel="noopener">GitHub ↗</a>
        <a class="btn" href="${LINKS.linkedin}" target="_blank" rel="noopener">LinkedIn ↗</a>
        <a class="btn" href="${LINKS.cv}" download="CV Rafael Galvez.pdf">${node('span', '@contact.cv')} ↓</a>
      </div>
    </div>
    <div class="banner reveal"><img class="sea" data-px="30" src="${art('sea')}" alt="Costa mediterránea al final de un muelle de madera" loading="lazy"></div>
  </div>
</section>`;

const footer = `
<footer>
  <div class="frame foot-in">
    <div>
      <div class="foot-brand">Rafael Gálvez Silipo</div>
      ${node('p', '@foot.made', 'foot-made')}
    </div>
    <div class="foot-links">
      <a href="${LINKS.github}" target="_blank" rel="noopener">GitHub</a>
      <a href="${LINKS.linkedin}" target="_blank" rel="noopener">LinkedIn</a>
      <a href="${LINKS.cv}" download="CV Rafael Galvez.pdf">${node('span', '@contact.cv')}</a>
      <a href="${LINKS.classic}">${node('span', '@foot.classic')}</a>
      <a href="#top">${node('span', '@ui.back_top')} ↑</a>
    </div>
  </div>
  <div class="frame foot-copy">${node('span', '@foot.copy')}</div>
</footer>
<div class="toast" id="toast" role="status" aria-live="polite"></div>`;

// ── i18n para el cliente (ambos idiomas) ──
const i18nClient = {};
for (const l of ['es', 'en']) { i18nClient[l] = {}; for (const k in T) i18nClient[l][k] = T[k][l] != null ? T[k][l] : T[k].es; }
const i18nJson = JSON.stringify(i18nClient).replace(/</g, '\\u003c');

const head = `<!DOCTYPE html>
<html lang="es" data-lang-pending>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escAttr(es('meta.title'))}</title>
<meta name="description" content="${escAttr(es('meta.desc'))}">
<meta name="author" content="Rafael Gálvez Silipo">
<meta name="keywords" content="Rafael Gálvez Silipo, ciberseguridad, cybersecurity, red team, pentesting, Active Directory, OSINT, C2, Málaga, portfolio">
<meta name="theme-color" content="#f3ecdb">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<meta property="og:type" content="website">
<meta property="og:title" content="${escAttr(es('meta.title'))}">
<meta property="og:description" content="${escAttr(es('meta.desc'))}">
<meta property="og:url" content="https://ruby570bocadito.github.io/">
<meta property="og:image" content="${art('avatar-window')}">
<meta name="twitter:card" content="summary_large_image">
<link rel="preload" as="font" type="font/woff2" href="/sb/fonts/nunito-400.woff2" crossorigin>
<link rel="preload" as="font" type="font/woff2" href="/sb/fonts/cabin-sketch-700.woff2" crossorigin>
<link rel="preload" as="image" href="${art('brick')}">
<link rel="preload" as="image" href="${art('door-main')}">
<link rel="stylesheet" href="/sb/app.css">
<script>
  (function () {
    var s = null; try { s = localStorage.getItem('rgs_lang'); } catch (e) {}
    var l = (s === 'es' || s === 'en') ? s : ((navigator.language || 'es').toLowerCase().indexOf('en') === 0 ? 'en' : 'es');
    document.documentElement.setAttribute('lang', l);
    if (l === 'es') document.documentElement.removeAttribute('data-lang-pending');
  })();
</script>
<style>html[data-lang-pending] body{visibility:hidden}</style>
<noscript><style>html[data-lang-pending] body{visibility:visible}</style></noscript>
<script>window.__I18N=${i18nJson};</script>
</head>`;

const html = `${head}
<body>
<a class="sr-only focusable" href="#about">${es('ui.skip')}</a>
${header}
${navOverlay}
<main id="top">
${hero}
${hall}
${about}
${projects}
${cyber}
${code}
${ai}
${robotics}
${certs}
${goal}
${contact}
</main>
${footer}
<script src="/sb/app.js" defer></script>
</body>
</html>`;

const notFound = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>404 — Rafael Gálvez</title><meta name="theme-color" content="#f3ecdb">
<style>body{margin:0;min-height:100vh;display:grid;place-items:center;text-align:center;background:#f3ecdb;color:#2c2824;font-family:system-ui,sans-serif;padding:2rem}h1{font-size:4rem;margin:0}a{color:#4b3f8f}</style></head>
<body><div><h1>404</h1><p>Esta página se ha ido a otro laboratorio.<br>This page wandered off to another lab.</p><p><a href="/">← Volver al inicio / Back home</a></p></div></body></html>`;

// ── escribir ──
mkdirSync(resolve(root, 'sb'), { recursive: true });
let js = readFileSync(resolve(site, 'src/app.js'), 'utf8');
try {
  const terser = await import('terser');
  const r = await terser.minify(js, { compress: true, mangle: true });
  if (r.code) js = r.code;
} catch (e) { console.warn('terser no disponible, JS sin minificar:', e.message); }

writeFileSync(resolve(root, 'index.html'), html);
writeFileSync(resolve(root, '404.html'), notFound);
cpSync(resolve(site, 'src/app.css'), resolve(root, 'sb/app.css'));
writeFileSync(resolve(root, 'sb/app.js'), js);
// Las imágenes y fuentes solo se recopian si existe su origen (public/art está
// fuera de git; en un clon limpio se conservan las ya publicadas en /sb).
if (existsSync(resolve(site, 'public/art'))) {
  rmSync(resolve(root, 'sb/art'), { recursive: true, force: true });
  cpSync(resolve(site, 'public/art'), resolve(root, 'sb/art'), { recursive: true });
} else { console.log('· public/art ausente: se conserva /sb/art ya publicado'); }
if (existsSync(resolve(site, 'public/fonts'))) {
  rmSync(resolve(root, 'sb/fonts'), { recursive: true, force: true });
  cpSync(resolve(site, 'public/fonts'), resolve(root, 'sb/fonts'), { recursive: true });
}
console.log(`✓ index.html + /sb escritos en ${root}`);
