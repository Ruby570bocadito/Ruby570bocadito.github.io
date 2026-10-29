// Minimal writer for the Rive runtime format (.riv, major version 7).
//
// Type and property keys come from rive-runtime's generated headers
// (include/rive/generated/**/*_base.hpp). Only the subset this portfolio
// needs is listed here: shapes, paints, trim paths, linear animations,
// state machines (inputs, layers, blend states, transitions) and listeners.
//
// Object order inside an artboard follows the Rive exporter:
//   Artboard → components (depth first) → interpolators → animations → state machines.
// The runtime draws the LAST drawable in the file first, so drawable siblings
// are written in reverse authoring order (author bottom-to-top, like SVG).

const TYPE = {
  Backboard: 23, Artboard: 1, Node: 2, Shape: 3, Ellipse: 4, StraightVertex: 5,
  CubicDetachedVertex: 6, Rectangle: 7, Triangle: 8, PointsPath: 16, RadialGradient: 17,
  SolidColor: 18, GradientStop: 19, Fill: 20, LinearGradient: 22, Stroke: 24,
  KeyedObject: 25, KeyedProperty: 26, CubicEaseInterpolator: 28, KeyFrameDouble: 30,
  LinearAnimation: 31, CubicMirroredVertex: 35, KeyFrameColor: 37, TrimPath: 47,
  Polygon: 51, Star: 52, StateMachine: 53, StateMachineNumber: 56, StateMachineLayer: 57,
  StateMachineTrigger: 58, StateMachineBool: 59, AnimationState: 61, AnyState: 62,
  EntryState: 63, ExitState: 64, StateTransition: 65, TransitionTriggerCondition: 68,
  TransitionNumberCondition: 70, TransitionBoolCondition: 71, BlendAnimation1D: 75,
  BlendState1D: 76, StateMachineListener: 114, ListenerTriggerChange: 115,
  ListenerBoolChange: 117, ListenerNumberChange: 118
};

// Property name → [key, field type]. Field types: uint, id, string, double, color, bool.
const PROP = {
  name: [4, 'string'], parentId: [5, 'id'],
  // Artboard / LayoutComponent
  width: [7, 'double'], height: [8, 'double'], originX: [11, 'double'], originY: [12, 'double'], clip: [196, 'bool'],
  // Node / TransformComponent / WorldTransformComponent
  x: [13, 'double'], y: [14, 'double'], rotation: [15, 'double'], scaleX: [16, 'double'], scaleY: [17, 'double'],
  opacity: [18, 'double'],
  // Drawable
  blendModeValue: [23, 'uint'],
  // ParametricPath
  pathWidth: [20, 'double'], pathHeight: [21, 'double'], pathOriginX: [123, 'double'], pathOriginY: [124, 'double'],
  cornerRadiusTL: [31, 'double'], cornerRadiusTR: [161, 'double'], cornerRadiusBL: [162, 'double'],
  cornerRadiusBR: [163, 'double'], linkCornerRadius: [164, 'bool'],
  points: [125, 'uint'], polygonCornerRadius: [126, 'double'], innerRadius: [127, 'double'],
  isClosed: [32, 'bool'],
  // Vertices
  vertexX: [24, 'double'], vertexY: [25, 'double'], vertexRadius: [26, 'double'],
  inRotation: [84, 'double'], inDistance: [85, 'double'], outRotation: [86, 'double'], outDistance: [87, 'double'],
  mirroredRotation: [82, 'double'], mirroredDistance: [83, 'double'],
  // Paints
  isVisible: [41, 'bool'], fillRule: [40, 'uint'],
  thickness: [47, 'double'], cap: [48, 'uint'], join: [49, 'uint'], transformAffectsStroke: [50, 'bool'],
  colorValue: [37, 'color'],
  startX: [42, 'double'], startY: [33, 'double'], endX: [34, 'double'], endY: [35, 'double'], gradientOpacity: [46, 'double'],
  stopColor: [38, 'color'], stopPosition: [39, 'double'],
  trimStart: [114, 'double'], trimEnd: [115, 'double'], trimOffset: [116, 'double'], trimMode: [117, 'uint'],
  // Animation
  animationName: [55, 'string'], fps: [56, 'uint'], duration: [57, 'uint'], speed: [58, 'double'], loopValue: [59, 'uint'],
  objectId: [51, 'id'], propertyKey: [53, 'uint'],
  frame: [67, 'uint'], interpolationType: [68, 'uint'], interpolatorId: [69, 'id'],
  keyValue: [70, 'double'], keyColor: [88, 'color'],
  x1: [63, 'double'], y1: [64, 'double'], x2: [65, 'double'], y2: [66, 'double'],
  // State machine
  componentName: [138, 'string'], numberValue: [140, 'double'], boolValue: [141, 'bool'],
  animationId: [149, 'id'],
  stateToId: [151, 'id'], transitionFlags: [152, 'uint'], transitionDuration: [158, 'uint'], exitTime: [160, 'uint'],
  inputId: [155, 'id'], opValue: [156, 'uint'], conditionValue: [157, 'double'],
  blendInputId: [167, 'id'], blendAnimationId: [165, 'id'], blendValue: [166, 'double'],
  listenerTargetId: [224, 'id'], listenerTypeValue: [225, 'uint'],
  actionInputId: [227, 'id'], actionBoolValue: [228, 'uint'], actionNumberValue: [229, 'double']
};

