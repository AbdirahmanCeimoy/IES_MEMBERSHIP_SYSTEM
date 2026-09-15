import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { SectionHeading } from '@/components/layout/SectionHeading';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ContentGrid } from '@/components/public/ContentGrid';
import { routes } from '@/config/routes';

export const metadata = { title: 'Opportunities' };

const sections = [
  { title: 'Jobs', body: 'IES careers and partner organization openings.', href: routes.opportunities.jobs },
  { title: 'Internships', body: 'Internship openings for engineering students and graduates.', href: routes.opportunities.internships },
  { title: 'Tenders', body: 'Open tenders at IES and partner organizations.', href: routes.opportunities.tenders },
  { title: 'CV Repository', body: 'Submit your CV or search the IES CV repository.', href: routes.opportunities.cvRepository },
];

export default function OpportunitiesPage() {
  return (
    <>
      <PageHero
        breadcrumbs={<Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Opportunities' }]} />}
        eyebrow="Grow"
        title="Opportunities"
        description="Jobs, internships, tenders and the IES CV repository - connecting members with real opportunities across Somalia and beyond."
      />
      <Section>
        <SectionHeading eyebrow="Browse" title="What are you looking for?" />
        <ContentGrid columns={2} className="mt-6">
          {sections.map((s) => (
            <Card key={s.href} padded interactive>
              <h3 className="text-sm font-semibold text-[#082B55]">{s.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{s.body}</p>
              <Button href={s.href} variant="ghost" size="sm" className="mt-3 px-0">Open ›</Button>
            </Card>
          ))}
        </ContentGrid>
      </Section>
    </>
  );
}
