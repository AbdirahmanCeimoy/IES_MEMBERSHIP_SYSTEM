export interface GalleryVideo {
  slug: string;
  title: string;
  description: string[];
  videoSrc: string;
  date?: string;
  category?: string;
}

/**
 * Videos displayed on /gallery/videos — in the order shown below.
 * Drop MP4 files under `frontend/public/videos/` and reference them here.
 */
export const galleryVideos: GalleryVideo[] = [
  {
    slug: 'wed2025-event-highlights',
    title: 'World Engineering Day (WED2025) - Event Highlights',
    category: 'Event Coverage',
    description: [
      'A brief report highlighting the World Engineering Day 2025 (WED2025) celebration organized by the Institution of Engineers Somalia (IES), showcasing key moments, activities, and highlights from the event.',
    ],
    videoSrc: '/videos/WorldEngineeringDayWED025.mp4',
  },
  {
    slug: 'wfeo-ecbap-first-participation',
    title: 'Somalia Participated for the First Time in the WFEO Engineering Capacity Building Programme (ECBAP)',
    category: 'International',
    description: [
      'Somalia participated for the first time in the WFEO Engineering Capacity Building Programme (ECBAP), a regional initiative aimed at strengthening engineering knowledge, capacity, and professional development across Africa.',
      'The President of the Institution of Engineers Somalia (IES), Eng. Omar Abdi Arab, spoke to the Somali National Television (SNTV) about the importance of the programme and the significance of Somalia’s participation in this important regional engineering forum.',
    ],
    videoSrc: '/videos/Somalia Participated for the First Time in the WFEO Engineering Capacity Building Programme.mp4',
  },
  {
    slug: 'ies-and-wed2025-overview',
    title: 'The Institution of Engineers Somalia (IES) & World Engineering Day (WED2025)',
    category: 'Institutional',
    description: [
      'This video provides a brief overview of the Institution of Engineers Somalia (IES) and highlights the significance of World Engineering Day (WED2025), including its purpose, importance, and the role of engineering in shaping a sustainable future.',
    ],
    videoSrc: '/videos/The Institution of Engineers Somalia IES.mp4',
  },
  {
    slug: 'ies-soreca-mopw-meeting',
    title: 'IES Participated in SORECA and Ministry of Public Works Meeting on Infrastructure and Urban Development',
    category: 'Partnership',
    description: [
      'The Institution of Engineers Somalia (IES), led by President Eng. Omar Abdi Arab and Vice President Eng. Bashir Ali Hussein, participated in an important meeting between the Somali Real Estate and Construction Association (SORECA) and the Ministry of Public Works, Reconstruction and Housing, Somalia.',
      'The meeting was attended by the Minister of Public Works, Reconstruction and Housing, H.E. Hon. Ayub Ismail Yusuf, alongside the Chairman and Board Members of the Somali Real Estate and Construction Association (SORECA).',
      'The discussions focused on strengthening collaboration and consultation on infrastructure development, urban development, and the construction sector in Somalia.',
      'The meeting aimed to enhance cooperation between the Ministry and SORECA and to align efforts toward advancing Somalia’s infrastructure and urban development. Participants also emphasized the importance of establishing an effective framework for collaboration that can contribute to improving the quality, growth, and regulation of Somalia’s construction sector.',
    ],
    videoSrc: '/videos/IES Participated in SORECA and Ministry of Public Works Meeting on Infrastructure and Urban Development.mp4',
  },
  {
    slug: 'inwed2025-government-officials',
    title: 'Government Officials Attend INWED2025 Celebration in Mogadishu, Organized by the Institution of Engineers Somalia (IES)',
    category: 'Event Coverage',
    date: '23 June 2025',
    description: [
      'Officials from the Federal Government of Somalia attended the commemoration of International Women in Engineering Day (INWED2025), held in Mogadishu on 23 June 2025.',
      'The event was organized by the Institution of Engineers Somalia (IES) - Women Engineers Committee (WEC) to recognize and celebrate the contributions of women in engineering and to promote greater participation of women and girls in the engineering profession.',
      'The celebration brought together government representatives, engineers, professionals, academics, and other stakeholders to highlight the important role women engineers play in Somalia’s development and to encourage greater opportunities for women in the engineering sector.',
      'Held under the theme “Together We Engineer,” the event emphasized the importance of collaboration, inclusion, and collective action in strengthening the engineering profession and supporting sustainable development.',
      'The event also received media coverage from Somali National Television (SNTV), which featured the occasion and highlighted its significance in promoting women’s participation in engineering.',
    ],
    videoSrc: '/videos/International Women in Engineering Day (INWED2025).mp4',
  },
];
