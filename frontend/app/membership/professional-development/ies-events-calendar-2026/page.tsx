import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { routes } from '@/config/routes';

export const metadata = { title: 'IES Events Calendar 2026' };

export default function IESEventsCalendar2026Page() {
  return (
    <>
      <PageHero
        breadcrumbs={
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Membership', href: routes.membership.root },
              { label: 'Professional Development', href: routes.membership.professionalDevelopment.root },
              { label: 'IES Events Calendar 2026' },
            ]}
          />
        }
        eyebrow="Professional Development"
        title="IES Events Calendar"
        description="Stay informed about upcoming events, activities, and engagements organized by the Institution of Engineers Somalia (IES)."
      />

      <Section spacing="compact">
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-col gap-4 text-sm leading-relaxed text-slate-700 sm:text-base">
            <p>
              The IES Events Calendar provides members with information on conferences, seminars, networking events, professional gatherings, special occasions, and other activities throughout the year.
            </p>
            <p>
              Check the calendar regularly to stay updated and take part in IES activities.
            </p>
          </div>

          <div className="mt-10 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#035CB3]/10">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#035CB3" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-[#022D5A]">2026 Events Calendar Coming Soon</h3>
            <p className="mt-2 max-w-md text-sm text-slate-600">
              The full 2026 events schedule will be published here. In the meantime, check our news section for the latest announcements.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
