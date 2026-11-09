// Trae la lista de repositorios públicos de GitHub a src/data/repos.json para la Biblioteca.
// node scripts/fetch-library.mjs   (o npm run library)
// Los textos en español, la estantería y el emoji de cada repo están en src/library.js; un repo nuevo que no esté
// allí aparece igualmente, en "Herramientas y más", con la descripción de GitHub.
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const USER = 'Ruby570bocadito';
const out = resolve(dirname(fileURLToPath(import.meta.url)), '../src/data/repos.json');

const res = await fetch(`https://api.github.com/users/${USER}/repos?per_page=100&type=owner&sort=pushed`, {
  headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'portfolio-library-script' }
});
if (!res.ok) throw new Error(`GitHub respondió ${res.status}`);
const repos = (await res.json())
  .filter(r => !r.fork && r.name !== USER) // el repo del README de perfil no es un proyecto
  .map(r => ({
    name: r.name,
    description: r.description ?? '',
    language: r.language ?? '',
    stars: r.stargazers_count,
    topics: r.topics ?? [],
    url: r.html_url,
    homepage: r.homepage || '',
    created: r.created_at.slice(0, 10),
    pushed: r.pushed_at.slice(0, 10),
    archived: r.archived
  }));

mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, `${JSON.stringify(repos, null, 2)}\n`);
console.log(`✓ ${repos.length} repositorios en ${out}`);
