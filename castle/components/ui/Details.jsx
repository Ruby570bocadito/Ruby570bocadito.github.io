'use client';
import { useState } from 'react';
import { useStore } from '@/lib/store';
import { useT, pick } from '@/lib/i18n';
import { Hanko, ExtLink } from './bits';
import profile from '@/content/profile.json';
import certs from '@/content/certs.json';

/** Ficha de proyecto como grabado: kanji en bloque índigo, métricas, stack, enlaces. */
export function ProjectDetail({ p, headingLevel = 2 }) {
  const t = useT();
  const lang = useStore((s) => s.lang);
  const H = `h${headingLevel}`;
  return (
    <article className="grid md:grid-cols-[minmax(200px,0.8fr)_1.6fr]">
      <div className="bokashi-dusk relative flex min-h-56 flex-col items-center justify-center border-b-[3px] border-sumi p-6 md:border-b-0 md:border-r-[3px]">
        <span className="font-serif text-[7rem] leading-none font-extrabold text-washi drop-shadow-[4px_4px_0_#1A1A1A]" aria-hidden="true">{p.kanji}</span>
        <Hanko className="absolute bottom-4 right-4 text-sm">{p.featured ? '注目' : '作品'}</Hanko>
      </div>
      <div className="p-6 md:p-8">
        {p.band ? <p className="ink mb-3 inline-block bg-ochre px-2 py-0.5 text-xs font-bold uppercase tracking-wider">{p.band}</p> : null}
        <H className="font-serif text-3xl font-extrabold md:text-4xl">{p.name} {p.badge ? <span className="align-middle font-mono text-sm font-normal text-sumi/60">{p.badge}</span> : null}</H>
        <p className="mt-1 font-serif text-lg text-ai">{pick(p.tagline, lang)}</p>
        <p className="mt-4 leading-relaxed">{pick(p.description, lang)}</p>
        <h3 className="mt-6 font-serif text-sm font-bold uppercase tracking-widest text-sumi/70">{t('metrics')}</h3>
        <dl className="mt-2 grid grid-cols-2 gap-3">
          {p.metrics.map((m, i) => (
            <div key={i} className="ink bg-washi-dark/50 p-3">
              <dt className="sr-only">{pick(m.label, lang)}</dt>
              <dd className="font-serif text-3xl font-extrabold text-ai">{m.value}</dd>
              <dd className="text-sm">{pick(m.label, lang)}</dd>
            </div>
          ))}
        </dl>
        <h3 className="mt-6 font-serif text-sm font-bold uppercase tracking-widest text-sumi/70">{t('stack')}</h3>
        <ul className="mt-2 flex flex-wrap gap-2">{p.stack.map((s) => <li key={s}><Hanko outline size="text-xs">{s}</Hanko></li>)}</ul>
        <div className="mt-6 flex flex-wrap gap-3">
          {p.github ? <ExtLink href={p.github}>GitHub ↗</ExtLink> : null}
          {p.demo ? <ExtLink href={p.demo} className="bg-pine">{t('demo')} ↗</ExtLink> : <span className="self-center text-sm text-sumi/60">{t('noDemo')}</span>}
        </div>
      </div>
    </article>
  );
}

export function CertDetail({ c }) {
  const lang = useStore((s) => s.lang);
  const st = certs.statuses[c.status];
  return (
    <div className="flex flex-col items-center p-6 pt-14 text-center">
      <div className="wood h-3 w-full max-w-sm rounded-full border-2 border-sumi" />
      <div className="washi mx-auto w-full max-w-sm border-x-2 border-sumi px-6 py-8">
        <span className="hanko stamp-in mb-4 h-20 w-20 text-xl" style={{ borderRadius: '50%' }}>{c.seal || st.seal}</span>
        <h2 className="font-serif text-2xl font-extrabold">{c.title}</h2>
        {c.org ? <p className="mt-1 text-ai">{c.org}</p> : null}
        {c.subtitle ? <p className="mt-1 font-serif text-lg text-ai">{pick(c.subtitle, lang)}</p> : null}
        <p className="mt-4 leading-relaxed">{pick(c.note, lang)}</p>
        <p className="mt-4 font-serif text-sm font-bold">{st.seal} · {pick(st, lang)}</p>
      </div>
      <div className="wood h-4 w-full max-w-sm rounded-full border-2 border-sumi" />
    </div>
  );
}

