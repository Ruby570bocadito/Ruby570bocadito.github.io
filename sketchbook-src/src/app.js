/* Portfolio de Rafael Gálvez — interacción (vanilla JS, sin dependencias).
   i18n ES/EN, parallax de la escena, reveals al hacer scroll, contadores,
   menú de puertas, cabecera que se oculta, copiar correo y conmutador de animación. */
(function () {
  'use strict';
  var I18N = window.__I18N || { es: {}, en: {} };
  var LANGS = ['es', 'en'];
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- idioma ---------- */
  function savedLang() {
    try { var s = localStorage.getItem('rgs_lang'); if (s === 'es' || s === 'en') return s; } catch (e) {}
    return (navigator.language || 'es').toLowerCase().indexOf('en') === 0 ? 'en' : 'es';
  }
  function t(key, lang) { var d = I18N[lang] || I18N.es; return d[key] != null ? d[key] : (I18N.es[key] || ''); }

  function applyLang(lang) {
    if (LANGS.indexOf(lang) < 0) lang = 'es';
    root.setAttribute('lang', lang);
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      el.innerHTML = t(el.getAttribute('data-i18n'), lang);
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria'), lang));
    });
    document.querySelectorAll('[data-i18n-title]').forEach(function (el) {
      el.setAttribute('title', t(el.getAttribute('data-i18n-title'), lang));
    });
    var titleEl = document.querySelector('title');
    if (titleEl) titleEl.textContent = t('meta.title', lang);
    var md = document.querySelector('meta[name="description"]');
    if (md) md.setAttribute('content', t('meta.desc', lang));
    document.querySelectorAll('[data-lang-label]').forEach(function (el) {
      el.textContent = lang === 'es' ? 'EN' : 'ES';
    });
    try { localStorage.setItem('rgs_lang', lang); } catch (e) {}
    root.removeAttribute('data-lang-pending');
  }

  var lang = savedLang();
  applyLang(lang);
  document.querySelectorAll('[data-lang-toggle]').forEach(function (btn) {
    btn.addEventListener('click', function () { lang = lang === 'es' ? 'en' : 'es'; applyLang(lang); });
  });

  /* ---------- conmutador de animación ---------- */
  var motionOff = false;
  try { motionOff = localStorage.getItem('rgs_motion') === 'off'; } catch (e) {}
  function applyMotion() {
    document.body.classList.toggle('no-motion', motionOff);
    document.querySelectorAll('[data-motion-toggle]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(motionOff));
      var lab = b.querySelector('[data-motion-label]');
      if (lab) lab.textContent = motionOff ? '▶' : '❚❚';
    });
  }
  applyMotion();
  document.querySelectorAll('[data-motion-toggle]').forEach(function (b) {
    b.addEventListener('click', function () {
      motionOff = !motionOff;
      try { localStorage.setItem('rgs_motion', motionOff ? 'off' : 'on'); } catch (e) {}
      applyMotion();
    });
  });

  /* ---------- menú de puertas ---------- */
  var overlay = document.getElementById('nav-overlay');
  function setMenu(open) {
    if (!overlay) return;
    overlay.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) { var f = overlay.querySelector('a,button'); if (f) f.focus(); }
  }
  document.querySelectorAll('[data-menu-open]').forEach(function (b) { b.addEventListener('click', function () { setMenu(true); }); });
  document.querySelectorAll('[data-menu-close]').forEach(function (b) { b.addEventListener('click', function () { setMenu(false); }); });
  if (overlay) overlay.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (a) setMenu(false);
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  /* ---------- cabecera ---------- */
  var hdr = document.querySelector('.hdr');
  var lastY = 0;
  function onScrollHdr() {
    var y = window.pageYOffset;
    if (hdr) {
      hdr.classList.toggle('solid', y > 60);
      if (y > lastY && y > 340 && !(overlay && overlay.classList.contains('open'))) hdr.classList.add('hidden');
      else hdr.classList.remove('hidden');
    }
    lastY = y;
  }

  /* ---------- reveals ---------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); runCounter(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
    document.querySelectorAll('[data-count]').forEach(function (el) { el.textContent = el.getAttribute('data-count') + (el.getAttribute('data-suffix') || ''); });
  }

  /* ---------- contadores ---------- */
  function runCounter(scope) {
    var els = scope.matches && scope.matches('[data-count]') ? [scope] : scope.querySelectorAll ? scope.querySelectorAll('[data-count]') : [];
    Array.prototype.forEach.call(els, function (el) {
      if (el.dataset.done) return; el.dataset.done = '1';
      var to = parseInt(el.getAttribute('data-count'), 10) || 0;
      var suffix = el.getAttribute('data-suffix') || '';
      if (motionOff || reduce) { el.textContent = to + suffix; return; }
      var start = performance.now(), dur = 1400;
      function step(now) {
        var p = Math.min((now - start) / dur, 1);
        var e = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(to * e).toLocaleString(lang === 'es' ? 'es-ES' : 'en-US') + suffix;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }

  /* ---------- puntero (para parallax y "mirar" en el pasillo) ---------- */
  var winH = window.innerHeight;
  var pX = 0, pY = 0, pRAF = 0;
  if (!reduce) window.addEventListener('pointermove', function (e) {
    pX = (e.clientX / window.innerWidth - 0.5) * 2;
    pY = (e.clientY / winH - 0.5) * 2;
    if (!pRAF) pRAF = requestAnimationFrame(function () { pRAF = 0; applyParallax(); });
  }, { passive: true });

  /* ---------- parallax de la escena (héroe) + banners ---------- */
  var layers = Array.prototype.slice.call(document.querySelectorAll('.scene .layer[data-depth]'));
  layers.forEach(function (l) { var cs = getComputedStyle(l).transform; l.dataset.base = cs && cs !== 'none' ? '' : (l.style.transform || ''); });
  var pxEls = Array.prototype.slice.call(document.querySelectorAll('[data-px]')).map(function (el) { return { el: el, f: parseFloat(el.getAttribute('data-px')) || 20 }; });

  function applyParallax() {
    if (motionOff || reduce) return;
    var y = window.pageYOffset, i, d;
    if (y < winH * 1.25) {
      for (i = 0; i < layers.length; i++) {
        d = parseFloat(layers[i].getAttribute('data-depth')) || 0;
        layers[i].style.transform = layers[i].dataset.base + ' translate3d(' + (pX * d * 300).toFixed(1) + 'px,' + (y * d + pY * d * 180).toFixed(1) + 'px,0)';
      }
    }
    for (i = 0; i < pxEls.length; i++) {
      var el = pxEls[i].el, f = pxEls[i].f, r = el.getBoundingClientRect();
      if (r.bottom < -40 || r.top > winH + 40) continue;
      var prog = (r.top + r.height / 2 - winH / 2) / winH;   // -0.5…0.5
      el.style.transform = 'scale(1.12) translate(' + (pX * f * 0.35).toFixed(1) + 'px,' + (-prog * f).toFixed(1) + 'px)';
    }
    if (corridorOn) {
      cstage.style.setProperty('--look-x', (pX * 26).toFixed(1) + 'px');
      cstage.style.setProperty('--look-y', (pY * 15).toFixed(1) + 'px');
    }
  }

  /* ---------- pasillo 3D (avanzar al hacer scroll, con inercia) ---------- */
  var cj = document.querySelector('.corridor-journey');
  var cworld = document.querySelector('.corridor-world');
  var cstage = document.querySelector('.corridor-stage');
  var DEPTH = 2050;
  var corridorOn = false;
  (function initCorridor() {
    if (!cj || !cworld) return;
    var supports3d = window.CSS && CSS.supports && (CSS.supports('transform-style', 'preserve-3d') || CSS.supports('-webkit-transform-style', 'preserve-3d'));
    if (reduce || !supports3d) return;          // sin 3D o con "reducir animación": rejilla de reserva
    corridorOn = true;
    cj.classList.add('on');
  })();

  var doorBays = corridorOn ? Array.prototype.slice.call(cworld.querySelectorAll('.cbay')) : [];
  var cend = cworld && cworld.querySelector('.cend');
  var hudNow = document.querySelector('.chud-now');
  var hudNowLabel = document.querySelector('.chud-now-label');
  var hudNowNum = document.querySelector('.chud-now-num');
  var cfill = document.querySelector('.chud-fill');
  var cglow = document.querySelector('.corridor-glow');
  // La profundidad total se deduce de la puerta del fondo (escala con el nº de secciones).
  if (corridorOn && cend) { var ez = parseFloat(cend.getAttribute('data-cz')) || -3000; DEPTH = -ez - 580; }

  function updateCorridorElems(cz) {
    var i, zc, best = -1, bd = 1e9;
    for (i = 0; i < doorBays.length; i++) {
      zc = (parseFloat(doorBays[i].getAttribute('data-cz')) || 0) + cz;
      if (zc < 170) { var dd = Math.abs(zc + 260); if (dd < bd) { bd = dd; best = i; } }
    }
    for (i = 0; i < doorBays.length; i++) doorBays[i].classList.toggle('near', i === best);
    if (hudNow) {
      if (best >= 0) {
        var key = doorBays[best].getAttribute('data-key');
        if (hudNowLabel) hudNowLabel.textContent = (I18N[lang] && I18N[lang][key]) || (I18N.es[key] || '');
        if (hudNowNum) hudNowNum.textContent = ('0' + (best + 1)).slice(-2);
        hudNow.classList.add('show');
      } else hudNow.classList.remove('show');
    }
  }

  var czTarget = 0, czCur = 0, czRAF = 0;
  function czLoop() {
    czCur += (czTarget - czCur) * 0.13;
    if (Math.abs(czTarget - czCur) < 0.5) czCur = czTarget;
    cworld.style.setProperty('--cz', czCur.toFixed(1) + 'px');
    updateCorridorElems(czCur);
    var prog = czCur / DEPTH; if (prog < 0) prog = 0; else if (prog > 1) prog = 1;
    if (cfill) cfill.style.width = (prog * 100).toFixed(1) + '%';
    if (cglow) { var pr = (prog - 0.58) / 0.42; cglow.style.opacity = (pr < 0 ? 0 : pr > 1 ? 1 : pr).toFixed(3); }
    czRAF = czCur !== czTarget ? requestAnimationFrame(czLoop) : 0;
  }
  function onScrollCorridor() {
    if (!corridorOn) return;
    var total = cj.offsetHeight - winH;
    var p = total > 0 ? (-cj.getBoundingClientRect().top) / total : 0;
    p = p < 0 ? 0 : p > 1 ? 1 : p;
    czTarget = p * DEPTH;
    if (!czRAF) czRAF = requestAnimationFrame(czLoop);
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return; ticking = true;
    requestAnimationFrame(function () { onScrollHdr(); applyParallax(); onScrollCorridor(); ticking = false; });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () { winH = window.innerHeight; onScroll(); }, { passive: true });
  onScroll();
  if (corridorOn) { updateCorridorElems(0); }

  /* ---------- copiar correo ---------- */
  var toast = document.getElementById('toast');
  var toastTimer;
  document.querySelectorAll('[data-copy-email]').forEach(function (b) {
    b.addEventListener('click', function (e) {
      var email = b.getAttribute('data-copy-email');
      function ok() {
        if (!toast) return;
        toast.textContent = t('contact.copied', lang);
        toast.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 2200);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        e.preventDefault();
        navigator.clipboard.writeText(email).then(ok).catch(function () {});
      }
    });
  });

  /* ---------- año en curso en el footer ---------- */
  var y = new Date().getFullYear();
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = y; });
})();
