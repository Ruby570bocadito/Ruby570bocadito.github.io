// Artboards of portfolio.riv. Every scene is authored in code with riv-writer.mjs:
// shapes are listed bottom-to-top, animations are keyed in frames (60 fps) and
// each artboard ships one state machine whose inputs the React side drives.
import { color, KEY } from './riv-writer.mjs';

const C = {
  light: '#D7E2EA',
  ink: '#0C0C0C',
  magenta: '#E04BD6',
  magentaDeep: '#B600A8',
  purple: '#9B4DE0',
  purpleDeep: '#7621B0',
  orange: '#F07A2E',
  cyan: '#7DE3FF'
};
const TAU = Math.PI * 2;
const EASE = [0.25, 0.1, 0.25, 1];
const EASE_OUT = [0.16, 1, 0.3, 1];
const EASE_IN_OUT = [0.65, 0, 0.35, 1];

/** Radial glow: a disc whose radial gradient fades to transparent. */
function glow(ab, parent, { x = 0, y = 0, r, c, alpha = 0.5, name }) {
  const s = ab.shape(parent, { name, x, y });
  ab.ellipse(s, { w: r * 2 });
  ab.fill(s, { radial: [0, 0, r, 0], stops: [[0, color(c, alpha)], [0.45, color(c, alpha * 0.35)], [1, color(c, 0)]] });
  return s;
}

/** Ticks around a circle as rectangle paths inside one shape. */
function ticks(ab, shape, { count, r, len, width, majorEvery = 0, majorLen = len }) {
  for (let i = 0; i < count; i++) {
    const a = (i / count) * TAU;
    const major = majorEvery && i % majorEvery === 0;
    const L = major ? majorLen : len;
    const rr = r - L / 2;
    ab.rect(shape, { w: width, h: L, x: Math.cos(a) * rr, y: Math.sin(a) * rr, rotation: a - Math.PI / 2 });
  }
}

// ------------------------------------------------------------------ hero
// Orbital scanner that frames the portrait, split in two artboards so the
// portrait can sit between them:
//   hero        → dial, arc segments, dotted ring, radar sweep, orbiting nodes (behind)
//   hero_frame  → "target lock" corner brackets (in front)
// Shared inputs: x, y (0–100, pointer position), active (pointer near the portrait), ping (click pulse).
function heroTracking(ab, sm, layers) {
  const x = sm.number('x', 50), y = sm.number('y', 50);
  const anim = (name, keys) => {
    const a = ab.animation(name, { duration: 1 });
    for (const [obj, prop, v] of keys) a.key(obj, prop, [[0, v]]);
    return a;
  };
  const kx = s => layers.map(([obj, ax]) => [obj, 'x', ax * s]);
  const ky = s => layers.map(([obj, , ay]) => [obj, 'y', ay * s]);
  const lx = sm.layer('track_x');
  lx.entry.to(lx.blend1d(x, [[anim('track_left', kx(-1)), 0], [anim('track_center_x', kx(0)), 50], [anim('track_right', kx(1)), 100]]));
  const ly = sm.layer('track_y');
  ly.entry.to(ly.blend1d(y, [[anim('track_up', ky(-1)), 0], [anim('track_center_y', ky(0)), 50], [anim('track_down', ky(1)), 100]]));
}