// Animatable property keys (what KeyedProperty points at).
export const KEY = {
  x: 13, y: 14, rotation: 15, scaleX: 16, scaleY: 17, opacity: 18,
  width: 20, height: 21, cornerRadius: 31,
  vertexX: 24, vertexY: 25, inDistance: 85, outDistance: 87, mirroredDistance: 83,
  thickness: 47, color: 37, stopColor: 38, gradientOpacity: 46,
  trimStart: 114, trimEnd: 115, trimOffset: 116
};
const COLOR_KEYS = new Set([KEY.color, KEY.stopColor]);

// ---------------------------------------------------------------- encoding
class Bytes {
  constructor() { this.buf = []; }
  byte(b) { this.buf.push(b & 0xff); }
  varuint(n) {
    if (!Number.isInteger(n) || n < 0) throw new Error(`varuint expects a non-negative integer, got ${n}`);
    do {
      let b = n % 128;
      n = Math.floor(n / 128);
      if (n > 0) b |= 0x80;
      this.byte(b);
    } while (n > 0);
  }
  u32(n) { for (let i = 0; i < 4; i++) this.byte((n >>> (8 * i)) & 0xff); }
  f32(v) {
    const dv = new DataView(new ArrayBuffer(4));
    dv.setFloat32(0, v, true);
    for (let i = 0; i < 4; i++) this.byte(dv.getUint8(i));
  }
  str(s) {
    const enc = new TextEncoder().encode(s);
    this.varuint(enc.length);
    for (const b of enc) this.byte(b);
  }
  value(type, v) {
    switch (type) {
      case 'uint': case 'id': this.varuint(v); break;
      case 'string': this.str(v); break;
      case 'double': this.f32(v); break;
      case 'color': this.u32(v >>> 0); break;
      case 'bool': this.byte(v ? 1 : 0); break;
      default: throw new Error(`unknown field type ${type}`);
    }
  }
  toUint8Array() { return Uint8Array.from(this.buf); }
}

/** "#RRGGBB" | "#RRGGBBAA" | [r,g,b,a?] → ARGB uint32. Optional alpha multiplier. */
export function color(c, alpha = 1) {
  let r, g, b, a = 1;
  if (typeof c === 'string') {
    const h = c.replace('#', '');
    r = parseInt(h.slice(0, 2), 16); g = parseInt(h.slice(2, 4), 16); b = parseInt(h.slice(4, 6), 16);
    if (h.length === 8) a = parseInt(h.slice(6, 8), 16) / 255;
  } else {
    [r, g, b, a = 1] = c;
  }
  const A = Math.round(Math.max(0, Math.min(1, a * alpha)) * 255);
  return ((A << 24) | (r << 16) | (g << 8) | b) >>> 0;
}

