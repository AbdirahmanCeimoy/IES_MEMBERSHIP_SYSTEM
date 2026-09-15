export interface NewsArticle {
  slug: string;
  title: string;
  date: string;
  author: { name: string; role: string };
  hashtags: string[];
  intro: string;
  areas: string[];
  closing: string;
}

export const newsArticles: NewsArticle[] = [
  {
    slug: 'mou-just',
    title: 'IES Signs MoU with Jamhuriya University of Science and Technology (JUST)',
    date: '18 December 2025',
    author: { name: 'Eng. Omar Abdi Arab', role: 'President, IES' },
    hashtags: ['IES', 'JUST', 'MoUSigning', 'StrategicPartnership', 'EngineeringEducation', 'AcademicCollaboration', 'SomaliEngineers'],
    intro:
      'On 18 December 2025, the Institution of Engineers of Somalia (IES) and Jamhuriya University of Science and Technology (JUST), Mogadishu, Somalia, officially signed a Memorandum of Understanding (MoU) to establish a framework for collaboration in engineering education, research, innovation and professional development.',
    areas: [
      'Enhancing engineering education and promoting academic and professional excellence.',
      'Supporting engineering research, innovation and the development of technical solutions.',
      'Organizing CPD programs, workshops, seminars and technical training activities.',
      'Providing mentorship, career guidance, internships and practical learning opportunities.',
      'Facilitating engineering conferences, exhibitions, technical forums and knowledge-sharing events.',
      'Strengthening collaboration between universities, industry partners and professional engineering organizations.',
      'Encouraging student engagement with IES through membership, mentoring and professional networking.',
    ],
    closing:
      'Through this strategic partnership, IES and Jamhuriya University aim to support the growth of competent and innovative engineers who can contribute to Somalia\'s development and technological advancement.',
  },
  {
    slug: 'mou-jazeera',
    title: 'IES Signs MoU with Jazeera University',
    date: '20 December 2025',
    author: { name: 'Eng. Omar Abdi Arab', role: 'President, IES' },
    hashtags: ['IES', 'JazeeraUniversity', 'MoUSigning', 'StrategicPartnership', 'EngineeringEducation'],
    intro:
      'On 20 December 2025, the Institution of Engineers of Somalia (IES) and Jazeera University, Mogadishu, Somalia, officially signed a Memorandum of Understanding (MoU) to enhance cooperation in engineering education, professional development, innovation and knowledge exchange.',
    areas: [
      'Supporting the improvement of engineering education and academic excellence.',
      'Expanding opportunities for engineering students through internships, industrial training and technical activities.',
      'Providing professional development programs, mentorship and career guidance through IES.',
      'Encouraging joint research, innovation and technical knowledge sharing.',
      'Organizing engineering conferences, workshops, seminars and professional events.',
      'Connecting students and graduates with the engineering profession through IES membership.',
      'Strengthening cooperation with industry and engineering organizations to enhance practical skills.',
    ],
    closing:
      'Through this partnership, IES and Jazeera University aim to empower engineering students, promote continuous learning and contribute to the growth of Somalia\'s engineering profession.',
  },
  {
    slug: 'mou-salaam',
    title: 'IES Signs MoU with Salaam University',
    date: '31 December 2025',
    author: { name: 'Eng. Mohamed Hussein Hassan', role: 'Honorary Secretary, IES' },
    hashtags: ['IES', 'SalaamUniversity', 'MoUSigning', 'StrategicPartnership', 'EngineeringEducation'],
    intro:
      'On 31 December 2025, the Institution of Engineers of Somalia (IES) and Salaam University, Mogadishu, Somalia, officially signed a Memorandum of Understanding (MoU) to strengthen cooperation in engineering education, professional development, research and knowledge exchange.',
    areas: [
      'Supporting the advancement of engineering education and improving academic and professional standards.',
      'Providing engineering students with opportunities for internships, industrial training, mentorship and career guidance.',
      'Promoting CPD programs, technical training and professional capacity building.',
      'Encouraging joint research, innovation and exchange of engineering knowledge and expertise.',
      'Organizing engineering seminars, workshops, conferences and technical awareness programs.',
      'Strengthening engagement between engineering students, academics, professionals and industry stakeholders.',
      'Supporting student participation in IES activities, membership opportunities and professional networking.',
    ],
    closing:
      'Through this collaboration, IES and Salaam University aim to empower engineering students, strengthen professional competence and contribute to the continued development of Somalia\'s engineering sector.',
  },
  {
    slug: 'mou-benadir',
    title: 'IES Signs MoU with Benadir University',
    date: '1 January 2026',
    author: { name: 'Eng. Bashir Ali Hussein', role: 'Vice President, IES' },
    hashtags: ['IES', 'BenadirUniversity', 'MoUSigning', 'StrategicPartnership', 'EngineeringEducation'],
    intro:
      'On 1 January 2026, the Institution of Engineers of Somalia (IES) and Benadir University, Mogadishu, Somalia, officially signed a Memorandum of Understanding (MoU) to strengthen cooperation in engineering education, professional training, research, innovation and continuing professional development in Somalia.',
    areas: [
      'Enhancement of engineering education and academic quality.',
      'Student industrial training, internships, exhibitions and engineering competitions.',
      'CPD and professional certification programs.',
      'Joint engineering research, innovation and knowledge dissemination.',
      'Organization of technical conferences, seminars and career development events.',
      'Guest lectures, professional talks and technical mentorship initiatives.',
      'Student membership registration, mentoring and professional guidance under IES.',
      'Collaboration in facilitating internship placements within public and private engineering organizations.',
      'Support, where possible, for scholarships and financial assistance for engineering students from low-income backgrounds.',
    ],
    closing:
      'Through this partnership, IES and Benadir University will work together to develop skilled engineers, strengthen professional capacity, encourage innovation and create more opportunities for engineering students and professionals in Somalia.',
  },
];
