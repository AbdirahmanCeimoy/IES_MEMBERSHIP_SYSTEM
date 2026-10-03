import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { routes } from '@/config/routes';
import { findSeminar, seminars } from '@/data/seminars';

interface Params {
  params: Promise<{ slug: string }>;
}

export const generateStaticParams = () =>
  seminars.filter((s) => s.video).map((s) => ({ slug: s.slug }));

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const event = findSeminar(slug);
  return { title: event ? `Video — ${event.title}` : 'Event Video' };
}

export default async function SeminarVideoPage({ params }: Params) {
  const { slug } = await params;
  const event = findSeminar(slug);
  if (!event || !event.video) notFound();

  const detailHref = `${routes.events.programmes.seminars}/${event.slug}`;

  return (
    <>
      <PageHero
        breadcrumbs={
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Events', href: routes.events.root },
              { label: 'Programmes', href: routes.events.programmes.root },
              { label: 'Seminars', href: routes.events.programmes.seminars },
              { label: event.title, href: detailHref },
              { label: 'Video' },
            ]}
          />
        }
        eyebrow="Event Video"
        title={event.title}
        description={`Recording from ${event.date}`}
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
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#48C184]/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#2d7a50]">
            Recording
          </span>
        </div>

        <article className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="relative aspect-video w-full bg-[#022D5A]">
            <video
              src={event.video}
              poster={event.heroImage}
              controls
              preload="metadata"
              className="h-full w-full"
            >
              Your browser does not support embedded video. You can
              {' '}
              <a href={event.video} className="underline">download the recording</a>
              {' '}instead.
            </video>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 p-5 sm:p-6">
            <div>
              <h2 className="text-base font-bold text-[#022D5A] sm:text-lg">{event.title}</h2>
              <p className="mt-1 text-xs text-slate-500 sm:text-sm">{event.date}</p>
            </div>
            <a
              href={event.video}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-[#022D5A] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#035CB3]"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M15 3h6v6" />
                <path d="M10 14 21 3" />
                <path d="M21 10v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8" />
              </svg>
              Open full-size
            </a>
          </div>
        </article>

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
