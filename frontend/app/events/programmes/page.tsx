import Link from 'next/link';
import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { SectionHeading } from '@/components/layout/SectionHeading';
import { Card } from '@/components/ui/Card';
import { ContentGrid } from '@/components/public/ContentGrid';
import { routes } from '@/config/routes';

export const metadata = { title: 'IES Programmes' };

const programmes = [
  {
    title: 'Seminars',
    description: 'Technical and professional seminars keeping members informed on the latest engineering practices.',
    href: routes.events.programmes.seminars,
  },
  {
    title: 'Training',
    description: 'Structured training programmes designed to strengthen technical and professional skills.',
    href: routes.events.programmes.training,
  },
  {
    title: 'Conferences',
    description: 'National and international engineering conferences hosted or supported by IES.',
    href: routes.events.programmes.conferences,
  },
  {
    title: 'CPD Courses',
    description: 'Continuing Professional Development courses aligned with industry standards and best practices.',
    href: routes.events.programmes.cpdCourses,
  },
  {
    title: 'Other Programmes',
    description: 'Additional professional activities and programmes organised by the Institution.',
    href: routes.events.programmes.others,
  },
];

export default function ProgrammesPage() {
  return (
    <>
      <PageHero
        eyebrow="Programmes"
        title="IES Programmes"
        description="Professional programmes organised by the Institution of Engineers Somalia, including seminars, training, conferences and CPD courses."
      />

      <Section>
        <SectionHeading eyebrow="Explore" title="Programme categories" />
        <ContentGrid columns={3} className="mt-6">
          {programmes.map((prog) => (
            <Card key={prog.href} padded interactive>
              <Link href={prog.href} className="flex flex-col gap-1">
                <h3 className="text-sm font-semibold text-[#022D5A]">{prog.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{prog.description}</p>
                <span className="mt-3 text-xs font-semibold text-[#035CB3]">View ›</span>
              </Link>
            </Card>
          ))}
        </ContentGrid>
      </Section>
    </>
  );
}
