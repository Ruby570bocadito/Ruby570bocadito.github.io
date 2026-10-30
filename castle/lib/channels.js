'use client';
import profile from '@/content/profile.json';
import { useStore } from './store';
import { sfx } from './audio';

export const CHANNELS = [
  { id: 'email', kind: 'boat', label: { en: 'Email', es: 'Email', ja: 'メール' }, href: `mailto:${profile.email}` },
  { id: 'linkedin', kind: 'boat', label: { en: 'LinkedIn', es: 'LinkedIn', ja: 'LinkedIn' }, href: profile.linkedin },
  { id: 'message', kind: 'boat', label: { en: 'Send a message', es: 'Enviar mensaje', ja: '手紙を送る' } },
  { id: 'github', kind: 'lantern', label: { en: 'GitHub', es: 'GitHub', ja: 'GitHub' }, href: profile.github },
  { id: 'cv', kind: 'lantern', label: { en: 'Download CV', es: 'Descargar CV', ja: '履歴書' }, href: profile.cv, download: true },
];

/** Acción de cada canal de contacto + sello 連絡. */
export function runChannel(id) {
  const ch = CHANNELS.find((c) => c.id === id);
  if (!ch) return;
  sfx('chime');
  useStore.getState().award('contact');
  if (id === 'message') return useStore.setState({ letter: true });
  if (ch.download) {
    const a = document.createElement('a');
    a.href = ch.href; a.download = 'Rafael-Galvez-CV.pdf'; a.click();
    return;
  }
  if (ch.href.startsWith('mailto:')) { window.location.href = ch.href; return; }
  window.open(ch.href, '_blank', 'noopener');
}
