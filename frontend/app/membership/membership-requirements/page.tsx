import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { routes } from '@/config/routes';
import { RequirementsAccordion } from './RequirementsAccordion';

export const metadata = { title: 'Membership Requirements' };

export interface RequirementItem {
  title: string;
  fee: string;
  requirements: string[];
}

const individualRequirements: RequirementItem[] = [
  {
    title: 'Requirements for Fellow Member Application',
    fee: '$50',
    requirements: [
      'Updated Curriculum Vitae (CV).',
      'ID Copy certified by Commissioner for Oaths (NB: not advocates).',
      'Copy of relevant engineering degree, professional qualification, or other recognized engineering qualifications.',
      'Four Referees: Two proposers and two seconders who are paid up Fellows (Your application must be supported by two existing IES members).',
      'At least seven (7) years of Corporate Membership with IES, or equivalent professional standing as determined by IES.',
      'At least fifteen (15) years of relevant professional engineering experience.',
      'Demonstration of active involvement in IES activities.',
      'Demonstration of Corporate Social Responsibility activities (engineering in nature).',
      'Short Bio Data describing IES and Corporate Social Responsibility (CSR) involvement.',
      'Current Colored Passport Photo.',
    ],
  },
  {
    title: 'Requirements for Senior Member Application',
    fee: '$30',
    requirements: [
      'Updated Curriculum Vitae (CV).',
      'ID Copy certified by Commissioner for Oaths (NB: not advocates).',
      'Copy of relevant engineering degree, professional qualification, or other recognized engineering qualifications.',
      'Four Referees: Two proposers and two seconders who are paid up Fellows (Your application must be supported by two existing IES members).',
      'At least ten (10) years of relevant professional engineering experience.',
      'At least five (5) years of Corporate Membership with IES, or equivalent professional standing as determined by IES.',
      'Demonstration of active involvement in IES activities.',
      'Demonstration of Corporate Social Responsibility activities (engineering in nature).',
      'Short Bio Data describing IES and Corporate Social Responsibility (CSR) involvement.',
      'Current colored Passport Photo.',
    ],
  },
  {
    title: 'Requirements for Corporate Member Application',
    fee: '$20',
    requirements: [
      'Updated Curriculum Vitae (CV).',
      'ID Copy certified by Commissioner for Oaths (NB: not advocates).',
      'A Copy of IES Graduate Certificate.',
      'At least 3 years of relevant experience as a Graduate Member.',
      'Four referees: Two proposers and two seconders who are paid Corporate or Fellow members (Your application must be supported by two existing IES members).',
      'Current Colored Passport Photo.',
    ],
  },
  {
    title: 'Requirements for Associate Member Application',
    fee: '$20',
    requirements: [
      'Updated Curriculum Vitae (CV).',
      'A Copy of your Higher National Diploma Certificate certified by Commissioner for Oaths (NB: not advocates).',
      'ID Copy certified by Commissioner for Oaths (NB: not advocates).',
      'A copy of your secondary school completion certificate certified by Commissioner for Oaths (NB: not advocates).',
      'A Copy of IES Graduate Certificate.',
      'At least 2 years of relevant experience as a Graduate Member.',
      'Four referees: Two proposers and two seconders who are paid Corporate or Fellow members (Your application must be supported by two existing IES members).',
      'Current Colored Passport Photo.',
    ],
  },
  {
    title: 'Requirements for Graduate Member Application',
    fee: '$10',
    requirements: [
      'Updated Curriculum Vitae (CV).',
      'Degree certificate certified by Commissioner for Oaths (NB: not advocates).',
      'ID Copy certified by Commissioner for Oaths (NB: not advocates).',
      'A copy of your Secondary School Completion Certificate Certified by Commissioner for Oaths (NB: not advocates).',
      'Two referees: One proposer and one seconder must be paid up Corporate or Fellow Members (Your application must be supported by two existing IES Members).',
      'Current Colored Passport Photo.',
    ],
  },
  {
    title: 'Requirements for Graduate Engineering Technologist Application',
    fee: '$10',
    requirements: [
      'Updated Curriculum Vitae (CV).',
      'Degree certificate certified by Commissioner for Oaths (NB: not advocates).',
      'ID Copy certified by Commissioner for Oaths (NB: not advocates).',
      'A copy of your secondary school completion certificate certified by Commissioner for Oaths (NB: not advocates).',
      'Two referees: One proposer and one seconder must be paid up Corporate or Fellow members (Your application must be supported by two existing IES members).',
      'Current Colored Passport Photo.',
    ],
  },
  {
    title: 'Requirements for Graduate Engineering Technician Application',
    fee: '$10',
    requirements: [
      'Updated Curriculum Vitae (CV).',
      'Degree certificate certified by Commissioner for Oaths (NB: not advocates).',
      'ID Copy certified by Commissioner for Oaths (NB: not advocates).',
      'A copy of your secondary school completion certificate certified by Commissioner for Oaths (NB: not advocates).',
      'Two referees: One proposer and one seconder must be paid Corporate or Fellow members (Your application must be supported by two existing IES members).',
      'Current Colored Passport Photo.',
    ],
  },
  {
    title: 'Requirements for Student Member Application',
    fee: '$5',
    requirements: [
      'Certified University Student ID Stamped and Signed by the Dean of School.',
      'ID Copy Certified by Commissioner for Oaths (NB: not advocates).',
      'A copy of your secondary school completion certificate certified by Commissioner for Oaths (NB: not advocates).',
      'Two referees: One proposer and one seconder must be paid up Corporate or Fellow Members (Your application must be supported by two existing IES Members).',
      'Current Colored Passport Photo.',
    ],
  },
];

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
        eyebrow="Membership Requirements"
        title="IES Membership Application Requirements"
        description="Discover Our Membership Application Requirements"
      />

      <Section spacing="compact">
        <h2 className="text-center text-2xl font-extrabold tracking-tight text-[#035CB3] sm:text-3xl">
          Join Our Individual Membership
        </h2>
      </Section>

      <Section tone="muted" spacing="compact">
        <RequirementsAccordion items={individualRequirements} />
      </Section>
    </>
  );
}
