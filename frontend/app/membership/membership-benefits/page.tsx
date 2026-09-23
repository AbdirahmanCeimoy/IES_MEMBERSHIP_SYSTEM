import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { SectionHeading } from '@/components/layout/SectionHeading';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Card } from '@/components/ui/Card';
import { ContentGrid } from '@/components/public/ContentGrid';
import { ValueList } from '@/components/public/ValueList';
import { routes } from '@/config/routes';
import { commonMembershipBenefits } from '@/data/membership';

export const metadata = { title: 'Membership Benefits' };

const benefitsByGrade: { grade: string; postnominal?: string; items: string[] }[] = [
  {
    grade: 'Honorary Member',
    items: [
      'Recognition as an honorary member of Somalia\'s professional engineering society.',
      'Access to Journals, Newsletters and Engineering Magazines.',
      'Access to Webinars, Conferences and Conventions.',
      'Access to IES Capacity Building Initiatives.',
      'Access to Arbitration services from Institution Members.',
      'Opportunity for Awards and prizes.',
    ],
  },
  {
    grade: 'Fellow Member',
    postnominal: 'FIES',
    items: [
      'Use of the designatory letters FIES after your name.',
      'Recognition as a senior leader within the engineering profession.',
      'Eligibility for leadership and advisory roles within IES.',
      'Internationally recognised certificate.',
      'Eligible to vote at the AGM and to hold any position.',
      'International affiliation and connection with members.',
      'Opportunities to visit sites or works of engineering interest.',
      'Nominations for Boards and Committees.',
    ],
  },
  {
    grade: 'Corporate Member',
    postnominal: 'MIES',
    items: [
      'Use of the designatory letters MIES after your name.',
      'Boost career and salary prospects with internationally recognized qualifications.',
      'Continuous Professional Development (CPD).',
      'Access to IES Capacity Building Initiatives.',
      'Eligible to vote at the AGM and can aspire to any position.',
      'Access to technical publications (Journals, Newsletters, Engineering Magazine).',
      'Nominations for Boards and Committees.',
    ],
  },
  {
    grade: 'Associate Member',
    items: [
      'Access to the Institution\'s technical advice and resources.',
      'Exchange ideas and concepts with members of the Institution.',
      'Opportunity to learn from Professional Engineers.',
      'Invitations to technical seminars, conferences and conventions.',
      'Access to IES Newsletter, Journals and Engineering Magazines.',
    ],
  },
  {
    grade: 'Companion Member',
    items: [
      'Platform to share experience and knowledge.',
      'Access to learned information from industry leaders and innovators.',
      'Opportunities to network with professionals at training events and seminars.',
      'Access to technical advice and resources.',
    ],
  },
  {
    grade: 'Graduate Engineer',
    items: [
      'Step toward globally recognized qualifications.',
      'Skills development and mentorship opportunities.',
      'Access to Journals, Newsletters and Engineering Magazines.',
      'Participation in Webinars, Workshops, Conferences and Conventions.',
      'Scholarships and awards.',
    ],
  },
  {
    grade: 'Graduate Engineering Technologist',
    items: [
      'Support to qualify as an Engineering Technologist.',
      'Scholarships, sponsorships and awards.',
      'Continuous Professional Development.',
      'Networking opportunities.',
    ],
  },
  {
    grade: 'Graduate Engineering Technician',
    items: [
      'Support to qualify as an Engineering Technician.',
      'Scholarships, sponsorships and awards.',
      'Continuous Professional Development.',
      'Webinars, workshops, conferences and conventions.',
    ],
  },
  {
    grade: 'Student Member',
    items: [
      'Project work support from members.',
      'Leadership development among peers.',
      'Increased industry knowledge.',
      'Access to social and technical events.',
      'International networking opportunities.',
    ],
  },
];

export default function BenefitsPage() {
  return (
    <>
      <PageHero
        breadcrumbs={<Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Membership', href: routes.membership.root }, { label: 'Benefits' }]} />}
        eyebrow="Membership"
        title="Membership Benefits"
        description="Joining IES is an investment in your future as an engineering and technology professional. Benefits are designed to support your career from university, throughout your working life, and through retirement."
      />

      <Section>
        <SectionHeading eyebrow="Every member" title="Common benefits" />
        <Card padded className="mt-4">
          <ValueList items={commonMembershipBenefits} />
        </Card>
      </Section>

      <Section tone="muted">
        <SectionHeading eyebrow="By grade" title="Benefits by membership grade" />
        <ContentGrid columns={2} className="mt-6">
          {benefitsByGrade.map((b) => (
            <Card key={b.grade} padded>
              <div className="mb-3 flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-[#022D5A]">{b.grade}</h3>
                {b.postnominal && (
                  <span className="rounded-full border border-blue-100 bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-[#035CB3]">
                    {b.postnominal}
                  </span>
                )}
              </div>
              <ValueList items={b.items} />
            </Card>
          ))}
        </ContentGrid>
      </Section>
    </>
  );
}
