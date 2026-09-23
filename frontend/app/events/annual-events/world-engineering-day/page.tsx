import Link from 'next/link';
import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { SectionHeading } from '@/components/layout/SectionHeading';
import { Card } from '@/components/ui/Card';
import { ContentGrid } from '@/components/public/ContentGrid';
import { routes } from '@/config/routes';

export const metadata = { title: 'World Engineering Day' };

const editions = [
  {
    title: 'World Engineering Day 2025',
    description: 'IES celebration of World Engineering Day for Sustainable Development, March 2025.',
    href: routes.events.annualEvents.worldEngineeringDay.year2025,
  },
  {
    title: 'World Engineering Day 2026',
    description: 'IES celebration of World Engineering Day for Sustainable Development, March 2026.',
    href: routes.events.annualEvents.worldEngineeringDay.year2026,
  },
];

export default function WorldEngineeringDayPage() {
  return (
    <>
      <PageHero
        eyebrow="Annual Event"
        title="World Engineering Day"
        description="World Engineering Day for Sustainable Development is celebrated on 4 March each year. IES marks this occasion to promote engineering excellence and sustainable development in Somalia."
      />

      <Section>
        <SectionHeading eyebrow="Editions" title="Past and upcoming celebrations" />
        <ContentGrid columns={2} className="mt-6">
          {editions.map((edition) => (
            <Card key={edition.href} padded interactive>
              <Link href={edition.href} className="flex flex-col gap-1">
                <h3 className="text-sm font-semibold text-[#022D5A]">{edition.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{edition.description}</p>
                <span className="mt-3 text-xs font-semibold text-[#035CB3]">View details ›</span>
              </Link>
            </Card>
          ))}
        </ContentGrid>
      </Section>
    </>
  );
}
