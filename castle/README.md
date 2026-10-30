# 見張りの城 · El castillo vigía

Portfolio 3D navegable de **Rafael Gálvez Silipo** en estética **ukiyo-e** (grabado japonés en madera, estilo Edo):
un castillo junto al mar que es mi SOC, con una sala por cada parte de mi trabajo.

> I learn by building. / 作って学ぶ

## Salas y rutas

| Ruta | Sala | Contenido |
|---|---|---|
| `/` | 大手門 Portón + pasarela (engawa) | Intro, avatar, camino con scroll |
| `/about/` | 物語 WHOAMI | Emakimono que se desenrolla con el scroll |
| `/watchtower/` | 見張り台 THE WATCHTOWER | Proyectos como tablillas ema |
| `/dojo/` | 道場 THE DOJO | Skills como armas de madera + sellos |
| `/archive/` | 巻物庫 THE ARCHIVE | Certificaciones y logros como pergaminos |
| `/harbor/` | 港 THE HARBOR | Contacto: barcas y farolillos, carta |
| `/kura/` | 蔵 KURA | Archivo ofensivo (Red Team) |

Cada ruta se exporta como `ruta/index.html`, así que funciona al recargar o abrirla directamente.
Si se entra directo a una sala, se salta la intro. El portfolio anterior sigue disponible en `/classic/`.

## Stack

- **Next.js 16** (App Router, `output: 'export'`) + **React 19**
- **React Three Fiber** + **drei** (escenas, contornos), **three.js**
- **GSAP / ScrollTrigger** para mapear el scroll a la cámara
- **Zustand** (estado, sellos, idioma y volúmenes persistidos en `localStorage`)
- **Tailwind CSS 4** para la interfaz
- Tipografías: Shippori Mincho (títulos/kanji), Inter (texto), JetBrains Mono (terminal) vía Google Fonts

### Look ukiyo-e

- `MeshToonMaterial` con rampa de 3 tonos (colores planos) + contornos sumi (`<Outlines>` de drei, casco invertido en píxeles).
- Veta de madera y papel washi procedurales (`components/three/textures.js`); washi en `multiply` sobre el canvas.
- Cielos y agua con degradado **bokashi** (shaders en `components/three/kit.jsx`).
- Capas 2D en planos (parallax): monte, nubes kasumi, olas, grullas, avatar y ninja — arte SVG **100 % original** en `components/three/art.js`.
- Paleta: índigo `#1F3A5F`, bermellón `#C8402A` (solo alertas y sellos hanko), ocre `#D9A441`, pino `#4A6B4F`, sumi `#1A1A1A`, washi `#F2E8D5`.

### Audio

Todo procedural con Web Audio (`lib/audio.js`): viento, agua, campanas furin, frases de shakuhachi en escala *in*
y SFX de madera, papel y sello. Empieza silenciado; sliders de música y efectos.

## Contenido editable (JSON)

Todo el texto vive en `content/`:

- `profile.json` — nombre, bio, lema, enlaces, foco, estado
- `projects.json` — proyectos de la torre (métricas, stack, GitHub, demo)
- `skills.json` — categorías del dojo y sus tecnologías
- `certs.json` — certificaciones (`obtained` 取得 · `preparing` 準備中 · `course` 課程) y logros
- `story.json` — escenas del emakimono, "Cómo aprendo" y la IA
- `offensive.json` — proyectos del kura
- `rooms.json` — salas, kanji y SEO por ruta

Cada texto acepta `{ "es": "...", "en": "...", "ja": "..." }`; si falta un idioma se usa el inglés.
Para que un proyecto tenga demo, rellena `"demo": "https://..."`.

## Desarrollo

```bash
cd castle
npm install
npm run dev        # http://localhost:3000
```

## Despliegue en GitHub Pages

El sitio se sirve desde la raíz de la rama `main`. El despliegue compila y copia la exportación estática a la raíz:

```bash
cd castle
npm run deploy     # next build + scripts/deploy.mjs
```

`scripts/deploy.mjs` copia `castle/out/` a la raíz del repo y registra lo copiado en `.castle-manifest.json`
para limpiarlo en el siguiente despliegue. Nunca toca `classic/`, `static/`, `assets/`, `projects/`, `fonts/`,
`cv.pdf` ni `site/` (el portfolio clásico). Después, haz commit y push a `main`.

Imagen Open Graph: `public/og.png` (1200×630). Se puede regenerar con `node scripts/og.mjs` sirviendo `out/` en el puerto 4321.

## Interacciones

- **Terminal**: pulsa `~` (o `º` en teclado español). Comandos: `whoami`, `cat focus.txt`, `./status --hiring`, `ls projects/`, `ls rooms/`, `cd <sala>`, `stamps`, `help`.
- **Mapa**: pergamino con el plano del castillo; cada icono teletransporta y un sello rojo marca dónde estás.
- **Libro de sellos (御朱印帳)**: 入城 entrar · 巡回 recorrer la pasarela · 物語 leer el pergamino · 分析 inspeccionar un proyecto · 狩人 cazar al ninja escondido en un tejado · 連絡 usar un canal de contacto.

## Accesibilidad y rendimiento

- Enlace "Saltar a navegación accesible" → versión 2D completa en HTML semántico. Se usa automáticamente en móvil,
  con `prefers-reduced-motion` o sin WebGL; se puede forzar con `?mode=2d` / `?mode=3d` o con el botón de la barra.
- Todo lo clicable en 3D tiene también un botón HTML equivalente (navegable con teclado).
- Carga diferida por sala (cada escena es un chunk), texturas procedurales (sin descargas de imágenes),
  `dpr` limitado a 1.6 con `AdaptiveDpr` / `PerformanceMonitor`.
