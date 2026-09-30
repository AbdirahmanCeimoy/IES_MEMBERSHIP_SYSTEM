/**
 * Grade-specific application requirements - the wording below is the
 * canonical IES text as supplied by the Institution and must not be
 * paraphrased. Amounts are the application fee only; annual subscription
 * is separate.
 */

export type GradeCode =
  | 'STUDENT'
  | 'GRADUATE'
  | 'ASSOCIATE'
  | 'CORPORATE'
  | 'SENIOR'
  | 'FELLOW'
  | 'GRAD_TECHNICIAN'
  | 'GRAD_TECHNOLOGIST';

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

const STANDARD_SUMMARY =
  'Below are the mandatory application requirements needed to be registered in this category:';

export const gradeRequirements: Record<GradeCode, GradeRequirements> = {
  STUDENT: {
    code: 'STUDENT',
    label: 'Student Member',
    postnominal: 'SMIES',
    headline: 'Requirements for Student Member Application',
    summary: STANDARD_SUMMARY,
    applicationFee: '$5',
    requirements: [
      'Certified University Student ID Stamped and Signed by the Dean of School.',
      'Copy of National ID/Passport Certified by a Commissioner for Oaths (NB: not advocates).',
      'A copy of your secondary school completion certificate certified by Commissioner for Oaths (NB: not advocates).',
      'Two referees: One proposer and one seconder must be paid up Corporate or Fellow Members (Your application must be supported by two existing IES Members).',
      'Current Colored Passport Photo.',
      'Application Fee: $5.',
    ],
  },
  GRADUATE: {
    code: 'GRADUATE',
    label: 'Graduate Member',
    postnominal: 'GMIES',
    headline: 'Requirements for Graduate Member Application',
    summary: STANDARD_SUMMARY,
    applicationFee: '$10',
    requirements: [
      'Updated Curriculum Vitae (CV).',
      'Degree certificate certified by Commissioner for Oaths (NB: not advocates).',
      'Copy of National ID/Passport Certified by a Commissioner for Oaths (NB: not advocates).',
      'A copy of your Secondary School Completion Certificate Certified by Commissioner for Oaths (NB: not advocates).',
      'Two referees: One proposer and one seconder must be paid up Corporate or Fellow Members (Your application must be supported by two existing IES Members).',
      'Current Colored Passport Photo.',
      'Application Fee: $10.',
    ],
  },
  GRAD_TECHNICIAN: {
    code: 'GRAD_TECHNICIAN',
    label: 'Graduate Engineering Technician',
    headline: 'Requirements for Graduate Engineering Technician Application',
    summary: STANDARD_SUMMARY,
    applicationFee: '$10',
    requirements: [
      'Updated Curriculum Vitae (CV).',
      'Degree certificate certified by Commissioner for Oaths (NB: not advocates).',
      'copy of National ID/Passport Certified by a Commissioner for Oaths (NB: not advocates).',
      'A copy of your secondary school completion certificate certified by Commissioner for Oaths (NB: not advocates).',
      'Two referees: One proposer and one seconder must be paid Corporate or Fellow members (Your application must be supported by two existing IES members).',
      'Current Colored Passport Photo.',
      'Application Fee: $10.',
    ],
  },
  GRAD_TECHNOLOGIST: {
    code: 'GRAD_TECHNOLOGIST',
    label: 'Graduate Engineering Technologist',
    headline: 'Requirements for Graduate Engineering Technologist Application',
    summary: STANDARD_SUMMARY,
    applicationFee: '$10',
    requirements: [
      'Updated Curriculum Vitae (CV).',
      'Degree certificate certified by Commissioner for Oaths (NB: not advocates).',
      'Copy of National ID/Passport Certified by a Commissioner for Oaths (NB: not advocates).',
      'A copy of your secondary school completion certificate certified by Commissioner for Oaths (NB: not advocates).',
      'Two referees: One proposer and one seconder must be paid up Corporate or Fellow members (Your application must be supported by two existing IES members).',
      'Current Colored Passport Photo.',
      'Application Fee: $10.',
    ],
  },
  ASSOCIATE: {
    code: 'ASSOCIATE',
    label: 'Associate Member',
    postnominal: 'AMIES',
    headline: 'Requirements for Associate Member Application',
    summary: STANDARD_SUMMARY,
    applicationFee: '$20',
    requirements: [
      'Updated Curriculum Vitae (CV).',
      'Degree certificate certified by Commissioner for Oaths (NB: not advocates).',
      'Copy of National ID/Passport Certified by a Commissioner for Oaths (NB: not advocates).',
      'A copy of your secondary school completion certificate certified by Commissioner for Oaths (NB: not advocates).',
      'A Copy of IES Graduate Certificate.',
      'At least 2 years of relevant experience as a Graduate Member.',
      'Four referees: Two proposers and two seconders who are paid Corporate or Fellow members (Your application must be supported by two existing IES members).',
      'Current Colored Passport Photo.',
      'Application Fee: $20.',
    ],
  },
  CORPORATE: {
    code: 'CORPORATE',
    label: 'Corporate Member',
    postnominal: 'CMIES',
    headline: 'Requirements for Corporate Membership Application',
    summary: STANDARD_SUMMARY,
    applicationFee: '$20',
    requirements: [
      'Updated Curriculum Vitae (CV).',
      'Degree certificate certified by Commissioner for Oaths (NB: not advocates).',
      'Copy of National ID/Passport Certified by a Commissioner for Oaths (NB: not advocates).',
      'A Copy of IES Graduate Certificate.',
      'At least 3 years of relevant experience as a Graduate Member.',
      'Four referees: Two proposers and two seconders who are paid Corporate or Fellow members (Your application must be supported by two existing IES members).',
      'Current Colored Passport Photo.',
      'Application Fee: $20.',
    ],
  },
  SENIOR: {
    code: 'SENIOR',
    label: 'Senior Member',
    postnominal: 'SenMIES',
    headline: 'Requirements for Senior Membership Application',
    summary: STANDARD_SUMMARY,
    applicationFee: '$30',
    requirements: [
      'Updated Curriculum Vitae (CV).',
      'Copy of National ID/Passport Certified by a Commissioner for Oaths (NB: not advocates).',
      'Copy of relevant engineering degree, professional qualification, or other recognized engineering qualifications.',
      'Four Referees: Two proposers and two seconders who are paid up Fellows (Your application must be supported by two existing IES members).',
      'At least ten (10) years of relevant professional engineering experience.',
      'At least five (5) years of Corporate Membership with IES, or equivalent professional standing as determined by IES.',
      'Demonstration of active involvement in IES activities.',
      'Demonstration of Corporate Social Responsibility activities (engineering in nature).',
      'Short Bio Data describing IES and Corporate Social Responsibility (CSR) involvement.',
      'Current colored Passport Photo.',
      'Application Fee: $30.',
    ],
  },
  FELLOW: {
    code: 'FELLOW',
    label: 'Fellow Member',
    postnominal: 'FMIES',
    headline: 'Requirements for Fellow Membership Application',
    summary: STANDARD_SUMMARY,
    applicationFee: '$50',
    requirements: [
      'Updated Curriculum Vitae (CV).',
      'Copy of National ID/Passport Certified by a Commissioner for Oaths (NB: not advocates).',
      'Copy of relevant engineering degree, professional qualification, or other recognized engineering qualifications.',
      'Four Referees: Two proposers and two seconders who are paid up Fellows (Your application must be supported by two existing IES members).',
      'At least seven (7) years of Corporate Membership with IES, or equivalent professional standing as determined by IES.',
      'At least fifteen (15) years of relevant professional engineering experience.',
      'Demonstration of active involvement in IES activities.',
      'Demonstration of Corporate Social Responsibility activities (engineering in nature).',
      'Short Bio Data describing IES and Corporate Social Responsibility (CSR) involvement.',
      'Current Colored Passport Photo.',
      'Application Fee: $50.',
    ],
  },
};