// ---------------------------------------------------------------- model
let uid = 0;
class Obj {
  constructor(type, props = {}, kind = 'attr') {
    this.type = type; this.props = props; this.kind = kind; this.children = []; this.uid = ++uid;
  }
}

const LOOP = { oneShot: 0, loop: 1, pingPong: 2 };
const OP = { '==': 0, '!=': 1, '<=': 2, '>=': 3, '<': 4, '>': 5 };
const LISTENER = { enter: 0, exit: 1, down: 2, up: 3, move: 4 };

export class Artboard {
  constructor({ name, width, height, clip = true }) {
    this.name = name; this.width = width; this.height = height; this.clip = clip;
    this.root = new Obj(TYPE.Artboard, {}, 'node');
    this.interpolators = []; this.animations = []; this.stateMachines = [];
  }

  _add(parent, obj) { (parent ?? this.root).children.push(obj); obj.parent = parent ?? this.root; return obj; }

  // ---- hierarchy
  node(parent, { name, x = 0, y = 0, rotation = 0, scale, scaleX = scale ?? 1, scaleY = scale ?? 1, opacity = 1 } = {}) {
    return this._add(parent, new Obj(TYPE.Node, { name, x, y, rotation, scaleX, scaleY, opacity }, 'node'));
  }
  shape(parent, { name, x = 0, y = 0, rotation = 0, scale, scaleX = scale ?? 1, scaleY = scale ?? 1, opacity = 1, blend } = {}) {
    return this._add(parent, new Obj(TYPE.Shape, { name, x, y, rotation, scaleX, scaleY, opacity, blendModeValue: blend }, 'node'));
  }
  ellipse(shape, { w, h = w, x = 0, y = 0, rotation = 0, name } = {}) {
    return this._add(shape, new Obj(TYPE.Ellipse, { name, x, y, rotation, pathWidth: w, pathHeight: h }));
  }
  rect(shape, { w, h, r = 0, x = 0, y = 0, rotation = 0, originX = 0.5, originY = 0.5, name } = {}) {
    return this._add(shape, new Obj(TYPE.Rectangle, {
      name, x, y, rotation, pathWidth: w, pathHeight: h, pathOriginX: originX, pathOriginY: originY,
      cornerRadiusTL: r, cornerRadiusTR: r, cornerRadiusBL: r, cornerRadiusBR: r, linkCornerRadius: true
    }));
  }
  star(shape, { w, h = w, points = 5, inner = 0.5, cornerRadius = 0, x = 0, y = 0, rotation = 0, name } = {}) {
    return this._add(shape, new Obj(TYPE.Star, {
      name, x, y, rotation, pathWidth: w, pathHeight: h, points, innerRadius: inner, polygonCornerRadius: cornerRadius
    }));
  }
  polygon(shape, { w, h = w, points = 6, cornerRadius = 0, x = 0, y = 0, rotation = 0, name } = {}) {
    return this._add(shape, new Obj(TYPE.Polygon, { name, x, y, rotation, pathWidth: w, pathHeight: h, points, polygonCornerRadius: cornerRadius }));
  }
  /**
   * Point path. vertices: [x, y] (straight), [x, y, {r}] (rounded corner) or
   * [x, y, {in: [dx, dy], out: [dx, dy]}] (cubic, control points relative to the vertex).
   */
  path(shape, vertices, { closed = false, x = 0, y = 0, rotation = 0, name } = {}) {
    const p = this._add(shape, new Obj(TYPE.PointsPath, { name, x, y, rotation, isClosed: closed }));
    p.vertices = vertices.map(([vx, vy, opt = {}]) => {
      let v;
      if (opt.in || opt.out) {
        const [ix, iy] = opt.in ?? [0, 0];
        const [ox, oy] = opt.out ?? [0, 0];
        v = new Obj(TYPE.CubicDetachedVertex, {
          vertexX: vx, vertexY: vy,
          inRotation: Math.atan2(iy, ix), inDistance: Math.hypot(ix, iy),
          outRotation: Math.atan2(oy, ox), outDistance: Math.hypot(ox, oy)
        });
      } else {
        v = new Obj(TYPE.StraightVertex, { vertexX: vx, vertexY: vy, vertexRadius: opt.r ?? 0 });
      }
      return this._add(p, v);
    });
    return p;
  }
  fill(shape, paint, { name } = {}) {
    const f = this._add(shape, new Obj(TYPE.Fill, { name, isVisible: true, fillRule: 0 }));
    this._paint(f, paint);
    return f;
  }
  stroke(shape, paint, { width = 1, cap = 'round', join = 'round', name, scaleStroke = true } = {}) {
    const s = this._add(shape, new Obj(TYPE.Stroke, {
      name, isVisible: true, thickness: width,
      cap: { butt: 0, round: 1, square: 2 }[cap], join: { miter: 0, round: 1, bevel: 2 }[join],
      transformAffectsStroke: scaleStroke
    }));
    this._paint(s, paint);
    return s;
  }
  /** paint: color uint32 | {linear: [x1,y1,x2,y2], stops: [[pos, color], ...]} | {radial: [cx,cy,ex,ey], stops} */
  _paint(owner, paint) {
    if (typeof paint === 'number') {
      owner.solid = this._add(owner, new Obj(TYPE.SolidColor, { colorValue: paint }));
      return;
    }
    const isRadial = !!paint.radial;
    const [sx, sy, ex, ey] = paint.radial ?? paint.linear;
    const g = this._add(owner, new Obj(isRadial ? TYPE.RadialGradient : TYPE.LinearGradient, {
      startX: sx, startY: sy, endX: ex, endY: ey, gradientOpacity: paint.opacity ?? 1
    }));
    owner.gradient = g;
    g.stops = paint.stops.map(([pos, c]) => this._add(g, new Obj(TYPE.GradientStop, { stopPosition: pos, stopColor: c })));
  }
  trim(stroke, { start = 0, end = 1, offset = 0, mode = 'sequential' } = {}) {
    return this._add(stroke, new Obj(TYPE.TrimPath, {
      trimStart: start, trimEnd: end, trimOffset: offset, trimMode: { sequential: 1, synchronized: 2 }[mode]
    }));
  }