export function hero(file) {
  const S = 1000, R = S / 2;
  const ab = file.artboard({ name: 'hero', width: S, height: S });
  const rig = ab.node(null, { name: 'rig', x: R, y: R });
  const track = ab.node(rig, { name: 'track' });

  // radar sweep (bottom-most)
  const sweepRot = ab.node(track, { name: 'sweepRot' });
  const sweep = ab.shape(sweepRot, { name: 'sweep' });
  const sr = 335, spread = (52 * Math.PI) / 180;
  const pts = [[0, 0]];
  for (let i = 0; i <= 10; i++) {
    const a = -spread + (spread * i) / 10;
    pts.push([Math.cos(a) * sr, Math.sin(a) * sr]);
  }
  ab.path(sweep, pts, { closed: true });
  ab.fill(sweep, {
    linear: [sr * 0.55, 18, Math.cos(-spread) * sr * 0.55, Math.sin(-spread) * sr * 0.55],
    stops: [[0, color(C.magenta, 0.26)], [1, color(C.magenta, 0)]]
  });
  const sweepEdge = ab.shape(sweepRot, { name: 'sweepEdge' });
  ab.path(sweepEdge, [[0, 0], [sr, 0]]);
  ab.stroke(sweepEdge, { linear: [0, 0, sr, 0], stops: [[0, color(C.magenta, 0)], [1, color(C.magenta, 0.75)]] }, { width: 2 });

  // dial
  const dialPar = ab.node(track, { name: 'dialParallax' });
  const dial = ab.node(dialPar, { name: 'dial' });
  const dialCircle = ab.shape(dial, { name: 'dialCircle' });
  ab.ellipse(dialCircle, { w: 960 });
  ab.stroke(dialCircle, color(C.light, 0.1), { width: 1.5 });
  const dialTicks = ab.shape(dial, { name: 'dialTicks' });
  ticks(ab, dialTicks, { count: 120, r: 478, len: 9, width: 2, majorEvery: 10, majorLen: 24 });
  ab.fill(dialTicks, color(C.light, 0.28));

  // dotted ring
  const dots = ab.node(track, { name: 'dots' });
  const dotShape = ab.shape(dots, { name: 'dotRing' });
  for (let i = 0; i < 48; i++) {
    const a = (i / 48) * TAU;
    ab.ellipse(dotShape, { w: i % 6 === 0 ? 7 : 4, x: Math.cos(a) * 335, y: Math.sin(a) * 335 });
  }
  const dotFill = ab.fill(dotShape, color(C.light, 0.32));

  // arc segments
  const arcs = ab.node(track, { name: 'arcs' });
  const arcDefs = [
    [0.0, 0.17, C.magenta, 3.5, 0.95],
    [0.24, 0.3, C.light, 2, 0.45],
    [0.38, 0.52, C.purple, 3.5, 0.9],
    [0.62, 0.66, C.light, 2, 0.45],
    [0.72, 0.9, C.orange, 3, 0.8]
  ];
  const arcStrokes = [];
  for (const [a0, a1, c, w, al] of arcDefs) {
    const s = ab.shape(arcs);
    ab.ellipse(s, { w: 820 });
    const st = ab.stroke(s, color(c, al), { width: w, cap: 'butt' });
    ab.trim(st, { start: a0, end: a1 });
    arcStrokes.push(st);
  }

  // orbiting nodes
  const orbitDefs = [[410, 0.2, C.magenta, 7], [478, 0.55, C.light, 5], [410, 0.78, C.orange, 6]];
  const orbits = orbitDefs.map(([r, phase, c, size], i) => {
    const o = ab.node(track, { name: `orbit${i}`, rotation: phase * TAU });
    glow(ab, o, { x: r, r: size * 4, c, alpha: 0.55 });
    const dot = ab.shape(o, { x: r });
    ab.ellipse(dot, { w: size * 2 });
    ab.fill(dot, color(c));
    return o;
  });

  // compass ticks (N/E/S/W)
  const compass = ab.shape(track, { name: 'compass' });
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * TAU;
    ab.path(compass, [[Math.cos(a) * 300, Math.sin(a) * 300], [Math.cos(a) * 270, Math.sin(a) * 270]]);
  }
  const compassStroke = ab.stroke(compass, color(C.light, 0.55), { width: 2.5 });

  // pulse ring (ping)
  const pulse = ab.shape(track, { name: 'pulse', opacity: 0 });
  const pulseEllipse = ab.ellipse(pulse, { w: 120 });
  const pulseStroke = ab.stroke(pulse, color(C.magenta, 0.9), { width: 3 });

  // ---- animations
  const F = 1200; // 20 s loop; every rotation is a symmetric multiple so the loop is seamless
  const spin = ab.animation('spin', { duration: F, loop: 'loop' });
  spin.key(dial, 'rotation', [[0, 0], [F, TAU / 6]]);
  spin.key(dots, 'rotation', [[0, 0], [F, -TAU / 4]]);
  spin.key(arcs, 'rotation', [[0, 0], [F, TAU]]);
  spin.key(sweepRot, 'rotation', [[0, 0], [F, TAU * 4]]);
  orbitDefs.forEach(([, phase], i) => {
    const turns = [2, -1, 3][i];
    spin.key(orbits[i], 'rotation', [[0, phase * TAU], [F, phase * TAU + turns * TAU]]);
  });

  const calm = ab.animation('calm', { duration: 1 });
  calm.key(dotFill.solid, 'color', [[0, color(C.light, 0.32)]]);
  calm.key(compassStroke.solid, 'color', [[0, color(C.light, 0.55)]]);
  const lock = ab.animation('lock', { duration: 24 });
  lock.key(dotFill.solid, 'color', [[0, color(C.light, 0.32)], [24, color(C.magenta, 0.75)]]);
  lock.key(compassStroke.solid, 'color', [[0, color(C.light, 0.55)], [24, color(C.magenta, 1)]]);

  const rest = ab.animation('pulse_rest', { duration: 1 });
  rest.key(pulse, 'opacity', [[0, 0]]);
  const ping = ab.animation('pulse', { duration: 60 });
  ping.key(pulse, 'opacity', [[0, 1], [60, 0]]);
  ping.key(pulseEllipse, 'width', [[0, 120, EASE_OUT], [60, 980]]);
  ping.key(pulseEllipse, 'height', [[0, 120, EASE_OUT], [60, 980]]);
  ping.key(pulseStroke, 'thickness', [[0, 4], [60, 1]]);
  arcStrokes.forEach((st, i) => {
    // arcs flash brighter on ping
    const base = color(arcDefs[i][2], arcDefs[i][4]);
    ping.key(st.solid, 'color', [[0, color(C.light, 1)], [40, base]]);
    rest.key(st.solid, 'color', [[0, base]]);
  });

  // ---- state machine
  const sm = ab.stateMachine('hero');
  heroTracking(ab, sm, [[track, 18, 14], [dialPar, -12, -10]]);
  const active = sm.bool('active');
  const pingIn = sm.trigger('ping');
  const lSpin = sm.layer('spin'); lSpin.entry.to(lSpin.state(spin));
  const lf = sm.layer('focus');
  const sCalm = lf.state(calm), sLock = lf.state(lock);
  lf.entry.to(sCalm);
  sCalm.to(sLock, { duration: 120, when: [[active, '==', true]] });
  sLock.to(sCalm, { duration: 420, when: [[active, '==', false]] });
  const lp = sm.layer('pulse');
  const sRest = lp.state(rest), sPing = lp.state(ping);
  lp.entry.to(sRest);
  lp.any.to(sPing, { when: [[pingIn]] });
  sPing.to(sRest, { exitTime: 100, exitTimePercent: true });
  return ab;
}

