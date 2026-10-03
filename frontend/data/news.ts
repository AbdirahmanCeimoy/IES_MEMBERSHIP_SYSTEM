import type { NewsItem } from '@/components/public/NewsCard';
import { routes } from '@/config/routes';

/**
 * Announcements sit in their own section on the homepage ("Latest
 * Announcements") — they are calls to action from IES or its partners,
 * not routine news items.
 */
export const latestAnnouncements: NewsItem[] = [
  {
    title: '2027 WFEO Hackathon Registration Is Now Open!',
    excerpt:
      'The WFEO Hackathon returns as part of the 2027 World Engineering Day for Sustainable Development. Engineering students and young engineers worldwide are invited to develop innovative solutions to sustainable transport challenges.',
    date: '2027',
    href: `${routes.infoHub.news}/wfeo-hackathon-2027`,
    category: 'Announcement',
    image: '/PARTNER-WFOE.jpeg',
  },
  {
    title: 'International Women in Engineering Day (INWED2026) — Coming Soon',
    excerpt:
      'IES, through its Women Engineers Committee (WEC), is pleased to organize INWED2026 under the theme "Engineering Intelligence" — hosted by Jamhuriya University of Science and Technology on 23 June 2026.',
    date: '23 Jun 2026',
    href: `${routes.infoHub.news}/inwed-2026`,
    category: 'Announcement',
    image: '/International Women in Engineering Day (INWED2026).jpeg',
  },
  {
    title: 'IES Co-Organizes World Environment Day 2026 Program',
    excerpt:
      'IES will participate as a Co-Organizer of the World Environment Day 2026 program with Benadir University and the Ministry of Environment and Climate Change (MoECC), under the theme "Inspired by Nature, for Climate, for Our Future."',
    date: '2026',
    href: `${routes.infoHub.news}/world-environment-day-2026`,
    category: 'Announcement',
    image: '/IES Co-Organizes World Environment Day 2026 Program.jpeg',
  },
  {
    title: 'International Women in Engineering Day (INWED2025) — Coming Soon',
    excerpt:
      'Join IES Women Engineers Committee (WEC) on 23 June 2025 to celebrate the brilliant and resilient women shaping the future of engineering in Somalia and beyond, under the theme "Together We Engineer."',
    date: '23 Jun 2025',
    href: `${routes.infoHub.news}/inwed-2025`,
    category: 'Announcement',
    image: '/International Women in Engineering Day (INWED2025).jpeg',
  },
];

