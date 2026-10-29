"""Builds portfolio.riv: every Rive animation used by the v2 portfolio.

Artboards / state machines / inputs:
  Core      SM "core"   lookX, lookY (0..100), hover (bool), ping (trigger)
  Icon*     SM "icon"   hover (bool)      -> IconCyber, IconCode, IconCerts, IconAI, IconRobot, IconGoal
  Trophy    SM "trophy" hover (bool)
  Signal    SM "signal" hover (bool)
"""
import math, sys
from rivbuild import Riv

TAU = 2 * math.pi
R = Riv()

def std_layer(name, rest, hover, dur=280):
    """Two-state layer driven by the `hover` bool."""
    R.layer(name, [
        {'type': 'entry', 'to': [{'to': 3}]},
        {'type': 'any'}, {'type': 'exit'},
        {'type': 'anim', 'anim': rest, 'to': [{'to': 4, 'duration': dur, 'conds': [('hover', True)]}]},
        {'type': 'anim', 'anim': hover, 'to': [{'to': 3, 'duration': dur, 'conds': [('hover', False)]}]},
    ])

def loop_layer(name, anim):
    R.layer(name, [{'type': 'entry', 'to': [{'to': 3}]}, {'type': 'any'}, {'type': 'exit'},
                   {'type': 'anim', 'anim': anim}])

def ring_of_rects(parent, radius, count, w, h, r=0, phase=0):
    """One shape holding `count` rectangles placed around a circle."""
    sh = R.shape(parent)
    for i in range(count):
        a = phase + TAU * i / count
        R.rect(sh, w, h, r, x=radius * math.cos(a), y=radius * math.sin(a), rotation=a)
    return sh

def arc_ring(parent, d, color, w, start, end, offset=0, name=None):
    sh = R.shape(parent, name=name)
    R.ellipse(sh, d, d)
    st = R.stroke(sh, color, w=w, cap=1)
    tp = R.add('TrimPath', st, start=start, end=end, offset=offset, modeValue=1)
    return sh, tp

# =====================================================================
# CORE (hero)
# =====================================================================
CYAN = '#3ef0ff'
VIOLET = '#8b5cf6'
W = 800
R.artboard('Core', W, W)
root = R.node(0, 'root', x=400, y=400)          # intro scale/opacity
hov = R.node(root, 'hoverRoot')                 # hover scale
par = R.node(hov, 'parallax')                   # follows cursor a little

# pulse ring (ping) – top-most
pulse = R.shape(hov, name='pulse', opacity=0)
R.ellipse(pulse, 300, 300)
R.stroke(pulse, CYAN, w=3)

# ---- eye (follows cursor) ----
eye = R.node(hov, 'eye')
blink = R.node(eye, 'blink')
pupilG = R.node(blink, 'pupilGroup')
hl = R.shape(pupilG, name='highlight', x=-14, y=-16, opacity=0.9)
R.ellipse(hl, 12, 12); R.fill(hl, '#ffffff')
pupil = R.shape(pupilG, name='pupil')
R.ellipse(pupil, 46, 46)
pf = R.fill(pupil); R.grad(pf, [(0, '#05060a'), (0.7, '#0a0f1a'), (1, '#16304a')], radial=True, startX=0, startY=0, endX=23, endY=0)
irisRing = R.shape(blink, name='irisRing')
R.ellipse(irisRing, 120, 120); R.stroke(irisRing, '#bff9ff', w=2)
irisLines = ring_of_rects(blink, 44, 36, 14, 1.6, 0.8)
R.fill(irisLines, '#7ff6ffaa')
iris = R.shape(blink, name='iris')
R.ellipse(iris, 120, 120)
irisFill = R.fill(iris)
irisGrad = R.grad(irisFill, [(0, '#3ef0ff'), (0.55, '#2563eb'), (1, '#7c3aedcc')], radial=True, startX=0, startY=0, endX=60, endY=0)
irisStops = (irisGrad + 1, irisGrad + 2, irisGrad + 3)
glow = R.shape(eye, name='eyeGlow')
R.ellipse(glow, 300, 300)
gf = R.fill(glow); R.grad(gf, [(0, '#3ef0ff55'), (0.45, '#3ef0ff18'), (1, '#3ef0ff00')], radial=True, startX=0, startY=0, endX=150, endY=0)

