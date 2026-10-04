import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { routes } from '@/config/routes';
import { findAnnualEvent } from '@/data/annual-events';

export const metadata = { title: 'Photos — INWED 2025' };

export default function INWED2025PhotosPage() {
  const event = findAnnualEvent('international-women-engineering-day-2025');
  if (!event?.photos?.length) notFound();

  const detailHref = `${routes.events.annualEvents.internationalWomenInEngineeringDay.root}/${event.year}`;

  return (
    <>
      <PageHero
        breadcrumbs={<Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Events', href: routes.events.root }, { label: 'Annual Events', href: routes.events.annualEvents.root }, { label: 'International Women in Engineering Day', href: routes.events.annualEvents.internationalWomenInEngineeringDay.root }, { label: '2025', href: detailHref }, { label: 'Photos' }]} />}
        eyebrow="Event Photos"
        title={event.title}
        description={`${event.photos.length} photos from ${event.date}`}
      />
      <Section tone="muted">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Link href={detailHref} className="inline-flex items-center gap-2 rounded-lg border border-[#035CB3]/30 bg-white px-4 py-2 text-sm font-semibold text-[#035CB3] shadow-sm transition-colors hover:border-[#035CB3] hover:bg-[#035CB3]/5">‹ Back to View Details</Link>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 sm:text-sm">{event.photos.length} photos</span>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {event.photos.map((src, index) => (
            <a key={src} href={src} target="_blank" rel="noopener noreferrer" className="group relative block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md" aria-label={`Open photo ${index + 1} in a new tab`}>
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100"><Image src={src} alt={`${event.title} — photo ${index + 1}`} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px" className="object-cover transition-transform duration-500 group-hover:scale-[1.05]" /></div>
              <div className="flex items-center justify-between gap-3 px-4 py-3"><span className="text-xs font-semibold uppercase tracking-wider text-[#022D5A] sm:text-sm">Photo {index + 1}</span><span className="text-xs font-semibold text-[#035CB3]">Open ↗</span></div>
            </a>
          ))}
        </div>
        <div className="mt-10 flex justify-center"><Link href={detailHref} className="inline-flex items-center gap-2 rounded-lg bg-[#022D5A] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#035CB3]">‹ Back to View Details</Link></div>
      </Section>
    </>
  );
}