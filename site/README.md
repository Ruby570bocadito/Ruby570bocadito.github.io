# Código fuente del portfolio (React + Vite)

Rediseño inspirado en la plantilla Strand (Framer) con animaciones de [React Bits](https://reactbits.dev).
Los textos son los del sitio original: `src/i18n.js` (EN/ES) y `src/content.json`
(generado con `scripts/extract-content.py` a partir del `index.html` original, commit 71731b0).

```bash
cd site
npm install
npm run dev                         # desarrollo en http://localhost:5173
npm run build                       # escribe ../index.html (prerenderizado) y ../static/
node scripts/build.mjs --out /tmp/x # build en otra carpeta, para previsualizar sin tocar la raíz
```

Componentes de React Bits usados (en `src/reactbits/`): Threads, DecryptedText, SplitText, ShinyText,
CountUp, ScrollReveal, SpotlightCard, AnimatedContent, Magnet, LogoLoop y GlareHover.