export function heroFrame(file) {
  const S = 1000, R = S / 2;
  const ab = file.artboard({ name: 'hero_frame', width: S, height: S });
  const rig = ab.node(null, { name: 'rig', x: R, y: R });
  const track = ab.node(rig, { name: 'track' });
  const brackets = ab.node(track, { name: 'brackets' });
  const B = 250, L = 56;
  const bracketShape = ab.shape(brackets, { name: 'bracketShape' });
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    ab.path(bracketShape, [[sx * B, sy * (B - L)], [sx * B, sy * B, { r: 10 }], [sx * (B - L), sy * B]]);
  }
  const bracketStroke = ab.stroke(bracketShape, color(C.light, 0.6), { width: 3 });

  const calm = ab.animation('calm', { duration: 180, loop: 'pingPong' });
  calm.key(brackets, 'scaleX', [[0, 1, EASE_IN_OUT], [180, 1.03]]);
  calm.key(brackets, 'scaleY', [[0, 1, EASE_IN_OUT], [180, 1.03]]);
  calm.key(bracketStroke.solid, 'color', [[0, color(C.light, 0.6)]]);
  calm.key(bracketStroke, 'thickness', [[0, 3]]);
  const lock = ab.animation('lock', { duration: 24 });
  lock.key(brackets, 'scaleX', [[0, 1.03, EASE_OUT], [24, 0.9]]);
  lock.key(brackets, 'scaleY', [[0, 1.03, EASE_OUT], [24, 0.9]]);
  lock.key(bracketStroke.solid, 'color', [[0, color(C.light, 0.6)], [24, color(C.magenta, 1)]]);
  lock.key(bracketStroke, 'thickness', [[0, 3], [24, 4]]);

  const sm = ab.stateMachine('hero');
  heroTracking(ab, sm, [[track, 30, 24]]);
  const active = sm.bool('active');
  sm.trigger('ping');
  const lf = sm.layer('focus');
  const sCalm = lf.state(calm), sLock = lf.state(lock);
  lf.entry.to(sCalm);
  sCalm.to(sLock, { duration: 120, when: [[active, '==', true]] });
  sLock.to(sCalm, { duration: 420, when: [[active, '==', false]] });
  return ab;
}

