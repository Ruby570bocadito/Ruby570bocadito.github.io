/** Iconos de trazo sumi para la interfaz (dibujados para este proyecto). */
const S = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' };

export const IconBack = (p) => (
  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" {...p}><path {...S} d="M14.5 5.5 8 12l6.5 6.5M8.5 12H20" /></svg>
);
export const IconMap = (p) => (
  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" {...p}>
    <path {...S} d="M5 6.5h14v11H5z" />
    <path {...S} d="M3.5 5v14M20.5 5v14" strokeWidth="2.6" />
    <path {...S} d="M8 10.5h3.5l2 2.5H16M9 15h2" strokeWidth="1.4" />
  </svg>
);
export const IconTerminal = (p) => (
  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" {...p}>
    <rect {...S} x="3.5" y="5" width="17" height="14" rx="1" />
    <path {...S} d="m7 10 3 2.5L7 15M12 15.5h5" />
  </svg>
);
/** Campana furin: con barra diagonal cuando está en silencio. */
export const IconSound = ({ muted, ...p }) => (
  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" {...p}>
    <path {...S} d="M12 3v2M7 12a5 5 0 0 1 10 0v1H7z" />
    <path {...S} d="M12 13v3" />
    <path {...S} d="M10.5 16h3v4.5h-3z" strokeWidth="1.4" />
    {muted ? <path {...S} d="M4 20 20 4" strokeWidth="2" /> : <path {...S} d="M18.5 8.5c1 1 1.5 2 1.5 3.5M5.5 8.5c-1 1-1.5 2-1.5 3.5" strokeWidth="1.4" />}
  </svg>
);
export const IconSeal = (p) => (
  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" {...p}>
    <rect {...S} x="4" y="4" width="16" height="16" rx="3" />
    <path {...S} d="M8 9h8M8 12.5h8M10 9v7M14 12.5V16" strokeWidth="1.5" />
  </svg>
);
