import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { routes } from '@/config/routes';
import { BenefitsAccordion } from './BenefitsAccordion';

export const metadata = { title: 'Membership Benefits' };

export interface GradeBenefit {
  index: string;
  grade: string;
  postnominal?: string;
  description: string;
  benefits: string[];
}

const gradeBenefits: GradeBenefit[] = [
  {
    index: '1.1',
    grade: 'Honorary Member',
    description:
      'This membership category is for a person who has rendered distinguished or conspicuous service to the Institution or the engineering profession, or who has attained eminence in engineering or public service. Honorary Members shall be elected by the Council.',
    benefits: [
      'Recognition as an Honorary Member of the national professional engineering society.',
      'Recognition at appropriate IES events and in official IES publications.',
      'Invitations to select IES professional, technical, and special events.',
      'Access to IES Journals, Newsletters, and Engineering Magazines.',
      'Access to Webinars, Workshops, Conferences, and Conventions.',
      'Access to IES Capacity Building Initiatives, where applicable.',
      'Opportunities to engage with engineers and other professionals through IES activities.',
      'Eligibility for recognition and awards for contributions to engineering and related fields.',
    ],
  },
  {
    index: '1.2',
    grade: 'Fellow Member',
    postnominal: 'FMIES',
    description:
      'This membership category is for a Corporate Member who has been a Corporate Member of the Institution for at least seven (7) years, has at least fifteen (15) years of professional engineering experience, and has demonstrated outstanding professional achievement, leadership, and significant contribution to engineering practice, industry, education, research, public service, or the advancement of the engineering profession and the Institution.',
    benefits: [
      'Use of the designatory letters FIES after your name.',
      'Recognition as a distinguished senior member of the engineering profession.',
      'Eligibility for leadership and advisory roles within IES.',
      'Participation in strategic discussions, technical committees, and professional initiatives.',
      'Eligibility for nomination to relevant boards, committees, and professional bodies.',
      'Opportunities to represent IES in professional forums and technical engagements, subject to appointment or nomination.',
      'Opportunities to mentor and support other IES members.',
      'Access to IES Capacity Building Initiatives and Continuing Professional Development (CPD) opportunities.',
      'Access to Webinars, Workshops, Conferences, Conventions, and Technical Events.',
      'Access to IES Journals, Newsletters, Engineering Magazines, and other technical publications.',
      'Opportunities to participate in engineering site visits and technical activities.',
      'Networking opportunities with senior engineers and other engineering professionals.',
      'Eligibility to vote at the AGM and to stand for eligible positions within the Institution.',
      'Opportunities to contribute to professional policy, standards, and engineering development initiatives, where applicable.',
      'Recognition through IES awards and professional honours.',
      'Access to professional resources and technical information provided by the Institution.',
      'Opportunities to contribute to mentorship, professional development, and knowledge-sharing programmes.',
    ],
  },
  {
    index: '1.3',
    grade: 'Senior Member',
    postnominal: 'SenMIES',
    description:
      'This membership category is for an experienced engineering professional who has been a Corporate Member of the Institution for at least five (5) years or possesses equivalent professional standing, has at least ten (10) years of relevant professional engineering experience, and has demonstrated professional leadership, technical expertise, and significant contribution to engineering practice, industry, education, research, public service, or the advancement of the engineering profession.',
    benefits: [
      'Use of the designatory letters SenMIES after your name.',
      'Recognition as an experienced professional within the engineering profession.',
      'Eligibility for senior leadership and advisory roles within IES.',
      'Participation in strategic discussions, technical committees, and professional initiatives.',
      'Eligibility for nomination to relevant boards, committees, and professional bodies.',
      'Opportunities to represent IES in professional forums and technical engagements, subject to appointment or nomination.',
      'Opportunities to mentor and support Graduate, Associate, and Corporate Members.',
      'Access to IES Capacity Building Initiatives and Continuing Professional Development (CPD) opportunities.',
      'Access to Webinars, Workshops, Conferences, Conventions, and Technical Events.',
      'Access to IES Journals, Newsletters, Engineering Magazines, and other technical publications.',
      'Opportunities to participate in engineering site visits and technical activities.',
      'Networking opportunities with senior engineers and other engineering professionals.',
      'Eligibility to vote at the AGM and to stand for eligible positions within the Institution, subject to the Constitution and By-laws.',
      'Opportunities to contribute to professional policy, technical standards, and engineering development initiatives, where applicable.',
      'Recognition through IES awards and professional honours.',
      'Access to professional resources and technical information provided by the Institution.',
      'Opportunities to contribute to mentorship, professional development, and knowledge-sharing programmes.',
    ],
  },
  {
    index: '1.4',
    grade: 'Corporate Member',
    postnominal: 'CMIES',
    description:
      'This membership category is for professionally qualified engineers who hold an accredited engineering qualification or an equivalent qualification recognized by the Institution, have at least three (3) years of relevant professional engineering experience, and have demonstrated professional competence, responsibility, and commitment to ethical engineering practice.',
    benefits: [
      'Use of the designatory letters CMIES after your name.',
      'Recognition as a qualified professional member of the engineering profession.',
      'Eligibility for professional leadership and advisory opportunities within IES.',
      'Participation in technical committees, engineering divisions, and professional initiatives.',
      'Access to Continuing Professional Development (CPD) opportunities.',
      'Access to IES Capacity Building Initiatives.',
      'Access to Webinars, Workshops, Conferences, Conventions, and Technical Events.',
      'Access to IES Journals, Newsletters, Engineering Magazines, and other technical publications.',
      'Professional networking with engineers and other built-environment professionals.',
      'Opportunities to participate in engineering site visits and technical activities.',
      'Opportunities to mentor Graduate and Associate Members.',
      'Eligibility to vote at the AGM and to stand for eligible positions within the Institution, subject to the Constitution and By-laws.',
      'Opportunities for nomination to relevant boards and committees, where applicable.',
      'Opportunities to contribute to IES technical committees, engineering divisions, and professional programmes.',
      'Opportunities for professional recognition through IES awards and honours.',
      'Access to professional resources, technical information, and career development opportunities.',
      'Opportunities to participate in mentorship and knowledge-sharing programmes.',
    ],
  },
  {
    index: '1.5',
    grade: 'Associate Member',
    postnominal: 'AMIES',
    description:
      'This membership category is for individuals who are engaged in an engineering-related profession, occupation, or field, who are not qualified for admission as Corporate Members, and who have at least two (2) years of relevant engineering-related experience. Associate Membership recognizes individuals who possess relevant engineering-related knowledge, experience, and responsibility.',
    benefits: [
      'Access to IES technical advice, information, and professional resources.',
      'Opportunities to exchange knowledge and ideas with members of the Institution.',
      'Opportunities to learn from professionally qualified engineers.',
      'Access to mentorship and professional development opportunities.',
      'Invitations to technical seminars, workshops, conferences, and conventions.',
      'Access to IES Newsletters, Journals, Engineering Magazines, and other publications.',
      'Access to IES Capacity Building Initiatives.',
      'Access to Webinars, Workshops, Conferences, and Technical Events.',
      'Professional networking opportunities with engineers and other professionals.',
      'Opportunities to participate in engineering site visits and technical activities.',
      'Opportunities to develop professional knowledge and experience toward Corporate Membership, where applicable.',
      'Opportunities for recognition through IES awards and professional honours.',
    ],
  },
  {
    index: '1.6',
    grade: 'Companion Member',
    postnominal: 'CompMIES',
    description:
      'This membership category is for a person who is not an engineer by profession but has rendered important services to engineering in the fields of science, education, commerce, finance, law, or other areas connected with the application of engineering knowledge.',
    benefits: [
      'Recognition as a Companion of the Institution.',
      'Opportunities to share professional experience and knowledge with IES members.',
      'Access to knowledge and insights from engineering and industry professionals.',
      'Opportunities to network with engineers and other professionals through IES activities.',
      'Invitations to select technical seminars, workshops, conferences, and conventions.',
      'Access to technical advice and professional resources from the Institution.',
      'Opportunities to participate in selected IES programmes and activities.',
      'Access to IES Capacity Building Initiatives, where applicable.',
      'Access to IES Newsletters, Journals, Engineering Magazines, and other publications.',
      'Opportunities to contribute to discussions and initiatives related to engineering and professional development.',
      'Eligibility for recognition and awards for contributions to engineering and related fields.',
    ],
  },
  {
    index: '1.7',
    grade: 'Graduate Member',
    postnominal: 'GMIES',
    description:
      'This membership category is for a person who holds an accredited engineering degree or equivalent qualification from a recognized institution and has less than two (2) years of relevant professional engineering experience. Graduate Membership is intended for engineers at the early stage of their professional career who are seeking to develop their professional competence and experience toward Corporate Membership.',
    benefits: [
      'A structured pathway toward Corporate Membership.',
      'Professional development and career guidance.',
      'Mentorship opportunities from experienced engineering professionals.',
      'Access to technical advice and professional resources.',
      'Opportunities to develop professional competence and practical experience.',
      'Access to IES Capacity Building Initiatives.',
      'Access to Continuing Professional Development (CPD) opportunities.',
      'Access to Webinars, Workshops, Conferences, Conventions, and Technical Events.',
      'Access to IES Journals, Newsletters, Engineering Magazines, and other technical publications.',
      'Professional networking with engineers and other industry professionals.',
      'Opportunities to participate in engineering site visits and technical activities.',
      'Opportunities for internships, industry exposure, and professional engagement, where available.',
      'Eligibility for scholarships, awards, and other professional development opportunities where available.',
    ],
  },
  {
    index: '1.8',
    grade: 'Graduate Engineering Technologist',
    description:
      'This membership category is for a person who holds a recognized degree or equivalent qualification in Engineering Technology from an accredited or recognized programme.',
    benefits: [
      'Support and guidance toward professional development as an Engineering Technologist.',
      'Career guidance and mentorship opportunities.',
      'Access to Continuing Professional Development (CPD) opportunities.',
      'Access to IES Capacity Building Initiatives.',
      'Access to Webinars, Workshops, Conferences, Conventions, and Technical Events.',
      'Access to IES technical publications, Newsletters, and other professional resources.',
      'Opportunities to network with engineers, technologists, technicians, and other professionals.',
      'Opportunities to participate in technical activities and site visits.',
      'Opportunities for scholarships, sponsorships, and professional development programmes, where available.',
      'Opportunities for recognition through IES awards and professional honours.',
    ],
  },
  {
    index: '1.9',
    grade: 'Graduate Engineering Technician',
    description:
      'This membership category is for a person who holds a recognized diploma or equivalent qualification in Engineering Technology or Engineering Technician studies from an accredited or recognized programme.',
    benefits: [
      'Support and guidance toward professional development as an Engineering Technician.',
      'Career guidance and mentorship opportunities.',
      'Access to Continuing Professional Development (CPD) opportunities.',
      'Access to IES Capacity Building Initiatives.',
      'Access to Webinars, Workshops, Conferences, Conventions, and Technical Events.',
      'Access to IES technical publications, Newsletters, and other professional resources.',
      'Opportunities to network with engineers, technologists, technicians, and other professionals.',
      'Opportunities to participate in technical activities and engineering site visits.',
      'Opportunities for industry exposure and professional development where available.',
      'Opportunities for scholarships, sponsorships, and awards, where available.',
      'Opportunities for recognition through IES awards and professional honours.',
    ],
  },
  {
    index: '1.10',
    grade: 'Student Member',
    postnominal: 'SMIES',
    description:
      'This membership category is for a person enrolled in a recognized or accredited engineering programme and receiving instruction in engineering theory and practice.',
    benefits: [
      'Student membership certificate and/or identification card, where applicable.',
      'Access to engineering career guidance and mentorship.',
      'Support and guidance for academic and engineering project work.',
      'Opportunities for leadership development and participation in student activities.',
      'Access to IES Capacity Building Initiatives.',
      'Access to Webinars, Workshops, Conferences, Conventions, and Technical Events.',
      'Access to IES publications, including Newsletters, Journals, and Engineering Magazines.',
      'Opportunities to participate in engineering site visits and technical activities.',
      'Opportunities to network with engineers, students, academics, and industry professionals.',
      'Opportunities for internships, industry exposure, and career development, where available.',
      'Opportunities to participate in engineering competitions, technical activities, and professional initiatives.',
      'Opportunities to volunteer in IES programmes and activities.',
      'Opportunities for scholarships, sponsorships, and awards, where available.',
      'Access to discounted rates for selected IES events and activities, where applicable.',
      'Opportunities for recognition through IES awards and student activities.',
    ],
  },
];

export default function BenefitsPage() {
  return (
    <>
      <PageHero
        breadcrumbs={
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Membership', href: routes.membership.root },
              { label: 'Benefits' },
            ]}
          />
        }
        eyebrow="Membership"
        title="IES Membership Benefits"
        description="Discover our Membership Benefits"
      />

      <Section spacing="compact">
        <p className="text-sm leading-relaxed text-slate-700 sm:text-base">
          Joining the Institution of Engineers Somalia (IES) is a smart investment in your future as an engineering and technology professional. IES membership provides opportunities for professional development, knowledge sharing, networking, recognition, and active participation in the engineering profession. Our membership benefits are designed to support members at different stages of their academic and professional careers, from university education and early career development to professional practice and senior leadership.
        </p>
      </Section>

      <Section tone="muted" spacing="compact">
        <h2 className="mb-6 text-center text-2xl font-extrabold tracking-tight text-[#035CB3] sm:text-3xl">
          Membership Benefits of the Institution of Engineers Somalia (IES)
        </h2>
        <BenefitsAccordion items={gradeBenefits} />
      </Section>
    </>
  );
}