export function KuraDetail({ k }) {
  const t = useT();
  const lang = useStore((s) => s.lang);
  return (
    <article className="p-6 pt-14 md:p-8">
      <div className="flex items-baseline gap-3">
        <span className="font-serif text-5xl font-extrabold text-ai" aria-hidden="true">{k.kanji}</span>
        <h2 className="font-serif text-3xl font-extrabold">{k.name}</h2>
      </div>
      <p className="mt-2 font-serif text-lg text-ai">{pick(k.tagline, lang)}</p>
      {k.image ? <img src={k.image} alt={`${k.name} — screenshot`} loading="lazy" className="ink mt-4 w-full" /> : null}
      <h3 className="mt-4 font-serif text-sm font-bold uppercase tracking-widest text-sumi/70">{t('learned')}</h3>
      <p className="mt-1 leading-relaxed">{pick(k.lesson, lang)}</p>
      <ul className="mt-4 flex flex-wrap gap-2">{k.stack.map((s) => <li key={s}><Hanko outline size="text-xs">{s}</Hanko></li>)}</ul>
      <div className="mt-6"><ExtLink href={k.github}>GitHub ↗</ExtLink></div>
    </article>
  );
}

/** Formulario en forma de carta doblada: abre el cliente de correo con la carta lista. */
export function LetterForm({ onSent }) {
  const t = useT();
  const [f, setF] = useState({ name: '', email: '', msg: '' });
  const [err, setErr] = useState('');
  const [folded, setFolded] = useState(false);
  const submit = (e) => {
    e.preventDefault();
    if (!f.name.trim() || !f.email.trim() || !f.msg.trim()) return setErr(t('required'));
    setErr('');
    setFolded(true);
    useStore.getState().award('contact');
    const body = `${f.msg}\n\n— ${f.name} (${f.email})`;
    setTimeout(() => {
      window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent('Portfolio — ' + f.name)}&body=${encodeURIComponent(body)}`;
      onSent?.();
    }, 700);
  };
  const field = 'mt-1 w-full border-b-2 border-sumi/60 bg-transparent px-1 py-1.5 font-serif outline-none focus:border-ai';
  return (
    <form
      onSubmit={submit}
      className="washi relative mx-auto max-w-lg p-6 transition-transform duration-700"
      style={{
        transform: folded ? 'perspective(900px) rotateX(70deg) scale(.6)' : 'none',
        backgroundImage: 'repeating-linear-gradient(90deg, transparent 0 46px, rgba(31,58,95,.12) 46px 48px)',
        boxShadow: 'inset 0 0 0 2px #1A1A1A',
      }}
      noValidate
    >
      <p className="mb-4 font-serif text-xl font-extrabold">✉ {t('sendMsg')}</p>
      <label className="block font-serif text-sm font-bold">{t('name')}<input className={field} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} autoComplete="name" required /></label>
      <label className="mt-3 block font-serif text-sm font-bold">{t('yourEmail')}<input type="email" className={field} value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} autoComplete="email" required /></label>
      <label className="mt-3 block font-serif text-sm font-bold">{t('message')}<textarea rows={5} className={field + ' resize-none'} value={f.msg} onChange={(e) => setF({ ...f, msg: e.target.value })} required /></label>
      {err ? <p className="mt-3 font-bold text-shu" role="alert">⚠ {err}</p> : null}
      <div className="mt-5 flex items-center justify-between gap-3">
        <span className="text-xs text-sumi/60">{t('letterNote')}</span>
        <button className="ink inkshadow bg-ai px-4 py-2 font-serif font-bold text-washi hover:-translate-y-0.5">{t('send')} →</button>
      </div>
    </form>
  );
}