# ---- rings ----
rings = R.node(par, 'rings')
r1 = R.node(rings, 'r1')
arc_ring(r1, 190, CYAN, 3, 0.00, 0.22)
arc_ring(r1, 190, CYAN, 3, 0.30, 0.45)
arc_ring(r1, 190, VIOLET, 3, 0.55, 0.80)
r1trim = [arc_ring(r1, 190, '#ffffff', 1.2, 0, 1)[1]]

r2 = R.node(rings, 'r2')
ticks = ring_of_rects(r2, 122, 72, 9, 1.6)
R.fill(ticks, '#3ef0ff66')
majors = ring_of_rects(r2, 124, 12, 16, 3, 1)
R.fill(majors, CYAN)

r3 = R.node(rings, 'r3')
a3 = [arc_ring(r3, 300, VIOLET, 5, 0.05, 0.20)[1], arc_ring(r3, 300, CYAN, 5, 0.38, 0.52)[1],
      arc_ring(r3, 300, VIOLET, 5, 0.70, 0.86)[1]]
dots3 = ring_of_rects(r3, 150, 3, 10, 10, 5, phase=TAU * 0.6)
R.fill(dots3, '#ffffff')

r4 = R.node(rings, 'r4')
hexs = R.shape(r4)
R.add('Polygon', hexs, points=6, width=372, height=372, cornerRadius=6)
R.stroke(hexs, '#8b5cf688', w=1.5)
hexs2 = R.shape(r4, rotation=TAU / 12)
R.add('Polygon', hexs2, points=6, width=372, height=372, cornerRadius=6)
R.stroke(hexs2, '#3ef0ff33', w=1)

r5 = R.node(rings, 'r5')
dash = ring_of_rects(r5, 236, 90, 7, 2, 1)
R.fill(dash, '#3ef0ff55')

r6 = R.node(rings, 'r6')
outer = [arc_ring(r6, 560, CYAN, 2, 0.0, 0.12)[1], arc_ring(r6, 560, CYAN, 2, 0.25, 0.37)[1],
         arc_ring(r6, 560, CYAN, 2, 0.50, 0.62)[1], arc_ring(r6, 560, CYAN, 2, 0.75, 0.87)[1]]
sat = R.shape(r6, x=280, y=0); R.ellipse(sat, 14, 14); R.fill(sat, '#ffffff')
satG = R.shape(r6, x=280, y=0); R.ellipse(satG, 40, 40)
sg = R.fill(satG); R.grad(sg, [(0, '#3ef0ff88'), (1, '#3ef0ff00')], radial=True, startX=0, startY=0, endX=20, endY=0)
outerFull = R.shape(rings, opacity=0.35); R.ellipse(outerFull, 620, 620); R.stroke(outerFull, '#8b5cf6', w=1)

# radar sweep (wedge with gradient) – behind rings
radar = R.node(par, 'radar')
wedge = R.shape(radar)
pts = [(0, 0)]
for i in range(13):
    a = -0.55 + 0.55 * i / 12
    pts.append((300 * math.cos(a), 300 * math.sin(a)))
R.poly(wedge, pts)
wf = R.fill(wedge)
R.grad(wf, [(0, '#3ef0ff00'), (1, '#3ef0ff40')], startX=150 * math.cos(-0.55), startY=150 * math.sin(-0.55), endX=300, endY=0)
# faint grid cross
cross = R.shape(par, opacity=0.25)
R.rect(cross, 640, 1, 0); R.rect(cross, 1, 640, 0)
R.fill(cross, '#3ef0ff')

e_out = R.ease(0.16, 1, 0.3, 1)      # easeOutExpo-ish
e_io = R.ease(0.65, 0, 0.35, 1)
e_back = R.ease(0.34, 1.56, 0.64, 1)

