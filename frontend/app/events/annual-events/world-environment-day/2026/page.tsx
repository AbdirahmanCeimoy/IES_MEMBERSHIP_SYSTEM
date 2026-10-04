import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { routes } from '@/config/routes';
import { findAnnualEvent } from '@/data/annual-events';

export const metadata = { title: 'World Environment Day Celebration 2026' };

const Icon = ({ children }: { children: React.ReactNode }) => (
  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#035CB3]/10 text-[#035CB3]">
    {children}
  </span>
);

export default function WorldEnvironmentDay2026Page() {
  const event = findAnnualEvent('world-environment-day-2026');
  if (!event) notFound();

  const base = `${routes.events.annualEvents.worldEnvironmentDay.root}/${event.year}`;
  const hasPhotos = !!event.photos && event.photos.length > 0;
  const hasVideo = !!event.video;

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
              { label: '2026' },
            ]}
          />
        }
        eyebrow="World Environment Day"
        title={event.title}
        description={event.date}
      />

      <Section tone="muted">
        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          <div className="min-w-0">
            <span className="inline-flex items-center rounded-full bg-[#035CB3]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#035CB3]">
              {event.category}
            </span>

            <h1 className="mt-4 text-2xl font-bold tracking-tight text-[#022D5A] sm:text-3xl">
              {event.title}
            </h1>

            <div className="mt-5 space-y-4 text-sm leading-relaxed text-slate-700 sm:text-base">
              {event.fullDescription.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            <div className="relative mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">
              <Image
                src={event.heroImage}
                alt={event.title}
                width={1600}
                height={2000}
                sizes="(max-width: 1024px) 100vw, 760px"
                className="h-auto w-full object-contain"
                priority
              />
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-base font-bold text-[#022D5A] sm:text-lg">Event Details</h2>

              <dl className="mt-5 space-y-5 text-sm">
                <div className="flex items-start gap-3">
                  <Icon>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  </Icon>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">Date</dt>
                    <dd className="mt-0.5 font-medium text-[#022D5A]">{event.date}</dd>
                  </div>
                </div>

                {event.time && (
                  <div className="flex items-start gap-3">
                    <Icon>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                    </Icon>
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">Time</dt>
                      <dd className="mt-0.5 font-medium text-[#022D5A]">{event.time}</dd>
                    </div>
                  </div>
                )}

                {event.venue && (
                  <div className="flex items-start gap-3">
                    <Icon>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </Icon>
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">Location</dt>
                      <dd className="mt-0.5 font-medium text-[#022D5A]">{event.venue}</dd>
                    </div>
                  </div>
                )}
              </dl>

              <div className="mt-6 space-y-3">
                {event.concluded && (
                  <span className="flex w-full items-center justify-center rounded-lg bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-500">
                    Event Concluded
                  </span>
                )}

                {hasPhotos && (
                  <Link
                    href={`${base}/photos`}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#022D5A] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#035CB3]"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                      <circle cx="12" cy="13" r="4" />
                    </svg>
                    View Photos
                  </Link>
                )}

                {hasVideo && (
                  <Link
                    href={`${base}/video`}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#48C184] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#2d7a50]"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    View Video
                  </Link>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
              <h3 className="text-sm font-bold text-[#022D5A] sm:text-base">Have Questions?</h3>
              <p className="mt-1.5 text-xs text-slate-500 sm:text-sm">
                Contact our events team for support.
              </p>
              {event.contactEmail && (
                <a
                  href={`mailto:${event.contactEmail}`}
                  className="mt-3 inline-block text-sm font-semibold text-[#035CB3] hover:text-[#022D5A]"
                >
                  {event.contactEmail}
                </a>
              )}
              {event.contactName && (
                <p className="mt-1 text-xs text-slate-400">{event.contactName}</p>
              )}
            </div>

            <Link
              href={routes.events.annualEvents.worldEnvironmentDay.root}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#035CB3] hover:text-[#022D5A]"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Back to World Environment Day
            </Link>
          </aside>
        </div>
      </Section>
    </>
  );
}
