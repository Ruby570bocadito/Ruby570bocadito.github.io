'use client';
import { useEffect, useRef, useState } from 'react';
import { useStore, STAMPS } from '@/lib/store';
import { pick } from '@/lib/i18n';
import { useNav } from '@/lib/nav';
import profile from '@/content/profile.json';
import projects from '@/content/projects.json';
import rooms from '@/content/rooms.json';

const ROUTES = { about: '/about/', watchtower: '/watchtower/', dojo: '/dojo/', archive: '/archive/', harbor: '/harbor/', kura: '/kura/', home: '/', '~': '/', '..': '/' };

function run(cmd, lang, nav) {
  const [c, ...args] = cmd.trim().split(/\s+/);
  const a = args.join(' ');
  switch (c) {
    case '': return [];
    case 'help':
      return ['comandos / commands:', '  whoami            quién soy', '  cat focus.txt     en qué me enfoco', '  ./status --hiring disponibilidad', '  ls projects/      proyectos', '  ls rooms/         salas', '  cd <sala>         ir a una sala', '  stamps            libro de sellos', '  clear · exit'];
    case 'whoami':
      return [`${profile.name} (@${profile.handle})`, pick(profile.headline, lang), pick(profile.bio, lang), `"${profile.motto.en}" / ${profile.mottoJa}`];
    case 'cat':
      if (a === 'focus.txt') return ['# focus.txt', ...profile.focus.map((f) => '- ' + f)];
      if (a === 'motto.txt') return [profile.motto.en, profile.mottoJa];
      return [`cat: ${a || '?'}: No such file — try "cat focus.txt"`];
    case './status':
    case 'status':
      if (a.includes('--hiring')) return ['[✓] status: OPEN', '    ' + pick(profile.status, lang), `    contact: ${profile.email}`, '    → cd harbor'];
      return ['usage: ./status --hiring'];
    case 'ls':
      if (a.startsWith('projects')) return projects.map((p) => `${p.featured ? '★' : ' '} ${p.name.padEnd(18)} ${pick(p.tagline, lang)}`);
      if (a.startsWith('rooms')) return rooms.map((r) => `${r.kanji.padEnd(5, '　')} ${r.name.padEnd(16)} cd ${r.id}`);
      return ['focus.txt  motto.txt  projects/  rooms/'];
    case 'cd': {
      const r = ROUTES[a.replace(/\/$/, '')];
      if (!r) return [`cd: ${a}: no such room — try "ls rooms/"`];
      setTimeout(() => { useStore.setState({ terminal: false }); nav(r); }, 250);
      return [`→ ${a}`];
    }
    case 'stamps': {
      const st = useStore.getState().stamps;
      return STAMPS.map((s) => `${st[s.id] ? '[印]' : '[  ]'} ${s.kanji} ${pick(s.label, lang)}`);
    }
    case 'sudo': return ['nice try. this incident has been logged to the SOC. 🛡'.replace(' 🛡', '')];
    case 'hunt':
    case 'ninja': return ['threat hunting tip: look at the rooftops of the engawa…'];
    default: return [`${c}: command not found — type "help"`];
  }
}

/** Terminal sobre papel washi; se abre con "~". */
export default function Terminal() {
  const open = useStore((s) => s.terminal);
  const lang = useStore((s) => s.lang);
  const nav = useNav();
  const [lines, setLines] = useState(['見張りの城 — guard terminal. type "help".']);
  const [val, setVal] = useState('');
  const [hist, setHist] = useState([]);
  const [hi, setHi] = useState(-1);
  const input = useRef(), box = useRef();

  useEffect(() => {
    const k = (e) => {
      const tag = (e.target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea') { if (e.key === 'Escape') useStore.setState({ terminal: false }); return; }
      if (e.key === '~' || e.key === '`' || e.key === 'º' || e.code === 'Backquote') { e.preventDefault(); useStore.setState({ terminal: !useStore.getState().terminal }); }
      if (e.key === 'Escape') useStore.setState({ terminal: false });
    };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, []);
  useEffect(() => { if (open) setTimeout(() => input.current?.focus(), 30); }, [open]);
  useEffect(() => { box.current && (box.current.scrollTop = box.current.scrollHeight); }, [lines]);

  if (!open) return null;
  const submit = (e) => {
    e.preventDefault();
    if (val.trim() === 'clear') { setLines([]); setVal(''); return; }
    if (val.trim() === 'exit') { useStore.setState({ terminal: false }); setVal(''); return; }
    setLines((l) => [...l, `rafael@castle:~$ ${val}`, ...run(val, lang, nav)]);
    setHist((h) => [val, ...h]); setHi(-1); setVal('');
  };
  return (
    <div className="fixed inset-x-0 bottom-0 z-[70] p-2 md:p-4" role="dialog" aria-label="Terminal">
      <div className="washi woodframe mx-auto max-w-3xl">
        <div className="wood flex items-center justify-between border-b-[3px] border-sumi px-3 py-1.5">
          <span className="font-serif text-sm font-bold text-washi">端末 · terminal</span>
          <button className="font-mono text-sm text-washi hover:text-ochre" onClick={() => useStore.setState({ terminal: false })} aria-label="Close terminal">[esc]</button>
        </div>
        <div ref={box} className="h-64 overflow-y-auto p-3 font-mono text-[13px] leading-relaxed text-sumi" aria-live="polite">
          {lines.map((l, i) => <pre key={i} className="whitespace-pre-wrap">{l}</pre>)}
          <form onSubmit={submit} className="flex gap-2">
            <label htmlFor="term" className="text-ai">rafael@castle:~$</label>
            <input
              id="term" ref={input} value={val} autoComplete="off" spellCheck="false"
              onChange={(e) => setVal(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowUp') { const n = Math.min(hi + 1, hist.length - 1); if (hist[n] != null) { setHi(n); setVal(hist[n]); } e.preventDefault(); }
                if (e.key === 'ArrowDown') { const n = hi - 1; setHi(Math.max(n, -1)); setVal(n >= 0 ? hist[n] : ''); e.preventDefault(); }
              }}
              className="flex-1 bg-transparent font-mono outline-none"
            />
          </form>
        </div>
      </div>
    </div>
  );
}
