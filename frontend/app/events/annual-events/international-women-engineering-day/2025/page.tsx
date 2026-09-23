import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { routes } from '@/config/routes';

export const metadata = { title: 'INWED 2025' };

export default function INWED2025Page() {
  return (
    <>
      <PageHero
        eyebrow="23 June 2025"
        title="International Women in Engineering Day 2025"
        description="IES celebration of International Women in Engineering Day -- June 2025 edition."
      />

      <Section>
        <EmptyState
          title="INWED 2025"
          description="Event details and highlights for the 2025 edition will be available soon. Check back or contact info@iesomalia.org.so for more information."
          action={
            <Button href={routes.events.annualEvents.internationalWomenInEngineeringDay.root} variant="secondary" size="sm">
              Back to INWED
            </Button>
          }
        />
      </Section>
    </>
  );
}
