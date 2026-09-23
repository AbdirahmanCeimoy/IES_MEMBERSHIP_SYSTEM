import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { routes } from '@/config/routes';

export const metadata = { title: 'Other Annual Events' };

export default function OtherAnnualEventsPage() {
  return (
    <>
      <PageHero
        eyebrow="Annual Events"
        title="Other Annual Events"
        description="Additional annual celebrations and observances supported by the Institution of Engineers Somalia."
      />

      <Section>
        <EmptyState
          title="Other annual events"
          description="Upcoming annual events will be listed here. Check back soon or contact info@iesomalia.org.so for more information."
          action={
            <Button href={routes.events.annualEvents.root} variant="secondary" size="sm">
              Back to Annual Events
            </Button>
          }
        />
      </Section>
    </>
  );
}
