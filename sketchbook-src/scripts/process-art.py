#!/usr/bin/env python3
"""Convierte los PNG en bruto (.art-raw) en WebP listos para la web (public/art).
- objetos  -> recorte del fondo blanco a transparencia (RGBA)
- texturas -> rectángulo completo (fondos tileables)
- escenas  -> rectángulo completo (paisajes)
Uso: python3 scripts/process-art.py [--raw DIR] [--out DIR]
"""
import argparse
import glob
import os
import numpy as np
import cv2
from PIL import Image

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# fondos rectangulares (no se recortan)
TEXTURES = {'brick', 'wall', 'floor', 'ceiling', 'cork'}
SCENES = {'sea', 'landscape'}
# paisajes anchos que van a tamaño grande; el resto de objetos, mediano
WIDE = {'sea': 1600, 'landscape': 1600, 'sign': 1100, 'planter': 1100, 'bench': 1100,
        'desk': 1200, 'pegboard': 1200, 'whiteboard': 1200, 'folder': 1000, 'robot-kit': 1100,
        'laptop': 1100, 'envelope': 1000, 'plane': 1000}
# nubes: contorno muy tenue -> umbral más permisivo y sellado mayor
SOFT = {'clouds', 'balloon'}
MAXOBJ = 900

def cutout(im, thr=236, seal=4):
    h, w = im.shape[:2]
    mn = im.min(axis=2).astype(np.int16)
    mx = im.max(axis=2).astype(np.int16)
    lum = 0.299 * im[..., 0] + 0.587 * im[..., 1] + 0.114 * im[..., 2]
    paper = (mn >= thr) & ((mx - mn) <= 18)
    dark = (lum < 205).astype(np.uint8)
    k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * seal + 1, 2 * seal + 1))
    dark_d = cv2.dilate(dark, k)
    cand = (paper & (dark_d == 0)).astype(np.uint8)
    n, lab = cv2.connectedComponents(cand, connectivity=4)
    border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    bg = np.isin(lab, list(border))
    bg = bg | (cv2.dilate(bg.astype(np.uint8), k).astype(bool) & paper)
    alpha = np.where(bg, 0, 255).astype(np.uint8)
    alpha = cv2.morphologyEx(alpha, cv2.MORPH_OPEN, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3)))
    n2, lab2, stats, _ = cv2.connectedComponentsWithStats((alpha > 0).astype(np.uint8), 8)
    if n2 > 1:
        big = stats[1:, cv2.CC_STAT_AREA].max()
        for i in range(1, n2):
            if stats[i, cv2.CC_STAT_AREA] < max(120, big * 0.004):
                alpha[lab2 == i] = 0
    alpha = cv2.GaussianBlur(alpha, (0, 0), 1.0)
    a = alpha.astype(np.float32) / 255.0
    rgb = im.astype(np.float32)
    edge = (a > 0.02) & (a < 0.98)
    rgb[edge] = np.clip((rgb[edge] - (1 - a[edge, None]) * 255.0) / np.maximum(a[edge, None], 0.05), 0, 255)
    out = np.dstack([rgb.astype(np.uint8), alpha])
    ys, xs = np.where(alpha > 8)
    if len(xs):
        pad = 10
        x0, x1 = max(xs.min() - pad, 0), min(xs.max() + pad, w - 1)
        y0, y1 = max(ys.min() - pad, 0), min(ys.max() + pad, h - 1)
        out = out[y0:y1 + 1, x0:x1 + 1]
    return out

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--raw', default=os.path.join(HERE, '.art-raw'))
    ap.add_argument('--out', default=os.path.join(HERE, 'public', 'art'))
    ap.add_argument('--only', nargs='*')
    args = ap.parse_args()
    os.makedirs(args.out, exist_ok=True)
    files = sorted(glob.glob(os.path.join(args.raw, '*-[0-9].png')))
    done = []
    for f in files:
        base = os.path.basename(f)[:-6]  # quita "-N.png"
        idx = os.path.basename(f)[-5]
        if args.only and base not in args.only:
            continue
        name = base if idx == '0' else f'{base}{int(idx)+1}'
        src = Image.open(f).convert('RGB')
        im = np.array(src)
        if base in TEXTURES:
            img = Image.fromarray(im)
            side = 640
            s = side / max(img.size)
            if s < 1:
                img = img.resize((round(img.size[0] * s), round(img.size[1] * s)), Image.LANCZOS)
            img.save(os.path.join(args.out, f'{name}.webp'), quality=82, method=6)
        elif base in SCENES:
            img = Image.fromarray(im)
            s = WIDE.get(base, 1600) / max(img.size)
            if s < 1:
                img = img.resize((round(img.size[0] * s), round(img.size[1] * s)), Image.LANCZOS)
            img.save(os.path.join(args.out, f'{name}.webp'), quality=84, method=6)
        else:
            out = cutout(im, thr=240 if base in SOFT else 236, seal=7 if base in SOFT else 4)
            img = Image.fromarray(out, 'RGBA')
            s = WIDE.get(base, MAXOBJ) / max(img.size)
            if s < 1:
                img = img.resize((round(img.size[0] * s), round(img.size[1] * s)), Image.LANCZOS)
            img.save(os.path.join(args.out, f'{name}.webp'), quality=86, method=6)
        done.append(name)
    total = sum(os.path.getsize(os.path.join(args.out, f)) for f in os.listdir(args.out))
    print(f'{len(done)} imágenes -> {args.out}  ({total/1024:.0f} KB)')

if __name__ == '__main__':
    main()