  // ---- animation
  ease(x1, y1, x2, y2) {
    const found = this.interpolators.find(i => i.props.x1 === x1 && i.props.y1 === y1 && i.props.x2 === x2 && i.props.y2 === y2);
    if (found) return found;
    const i = new Obj(TYPE.CubicEaseInterpolator, { x1, y1, x2, y2 });
    this.interpolators.push(i);
    return i;
  }
  animation(name, { fps = 60, duration = 60, loop = 'oneShot', speed = 1 } = {}) {
    const a = new Animation(this, name, { fps, duration, loop: LOOP[loop], speed });
    this.animations.push(a);
    return a;
  }
  stateMachine(name) {
    const sm = new StateMachine(name);
    this.stateMachines.push(sm);
    return sm;
  }
}

class Animation {
  constructor(artboard, name, opts) {
    this.artboard = artboard; this.name = name; this.opts = opts; this.tracks = new Map();
    this.index = artboard.animations.length;
  }
  /**
   * Key a property. frames: [[frame, value, ease?], ...]
   * ease: 'linear' (default) | 'hold' | interpolator object | [x1,y1,x2,y2]
   */
  key(obj, prop, frames, defaultEase = 'linear') {
    const propertyKey = typeof prop === 'number' ? prop : KEY[prop];
    if (propertyKey == null) throw new Error(`unknown animatable property ${prop}`);
    if (!this.tracks.has(obj)) this.tracks.set(obj, new Map());
    const list = frames.map(([frame, value, ease = defaultEase]) => {
      let interp = ease;
      if (Array.isArray(ease)) interp = this.artboard.ease(...ease);
      return { frame: Math.round(frame), value, ease: interp };
    });
    this.tracks.get(obj).set(propertyKey, list);
    return this;
  }
}

