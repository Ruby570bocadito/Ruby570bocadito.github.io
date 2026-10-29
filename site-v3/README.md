# Portfolio v3 — React + Rive

Nueva versión del portfolio, interactiva y bilingüe (ES/EN). Se publica en
**https://ruby570bocadito.github.io/v3/** (carpeta `/v3` del repo), así que la web actual de la raíz
sigue intacta mientras se prueba esta.

- **Stack:** React 18 · TypeScript · Tailwind CSS 3 · Framer Motion 12 · Lucide React · Vite 7
- **Animaciones interactivas:** [Rive](https://rive.app/use-cases/websites) (runtime `@rive-app/react-canvas-lite`,
  WASM servido desde la propia web, sin CDN)
- **Tipografía:** Kanit (300–900, autoalojada con Fontsource)

## Comandos

```bash
cd site-v3
npm install
npm run dev      # http://localhost:5173/v3/
npm run build    # genera el .riv, comprueba tipos y escribe la web en ../v3
npm run rive     # solo regenera public/rive/portfolio.riv
```

## Animaciones Rive

Los `.riv` no se han hecho a mano en el editor: se generan por código con un escritor del formato
binario de Rive (`scripts/rive/riv-writer.mjs`, claves sacadas de `rive-runtime`) y las escenas están en
`scripts/rive/scenes.mjs`. Todo va en un único `public/rive/portfolio.riv`:

| Artboard | Máquina de estados | Entradas | Dónde |
|---|---|---|---|
| `hero` | `hero` | `x`, `y` (0–100), `active`, `ping` | Anillos del escáner detrás del retrato |
| `hero_frame` | `hero` | `x`, `y`, `active` | Corchetes de "objetivo fijado" delante del retrato |
| `robot` | `robot` | `x`, `y`, `hover`, `poke` (+ listeners de Rive) | Sección Robótica |
| `icon_target`, `icon_shield`, `icon_code`, `icon_neural`, `icon_gear` | `icon` | `hover` | Lista de Áreas |
| `lock` | `lock` | `hover`, `open` | Botón "Descargar CV" |

Para cambiar colores, tiempos o formas, edita `scenes.mjs` y ejecuta `npm run rive`.

## Contenido e imágenes

- Textos (ES/EN): `src/content.ts`.
- Capturas de los proyectos: salen de `/projects` y `/assets` del repo con `scripts/optimize-images.py`
  (WebP para el marquee y las tarjetas, MP4 a partir de los GIF de demo).
- Objetos 3D (`obj-*`) y portadas (`kv-*`): generados con **Muse Image** (Meta).
- Retrato: tu foto recortada con BiRefNet; Muse solo completó el pelo y los hombros que quedaban fuera
  del encuadre — la cara es la de la foto original.

## Pasarla a la raíz

Cuando esta versión te convenza, se puede hacer que `https://ruby570bocadito.github.io/` apunte a ella
(redirigiendo la raíz a `/v3/` o compilando con `base: '/'`). La web anterior sigue en el historial de git
y su código fuente en `/site`.
