/**
 * Static institutional content sourced from the IES Website Information
 * (Last Updated) document. Dynamic records (individual council members,
 * appointments, live news) should eventually come from the Laravel API.
 * Entries marked "IES DECISION REQUIRED" are placeholders awaiting
 * verified institutional data.
 */

export const missionStatement =
  'To advance the engineering profession through innovation, ethics, leadership, and professional development for the benefit of society.';

export const visionStatement =
  'To be the trusted professional body and voice of the engineering profession in Somalia.';

export const institutionSummary =
  'The Institution of Engineers Somalia (IES) was established in 2024 as the national professional body representing engineers across all engineering disciplines in Somalia. IES collaborates with national and international institutions to advance engineering for the benefit of society, promote the growth and development of the engineering profession, and support the adoption of international standards and global best practices.';

export const institutionSummaryExtended =
  'IES is committed to strengthening the engineering profession by promoting networking, public awareness, engineering education, knowledge sharing, research, and innovation. It also works to establish and promote recognized standards, uphold ethical conduct and integrity, and protect the rights, welfare, and interests of engineers across all disciplines in Somalia.';

export const objectives: { title: string; body: string }[] = [
  {
    title: 'Elevate the profession',
    body: 'Enhance the character, status and interests of the engineering profession and those engaged in it.',
  },
  {
    title: 'Ethics & standards',
    body: 'Promote ethical conduct, honourable practice and mutual respect, and develop standards guiding engineering practice and professional behaviour.',
  },
  {
    title: 'Support members & national development',
    body: 'Support members through quality services, capacity building and advocacy, while contributing to national development and infrastructure growth.',
  },
  {
    title: 'Advance knowledge',
    body: 'Advance continuous professional development (CPD), research, knowledge exchange and professional fellowship among engineers.',
  },
];

export const coreValues = [
  'Integrity',
  'Inclusivity',
  'Professionalism',
  'Innovation',
  'Sustainability',
  'Social Responsibility',
];

export const whatWeDo: { title: string; body: string }[] = [
  {
    title: 'Information to Members',
    body: 'Conferences, seminars, workshops, webinars and other professional opportunities from national and international engineering organizations.',
  },
  {
    title: 'Professional Development',
    body: 'Workshops, technical seminars, training programs and CPD activities that strengthen the knowledge, skills and professional growth of engineers.',
  },
  {
    title: 'Advocacy & Policy Support',
    body: 'Representing the engineering profession and collaborating with government, universities, industry and international engineering organizations.',
  },
  {
    title: 'Research, Innovation & Knowledge Sharing',
    body: 'Promoting engineering research, innovation and knowledge exchange through technical discussions, studies, publications and collaboration.',
  },
  {
    title: 'Website & Communication',
    body: 'Information about IES activities, membership, events, publications and announcements through the official website and communication channels.',
  },
  {
    title: 'Arbitration & Dispute Resolution',
    body: 'A professional framework for arbitration and dispute resolution engaging qualified engineers for independent technical opinions.',
  },
  {
    title: 'Technical Audit & Project Review',
    body: 'Independent technical audits and project reviews to evaluate progress, identify challenges and recommend improvements to quality and safety.',
  },
  {
    title: 'Professional Networking',
    body: 'A platform for engineers, students, academics and industry professionals to connect, exchange knowledge and collaborate.',
  },
];

import type { Person } from '@/components/public/PersonCard';

export const executiveCommittee: Person[] = [
  { name: 'Eng. Omar Abdi Arab', role: 'President', email: 'omararb@iesomalia.org.so' },
  { name: 'Eng. Bashir Ali Hussein', role: 'Vice President' },
  { name: 'Mohamed Hussein Hassan', role: 'Honorary Secretary' },
  { name: 'Abdishakur Abdullahi Mohamed', role: 'Honorary Treasurer' },
];

