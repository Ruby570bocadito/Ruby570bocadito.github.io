'use client';
import { useEffect } from 'react';
import { useT } from '@/lib/i18n';

/** Sello hanko bermellón. */
export function Hanko({ children, className = '', size = 'text-base', outline = false, title }) {
  return (
    <span className={`${outline ? 'hanko-outline' : 'hanko'} ${size} ${className}`} title={title}>
      {children}
    </span>
  );
}

/** Modal en forma de grabado a pantalla completa (Esc para cerrar). */
export function PrintModal({ open, onClose, label, children, wide = true }) {
  const t = useT();
  useEffect(() => {
    if (!open) return;
    const k = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-sumi/60 p-3 md:p-8" role="dialog" aria-modal="true" aria-label={label} onClick={onClose}>
      <div
        className={`washi woodframe fade-up relative max-h-[92vh] w-full overflow-y-auto ${wide ? 'max-w-5xl' : 'max-w-xl'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} autoFocus className="ink absolute right-3 top-3 z-10 bg-washi px-3 py-1 font-serif text-sm font-bold hover:bg-ochre" aria-label={t('close')}>
          ✕ {t('close')}
        </button>
        {children}
      </div>
    </div>
  );
}

/** Botón de madera/papel de la interfaz. */
export function WoodButton({ children, className = '', active, ...p }) {
  return (
    <button
      {...p}
      className={`ink inline-flex items-center gap-1.5 px-2.5 py-1.5 font-serif text-sm font-bold transition-colors ${active ? 'bg-ochre text-sumi' : 'bg-washi text-sumi hover:bg-washi-dark'} ${className}`}
    >
      {children}
    </button>
  );
}

export function ExtLink({ href, children, className = '', onClick }) {
  const ext = /^https?:/.test(href);
  return (
    <a
      href={href}
      onClick={onClick}
      {...(ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={`ink inkshadow inline-flex items-center gap-2 bg-ai px-4 py-2 font-serif font-bold text-washi transition-transform hover:-translate-y-0.5 ${className}`}
    >
      {children}
    </a>
  );
}
