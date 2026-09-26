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
    body: 'IES provides members with information about conferences, seminars, workshops, webinars, and other professional opportunities from national and international engineering organizations. These activities help members stay informed, enhance their professional skills, and engage with the wider engineering community.',
  },
  {
    title: 'Professional Development Programs',
    body: 'IES organizes workshops, technical seminars, training programs, and Continuing Professional Development (CPD) activities to strengthen the knowledge, skills, and professional growth of engineers. The Institution supports lifelong learning and career development across all engineering disciplines.',
  },
  {
    title: 'Advocacy and Policy Support',
    body: 'IES represents the engineering profession and collaborates with government institutions, universities, industry stakeholders, development partners, and international engineering organizations to address engineering challenges, promote professional standards, and contribute to national development.',
  },
  {
    title: 'Research, Innovation and Knowledge Sharing',
    body: 'IES promotes engineering research, innovation, and knowledge exchange by encouraging technical discussions, supporting studies, publishing engineering resources, and facilitating collaboration among engineers, academic institutions, industries, and other stakeholders.',
  },
  {
    title: 'Website and Communication',
    body: 'IES provides information about its activities, membership opportunities, events, publications, and announcements through its official website and communication channels. These platforms help members and stakeholders stay connected with IES programs, initiatives, and professional activities.',
  },
  {
    title: 'Arbitration and Dispute Resolution',
    body: 'IES aims to establish a professional framework for arbitration and dispute resolution by engaging qualified engineers to provide independent technical opinions and expert support in engineering and construction-related matters.',
  },
  {
    title: 'Technical Audit and Project Review',
    body: 'IES seeks to provide independent technical audits and project reviews upon request. The Institution may evaluate project progress, identify technical challenges, assess engineering practices, and recommend solutions to improve quality, safety, and performance.',
  },
  {
    title: 'Professional Networking',
    body: 'IES provides a platform for engineers, students, academics, and industry professionals to connect, exchange knowledge, collaborate, and contribute to the advancement of the engineering profession in Somalia.',
  },
];

import type { Person } from '@/components/public/PersonCard';

export const executiveCommittee: Person[] = [
  { name: 'Eng. Omar Abdi Arab', role: 'President', email: 'omararb@iesomalia.org.so' },
  { name: 'Eng. Bashir Ali Hussein', role: 'Vice President' },
  { name: 'Mohamed Hussein Hassan', role: 'Honorary Secretary' },
  { name: 'Abdishakur Abdullahi Mohamed', role: 'Honorary Treasurer' },
];

/** Committee chair/vice roster. */
export const committees: { name: string; roles: string[] }[] = [
  { name: 'Executive Committee', roles: ['President', '1st Vice President', '2nd Vice President', 'Honorary Secretary', 'Honorary Treasurer'] },
  { name: 'Engineering Education Committee', roles: ['Chairperson', 'Vice Chairperson', '9 Members'] },
  { name: 'Membership and Welfare Committee', roles: ['Chairperson', 'Vice Chairperson', '9 Members'] },
  { name: 'Women Engineers Committee', roles: ['Chairperson', 'Vice Chairperson', '9 Members'] },
  { name: 'Young Engineers Committee', roles: ['Chairperson', 'Vice Chairperson', '9 Members'] },
  { name: 'Policy and Legislative Committee', roles: ['Chairperson', 'Vice Chairperson', '9 Members'] },
  { name: 'Governance and Controls Committee', roles: ['Chairperson', 'Vice Chairperson', '9 Members'] },
  { name: 'Resources and Sustainability Committee', roles: ['Chairperson', 'Vice Chairperson', '9 Members'] },
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
  'Chief Executive Officer (CEO)',
  'Executive Office Assistant',
  'Membership and Training Manager',
  'Admin and Finance Manager',
  'Policy, Research and Advocacy Manager',
  'Relationships and Partnerships Manager',
  'Communication and Marketing Officer',
  'Human Resources and Welfare Officer',
  'Capacity Building Officer',
  'Membership Officer',
  'Research and Publications Officer',
  'ICT Officer',
  'Assistant ICT Officer',
  'Admin & Finance Officer',
];

import type { Partner } from '@/components/public/PartnerCard';

export const partners: Partner[] = [
  { name: 'East Africa Federation of Engineering Organisations (EAFEO)', href: 'https://eafeo.org/', scope: 'International', logo: '/loges-international/eafeo.jpeg' },
  { name: 'Federation of African Engineering Organisations (FAEO)', href: 'https://faeo.org/', scope: 'International', logo: '/loges-international/faeo.jpeg' },
  { name: 'World Federation of Engineering Organizations (WFEO)', href: 'https://www.wfeo.org/', scope: 'International', logo: '/loges-international/wfeo.jpeg' },
  { name: 'United Nations Educational, Scientific and Cultural Organization (UNESCO)', href: 'https://www.unesco.org/en', scope: 'International', logo: '/loges-international/unesco.jpeg' },
  { name: 'The Institution of Engineers of Kenya (IEK)', href: 'https://www.iekenya.org/about-us', scope: 'International', logo: '/loges-international/iek.png' },
  { name: 'Uganda Institution of Professional Engineers (UIPE)', href: 'https://uipe.co.ug/', scope: 'International', logo: '/loges-international/UGANDA.jpeg' },
  { name: 'Institution of Engineers Tanzania (IET)', href: 'https://iet.or.tz/', scope: 'International', logo: '/loges-international/IET.jpeg' },
  { name: 'Institute of Engineering Rwanda (IER)', href: 'https://engineersrwanda.rw/', scope: 'International', logo: '/loges-international/IER.jpeg' },
  { name: 'Ministry of Public Works, Reconstruction and Housing (MPWR), Federal Government of Somalia', href: 'https://mpwr.gov.so/', scope: 'Local', logo: '/loges-locals/wasarada-howlaha-guud-dib-udhiska.jpeg' },
  { name: 'Ministry of Energy and Water Resources (MoEWR), Federal Government of Somalia', href: 'https://moewr.gov.so/', scope: 'Local', logo: '/loges-locals/Minester-of-energy-and-water-resource.jpeg' },
  { name: 'Somali Real Estate and Construction Association (SORECA)', href: 'https://soreca.so/', scope: 'Local', logo: '/loges-locals/SORECA.jpeg' },
  { name: 'Jamhuriya University of Science and Technology (JUST)', href: 'https://www.just.edu.so/', scope: 'Local', logo: '/loges-locals/JAMHURIYA-UNIVER.png' },
  { name: 'Jazeera University (JU)', href: 'https://jazeerauniversity.edu.so/', scope: 'Local', logo: '/loges-locals/JAZEERA-UNIVERSITY.jpeg' },
  { name: 'Salaam University (SU)', href: 'https://salaam.edu.so/', scope: 'Local', logo: '/loges-locals/SALAAM-UNIVERSITY.jpeg' },
  { name: 'Benadir University (BU)', href: 'https://bu.edu.so/', scope: 'Local', logo: '/loges-locals/BANADIR-UNIVERSITY.jpeg' },
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