// ------------------------------------------------------------------ robot
// Friendly robot head (robotics section). Eyes follow the pointer (x, y),
// it blinks, smiles when hovered (Rive listeners) and bounces when poked.
export function robot(file) {
  const W = 520, H = 520;
  const ab = file.artboard({ name: 'robot', width: W, height: H });
  const base = ab.node(null, { name: 'base', x: 260, y: 292 });
  const tilt = ab.node(base, { name: 'tilt' });
  const bob = ab.node(tilt, { name: 'bob' });
  const squash = ab.node(bob, { name: 'squash' });

  // shadow on the floor (outside the bobbing group so it stays put)
  const shadow = ab.shape(base, { name: 'shadow', y: 178 });
  ab.ellipse(shadow, { w: 230, h: 26 });
  ab.fill(shadow, { radial: [0, 0, 115, 0], stops: [[0, color('#000000', 0.55)], [1, color('#000000', 0)]] });

  // antenna
  const antenna = ab.node(squash, { name: 'antenna', y: -126 });
  const stem = ab.shape(antenna, { name: 'stem' });
  ab.path(stem, [[0, 0], [0, -58]]);
  ab.stroke(stem, color(C.light, 0.55), { width: 7 });
  const antGlow = glow(ab, antenna, { y: -70, r: 46, c: C.magenta, alpha: 0.6, name: 'antGlow' });
  const ball = ab.shape(antenna, { name: 'ball', y: -70 });
  ab.ellipse(ball, { w: 30 });
  const ballFill = ab.fill(ball, { radial: [-5, -6, 20, 0], stops: [[0, color('#FFD1F6')], [0.5, color(C.magenta)], [1, color(C.purpleDeep)]] });

  // ears
  for (const sx of [-1, 1]) {
    const ear = ab.shape(squash, { name: sx < 0 ? 'earL' : 'earR', x: sx * 168 });
    ab.rect(ear, { w: 30, h: 84, r: 14 });
    ab.fill(ear, { linear: [0, -42, 0, 42], stops: [[0, color(C.purple)], [1, color(C.purpleDeep)]] });
    ab.stroke(ear, color(C.light, 0.2), { width: 2 });
  }

  // head
  const head = ab.shape(squash, { name: 'head' });
  ab.rect(head, { w: 310, h: 256, r: 92 });
  ab.fill(head, { linear: [0, -128, 0, 128], stops: [[0, color('#3A2A55')], [0.55, color('#1E1630')], [1, color('#120C1C')]] });
  ab.stroke(head, { linear: [-155, -128, 155, 128], stops: [[0, color(C.light, 0.45)], [0.5, color(C.light, 0.08)], [1, color(C.magenta, 0.45)]] }, { width: 3 });
  const shine = ab.shape(squash, { name: 'shine', y: -100 });
  ab.rect(shine, { w: 170, h: 22, r: 11 });
  ab.fill(shine, { linear: [-85, 0, 85, 0], stops: [[0, color('#FFFFFF', 0)], [0.5, color('#FFFFFF', 0.13)], [1, color('#FFFFFF', 0)]] });

  // visor
  const visor = ab.shape(squash, { name: 'visor', y: 14 });
  ab.rect(visor, { w: 244, h: 156, r: 66 });
  ab.fill(visor, { linear: [0, -78, 0, 78], stops: [[0, color('#0B0812')], [1, color('#05040A')]] });
  const visorStroke = ab.stroke(visor, color(C.magenta, 0.55), { width: 2.5 });
  const visorGlow = glow(ab, squash, { y: 10, r: 120, c: C.magenta, alpha: 0.12, name: 'visorGlow' });

  // face (moves with the look inputs)
  const face = ab.node(squash, { name: 'face', y: 10 });
  const eyes = ab.node(face, { name: 'eyes' });
  const eyeBlink = ab.node(eyes, { name: 'eyeBlink' });
  const eyeShapes = [-1, 1].map(sx => {
    const e = ab.shape(eyeBlink, { name: sx < 0 ? 'eyeL' : 'eyeR', x: sx * 52 });
    glow(ab, eyeBlink, { x: sx * 52, r: 46, c: C.cyan, alpha: 0.35 });
    ab.rect(e, { w: 40, h: 54, r: 20 });
    ab.fill(e, { linear: [0, -27, 0, 27], stops: [[0, color('#FFFFFF')], [1, color(C.cyan)]] });
    return e;
  });
  // happy eyes ^ ^
  const happyEyes = ab.shape(eyes, { name: 'happyEyes', opacity: 0 });
  for (const sx of [-1, 1]) {
    ab.path(happyEyes, [[sx * 52 - 20, 8, { out: [8, -22] }], [sx * 52 + 20, 8, { in: [-8, -22] }]]);
  }
  ab.stroke(happyEyes, color(C.cyan), { width: 8 });

  const mouthNode = ab.node(face, { name: 'mouthNode', y: 46 });
  const mouth = ab.shape(mouthNode, { name: 'mouth' });
  const mouthPath = ab.path(mouth, [[-22, 0, { out: [8, 9] }], [22, 0, { in: [-8, 9] }]]);
  ab.stroke(mouth, color(C.light, 0.95), { width: 6 });
  const [mL, mR] = mouthPath.vertices;

  const cheeks = ab.shape(face, { name: 'cheeks', opacity: 0 });
  ab.ellipse(cheeks, { w: 34, h: 16, x: -88, y: 34 });
  ab.ellipse(cheeks, { w: 34, h: 16, x: 88, y: 34 });
  ab.fill(cheeks, color(C.magenta, 0.55));

  // hit area for the Rive listeners: the head and the ears
  const hit = ab.shape(squash, { name: 'hitArea' });
  ab.rect(hit, { w: 380, h: 300, r: 100 });
  ab.fill(hit, color('#000000', 0));

  // ---- animations
  const idle = ab.animation('float', { duration: 180, loop: 'pingPong' });
  idle.key(bob, 'y', [[0, 0, EASE_IN_OUT], [180, -10]]);
  idle.key(antGlow, 'opacity', [[0, 0.55, EASE_IN_OUT], [180, 1]]);
  idle.key(visorGlow, 'opacity', [[0, 0.7, EASE_IN_OUT], [180, 1]]);
  idle.key(shadow, 'scaleX', [[0, 1, EASE_IN_OUT], [180, 0.9]]);

  const lookL = ab.animation('look_left', { duration: 1 });
  const lookR = ab.animation('look_right', { duration: 1 });
  const lookU = ab.animation('look_up', { duration: 1 });
  const lookD = ab.animation('look_down', { duration: 1 });
  const lookCX = ab.animation('look_center_x', { duration: 1 });
  const lookCY = ab.animation('look_center_y', { duration: 1 });
  lookCX.key(eyes, 'x', [[0, 0]]); lookCX.key(mouthNode, 'x', [[0, 0]]); lookCX.key(tilt, 'rotation', [[0, 0]]);
  lookCY.key(eyes, 'y', [[0, 0]]); lookCY.key(mouthNode, 'y', [[0, 46]]);
  lookL.key(eyes, 'x', [[0, -26]]); lookL.key(mouthNode, 'x', [[0, -14]]); lookL.key(tilt, 'rotation', [[0, -0.07]]);
  lookR.key(eyes, 'x', [[0, 26]]); lookR.key(mouthNode, 'x', [[0, 14]]); lookR.key(tilt, 'rotation', [[0, 0.07]]);
  lookU.key(eyes, 'y', [[0, -16]]); lookU.key(mouthNode, 'y', [[0, 40]]);
  lookD.key(eyes, 'y', [[0, 14]]); lookD.key(mouthNode, 'y', [[0, 52]]);

  const blink = ab.animation('blink', { duration: 270, loop: 'loop' });
  blink.key(eyeBlink, 'scaleY', [[0, 1, 'hold'], [222, 1], [228, 0.08], [236, 1, 'hold'], [250, 1], [255, 0.08], [262, 1]]);

  const neutral = ab.animation('neutral', { duration: 1 });
  neutral.key(happyEyes, 'opacity', [[0, 0]]);
  neutral.key(eyeBlink, 'opacity', [[0, 1]]);
  neutral.key(cheeks, 'opacity', [[0, 0]]);
  neutral.key(mL, 'vertexX', [[0, -22]]); neutral.key(mR, 'vertexX', [[0, 22]]);
  neutral.key(mL, 'outDistance', [[0, Math.hypot(8, 9)]]); neutral.key(mR, 'inDistance', [[0, Math.hypot(8, 9)]]);
  neutral.key(visorStroke.solid, 'color', [[0, color(C.magenta, 0.55)]]);

  const happy = ab.animation('happy', { duration: 14 });
  happy.key(happyEyes, 'opacity', [[0, 0], [10, 1]]);
  happy.key(eyeBlink, 'opacity', [[0, 1], [8, 0]]);
  happy.key(cheeks, 'opacity', [[0, 0], [14, 1]]);
  happy.key(mL, 'vertexX', [[0, -22, EASE_OUT], [14, -32]]); happy.key(mR, 'vertexX', [[0, 22, EASE_OUT], [14, 32]]);
  happy.key(mL, 'outDistance', [[0, Math.hypot(8, 9), EASE_OUT], [14, 26]]);
  happy.key(mR, 'inDistance', [[0, Math.hypot(8, 9), EASE_OUT], [14, 26]]);
  happy.key(visorStroke.solid, 'color', [[0, color(C.magenta, 0.55)], [14, color(C.magenta, 1)]]);

  const pokeRest = ab.animation('poke_rest', { duration: 1 });
  pokeRest.key(squash, 'scaleX', [[0, 1]]); pokeRest.key(squash, 'scaleY', [[0, 1]]);
  pokeRest.key(antenna, 'rotation', [[0, 0]]);
  pokeRest.key(ballFill.gradient.stops[1], 'stopColor', [[0, color(C.magenta)]]);
  const poke = ab.animation('poke', { duration: 48 });
  poke.key(squash, 'scaleX', [[0, 1, EASE_OUT], [6, 1.1, EASE_OUT], [16, 0.95, EASE_OUT], [28, 1.03, EASE_OUT], [48, 1]]);
  poke.key(squash, 'scaleY', [[0, 1, EASE_OUT], [6, 0.9, EASE_OUT], [16, 1.06, EASE_OUT], [28, 0.98, EASE_OUT], [48, 1]]);
  poke.key(antenna, 'rotation', [[0, 0, EASE_OUT], [8, 0.35, EASE_OUT], [20, -0.25, EASE_OUT], [32, 0.12, EASE_OUT], [48, 0]]);
  poke.key(ballFill.gradient.stops[1], 'stopColor', [[0, color(C.orange)], [48, color(C.magenta)]]);

  // ---- state machine
  const sm = ab.stateMachine('robot');
  const x = sm.number('x', 50), y = sm.number('y', 50);
  const hover = sm.bool('hover');
  const pokeIn = sm.trigger('poke');
  const l0 = sm.layer('float'); l0.entry.to(l0.state(idle));
  const lx = sm.layer('look_x'); lx.entry.to(lx.blend1d(x, [[lookL, 0], [lookCX, 50], [lookR, 100]]));
  const ly = sm.layer('look_y'); ly.entry.to(ly.blend1d(y, [[lookU, 0], [lookCY, 50], [lookD, 100]]));
  const lb = sm.layer('blink'); lb.entry.to(lb.state(blink));
  const lm = sm.layer('mood');
  const sN = lm.state(neutral), sH = lm.state(happy);
  lm.entry.to(sN);
  sN.to(sH, { duration: 80, when: [[hover, '==', true]] });
  sH.to(sN, { duration: 260, when: [[hover, '==', false]] });
  const lp = sm.layer('poke');
  const sR = lp.state(pokeRest), sP = lp.state(poke);
  lp.entry.to(sR);
  lp.any.to(sP, { when: [[pokeIn]] });
  sP.to(sR, { exitTime: 100, exitTimePercent: true });
  sm.listener(hit, 'enter', [[hover, true]]);
  sm.listener(hit, 'exit', [[hover, false]]);
  sm.listener(hit, 'down', [[pokeIn, null]]);
  return ab;
}

