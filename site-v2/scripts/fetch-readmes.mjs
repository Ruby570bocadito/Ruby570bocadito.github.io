// Descarga el README de los proyectos de la Biblioteca y lo deja como HTML limpio en public/readmes/<repo>.html.
// node scripts/fetch-readmes.mjs   (o npm run readmes)
// - Markdown -> HTML con marked; después sanitize-html: solo etiquetas de texto, tablas e imágenes (nada de scripts,
//   estilos ni iframes).
// - Las rutas relativas pasan a ser de GitHub (imágenes desde raw.githubusercontent.com, enlaces al repo).
// - Se quitan las insignias (shields.io, badges de CI) para que la ficha quede limpia.
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';

const USER = 'Ruby570bocadito';
// Solo los proyectos defensivos y FriendlyPear: el resto de la Biblioteca enlaza a su repositorio.
const REPOS = ['bluetardigrade', 'soc-shark', 'Sabueso-Framework', 'best-harden', 'ttpblast', 'rastro', 'FriendlyPear'];
const out = resolve(dirname(fileURLToPath(import.meta.url)), '../public/readmes');
mkdirSync(out, { recursive: true });

const isBadge = src => /shields\.io|badgen\.net|badge\.svg|\/badge\b|actions\/workflows|codecov|readme-typing-svg|github-readme-stats|streak-stats/i.test(src);
const absolute = (url, repo, kind) => {
  if (!url || /^(https?:|mailto:|data:)/i.test(url)) return url;
  if (url.startsWith('#')) return `https://github.com/${USER}/${repo}${url}`;
  const path = url.replace(/^\.?\//, '');
  return kind === 'img'
    ? `https://raw.githubusercontent.com/${USER}/${repo}/HEAD/${path}`
    : `https://github.com/${USER}/${repo}/blob/HEAD/${path}`;
};

for (const repo of REPOS) {
  const res = await fetch(`https://raw.githubusercontent.com/${USER}/${repo}/HEAD/README.md`);
  if (!res.ok) {
    console.error(`✗ ${repo}: HTTP ${res.status}`);
    process.exitCode = 1;
    continue;
  }
  const raw = marked.parse(await res.text(), { gfm: true });
  const html = sanitizeHtml(raw, {
    allowedTags: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'a', 'img', 'ul', 'ol', 'li', 'strong', 'em', 'b', 'i', 'code', 'pre', 'blockquote', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'hr', 'br', 'sub', 'sup', 'details', 'summary', 'kbd', 'del'],
    allowedAttributes: { a: ['href', 'title'], img: ['src', 'alt', 'width', 'height'], th: ['align'], td: ['align'], details: ['open'] },
    allowedSchemes: ['http', 'https', 'mailto'],
    transformTags: {
      a: (tag, attribs) => ({ tagName: 'a', attribs: { ...attribs, href: absolute(attribs.href, repo, 'link'), target: '_blank', rel: 'noreferrer' } }),
      img: (tag, attribs) => ({ tagName: 'img', attribs: { ...attribs, src: absolute(attribs.src, repo, 'img'), loading: 'lazy', decoding: 'async' } })
    },
    exclusiveFilter: frame => frame.tag === 'img' && isBadge(frame.attribs.src ?? '')
  })
    // enlaces y párrafos que se han quedado vacíos al quitar las insignias
    .replace(/<a[^>]*>\s*<\/a>/g, '')
    .replace(/<p>(\s|&nbsp;|·|\|)*<\/p>/g, '');
  writeFileSync(resolve(out, `${repo}.html`), html);
  console.log(`✓ ${repo}: ${Math.round(html.length / 1024)} KB`);
}
