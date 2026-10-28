# Portfolio de Rafael Gálvez — versión "cuaderno de bocetos"

Sitio estático (HTML + CSS + JavaScript vanilla, sin framework) inspirado en los
portfolios interactivos ilustrados a mano. Todas las ilustraciones se generaron con
**Muse Image de Meta** (`muse-image-1.0`) y se procesaron localmente (recorte del
fondo a transparencia y conversión a WebP).

El sitio se publica en la **raíz del repositorio** (GitHub Pages):

- `index.html` — página prerenderizada (español por defecto, ES/EN en caliente).
- `sb/app.css`, `sb/app.js` — estilos e interacción.
- `sb/art/*.webp` — ilustraciones.
- `sb/fonts/*.woff2` — fuentes autoalojadas (Cabin Sketch, Patrick Hand, Nunito).
- `assets/`, `projects/`, `cv.pdf` — capturas reales de proyectos y CV (reutilizados).

La **versión anterior** del portfolio se conserva intacta en `/classic/`
(y, por supuesto, en el historial de git).

## Estructura del código fuente

```
sketchbook-src/
  src/content.mjs     Contenido bilingüe (ES/EN) + estructura de secciones
  src/app.css         Tema "cuaderno" (papel, trazos, animaciones)
  src/app.js          i18n, parallax, reveals, menú de puertas, contadores…
  scripts/art-jobs.mjs     Lista de ilustraciones y sus prompts
  scripts/generate-art.mjs Genera los PNG con Muse Image (necesita MUSE_API_KEY)
  scripts/process-art.py   Recorta el fondo y exporta a WebP (public/art)
  scripts/build.mjs        Renderiza ../index.html y copia /sb
  public/fonts/       Fuentes (origen)
  public/art/         Ilustraciones procesadas (fuera de git; se regeneran)
```

## Reconstruir

```bash
cd sketchbook-src
npm install

# 1) (solo si cambian las ilustraciones) generar y procesar el arte
MUSE_API_KEY="<tu-clave-de-Muse>" npm run art:generate
npm run art:process

# 2) construir el sitio en la raíz del repo
npm run build
```

> La clave de la API **nunca** se guarda en el repositorio: se pasa como variable
> de entorno `MUSE_API_KEY` solo al generar imágenes.

Para cambios de **texto o diseño** basta con editar `src/content.mjs` / `src/app.css`
/ `src/app.js` y ejecutar `npm run build`: las ilustraciones ya publicadas en
`/sb/art` se conservan aunque `public/art` no esté presente.

## Previsualizar

```bash
cd sketchbook-src && npm run preview   # sirve el repo en http://localhost:8099
```