// ------------------------------------------------------------------ icons
// Line icons for the white "areas" list. One bool input: hover.
function iconBase(file, name) {
  const ab = file.artboard({ name, width: 120, height: 120 });
  const root = ab.node(null, { name: 'root', x: 60, y: 60 });
  return { ab, root };
}
function iconMachine(ab, idle, hoverAnim, extraLayers = []) {
  const sm = ab.stateMachine('icon');
  const hover = sm.bool('hover');
  const l = sm.layer('hover');
  const sI = l.state(idle), sH = l.state(hoverAnim);
  l.entry.to(sI);
  sI.to(sH, { duration: 60, when: [[hover, '==', true]] });
  sH.to(sI, { duration: 220, when: [[hover, '==', false]] });
  for (const [name, anim] of extraLayers) { const x = sm.layer(name); x.entry.to(x.state(anim)); }
  return sm;
}
const INK = color(C.ink), ACCENT = color(C.magentaDeep);

export function iconTarget(file) {
  const { ab, root } = iconBase(file, 'icon_target');
  const ring = ab.shape(root, { name: 'ring' });
  ab.ellipse(ring, { w: 78 });
  ab.stroke(ring, INK, { width: 4 });
  const inner = ab.shape(root, { name: 'inner' });
  ab.ellipse(inner, { w: 38 });
  const innerStroke = ab.stroke(inner, INK, { width: 4 });
  const cross = ab.node(root, { name: 'cross' });
  const crossShape = ab.shape(cross);
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * TAU;
    ab.path(crossShape, [[Math.cos(a) * 30, Math.sin(a) * 30], [Math.cos(a) * 52, Math.sin(a) * 52]]);
  }
  ab.stroke(crossShape, INK, { width: 4 });
  const dot = ab.shape(root, { name: 'dot' });
  ab.ellipse(dot, { w: 10 });
  ab.fill(dot, ACCENT);

  const idle = ab.animation('idle', { duration: 1 });
  idle.key(cross, 'rotation', [[0, 0]]); idle.key(ring, 'scaleX', [[0, 1]]); idle.key(ring, 'scaleY', [[0, 1]]);
  idle.key(dot, 'scaleX', [[0, 1]]); idle.key(dot, 'scaleY', [[0, 1]]); idle.key(innerStroke.solid, 'color', [[0, INK]]);
  const hov = ab.animation('hover', { duration: 26 });
  hov.key(cross, 'rotation', [[0, 0, EASE_OUT], [26, Math.PI / 4]]);
  hov.key(ring, 'scaleX', [[0, 1, EASE_OUT], [26, 0.9]]); hov.key(ring, 'scaleY', [[0, 1, EASE_OUT], [26, 0.9]]);
  hov.key(dot, 'scaleX', [[0, 1, EASE_OUT], [26, 1.8]]); hov.key(dot, 'scaleY', [[0, 1, EASE_OUT], [26, 1.8]]);
  hov.key(innerStroke.solid, 'color', [[0, INK], [26, ACCENT]]);
  iconMachine(ab, idle, hov);
}

