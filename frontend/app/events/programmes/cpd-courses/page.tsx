import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';

export const metadata = { title: 'CPD Courses' };

export default function CPDCoursesPage() {
  return (
    <>
      <PageHero
        eyebrow="IES Programmes"
        title="CPD Courses"
        description="Continuing Professional Development courses designed to keep engineers aligned with emerging technologies, standards and best practices"
      />
      <Section spacing="compact">
        <p className="text-left text-xs leading-relaxed text-slate-700 sm:text-sm">
          Strengthen your professional competence through Continuing Professional Development (CPD) courses tailored to the needs of engineers.
        </p>
      </Section>
    </>
  );
}
