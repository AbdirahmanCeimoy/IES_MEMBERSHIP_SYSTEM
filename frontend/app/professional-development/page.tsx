import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { SectionHeading } from '@/components/layout/SectionHeading';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ContentGrid } from '@/components/public/ContentGrid';
import { routes } from '@/config/routes';

export const metadata = { title: 'Professional Development' };

const tracks = [
  { title: 'CPD', body: 'Continuing Professional Development activities that keep members aligned with emerging technologies, standards and best practices.', href: routes.professionalDevelopment.cpd },
  { title: 'Events Calendar', body: 'Full IES events calendar for 2026 including conferences, seminars and technical activities.', href: routes.professionalDevelopment.events },
  { title: 'Training Calendar', body: 'Structured training programmes offered by IES throughout the year.', href: routes.professionalDevelopment.trainingCalendar },
  { title: 'Seminars', body: 'Seminars keeping members informed on the latest engineering practices and management strategies.', href: routes.professionalDevelopment.seminars },
  { title: 'Conferences', body: 'National and international engineering conferences hosted or supported by IES.', href: routes.professionalDevelopment.conferences },
  { title: 'CPD Courses', body: 'Short, focused CPD courses designed to strengthen specific technical and professional skills.', href: routes.professionalDevelopment.courses },
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
              <h3 className="text-sm font-semibold text-[#082B55]">{t.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{t.body}</p>
              <Button href={t.href} variant="ghost" size="sm" className="mt-3 px-0">Explore ›</Button>
            </Card>
          ))}
        </ContentGrid>
      </Section>
    </>
  );
}
