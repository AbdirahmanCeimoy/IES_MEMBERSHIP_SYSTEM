import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { EmptyState } from '@/components/ui/EmptyState';
import { routes } from '@/config/routes';

export const metadata = { title: 'Advisory Council' };

export default function AdvisoryCouncilPage() {
  return (
    <>
      <PageHero
        breadcrumbs={<Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'About', href: routes.about.root }, { label: 'Advisory Council' }]} />}
        eyebrow="Governance"
        title="IES Advisory Council"
        description="The Advisory Council supports the IES Council with strategic guidance and independent expertise."
      />
      <Section>
        <EmptyState
          title="Advisory Council roster pending"
          description="IES DECISION REQUIRED - the composition, roles and biographies of the Advisory Council will appear here once confirmed by the Institution."
        />
      </Section>
    </>
  );
}
