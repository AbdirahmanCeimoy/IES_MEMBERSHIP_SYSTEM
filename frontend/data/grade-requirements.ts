/**
 * Grade-specific application requirements - sourced from the IES Website
 * Information document (Section: Membership Requirements). Amounts are the
 * application fee only; annual subscription is separate.
 */

export type GradeCode =
  | 'STUDENT'
  | 'GRADUATE'
  | 'ASSOCIATE'
  | 'CORPORATE'
  | 'SENIOR'
  | 'FELLOW';

export interface GradeRequirements {
  code: GradeCode;
  label: string;
  postnominal?: string;
  headline: string;
  summary: string;
  applicationFee: string;
  requirements: string[];
  notes?: string[];
}

export const gradeRequirements: Record<GradeCode, GradeRequirements> = {
  STUDENT: {
    code: 'STUDENT',
    label: 'Student Member',
    headline: 'Requirements for Student Member application',
    summary: 'For persons currently receiving engineering education and training in a recognised and accredited engineering programme.',
    applicationFee: '$5',
    requirements: [
      'Certified university student ID stamped and signed by the Dean of School.',
      'A copy of your national ID / passport verified by the Dean.',
      'A copy of your secondary school completion certificate.',
      'Current colored passport photo.',
      'Proposer and seconder must be paid-up Corporate or Fellow members (two existing IES members).',
    ],
    notes: [
      'Verification of student status by the Dean of School is mandatory.',
    ],
  },
  GRADUATE: {
    code: 'GRADUATE',
    label: 'Graduate Member',
    postnominal: 'GMIES',
    headline: 'Requirements for Graduate Member application',
    summary: 'For persons holding an accredited engineering degree and at the early stage of their professional career, working toward Corporate Membership.',
    applicationFee: '$10',
    requirements: [
      'Updated Curriculum Vitae (CV).',
      'Proposer and seconder - paid up Corporate or Fellow members (two existing IES members).',
      'Degree certificate certified by Commissioner for Oaths (not advocates).',
      'ID copy certified by Commissioner for Oaths (not advocates).',
      'Secondary school completion certificate certified by Commissioner for Oaths.',
      'Current colored passport photo.',
    ],
  },
  ASSOCIATE: {
    code: 'ASSOCIATE',
    label: 'Associate Member',
    postnominal: 'AMIES',
    headline: 'Requirements for Associate Member application',
    summary: 'For persons not qualified for Corporate Membership but with 10+ years experience in a position of responsibility related to engineering.',
    applicationFee: '$30',
    requirements: [
      'Updated Curriculum Vitae (CV).',
      'Two proposers and two seconders - paid Corporate or Fellow members.',
      'Higher National Diploma certificate certified by Commissioner for Oaths.',
      'ID copy certified by Commissioner for Oaths.',
      'Current colored passport photo.',
    ],
    notes: [
      'Associate applicants must provide at least one of: Transcript/Diploma evidence OR Experience Letter demonstrating responsibility.',
    ],
  },
  CORPORATE: {
    code: 'CORPORATE',
    label: 'Corporate Member',
    postnominal: 'MIES',
    headline: 'Requirements for Corporate Membership application',
    summary: 'For fully qualified engineering professionals with at least three years of post-graduate experience and demonstrated professional competence.',
    applicationFee: '$30',
    requirements: [
      'Updated Curriculum Vitae (CV).',
      'Two proposers and two seconders - paid Corporate or Fellow members.',
      'ID copy certified by Commissioner for Oaths.',
      'Copy of IES graduate letter or certificate.',
      'At least 3 years of relevant experience as a Graduate Member.',
      'Current colored passport photo.',
    ],
  },
  SENIOR: {
    code: 'SENIOR',
    label: 'Senior Member',
    postnominal: 'SenMIES',
    headline: 'Requirements for Senior Member application',
    summary: 'For Corporate Members (or equivalent standing) with 10+ years professional engineering experience and demonstrated leadership.',
    applicationFee: '$30',
    requirements: [
      'Updated Curriculum Vitae (CV).',
      'Corporate standing or equivalent professional recognition.',
      'Minimum 10 years professional engineering experience.',
      'Two proposers and two seconders - paid Corporate or Fellow members.',
      'Evidence of leadership or significant technical contribution.',
      'ID copy certified by Commissioner for Oaths.',
      'Current colored passport photo.',
    ],
  },
  FELLOW: {
    code: 'FELLOW',
    label: 'Fellow Member',
    postnominal: 'FIES',
    headline: 'Requirements for Fellow Membership application',
    summary: 'The highest membership grade - for Corporate Members with 7+ years of standing, 15+ years experience, and outstanding contribution to engineering.',
    applicationFee: '$30',
    requirements: [
      'Updated Curriculum Vitae (CV).',
      'Two proposers and two seconders - paid up Fellows only.',
      'ID copy certified by Commissioner for Oaths.',
      'Corporate membership for at least 7 years.',
      'Senior engineering position for at least 5 years.',
      'Demonstrated active involvement in IES activities.',
      'Demonstrated CSR (engineering-nature) activities.',
      'Short bio describing IES and CSR involvement.',
      'Current colored passport photo.',
    ],
    notes: [
      'Fellowship is elected by Council - meeting the requirements does not guarantee admission.',
    ],
  },
};
