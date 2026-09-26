import type { NewsItem } from '@/components/public/NewsCard';
import { routes } from '@/config/routes';

/** IES DECISION REQUIRED: replace with dynamic API-driven news feed. */
export const featuredNews: NewsItem[] = [
   {
    title: '2027 WFEO Hackathon Registration Is Now Open!',
    excerpt:
      'The #WFEOHackathon is back as part of the 2027 World Engineering Day for Sustainable Development celebrations! Engineering students and young engineers are invited to develop innovative solutions to sustainable transport challenges.',
    date: '2027',
    href: `${routes.infoHub.news}/wfeo-hackathon-2027`,
    category: 'Announcement',
    image: '/PARTNER-WFOE.jpeg',
  },
   {
    title: 'IES Meets with Ministry of Public Works, Reconstruction and Housing',
    excerpt:
      'IES leadership participated in a meeting with the Ministry of Public Works, Reconstruction and Housing alongside SORECA to strengthen collaboration on infrastructure and urban development in Somalia.',
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
  
];
