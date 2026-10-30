import Link from 'next/link';

export const metadata = { title: '404 — 見張りの城' };

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <span className="hanko mb-6 h-24 w-24 text-3xl" style={{ borderRadius: '50%' }}>迷子</span>
      <h1 className="font-serif text-4xl font-extrabold">404</h1>
      <p className="mt-2 font-serif text-lg">Esta sala no existe en el castillo · This room does not exist.</p>
      <Link href="/" className="ink inkshadow mt-6 bg-ai px-4 py-2 font-serif font-bold text-washi">← 見張りの城</Link>
    </div>
  );
}