export function iconShield(file) {
  const { ab, root } = iconBase(file, 'icon_shield');
  const shield = ab.shape(root, { name: 'shield' });
  ab.path(shield, [
    [0, -46], [38, -32, { r: 6 }], [36, 4, { out: [-2, 22] }],
    [0, 46, { in: [24, -10], out: [-24, -10] }], [-36, 4, { in: [2, 22] }], [-38, -32, { r: 6 }]
  ], { closed: true });
  const shieldStroke = ab.stroke(shield, INK, { width: 4, join: 'round' });
  const scan = ab.shape(root, { name: 'scan', y: -26 });
  ab.rect(scan, { w: 52, h: 3, r: 1.5 });
  ab.fill(scan, { linear: [-26, 0, 26, 0], stops: [[0, color(C.magentaDeep, 0)], [0.5, color(C.magentaDeep, 0.85)], [1, color(C.magentaDeep, 0)]] });
  const check = ab.shape(root, { name: 'check' });
  ab.path(check, [[-17, 0], [-5, 13], [18, -13]]);
  const checkStroke = ab.stroke(check, ACCENT, { width: 6 });
  const checkTrim = ab.trim(checkStroke, { start: 0, end: 0 });

  const scanLoop = ab.animation('scan', { duration: 120, loop: 'pingPong' });
  scanLoop.key(scan, 'y', [[0, -26, EASE_IN_OUT], [120, 22]]);
  const idle = ab.animation('idle', { duration: 1 });
  idle.key(checkTrim, 'trimEnd', [[0, 0]]); idle.key(scan, 'opacity', [[0, 1]]); idle.key(shieldStroke.solid, 'color', [[0, INK]]);
  const hov = ab.animation('hover', { duration: 28 });
  hov.key(checkTrim, 'trimEnd', [[0, 0, EASE_OUT], [28, 1]]);
  hov.key(scan, 'opacity', [[0, 1], [8, 0]]);
  hov.key(shieldStroke.solid, 'color', [[0, INK], [20, INK]]);
  hov.key(root, 'scaleX', [[0, 1, EASE_OUT], [10, 1.06, EASE_OUT], [28, 1]]);
  hov.key(root, 'scaleY', [[0, 1, EASE_OUT], [10, 1.06, EASE_OUT], [28, 1]]);
  idle.key(root, 'scaleX', [[0, 1]]); idle.key(root, 'scaleY', [[0, 1]]);
  iconMachine(ab, idle, hov, [['scan', scanLoop]]);
}

