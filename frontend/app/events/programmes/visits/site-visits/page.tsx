import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';

export const metadata = { title: 'Site Visits' };

export default function SiteVisitsPage() {
  return (
    <>
      <PageHero
        eyebrow="IES Programmes"
        title="Site Visit"
        description="Organised site visits to engineering projects and facilities"
      />
      <Section spacing="compact">
        <p className="text-left text-xs leading-relaxed text-slate-700 sm:text-sm">
          Gain practical experience and enhance your understanding of engineering projects through organized site visits.
        </p>
      </Section>
    </>
  );
}
