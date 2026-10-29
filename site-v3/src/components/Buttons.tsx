import { ArrowUpRight } from 'lucide-react';
import type { AnchorHTMLAttributes, ReactNode } from 'react';

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { children: ReactNode };

/** Botón principal: píldora con degradado magenta → morado → naranja. */
export function ContactButton({ children, className = '', ...rest }: LinkProps) {
  return (
    <a
      className={`group relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full px-8 py-3 text-xs font-medium uppercase tracking-widest text-white transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98] sm:px-10 sm:py-3.5 sm:text-sm md:px-12 md:py-4 md:text-base ${className}`}
      style={{
        background: 'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
        boxShadow: '0px 4px 4px rgba(181, 1, 167, 0.25), 4px 4px 12px #7721B1 inset',
        outline: '2px solid #FFFFFF',
        outlineOffset: '-3px'
      }}
      {...rest}
    >
      {children}
    </a>
  );
}

/** Botón fantasma con borde claro (enlaces a GitHub). */
export function LiveProjectButton({ children, className = '', ...rest }: LinkProps) {
  return (
    <a
      className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border-2 border-[#D7E2EA] px-8 py-3 text-sm font-medium uppercase tracking-widest text-[#D7E2EA] transition-colors duration-200 hover:bg-[#D7E2EA]/10 sm:px-10 sm:py-3.5 sm:text-base ${className}`}
      {...rest}
    >
      {children}
      <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
    </a>
  );
}
