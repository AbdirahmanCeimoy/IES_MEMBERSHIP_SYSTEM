export const routes = {
  home: '/',

  about: {
    root: '/about',

    whoWeAre: '/about/who-we-are',
    whatWeDo: '/about/what-we-do',
    honourBoard: '/about/honour-board',
    council: '/about/ies-council',
    advisoryCouncil: '/about/ies-advisory-council',
    committees: '/about/ies-committees',
    divisions: '/about/ies-engineering-divisions',
    secretariat: '/about/ies-secretariat',

    partners: {
      root: '/about/affiliation-partners',
      local: '/about/affiliation-partners/local-affiliation',
      international: '/about/affiliation-partners/international-affiliation',
    },

    boardNominations: '/about/nominations-by-ies-to-boards',

    governance: {
      root: '/about/governance-resources',

      iesDocuments: {
        root: '/about/governance-resources/ies-documents',
        byLaws: '/about/governance-resources/ies-documents/by-laws',
        policiesAndRegulations:
          '/about/governance-resources/ies-documents/policies-and-regulations',
        annualReports:
          '/about/governance-resources/ies-documents/annual-reports',
      },

      brochure: '/about/governance-resources/ies-brochure',

      constitution2026:
        '/about/governance-resources/ies-constitution-2026',

      codeOfProfessionalPractice:
        '/about/governance-resources/code-of-professional-practice-and-ethics',

      strategicPlan2026_2030:
        '/about/governance-resources/strategic-plan-2026-2030',
    },

    awards: '/about/ies-awards',
  },

  membership: {
    root: '/membership',

    becomeMember: '/membership/become-a-member',

    categories: '/membership/membership-categories',

    benefits: '/membership/membership-benefits',

    requirements: '/membership/membership-requirements',

    fees: '/membership/membership-fees-structure',

    applicationGuidelines:
      '/membership/online-application-guidelines',

    accountActivation:
      '/membership/account-activation',

    memberCheck:
      '/membership/member-check',

    professionalDevelopment: {
      root: '/membership/professional-development',

      eventsCalendar2026:
        '/membership/professional-development/ies-events-calendar-2026',

      trainingCalendar2026:
        '/membership/professional-development/ies-training-calendar-2026',
    },

    complaintSubmission:
      '/membership/complaint-submission-form',
  },

  events: {
    root: '/events',

    annualEvents: {
      root: '/events/annual-events',

      worldEngineeringDay: {
        root: '/events/annual-events/world-engineering-day',

        year2025:
          '/events/annual-events/world-engineering-day/2025',

        year2026:
          '/events/annual-events/world-engineering-day/2026',

        year2027:
          '/events/annual-events/world-engineering-day/2027',
      },

      internationalWomenInEngineeringDay: {
        root:
          '/events/annual-events/international-women-in-engineering-day',

        year2025:
          '/events/annual-events/international-women-in-engineering-day/2025',

        year2026:
          '/events/annual-events/international-women-in-engineering-day/2026',

        year2027:
          '/events/annual-events/international-women-in-engineering-day/2027',
      },

      others:
        '/events/annual-events/others',
    },

    programmes: {
      root: '/events/programmes',

      seminars:
        '/events/programmes/seminars',

      training:
        '/events/programmes/training',

      conferences:
        '/events/programmes/conferences',

      cpdCourses:
        '/events/programmes/cpd-courses',

      others:
        '/events/programmes/others',
    },
  },

  infoHub: {
    root: '/info-hub',

    news:
      '/info-hub/news',

    announcements:
      '/info-hub/announcements',

    publications:
      '/info-hub/publications',

    magazine:
      '/info-hub/engineering-in-somalia-magazine',

    conferencePapers:
      '/info-hub/conference-papers-reports',

    resources:
      '/info-hub/engineering-resources',

    documentary:
      '/info-hub/documentary',

    presentations:
      '/info-hub/presentations',

    speeches:
      '/info-hub/speeches',

    newsletters:
      '/info-hub/weekly-newsletters',
  },

  gallery: {
    root: '/gallery',
    photos: '/gallery/photos',
    videos: '/gallery/videos',
  },

  opportunities: {
    root: '/opportunities',

    jobs: {
      root: '/opportunities/jobs',

      iesCareer:
        '/opportunities/jobs/ies-career',

      partnerOrganizationCareers:
        '/opportunities/jobs/partner-organization-careers',
    },

    internships:
      '/opportunities/internships',

    tenders: {
      root: '/opportunities/tenders',

      iesTenders:
        '/opportunities/tenders/ies-tenders',

      partnerOrganizationTenders:
        '/opportunities/tenders/partner-organization-tenders',
    },

    cvRepository: {
      root: '/opportunities/cv-repository',

      submitCV:
        '/opportunities/cv-repository/submit-cv',

      viewCVs:
        '/opportunities/cv-repository/view-cvs',
    },
  },

  merchandise: {
    root: '/merchandise',
    store: '/merchandise',
  },

  contact: '/contact',

  auth: {
    login: '/login',
    register: '/register',
    forgotPassword: '/forgot-password',
    resetPassword: '/reset-password',
  },

  member: '/member',

  admin: '/admin',
} as const;
