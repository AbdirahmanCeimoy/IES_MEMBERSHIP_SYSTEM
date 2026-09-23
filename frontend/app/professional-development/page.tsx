import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { SectionHeading } from '@/components/layout/SectionHeading';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ContentGrid } from '@/components/public/ContentGrid';

export const metadata = { title: 'Professional Development' };

const tracks = [
  { title: 'CPD', body: 'Continuing Professional Development activities that keep members aligned with emerging technologies, standards and best practices.', href: '/professional-development/cpd' },
  { title: 'Events Calendar', body: 'Full IES events calendar for 2026 including conferences, seminars and technical activities.', href: '/professional-development/events' },
  { title: 'Training Calendar', body: 'Structured training programmes offered by IES throughout the year.', href: '/professional-development/training-calendar' },
  { title: 'Seminars', body: 'Seminars keeping members informed on the latest engineering practices and management strategies.', href: '/professional-development/seminars' },
  { title: 'Conferences', body: 'National and international engineering conferences hosted or supported by IES.', href: '/professional-development/conferences' },
  { title: 'CPD Courses', body: 'Short, focused CPD courses designed to strengthen specific technical and professional skills.', href: '/professional-development/courses' },
];

export default function PDPage() {
  return (
    <>
      <PageHero
        breadcrumbs={<Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Professional Development' }]} />}
        eyebrow="Grow with IES"
        title="Professional Development"
        description="Workshops, technical seminars, training programmes and Continuing Professional Development activities that strengthen the knowledge, skills and professional growth of engineers."
      />
      <Section>
        <SectionHeading eyebrow="Explore" title="Programmes and activities" />
        <ContentGrid columns={3} className="mt-6">
          {tracks.map((t) => (
            <Card key={t.title} padded interactive>
              <h3 className="text-sm font-semibold text-[#022D5A]">{t.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{t.body}</p>
              <Button href={t.href} variant="ghost" size="sm" className="mt-3 px-0">Explore ›</Button>
            </Card>
          ))}
        </ContentGrid>
      </Section>
    </>
  );
}