/** IES DECISION REQUIRED: replace with dynamic API-driven news feed. */
export const featuredNews: NewsItem[] = [
   {
    title: 'IES Participated in SORECA and Ministry of Public Works Meeting on Infrastructure and Urban Development',
    excerpt:
      'IES leadership, led by President Eng. Omar Abdi Arab and Vice President Eng. Bashir Ali Hussein, joined a strategic meeting between SORECA and the Ministry of Public Works, Reconstruction and Housing to advance Somalia’s infrastructure and urban development.',
    date: '15 Apr 2026',
    href: `${routes.infoHub.news}/ministry-public-works-meeting`,
    category: 'Collaboration',
    image: '/PARTNER-SORECA.jpeg',
  },

  {
    title: 'IES Signs MoU with Benadir University (BU)',
    excerpt:
      'IES and Benadir University signed an MoU to strengthen cooperation in engineering education, professional training, research, innovation and continuing professional development.',
    date: '01 Jan 2026',
    href: `${routes.infoHub.news}/mou-benadir`,
    category: 'Partnership',
    image: '/parterner-Banadir-University.jpeg',
  },
 
 
  {
    title: 'IES Signs MoU with Jamhuriya University of Science and Technology (JUST)',
    excerpt:
      'On 18 December 2025, IES and Jamhuriya University signed a Memorandum of Understanding to establish a framework for collaboration in engineering education, research, innovation and professional development.',
    date: '18 Dec 2025',
    href: `${routes.infoHub.news}/mou-just`,
    category: 'Partnership',
    image: '/parterner-jamhuriya-University.jpeg',
  },
  {
    title: 'IES Signs MoU with Jazeera University (JU)',
    excerpt:
      'IES and Jazeera University signed an MoU to enhance cooperation in engineering education, professional development, innovation and knowledge exchange.',
    date: '20 Dec 2025',
    href: `${routes.infoHub.news}/mou-jazeera`,
    category: 'Partnership',
    image: '/parterner-jazeraUniversity.jpeg',
  },
  {
    title: 'IES Signs MoU with Salaam University (SU)',
    excerpt:
      'IES and Salaam University signed an MoU to strengthen cooperation in engineering education, professional development, research and knowledge exchange.',
    date: '31 Dec 2025',
    href: `${routes.infoHub.news}/mou-salaam`,
    category: 'Partnership',
    image: '/slaaam-University.jpeg',
  },
  {
    title: 'IES Vice President Participated in the 32nd IEK International Convention in Mombasa, Kenya',
    excerpt:
      'IES was honored to participate in the 32nd IEK International Convention held at PrideInn Paradise Beach Resort, Mombasa, Kenya — one of the region\'s premier gatherings of engineering professionals, policymakers and innovators from across Africa.',
    date: '28 Nov 2025',
    href: `${routes.infoHub.news}/iek-32nd-convention-mombasa`,
    category: 'International Participation',
    image: '/IES Vice President Participated in the 32nd IEK International Convention in Mombasa, Kenya.jpeg',
  },
  {
    title: 'IES Leadership Attended the Inauguration of Benadir Steel Ltd.',
    excerpt:
      'IES leadership attended the inauguration of Benadir Steel Ltd., officially opened by H.E. President Hassan Sheikh Mohamud — a step toward strengthening local manufacturing and industrial self-reliance in Somalia.',
    date: '08 Nov 2025',
    href: `${routes.infoHub.news}/benadir-steel-inauguration`,
    category: 'Industrial Development',
    image: '/IES Leadership Attended the Inauguration of Benadir Steel Ltd.jpeg',
  },
  {
    title: 'IES Participated in the WFEO Engineering Capacity Building for Africa Programme in Nairobi',
    excerpt:
      'IES participated in the launch of the WFEO Engineering Capacity Building for Africa Programme (ECBAP), held in Nairobi, Kenya in collaboration with WFEO, IEK, EBK and CAST — supporting the training of over 100,000 engineers across Africa.',
    date: '17 Mar 2025',
    href: `${routes.infoHub.news}/wfeo-ecbap-nairobi`,
    category: 'Capacity Building',
    image: '/IES Participated in the WFEO Engineering Capacity Building for Africa Programme in Nairobi.jpeg',
  },
  {
    title: 'IES President Attended B2B Panel Discussion',
    excerpt:
      'IES, led by President Eng. Omar Abdi Arab, attended the B2B Panel Discussion organized by Arkaan Leadership and Innovation Hub — bringing together professionals for discussions on business, technology, industry collaboration and innovation.',
    date: '13 Feb 2025',
    href: `${routes.infoHub.news}/b2b-panel-discussion-arkaan`,
    category: 'Industry Engagement',
    image: '/IES President Attended B2B Panel Discussion.jpeg',
  },
  {
    title: 'IES Vice President Participated in COP29 in Baku, Azerbaijan',
    excerpt:
      'IES was represented at the 29th United Nations Climate Change Conference (COP29) in Baku by Vice President Eng. Bashir Ali Hussein, engaging with international organizations on climate resilience, sustainability and the role of engineering.',
    date: '22 Nov 2024',
    href: `${routes.infoHub.news}/cop29-baku`,
    category: 'International Participation',
    image: '/IES Vice President Participated in COP29 in Baku, Azerbaijan.jpeg',
  },
];
