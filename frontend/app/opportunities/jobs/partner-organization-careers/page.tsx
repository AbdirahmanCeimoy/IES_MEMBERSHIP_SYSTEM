import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';

export const metadata = { title: 'Partner Organization Careers' };

export default function PartnerOrganizationCareersPage() {
  return (
    <>
      <PageHero
        eyebrow="Partner Careers"
        title="Partner Organization Careers"
        description="Career opportunities from organizations partnering with IES."
      />
      <Section>
        <EmptyState
          title="No partner openings listed"
          description="Career opportunities from IES partner organizations will be listed here."
          action={<Button href="mailto:info@iesomalia.org.so" variant="secondary" size="sm">Contact IES</Button>}
        />
      </Section>
    </>
  );
}
