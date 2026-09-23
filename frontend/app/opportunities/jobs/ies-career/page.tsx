import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';

export const metadata = { title: 'IES Career' };

export default function IESCareerPage() {
  return (
    <>
      <PageHero
        eyebrow="Careers"
        title="IES Career"
        description="Explore career opportunities within the Institution of Engineers Somalia."
      />
      <Section>
        <EmptyState
          title="No openings at this time"
          description="Current IES career opportunities will be listed here when available. Check back regularly or contact info@iesomalia.org.so."
          action={<Button href="mailto:info@iesomalia.org.so" variant="secondary" size="sm">Contact IES</Button>}
        />
      </Section>
    </>
  );
}