export function iconCode(file) {
  const { ab, root } = iconBase(file, 'icon_code');
  const left = ab.shape(root, { name: 'left' });
  ab.path(left, [[-20, -20], [-42, 0], [-20, 20]]);
  ab.stroke(left, INK, { width: 5 });
  const right = ab.shape(root, { name: 'right' });
  ab.path(right, [[20, -20], [42, 0], [20, 20]]);
  ab.stroke(right, INK, { width: 5 });
  const slash = ab.shape(root, { name: 'slash' });
  ab.path(slash, [[9, -26], [-9, 26]]);
  ab.stroke(slash, ACCENT, { width: 5 });
  const cursor = ab.shape(root, { name: 'cursor', y: 40 });
  ab.rect(cursor, { w: 16, h: 4, r: 2 });
  ab.fill(cursor, INK);

  const blinkLoop = ab.animation('cursor', { duration: 60, loop: 'loop' });
  blinkLoop.key(cursor, 'opacity', [[0, 1, 'hold'], [30, 0, 'hold'], [60, 1]]);
  const idle = ab.animation('idle', { duration: 1 });
  idle.key(left, 'x', [[0, 0]]); idle.key(right, 'x', [[0, 0]]); idle.key(slash, 'rotation', [[0, 0]]);
  const hov = ab.animation('hover', { duration: 24 });
  hov.key(left, 'x', [[0, 0, EASE_OUT], [24, -7]]);
  hov.key(right, 'x', [[0, 0, EASE_OUT], [24, 7]]);
  hov.key(slash, 'rotation', [[0, 0, EASE_OUT], [24, -0.35]]);
  iconMachine(ab, idle, hov, [['cursor', blinkLoop]]);
}

export function iconNeural(file) {
  const { ab, root } = iconBase(file, 'icon_neural');
  const N = { a: [-38, -18], b: [-38, 18], c: [0, -32], d: [0, 0], e: [0, 32], f: [38, 0] };
  const edges = ab.shape(root, { name: 'edges' });
  const pairs = [['a', 'c'], ['a', 'd'], ['a', 'e'], ['b', 'c'], ['b', 'd'], ['b', 'e'], ['c', 'f'], ['d', 'f'], ['e', 'f']];
  for (const [p, q] of pairs) ab.path(edges, [N[p], N[q]]);
  ab.stroke(edges, color(C.ink, 0.28), { width: 2.5 });
  const live = ab.shape(root, { name: 'live' });
  for (const [p, q] of pairs) ab.path(live, [N[p], N[q]]);
  const liveStroke = ab.stroke(live, ACCENT, { width: 3 });
  const liveTrim = ab.trim(liveStroke, { start: 0, end: 0, mode: 'synchronized' });
  const nodes = Object.entries(N).map(([k, [nx, ny]]) => {
    const s = ab.shape(root, { name: `n_${k}`, x: nx, y: ny });
    ab.ellipse(s, { w: k === 'f' ? 18 : 14 });
    ab.fill(s, k === 'f' ? ACCENT : INK);
    return s;
  });
  const idle = ab.animation('idle', { duration: 1 });
  idle.key(liveTrim, 'trimEnd', [[0, 0]]);
  nodes.forEach(n => { idle.key(n, 'scaleX', [[0, 1]]); idle.key(n, 'scaleY', [[0, 1]]); });
  const hov = ab.animation('hover', { duration: 40, loop: 'oneShot' });
  hov.key(liveTrim, 'trimEnd', [[0, 0, EASE_OUT], [26, 1]]);
  nodes.forEach((n, i) => {
    const t = i * 4;
    hov.key(n, 'scaleX', [[0, 1, 'hold'], [t, 1, EASE_OUT], [t + 8, 1.35, EASE_OUT], [t + 18, 1]]);
    hov.key(n, 'scaleY', [[0, 1, 'hold'], [t, 1, EASE_OUT], [t + 8, 1.35, EASE_OUT], [t + 18, 1]]);
  });
  iconMachine(ab, idle, hov);
}

