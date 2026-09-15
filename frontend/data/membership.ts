import type { MembershipCategory } from '@/components/public/MembershipCategoryCard';

export const membershipCategories: MembershipCategory[] = [
  {
    code: '01',
    title: 'Honorary Member',
    summary:
      'A person who has rendered exceptional service to the Institution, the engineering profession, science, education, industry, public service, or national development. Elected by the Council.',
  },
  {
    code: '02',
    title: 'Fellow Member',
    postnominal: 'FIES',
    summary:
      'Corporate Member of at least 7 years with 15+ years of professional engineering experience and outstanding contributions to engineering, industry, research, or public service.',
  },
  {
    code: '03',
    title: 'Senior Member',
    postnominal: 'SenMIES',
    summary:
      'Corporate Member (or equivalent standing) with 10+ years of professional engineering experience and demonstrated leadership and technical expertise.',
  },
  {
    code: '04',
    title: 'Corporate Member',
    postnominal: 'CMIES',
    summary:
      'Holds an accredited engineering qualification with 3+ years of relevant professional engineering experience and demonstrated ethical practice.',
  },
  {
    code: '05',
    title: 'Associate Member',
    postnominal: 'AMIES',
    summary:
      'Not qualified for Corporate Membership but with 10+ years of experience in a position of responsibility related to engineering.',
  },
  {
    code: '06',
    title: 'Companion Member',
    postnominal: 'CompIES',
    summary:
      'Non-engineers whose significant service or contributions support the engineering profession (law, finance, education, government, industry, and related fields).',
  },
  {
    code: '07',
    title: 'Graduate Member',
    postnominal: 'GMIES',
    summary:
      'Holds an accredited engineering degree and is at the early stage of a professional career, working toward Corporate Membership.',
  },
  {
    code: '08',
    title: 'Graduate Engineering Technologist',
    summary:
      'Holds a recognized degree or equivalent in Engineering Technology and is committed to professional competence in engineering technology.',
  },
  {
    code: '09',
    title: 'Graduate Engineering Technician',
    summary:
      'Holds a recognized diploma or equivalent in engineering or related technical studies and is developing technical skills and professional competence.',
  },
  {
    code: '10',
    title: 'Student Member',
    summary:
      'Receiving engineering education and training in a recognized and accredited engineering programme at a university, college, or technical institution.',
  },
];

export interface MembershipRequirement {
  category: string;
  fee: string;
  items: string[];
}

export const membershipRequirements: MembershipRequirement[] = [
  {
    category: 'Student Member',
    fee: '$5',
    items: [
      'Certified university student ID stamped and signed by the Dean of School.',
      'A copy of your national ID/Passport verified by the Dean.',
      'A copy of your secondary school completion certificate.',
      'Current colored passport photo.',
      'Proposer and seconder must be paid up Corporate or Fellow members.',
    ],
  },
  {
    category: 'Graduate Member',
    fee: '$10',
    items: [
      'Updated Curriculum Vitae.',
      'Proposer and seconder (paid up Corporate or Fellow members).',
      'Degree certificate certified by Commissioner for Oaths.',
      'ID copy certified by Commissioner for Oaths.',
      'Secondary school completion certificate certified by Commissioner for Oaths.',
      'Current colored passport photo.',
    ],
  },
  {
    category: 'Graduate Engineering Technician',
    fee: '$10',
    items: [
      'Updated Curriculum Vitae.',
      'Proposer and seconder (paid Corporate or Fellow members).',
      'ID copy certified by Commissioner for Oaths.',
      'Secondary school completion certificate certified by Commissioner for Oaths.',
      'Current colored passport photo.',
    ],
  },
  {
    category: 'Graduate Engineering Technologist',
    fee: '$10',
    items: [
      'Updated Curriculum Vitae.',
      'Proposer and seconder (paid up Corporate or Fellow members).',
      'Degree certificate certified by Commissioner for Oaths.',
      'ID copy certified by Commissioner for Oaths.',
      'Current colored passport photo.',
    ],
  },
  {
    category: 'Associate Member',
    fee: '$30',
    items: [
      'Updated Curriculum Vitae.',
      'Two proposers and two seconders (paid Corporate or Fellow members).',
      'Higher National Diploma certificate certified by Commissioner for Oaths.',
      'ID copy certified by Commissioner for Oaths.',
      'Current colored passport photo.',
    ],
  },
  {
    category: 'Corporate Membership',
    fee: '$30',
    items: [
      'Updated Curriculum Vitae.',
      'Two proposers and two seconders (paid Corporate or Fellow members).',
      'ID copy certified by Commissioner for Oaths.',
      'Copy of IES graduate letter or certificate.',
      'At least 3 years of relevant experience as a Graduate Member.',
      'Current colored passport photo.',
    ],
  },
  {
    category: 'Fellow Membership',
    fee: '$30',
    items: [
      'Updated Curriculum Vitae.',
      'Two proposers and two seconders (paid up Fellows).',
      'ID copy certified by Commissioner for Oaths.',
      'Corporate membership for at least 7 years.',
      'Senior engineering position for at least 5 years.',
      'Demonstrated active involvement in IES activities and CSR (engineering in nature).',
      'Short bio describing IES and CSR involvement.',
      'Current colored passport photo.',
    ],
  },
];

export const whyJoinPillars = [
  {
    title: 'Professional Development',
    body: 'Conferences, seminars, workshops and CPD to enhance technical and managerial skills, with preferential rates for members.',
  },
  {
    title: 'International Affiliation',
    body: 'Links to WFEO, FAEO, EAFEO and other regional and international engineering organizations open the wider global engineering community to members.',
  },
  {
    title: 'Networking',
    body: 'Connect with fellow engineers across sectors, disciplines and institutions through IES technical forums and professional gatherings.',
  },
  {
    title: 'Recognition & Contribution',
    body: 'Serve on IES technical committees, be recognised as part of the national engineering community, and help shape engineering standards and practice.',
  },
];

export const commonMembershipBenefits = [
  'Access to IES journals, newsletters and the Engineering Magazine.',
  'Access to webinars, workshops, conferences and conventions.',
  'IES Capacity Building Initiatives.',
  'Networking opportunities and site visits.',
  'Recognition and awards for contributions to the profession.',
  'CPD support and mentorship pathways.',
];
