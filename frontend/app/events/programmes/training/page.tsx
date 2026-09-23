import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { routes } from '@/config/routes';

export const metadata = { title: 'Training' };

export default function TrainingPage() {
  return (
    <>
      <PageHero
        eyebrow="Programmes"
        title="Training"
        description="Structured training programmes offered by IES to strengthen the technical and professional capabilities of engineers."
      />

      <Section>
        <EmptyState
          title="Training programmes"
          description="Upcoming training programmes will be listed here. Check back soon or contact info@iesomalia.org.so for more information."
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
