"""Minimal .riv (Rive runtime format v7) writer."""
import json, struct, os
_D = os.path.dirname(os.path.abspath(__file__))
REG = json.load(open(os.path.join(_D, 'reg.json')))
FT = {int(k): v for k, v in json.load(open(os.path.join(_D, 'fieldtypes.json'))).items()}

def _props_of(cls):
    out = {}
    while cls and cls in REG:
        for k, v in REG[cls]['props'].items():
            out.setdefault(v[0], int(k))
        cls = REG[cls]['super']
    return out

def vu(n):
    b = bytearray()
    while True:
        x = n & 0x7f; n >>= 7
        if n: b.append(x | 0x80)
        else: b.append(x); return bytes(b)

def color(c):
    # '#rrggbb' or '#rrggbbaa' -> argb uint
    c = c.lstrip('#')
    if len(c) == 6: c += 'ff'
    r, g, b_, a = (int(c[i:i+2], 16) for i in (0, 2, 4, 6))
    return (a << 24) | (r << 16) | (g << 8) | b_

class Riv:
    def __init__(self):
        self.out = bytearray(b'RIVE' + vu(7) + vu(0) + vu(0) + vu(0))
        self.local = -1
        self.anim = -1
        self._emit('Backboard')

    def _emit(self, cls, **kw):
        tk = REG[cls]['typeKey']
        pm = _props_of(cls)
        buf = bytearray(vu(tk))
        for name, val in kw.items():
            if val is None: continue
            k = pm[name]; t = FT[k]
            buf += vu(k)
            if t in ('Uint', 'Id'): buf += vu(int(val))
            elif t == 'Int': v = int(val); buf += vu(((v << 1) ^ (v >> 31)) & 0xffffffff)
            elif t == 'Double': buf += struct.pack('<f', float(val))
            elif t == 'Color': buf += struct.pack('<I', color(val) if isinstance(val, str) else val)
            elif t == 'Bool': buf.append(1 if val else 0)
            elif t == 'String':
                s = val.encode(); buf += vu(len(s)) + s
            else: raise ValueError(t)
        buf += vu(0)
        self.out += buf

    # ---- artboard components (claim an index) ----
    def artboard(self, name, w, h, **kw):
        self.local = -1; self.anim = -1; self.sm_inputs = {}
        return self.add('Artboard', name=name, width=w, height=h, **kw)

    def add(self, cls, parent=None, **kw):
        if parent is not None: kw['parentId'] = parent
        self._emit(cls, **kw)
        self.local += 1
        return self.local

    # helpers
    def node(self, parent=0, name=None, **kw):
        return self.add('Node', parent, name=name, **kw)
    def shape(self, parent=0, name=None, **kw):
        return self.add('Shape', parent, name=name, **kw)
    def fill(self, shape, c=None, **kw):
        f = self.add('Fill', shape, **kw)
        if c is not None: self.add('SolidColor', f, colorValue=c)
        return f
    def stroke(self, shape, c=None, w=2, cap=1, join=1, **kw):
        s = self.add('Stroke', shape, thickness=w, cap=cap, join=join, **kw)
        if c is not None: self.add('SolidColor', s, colorValue=c)
        return s
    def grad(self, paint, stops, radial=False, **kw):
        g = self.add('RadialGradient' if radial else 'LinearGradient', paint, **kw)
        for pos, c in stops:
            self.add('GradientStop', g, position=pos, colorValue=c)
        return g
    def ellipse(self, shape, w, h, **kw):
        return self.add('Ellipse', shape, width=w, height=h, **kw)
    def rect(self, shape, w, h, r=0, **kw):
        return self.add('Rectangle', shape, width=w, height=h, cornerRadiusTL=r, cornerRadiusTR=r, cornerRadiusBL=r, cornerRadiusBR=r, **kw)
    def poly(self, shape, pts, closed=True, **kw):
        p = self.add('PointsPath', shape, isClosed=closed, **kw)
        for pt in pts:
            if len(pt) == 2:
                self.add('StraightVertex', p, x=pt[0], y=pt[1])
            else:
                self.add('StraightVertex', p, x=pt[0], y=pt[1], radius=pt[2])
        return p
    def ease(self, x1=.42, y1=0, x2=.58, y2=1):
        return self.add('CubicEaseInterpolator', x1=x1, y1=y1, x2=x2, y2=y2)

    # ---- animations ----
    def animation(self, name, frames, fps=60, loop=1):
        """frames: duration in frames. loop: 0 oneShot, 1 loop, 2 pingPong.
        Then call key(obj, prop, [(frame, value, interp)...])"""
        self._emit('LinearAnimation', name=name, fps=fps, duration=frames, loopValue=loop)
        self.anim += 1
        self._keyed = {}
        return self.anim

    def key(self, obj, prop, kfs, cls='Node', interp=None):
        """kfs: list of (frame, value) or (frame, value, interpolatorIdx or 'linear'/'hold')."""
        pk = _props_of(cls)[prop] if isinstance(prop, str) else prop
        self._emit('KeyedObject', objectId=obj)
        self._emit('KeyedProperty', propertyKey=pk)
        for kf in kfs:
            fr, val = kf[0], kf[1]
            ip = kf[2] if len(kf) > 2 else interp
            kw = {}
            if ip == 'hold': kw['interpolationType'] = 0
            elif ip is None or ip == 'linear': kw['interpolationType'] = 1
            else: kw['interpolationType'] = 2; kw['interpolatorId'] = ip
            if FT[pk] == 'Color':
                self._emit('KeyFrameColor', frame=fr, value=val, **kw)
            else:
                self._emit('KeyFrameDouble', frame=fr, value=val, **kw)

    # ---- state machines ----
    def state_machine(self, name):
        self._emit('StateMachine', name=name)
        self._inputs = {}
    def number(self, name, value=0):
        self._emit('StateMachineNumber', name=name, value=value)
        self._inputs[name] = len(self._inputs); return self._inputs[name]
    def boolean(self, name, value=False):
        self._emit('StateMachineBool', name=name, value=value)
        self._inputs[name] = len(self._inputs); return self._inputs[name]
    def trigger(self, name):
        self._emit('StateMachineTrigger', name=name)
        self._inputs[name] = len(self._inputs); return self._inputs[name]
    def layer(self, name, states):
        """states: list of dicts. Each: {'type': 'entry'|'any'|'exit'|'anim'|'blend1d',
        'anim': idx, 'input': name, 'blend': [(anim, value)],
        'to': [ {'to': stateIndex, 'duration': ms, 'exitTime': ms, 'conds': [(input, op, value)]} ]}
        op: for bool: True/False; number op codes 0 ==,1 !=,2 <=,3 >=,4 <,5 >; trigger: 'trig'"""
        self._emit('StateMachineLayer', name=name)
        for st in states:
            t = st['type']
            if t == 'entry': self._emit('EntryState')
            elif t == 'any': self._emit('AnyState')
            elif t == 'exit': self._emit('ExitState')
            elif t == 'anim': self._emit('AnimationState', animationId=st['anim'])
            elif t == 'blend1d': self._emit('BlendState1DInput', inputId=self._inputs[st['input']])
            for tr in st.get('to', []):
                flags = 0
                kw = {}
                if tr.get('exitTime') is not None:
                    flags |= 1 << 2  # enableExitTime
                    kw['exitTime'] = tr['exitTime']
                if tr.get('pct'):
                    flags |= 1 << 3  # exitTimeIsPercentage... set below if needed
                self._emit('StateTransition', stateToId=tr['to'], duration=tr.get('duration', 0), flags=flags or None, **kw)
                for c in tr.get('conds', []):
                    inp, op, *val = c
                    iid = self._inputs[inp]
                    if op == 'trig':
                        self._emit('TransitionTriggerCondition', inputId=iid)
                    elif op is True or op is False:
                        # bool: opValue 0 == true ; 1 != true  (value condition compares to true)
                        self._emit('TransitionBoolCondition', inputId=iid, opValue=0 if op else 1)
                    else:
                        self._emit('TransitionNumberCondition', inputId=iid, opValue=op, value=val[0])
            if t == 'blend1d':
                for a, v in st['blend']:
                    self._emit('BlendAnimation1D', animationId=a, value=v)

    def save(self, path):
        open(path, 'wb').write(bytes(self.out))
