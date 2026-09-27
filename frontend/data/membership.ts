import type { MembershipCategory } from '@/components/public/MembershipCategoryCard';

export const membershipCategories: MembershipCategory[] = [
  {
    code: '01',
    title: 'Honorary Member',
    summary:
      'An Honorary Member shall be a person who has rendered exceptional service to the Institution, the engineering profession, science, education, industry, public service, or national development, or who has achieved distinction in engineering or related fields. Election to Honorary Membership shall be based on recognition of outstanding contribution and shall be approved by the Council.',
  },
  {
    code: '02',
    title: 'Fellow Member',
    postnominal: 'FIES',
    summary:
      'Every candidate for election or transfer to the class of Fellow Member shall satisfy the Council that they are a Corporate Member of the Institution or possess equivalent professional standing, have been a Corporate Member of the Institution for at least seven (7) years, have at least fifteen (15) years of professional engineering experience, and have demonstrated outstanding professional achievement, leadership, and significant contributions to engineering practice, industry, education, research, public service, or the advancement of the Institution and the engineering profession.',
  },
  {
    code: '03',
    title: 'Senior Member',
    postnominal: 'SenMIES',
    summary:
      'Every candidate for election or transfer to the class of Senior Member shall satisfy the Council that they have been a Corporate Member of the Institution for at least five (5) years or possess equivalent professional standing, have at least ten (10) years of relevant professional engineering experience, and have demonstrated professional leadership, technical expertise, and significant contribution to engineering practice, industry, education, research, public service, or the advancement of the engineering profession.',
  },
  {
    code: '04',
    title: 'Corporate Member',
    postnominal: 'CMIES',
    summary:
      'Every candidate for election or transfer to the class of Corporate Member shall satisfy the Council that they hold an accredited engineering qualification or an equivalent qualification recognized by the Institution, have at least three (3) years of relevant professional engineering experience, and have demonstrated professional competence, responsibility, and commitment to ethical engineering practice.',
  },
  {
    code: '05',
    title: 'Associate Member',
    postnominal: 'AMIES',
    summary:
      'Every candidate for admission or transfer to the class of Associate Member shall satisfy the Council that they are not qualified for admission as a Corporate Member and have at least two (2) years of relevant engineering-related experience. Associate Membership shall recognize individuals who possess relevant engineering-related knowledge, experience, and responsibility but do not meet the requirements for Corporate Membership.',
  },
  {
    code: '06',
    title: 'Companion Member',
    postnominal: 'CompIES',
    summary:
      'Every candidate for election or transfer to the class of Companion Member shall satisfy the Council that they are not qualified for admission as an engineering member of the Institution but have rendered significant service or made valuable contributions to the engineering profession, science, education, industry, commerce, finance, law, public service, or other fields related to the application and advancement of engineering. Companion Membership shall recognize individuals who support the objectives of the Institution and contribute to the development, promotion, and advancement of engineering in society. Such individuals may include professionals from law, finance, business, education, government, or industry, as well as people who support engineering projects, policies, research, education, or professional activities and have demonstrated commitment to the advancement of engineering and national development.',
  },
  {
    code: '07',
    title: 'Graduate Member',
    postnominal: 'GMIES',
    summary:
      'Every candidate for admission or transfer to the class of Graduate Member shall satisfy the Council that they hold an accredited engineering degree or equivalent qualification from a recognized institution and have less than two (2) years of relevant professional engineering experience. Graduate Membership is intended for engineers at the early stage of their professional career who are seeking to develop their professional competence and experience toward Corporate Membership.',
  },
  {
    code: '08',
    title: 'Graduate Engineering Technologist',
    summary:
      'Every candidate for admission to the class of Graduate Engineering Technologist shall satisfy the Council that they hold a recognized degree or equivalent qualification in Engineering Technology and are committed to developing their professional competence and contributing to the practice of engineering technology.',
  },
  {
    code: '09',
    title: 'Graduate Engineering Technician',
    summary:
      'Every candidate for admission to the Graduate Engineering Technician class shall satisfy the Council that they hold a recognized diploma or equivalent qualification in engineering or related technical studies and seek to develop their technical skills and professional competence within the engineering field.',
  },
  {
    code: '10',
    title: 'Student Member',
    summary:
      'Every candidate for admission to the class of Student Member shall satisfy the Council that they are receiving education and training in engineering through a recognized and accredited engineering programme at a recognized educational institution.',
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
