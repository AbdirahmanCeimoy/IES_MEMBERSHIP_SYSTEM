import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { routes } from '@/config/routes';

export const metadata = { title: 'CPD Courses' };

export default function CPDCoursesPage() {
  return (
    <>
      <PageHero
        eyebrow="Programmes"
        title="CPD Courses"
        description="Continuing Professional Development courses designed to keep engineers aligned with emerging technologies, standards and best practices."
      />

      <Section>
        <EmptyState
          title="CPD courses"
          description="Upcoming CPD courses will be listed here. Check back soon or contact info@iesomalia.org.so for more information."
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