class StateMachine {
  constructor(name) { this.name = name; this.inputs = []; this.layers = []; this.listeners = []; }
  _input(type, name, value) { const i = { type, name, value, index: this.inputs.length }; this.inputs.push(i); return i; }
  number(name, value = 0) { return this._input(TYPE.StateMachineNumber, name, value); }
  bool(name, value = false) { return this._input(TYPE.StateMachineBool, name, value); }
  trigger(name) { return this._input(TYPE.StateMachineTrigger, name); }
  layer(name) { const l = new Layer(name); this.layers.push(l); return l; }
  /** actions: [[input, value]] — bool value true/false/'toggle', trigger → null, number → value */
  listener(target, type, actions, name = '') {
    this.listeners.push({ target, type: LISTENER[type], actions, name });
  }
}

class Layer {
  constructor(name) {
    this.name = name; this.states = [];
    this.entry = this._state({ type: TYPE.EntryState });
    this.any = this._state({ type: TYPE.AnyState });
    this.exit = this._state({ type: TYPE.ExitState });
  }
  _state(s) {
    s.index = this.states.length; s.transitions = [];
    s.to = (target, opts = {}) => { s.transitions.push({ target, ...opts }); return s; };
    this.states.push(s);
    return s;
  }
  state(animation) { return this._state({ type: TYPE.AnimationState, animation }); }
  blend1d(input, entries) { return this._state({ type: TYPE.BlendState1D, input, entries }); }
}

// ---------------------------------------------------------------- file
export class RiveFile {
  constructor() { this.artboards = []; }
  artboard(opts) { const a = new Artboard(opts); this.artboards.push(a); return a; }

  toBytes() {
    const objects = []; // [typeKey, [[propName, value], ...]]
    const emit = (type, props) => objects.push([type, props.filter(([, v]) => v !== undefined && v !== null)]);

    emit(TYPE.Backboard, []);
    for (const ab of this.artboards) this._emitArtboard(ab, emit);

    // Header + property table of contents (field types for every key used).
    const out = new Bytes();
    for (const ch of 'RIVE') out.byte(ch.charCodeAt(0));
    out.varuint(7); out.varuint(0); out.varuint(0);
    const used = new Map();
    for (const [, props] of objects) for (const [name] of props) used.set(PROP[name][0], PROP[name][1]);
    const keys = [...used.keys()].sort((a, b) => a - b);
    for (const k of keys) out.varuint(k);
    out.varuint(0);
    const fieldId = { uint: 0, id: 0, bool: 0, string: 1, double: 2, color: 3 };
    for (let i = 0; i < keys.length; i += 4) {
      let word = 0;
      for (let j = 0; j < 4 && i + j < keys.length; j++) word |= fieldId[used.get(keys[i + j])] << (2 * j);
      out.u32(word);
    }

    for (const [type, props] of objects) {
      out.varuint(type);
      for (const [name, value] of props) {
        const [key, ftype] = PROP[name];
        out.varuint(key);
        out.value(ftype, value);
      }
      out.varuint(0);
    }
    return out.toUint8Array();
  }

