<?php

/**
 * Verified IES knowledge base used as grounding context for the AI assistant.
 *
 * EVERY FACT HERE MUST BE REAL. The assistant is explicitly instructed to say
 * "I'm not sure — please check with IES Secretariat" rather than invent answers,
 * so leaving a topic absent is safer than guessing.
 */

return [
    'about' => [
        'short_description' => 'The Institution of Engineers Somalia (IES) is the national professional engineering organization of Somalia. It represents engineering professionals, promotes engineering excellence, supports continuing professional development, and strengthens the role of engineering in Somalia\'s development.',
        'mission' => 'To advance the engineering profession in Somalia through professional standards, continuous learning, collaboration with partners, and support for national development.',
        'contact' => [
            'general_email' => 'info@iesomalia.org.so',
            'website' => 'https://iesomalia.org.so',
        ],
    ],

    'membership' => [
        'intro' => 'IES offers five membership grades that recognize engineers and engineering professionals at different stages of academic and professional development.',
        'grades' => [
            [
                'code' => 'SMIES',
                'name' => 'Student Member',
                'description' => 'For engineering students currently enrolled in a recognized engineering programme.',
            ],
            [
                'code' => 'GMIES',
                'name' => 'Graduate Member',
                'description' => 'For engineering graduates who have completed a recognized engineering degree and are early in their career.',
            ],
            [
                'code' => 'AMIES',
                'name' => 'Associate Member',
                'description' => 'For engineering professionals with practical experience who are working toward full corporate membership.',
            ],
            [
                'code' => 'MIES',
                'name' => 'Corporate Member',
                'description' => 'For established engineering professionals who meet the full requirements of corporate membership — the professional engineer grade.',
            ],
            [
                'code' => 'FMIES',
                'name' => 'Fellow Member',
                'description' => 'The senior grade awarded for distinguished contribution to the engineering profession and to IES.',
            ],
        ],
        'how_to_apply' => 'To apply, visit the Membership → Apply for Membership page on the IES website, review the Online Application Guidelines, and complete the application form. Submit the required supporting documents and pay the applicable fee. The membership team reviews applications and will contact you about the outcome.',
    ],

    'services' => [
        'IES organizes seminars and virtual webinars on engineering topics ranging from geotechnical engineering and renewable energy to AI and architecture.',
        'IES celebrates World Engineering Day each year with a national programme that brings together engineers, students, academics, government, and development partners.',
        'IES, through its Women Engineers Committee (WEC), celebrates International Women in Engineering Day (INWED) to promote women\'s participation in engineering.',
        'IES signs MoUs with Somali universities (Benadir University, Jamhuriya University, Jazeera University, Salaam University) to strengthen engineering education, student training, and professional development.',
        'IES participates in regional and international engineering forums including COP, the WFEO Engineering Capacity Building for Africa Programme (ECBAP), and IEK international conventions.',
        'IES publishes news, announcements, and official documents on the Info Hub and Governance Resources pages.',
    ],

    'resources' => [
        'official_documents_page' => '/about/governance-resources',
        'strategic_plan' => '/about/governance-resources/strategic-plan-2026-2030',
        'news_page' => '/info-hub/news',
        'announcements_page' => '/info-hub/announcements',
        'events_page' => '/events',
        'contact_page' => '/contact',
        'report_violations_page' => '/report-violations',
    ],

    'suggested_questions' => [
        'What is IES?',
        'How can I become an IES member?',
        'What membership categories are available?',
        'What services does IES provide?',
        'Which official documents are available?',
    ],
];
