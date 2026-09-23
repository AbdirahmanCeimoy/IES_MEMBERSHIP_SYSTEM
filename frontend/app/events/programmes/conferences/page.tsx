import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { routes } from '@/config/routes';

export const metadata = { title: 'Conferences' };

export default function ConferencesPage() {
  return (
    <>
      <PageHero
        eyebrow="Programmes"
        title="Conferences"
        description="National and international engineering conferences hosted or supported by the Institution of Engineers Somalia."
      />

      <Section>
        <EmptyState
          title="Conferences"
          description="Upcoming conferences will be listed here. Check back soon or contact info@iesomalia.org.so for more information."
          action={
            <Button href={routes.events.programmes.root} variant="secondary" size="sm">
              Back to Programmes
            </Button>
          }
        />
      </Section>
    </>
  );
}
