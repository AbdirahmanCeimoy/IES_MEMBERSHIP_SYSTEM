import type { NewsItem } from '@/components/public/NewsCard';
import { routes } from '@/config/routes';

/** IES DECISION REQUIRED: replace with dynamic API-driven news feed. */
export const featuredNews: NewsItem[] = [
  {
    title: 'IES Signs MoU with Jamhuriya University of Science and Technology (JUST)',
    excerpt:
      'On 18 December 2025, IES and Jamhuriya University signed a Memorandum of Understanding to establish a framework for collaboration in engineering education, research, innovation and professional development.',
    date: '18 Dec 2025',
    href: `${routes.infoHub.news}/mou-just`,
    category: 'Partnership',
  },
  {
    title: 'IES Signs MoU with Jazeera University',
    excerpt:
      'IES and Jazeera University signed an MoU to enhance cooperation in engineering education, professional development, innovation and knowledge exchange.',
    date: '20 Dec 2025',
    href: `${routes.infoHub.news}/mou-jazeera`,
    category: 'Partnership',
  },
  {
    title: 'IES Signs MoU with Salaam University',
    excerpt:
      'IES and Salaam University signed an MoU to strengthen cooperation in engineering education, professional development, research and knowledge exchange.',
    date: '31 Dec 2025',
    href: `${routes.infoHub.news}/mou-salaam`,
    category: 'Partnership',
  },
  {
    title: 'IES Signs MoU with Benadir University',
    excerpt:
      'IES and Benadir University signed an MoU to strengthen cooperation in engineering education, professional training, research, innovation and continuing professional development.',
    date: '01 Jan 2026',
    href: `${routes.infoHub.news}/mou-benadir`,
    category: 'Partnership',
  },
];
