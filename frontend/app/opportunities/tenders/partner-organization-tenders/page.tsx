import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';

export const metadata = { title: 'Partner Organization Tenders' };

export default function PartnerOrganizationTendersPage() {
  return (
    <>
      <PageHero
        eyebrow="Partner Procurement"
        title="Partner Organization Tenders"
        description="Open tenders and procurement opportunities from IES partner organizations."
      />
      <Section>
        <EmptyState
          title="No partner tenders listed"
          description="Tenders and procurement opportunities from IES partner organizations will be listed here when available."
          action={<Button href="mailto:info@iesomalia.org.so" variant="secondary" size="sm">Contact IES</Button>}
        />
      </Section>
    </>
  );
}
