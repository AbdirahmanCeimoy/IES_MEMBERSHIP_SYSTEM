import { routes } from './routes';

export const site = {
  name: 'The Institution of Engineers Somalia (IES)',
  shortName: 'IES',
  domain: 'iesomalia.org.so',
  url: 'https://iesomalia.org.so',
  tagline: 'Advancing Engineering Excellence in Somalia',
  description:
    'The Institution of Engineers Somalia (IES) is the national professional body for engineers, advancing engineering through knowledge, innovation and service for the benefit of society.',
  established: 2024,
  logo: '/logo-ies.png',

  contact: {
    generalEmail: 'info@iesomalia.org.so',
    presidentEmail: 'omararb@iesomalia.org.so',
    phones: ['+252 612267178', '+252 612267137'],
    address: '4th Floor, Adani Tower, Maka Al-mukarama Street, Hodan District, Mogadishu',
    workingDays: 'Saturday – Thursday',
    workingHours: '8:00 AM – 5:00 PM',
    closedDay: 'Friday',
  },

  social: {
    facebook: 'https://www.facebook.com/share/1DUHcDi9ZM/',
    instagram: 'https://www.instagram.com/ie_somalia',
    linkedin: 'https://iesomalia.org.so/',
    tiktok: 'https://www.tiktok.com/@iesomalia',
    youtube: 'https://youtube.com/@iesomalia',
    x: 'https://x.com/iesomalia',
  },

  cta: {
    primary: { label: 'Apply for Membership', href: routes.membership.applicationGuidelines },
    secondary: { label: 'Member Login', href: routes.auth.login },
    partner: { label: 'Become a Partner', href: routes.about.partners.root },
  },
} as const;
