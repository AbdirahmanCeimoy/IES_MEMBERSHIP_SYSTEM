import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { SectionHeading } from '@/components/layout/SectionHeading';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { EmptyState } from '@/components/ui/EmptyState';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ContentGrid } from '@/components/public/ContentGrid';

export const metadata = { title: 'Events Calendar' };

const annualEvents = [
  { title: 'World Engineering Day (WED)', body: 'Global celebration of engineering, marked each year by IES with technical sessions and awareness activities.' },
  { title: 'International Women in Engineering Day (INWED)', body: 'Annual day recognising and encouraging women engineers in Somalia and the region.' },
  { title: 'Annual General Meeting (AGM)', body: 'The Institution\'s annual gathering for members to review the year and elect leadership.' },
];

export default function EventsPage() {
  return (
    <>
      <PageHero
        breadcrumbs={<Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Professional Development', href: '/professional-development' }, { label: 'Events' }]} />}
        eyebrow="Calendar"
        title="IES Events Calendar"
        description="Annual and ad-hoc events, conferences, seminars and technical forums organized by the Institution of Engineers of Somalia."
      />

      <Section>
        <SectionHeading eyebrow="Annual events" title="Recurring institutional events" />
        <ContentGrid columns={3} className="mt-6">
          {annualEvents.map((e) => (
            <Card key={e.title} padded>
              <Badge tone="primary" className="mb-2">Annual</Badge>
              <h3 className="text-sm font-semibold text-[#022D5A]">{e.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{e.body}</p>
            </Card>
          ))}
        </ContentGrid>
      </Section>

      <Section tone="muted">
        <SectionHeading eyebrow="2026 calendar" title="Upcoming events" />
        <div className="mt-6">
          <EmptyState
            title="Live event calendar coming soon"
            description="IES DECISION REQUIRED - the 2026 detailed calendar will be published here as dates are confirmed."
          />
        </div>
      </Section>
    </>
  );
}
