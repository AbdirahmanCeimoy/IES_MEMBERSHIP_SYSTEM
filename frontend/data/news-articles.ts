export interface NewsArticle {
  slug: string;
  title: string;
  date: string;
  author: { name: string; role: string };
  hashtags: string[];
  intro: string;
  areas: string[];
  closing: string;
  /** Optional hero image displayed at the top of the article body. */
  image?: string;
  /** Optional additional paragraphs displayed between intro and hashtags. */
  paragraphs?: string[];
  /** Optional call-to-action link (e.g. registration URL). */
  cta?: { label: string; href: string };
  /** Hide the "Signed by" author card when the article has no personal signature. */
  hideSignature?: boolean;
  /** Hide the "The MoU establishes a framework..." lead-in and the areas list. */
  hideAreas?: boolean;
  /** What kind of item this is — decides which index page the "Back" link
   *  returns to and which navigation section highlights. Defaults to 'news'. */
  kind?: 'news' | 'announcement';
}

export const newsArticles: NewsArticle[] = [
  {
    slug: 'mou-just',
    title: 'IES Signs MoU with Jamhuriya University of Science and Technology (JUST)',
    date: '18 December 2025',
    author: { name: 'Eng. Omar Abdi Arab', role: 'President, IES' },
    hashtags: ['IES', 'JUST', 'MoUSigning', 'StrategicPartnership', 'EngineeringEducation', 'AcademicCollaboration', 'SomaliEngineers'],
    image: '/parterner-jamhuriya-University.jpeg',
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
    image: '/Jazera-University-sign.png',
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
    image: '/slaaam-University.jpeg',
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
    image: '/parterner-Banadir-University.jpeg',
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
    title: 'IES Participated in SORECA and Ministry of Public Works Meeting on Infrastructure and Urban Development',
    date: '15 April 2026',
    author: { name: 'IES', role: 'Institution of Engineers Somalia' },
    hashtags: ['IES', 'InfrastructureDevelopment', 'UrbanDevelopment', 'EngineeringSomalia', 'PublicWorks', 'SustainableCities', 'CapacityBuilding', 'ConstructionSector', 'Collaboration', 'SomaliaDevelopment', 'SomaliRealEstate', 'ProfessionalEngineers', 'SORECA', 'MoPWRH'],
    image: '/PARTNER-SORECA.jpeg',
    intro:
      'The Institution of Engineers Somalia (IES), led by President Eng. Omar Abdi Arab and Vice President Eng. Bashir Ali Hussein, participated in an important meeting between the Somali Real Estate and Construction Association (SORECA) and the Ministry of Public Works, Reconstruction and Housing, Somalia.',
    paragraphs: [
      'The meeting was attended by the Minister of Public Works, Reconstruction and Housing, H.E. Hon. Ayub Ismail Yusuf, alongside the Chairman and Board Members of the Somali Real Estate and Construction Association (SORECA).',
      'The discussions focused on strengthening collaboration and consultation on infrastructure development, urban development, and the construction sector in Somalia.',
      'The meeting aimed to enhance cooperation between the Ministry and SORECA and to align efforts toward advancing Somalia’s infrastructure and urban development. Participants also emphasized the importance of establishing an effective framework for collaboration that can contribute to improving the quality, growth, and regulation of Somalia’s construction sector.',
    ],
    areas: [],
    closing: '',
    hideAreas: true,
    hideSignature: true,
  },
  {
    slug: 'wfeo-hackathon-2027',
    kind: 'announcement',
    title: '2027 WFEO Hackathon Registration Is Now Open!',
    date: '',
    author: { name: 'WFEO', role: 'World Federation of Engineering Organizations' },
    hashtags: ['WFEOHackathon', 'WED', 'WorldEngineeringDay', 'SustainableDevelopment', 'SustainableTransport', 'YoungEngineers', 'EngineeringStudents', 'Innovation'],
    image: '/PARTNER-WFOE.jpeg',
    intro:
      'The #WFEOHackathon is back as part of the 2027 World Engineering Day for Sustainable Development celebrations!',
    paragraphs: [
      'We’re calling on engineering students, young engineers and multidisciplinary teams from around the world to develop innovative solutions to real-world sustainable transport challenges.',
      'Ready to take on the challenge?',
      'Learn more, register now and take your idea to the global stage: https://worldengineeringday.net/hackathon/',
    ],
    areas: [],
    closing: '',
    cta: { label: 'Register Now', href: 'https://worldengineeringday.net/hackathon/' },
    hideAreas: true,
    hideSignature: true,
  },
  {
    slug: 'iek-32nd-convention-mombasa',
    title: 'IES Vice President Participated in the 32nd IEK International Convention in Mombasa, Kenya',
    date: '25–28 November 2025',
    author: { name: 'Eng. Bashir Ali Hussein', role: 'Vice President, IES' },
    hashtags: ['IES', 'IEK32ndConvention', 'EngineeringTheFuture', 'RegionalCollaboration', 'EAFEO', 'FAEO', 'WFEO', 'EBK', 'EngineeringExcellence', 'KnowledgeExchange'],
    image: '/IES Vice President Participated in the 32nd IEK International Convention in Mombasa, Kenya.jpeg',
    intro:
      'The Institution of Engineers Somalia (IES) was honored to participate in the 32nd IEK International Convention held at PrideInn Paradise Beach Resort, Mombasa, Kenya, one of the region\'s premier gatherings of engineering professionals, policymakers, and innovators from across Africa.',
    paragraphs: [
      'The convention, held from 25th to 28th November 2025 under the theme "Engineering for the Future: The Roadmap for Kenya", focused on strengthening engineering leadership, fostering innovation, and enhancing regional collaboration for sustainable development.',
      'IES was proudly represented by our Vice President, Eng. Bashir Ali, whose participation demonstrates our commitment to deepening regional cooperation and engaging in high-level professional forums that shape the future of engineering in East Africa.',
      'The convention was also attended by leading organizations, including The East African Federation of Engineering Organizations (EAFEO), The Federation of African Engineering Organizations (FAEO), the World Federation of Engineering Organizations (WFEO), The Engineers Board of Kenya (EBK) and other institutions from across the region and the world, highlighting the importance of collaboration and knowledge exchange.',
      'We extend our sincere appreciation to Eng. Shammah Kiteme, President of The Institution of Engineers of Kenya (IEK), for graciously inviting us and facilitating this important platform for regional engagement.',
    ],
    areas: [],
    closing:
      'We greatly value our ongoing partnership with IEK and remain committed to expanding collaboration, knowledge exchange, and joint initiatives that advance engineering excellence across the region.',
    hideAreas: true,
    hideSignature: true,
  },
  {
    slug: 'benadir-steel-inauguration',
    title: 'IES Leadership Attended the Inauguration of Benadir Steel Ltd.',
    date: '08 November 2025',
    author: { name: 'Eng. Omar Abdi Arab', role: 'President, IES' },
    hashtags: ['IES', 'BenadirSteelLtd', 'EngineeringSomalia', 'IndustrialDevelopment', 'EngineeringInnovation'],
    image: '/IES Leadership Attended the Inauguration of Benadir Steel Ltd.jpeg',
    intro:
      'On 8 November 2025, the Institution of Engineers Somalia (IES), led by President Eng. Omar Abdi Arab and Vice President Eng. Bashir Ali Hussein, attended the inauguration ceremony of Benadir Steel Ltd., which was officially opened by the President of the Federal Republic of Somalia, H.E. Dr. Hassan Sheikh Mohamud.',
    paragraphs: [
      'The new steel factory marked an important step toward strengthening local manufacturing, encouraging Somali engineers, and advancing industrial self-reliance in Somalia.',
    ],
    areas: [],
    closing:
      'The Institution of Engineers Somalia (IES) commended the efforts of Somali entrepreneurs and engineers who contributed to the realization of this important project. IES remained committed to supporting technical excellence, innovation, and the development of local industries. 🇸🇴',
    hideAreas: true,
    hideSignature: true,
  },
  {
    slug: 'wfeo-ecbap-nairobi',
    title: 'IES Participated in the WFEO Engineering Capacity Building for Africa Programme in Nairobi',
    date: '17 March 2025',
    author: { name: 'Eng. Omar Abdi Arab', role: 'President, IES' },
    hashtags: ['IES', 'WFEO', 'ECBAP', 'IEK', 'EBK', 'CAST', 'EngineeringCapacityBuilding', 'EngineeringAfrica', 'EngineeringInnovation', 'SustainableDevelopment', 'RegionalCollaboration'],
    image: '/IES Participated in the WFEO Engineering Capacity Building for Africa Programme in Nairobi.jpeg',
    intro:
      'The Institution of Engineers Somalia (IES) was honored to participate in the launch of the WFEO Engineering Capacity Building for Africa Programme (ECBAP), held on 17 March 2025 in Nairobi, Kenya, in collaboration with the World Federation of Engineering Organizations (WFEO), the Institution of Engineers of Kenya (IEK), the Engineers Board of Kenya (EBK), and the China Association for Science and Technology (CAST).',
    paragraphs: [
      'The programme was held under the theme "Belt and Road Initiatives in Engineering Capacity Building: Innovative Infrastructure Solutions to Achieve SDGs through Smart Partnerships with CAST and African Engineering Organizations."',
      'IES was proudly represented by our President, Eng. Omar Abdi Arab, and Eng. Sara Abdirizak Jama, whose participation reflected IES\'s commitment to strengthening regional and international engineering cooperation, professional development, and knowledge exchange.',
      'The programme brought together engineering leaders, policymakers, academics, and industry experts to discuss innovative approaches to addressing Africa\'s engineering and infrastructure challenges. A key objective of ECBAP is to support the training of over 100,000 engineers across Africa over ten years, with a focus on emerging fields including Artificial Intelligence (AI), renewable energy, digital infrastructure, and climate-resilient design.',
      'The event also marked an important milestone in international engineering cooperation, with CAST, IEK, and EBK signing a Tripartite Memorandum of Understanding (MoU) to strengthen collaboration in engineering capacity development, skills enhancement, and research partnerships.',
    ],
    areas: [],
    closing:
      'IES values its continued engagement with regional and international engineering organizations and remains committed to contributing to initiatives that strengthen the engineering profession, promote knowledge exchange, and support sustainable infrastructure development in Somalia and across Africa.',
    hideAreas: true,
    hideSignature: true,
  },
  {
    slug: 'b2b-panel-discussion-arkaan',
    title: 'IES President Attended B2B Panel Discussion',
    date: '13 February 2025',
    author: { name: 'Eng. Omar Abdi Arab', role: 'President, IES' },
    hashtags: ['IES', 'ArkaanLeadershipHub', 'ArkaanInnovationHUb', 'B2BNetworking', 'Innovation', 'Technology', 'Engineering', 'Somalia'],
    image: '/IES President Attended B2B Panel Discussion.jpeg',
    intro:
      'The Institution of Engineers Somalia (IES), led by the President, Eng. Omar Abdi Arab, attended the B2B Panel Discussion organized by Arkaan Leadership and Innovation Hub on 13 February 2025.',
    paragraphs: [
      'The program brought together professionals, business leaders, and industry stakeholders for insightful discussions on business, technology, industry collaboration, and innovation. It also provided an opportunity for meaningful connections, knowledge exchange, and professional networking.',
    ],
    areas: [],
    closing:
      'IES was pleased to be represented at the program and to support platforms that promoted professional engagement, innovation, and collaboration across Somalia\'s business and engineering communities.',
    hideAreas: true,
    hideSignature: true,
  },
  {
    slug: 'cop29-baku',
    title: 'IES Vice President Participated in COP29 in Baku, Azerbaijan',
    date: '11–22 November 2024',
    author: { name: 'Eng. Bashir Ali Hussein', role: 'Vice President, IES' },
    hashtags: ['IES', 'COP29', 'ClimateAction', 'Sustainability', 'EngineeringForChange', 'ClimateResilience', 'Somalia', 'EngineeringInnovation', 'Baku2024'],
    image: '/IES Vice President Participated in COP29 in Baku, Azerbaijan.jpeg',
    intro:
      'The Institution of Engineers Somalia (IES) was pleased to be represented at the 29th United Nations Climate Change Conference of the Parties (COP29), held from 11–22 November 2024 in Baku, Azerbaijan.',
    paragraphs: [
      'IES was proudly represented by our Vice President, Eng. Bashir Ali Hussein, who participated in discussions and engagements focused on climate resilience, sustainability, and the role of engineering in addressing climate-related challenges.',
      'His participation provided an opportunity for IES to engage with international organizations, research institutions, universities, and other stakeholders working to advance sustainable development and climate action.',
    ],
    areas: [],
    closing:
      'IES remains committed to strengthening the role of engineering in supporting climate-resilient infrastructure, sustainable development, innovation, and knowledge exchange, while contributing to Somalia\'s engagement with regional and global engineering and climate initiatives.',
    hideAreas: true,
    hideSignature: true,
  },
  {
    slug: 'inwed-2026',
    kind: 'announcement',
    title: 'International Women in Engineering Day (INWED2026) — Coming Soon',
    date: '23 June 2026',
    author: { name: 'Eng. Omar Abdi Arab', role: 'President, IES' },
    hashtags: ['INWED2026', 'EngineeringIntelligence', 'WomenInEngineering', 'IESomalia', 'WEC', 'JUST', 'Engineering'],
    image: '/International Women in Engineering Day (INWED2026).jpeg',
    intro:
      'The Institution of Engineers Somalia (IES), through its Women Engineers Committee (WEC), is pleased to organize International Women in Engineering Day 2026 (INWED26), hosted by Jamhuriya University of Science and Technology.',
    paragraphs: [
      'Under the theme "Engineering Intelligence," the event will celebrate the achievements, leadership, and contributions of women engineers while exploring how innovation, technology, and engineering intelligence are shaping the future of engineering and society.',
      '📅 Date: Tuesday, 23 June 2026',
      '🕒 Time: 3:00 PM – 6:00 PM',
      '📍 Venue: JIC Hall, Jamhuriya University, Campus 3, Opposite Dahab Tower',
      'Organized by: IES Women Engineers Committee (WEC)',
      'Hosted by: Jamhuriya University of Science and Technology',
    ],
    areas: [],
    closing: 'Stay tuned for more updates and join us in celebrating women in engineering!',
    hideAreas: true,
    hideSignature: true,
  },
  {
    slug: 'world-environment-day-2026',
    kind: 'announcement',
    title: 'IES Co-Organizes World Environment Day 2026 Program',
    date: '2026',
    author: { name: 'Eng. Omar Abdi Arab', role: 'President, IES' },
    hashtags: ['WorldEnvironmentDay', 'InspiredByNature', 'ClimateAction', 'IESomalia', 'BenadirUniversity', 'MoECC', 'Sustainability', 'Somalia'],
    image: '/IES Co-Organizes World Environment Day 2026 Program.jpeg',
    intro:
      'The Institution of Engineers Somalia (IES) is pleased to announce its participation as a Co-Organizer of the World Environment Day 2026 program, organized in collaboration with Benadir University and the Ministry of Environment and Climate Change (MoECC).',
    paragraphs: [
      'Under the theme "Inspired by Nature, for Climate, for Our Future," the program will bring together students, academics, engineers, environmental professionals, and other stakeholders to promote environmental awareness, climate action, and nature-based solutions for a sustainable and resilient future.',
      'Key Activities',
      'The program will feature a range of environmental and awareness activities, including:',
      '🌳 Tree Planting and Urban Greening',
      '🧹 Environmental Clean-Up Campaign',
      '♻️ Waste Management and Recycling Awareness',
      '🌱 Nature-Based Solutions and Environmental Conservation',
      '🌍 Climate Change Awareness and Education',
      '💧 Water and Natural Resource Conservation',
      '🏙️ Sustainable Cities and Climate-Resilient Infrastructure',
    ],
    areas: [],
    closing: '',
    hideAreas: true,
    hideSignature: true,
  },
  {
    slug: 'inwed-2025',
    kind: 'announcement',
    title: 'International Women in Engineering Day (INWED2025) — Coming Soon',
    date: '23 June 2025',
    author: { name: 'Eng. Omar Abdi Arab', role: 'President, IES' },
    hashtags: ['INWED26', 'TogetherWeEngineer', 'WomenInEngineering', 'IESomalia', 'WEC', 'EngineeringExcellence', 'InnovationInAction'],
    image: '/International Women in Engineering Day (INWED2025).jpeg',
    intro:
      'Join us as we celebrate the brilliant and resilient women shaping the future of engineering in Somalia and beyond.',
    paragraphs: [
      '🔧 Theme: Together We Engineer',
      '📍 Venue: Arkaan Leadership and Innovation Hub Center',
      '📅 Date: 23 June 2025',
      '🕒 Time: 3:00 PM – 6:00 PM',
      '🎯 Organized by: IES — Women Engineers Committee (WEC)',
      'Let\'s unite to inspire, empower, and elevate women in engineering. Be part of the movement. 💪💡',
    ],
    areas: [],
    closing: 'Stay tuned for more updates!',
    hideAreas: true,
    hideSignature: true,
  },
];
