import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { routes } from '@/config/routes';

export const metadata = { title: 'World Engineering Day 2026' };

export default function WED2026Page() {
  return (
    <>
      <PageHero
        eyebrow="4 March 2026"
        title="World Engineering Day 2026"
        description="IES celebration of World Engineering Day for Sustainable Development -- March 2026 edition."
      />

      <Section>
        <EmptyState
          title="World Engineering Day 2026"
          description="Event details and highlights for the 2026 edition will be available soon. Check back or contact info@iesomalia.org.so for more information."
          action={
            <Button href={routes.events.annualEvents.worldEngineeringDay.root} variant="secondary" size="sm">
              Back to World Engineering Day
            </Button>
          }
        />
      </Section>
    </>
  );
}
