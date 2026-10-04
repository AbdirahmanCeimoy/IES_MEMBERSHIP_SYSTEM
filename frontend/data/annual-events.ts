export interface AnnualEvent {
  slug: string;
  parent: 'world-engineering-day' | 'international-women-engineering-day' | 'world-environment-day';
  year: number;
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
  activities?: string[];
  cardImage: string;
  heroImage: string;
  photos?: string[];
  video?: string;
  concluded?: boolean;
  contactEmail?: string;
  contactName?: string;
}

const WED_PHOTO_ROOT = '/World Enviromental day celebration';
const WED_2025_PHOTO_ROOT = '/WED-2025';
const WED_2026_PHOTO_ROOT = '/(WED2026)';
const INWED_PHOTO_ROOT = '/Women in Engineering Day (INWED2026)';
const INWED_2025_PHOTO_ROOT = '/(INWED2025)';

export const annualEvents: AnnualEvent[] = [
  {
    slug: 'world-engineering-day-2025',
    parent: 'world-engineering-day',
    year: 2025,
    day: '04',
    monthYear: 'March 2025',
    date: '04 March 2025',
    time: '4:00 PM – 8:00 PM',
    venue: 'Jazeera Hotel, Airport Street, Wadajir District, Mogadishu',
    category: 'Annual Event',
    title: "Somali's 1st World Engineering Day (WED2025) Celebration",
    cardDescription:
      'IES celebrated the first World Engineering Day in Somalia under the theme “Shaping a Sustainable Future Through Engineering.”',
    fullDescription: [
      'The Institution of Engineers Somalia (IES) successfully organized the Somali\'s First World Engineering Day (WED2025) Celebration under the theme “Shaping a Sustainable Future Through Engineering.”',
      'The celebration was held at Jazeera Hotel, Airport Street, Wadajir District, Mogadishu, from 4:00 PM to 8:00 PM, and brought together more than 250 participants, including engineers, engineering professionals, students, academics, government representatives, development partners, and other stakeholders.',
      'The event provided an important platform to recognize the vital role of engineering in sustainable development, innovation, infrastructure development, and addressing Somalia’s development challenges.',
      'The celebration highlighted the contribution of engineers and the engineering profession to building a more sustainable, resilient, and innovative future for Somalia and the world.',
      'Through the successful organization of World Engineering Day 2025, IES reaffirmed its commitment to advancing the engineering profession in Somalia, promoting professional collaboration, encouraging innovation, and supporting engineering solutions for sustainable national development.',
    ],
    activities: [
      'Opening Ceremony',
      'Keynote Address',
      'Welcome and Remarks from IES Leadership',
      'Presentations on Engineering and Sustainable Development',
      'Technical and Professional Discussions',
      'Panel Discussions and Interactive Sessions',
      'Recognition of the Contribution of Engineers to Somalia’s Development',
      'Networking and Professional Engagement',
      'Closing Remarks and Appreciation',
    ],
    cardImage: `${WED_2025_PHOTO_ROOT}/WED-2025-poster.jpeg`,
    heroImage: `${WED_2025_PHOTO_ROOT}/WED-2025-poster.jpeg`,
    photos: [...Array.from({ length: 7 }, (_, index) => index + 1), ...Array.from({ length: 50 }, (_, index) => index + 9)].map(
      (number) => `${WED_2025_PHOTO_ROOT}/WED-2025-${number}.jpeg`,
    ),
    video: `${WED_2025_PHOTO_ROOT}/video/WED-2025-.mp4`,
    concluded: true,
    contactEmail: 'info@iesomalia.org.so',
    contactName: 'IES Secretariat',
  },
  {
    slug: 'world-engineering-day-2026',
    parent: 'world-engineering-day',
    year: 2026,
    day: '04',
    monthYear: 'March 2026',
    date: '04 March 2026',
    time: '3:00 PM – 6:00 PM',
    venue: 'Grand Café, Airport Hotel, Wadajir District, Mogadishu',
    category: 'Annual Event',
    title: 'Somalia’s 2nd World Engineering Day (WED2026) Celebration',
    cardDescription:
      'IES celebrated Somalia’s Second World Engineering Day under the theme “Smart Engineering for a Sustainable Future Through Innovation & Digital Transformation.”',
    fullDescription: [
      'The Institution of Engineers Somalia (IES) successfully organized Somalia’s Second World Engineering Day Celebration (WED2026) under the theme “Smart Engineering for a Sustainable Future Through Innovation & Digital Transformation.”',
      'The celebration was held at Grand Café, Airport Hotel, Wadajir District, Mogadishu, from 3:00 PM to 6:00 PM, bringing together engineers, engineering professionals, students, academics, government representatives, development partners, and other stakeholders.',
      'The event provided an important platform to recognize the vital role of engineering in promoting innovation, digital transformation, sustainable development, and practical solutions to Somalia’s development challenges.',
      'The celebration highlighted the contribution of engineers and the engineering profession to advancing smart, innovative, and sustainable solutions for Somalia’s development.',
      'Through the successful organization of Somalia’s Second World Engineering Day Celebration, IES reaffirmed its commitment to advancing the engineering profession, promoting innovation and digital transformation, strengthening professional collaboration, and supporting engineering solutions for a sustainable future.',
    ],
    activities: [
      'Opening Ceremony',
      'Keynote Address',
      'Welcome Remarks from IES Leadership',
      'Presentations on Smart Engineering, Innovation and Digital Transformation',
      'Technical and Professional Discussions',
      'Panel Discussions and Interactive Sessions',
      'Discussion on the Future of Engineering in Somalia',
      'Networking and Professional Engagement',
      'Closing Remarks and Appreciation',
    ],
    cardImage: `${WED_2026_PHOTO_ROOT}/(WED2026)-poster.jpeg`,
    heroImage: `${WED_2026_PHOTO_ROOT}/(WED2026)-poster.jpeg`,
    photos: Array.from({ length: 49 }, (_, index) => `${WED_2026_PHOTO_ROOT}/(WED2026)-${index + 1}.jpeg`),
    video: `${WED_2026_PHOTO_ROOT}/video/Ies High W E D.mp4`,
    concluded: true,
    contactEmail: 'info@iesomalia.org.so',
    contactName: 'IES Secretariat',
  },
  {
    slug: 'world-environment-day-2026',
    parent: 'world-environment-day',
    year: 2026,
    day: '03',
    monthYear: 'June 2026',
    date: '03 June 2026',
    time: '8:30 AM – 11:00 AM',
    venue: '3rd Floor, Seminar Hall, Prof. Addow Campus, Benadir University (BU)',
    category: 'Annual Event',
    title: 'World Environment Day Celebration 2026',
    cardDescription:
      'Co-organized by the Institution of Engineers Somalia (IES) with Benadir University and the Ministry of Environment and Climate Change (MoECC) under the theme "Inspired by Nature, for Climate, for Our Future."',
    fullDescription: [
      'On 3 June 2026, the Institution of Engineers Somalia (IES) joined Benadir University and the Ministry of Environment and Climate Change (MoECC) as a Co-Organizer of the World Environment Day 2026 celebration.',
      'The programme was held under the theme "Inspired by Nature, for Climate, for Our Future," bringing together students, academics, engineers, environmental professionals and other stakeholders to promote environmental awareness, climate action and nature-based solutions for a sustainable and resilient future.',
      'Activities on the day included tree planting and urban greening, environmental clean-up campaigns, waste-management and recycling awareness, climate change education, and discussions on sustainable cities and climate-resilient infrastructure.',
    ],
    cardImage: `${WED_PHOTO_ROOT}/World Environment Day-poster.jpeg`,
    heroImage: `${WED_PHOTO_ROOT}/World Environment Day-poster.jpeg`,
    photos: Array.from({ length: 11 }, (_, i) => `${WED_PHOTO_ROOT}/World Environment Day-${i + 1}.jpeg`),
    /**
     * To wire up the recording: drop the MP4 at
     *   frontend/public/World Enviromental day celebration/videos/World Environment Day.mp4
     * (or change the path below to wherever you save it).
     */
    video: `${WED_PHOTO_ROOT}/video/World Environment Day.mp4`,
    concluded: true,
    contactEmail: 'info@iesomalia.org.so',
    contactName: 'IES Secretariat',
  },
  {
    slug: 'international-women-engineering-day-2026',
    parent: 'international-women-engineering-day',
    year: 2026,
    day: '23',
    monthYear: 'June 2026',
    date: '23 June 2026',
    time: '3:00 PM – 6:00 PM',
    venue: 'JIC, Jamhuriya University, Campus 3, Opposite Dahab Tower',
    category: 'Annual Event',
    title: 'International Women in Engineering Day (INWED2026)',
    cardDescription:
      'IES, through its Women Engineering Committee (WEC), celebrated INWED2026 under the theme "Engineering Intelligence."',
    fullDescription: [
      'The Institution of Engineers Somalia (IES), through its Women Engineering Committee (WEC), proudly celebrated International Women in Engineering Day (INWED2026) under the theme “Engineering Intelligence.”',
      'The celebration highlighted the achievements and contributions of women engineers who are advancing innovation, addressing complex challenges, and contributing to sustainable development across Somalia.',
      'IES extends its sincere appreciation to the speakers, panelists, participants, partners, and supporters who contributed to making INWED26 a memorable and inspiring celebration.',
      'Together, we continue to promote innovation, empower future generations, and highlight the valuable impact of women in engineering.',
    ],
    cardImage: `${INWED_PHOTO_ROOT}/Women in Engineering Day (INWED2026)-poster.jpeg`,
    heroImage: `${INWED_PHOTO_ROOT}/Women in Engineering Day (INWED2026)-poster.jpeg`,
    photos: [1, 2, 3, 4, 6, 7, ...Array.from({ length: 15 }, (_, index) => index + 9)].map(
      (number) => `${INWED_PHOTO_ROOT}/Women in Engineering Day (INWED2026)-${number}.jpeg`,
    ),
    video: `${INWED_PHOTO_ROOT}/video/Women in Engineering Day (INWED2026).mp4`,
    concluded: true,
    contactEmail: 'info@iesomalia.org.so',
    contactName: 'IES Secretariat',
  },
  {
    slug: 'international-women-engineering-day-2025',
    parent: 'international-women-engineering-day',
    year: 2025,
    day: '23',
    monthYear: 'June 2025',
    date: '23 June 2025',
    time: '3:00 PM – 6:00 PM',
    venue: 'Arkaan Leadership and Innovation Hub Center',
    category: 'Annual Event',
    title: 'International Women in Engineering Day (INWED2025)',
    cardDescription:
      'IES, through its Women Engineering Committee (WEC), celebrated INWED2025 under the theme "Together We Engineer."',
    fullDescription: [
      'On 23 June 2025, the Institution of Engineers Somalia (IES), through its Women Engineering Committee (WEC), celebrated International Women in Engineering Day (INWED2025) under the theme “Together We Engineer.”',
      'The celebration brought together women engineers, engineering students, professionals, and key stakeholders, providing a platform to promote the participation, empowerment, and recognition of women in the engineering profession.',
      'The event highlighted the valuable contributions of women engineers to innovation, professional development, and sustainable development, while encouraging greater collaboration and opportunities for women across the engineering sector.',
    ],
    cardImage: `${INWED_2025_PHOTO_ROOT}/(INWED2025) under the theme “Together We Engineer-poster.jpeg`,
    heroImage: `${INWED_2025_PHOTO_ROOT}/(INWED2025) under the theme “Together We Engineer-poster.jpeg`,
    photos: [1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 20, 22, 23].map(
      (number) => `${INWED_2025_PHOTO_ROOT}/(INWED2025) under the theme “Together We Engineer-${number}.jpeg`,
    ),
    video: `${INWED_2025_PHOTO_ROOT}/video/(INWED2025)-video.mp4`,
    concluded: true,
    contactEmail: 'info@iesomalia.org.so',
    contactName: 'IES Secretariat',
  },
];

export const findAnnualEvent = (slug: string) =>
  annualEvents.find((e) => e.slug === slug);

export const annualEventsByParent = (parent: AnnualEvent['parent']) =>
  annualEvents.filter((e) => e.parent === parent);