/** Committee chair/vice roster. IES DECISION REQUIRED for named holders. */
export const committees: { name: string; roles: string[] }[] = [
  { name: 'Executive Committee', roles: ['President', 'Vice President', 'Honorary Secretary', 'Honorary Treasurer'] },
  { name: 'Engineering Education Committee', roles: ['Chairperson', 'Vice Chairperson'] },
  { name: 'Membership and Welfare Committee', roles: ['Chairperson', 'Vice Chairperson'] },
  { name: 'Women Engineers Committee', roles: ['Chairperson', 'Vice Chairperson'] },
  { name: 'Young Engineers Committee', roles: ['Chairperson', 'Vice Chairperson'] },
  { name: 'Policy and Legislative Committee', roles: ['Chairperson', 'Vice Chairperson'] },
  { name: 'Governance and Controls Committee', roles: ['Chairperson', 'Vice Chairperson'] },
  { name: 'Resources and Sustainability Committee', roles: ['Chairperson', 'Vice Chairperson'] },
];

export const engineeringDivisions: string[] = [
  'Civil Engineering',
  'Architectural Engineering',
  'Mechanical Engineering',
  'Electrical and Electronics Engineering',
  'Telecommunications Engineering',
  'Computer Engineering',
  'Chemical Engineering',
  'Petroleum Engineering',
  'Agricultural Engineering',
  'Aerospace Engineering',
  'Automobile Engineering',
  'Biomedical Engineering',
  'Biotechnology Engineering',
  'Biochemical Engineering',
  'Food Engineering',
  'Ceramic Engineering',
  'Environmental Engineering',
  'Industrial Engineering',
  'Marine Engineering',
  'Mining Engineering',
];

export const secretariatPositions: string[] = [
  'Chief Executive Officer (CEO) / Registrar',
  'Executive Office Assistant',
  'Membership and Training Manager',
  'Finance and Administration Manager',
  'Relationships and Partnerships Manager',
  'Policy, Research and Advocacy Officer',
  'Human Resources and Welfare Officer',
  'Finance Officer',
  'Membership Officer',
  'Capacity Building Officer',
  'Research and Publications Officer',
  'ICT Officer',
  'Assistant ICT Officer',
];

import type { Partner } from '@/components/public/PartnerCard';

export const partners: Partner[] = [
  { name: 'World Federation of Engineering Organizations (WFEO)', href: 'https://www.wfeo.org/', scope: 'International' },
  { name: 'Federation of African Engineering Organisations (FAEO)', href: 'https://faeo.org/', scope: 'Regional (Africa)' },
  { name: 'UNESCO', href: 'https://www.unesco.org/en', scope: 'International' },
  { name: 'Institution of Engineers of Kenya (IEK)', href: 'https://www.iekenya.org/about-us', scope: 'Regional (East Africa)' },
  { name: 'Uganda Institution of Professional Engineers (UIPE)', href: 'https://uipe.co.ug/', scope: 'Regional (East Africa)' },
  { name: 'Institution of Engineers Tanzania (IET)', href: 'https://iet.or.tz/', scope: 'Regional (East Africa)' },
  { name: 'Institution of Engineers Rwanda', href: 'https://engineersrwanda.rw/', scope: 'Regional (East Africa)' },
  { name: 'Jamhuriya University of Science and Technology', href: 'https://www.just.edu.so/', scope: 'Academic Partner' },
  { name: 'Benadir University', href: 'https://bu.edu.so/', scope: 'Academic Partner' },
  { name: 'Jazeera University', href: 'https://jazeerauniversity.edu.so/', scope: 'Academic Partner' },
  { name: 'Salaam University', href: 'https://salaam.edu.so/', scope: 'Academic Partner' },
];

export const governanceDocuments = [
  { title: 'By-Laws', description: 'Institutional by-laws governing IES operations.', href: '#', type: 'Document' },
  { title: 'Policies', description: 'Adopted policies of the Institution.', href: '#', type: 'Document' },
  { title: 'Annual Reports', description: 'Annual institutional reports.', href: '#', type: 'Report' },
  { title: 'IES Brochure', description: 'Official IES informational brochure.', href: '#', type: 'Brochure' },
  { title: 'IES Constitution 2026', description: 'The Constitution of the Institution of Engineers of Somalia.', href: '#', type: 'Constitution' },
  { title: 'Code of Professional Practice and Ethics', description: 'Professional practice and ethics code for members.', href: '#', type: 'Code' },
  { title: 'Strategic Plan 2026–2030', description: 'The IES 5-year strategic plan.', href: '#', type: 'Plan' },
];