  _emitArtboard(ab, emit) {
    const index = new Map(); // Obj → artboard index
    let next = 0;
    index.set(ab.root, next++);
    emit(TYPE.Artboard, [['name', ab.name], ['width', ab.width], ['height', ab.height], ['originX', 0], ['originY', 0], ['clip', ab.clip]]);

    // Depth-first, attributes in authoring order, drawables/nodes reversed (top-most first).
    const order = [];
    const visit = obj => {
      for (const c of obj.children.filter(c => c.kind === 'attr')) { order.push(c); visit(c); }
      for (const c of obj.children.filter(c => c.kind === 'node').reverse()) { order.push(c); visit(c); }
    };
    visit(ab.root);
    for (const o of order) index.set(o, next++);
    for (const o of ab.interpolators) index.set(o, next++);

    for (const o of order) {
      const props = [];
      const p = o.props;
      if (p.name) props.push(['name', p.name]);
      props.push(['parentId', index.get(o.parent)]);
      for (const [k, v] of Object.entries(p)) if (k !== 'name') props.push([k, v]);
      emit(o.type, props);
    }
    for (const o of ab.interpolators) {
      emit(o.type, [['x1', o.props.x1], ['y1', o.props.y1], ['x2', o.props.x2], ['y2', o.props.y2]]);
    }

    for (const a of ab.animations) {
      emit(TYPE.LinearAnimation, [
        ['animationName', a.name], ['fps', a.opts.fps], ['duration', a.opts.duration],
        ['speed', a.opts.speed], ['loopValue', a.opts.loop]
      ]);
      for (const [obj, props] of a.tracks) {
        if (!index.has(obj)) throw new Error(`animation ${a.name} keys an object outside artboard ${ab.name}`);
        emit(TYPE.KeyedObject, [['objectId', index.get(obj)]]);
        for (const [propertyKey, frames] of props) {
          emit(TYPE.KeyedProperty, [['propertyKey', propertyKey]]);
          const isColor = COLOR_KEYS.has(propertyKey);
          for (const f of frames) {
            const kp = [['frame', f.frame]];
            if (f.ease === 'hold') kp.push(['interpolationType', 0]);
            else if (f.ease === 'linear') kp.push(['interpolationType', 1]);
            else { kp.push(['interpolationType', 2]); kp.push(['interpolatorId', index.get(f.ease)]); }
            kp.push(isColor ? ['keyColor', f.value] : ['keyValue', f.value]);
            emit(isColor ? TYPE.KeyFrameColor : TYPE.KeyFrameDouble, kp);
          }
        }
      }
    }

    for (const sm of ab.stateMachines) {
      emit(TYPE.StateMachine, [['animationName', sm.name]]);
      for (const i of sm.inputs) {
        const props = [['componentName', i.name]];
        if (i.type === TYPE.StateMachineNumber) props.push(['numberValue', i.value]);
        if (i.type === TYPE.StateMachineBool) props.push(['boolValue', i.value]);
        emit(i.type, props);
      }
      for (const layer of sm.layers) {
        emit(TYPE.StateMachineLayer, [['componentName', layer.name]]);
        for (const s of layer.states) {
          if (s.type === TYPE.AnimationState) emit(s.type, [['animationId', s.animation.index]]);
          else if (s.type === TYPE.BlendState1D) emit(s.type, [['blendInputId', s.input.index]]);
          else emit(s.type, []);
          if (s.type === TYPE.BlendState1D) {
            for (const [anim, value] of s.entries) emit(TYPE.BlendAnimation1D, [['blendAnimationId', anim.index], ['blendValue', value]]);
          }
          for (const t of s.transitions) {
            let flags = 0;
            if (t.exitTime != null) flags |= 1 << 2; // EnableExitTime
            if (t.exitTimePercent) flags |= 1 << 3; // ExitTimeIsPercentage
            emit(TYPE.StateTransition, [
              ['stateToId', t.target.index], ['transitionFlags', flags],
              ['transitionDuration', t.duration ?? 0], ['exitTime', t.exitTime ?? 0]
            ]);
            for (const [input, op, value] of t.when ?? []) {
              if (input.type === TYPE.StateMachineTrigger) emit(TYPE.TransitionTriggerCondition, [['inputId', input.index]]);
              else if (input.type === TYPE.StateMachineBool) {
                // equal → passes when the input is true, notEqual → when false
                const wantTrue = (op === '==') === (value === true);
                emit(TYPE.TransitionBoolCondition, [['inputId', input.index], ['opValue', wantTrue ? 0 : 1]]);
              } else emit(TYPE.TransitionNumberCondition, [['inputId', input.index], ['opValue', OP[op]], ['conditionValue', value]]);
            }
          }
        }
      }
      for (const l of sm.listeners) {
        emit(TYPE.StateMachineListener, [['componentName', l.name], ['listenerTargetId', index.get(l.target)], ['listenerTypeValue', l.type]]);
        for (const [input, value] of l.actions) {
          if (input.type === TYPE.StateMachineTrigger) emit(TYPE.ListenerTriggerChange, [['actionInputId', input.index]]);
          else if (input.type === TYPE.StateMachineBool) emit(TYPE.ListenerBoolChange, [['actionInputId', input.index], ['actionBoolValue', value === 'toggle' ? 2 : value ? 1 : 0]]);
          else emit(TYPE.ListenerNumberChange, [['actionInputId', input.index], ['actionNumberValue', value]]);
        }
      }
    }
  }
}
