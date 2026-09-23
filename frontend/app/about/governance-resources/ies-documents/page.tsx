import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Card } from '@/components/ui/Card';
import { ContentGrid } from '@/components/public/ContentGrid';
import { routes } from '@/config/routes';
import Link from 'next/link';

export const metadata = { title: 'IES Documents' };

const documents = [
  {
    title: 'By-Laws',
    // description: 'Institutional by-laws governing IES operations.',
    href: routes.about.governance.iesDocuments.byLaws,
  },
  {
    title: 'Policies & Regulations',
    description: 'Adopted policies and regulations of the Institution.',
    href: routes.about.governance.iesDocuments.policiesAndRegulations,
  },
  {
    title: 'Annual Reports',
    description: 'Annual institutional reports.',
    href: routes.about.governance.iesDocuments.annualReports,
  },
];

export default function IESDocumentsPage() {
  return (
    <>
      <PageHero
        breadcrumbs={
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'About', href: routes.about.root },
              { label: 'Governance Resources', href: routes.about.governance.root },
              { label: 'IES Documents' },
            ]}
          />
        }
        eyebrow="About IES"
        title="IES Documents"
        description="Official documents of the Institution of Engineers Somalia."
      />
      <Section>
        <ContentGrid columns={3} className="mt-2">
          {documents.map((doc) => (
            <Link key={doc.title} href={doc.href} className="block">
              <Card padded className="h-full transition-colors hover:border-[#035CB3]/30">
                <h3 className="text-sm font-semibold text-[#035CB3]">{doc.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{doc.description}</p>
              </Card>
            </Link>
          ))}
        </ContentGrid>
      </Section>
    </>
  );
}
