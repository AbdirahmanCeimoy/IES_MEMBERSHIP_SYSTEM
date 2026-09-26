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
    title: 'IES Signs MoU with Jazeera University (JU)',
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
    title: 'IES Signs MoU with Salaam University (SU)',
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
  {
    slug: 'ministry-public-works-meeting',
    title: 'IES Meets with Ministry of Public Works, Reconstruction and Housing',
    date: '18 September 2026',
    author: { name: 'Eng. Omar Abdi Arab', role: 'President, IES' },
    hashtags: ['IES', 'InfrastructureDevelopment', 'UrbanDevelopment', 'EngineeringSomalia', 'PublicWorks', 'SustainableCities', 'CapacityBuilding', 'ConstructionSector', 'Collaboration', 'SomaliaDevelopment', 'SomaliRealEstates', 'ProfessionalEngineers', 'SORECA', 'MoPWHRD'],
    intro:
      'The Institution of Engineers Somalia (IES), led by President Eng. Omar Abdi Arab and Vice President Eng. Bashir Ali Hussein, participated in an important meeting with the Ministry of Public Works, Reconstruction and Housing, Somalia. The meeting was attended by the Minister of Public Works, Reconstruction and Housing, H.E. Hon. Ayub Ismail Yusuf, alongside representatives of the Somali Real Estate and Construction Association (SORECA).',
    areas: [
      'Strengthening collaboration and consultation on infrastructure development and urban development in Somalia.',
      'Enhancing cooperation between the Ministry and SORECA.',
      'Aligning efforts toward advancing the country\'s infrastructure and urban development.',
      'Establishing an effective framework for collaboration that can contribute to the growth, quality, and regulation of Somalia\'s construction sector.',
    ],
    closing:
      'The participants emphasized the importance of establishing an effective framework for collaboration that can contribute to the growth, quality, and regulation of Somalia\'s construction sector.',
  },
  {
    slug: 'wfeo-hackathon-2027',
    title: '2027 WFEO Hackathon Registration Is Now Open!',
    date: '22 September 2026',
    author: { name: 'WFEO', role: 'World Federation of Engineering Organizations' },
    hashtags: ['WFEOHackathon', 'WED', 'WorldEngineeringDay', 'SustainableDevelopment', 'SustainableTransport', 'YoungEngineers', 'EngineeringStudents', 'Innovation'],
    intro:
      'The #WFEOHackathon is back as part of the 2027 World Engineering Day for Sustainable Development celebrations! We\'re calling on engineering students, young engineers and multidisciplinary teams from around the world to develop innovative solutions to real-world sustainable transport challenges.',
    areas: [
      'Engineering students and young engineers are invited to participate.',
      'Multidisciplinary teams from around the world are welcome.',
      'Develop innovative solutions to real-world sustainable transport challenges.',
      'Take your idea to the global stage.',
    ],
    closing:
      'Ready to take on the challenge? Learn more, register now and take your idea to the global stage at worldengineeringday.net/hackathon/',
  },
];
