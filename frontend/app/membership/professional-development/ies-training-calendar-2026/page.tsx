import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { routes } from '@/config/routes';

export const metadata = { title: 'IES Training Calendar 2026' };

export default function IESTrainingCalendar2026Page() {
  return (
    <>
      <PageHero
        breadcrumbs={
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Membership', href: routes.membership.root },
              { label: 'Professional Development', href: routes.membership.professionalDevelopment.root },
              { label: 'IES Training Calendar 2026' },
            ]}
          />
        }
        eyebrow="Professional Development"
        title="IES Training Calendar"
        description="Advance your knowledge and professional skills with training opportunities offered by IES"
      />

      <Section spacing="compact">
        <div className="flex flex-col gap-3 text-left text-xs leading-relaxed text-slate-700 sm:text-sm">
          <p>
            The IES Training Calendar provides members with information on upcoming technical trainings, professional development programmes, workshops, short courses, and other learning opportunities.
          </p>
          <p>
            Explore upcoming training opportunities and continue developing your professional skills with IES.
          </p>
        </div>

        <div className="mt-10 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#48C184]/15">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3AA870" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
          </div>
          <h3 className="text-base font-bold text-[#022D5A]">2026 Training Calendar Coming Soon</h3>
          <p className="mt-2 max-w-md text-sm text-slate-600">
            The full 2026 training programme will be published here. In the meantime, check our news section for the latest announcements.
          </p>
        </div>
      </Section>
    </>
  );
}
