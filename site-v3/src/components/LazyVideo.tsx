import { useEffect, useRef, type VideoHTMLAttributes } from 'react';
import { usePrefersReducedMotion } from '../lib/hooks';

/** Vídeo en bucle que solo descarga y reproduce cuando está cerca de la pantalla. */
export function LazyVideo({ src, poster, className, ...rest }: VideoHTMLAttributes<HTMLVideoElement> & { src: string; poster: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const video = ref.current;
    if (!video || reduced) return undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!video.src) video.src = src;
          video.play().catch(() => undefined);
        } else {
          video.pause();
        }
      },
      { rootMargin: '200px' }
    );
    io.observe(video);
    return () => io.disconnect();
  }, [src, reduced]);

  return <video ref={ref} poster={poster} muted loop playsInline preload="none" className={className} {...rest} />;
}
