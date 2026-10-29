(() => {
  'use strict';
  const doc = document.documentElement;
  doc.classList.add('js');
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(pointer: fine)').matches;

  /* ---------------- i18n ---------------- */
  const ES = {};
  $$('[data-i18n]').forEach(el => { ES[el.dataset.i18n] = el.innerHTML; });
  const ES_ARIA = {};
  $$('[data-i18n-aria]').forEach(el => { ES_ARIA[el.dataset.i18nAria] = el.getAttribute('aria-label'); });
  const T = {
    es: { 'toast.copy': 'Correo copiado al portapapeles', 'cd.in': 'faltan', 'cd.days': 'días', 'cd.today': 'hoy', 'cd.live': 'en curso', 'cd.done': 'completado' },
    en: window.I18N_EN || {}
  };
  let lang = 'es';
  try { lang = localStorage.getItem('lang') || 'es'; } catch (e) {}
  if (lang !== 'en') lang = 'es';
  const t = k => T[lang][k] || T.es[k] || k;

  function applyLang(l) {
    lang = l;
    doc.lang = l;
    $$('[data-i18n]').forEach(el => {
      const k = el.dataset.i18n;
      const v = l === 'en' ? T.en[k] : ES[k];
      if (v != null) el.innerHTML = v;
    });
    $$('[data-i18n-aria]').forEach(el => {
      const k = el.dataset.i18nAria;
      const v = l === 'en' ? T.en[k] : ES_ARIA[k];
      if (v) el.setAttribute('aria-label', v);
    });
    try { localStorage.setItem('lang', l); } catch (e) {}
    restartTyping();
    updateCountdowns();
  }
  $('.lang').addEventListener('click', () => applyLang(lang === 'es' ? 'en' : 'es'));

  /* ---------------- typing roles ---------------- */
  const typed = $('.typed');
  let typeTimer;
  function restartTyping() {
    clearTimeout(typeTimer);
    const roles = (typed.dataset['roles' + (lang === 'en' ? 'En' : 'Es')] || '').split('|');
    if (reduced) { typed.textContent = roles[0]; return; }
    let r = 0, i = roles[0].length, del = true;
    typed.textContent = roles[0];
    const tick = () => {
      const word = roles[r];
      if (del) {
        i--; typed.textContent = word.slice(0, i);
        if (i <= 0) { del = false; r = (r + 1) % roles.length; }
        typeTimer = setTimeout(tick, 32);
      } else {
        const w = roles[r]; i++; typed.textContent = w.slice(0, i);
        if (i >= w.length) { del = true; typeTimer = setTimeout(tick, 2000); }
        else typeTimer = setTimeout(tick, 60 + Math.random() * 40);
      }
    };
    typeTimer = setTimeout(tick, 2200);
  }

  /* ---------------- nav ---------------- */
  const nav = $('.nav');
  const burger = $('.burger');
  burger.addEventListener('click', () => {
    const o = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', o);
  });
  $$('.nav-links a').forEach(a => a.addEventListener('click', () => { nav.classList.remove('open'); burger.setAttribute('aria-expanded', false); }));

  const bar = $('.progress span');
  const onScroll = () => {
    const y = scrollY;
    nav.classList.toggle('scrolled', y > 30);
    const h = document.body.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${h > 0 ? y / h : 0})`;
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // active nav link
  const links = $$('.nav-links a');
  const secObs = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  links.forEach(a => { const s = $(a.getAttribute('href')); if (s) secObs.observe(s); });

  /* ---------------- reveal ---------------- */
  const revObs = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); revObs.unobserve(e.target); }
  }), { rootMargin: '0px 0px -8% 0px' });
  $$('.reveal').forEach(el => {
    const sibs = [...el.parentElement.children].filter(c => c.classList.contains('reveal'));
    el.style.setProperty('--d', Math.min(sibs.indexOf(el), 8) * 0.07 + 's');
    revObs.observe(el);
  });

  /* ---------------- counters ---------------- */
  const cObs = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    cObs.unobserve(e.target);
    const el = e.target, to = +el.dataset.to, suf = el.dataset.suffix || '';
    const fmt = n => n.toLocaleString(lang === 'en' ? 'en-US' : 'es-ES');
    if (reduced) { el.textContent = fmt(to) + suf; return; }
    const t0 = performance.now(), dur = 1600;
    const step = now => {
      const p = Math.min((now - t0) / dur, 1), k = 1 - Math.pow(1 - p, 4);
      el.textContent = fmt(Math.round(to * k)) + suf;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }), { threshold: .6 });
  $$('.count').forEach(el => cObs.observe(el));

  /* ---------------- pointer effects ---------------- */
  const glow = $('.cursor-glow');
  if (finePointer && !reduced) {
    let gx = innerWidth / 2, gy = innerHeight / 2, cx = gx, cy = gy;
    addEventListener('pointermove', e => { gx = e.clientX; gy = e.clientY; document.body.classList.add('has-pointer'); }, { passive: true });
    const loop = () => { cx += (gx - cx) * .12; cy += (gy - cy) * .12; glow.style.transform = `translate(${cx - 300}px,${cy - 300}px)`; requestAnimationFrame(loop); };
    loop();
    $$('.magnetic').forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .25}px,${(e.clientY - r.top - r.height / 2) * .35}px)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
  }
  $$('.card').forEach(el => el.addEventListener('pointermove', e => {
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', e.clientX - r.left + 'px');
    el.style.setProperty('--my', e.clientY - r.top + 'px');
  }));

  /* ---------------- project gifs on hover ---------------- */
  $$('.project').forEach(p => {
    const img = $('img[data-gif]', p);
    if (!img) return;
    const png = img.src;
    let loaded = false;
    p.addEventListener('pointerenter', () => {
      if (!loaded) { const pre = new Image(); pre.src = img.dataset.gif; loaded = true; }
      img.src = img.dataset.gif;
    });
    p.addEventListener('pointerleave', () => { img.src = png; });
  });

  /* ---------------- course filter ---------------- */
  $$('.filters .chip').forEach(b => b.addEventListener('click', () => {
    $$('.filters .chip').forEach(x => x.classList.toggle('is-on', x === b));
    const f = b.dataset.f;
    $$('.course-list li').forEach(li => li.classList.toggle('off', f !== 'all' && li.dataset.t !== f));
  }));

  /* ---------------- events countdown ---------------- */
  function updateCountdowns() {
    const now = new Date();
    $$('.event[data-date]').forEach(ev => {
      const out = $('.countdown', ev);
      if (!ev.dataset.date || !out) return;
      const start = new Date(ev.dataset.date + 'T09:00:00');
      const end = new Date((ev.dataset.end || ev.dataset.date) + 'T23:59:59');
      const days = Math.ceil((start - now) / 864e5);
      ev.classList.toggle('upcoming', now <= end);
      if (now > end) out.textContent = t('cd.done');
      else if (now >= start) out.textContent = t('cd.live');
      else if (days <= 0) out.textContent = t('cd.today');
      else out.textContent = `${t('cd.in')} ${days} ${t('cd.days')}`;
    });
  }

  /* ---------------- email copy + clock ---------------- */
  const toast = $('.toast');
  let toastT;
  $('.email').addEventListener('click', async e => {
    const mail = e.currentTarget.dataset.email;
    try { await navigator.clipboard.writeText(mail); } catch (err) { location.href = 'mailto:' + mail; return; }
    toast.textContent = t('toast.copy');
    toast.classList.add('show');
    clearTimeout(toastT); toastT = setTimeout(() => toast.classList.remove('show'), 2200);
  });
  const clock = $('.time');
  const tickClock = () => {
    clock.textContent = new Intl.DateTimeFormat('es-ES', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Madrid' }).format(new Date());
  };
  tickClock(); setInterval(tickClock, 30000);

  /* ---------------- Rive ---------------- */
  function initRive() {
    if (!window.rive) { doc.classList.add('no-rive'); return; }
    const R = window.rive;
    try { R.Rive.suppressDeprecationWarnings = ['state-machines-param', 'state-machine-inputs']; } catch (e) {}
    R.RuntimeLoader.setWasmUrl('rive/rive.wasm');
    const instances = [];

    fetch('rive/portfolio.riv').then(r => { if (!r.ok) throw new Error(r.status); return r.arrayBuffer(); }).then(buf => {
      const make = (canvas, artboard, sm, onLoad) => {
        const inst = new R.Rive({
          buffer: buf.slice(0), canvas, artboard, stateMachines: sm, autoplay: true,
          layout: new R.Layout({ fit: R.Fit.Contain, alignment: R.Alignment.Center }),
          onLoad: () => {
            inst.resizeDrawingSurfaceToCanvas();
            const inputs = {};
            (inst.stateMachineInputs(sm) || []).forEach(i => { inputs[i.name] = i; });
            inst.inputs = inputs;
            onLoad && onLoad(inst, inputs);
          },
          onLoadError: () => doc.classList.add('no-rive')
        });
        inst.canvasEl = canvas;
        instances.push(inst);
        return inst;
      };

      // Hero core
      const coreCanvas = $('#rive-core');
      make(coreCanvas, 'Core', 'core', (inst, inp) => {
        let tx = 50, ty = 50, x = 50, y = 50, active = false;
        addEventListener('pointermove', e => {
          const r = coreCanvas.getBoundingClientRect();
          const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
          const nx = (e.clientX - cx) / (innerWidth * .45), ny = (e.clientY - cy) / (innerHeight * .55);
          tx = 50 + Math.max(-1, Math.min(1, nx)) * 50;
          ty = 50 + Math.max(-1, Math.min(1, ny)) * 50;
          active = true;
        }, { passive: true });
        coreCanvas.addEventListener('pointerenter', () => { inp.hover && (inp.hover.value = true); });
        coreCanvas.addEventListener('pointerleave', () => { inp.hover && (inp.hover.value = false); });
        coreCanvas.addEventListener('click', () => inp.ping && inp.ping.fire());
        // idle wander when no pointer (touch / before first move)
        let t0 = performance.now();
        const loop = now => {
          if (!active) { const s = (now - t0) / 1000; tx = 50 + Math.sin(s * .7) * 30; ty = 50 + Math.cos(s * .9) * 22; }
          x += (tx - x) * .09; y += (ty - y) * .09;
          if (inp.lookX) inp.lookX.value = x;
          if (inp.lookY) inp.lookY.value = y;
          requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
        if (!finePointer) setInterval(() => inp.ping && inp.ping.fire(), 4500);
      });

      // Area icons
      $$('canvas.rive-icon').forEach(cv => {
        const host = cv.closest('[data-area]') || cv;
        const ab = cv.dataset.area || host.dataset.area;
        const hoverEl = cv.closest('.card') || cv;
        make(cv, ab, 'icon', (inst, inp) => {
          hoverEl.addEventListener('pointerenter', () => { inp.hover.value = true; });
          hoverEl.addEventListener('pointerleave', () => { inp.hover.value = false; });
          hoverEl.addEventListener('focusin', () => { inp.hover.value = true; });
          hoverEl.addEventListener('focusout', () => { inp.hover.value = false; });
        });
      });

      // Trophy + signal
      const hoverBind = (canvas, ab, sm, hostSel) => make(canvas, ab, sm, (inst, inp) => {
        const host = canvas.closest(hostSel) || canvas;
        host.addEventListener('pointerenter', () => { inp.hover.value = true; });
        host.addEventListener('pointerleave', () => { inp.hover.value = false; });
      });
      hoverBind($('#rive-trophy'), 'Trophy', 'trophy', '.robo');
      hoverBind($('#rive-signal'), 'Signal', 'signal', '.contact');

      // Pause offscreen instances, resize on layout changes
      const vis = new IntersectionObserver(es => es.forEach(e => {
        const inst = instances.find(i => i.canvasEl === e.target);
        if (!inst) return;
        if (e.isIntersecting) inst.play(); else inst.pause();
      }), { rootMargin: '100px' });
      instances.forEach(i => vis.observe(i.canvasEl));
      let rz;
      addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(() => instances.forEach(i => i.resizeDrawingSurfaceToCanvas()), 150); });
    }).catch(() => doc.classList.add('no-rive'));
  }

  /* ---------------- boot ---------------- */
  applyLang(lang);
  if (document.readyState === 'complete') initRive(); else addEventListener('load', initRive);
})();
