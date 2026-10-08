export interface PanelDiscussion {
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
  video?: string;
  concluded?: boolean;
  contactEmail?: string;
  contactName?: string;
}

export const panelDiscussions: PanelDiscussion[] = [
  {
    slug: 'community-development-waste-management-banadir-2025',
    day: '01',
    monthYear: 'May 2025',
    date: '01 May 2025',
    category: 'Panel Discussion',
    title:
      'Advancing Community Development by Reducing the Climate Impacts of Poor Waste Management in Banadir Region',
    cardDescription:
      'Hosted by IES, this panel discussion brought together engineers, community stakeholders and a moderator to explore waste management challenges, their environmental and climate impacts, and practical approaches to sustainable waste management in Banadir.',
    fullDescription: [
      'On 1 May 2025, the Institution of Engineers Somalia (IES) hosted a Panel Discussion on “Advancing Community Development by Reducing the Climate Impacts of Poor Waste Management in Banadir Region.”',
      'The discussion brought together professionals and community stakeholders to explore the challenges of waste management, its environmental and climate impacts, and practical approaches to promoting sustainable waste management and community development in Banadir.',
      'The panel featured Abdishakur Abdirahman Mohamud (Daaha), Eng. Ibrahim Moalim Ali, Eng. Ayan Muse Osman, and Abshir Mohamed Jimale, with Eng. Yusuf Abukar Osman serving as the moderator.',
    ],
    cardImage: '/Events-past/Panel Discussions/Panel Discussions-poster.jpeg',
    heroImage: '/Events-past/Panel Discussions/Panel Discussions-poster.jpeg',
    photos: [
      // Start with the speaker-at-podium shot the user specified as #1
      '/Events-past/Panel Discussions/Panel 0.jpeg',
      '/Events-past/Panel Discussions/Panel 2.jpeg',
      '/Events-past/Panel Discussions/Panel 3.jpeg',
      '/Events-past/Panel Discussions/panel 4.jpeg',
      '/Events-past/Panel Discussions/Panel 5.jpeg',
      '/Events-past/Panel Discussions/Panel 6.jpeg',
      '/Events-past/Panel Discussions/Panel 7.jpeg',
      '/Events-past/Panel Discussions/Panel 8.jpeg',
      // '/Events-past/Panel Discussions/Panel 9.jpeg',
      '/Events-past/Panel Discussions/Panel 10.jpeg',
      '/Events-past/Panel Discussions/Panel 11.jpeg',
      '/Events-past/Panel Discussions/Panel 12.jpeg',
      '/Events-past/Panel Discussions/Panel 13.jpeg',
      '/Events-past/Panel Discussions/Panel 14.jpeg',
      '/Events-past/Panel Discussions/Panel 15.jpeg',
      '/Events-past/Panel Discussions/Panel 16.jpeg',
    ],
    video: '/Events-past/Panel Discussions/videos/Panel Discussions.mp4',
    concluded: true,
    contactEmail: 'info@iesomalia.org.so',
    contactName: 'IES',
  },
];

export const findPanelDiscussion = (slug: string) =>
  panelDiscussions.find((p) => p.slug === slug);
