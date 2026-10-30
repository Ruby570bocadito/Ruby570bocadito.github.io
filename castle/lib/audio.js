'use client';
/**
 * Paisaje sonoro 100 % procedural con Web Audio (sin archivos):
 * viento y agua (ruido filtrado), campanas furin, frases de shakuhachi
 * en escala in (miyako-bushi) y SFX de madera, papel y sello.
 */
let ctx, master, musicBus, sfxBus, started = false, timers = [];

function noiseBuffer(c, seconds = 2, brown = false) {
  const len = c.sampleRate * seconds;
  const buf = c.createBuffer(1, len, c.sampleRate);
  const d = buf.getChannelData(0);
  let last = 0;
  for (let i = 0; i < len; i++) {
    const w = Math.random() * 2 - 1;
    if (brown) { last = (last + 0.02 * w) / 1.02; d[i] = last * 3.5; } else d[i] = w;
  }
  return buf;
}

function loopNoise(brown, filterType, freq, q, gain, lfoRate, lfoDepth) {
  const src = ctx.createBufferSource();
  src.buffer = noiseBuffer(ctx, 4, brown);
  src.loop = true;
  const f = ctx.createBiquadFilter();
  f.type = filterType; f.frequency.value = freq; f.Q.value = q;
  const g = ctx.createGain(); g.gain.value = gain;
  const lfo = ctx.createOscillator(); lfo.frequency.value = lfoRate;
  const lg = ctx.createGain(); lg.gain.value = lfoDepth;
  lfo.connect(lg).connect(f.frequency);
  src.connect(f).connect(g).connect(musicBus);
  src.start(); lfo.start();
}

function furin() {
  const t = ctx.currentTime;
  const base = 1800 + Math.random() * 900;
  [1, 2.76, 5.4].forEach((m, i) => {
    const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = base * m;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.05 / (i + 1), t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 2.5 - i * 0.6);
    o.connect(g).connect(musicBus); o.start(t); o.stop(t + 2.6);
  });
}

// escala in sobre Re: D Eb G A Bb
const IN = [293.66, 311.13, 392.0, 440.0, 466.16, 587.33, 622.25];
function shakuhachiNote(freq, t, dur) {
  const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = freq;
  const o2 = ctx.createOscillator(); o2.type = 'triangle'; o2.frequency.value = freq * 2;
  const vib = ctx.createOscillator(); vib.frequency.value = 5;
  const vg = ctx.createGain(); vg.gain.setValueAtTime(0, t); vg.gain.linearRampToValueAtTime(freq * 0.012, t + dur * 0.6);
  vib.connect(vg); vg.connect(o.frequency);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(0.09, t + 0.25);
  g.gain.setValueAtTime(0.09, t + dur - 0.4);
  g.gain.linearRampToValueAtTime(0, t + dur);
  const g2 = ctx.createGain(); g2.gain.value = 0.18;
  // soplo
  const n = ctx.createBufferSource(); n.buffer = noiseBuffer(ctx, dur + 0.2);
  const nf = ctx.createBiquadFilter(); nf.type = 'bandpass'; nf.frequency.value = freq * 2; nf.Q.value = 4;
  const ng = ctx.createGain(); ng.gain.setValueAtTime(0, t); ng.gain.linearRampToValueAtTime(0.05, t + 0.1); ng.gain.linearRampToValueAtTime(0.012, t + 0.5); ng.gain.linearRampToValueAtTime(0, t + dur);
  n.connect(nf).connect(ng).connect(musicBus);
  o.connect(g); o2.connect(g2).connect(g); g.connect(musicBus);
  [o, o2, vib, n].forEach((s) => { s.start(t); s.stop(t + dur + 0.1); });
}
function phrase() {
  let t = ctx.currentTime + 0.1;
  let i = 2 + Math.floor(Math.random() * 3);
  const notes = 2 + Math.floor(Math.random() * 3);
  for (let k = 0; k < notes; k++) {
    const dur = 1.4 + Math.random() * 2.2;
    shakuhachiNote(IN[i], t, dur);
    t += dur + 0.15;
    i = Math.max(0, Math.min(IN.length - 1, i + (Math.random() < 0.5 ? -1 : 1) * (1 + Math.floor(Math.random() * 2))));
  }
}

function schedule(fn, min, max) {
  const loop = () => { fn(); timers.push(setTimeout(loop, (min + Math.random() * (max - min)) * 1000)); };
  timers.push(setTimeout(loop, (min / 2) * 1000));
}

export function initAudio() {
  if (typeof window === 'undefined') return;
  if (!ctx) {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain(); master.gain.value = 0;
    musicBus = ctx.createGain(); sfxBus = ctx.createGain();
    musicBus.connect(master); sfxBus.connect(master); master.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') ctx.resume();
  if (!started) {
    started = true;
    loopNoise(true, 'lowpass', 500, 0.7, 0.35, 0.07, 250); // viento
    loopNoise(false, 'bandpass', 900, 0.6, 0.05, 0.2, 400); // agua / olas
    schedule(furin, 4, 11);
    schedule(phrase, 9, 18);
  }
}

export function setVolumes({ muted, music, sfx }) {
  if (!ctx) return;
  const t = ctx.currentTime;
  master.gain.setTargetAtTime(muted ? 0 : 1, t, 0.3);
  musicBus.gain.setTargetAtTime(music, t, 0.1);
  sfxBus.gain.setTargetAtTime(sfx, t, 0.05);
}

/** SFX: 'wood' | 'paper' | 'stamp' | 'chime' | 'click' */
export function sfx(kind) {
  if (!ctx || master.gain.value < 0.01) return;
  const t = ctx.currentTime;
  if (kind === 'chime') return furin();
  const src = ctx.createBufferSource();
  src.buffer = noiseBuffer(ctx, kind === 'paper' ? 0.6 : 0.25);
  const f = ctx.createBiquadFilter();
  const g = ctx.createGain();
  if (kind === 'paper') {
    f.type = 'highpass'; f.frequency.setValueAtTime(1200, t); f.frequency.linearRampToValueAtTime(3500, t + 0.45);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.25, t + 0.08); g.gain.linearRampToValueAtTime(0, t + 0.55);
  } else {
    // madera / sello: golpe corto + tono resonante
    f.type = 'bandpass'; f.frequency.value = kind === 'stamp' ? 300 : 900; f.Q.value = 3;
    g.gain.setValueAtTime(kind === 'click' ? 0.3 : 0.7, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
    const o = ctx.createOscillator(); o.frequency.value = kind === 'stamp' ? 140 : kind === 'click' ? 1400 : 620;
    const og = ctx.createGain(); og.gain.setValueAtTime(0.25, t); og.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
    o.connect(og).connect(sfxBus); o.start(t); o.stop(t + 0.15);
  }
  src.connect(f).connect(g).connect(sfxBus);
  src.start(t);
}
