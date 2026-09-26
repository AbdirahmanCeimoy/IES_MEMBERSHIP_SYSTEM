import type { NavigationEntry } from '@/types/navigation';
import { routes } from './routes';

export const publicNavigation: NavigationEntry[] = [
  {
    label: 'Home',
    href: routes.home,
    layout: 'link',
  },
  {
    label: 'About IES',
    href: routes.about.root,
    layout: 'dropdown',
    children: [
      { label: 'About Us', href: routes.about.root },
      { label: 'What We Do', href: routes.about.whatWeDo },
      { label: 'Honour Board (Past Presidents)', href: routes.about.honourBoard },
      { label: 'IES Council', href: routes.about.council },
      { label: 'IES Advisory Council', href: routes.about.advisoryCouncil },
      { label: 'IES Committees', href: routes.about.committees },
      { label: 'IES Engineering Divisions', href: routes.about.divisions },
      { label: 'IES Secretariat', href: routes.about.secretariat },
      {
        label: 'Affiliations & Partners',
        href: routes.about.partners.root,
        children: [
          { label: 'Local Affiliations & Partners', href: routes.about.partners.local },
          { label: 'International Affiliations & Partners', href: routes.about.partners.international },
        ],
      },
      { label: 'Nominations by IES to Boards', href: routes.about.boardNominations },
      {
        label: 'Governance Resources (Instruments of Power)',
        href: routes.about.governance.root,
        children: [
          {
            label: 'IES Documents',
            href: routes.about.governance.iesDocuments.root,
            children: [
              { label: 'By-Laws', href: routes.about.governance.iesDocuments.byLaws },
              { label: 'Policies & Regulations', href: routes.about.governance.iesDocuments.policiesAndRegulations },
              { label: 'Annual Reports', href: routes.about.governance.iesDocuments.annualReports },
            ],
          },
          { label: 'IES Brochure', href: routes.about.governance.brochure },
          { label: 'IES Constitution 2026', href: routes.about.governance.constitution2026 },
          { label: 'Code of Professional Practice and Ethics', href: routes.about.governance.codeOfProfessionalPractice },
          { label: 'Strategic Plan 2026 - 2030', href: routes.about.governance.strategicPlan2026_2030 },
        ],
      },
      { label: 'IES Awards', href: routes.about.awards },
    ],
  },
  {
    label: 'Membership',
    href: routes.membership.root,
    layout: 'dropdown',
    children: [
      { label: 'Become a Member', href: routes.membership.becomeMember },
      { label: 'Membership Categories', href: routes.membership.categories },
      { label: 'Membership Benefits', href: routes.membership.benefits },
      { label: 'Membership Requirements', href: routes.membership.requirements },
      { label: 'Membership Fees Structure', href: routes.membership.fees },
      { label: 'Online Application Guidelines (Account Creation)', href: routes.membership.applicationGuidelines },
      { label: 'Account Activation', href: routes.membership.accountActivation },
      { label: 'Member Check', href: routes.membership.memberCheck },
      {
        label: 'Professional Development',
        href: routes.membership.professionalDevelopment.root,
        children: [
          { label: 'IES Events Calendar 2026', href: routes.membership.professionalDevelopment.eventsCalendar2026 },
          { label: 'IES Training Calendar 2026', href: routes.membership.professionalDevelopment.trainingCalendar2026 },
        ],
      },
      { label: 'Complaint Submission Form', href: 'https://docs.google.com/forms/d/1INSA5EEBjTPPVLca3JKQbCb0HZGK9ME71J9pJYZAZnI/edit', external: true },
    ],
  },
  {
    label: 'Events',
    href: routes.events.root,
    layout: 'dropdown',
    children: [
      {
        label: 'IES Annual Events',
        href: routes.events.annualEvents.root,
        children: [
          {
            label: 'World Engineering Day (WED)',
            href: routes.events.annualEvents.worldEngineeringDay.root,
            children: [
              { label: '2025', href: routes.events.annualEvents.worldEngineeringDay.year2025 },
              { label: '2026', href: routes.events.annualEvents.worldEngineeringDay.year2026 },
              { label: '2027', href: routes.events.annualEvents.worldEngineeringDay.year2027 },
            ],
          },
          {
            label: 'International Women in Engineering Day (INWED)',
            href: routes.events.annualEvents.internationalWomenInEngineeringDay.root,
            children: [
              { label: '2025', href: routes.events.annualEvents.internationalWomenInEngineeringDay.year2025 },
              { label: '2026', href: routes.events.annualEvents.internationalWomenInEngineeringDay.year2026 },
              { label: '2027', href: routes.events.annualEvents.internationalWomenInEngineeringDay.year2027 },
            ],
          },
          { label: 'Others', href: routes.events.annualEvents.others },
        ],
      },
      {
        label: 'IES Programmes',
        href: routes.events.programmes.root,
        children: [
          { label: 'Seminars', href: routes.events.programmes.seminars },
          { label: 'Training', href: routes.events.programmes.training },
          { label: 'Conferences', href: routes.events.programmes.conferences },
          { label: 'CPD Courses', href: routes.events.programmes.cpdCourses },
          { label: 'Others', href: routes.events.programmes.others },
        ],
      },
    ],
  },
  {
    label: 'Info Hub',
    href: routes.infoHub.root,
    layout: 'dropdown',
    children: [
      { label: 'News', href: routes.infoHub.news },
      { label: 'Announcements', href: routes.infoHub.announcements },
      { label: 'Publications', href: routes.infoHub.publications },
      { label: 'Engineering in Somalia Magazine', href: routes.infoHub.magazine },
      { label: 'Conference Papers & Reports', href: routes.infoHub.conferencePapers },
      { label: 'Engineering Resources', href: routes.infoHub.resources },
      { label: 'Documentary', href: routes.infoHub.documentary },
      { label: 'Presentations', href: routes.infoHub.presentations },
      { label: 'Speeches', href: routes.infoHub.speeches },
      { label: 'Weekly Newsletters', href: routes.infoHub.newsletters },
    ],
  },
  {
    label: 'Gallery',
    href: routes.gallery.root,
    layout: 'dropdown',
    children: [
      { label: 'Photos', href: routes.gallery.photos },
      { label: 'Videos', href: routes.gallery.videos },
    ],
  },
  {
    label: 'Opportunities',
    href: routes.opportunities.root,
    layout: 'dropdown',
    children: [
      {
        label: 'Jobs',
        href: routes.opportunities.jobs.root,
        children: [
          { label: 'IES Career', href: routes.opportunities.jobs.iesCareer },
          { label: 'Partner Organization Careers', href: routes.opportunities.jobs.partnerOrganizationCareers },
        ],
      },
      { label: 'Internships', href: routes.opportunities.internships },
      {
        label: 'Tenders',
        href: routes.opportunities.tenders.root,
        children: [
          { label: 'IES Tenders', href: routes.opportunities.tenders.iesTenders },
          { label: 'Partner Organization Tenders', href: routes.opportunities.tenders.partnerOrganizationTenders },
        ],
      },
      {
        label: 'CV Repository',
        href: routes.opportunities.cvRepository.root,
        children: [
          { label: 'Submit CV', href: 'https://docs.google.com/forms/d/e/1FAIpQLScIQ-7jIfvY-QQWUuoLuTpRMuxy-X3KQPjSEf_V3aaNfX2OFQ/viewform?usp=publish-editor', external: true },
          { label: 'View CVs', href: routes.opportunities.cvRepository.viewCVs },
        ],
      },
    ],
  },
  {
    label: 'IES Branded Products',
    href: routes.merchandise.root,
    layout: 'link',
  },
  {
    label: 'Contact Us',
    href: routes.contact,
    layout: 'link',
  },
];

export const footerNavigation = {
  institution: {
    label: 'IES',
    items: [
      { label: 'About Us', href: routes.about.root },
      { label: 'Council', href: routes.about.council },
      { label: 'Partners', href: routes.about.partners.root },
      { label: 'Governance', href: routes.about.governance.root },
    ],
  },
  membership: {
    label: 'Membership',
    items: [
      { label: 'Categories', href: routes.membership.categories },
      { label: 'Benefits', href: routes.membership.benefits },
      { label: 'Requirements', href: routes.membership.requirements },
      { label: 'Apply', href: routes.membership.applicationGuidelines },
      { label: 'Member Check', href: routes.membership.memberCheck },
    ],
  },
  resources: {
    label: 'Resources',
    items: [
      { label: 'News', href: routes.infoHub.news },
      { label: 'Publications', href: routes.infoHub.publications },
      { label: 'Events', href: routes.events.root },
      { label: 'Gallery', href: routes.gallery.photos },
    ],
  },
  services: {
    label: 'Services',
    items: [
      { label: 'Opportunities', href: routes.opportunities.root },
      { label: 'Apply for Membership', href: routes.membership.applicationGuidelines },
      { label: 'Member Login', href: routes.auth.login },
    ],
  },
} as const;
