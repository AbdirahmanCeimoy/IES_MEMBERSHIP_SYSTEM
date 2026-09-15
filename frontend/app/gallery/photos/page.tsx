import Image from 'next/image';
import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Badge } from '@/components/ui/Badge';
import { routes } from '@/config/routes';

export const metadata = { title: 'Gallery - Photos' };

const galleryPhotos = [
  { id: 1, src: '/picture-1.jpg', title: 'Leadership and Official Engagement', category: 'Official Event' },
  { id: 2, src: '/picture-2.jpg', title: 'Professional Participation', category: 'Member Activity' },
  { id: 3, src: '/picture-3.jpg', title: 'Engineering Community Presence', category: 'Community' },
  { id: 4, src: '/picture-4.jpg', title: 'Institutional Gathering', category: 'Meeting' },
  { id: 5, src: '/picture-5.jpg', title: 'Program Highlights', category: 'Program' },
  { id: 6, src: '/picture-6.jpg', title: 'Member Representation', category: 'Members' },
  { id: 7, src: '/picture-7.jpg', title: 'Field and Event Documentation', category: 'Documentation' },
  { id: 8, src: '/picture-8.jpg', title: 'Gallery Archive Selection', category: 'Archive' },
  { id: 9, src: '/picture-9.jpg', title: 'Institutional Showcase', category: 'Showcase' },
  { id: 10, src: '/picture-10.jpg', title: 'Featured Closing Image', category: 'Featured' },
];

export default function GalleryPhotosPage() {
  return (
    <>
      <PageHero
        breadcrumbs={<Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Gallery', href: routes.gallery.root }, { label: 'Photos' }]} />}
        eyebrow="Photography"
        title="Gallery - Photos"
        description="Curated visual highlights from IES events and activities."
      />
      <Section>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {galleryPhotos.map((p, i) => (
            <figure
              key={p.id}
              className="group overflow-hidden rounded-lg border border-slate-200 bg-white"
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={p.src}
                  alt={p.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  priority={i < 3}
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <figcaption className="flex items-center justify-between gap-2 border-t border-slate-100 px-3 py-2">
                <p className="text-sm font-medium text-[#082B55]">{p.title}</p>
                <Badge tone="muted">{p.category}</Badge>
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>
    </>
  );
}
