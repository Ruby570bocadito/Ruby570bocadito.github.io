"""Pasa las capturas de public/img a WebP (máximo 1600 px de ancho, calidad 82): python scripts/optimize-images.py

Convierte cada .png o .jpg que no esté en KEEP y borra el original; KEEP son los que tienen que seguir en su formato
(el icono de la pestaña y la imagen para redes sociales, que no todas las redes leen en WebP)."""
import os
from PIL import Image

KEEP = {"peri-icon.png", "fp-banner.jpg"}
MAX_WIDTH = 1600

folder = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public", "img")
for name in sorted(os.listdir(folder)):
    stem, ext = os.path.splitext(name)
    if ext.lower() not in (".png", ".jpg", ".jpeg") or name in KEEP:
        continue
    src = os.path.join(folder, name)
    with Image.open(src) as im:
        im = im.convert("RGB")
        if im.width > MAX_WIDTH:
            im = im.resize((MAX_WIDTH, round(im.height * MAX_WIDTH / im.width)), Image.LANCZOS)
        out = os.path.join(folder, stem + ".webp")
        im.save(out, "WEBP", quality=82, method=6)
    before, after = os.path.getsize(src), os.path.getsize(out)
    os.remove(src)
    print(f"{name} -> {stem}.webp  {before // 1024} KB -> {after // 1024} KB")
