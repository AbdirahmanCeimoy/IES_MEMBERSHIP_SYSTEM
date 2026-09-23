import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { SectionHeading } from '@/components/layout/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ContentGrid } from '@/components/public/ContentGrid';
import { routes } from '@/config/routes';

export const metadata = { title: 'Become a Member' };

const whyJoinReasons = [
  {
    title: 'Professional Development',
    description:
      'Access continuous professional development programmes, workshops, and training that keep your skills current and advance your career at every stage.',
  },
  {
    title: 'International Affiliation',
    description:
      'Gain internationally recognised credentials and connect with global engineering bodies through IES partnerships and affiliation agreements.',
  },
  {
    title: 'Networking',
    description:
      'Join a vibrant community of engineering professionals across Somalia. Attend conferences, seminars, and events to build lasting professional relationships.',
  },
  {
    title: 'Communication',
    description:
      'Stay informed with IES journals, newsletters, and the Engineering in Somalia magazine. Share knowledge and contribute to the national engineering discourse.',
  },
];

export default function BecomeAMemberPage() {
  return (
    <>
      <PageHero
        eyebrow="Membership"
        title="Become a Member"
        description="Joining the Institution of Engineers of Somalia (IES) is a valuable investment in your future as an engineering and technology professional. Our membership benefits are designed to support your career development at every stage, from university, throughout your professional career, and through retirement."
      />

      <Section>
        <SectionHeading
          eyebrow="Why join IES"
          title="Why become an IES member"
        />
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          IES represents the voice of engineers in Somalia and provides a
          platform for engineering professionals to connect, share knowledge,
          exchange experiences, and contribute to the advancement of the
          engineering profession.
        </p>
        <ContentGrid columns={2} className="mt-6">
          {whyJoinReasons.map((reason, i) => (
            <Card key={reason.title} padded>
              <span className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#035CB3]/10 text-xs font-bold text-[#035CB3]">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="text-sm font-semibold text-[#022D5A]">
                {reason.title}
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                {reason.description}
              </p>
            </Card>
          ))}
        </ContentGrid>
      </Section>

      <Section tone="muted">
        <div className="mx-auto max-w-2xl text-center">
          <SectionHeading
            eyebrow="Get started"
            title="Ready to join the engineering community?"
          />
          <p className="mt-2 text-sm text-slate-600">
            Explore membership categories to find the right grade for your
            qualifications and experience, then follow the online application
            guidelines to submit your application.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button href={routes.membership.categories} variant="primary">
              View Membership Categories
            </Button>
            <Button href={routes.membership.applicationGuidelines} variant="secondary">
              Application Guidelines
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
