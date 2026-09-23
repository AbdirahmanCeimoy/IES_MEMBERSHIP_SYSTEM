import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { routes } from '@/config/routes';

export const metadata = { title: 'Other Programmes' };

export default function OtherProgrammesPage() {
  return (
    <>
      <PageHero
        eyebrow="Programmes"
        title="Other Programmes"
        description="Additional professional activities and programmes organised by the Institution of Engineers Somalia."
      />

      <Section>
        <EmptyState
          title="Other programmes"
          description="Upcoming programmes will be listed here. Check back soon or contact info@iesomalia.org.so for more information."
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
