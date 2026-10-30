import Room2D from '@/components/ui/Rooms2D';
import rooms from '@/content/rooms.json';

const room = rooms.find((r) => r.id === 'about');

export const metadata = {
  title: room.seo.title,
  description: room.seo.description,
  alternates: { canonical: room.path },
  openGraph: { title: room.seo.title, description: room.seo.description, url: room.path, images: ['/og.jpg'] },
  twitter: { title: room.seo.title, description: room.seo.description },
};

export default function Page() {
  return <Room2D id="about" />;
}
