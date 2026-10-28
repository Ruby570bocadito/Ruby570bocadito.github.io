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

  /* ---------- parallax de la escena ---------- */
  var layers = Array.prototype.slice.call(document.querySelectorAll('.scene .layer[data-depth]'));
  function onScrollParallax() {
    if (motionOff || reduce) return;
    var y = window.pageYOffset;
    if (y > window.innerHeight * 1.2) return;
    for (var i = 0; i < layers.length; i++) {
      var d = parseFloat(layers[i].getAttribute('data-depth')) || 0;
      layers[i].style.transform = (layers[i].dataset.base || '') + ' translate3d(0,' + (y * d) + 'px,0)';
    }
  }
  layers.forEach(function (l) {
    var cs = getComputedStyle(l).transform;
    l.dataset.base = cs && cs !== 'none' ? '' : (l.style.transform || '');
  });

  /* ---------- pasillo 3D (avanzar al hacer scroll) ---------- */
  var cj = document.querySelector('.corridor-journey');
  var cworld = document.querySelector('.corridor-world');
  var DEPTH = 2050;
  var corridorOn = false;
  (function initCorridor() {
    if (!cj || !cworld) return;
    var supports3d = window.CSS && CSS.supports && (CSS.supports('transform-style', 'preserve-3d') || CSS.supports('-webkit-transform-style', 'preserve-3d'));
    if (reduce || !supports3d) return;          // sin 3D o con "reducir animación": rejilla de reserva
    corridorOn = true;
    cj.classList.add('on');
  })();
  function onScrollCorridor() {
    if (!corridorOn) return;
    var total = cj.offsetHeight - window.innerHeight;
    var p = total > 0 ? (-cj.getBoundingClientRect().top) / total : 0;
    p = p < 0 ? 0 : p > 1 ? 1 : p;
    cworld.style.setProperty('--cz', (p * DEPTH).toFixed(1) + 'px');
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return; ticking = true;
    requestAnimationFrame(function () { onScrollHdr(); onScrollParallax(); onScrollCorridor(); ticking = false; });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  onScroll();

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
