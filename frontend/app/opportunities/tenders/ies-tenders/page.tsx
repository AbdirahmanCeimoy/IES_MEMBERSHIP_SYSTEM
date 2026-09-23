import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';

export const metadata = { title: 'IES Tenders' };

export default function IESTendersPage() {
  return (
    <>
      <PageHero
        eyebrow="Procurement"
        title="IES Tenders"
        description="Open tenders and procurement opportunities from the Institution of Engineers Somalia."
      />
      <Section>
        <EmptyState
          title="No active tenders"
          description="Current IES tenders and procurement opportunities will be listed here when available."
          action={<Button href="mailto:info@iesomalia.org.so" variant="secondary" size="sm">Contact IES</Button>}
        />
      </Section>
    </>
  );
}
