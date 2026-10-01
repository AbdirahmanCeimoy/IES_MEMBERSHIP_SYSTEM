import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { routes } from '@/config/routes';
import { gradeRequirements, type GradeCode } from '@/data/grade-requirements';
import { RequirementsAccordion } from './RequirementsAccordion';

export const metadata = { title: 'Membership Requirements' };

export interface RequirementItem {
  title: string;
  fee: string;
  requirements: string[];
}

// Order shown in the accordion, highest standing first.
const DISPLAY_ORDER: GradeCode[] = [
  'FELLOW',
  'SENIOR',
  'CORPORATE',
  'ASSOCIATE',
  'GRADUATE',
  'GRAD_TECHNOLOGIST',
  'GRAD_TECHNICIAN',
  'STUDENT',
];

// The canonical requirement arrays end with "Application Fee: $X." which the
// accordion already shows as a separate pill — strip it to avoid duplication.
const stripFeeLine = (items: string[]) =>
  items.filter((line) => !/^Application Fee:/i.test(line.trim()));

const individualRequirements: RequirementItem[] = DISPLAY_ORDER.map((code) => {
  const grade = gradeRequirements[code];
  return {
    title: grade.headline,
    fee: grade.applicationFee,
    requirements: stripFeeLine(grade.requirements),
  };
});

export default function RequirementsPage() {
  return (
    <>
      <PageHero
        breadcrumbs={
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Membership', href: routes.membership.root },
              { label: 'Requirements' },
            ]}
          />
        }
        eyebrow="Membership"
        title="IES Membership Application Requirements"
        description="Discover our Membership Application Requirements"
      />

      <Section spacing="compact">
        <h2 className="text-center text-2xl font-extrabold tracking-tight text-[#035CB3] sm:text-3xl">
          Join our Individual Membership
        </h2>
      </Section>

      <Section tone="muted" spacing="compact">
        <RequirementsAccordion items={individualRequirements} />
      </Section>
    </>
  );
}
