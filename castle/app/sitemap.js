import rooms from '@/content/rooms.json';

export const dynamic = 'force-static';

export default function sitemap() {
  const base = 'https://ruby570bocadito.github.io';
  return [{ url: base + '/', priority: 1 }, ...rooms.map((r) => ({ url: base + r.path, priority: 0.8 }))];
}
