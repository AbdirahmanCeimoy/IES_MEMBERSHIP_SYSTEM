import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { routes } from '@/config/routes';

export const metadata = { title: 'Seminars' };

export default function SeminarsPage() {
  return (
    <>
      <PageHero
        eyebrow="Programmes"
        title="Seminars"
        description="Technical and professional seminars organised by IES to keep members informed on the latest engineering practices and management strategies."
      />

      <Section>
        <EmptyState
          title="Seminars"
          description="Upcoming seminars will be listed here. Check back soon or contact info@iesomalia.org.so for more information."
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
