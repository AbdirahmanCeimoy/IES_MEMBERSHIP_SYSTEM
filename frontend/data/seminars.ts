export interface SeminarEvent {
  slug: string;
  day: string;
  monthYear: string;
  date: string;
  time?: string;
  venue?: string;
  venueMapHref?: string;
  category: string;
  title: string;
  cardDescription: string;
  fullDescription: string[];
  cardImage: string;
  heroImage: string;
  photos?: string[];
  concluded?: boolean;
  contactEmail?: string;
  contactName?: string;
}

export const seminars: SeminarEvent[] = [
  {
    slug: 'geotechnical-engineering-seminar-2026',
    day: '21',
    monthYear: 'November 2026',
    date: '21 November 2026',
    time: '3:30 PM – 6:00 PM',
    venue: 'Jowhara Hall',
    venueMapHref: 'https://maps.google.com/?q=Jowhara+Hall+Mogadishu',
    category: 'Seminar',
    title: 'The Role of Geotechnical Engineering in New Somalia',
    cardDescription:
      'Hosted by the IES Civil Engineering Division, this knowledge-sharing seminar explored how geotechnical engineering supports safe, resilient, and sustainable infrastructure development in Somalia, with insights from Prof. Abdulqadir Abikar Hussein, Rector of Almaas University.',
    fullDescription: [
      'On 21 November 2024, the Institution of Engineers Somalia (IES), through its Civil Engineering Division, successfully hosted a knowledge-sharing seminar on “The Role of Geotechnical Engineering in New Somalia.”',
      'The seminar featured Prof. Abdulqadir Abikar Hussein, Rector of Almaas University and a specialist in Minerals, Water, Energy, Geotechnics & Construction, who shared valuable insights into the role of geotechnical engineering in supporting safe, resilient, and sustainable infrastructure development in Somalia.',
      'The event brought together members of the engineering community for professional learning, knowledge exchange, and discussion on the future of geotechnical engineering in Somalia.',
    ],
    cardImage: '/events/geotechnical-engineering-seminar.jpg',
    heroImage: '/events/geotechnical-engineering-seminar-group.jpg',
    photos: [
      '/Events-past/phote-1.jpeg',
      '/Events-past/phote-2.jpeg',
      '/Events-past/phote-3.jpeg',
      '/Events-past/photo-4.jpeg',
      '/Events-past/photo-5.jpeg',
      '/Events-past/photo-6.jpeg',
      '/Events-past/Photo-7.jpeg',
      '/Events-past/Photo-8.jpeg',
      '/Events-past/Photo-9.jpeg',
      '/Events-past/Photo-10.jpeg',
    ],
    concluded: true,
    contactEmail: 'info@iesomalia.org.so',
    contactName: 'IES Civil Engineering Division',
  },
  {
    slug: 'ier-esg-capacity-building-2026',
    day: '14',
    monthYear: 'August 2026',
    date: '14 August 2026',
    category: 'Training',
    title:
      "IER's ESG Capacity-Building Training to Support Rwanda's Vision 2050 Goals for Sustainable and Resilient Development",
    cardDescription:
      'The Institute of Engineering Rwanda (IER) brought together engineering professionals for an Environmental, Social and Governance (ESG) capacity-building training equipping participants to apply ESG risks and opportunities in engineering and business decisions.',
    fullDescription: [
      'The Institute of Engineering Rwanda (IER) is bringing together engineering professionals for an Environmental, Social and Governance (ESG) capacity-building training.',
      'As ESG becomes increasingly important for investment, competitiveness, risk management and long-term resilience, the training is equipping participants with the knowledge and practical skills to understand ESG risks and opportunities and apply them in engineering and business decisions.',
      'Through practical exercises and case studies, participants will explore the Environmental, Social and Governance pillars, stakeholder expectations, enterprise risk and the perspectives of companies and investors. The goal is to strengthen professional capacity and support more sustainable, responsible and resilient infrastructure development in Rwanda.',
    ],
    cardImage: '/placeholders/photo-placeholder.svg',
    heroImage: '/placeholders/photo-placeholder.svg',
    concluded: true,
  },
];

export const findSeminar = (slug: string) => seminars.find((s) => s.slug === slug);
