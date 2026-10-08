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
  /**
   * Public URL of the MP4 recording. When set, a "View Video" button appears
   * on both the card and the detail page, and the /video/[slug] page becomes
   * accessible. Convention: drop files under
   * `frontend/public/Events-past/videos/<slug>.mp4`.
   */
  video?: string;
  concluded?: boolean;
  contactEmail?: string;
  contactName?: string;
}

/**
 * Seminars are listed in chronological order (oldest first).
 *
 * To replace a placeholder seminar with real content:
 *   1. Edit the matching entry below (slug stays the same, URLs stay the same).
 *   2. Drop images under `public/events/<slug>/` (e.g. card.jpg, hero.jpg,
 *      photo-1.jpg … photo-10.jpg) and update the `cardImage`, `heroImage`
 *      and `photos` fields to point to those paths.
 *   3. Fill `title`, `cardDescription`, `fullDescription`, date and venue.
 *
 * Removing a seminar: delete its entry - the list card, detail page and
 * photos page all disappear automatically.
 */
const PLACEHOLDER_IMAGE = '/placeholders/photo-placeholder.svg';
const makePlaceholderPhotos = (n = 10) => Array.from({ length: n }, () => PLACEHOLDER_IMAGE);

export const seminars: SeminarEvent[] = [
  // ─── 2024 ──────────────────────────────────────────────────────────────
  {
    slug: 'geotechnical-engineering-seminar-2026',
    day: '21',
    monthYear: 'November 2024',
    date: '21 November 2024',
    time: '3:30 PM - 6:00 PM',
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
    cardImage: '/Events-past/Events-past-2024.jpeg',
    heroImage: '/Events-past/Events-past-2024.jpeg',
    photos: [
      '/Events-past/phote-1.jpeg',
      '/Events-past/photo-5.jpeg',
      '/Events-past/photo-16.jpeg',
      '/Events-past/photo-13.jpeg',
      '/Events-past/Photo-10.jpeg',
      '/Events-past/Photo-7.jpeg',
      '/Events-past/photo-15.jpeg',
      '/Events-past/photo-14.jpeg',
      '/Events-past/phote-2.jpeg',
      '/Events-past/phote-3.jpeg',
      '/Events-past/photo-4.jpeg',
      '/Events-past/photo-12jpeg.jpeg',
      '/Events-past/Photo-8.jpeg',
      '/Events-past/Photo-9.jpeg',
      '/Events-past/photo-11.jpeg',
    ],
    video: '/Events-past/video/The Role of Geotechnical Engineering in New Somalia.mp4',
    concluded: true,
    contactEmail: 'info@iesomalia.org.so',
    contactName: 'IES Civil Engineering Division',
  },
  {
    slug: 'seminar-placeholder-2',
    day: '05',
    monthYear: 'December 2024',
    date: '05 December 2024',
    time: '3:30 PM - 6:00 PM',
    venue: 'Primo Palace',
    category: 'Seminar',
    title: 'Potential of Renewable Energy in Somalia',
    cardDescription:
      'Hosted by the Institution of Engineers Somalia (IES), this seminar explored Somalia’s renewable energy potential and opportunities for sustainable energy development, featuring Associate Professor Ts. Dr. Abdulrashid Omar Mumin.',
    fullDescription: [
      'On 5 December 2024, the Institution of Engineers Somalia (IES) hosted a seminar on “Potential of Renewable Energy in Somalia.”',
      'The seminar featured Associate Professor Ts. Dr. Abdulrashid Omar Mumin, a researcher and specialist in Renewable Energy and Sustainable Energy Systems, who shared valuable insights into Somalia’s renewable energy potential and opportunities for sustainable energy development.',
      'The event brought together members of the engineering community for professional learning, knowledge exchange, and discussion on the future of renewable energy in Somalia.',
    ],
    cardImage: '/Events-past/Seminar-2-photes/Potential of Renewable Energy in Somalia-poster.jpeg',
    heroImage: '/Events-past/Seminar-2-photes/Potential of Renewable Energy in Somalia-poster.jpeg',
    photos: [
      '/Events-past/Seminar-2-photes/Potential of Renewable Energy in Somalia-1.jpeg',
      '/Events-past/Seminar-2-photes/potential of Renewable Energy in Somalia-10.jpeg',
      '/Events-past/Seminar-2-photes/Potential of Renewable Energy in Somalia-3.jpeg',
      '/Events-past/Seminar-2-photes/potential of Renewable Energy in Somalia-11.jpeg',
      '/Events-past/Seminar-2-photes/Potential of Renewable Energy in Somalia-2.jpeg',
      '/Events-past/Seminar-2-photes/Potential of Renewable Energy in Somalia-5.jpeg',
      '/Events-past/Seminar-2-photes/Potential of Renewable Energy in Somalia-4.jpeg',
      '/Events-past/Seminar-2-photes/Potential of Renewable Energy in Somalia-7.jpeg',
      '/Events-past/Seminar-2-photes/Potential of Renewable Energy in Somalia-8.jpeg',
      '/Events-past/Seminar-2-photes/Potential of Renewable Energy in Somalia-9.jpeg',
    ],
    video: '/Events-past/Seminar-2-photes/video/Potential of Renewable Energy in Somalia.mp4',
    concluded: true,
    contactEmail: 'info@iesomalia.org.so',
    contactName: 'IES',
  },
  {
    slug: 'seminar-placeholder-3',
    day: '26',
    monthYear: 'December 2024',
    date: '26 December 2024',
    time: '3:30 PM - 6:00 PM',
    venue: 'Rayaan Hotel',
    category: 'Seminar',
    title: 'Why Architecture Matters: Shaping Cities and Communities',
    cardDescription:
      'Hosted by the Institution of Engineers Somalia (IES), this seminar explored architecture’s role in shaping cities, communities, and the built environment, featuring Arch. Marwan Omar Hassan of Somali National University.',
    fullDescription: [
      'On 26 December 2024, the Institution of Engineers Somalia (IES) hosted a seminar titled “Why Architecture Matters: Shaping Cities and Communities.”',
      'The seminar featured Arch. Marwan Omar Hassan, Senior Architect and Senior Lecturer at Somali National University (SNU), specializing in Urban and Regional Planning, who shared valuable insights into the importance of architecture in shaping cities, communities, and the built environment.',
      'The seminar provided an opportunity for engineers, architects, students, and other professionals to gain knowledge, exchange ideas, and discuss the role of architecture in Somalia’s urban development.',
    ],
    cardImage: '/Events-past/seminar-3-photes/Shaping Cities and Communities-poster.jpeg',
    heroImage: '/Events-past/seminar-3-photes/Shaping Cities and Communities-poster.jpeg',
    photos: [
      '/Events-past/seminar-3-photes/Shaping Cities and Communities-poster-1.jpeg',
      '/Events-past/seminar-3-photes/Shaping Citeis and Communities-10.jpeg',
      '/Events-past/seminar-3-photes/Shaping Citeis and Communities-13.jpeg',
      '/Events-past/seminar-3-photes/Shaping Cities and Communities-poster-2.jpeg',
      '/Events-past/seminar-3-photes/Shaping Cities and Communities-poster-3.jpeg',
      '/Events-past/seminar-3-photes/Shaping Cities and Communities-poster-8.jpeg',
      '/Events-past/seminar-3-photes/Shaping Citeis and Communities-11.jpeg',
      '/Events-past/seminar-3-photes/Shaping Cities and Communities-poster-9.jpeg',
      '/Events-past/seminar-3-photes/Shaping Cities and Communities-poster-7.jpeg',
      '/Events-past/seminar-3-photes/Shaping Cities and Communities-poster-4.jpeg',
      '/Events-past/seminar-3-photes/Shaping Citeis and Communities-12.jpeg',
      '/Events-past/seminar-3-photes/Shaping Cities and Communities-poster-5.jpeg',
    ],
    video: '/Events-past/seminar-3-photes/video/Why Architecture Matters-Shaping Cities and Communities.mp4',
    concluded: true,
    contactEmail: 'info@iesomalia.org.so',
    contactName: 'IES',
  },

  // ─── 2025 ──────────────────────────────────────────────────────────────
  {
    slug: 'seminar-placeholder-9',
    day: '29',
    monthYear: 'January 2025',
    date: '29 January 2025',
    time: '07:00 PM - 09:00 PM',
    venue: 'Google Meet',
    category: 'Virtual Seminar',
    title: 'Understanding the Basics of GIS and Its Application',
    cardDescription:
      'A virtual seminar hosted by the IES Geological Engineering Division (GED), delivered by Eng. Mohamed Omar Yahye, a GIS & Remote Sensing Specialist, who provided an introduction to Geographic Information Systems (GIS) and explored their applications in engineering, planning, and related fields.',
    fullDescription: [
      'On 29 January 2025, the Institution of Engineers Somalia (IES) hosted a virtual seminar titled “Understanding the Basics of GIS and Its Application.”',
      'The seminar was delivered by Eng. Mohamed Omar Yahye, a GIS & Remote Sensing Specialist, who provided an introduction to Geographic Information Systems (GIS) and explored their applications in engineering, planning, and related fields.',
      'The online session provided participants with an opportunity to strengthen their understanding of GIS fundamentals and learn about its practical applications in professional practice.',
    ],
    cardImage: '/Events-past/Google-meating-seminars/Understanding the Basics of GIS and Its Application-poster.jpeg',
    heroImage: '/Events-past/Google-meating-seminars/Understanding the Basics of GIS and Its Application-poster.jpeg',
    concluded: true,
    contactEmail: 'info@iesomalia.org.so',
    contactName: 'IES Geological Engineering Division',
  },
  {
    slug: 'seminar-placeholder-10',
    day: '27',
    monthYear: 'May 2025',
    date: '27 May 2025',
    time: '3:30 PM - 6:00 PM',
    venue: 'Google Meet',
    category: 'Virtual Seminar',
    title: 'The Code of Ethics and Professional Conduct for Engineers',
    cardDescription:
      'A virtual seminar hosted by the Institution of Engineers Somalia (IES), delivered by Adj. Prof. M. Arkam C. Munaaim, PhD, exploring the ethical principles, professional responsibilities, and standards of conduct expected of engineers.',
    fullDescription: [
      'On 27 May 2025, the Institution of Engineers Somalia (IES) hosted a virtual seminar titled “The Code of Ethics and Professional Conduct for Engineers.”',
      'The seminar was delivered by Adj. Prof. M. Arkam C. Munaaim, PhD, PEPC, IntPE, FIEM, CBuildE (UK), FCAB (UK), ASEAN Eng, APEC Eng, SPANQP, REEM, CCPM, who shared valuable insights into the ethical principles, professional responsibilities, and standards of conduct expected of engineers.',
      'The session provided participants with an opportunity to strengthen their understanding of professional ethics and the importance of integrity, responsibility, and professional conduct in engineering practice.',
    ],
    cardImage: '/Events-past/GOOGLE-MEATING-2/Code of Ethics and Professional Conduct for Engineers.jpeg',
    heroImage: '/Events-past/GOOGLE-MEATING-2/Code of Ethics and Professional Conduct for Engineers.jpeg',
    concluded: true,
    contactEmail: 'info@iesomalia.org.so',
    contactName: 'IES',
  },
  {
    slug: 'seminar-placeholder-11',
    day: '07',
    monthYear: 'July 2025',
    date: '07 July 2025',
    time: '3:30 PM - 6:00 PM',
    venue: 'Google Meet',
    category: 'Virtual Webinar',
    title: 'Advancements in Modern Concrete Technology: Materials and Applications',
    cardDescription:
      'A virtual webinar hosted by the IES Civil Engineering Division (CED), delivered by Dr. Mohammed Mansour, PhD in Materials and Structural Engineering, who shared insights into recent advancements in concrete technology, modern materials, and their applications in construction and structural engineering.',
    fullDescription: [
      'On 7 July 2025, the Institution of Engineers Somalia (IES), through its Civil Engineering Division (CED), hosted a virtual webinar titled “Advancements in Modern Concrete Technology: Materials and Applications.”',
      'The webinar was delivered by Dr. Mohammed Mansour, PhD in Materials and Structural Engineering from UTHM, Malaysia, and CEO of Technical Administration and Engineering at Gaza University. He shared insights into recent advancements in concrete technology, modern materials, and their applications in construction and structural engineering.',
      'The session provided participants with an opportunity to enhance their technical knowledge and explore emerging developments in modern concrete materials and applications.',
    ],
    cardImage: '/Events-past/Google-Meat/Materials and Applications.jpeg',
    heroImage: '/Events-past/Google-Meat/Materials and Applications.jpeg',
    concluded: true,
    contactEmail: 'info@iesomalia.org.so',
    contactName: 'IES Civil Engineering Division',
  },
  {
    slug: 'seminar-placeholder-7',
    day: '30',
    monthYear: 'November 2025',
    date: '30 November 2025',
    time: '3:30 PM - 6:00 PM',
    venue: 'Google Meet',
    category: 'Virtual Webinar',
    title: 'Groundwater in Somalia: Management Challenges and Development Opportunities',
    cardDescription:
      'A virtual webinar hosted by the IES Civil Engineering Division (CED), bringing together Prof. Abdulkadir Abikar Hussein and Eng. Ahmed Abdirizak Dirie to explore groundwater management challenges, sustainable utilization, and opportunities for improving groundwater development in Somalia.',
    fullDescription: [
      'On 30 November 2025, the Institution of Engineers Somalia (IES), through its Civil Engineering Division (CED), hosted a virtual webinar titled “Groundwater in Somalia: Management Challenges and Development Opportunities.”',
      'The webinar brought together two distinguished professionals: Prof. Abdulkadir Abikar Hussein, Natural Resources Specialist, Rector of Almas University, and Honorary Member of IES, and Eng. Ahmed Abdirizak Dirie, Water Resources Engineer, GIS Expert, and Member of IES.',
      'The speakers explored key issues surrounding groundwater resources in Somalia, including management challenges, sustainable utilization, resource assessment, and opportunities for improving groundwater development to support communities and national development.',
      'The session provided an important platform for technical knowledge exchange and professional discussion on the sustainable management of Somalia’s groundwater resources.',
    ],
    cardImage: '/Events-past/google-meating/Challenges and Development Opportunities.jpeg',
    heroImage: '/Events-past/google-meating/Challenges and Development Opportunities.jpeg',
    concluded: true,
    contactEmail: 'info@iesomalia.org.so',
    contactName: 'IES Civil Engineering Division',
  },

  // ─── 2026 ──────────────────────────────────────────────────────────────
  {
    slug: 'seminar-placeholder-4',
    day: '21',
    monthYear: 'January 2026',
    date: '21 January 2026',
    time: '03:30 PM - 06:00 PM ',
    venue: '3rd Floor, Seminar Hall, Prof. Addow Campus, Benadir University (BU)',
    category: 'Seminar',
    title: 'Beyond the Degree: Essential Industry Skills for Future Engineers',
    cardDescription:
      'Hosted by the Institution of Engineers Somalia (IES) at Benadir University, this seminar explored the technical, professional, and industry-related skills future engineers need beyond academic qualifications. It was delivered by Eng. Abdulkadir Mohamed Hussein, Honorary Member of IES and Senior Civil Engineering Specialist.',
    fullDescription: [
      'On 21 January 2026, the Institution of Engineers Somalia (IES) organized an engineering seminar titled “Beyond the Degree: Essential Industry Skills for Future Engineers,” hosted by Benadir University (BU).”',
      'The seminar was delivered by Eng. Abdulkadir Mohamed Hussein, Honorary Member of IES and Senior Civil Engineering Specialist in Large-Scale Construction and Institutional Projects.',
      'The session focused on the essential technical, professional, and industry-related skills that future engineers need beyond academic qualifications, providing participants with practical insights into preparing for successful careers in the engineering and construction sectors.',
    ],
    cardImage: '/Events-past/Seminar-4-photes/Essential Industry Skills for Future Engineers-poster.jpeg',
    heroImage: '/Events-past/Seminar-4-photes/Essential Industry Skills for Future Engineers-poster.jpeg',
    photos: [
      '/Events-past/Seminar-4-photes/Essential Industry Skills for Future Engineers-1.jpeg',
      '/Events-past/Seminar-4-photes/Essential Industry Skills for Future Engineers-2.jpeg',
      '/Events-past/Seminar-4-photes/Essential Industry Skills for Future Engineers-3.jpeg',
      '/Events-past/Seminar-4-photes/Essential Industry Skills for Future Engineers-4.jpeg',
      '/Events-past/Seminar-4-photes/Essential Industry Skills for Future Engineers-5.jpeg',
      '/Events-past/Seminar-4-photes/Essential Industry Skills for Future Engineers-6.jpeg',
      '/Events-past/Seminar-4-photes/Essential Industry Skills for Future Engineers-7.jpeg',
      '/Events-past/Seminar-4-photes/Essential Industry Skills for Future Engineers-8.jpeg',
      '/Events-past/Seminar-4-photes/Essential Industry Skills for Future Engineers-9.jpeg',
      '/Events-past/Seminar-4-photes/Essential Industry Skills for Future Engineers-10.jpeg',
      '/Events-past/Seminar-4-photes/Essential Industry Skills for Future Engineers-11.jpeg',
      '/Events-past/Seminar-4-photes/Essential Industry Skills for Future Engineers-12.jpeg',
      '/Events-past/Seminar-4-photes/Essential Industry Skills for Future Engineers-13.jpeg',
      '/Events-past/Seminar-4-photes/Essential Industry Skills for Future Engineers-15.jpeg',
      '/Events-past/Seminar-4-photes/Essential Industry Skills for Future Engineers-16.jpeg',
    ],
    video: '/Events-past/Seminar-4-photes/video/Beyond the Degree-Essential .MP4',
    concluded: true,
    contactEmail: 'info@iesomalia.org.so',
    contactName: 'IES',
  },
  {
    slug: 'seminar-placeholder-8',
    day: '23',
    monthYear: 'May 2026',
    date: '23 May 2026',
    time: '4:00 PM - 6:00 PM',
    venue: 'Google Meet',
    category: 'Virtual Seminar',
    title: 'Enhancing Awareness of Career Opportunities for Women in the Engineering Sector',
    cardDescription:
      'A virtual seminar hosted by the IES Women Engineering Committee (WEC), delivered by Eng. Farhia Abdullahi Mohamud, Quality Manager at Blue Flag Energy Company, covering renewable energy, project management and career pathways for women in engineering.',
    fullDescription: [
      'On 23 May 2026, the Institution of Engineers Somalia (IES), through its Women Engineering Committee (WEC), hosted a virtual seminar titled “Enhancing Awareness of Career Opportunities for Women in the Engineering Sector.”',
      'The webinar was delivered by Eng. Farhia Abdullahi Mohamud, Quality Manager at Blue Flag Energy Company and an Electrical Engineer with over five years of experience in the renewable energy sector, specializing in the implementation and management of solar energy projects.',
      'The session covered key areas including renewable energy and solar power systems, solar energy project management, and Quality Management Systems (QMS). It also provided practical insights into career opportunities and professional development for women in engineering.',
      'The webinar was particularly valuable for female engineering students and professionals seeking to strengthen their practical skills and improve their competitiveness in the engineering job market.',
    ],
    cardImage: '/Events-past/google-meat-5aad/Opportunities for Women in the Engineering Sector.jpeg',
    heroImage: '/Events-past/google-meat-5aad/Opportunities for Women in the Engineering Sector.jpeg',
    concluded: true,
    contactEmail: 'info@iesomalia.org.so',
    contactName: 'IES Women Engineering Committee',
  },
  {
    slug: 'seminar-placeholder-5',
    day: '07',
    monthYear: 'June 2026',
    date: '07 June 2026',
    time: '9:00 AM - 11:00 AM ',
    venue: 'Innovation Hub, KPP Campus, Salaam University (SU)',
    category: 'Seminar',
    title: 'Preventing Structural Failures in Construction Projects: The Role of Structural Engineers',
    cardDescription:
      'Hosted by the Institution of Engineers Somalia (IES) in collaboration with Salaam University (SU), this seminar explored how structural engineers can prevent failures in construction projects. It was delivered by Eng. Abdishakur Abdullahi Mohamed, General Treasurer and Honorary Member of IES, Lecturer, and specialist in Structural Analysis and Finite Element Analysis (FEA).',
    fullDescription: [
      'On 7 June 2026, the Institution of Engineers Somalia (IES), in collaboration with Salaam University (SU), hosted a professional seminar titled “Preventing Structural Failures in Construction Projects: The Role of Structural Engineers.”',
      'The seminar was delivered by Eng. Abdishakur Abdullahi Mohamed, General Treasurer and Honorary Member of IES, Lecturer, and Specialist in Structural Analysis and Finite Element Analysis (FEA).',
      'The session focused on the role of structural engineers in preventing structural failures, with emphasis on structural analysis, design, safety, and quality control in construction projects. It provided participants with practical insights into strengthening structural engineering practices and promoting safer and more reliable construction.',
    ],
    cardImage: '/Events-past/seminar-5-photes/The Role of Structural Engineers-poster.jpeg',
    heroImage: '/Events-past/seminar-5-photes/The Role of Structural Engineers-poster.jpeg',
    photos: [
      '/Events-past/seminar-5-photes/The Role of Structural Engineers-1.jpeg',
      '/Events-past/seminar-5-photes/The Role of Structural Engineers-2.jpeg',
      '/Events-past/seminar-5-photes/The Role of Structural Engineers-3.jpeg',
      '/Events-past/seminar-5-photes/The Role of Structural Engineers-4.jpeg',
      '/Events-past/seminar-5-photes/The Role of Structural Engineers-5.jpeg',
      '/Events-past/seminar-5-photes/The Role of Structural Engineers-6.jpeg',
      '/Events-past/seminar-5-photes/The Role of Structural Engineers-7.jpeg',
      '/Events-past/seminar-5-photes/The Role of Structural Engineers-8.jpeg',
      '/Events-past/seminar-5-photes/The Role of Structural Engineers-9.jpeg',
      '/Events-past/seminar-5-photes/The Role of Structural Engineers-10.jpeg',
      '/Events-past/seminar-5-photes/The Role of Structural Engineers-12.jpeg',
    ],
    concluded: true,
    contactEmail: 'info@iesomalia.org.so',
    contactName: 'IES',
  },
  {
    slug: 'seminar-placeholder-6',
    day: '02',
    monthYear: 'July 2026',
    date: '02 July 2026',
    time: '3:30 PM - 6:00 PM',
    venue: 'Main Hall, Jazeera University',
    category: 'Seminar',
    title: 'Engineering in the Age of AI: Skills, Mindset, and Opportunities',
    cardDescription:
      'Hosted by the Institution of Engineers Somalia (IES) in collaboration with Jazeera University (JU), this seminar explored how AI is transforming engineering and the skills, mindset, and opportunities engineers need to adapt. The session was led by Eng. Abdirizak Warsame Abdulle, President of Jamhuriya University of Science and Technology (JUST).',
    fullDescription: [
      'On 2 July 2026, the Institution of Engineers Somalia (IES), in collaboration with Jazeera University (JU), hosted a seminar titled “Engineering in the Age of AI: Skills, Mindset, and Opportunities.”',
      'The seminar featured Eng. Abdirizak Warsame Abdulle, President of Jamhuriya University of Science and Technology (JUST), with over 15 years of experience in higher education, specializing in academic leadership, innovation, digital transformation, and artificial intelligence in education.',
      'The session explored how Artificial Intelligence (AI) is transforming the engineering profession and highlighted the skills, mindset, and opportunities engineers need to adapt to the evolving digital landscape.',
      'The seminar provided participants with valuable insights into the future of engineering, emerging technologies, and the importance of continuous professional development in the age of AI.',
    ],
    cardImage: '/Events-past/semenar-6-photes/Mindset, and Opportunities-poster.jpeg',
    heroImage: '/Events-past/semenar-6-photes/Mindset, and Opportunities-poster.jpeg',
    photos: [
      '/Events-past/semenar-6-photes/Mindset, and Opportunities-1.jpeg',
      '/Events-past/semenar-6-photes/Mindset, and Opportunities-2.jpeg',
      '/Events-past/semenar-6-photes/Mindset, and Opportunities-3.jpeg',
      '/Events-past/semenar-6-photes/Mindset, and Opportunities-4.jpeg',
      '/Events-past/semenar-6-photes/Mindset, and Opportunities-5.jpeg',
      '/Events-past/semenar-6-photes/photo-6.jpeg',
      '/Events-past/semenar-6-photes/Mindset, and Opportunities-7.jpeg',
      '/Events-past/semenar-6-photes/Mindset, and Opportunities-8.jpeg',
      '/Events-past/semenar-6-photes/Mindset, and Opportunities-9.jpeg',
      '/Events-past/semenar-6-photes/Mindset, and Opportunities-10.jpeg',
      '/Events-past/semenar-6-photes/Mindset, and Opportunities-11.jpeg',
      '/Events-past/semenar-6-photes/Mindset, and Opportunities-12.jpeg',
      '/Events-past/semenar-6-photes/Mindset, and Opportunities-13.jpeg',
      '/Events-past/semenar-6-photes/Mindset, and Opportunities-14.jpeg',
      '/Events-past/semenar-6-photes/Mindset, and Opportunities-15.jpeg',
      '/Events-past/semenar-6-photes/Mindset, and Opportunities-16.jpeg',
      '/Events-past/semenar-6-photes/Mindset, and Opportunities-17.jpeg',
      '/Events-past/semenar-6-photes/Mindset, and Opportunities-18.jpeg',
      '/Events-past/semenar-6-photes/Mindset, and Opportunities-19.jpeg',
      '/Events-past/semenar-6-photes/Mindset, and Opportunities-20.jpeg',
      '/Events-past/semenar-6-photes/Mindset, and Opportunities-21.jpeg',
      '/Events-past/semenar-6-photes/Mindset, and Opportunities-22.jpeg',
    ],
    video: '/Events-past/semenar-6-photes/video/Engineering in the Age of AI-Skills, Mindset, and Opportunitiesmp4.mp4',
    concluded: true,
    contactEmail: 'info@iesomalia.org.so',
    contactName: 'IES',
  },
];

export const findSeminar = (slug: string) => seminars.find((s) => s.slug === slug);
