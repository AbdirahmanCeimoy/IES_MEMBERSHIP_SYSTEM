import Link from 'next/link';
import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { SectionHeading } from '@/components/layout/SectionHeading';
import { Card } from '@/components/ui/Card';
import { ContentGrid } from '@/components/public/ContentGrid';
import { routes } from '@/config/routes';

export const metadata = { title: 'International Women in Engineering Day' };

const editions = [
  {
    title: 'INWED 2025',
    description: 'IES celebration of International Women in Engineering Day, June 2025.',
    href: routes.events.annualEvents.internationalWomenInEngineeringDay.year2025,
  },
  {
    title: 'INWED 2026',
    description: 'IES celebration of International Women in Engineering Day, June 2026.',
    href: routes.events.annualEvents.internationalWomenInEngineeringDay.year2026,
  },
];

export default function INWEDPage() {
  return (
    <>
      <PageHero
        eyebrow="Annual Event"
        title="International Women in Engineering Day"
        description="International Women in Engineering Day (INWED) is celebrated on 23 June each year. IES marks this occasion to recognise and promote the outstanding contributions of women to engineering in Somalia and beyond."
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
