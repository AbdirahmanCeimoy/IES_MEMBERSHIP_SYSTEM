import Image from 'next/image';
import Link from 'next/link';
import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { seminars, type SeminarEvent } from '@/data/seminars';

export const metadata = { title: 'Seminars' };

const groupByMonth = (events: SeminarEvent[]) => {
  const groups: Record<string, SeminarEvent[]> = {};
  for (const e of events) {
    (groups[e.monthYear] ||= []).push(e);
  }
  return Object.entries(groups);
};

const CalendarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const PinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const CameraIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

const PastEventCard = ({ event }: { event: SeminarEvent }) => {
  const detailHref = `/events/programmes/seminars/${event.slug}`;
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <Link href={detailHref} className="relative block aspect-[4/5] w-full overflow-hidden bg-slate-50">
        <Image
          src={event.cardImage}
          alt={event.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 420px"
          className="object-contain transition-transform duration-500 group-hover:scale-[1.02]"
        />
      </Link>

      <div className="relative flex flex-1 flex-col p-5 pt-10 sm:p-6 sm:pt-12">
        <div className="absolute left-5 top-0 flex h-16 w-16 -translate-y-1/2 items-center justify-center rounded-xl bg-white text-2xl font-extrabold text-[#022D5A] shadow-md ring-1 ring-slate-200 sm:left-6">
          {event.day}
        </div>

        <span className="absolute right-5 top-5 inline-flex items-center rounded-full bg-[#48C184]/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#2d7a50] sm:right-6">
          {event.category}
        </span>

        <h3 className="text-base font-bold leading-snug text-[#022D5A] sm:text-lg">
          <Link href={detailHref} className="hover:text-[#035CB3]">
            {event.title}
          </Link>
        </h3>

        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600">
          {event.cardDescription}
        </p>

        <dl className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500 sm:text-sm">
          <div className="flex items-center gap-1.5">
            <CalendarIcon />
            <span>{event.date}</span>
          </div>
          {event.time && (
            <div className="flex items-center gap-1.5">
              <ClockIcon />
              <span>{event.time}</span>
            </div>
          )}
          {event.venue && (
            <div className="flex items-center gap-1.5">
              <PinIcon />
              <span>{event.venue}</span>
            </div>
          )}
        </dl>

        <div className="mt-5 flex items-center justify-between gap-3">
          <Link href={detailHref} className="text-sm font-semibold text-[#035CB3] hover:text-[#022D5A]">
            View Details
          </Link>
          <Link
            href={`${detailHref}#event-photos`}
            className="inline-flex items-center gap-2 rounded-lg bg-[#022D5A] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#035CB3]"
            aria-label={`View photos from ${event.title}`}
          >
            <CameraIcon />
            View Photos
          </Link>
        </div>
      </div>
    </article>
  );
};

export default function SeminarsPage() {
  const grouped = groupByMonth(seminars);

  return (
    <>
      <PageHero
        eyebrow="IES Programmes"
        title="Seminars"
        description="Technical and professional seminars organised by IES to keep members informed about the latest engineering practices, technologies, and professional developments"
      />

      <Section spacing="compact">
        <h2 className="text-xl font-bold text-[#022D5A] sm:text-2xl">Upcoming Seminars</h2>
        <p className="mt-3 text-left text-xs leading-relaxed text-slate-700 sm:text-sm">
          Stay informed and expand your knowledge through seminars featuring technical presentations, expert discussions, and industry insights.
        </p>
      </Section>

      <Section tone="muted">
        <h2 className="text-xl font-bold text-[#022D5A] sm:text-2xl">Past Events</h2>

        <div className="mt-6 space-y-10">
          {grouped.map(([month, events]) => (
            <div key={month}>
              <div className="mb-4 flex items-center gap-4">
                <h3 className="text-lg font-bold text-[#022D5A] sm:text-xl">{month}</h3>
                <span className="h-px flex-1 bg-slate-200" />
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {events.map((event) => (
                  <PastEventCard key={event.slug} event={event} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
