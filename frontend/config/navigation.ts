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
      { label: 'Who We Are', href: routes.about.root },
      { label: "President's Message", href: routes.about.presidentMessage },
      { label: 'IES Council', href: routes.about.council },
      { label: 'Advisory Council', href: routes.about.advisoryCouncil },
      { label: 'Committees', href: routes.about.committees },
      { label: 'Engineering Divisions', href: routes.about.divisions },
      { label: 'Secretariat', href: routes.about.secretariat },
      { label: 'Partners & Affiliations', href: routes.about.partners },
      { label: 'Board Nominations', href: routes.about.boardNominations },
      { label: 'Governance Documents', href: routes.about.governance },
    ],
  },
  {
    label: 'Membership',
    href: routes.membership.root,
    layout: 'dropdown',
    children: [
      { label: 'Why Join IES', href: routes.membership.root },
      { label: 'Membership Categories', href: routes.membership.categories },
      { label: 'Membership Benefits', href: routes.membership.benefits },
      { label: 'Requirements', href: routes.membership.requirements },
      { label: 'Membership Fees', href: routes.membership.fees },
      { label: 'Apply for Membership', href: routes.membership.apply },
      { label: 'Member Check', href: routes.membership.memberCheck },
      { label: 'Organization Membership', href: routes.membership.organizations },
    ],
  },
  {
    label: 'Professional Development',
    href: routes.professionalDevelopment.root,
    layout: 'dropdown',
    children: [
      { label: 'CPD', href: routes.professionalDevelopment.cpd },
      { label: 'Events Calendar', href: routes.professionalDevelopment.events },
      { label: 'Training Calendar', href: routes.professionalDevelopment.trainingCalendar },
      { label: 'Seminars', href: routes.professionalDevelopment.seminars },
      { label: 'Conferences', href: routes.professionalDevelopment.conferences },
      { label: 'CPD Courses', href: routes.professionalDevelopment.courses },
    ],
  },
  {
    label: 'Info Hub',
    href: routes.infoHub.root,
    layout: 'dropdown',
    children: [
      { label: 'News', href: routes.infoHub.news },
      { label: 'Announcements', href: routes.infoHub.announcements },
      { label: 'Newsletters', href: routes.infoHub.newsletters },
      { label: 'Publications', href: routes.infoHub.publications },
      { label: 'Engineering Magazine', href: routes.infoHub.magazine },
      { label: 'Conference Papers', href: routes.infoHub.conferencePapers },
      { label: 'Engineering Resources', href: routes.infoHub.resources },
      { label: 'Documentary', href: routes.infoHub.documentary },
      { label: 'Presentations', href: routes.infoHub.presentations },
      { label: 'Speeches', href: routes.infoHub.speeches },
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
      { label: 'Jobs', href: routes.opportunities.jobs },
      { label: 'Internships', href: routes.opportunities.internships },
      { label: 'Tenders', href: routes.opportunities.tenders },
      { label: 'CV Repository', href: routes.opportunities.cvRepository },
    ],
  },
];

export const footerNavigation = {
  institution: {
    label: 'IES',
    items: [
      { label: 'Who We Are', href: routes.about.root },
      { label: "President's Message", href: routes.about.presidentMessage },
      { label: 'Council', href: routes.about.council },
      { label: 'Partners', href: routes.about.partners },
      { label: 'Governance', href: routes.about.governance },
    ],
  },
  membership: {
    label: 'Membership',
    items: [
      { label: 'Categories', href: routes.membership.categories },
      { label: 'Benefits', href: routes.membership.benefits },
      { label: 'Requirements', href: routes.membership.requirements },
      { label: 'Apply', href: routes.membership.apply },
      { label: 'Member Check', href: routes.membership.memberCheck },
    ],
  },
  resources: {
    label: 'Resources',
    items: [
      { label: 'News', href: routes.infoHub.news },
      { label: 'Publications', href: routes.infoHub.publications },
      { label: 'Events', href: routes.professionalDevelopment.events },
      { label: 'Gallery', href: routes.gallery.photos },
    ],
  },
  services: {
    label: 'Services',
    items: [
      { label: 'Opportunities', href: routes.opportunities.root },
      { label: 'Apply for Membership', href: routes.membership.apply },
      { label: 'Member Login', href: routes.auth.login },
    ],
  },
} as const;
