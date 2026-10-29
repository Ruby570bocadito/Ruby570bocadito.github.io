# Portafolio v2 — Rive

Nueva versión del portafolio, en paralelo a la actual (la raíz del repo no se toca).

- Vista local: `python3 -m http.server 8000` en la raíz del repo → http://localhost:8000/v2/
- Publicada (cuando se fusione en `main`): https://ruby570bocadito.github.io/v2/

## Estructura
- `index.html` — contenido en español (`data-i18n`), `js/i18n.js` — traducciones EN.
- `js/main.js` — interacciones (idioma, reveals, contadores, filtros, cuenta atrás) y carga de Rive.
- `rive/portfolio.riv` — todas las animaciones Rive (artboards `Core`, `Icon*`, `Trophy`, `Signal`).
- `rive/rive.js` + `rive/rive.wasm` — runtime oficial `@rive-app/canvas@2.44.2` (MIT), autoalojado.
- `rive/source/` — generador del `.riv` en Python. Para regenerar:
  `cd v2/rive/source && python3 portfolio_riv.py ../portfolio.riv`
- `img/` — imágenes generadas con Muse Image (Meta).

## Para promocionarla a la portada
Cuando estés conforme, se puede mover `v2/` a la raíz (y la versión actual a `/clasica/`) en un commit aparte.