# ---- animations ----
FR = 600
idle = R.animation('idle', FR, loop=1)
R.key(r1, 'rotation', [(0, 0), (FR, TAU)])
R.key(r2, 'rotation', [(0, 0), (FR, -TAU / 6)])
R.key(r3, 'rotation', [(0, 0), (FR, -TAU)])
R.key(r4, 'rotation', [(0, 0), (FR, TAU / 6)])
R.key(r5, 'rotation', [(0, 0), (FR, TAU / 3)])
R.key(r6, 'rotation', [(0, 0), (FR, TAU / 2)])
R.key(radar, 'rotation', [(0, 0), (FR, 2 * TAU)])
R.key(glow, 'opacity', [(0, 0.7, e_io), (FR // 4, 1, e_io), (FR // 2, 0.7, e_io), (3 * FR // 4, 1, e_io), (FR, 0.7)])
R.key(irisLines, 'rotation', [(0, 0), (FR, TAU / 36 * 6)])

blinkA = R.animation('blink', 300, loop=1)
R.key(blink, 'scaleY', [(0, 1), (250, 1, e_io), (258, 0.08, e_io), (268, 1)])

intro = R.animation('intro', 110, loop=0)
R.key(root, 'scaleX', [(0, 0.55, e_out), (90, 1)])
R.key(root, 'scaleY', [(0, 0.55, e_out), (90, 1)])
R.key(root, 'opacity', [(0, 0, e_out), (40, 1)])
for i, tp in enumerate(a3 + outer):
    R.key(tp, 'offset', [(0, -0.5, e_out), (20 + 6 * i, -0.5, e_out), (100, 0)], cls='TrimPath')

lookXL = R.animation('lookXL', 1, loop=0)
R.key(eye, 'x', [(0, -38)]); R.key(pupilG, 'x', [(0, -12)]); R.key(rings, 'x', [(0, 10)])
lookXR = R.animation('lookXR', 1, loop=0)
R.key(eye, 'x', [(0, 38)]); R.key(pupilG, 'x', [(0, 12)]); R.key(rings, 'x', [(0, -10)])
lookYU = R.animation('lookYU', 1, loop=0)
R.key(eye, 'y', [(0, -38)]); R.key(pupilG, 'y', [(0, -12)]); R.key(rings, 'y', [(0, 10)])
lookYD = R.animation('lookYD', 1, loop=0)
R.key(eye, 'y', [(0, 38)]); R.key(pupilG, 'y', [(0, 12)]); R.key(rings, 'y', [(0, -10)])

def hover_pose(on):
    R.key(hov, 'scaleX', [(0, 1.07 if on else 1)])
    R.key(hov, 'scaleY', [(0, 1.07 if on else 1)])
    R.key(pupil, 'scaleX', [(0, 0.62 if on else 1)])
    R.key(pupil, 'scaleY', [(0, 0.62 if on else 1)])
    cols = ('#ff5a7a', '#e11d48', '#7c3aedcc') if on else ('#3ef0ff', '#2563eb', '#7c3aedcc')
    for s, c in zip(irisStops, cols):
        R.key(s, 'colorValue', [(0, c)], cls='GradientStop')
    R.key(r3, 'scaleX', [(0, 1.1 if on else 1)])
    R.key(r3, 'scaleY', [(0, 1.1 if on else 1)])
    R.key(r6, 'scaleX', [(0, 0.94 if on else 1)])
    R.key(r6, 'scaleY', [(0, 0.94 if on else 1)])
hRest = R.animation('hoverOff', 1, loop=0); hover_pose(False)
hOn = R.animation('hoverOn', 1, loop=0); hover_pose(True)

pingRest = R.animation('pingRest', 1, loop=0)
R.key(pulse, 'opacity', [(0, 0)])
ping = R.animation('ping', 70, loop=0)
R.key(pulse, 'opacity', [(0, 1), (70, 0)])
R.key(pulse, 'scaleX', [(0, 0.3, e_out), (70, 2.3)])
R.key(pulse, 'scaleY', [(0, 0.3, e_out), (70, 2.3)])

R.state_machine('core')
R.number('lookX', 50); R.number('lookY', 50); R.boolean('hover'); R.trigger('ping')
R.layer('intro', [{'type': 'entry', 'to': [{'to': 3}]}, {'type': 'any'}, {'type': 'exit'}, {'type': 'anim', 'anim': intro}])
loop_layer('idle', idle)
loop_layer('blink', blinkA)
R.layer('lookX', [{'type': 'entry', 'to': [{'to': 3}]}, {'type': 'any'}, {'type': 'exit'},
                  {'type': 'blend1d', 'input': 'lookX', 'blend': [(lookXL, 0), (lookXR, 100)]}])
R.layer('lookY', [{'type': 'entry', 'to': [{'to': 3}]}, {'type': 'any'}, {'type': 'exit'},
                  {'type': 'blend1d', 'input': 'lookY', 'blend': [(lookYU, 0), (lookYD, 100)]}])
std_layer('hover', hRest, hOn, 350)
R.layer('ping', [{'type': 'entry', 'to': [{'to': 3}]},
                 {'type': 'any', 'to': [{'to': 4, 'conds': [('ping', 'trig')]}]},
                 {'type': 'exit'},
                 {'type': 'anim', 'anim': pingRest},
                 {'type': 'anim', 'anim': ping, 'to': [{'to': 3, 'exitTime': 100, 'pct': True}]}])

# =====================================================================
# ICONS (160x160)
# =====================================================================
def icon_begin(name):
    R.artboard(name, 160, 160)
    g = R.node(0, 'g', x=80, y=80)
    return g

def glow_stroke(sh, color, w):
    R.stroke(sh, color, w=w)

def finish_icon(rest_fn, hover_fn, loops=()):
    """rest_fn/hover_fn: callables keying the 1-frame poses (after animation())."""
    rest = R.animation('rest', 1, loop=0); rest_fn()
    hv = R.animation('hover', 60, loop=0); hover_fn()
    loop_anims = []
    for nm, frames, fn in loops:
        a = R.animation(nm, frames, loop=1); fn(); loop_anims.append(a)
    R.state_machine('icon')
    R.boolean('hover')
    std_layer('hover', rest, hv, 220)
    for i, a in enumerate(loop_anims):
        loop_layer('loop%d' % i, a)

def pop(node, frames=40, amt=1.12):
    R.key(node, 'scaleX', [(0, 1, e_backI), (frames, amt)])
    R.key(node, 'scaleY', [(0, 1, e_backI), (frames, amt)])

def still(node, **props):
    for k, v in props.items():
        R.key(node, k, [(0, v)])

# --- shared per-icon helpers created after artboard (interpolators are per artboard)
def eases():
    global e_backI, e_outI, e_ioI
    e_backI = R.ease(0.34, 1.56, 0.64, 1)
    e_outI = R.ease(0.16, 1, 0.3, 1)
    e_ioI = R.ease(0.65, 0, 0.35, 1)

# ---------- Cyber: shield + check ----------
RED = '#ff3b5c'
g = icon_begin('IconCyber')
body = R.node(g, 'body')
chk = R.shape(body, name='check')
R.poly(chk, [(-20, 2), (-6, 16), (22, -14)], closed=False)
chkS = R.stroke(chk, '#ffffff', w=7)
chkT = R.add('TrimPath', chkS, start=0, end=0, modeValue=1)
dot = R.shape(body, name='lock', y=-2)
R.ellipse(dot, 14, 14); R.fill(dot, RED)
R.rect(dot, 6, 16, 3, y=10)
shield_pts = [(0, -58, 6), (48, -42, 10), (46, 6, 30), (0, 60, 8), (-46, 6, 30), (-48, -42, 10)]
sh = R.shape(body, name='shield')
R.poly(sh, shield_pts); R.stroke(sh, RED, w=6)
shF = R.shape(body, name='shieldFill')
R.poly(shF, shield_pts)
f = R.fill(shF); R.grad(f, [(0, '#ff3b5c40'), (1, '#ff3b5c05')], startX=0, startY=-58, endX=0, endY=60)
scan = R.shape(body, name='scan', y=-40, opacity=0.0)
R.rect(scan, 80, 2, 1); R.fill(scan, '#ffd0d8')
glowS = R.shape(body, name='glow', opacity=0.18)
R.poly(glowS, shield_pts); R.stroke(glowS, RED, w=18)
eases()
finish_icon(
    lambda: (R.key(chkT, 'end', [(0, 0)], cls='TrimPath'),
             still(dot, opacity=1, scaleX=1, scaleY=1), still(body, scaleX=1, scaleY=1), still(glowS, opacity=0.18)),
    lambda: (R.key(chkT, 'end', [(0, 0), (8, 0, e_outI), (34, 1)], cls='TrimPath'),
             R.key(dot, 'opacity', [(0, 1), (10, 0)]), R.key(dot, 'scaleX', [(0, 1), (10, 0.2)]), R.key(dot, 'scaleY', [(0, 1), (10, 0.2)]),
             pop(body, 30, 1.08), R.key(glowS, 'opacity', [(0, 0.18), (30, 0.45)])),
    loops=[('scan', 150, lambda: (R.key(scan, 'y', [(0, -44, e_ioI), (90, 40), (150, 40)]),
                                   R.key(scan, 'opacity', [(0, 0), (12, 0.7), (78, 0.7), (90, 0), (150, 0)])))]
)

# ---------- Code: </> ----------
BLUE = '#3b82f6'
g = icon_begin('IconCode')
lft = R.shape(g, name='left'); R.poly(lft, [(-26, -30), (-54, 0), (-26, 30)], closed=False); R.stroke(lft, BLUE, w=7)
rgt = R.shape(g, name='right'); R.poly(rgt, [(26, -30), (54, 0), (26, 30)], closed=False); R.stroke(rgt, BLUE, w=7)
sl = R.shape(g, name='slash'); R.poly(sl, [(12, -38), (-12, 38)], closed=False); R.stroke(sl, '#bcd6ff', w=7)
cur = R.shape(g, name='cursor', x=0, y=50); R.rect(cur, 22, 5, 2); R.fill(cur, '#bcd6ff')
glowC = R.shape(g, name='glow', opacity=0.15)
R.poly(glowC, [(-26, -30), (-54, 0), (-26, 30)], closed=False); R.stroke(glowC, BLUE, w=20)
eases()
finish_icon(
    lambda: (still(lft, x=0), still(rgt, x=0), still(sl, rotation=0), still(glowC, x=0, opacity=0.15)),
    lambda: (R.key(lft, 'x', [(0, 0, e_backI), (30, -10)]), R.key(rgt, 'x', [(0, 0, e_backI), (30, 10)]),
             R.key(sl, 'rotation', [(0, 0, e_backI), (40, TAU / 2)]), R.key(glowC, 'x', [(0, 0, e_backI), (30, -10)]),
             R.key(glowC, 'opacity', [(0, 0.15), (30, 0.35)])),
    loops=[('blink', 60, lambda: R.key(cur, 'opacity', [(0, 1, 'hold'), (30, 0, 'hold'), (60, 0)]))]
)

# ---------- Certs: badge ----------
PURPLE = '#a855f7'
g = icon_begin('IconCerts')
badge = R.node(g, 'badge', y=-12)
star = R.shape(badge, name='star'); R.add('Star', star, points=5, width=34, height=34, innerRadius=0.45, cornerRadius=2)
R.fill(star, '#f3e8ff')
ringB = R.shape(badge, name='ring'); R.ellipse(ringB, 70, 70); R.stroke(ringB, PURPLE, w=6)
dashB = ring_of_rects(badge, 46, 16, 7, 3, 1.5); R.fill(dashB, '#a855f799')
rib = R.shape(g, name='ribbons')
R.poly(rib, [(-16, 20), (-26, 58), (-12, 50), (-4, 62)], closed=False)
R.poly(rib, [(16, 20), (26, 58), (12, 50), (4, 62)], closed=False)
R.stroke(rib, PURPLE, w=6)
glowB = R.shape(badge, name='glow', opacity=0.15); R.ellipse(glowB, 70, 70); R.stroke(glowB, PURPLE, w=22)
eases()
finish_icon(
    lambda: (still(badge, scaleX=1, scaleY=1), still(star, rotation=0), still(glowB, opacity=0.15)),
    lambda: (pop(badge, 36, 1.12), R.key(star, 'rotation', [(0, 0, e_outI), (50, TAU / 5 * 2)]),
             R.key(glowB, 'opacity', [(0, 0.15), (30, 0.4)])),
    loops=[('spin', 480, lambda: R.key(dashB, 'rotation', [(0, 0), (480, TAU / 16 * 4)]))]
)

# ---------- AI: neural ----------
AMBER = '#f5b301'
g = icon_begin('IconAI')
net = R.node(g, 'net')
outer_nodes = []
for i in range(6):
    a = -TAU / 4 + TAU * i / 6
    n = R.shape(net, name='n%d' % i, x=46 * math.cos(a), y=46 * math.sin(a))
    R.ellipse(n, 14, 14); R.fill(n, '#fff4cc')
    outer_nodes.append(n)
core = R.shape(net, name='core'); R.ellipse(core, 24, 24); R.fill(core, AMBER)
links = R.shape(net, name='links')
pts6 = [(46 * math.cos(-TAU / 4 + TAU * i / 6), 46 * math.sin(-TAU / 4 + TAU * i / 6)) for i in range(6)]
for p in pts6:
    R.poly(links, [(0, 0), p], closed=False)
R.poly(links, pts6, closed=True)
lS = R.stroke(links, AMBER, w=3.5)
lT = R.add('TrimPath', lS, start=0, end=1, modeValue=2)
glowA = R.shape(net, name='glow', opacity=0.18); R.ellipse(glowA, 40, 40); R.fill(glowA, AMBER)
eases()
def ai_pulse():
    for i, n in enumerate(outer_nodes):
        s = i * 20
        R.key(n, 'scaleX', [(0, 1), (s, 1, e_ioI), (s + 15, 1.5, e_ioI), (s + 30, 1), (180, 1)])
        R.key(n, 'scaleY', [(0, 1), (s, 1, e_ioI), (s + 15, 1.5, e_ioI), (s + 30, 1), (180, 1)])
finish_icon(
    lambda: (still(net, rotation=0), still(core, scaleX=1, scaleY=1), still(glowA, scaleX=1, scaleY=1, opacity=0.18),
             R.key(lT, 'end', [(0, 1)], cls='TrimPath')),
    lambda: (R.key(net, 'rotation', [(0, 0, e_outI), (50, TAU / 6)]), pop(core, 30, 1.35),
             R.key(glowA, 'scaleX', [(0, 1), (30, 2.4)]), R.key(glowA, 'scaleY', [(0, 1), (30, 2.4)]),
             R.key(glowA, 'opacity', [(0, 0.18), (30, 0.3)]),
             R.key(lT, 'end', [(0, 0, e_outI), (45, 1)], cls='TrimPath')),
    loops=[('pulse', 180, ai_pulse)]
)

# ---------- Robotics: robot head ----------
GREEN = '#22c55e'
g = icon_begin('IconRobot')
head = R.node(g, 'head', y=8)
eyesN = R.node(head, 'eyes', y=2)
eL = R.shape(eyesN, name='eyeL', x=-17); R.ellipse(eL, 13, 13); R.fill(eL, '#dcfce7')
eR = R.shape(eyesN, name='eyeR', x=17); R.ellipse(eR, 13, 13); R.fill(eR, '#dcfce7')
mouth = R.shape(head, name='mouth', y=24); R.rect(mouth, 26, 4, 2); R.fill(mouth, GREEN)
ball = R.shape(head, name='ball', y=-62); R.ellipse(ball, 14, 14); R.fill(ball, GREEN)
ant = R.shape(head, name='ant'); R.poly(ant, [(0, -38), (0, -56)], closed=False); R.stroke(ant, GREEN, w=5)
skull = R.shape(head, name='skull'); R.rect(skull, 84, 72, 18, y=0); R.stroke(skull, GREEN, w=6)
ears = R.shape(head, name='ears'); R.rect(ears, 8, 22, 3, x=-49); R.rect(ears, 8, 22, 3, x=49); R.fill(ears, GREEN)
skF = R.shape(head, name='skullFill'); R.rect(skF, 84, 72, 18)
f = R.fill(skF); R.grad(f, [(0, '#22c55e30'), (1, '#22c55e05')], startX=0, startY=-36, endX=0, endY=36)
eases()
finish_icon(
    lambda: (still(head, rotation=0), still(ball, y=-62, scaleX=1, scaleY=1), still(mouth, scaleX=1)),
    lambda: (R.key(head, 'rotation', [(0, 0, e_ioI), (10, -0.18, e_ioI), (22, 0.14, e_ioI), (34, -0.06, e_ioI), (44, 0)]),
             R.key(ball, 'y', [(0, -62, e_backI), (20, -70), (40, -62)]),
             R.key(ball, 'scaleX', [(0, 1), (20, 1.4)]), R.key(ball, 'scaleY', [(0, 1), (20, 1.4)]),
             R.key(mouth, 'scaleX', [(0, 1, e_backI), (24, 1.6)])),
    loops=[('blink', 210, lambda: (R.key(eyesN, 'scaleY', [(0, 1), (180, 1, e_ioI), (186, 0.1, e_ioI), (194, 1), (210, 1)]),
                                    R.key(ball, 'opacity', [(0, 1, e_ioI), (105, 0.45, e_ioI), (210, 1)])))]
)

# ---------- Goal: target + arrow ----------
ORANGE = '#fb7a24'
g = icon_begin('IconGoal')
tgt = R.node(g, 'target', x=-6, y=6)
arrow = R.node(tgt, 'arrow')
ash = R.shape(arrow, name='arrowShape')
R.poly(ash, [(0, 0), (44, -44)], closed=False)
R.poly(ash, [(34, -50), (48, -48), (50, -34)], closed=False)
R.stroke(ash, '#ffe1cc', w=5)
cdot = R.shape(tgt, name='center'); R.ellipse(cdot, 14, 14); R.fill(cdot, ORANGE)
rings_t = []
for d in (40, 72, 104):
    s = R.shape(tgt); R.ellipse(s, d, d); R.stroke(s, ORANGE, w=5); rings_t.append(s)
eases()
finish_icon(
    lambda: (still(arrow, x=0, y=0, opacity=1), still(tgt, scaleX=1, scaleY=1)),
    lambda: (R.key(arrow, 'x', [(0, 60, e_outI), (14, 0)]), R.key(arrow, 'y', [(0, -60, e_outI), (14, 0)]),
             R.key(arrow, 'opacity', [(0, 0), (6, 1)]),
             R.key(tgt, 'scaleX', [(0, 1), (14, 1, e_ioI), (20, 0.9, e_backI), (40, 1.06)]),
             R.key(tgt, 'scaleY', [(0, 1), (14, 1, e_ioI), (20, 0.9, e_backI), (40, 1.06)])),
    loops=[('pulse', 150, lambda: [R.key(s, 'opacity', [(0, 1), (i * 20, 1, e_ioI), (i * 20 + 25, 0.35, e_ioI), (i * 20 + 50, 1), (150, 1)])
                                   for i, s in enumerate(rings_t)])]
)

# =====================================================================
# TROPHY (320x320)
# =====================================================================
GOLD = '#fbbf24'
R.artboard('Trophy', 320, 320)
tr = R.node(0, 'trophy', x=160, y=170)
sparks = []
for (x, y, s) in [(-92, -96, 26), (96, -70, 18), (-110, 10, 14), (104, 34, 22), (-60, -132, 12), (60, -128, 14)]:
    sp = R.shape(0, x=160 + x, y=170 + y)
    R.add('Star', sp, points=4, width=s, height=s, innerRadius=0.25)
    R.fill(sp, '#fff3c4')
    sparks.append(sp)
shine = R.shape(tr, name='shine', x=-18, y=-58, rotation=-0.4, opacity=0.8); R.rect(shine, 6, 40, 3); R.fill(shine, '#fffbeb')
cup = R.shape(tr, name='cup')
R.poly(cup, [(-52, -84, 4), (52, -84, 4), (48, -40, 30), (0, 2, 10), (-48, -40, 30)])
cf = R.fill(cup); R.grad(cf, [(0, '#fde68a'), (1, '#d97706')], startX=-50, startY=-84, endX=50, endY=0)
handles = R.shape(tr, name='handles')
R.poly(handles, [(-50, -70), (-78, -70, 10), (-78, -42, 14), (-44, -28)], closed=False)
R.poly(handles, [(50, -70), (78, -70, 10), (78, -42, 14), (44, -28)], closed=False)
R.stroke(handles, GOLD, w=8)
stem = R.shape(tr, name='stem'); R.rect(stem, 16, 34, 2, y=18); R.rect(stem, 64, 14, 4, y=42); R.rect(stem, 86, 16, 5, y=60)
R.fill(stem, '#f59e0b')
halo = R.shape(tr, name='halo', y=-30, opacity=0.25); R.ellipse(halo, 220, 220)
hf = R.fill(halo); R.grad(hf, [(0, '#fbbf2499'), (1, '#fbbf2400')], radial=True, startX=0, startY=0, endX=110, endY=0)
eases()
rest = R.animation('rest', 1, loop=0)
still(tr, scaleX=1, scaleY=1, y=170); still(halo, opacity=0.25)
hv = R.animation('hover', 60, loop=0)
R.key(tr, 'y', [(0, 170, e_backI), (24, 158)])
pop(tr, 30, 1.06)
R.key(halo, 'opacity', [(0, 0.25), (30, 0.6)])
tw = R.animation('twinkle', 240, loop=1)
for i, sp in enumerate(sparks):
    o = 1 + i * 37 % 170
    tw_k = [(0, 0.2), (o, 0.2, e_ioI), (o + 30, 1.2, e_ioI), (o + 60, 0.2), (240, 0.2)]
    R.key(sp, 'scaleX', tw_k)
    R.key(sp, 'scaleY', tw_k)
    R.key(sp, 'rotation', [(0, 0), (240, TAU / 2)])
sh_a = R.animation('shine', 180, loop=1)
R.key(shine, 'opacity', [(0, 0.2, e_ioI), (90, 0.9, e_ioI), (180, 0.2)])
R.state_machine('trophy')
R.boolean('hover')
std_layer('hover', rest, hv, 250)
loop_layer('twinkle', tw)
loop_layer('shine', sh_a)

# =====================================================================
# SIGNAL (contact) 240x240
# =====================================================================
R.artboard('Signal', 240, 240)
sg = R.node(0, 'sig', x=120, y=140)
waves = []
for i, d in enumerate((70, 130, 190)):
    sh, tp = arc_ring(sg, d, CYAN, 6, 0.0, 0.18, offset=-0.34)
    sh2, tp2 = arc_ring(sg, d, CYAN, 6, 0.0, 0.18, offset=0.16)
    waves.append((sh, sh2))
src = R.shape(sg, name='src'); R.ellipse(src, 22, 22); R.fill(src, '#ffffff')
mast = R.shape(sg, name='mast'); R.poly(mast, [(0, 10), (-22, 70), (22, 70)], closed=False); R.stroke(mast, '#3ef0ff', w=6)
mast2 = R.shape(sg); R.poly(mast2, [(0, 10), (0, 70)], closed=False); R.stroke(mast2, '#3ef0ff88', w=4)
eases()
def waves_anim(period):
    for i, (a, b) in enumerate(waves):
        s = i * period // 6
        for sh in (a, b):
            R.key(sh, 'opacity', [(0, 0.15), (s, 0.15, e_ioI), (s + period // 4, 1, e_ioI), (min(s + period // 2, period), 0.15), (period, 0.15)])
rest = R.animation('rest', 120, loop=1); waves_anim(120)
still(src, scaleX=1, scaleY=1)
hv = R.animation('hover', 60, loop=1); waves_anim(60)
R.key(src, 'scaleX', [(0, 1, e_ioI), (30, 1.35, e_ioI), (60, 1)]); R.key(src, 'scaleY', [(0, 1, e_ioI), (30, 1.35, e_ioI), (60, 1)])
R.state_machine('signal')
R.boolean('hover')
std_layer('hover', rest, hv, 200)

out = sys.argv[1] if len(sys.argv) > 1 else 'portfolio.riv'
R.save(out)
print('wrote', out, len(R.out), 'bytes')
