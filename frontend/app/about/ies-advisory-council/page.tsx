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
        eyebrow="About IES"
        title="IES Advisory Council"
        description="The Advisory Council supports the IES Council with strategic guidance and independent expertise."
      />
      <Section>
        <EmptyState
          title=""
          description="IES Advisory Council is being established to provide expert guidance and support to the Institution. Information about its members will be published on this page in due course."
        />
      </Section>
    </>
  );
}
