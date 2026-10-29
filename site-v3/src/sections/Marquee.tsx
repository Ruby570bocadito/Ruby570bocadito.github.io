import { useEffect, useRef } from 'react';
import { LazyVideo } from '../components/LazyVideo';
import { marquee, type Tile } from '../content';
import { asset, usePrefersReducedMotion } from '../lib/hooks';

const TILE_W = 420;
const GAP = 12;

function TileView({ tile }: { tile: Tile }) {
  const cls = 'h-[270px] w-[420px] shrink-0 rounded-2xl object-cover';
  return (
    <div className="group relative h-[270px] w-[420px] shrink-0 overflow-hidden rounded-2xl border border-[#D7E2EA]/10 bg-[#141414]">
      {tile.video ? (
        <LazyVideo src={asset(tile.video)} poster={asset(tile.src)} className={cls} aria-label={tile.alt} />
      ) : (
        <img src={asset(tile.src)} alt={tile.alt} loading="lazy" decoding="async" width={840} height={540} className={cls} />
      )}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <span className="text-xs font-medium uppercase tracking-widest text-white/90">{tile.alt}</span>
      </div>
    </div>
  );
}

/** Dos filas de capturas que se desplazan en sentidos opuestos al hacer scroll. */
export function Marquee() {
  const section = useRef<HTMLElement>(null);
  const row1 = useRef<HTMLDivElement>(null);
  const row2 = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  const set1 = marquee.top.length * (TILE_W + GAP);
  const set2 = marquee.bottom.length * (TILE_W + GAP);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      const el = section.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY;
      const offset = reduced ? 200 : (window.scrollY - top + window.innerHeight) * 0.3;
      // Se parte de la copia central para que nunca quede hueco en los bordes.
      if (row1.current) row1.current.style.transform = `translate3d(${offset - 200 - set1}px, 0, 0)`;
      if (row2.current) row2.current.style.transform = `translate3d(${-(offset - 200) - set2}px, 0, 0)`;
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [reduced, set1, set2]);

  const tripled = (tiles: Tile[]) => [...tiles, ...tiles, ...tiles];

  return (
    <section ref={section} aria-label="Capturas de proyectos" className="overflow-hidden bg-[#0C0C0C] pb-10 pt-24 sm:pt-32 md:pt-40">
      <div className="flex flex-col gap-3">
        <div ref={row1} className="flex w-max gap-3" style={{ willChange: 'transform' }}>
          {tripled(marquee.top).map((tile, i) => (
            <TileView key={`a${i}`} tile={tile} />
          ))}
        </div>
        <div ref={row2} className="flex w-max gap-3" style={{ willChange: 'transform' }}>
          {tripled(marquee.bottom).map((tile, i) => (
            <TileView key={`b${i}`} tile={tile} />
          ))}
        </div>
      </div>
    </section>
  );
}