export function iconGear(file) {
  const { ab, root } = iconBase(file, 'icon_gear');
  const gear = ab.node(root, { name: 'gear' });
  const body = ab.shape(gear, { name: 'teeth' });
  const N = 8, Ro = 43, Ri = 33, pitch = TAU / N, verts = [];
  for (let i = 0; i < N; i++) {
    const c = i * pitch;
    for (const [f, r, rad] of [[-0.3, Ri, 0], [-0.16, Ro, 3], [0.16, Ro, 3], [0.3, Ri, 0]]) {
      verts.push([Math.cos(c + f * pitch) * r, Math.sin(c + f * pitch) * r, { r: rad }]);
    }
  }
  ab.path(body, verts, { closed: true });
  ab.stroke(body, INK, { width: 4, join: 'round' });
  const hub = ab.shape(gear, { name: 'hub' });
  ab.ellipse(hub, { w: 30 });
  const hubStroke = ab.stroke(hub, ACCENT, { width: 5 });
  const idle = ab.animation('idle', { duration: 1 });
  idle.key(gear, 'rotation', [[0, 0]]); idle.key(hubStroke.solid, 'color', [[0, ACCENT]]);
  const hov = ab.animation('hover', { duration: 90, loop: 'loop' });
  hov.key(gear, 'rotation', [[0, 0], [90, TAU / 8]]);
  hov.key(hubStroke.solid, 'color', [[0, ACCENT]]);
  iconMachine(ab, idle, hov);
}

// ------------------------------------------------------------------ lock
// Padlock for the CV button. Inputs: hover (shackle lifts), open (unlocks).
export function lock(file) {
  const ab = file.artboard({ name: 'lock', width: 160, height: 160 });
  const root = ab.node(null, { name: 'root', x: 80, y: 84 });
  const shackleLift = ab.node(root, { name: 'shackleLift', x: 24, y: -8 });
  const shackle = ab.shape(shackleLift, { name: 'shackle' });
  ab.path(shackle, [[-48, 0], [-48, -22, { out: [0, -32] }], [0, -22, { in: [0, -32] }], [0, 6]]);
  ab.stroke(shackle, color('#FFFFFF'), { width: 11, cap: 'round' });
  const body = ab.shape(root, { name: 'body', y: 28 });
  ab.rect(body, { w: 92, h: 70, r: 18 });
  ab.fill(body, color('#FFFFFF'));
  const hole = ab.shape(root, { name: 'keyhole', y: 22 });
  ab.ellipse(hole, { w: 18 });
  ab.rect(hole, { w: 7, h: 20, r: 3, y: 12 });
  const holeFill = ab.fill(hole, color(C.magentaDeep));

  const closed = ab.animation('closed', { duration: 1 });
  closed.key(shackleLift, 'y', [[0, -8]]); closed.key(shackleLift, 'rotation', [[0, 0]]);
  closed.key(holeFill.solid, 'color', [[0, color(C.magentaDeep)]]);
  const peek = ab.animation('peek', { duration: 16 });
  peek.key(shackleLift, 'y', [[0, -8, EASE_OUT], [16, -18]]);
  peek.key(shackleLift, 'rotation', [[0, 0]]);
  peek.key(holeFill.solid, 'color', [[0, color(C.magentaDeep)]]);
  const open = ab.animation('open', { duration: 30 });
  open.key(shackleLift, 'y', [[0, -18, EASE_OUT], [12, -26, EASE_OUT], [30, -24]]);
  open.key(shackleLift, 'rotation', [[0, 0, 'hold'], [10, 0, EASE_OUT], [30, 0.62]]);
  open.key(holeFill.solid, 'color', [[0, color(C.magentaDeep)], [20, color(C.orange)]]);

  const sm = ab.stateMachine('lock');
  const hover = sm.bool('hover'), isOpen = sm.bool('open');
  const l = sm.layer('lock');
  const sC = l.state(closed), sPk = l.state(peek), sO = l.state(open);
  l.entry.to(sC);
  sC.to(sPk, { duration: 60, when: [[hover, '==', true]] });
  sPk.to(sC, { duration: 200, when: [[hover, '==', false]] });
  sC.to(sO, { when: [[isOpen, '==', true]] });
  sPk.to(sO, { when: [[isOpen, '==', true]] });
  sO.to(sC, { duration: 300, when: [[isOpen, '==', false]] });
  return ab;
}

export const KEYS = KEY;
