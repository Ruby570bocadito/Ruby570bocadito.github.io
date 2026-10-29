"""Optimiza las capturas reales de los proyectos (carpetas /projects y /assets del repo)
para el portfolio v3: miniaturas WebP para el marquee, versiones grandes para las tarjetas
de proyecto y vídeos MP4 (H.264) a partir de los GIF de demo.

Uso:  python3 site-v3/scripts/optimize-images.py   (requiere Pillow y ffmpeg)
"""
import subprocess
from pathlib import Path
from PIL import Image, ImageOps

REPO = Path(__file__).resolve().parents[2]
OUT_IMG = REPO / 'site-v3/public/img'
OUT_VID = REPO / 'site-v3/public/video'

# (salida, origen) — capturas reales de los proyectos
SOURCES = {
    'orq-panel': 'projects/orquestart/panel.png',
    'orq-hallazgos': 'projects/orquestart/hallazgos.png',
    'orq-roe': 'projects/orquestart/roe.png',
    'orq-equipo': 'projects/orquestart/equipo.png',
    'orq-federado': 'projects/orquestart/federado.png',
    'wc2-dashboard': 'projects/worldc2/dashboard.png',
    'wc2-sessions': 'projects/worldc2/sessions.png',
    'wc2-terminal': 'projects/worldc2/terminal.png',
    'wc2-vault': 'projects/worldc2/vault.png',
    'hive-console': 'assets/hivemind-console.png',
    'hive-architecture': 'projects/hivemind/architecture.png',
    'wormy-overview': 'projects/wormy/overview.png',
    'wormy-report': 'projects/wormy/report.png',
    'wormy-banner': 'projects/wormy/banner.png',
}
# Miniaturas del marquee (tile-*) y capturas grandes de las tarjetas de proyecto (shot-*)
TILES = ['orq-panel', 'orq-hallazgos', 'orq-roe', 'orq-equipo', 'orq-federado', 'wc2-dashboard', 'wc2-sessions',
         'wc2-terminal', 'wc2-vault', 'hive-console', 'hive-architecture', 'wormy-overview', 'wormy-report', 'wormy-banner']
CARDS = ['orq-hallazgos', 'orq-panel', 'wc2-sessions', 'wc2-dashboard', 'hive-architecture', 'hive-console',
         'wormy-banner', 'wormy-report', 'wormy-overview']
# (salida, origen) — GIF animados → MP4
CLIPS = {
    'wormy-dashboard': 'projects/wormy/dashboard.gif',
    'wormy-cli': 'projects/wormy/cli.gif',
    'hive-tui': 'projects/hivemind/tui.gif',
}
TILE = (840, 540)   # 2x de 420x270 (marquee)
CARD_W = 1280       # tarjetas de proyecto


def save_webp(im, path, quality=80):
    im.save(path, 'WEBP', quality=quality, method=6)
    return path.stat().st_size // 1024


def main():
    OUT_IMG.mkdir(parents=True, exist_ok=True)
    OUT_VID.mkdir(parents=True, exist_ok=True)
    for name in TILES:
        im = Image.open(REPO / SOURCES[name]).convert('RGB')
        tile = ImageOps.fit(im, TILE, Image.LANCZOS, centering=(0.5, 0.0))
        print(f'tile-{name:18s} {save_webp(tile, OUT_IMG / f"tile-{name}.webp", 78):4d} KB')
    for name in CARDS:
        card = Image.open(REPO / SOURCES[name]).convert('RGB')
        if card.width > CARD_W:
            card = card.resize((CARD_W, round(card.height * CARD_W / card.width)), Image.LANCZOS)
        print(f'shot-{name:18s} {save_webp(card, OUT_IMG / f"shot-{name}.webp", 80):4d} KB')
    for name, src in CLIPS.items():
        out = OUT_VID / f'{name}.mp4'
        vf = (f"scale={TILE[0]}:{TILE[1]}:force_original_aspect_ratio=increase:flags=lanczos,"
              f"crop={TILE[0]}:{TILE[1]}:(iw-{TILE[0]})/2:0,format=yuv420p")
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', str(REPO / src), '-vf', vf, '-r', '15',
                        '-c:v', 'libx264', '-preset', 'slow', '-crf', '27', '-movflags', '+faststart', '-an', str(out)], check=True)
        # póster: último fotograma (el panel ya cargado)
        poster = OUT_IMG / f'poster-{name}.webp'
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-sseof', '-1', '-i', str(out), '-frames:v', '1', str(poster.with_suffix('.png'))], check=True)
        p = Image.open(poster.with_suffix('.png')).convert('RGB')
        save_webp(p, poster, 70)
        poster.with_suffix('.png').unlink()
        print(f'{name:18s} mp4 {out.stat().st_size // 1024:4d} KB')


if __name__ == '__main__':
    main()
