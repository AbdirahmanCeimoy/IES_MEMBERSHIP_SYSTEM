import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { routes } from '@/config/routes';
import { findAnnualEvent } from '@/data/annual-events';

export const metadata = { title: 'Photos - World Environment Day Celebration 2026' };

export default function WorldEnvironmentDay2026PhotosPage() {
  const event = findAnnualEvent('world-environment-day-2026');
  if (!event || !event.photos || event.photos.length === 0) notFound();

  const detailHref = `${routes.events.annualEvents.worldEnvironmentDay.root}/${event.year}`;
  const total = event.photos.length;

  return (
    <>
      <PageHero
        breadcrumbs={
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Events', href: routes.events.root },
              { label: 'Annual Events', href: routes.events.annualEvents.root },
              { label: 'World Environment Day', href: routes.events.annualEvents.worldEnvironmentDay.root },
              { label: '2026', href: detailHref },
              { label: 'Photos' },
            ]}
          />
        }
        eyebrow="Event Photos"
        title={event.title}
        description={`${total} photos from ${event.date}`}
      />

      <Section tone="muted">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Link
            href={detailHref}
            className="inline-flex items-center gap-2 rounded-lg border border-[#035CB3]/30 bg-white px-4 py-2 text-sm font-semibold text-[#035CB3] shadow-sm transition-colors hover:border-[#035CB3] hover:bg-[#035CB3]/5"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back to View Details
          </Link>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 sm:text-sm">
            {total} photos
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {event.photos.map((src, i) => (
            <a
              key={src}
              href={src}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
              aria-label={`Open photo ${i + 1} in a new tab`}
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                <Image
                  src={src}
                  alt={`${event.title} - photo ${i + 1}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                />
                <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#022D5A]/70 via-[#022D5A]/0 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
              <div className="flex items-center justify-between gap-3 px-4 py-3">
                <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#022D5A] sm:text-sm">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#035CB3]/10 text-[#035CB3]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  Photo {i + 1}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#48C184]/15 px-2.5 py-0.5 text-[11px] font-semibold text-[#2d7a50]">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M15 3h6v6" />
                    <path d="M10 14 21 3" />
                    <path d="M21 10v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8" />
                  </svg>
                  Open
                </span>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href={detailHref}
            className="inline-flex items-center gap-2 rounded-lg bg-[#022D5A] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#035CB3]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back to View Details
          </Link>
        </div>
      </Section>
    </>
  );
}
