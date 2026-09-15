export const routes = {
  home: '/',

  about: {
    root: '/about',
    presidentMessage: '/about/president-message',
    council: '/about/council',
    advisoryCouncil: '/about/advisory-council',
    committees: '/about/committees',
    divisions: '/about/divisions',
    secretariat: '/about/secretariat',
    partners: '/about/partners',
    boardNominations: '/about/board-nominations',
    governance: '/about/governance',
  },

  membership: {
    root: '/membership',
    categories: '/membership/categories',
    benefits: '/membership/benefits',
    requirements: '/membership/requirements',
    fees: '/membership/fees',
    apply: '/membership/apply',
    memberCheck: '/membership/member-check',
    organizations: '/membership/organizations',
  },

  professionalDevelopment: {
    root: '/professional-development',
    cpd: '/professional-development/cpd',
    events: '/professional-development/events',
    trainingCalendar: '/professional-development/training-calendar',
    seminars: '/professional-development/seminars',
    conferences: '/professional-development/conferences',
    courses: '/professional-development/courses',
  },

  infoHub: {
    root: '/info-hub',
    news: '/info-hub/news',
    announcements: '/info-hub/announcements',
    publications: '/info-hub/publications',
    magazine: '/info-hub/magazine',
    conferencePapers: '/info-hub/conference-papers',
    resources: '/info-hub/resources',
    documentary: '/info-hub/documentary',
    presentations: '/info-hub/presentations',
    speeches: '/info-hub/speeches',
    newsletters: '/info-hub/newsletters',
  },

  gallery: {
    root: '/gallery',
    photos: '/gallery/photos',
    videos: '/gallery/videos',
  },

  opportunities: {
    root: '/opportunities',
    jobs: '/opportunities/jobs',
    internships: '/opportunities/internships',
    tenders: '/opportunities/tenders',
    cvRepository: '/opportunities/cv-repository',
  },

  auth: {
    login: '/login',
    register: '/register',
    forgotPassword: '/forgot-password',
    resetPassword: '/reset-password',
  },

  member: '/member',
  admin: '/admin',
} as const;
