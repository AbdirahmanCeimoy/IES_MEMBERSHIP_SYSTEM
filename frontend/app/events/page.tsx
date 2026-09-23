import Link from 'next/link';
import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { SectionHeading } from '@/components/layout/SectionHeading';
import { Card } from '@/components/ui/Card';
import { ContentGrid } from '@/components/public/ContentGrid';
import { routes } from '@/config/routes';

export const metadata = { title: 'Events' };

const eventCategories = [
  {
    title: 'IES Annual Events',
    description: 'Flagship events celebrated by the Institution each year, including World Engineering Day and International Women in Engineering Day.',
    href: routes.events.annualEvents.root,
  },
  {
    title: 'IES Programmes',
    description: 'Seminars, training programmes, conferences, CPD courses and other professional activities organised by the Institution.',
    href: routes.events.programmes.root,
  },
];

export default function EventsPage() {
  return (
    <>
      <PageHero
        eyebrow="Events"
        title="IES Events & Programmes"
        description="Explore the Institution's calendar of annual celebrations, professional programmes and technical activities."
      />

      <Section>
        <SectionHeading eyebrow="Explore" title="Event categories" />
        <ContentGrid columns={2} className="mt-6">
          {eventCategories.map((cat) => (
            <Card key={cat.href} padded interactive>
              <Link href={cat.href} className="flex flex-col gap-1">
                <h3 className="text-sm font-semibold text-[#022D5A]">{cat.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{cat.description}</p>
                <span className="mt-3 text-xs font-semibold text-[#035CB3]">Explore ›</span>
              </Link>
            </Card>
          ))}
        </ContentGrid>
      </Section>
    </>
  );
}
