import { routes } from './routes';

export const site = {
  name: 'Institution of Engineers Somalia',
  shortName: 'IES',
  domain: 'iesomalia.org.so',
  url: 'https://iesomalia.org.so',
  tagline: 'Advancing Engineering Excellence in Somalia',
  description:
    'The Institution of Engineers of Somalia (IES) is the national professional body for engineers, advancing engineering through knowledge, innovation and service for the benefit of society.',
  established: 2024,
  logo: '/logo-ies.png',

  contact: {
    generalEmail: 'info@iesomalia.org.so',
    presidentEmail: 'omararb@iesomalia.org.so',
    phone: 'TBD',
    address: 'Mogadishu, Somalia',
  },

  social: {
    twitter: 'TBD',
    facebook: 'TBD',
    linkedin: 'TBD',
    youtube: 'TBD',
  },

  cta: {
    primary: { label: 'Apply for Membership', href: routes.membership.apply },
    secondary: { label: 'Member Login', href: routes.auth.login },
    partner: { label: 'Become a Partner', href: routes.about.partners },
  },
} as const;
