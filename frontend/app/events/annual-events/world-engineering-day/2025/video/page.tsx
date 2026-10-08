import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { routes } from '@/config/routes';
import { findAnnualEvent } from '@/data/annual-events';

export const metadata = { title: 'Video - World Engineering Day 2025' };

export default function WED2025VideoPage() {
  const event = findAnnualEvent('world-engineering-day-2025');
  if (!event?.video) notFound();

  const detailHref = `${routes.events.annualEvents.worldEngineeringDay.root}/${event.year}`;

  return (
    <>
      <PageHero
        breadcrumbs={<Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Events', href: routes.events.root }, { label: 'Annual Events', href: routes.events.annualEvents.root }, { label: 'World Engineering Day', href: routes.events.annualEvents.worldEngineeringDay.root }, { label: '2025', href: detailHref }, { label: 'Video' }]} />}
        eyebrow="Event Video"
        title={event.title}
        description={`Recorded ${event.date}`}
      />
      <Section tone="muted">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Link href={detailHref} className="inline-flex items-center gap-2 rounded-lg border border-[#035CB3]/30 bg-white px-4 py-2 text-sm font-semibold text-[#035CB3] shadow-sm transition-colors hover:border-[#035CB3] hover:bg-[#035CB3]/5">‹ Back to View Details</Link>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#48C184]/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#2d7a50]">Event Highlights</span>
        </div>
        <article className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="relative aspect-video w-full bg-[#022D5A]"><video src={event.video} controls preload="metadata" className="h-full w-full">Your browser does not support embedded video. You can <a href={event.video} className="underline">download the recording</a> instead.</video></div>
          <div className="flex flex-wrap items-center justify-between gap-3 p-5 sm:p-6"><div><h2 className="text-base font-bold text-[#022D5A] sm:text-lg">{event.title}</h2><p className="mt-1 text-xs text-slate-500 sm:text-sm">{event.date}</p></div><a href={event.video} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg bg-[#022D5A] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#035CB3]">Open full-size ↗</a></div>
        </article>
        <div className="mt-10 flex justify-center"><Link href={detailHref} className="inline-flex items-center gap-2 rounded-lg bg-[#022D5A] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#035CB3]">‹ Back to View Details</Link></div>
      </Section>
    </>
  );
}