import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';

export const metadata = { title: 'IES Store' };

export default function StorePage() {
  return (
    <>
      <PageHero
        eyebrow="Shop"
        title="IES Store"
        description="Browse and purchase official IES branded merchandise."
      />
      <Section>
        <EmptyState
          title="Store coming soon"
          description="The IES merchandise store is coming soon. IES branded items including badges, certificates, and professional accessories will be available here."
          action={<Button href="mailto:info@iesomalia.org.so" variant="secondary" size="sm">Contact IES</Button>}
        />
      </Section>
    </>
  );
}
