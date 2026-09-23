import Link from 'next/link';
import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { SectionHeading } from '@/components/layout/SectionHeading';
import { Card } from '@/components/ui/Card';
import { ContentGrid } from '@/components/public/ContentGrid';
import { routes } from '@/config/routes';

export const metadata = { title: 'Annual Events' };

const annualEvents = [
  {
    title: 'World Engineering Day',
    description: 'Celebrated on 4 March each year to promote engineering excellence and sustainable development.',
    href: routes.events.annualEvents.worldEngineeringDay.root,
  },
  {
    title: 'International Women in Engineering Day',
    description: 'Celebrated on 23 June each year to recognise and promote the contributions of women in engineering.',
    href: routes.events.annualEvents.internationalWomenInEngineeringDay.root,
  },
  {
    title: 'Other Annual Events',
    description: 'Additional annual celebrations and observances supported by the Institution.',
    href: routes.events.annualEvents.others,
  },
];

export default function AnnualEventsPage() {
  return (
    <>
      <PageHero
        eyebrow="Annual Events"
        title="IES Annual Events"
        description="Flagship events and international observances celebrated by the Institution of Engineers Somalia each year."
      />

      <Section>
        <SectionHeading eyebrow="Calendar" title="Annual celebrations" />
        <ContentGrid columns={3} className="mt-6">
          {annualEvents.map((event) => (
            <Card key={event.href} padded interactive>
              <Link href={event.href} className="flex flex-col gap-1">
                <h3 className="text-sm font-semibold text-[#022D5A]">{event.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{event.description}</p>
                <span className="mt-3 text-xs font-semibold text-[#035CB3]">View details ›</span>
              </Link>
            </Card>
          ))}
        </ContentGrid>
      </Section>
    </>
  );
}
