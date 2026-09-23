import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { SectionHeading } from '@/components/layout/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ContentGrid } from '@/components/public/ContentGrid';

export const metadata = { title: 'Professional Development' };

const programmes = [
  {
    title: 'Continuing Professional Development (CPD)',
    description:
      'IES offers a structured CPD framework to help members maintain and enhance their competence throughout their careers. Track your professional growth, earn CPD credits, and demonstrate your commitment to engineering excellence.',
  },
  {
    title: 'Training Programmes',
    description:
      'Access specialised training workshops and short courses designed to build technical and professional skills. Programmes cover emerging technologies, project management, leadership, and industry-specific topics.',
  },
  {
    title: 'Conferences and Events',
    description:
      'Participate in national and regional engineering conferences, technical seminars, and networking events organised by IES. Present research, learn from industry leaders, and connect with fellow professionals.',
  },
  {
    title: 'Mentorship and Guidance',
    description:
      'Benefit from mentorship opportunities that connect early-career engineers with experienced professionals. Gain practical advice, career guidance, and support on your path to professional registration.',
  },
];

export default function ProfessionalDevelopmentPage() {
  return (
    <>
      <PageHero
        eyebrow="Membership"
        title="Professional Development"
        description="IES organises professional development programmes to enhance the skills, knowledge, and competence of engineering professionals at every stage of their careers."
      />

      <Section>
        <SectionHeading
          eyebrow="Programmes"
          title="Development opportunities for members"
        />
        <ContentGrid columns={2} className="mt-6">
          {programmes.map((prog) => (
            <Card key={prog.title} padded>
              <h3 className="text-sm font-semibold text-[#022D5A]">
                {prog.title}
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                {prog.description}
              </p>
            </Card>
          ))}
        </ContentGrid>
      </Section>

      <Section tone="muted">
        <div className="mx-auto max-w-2xl text-center">
          <SectionHeading
            eyebrow="Explore more"
            title="Visit the Professional Development section"
          />
          <p className="mt-2 text-sm text-slate-600">
            View upcoming training events, seminars, conferences, and CPD
            activities available to IES members and the wider engineering
            community.
          </p>
          <div className="mt-6">
            <Button href="/professional-development" variant="primary">
              Professional Development
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
