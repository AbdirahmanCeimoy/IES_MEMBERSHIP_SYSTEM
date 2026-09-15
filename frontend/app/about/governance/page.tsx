import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { SectionHeading } from '@/components/layout/SectionHeading';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { ContentGrid } from '@/components/public/ContentGrid';
import { DocumentCard } from '@/components/public/DocumentCard';
import { routes } from '@/config/routes';
import { governanceDocuments } from '@/data/institution';

export const metadata = { title: 'Governance Documents' };

export default function GovernancePage() {
  return (
    <>
      <PageHero
        breadcrumbs={<Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'About', href: routes.about.root }, { label: 'Governance' }]} />}
        eyebrow="Instruments of Power"
        title="Governance Resources"
        description="Core institutional documents that guide the operations, ethics and strategic direction of the Institution of Engineers of Somalia."
      />
      <Section>
        <SectionHeading eyebrow="IES Documents" title="Available documents" description="IES DECISION REQUIRED - document links will be populated once official PDFs are uploaded." />
        <ContentGrid columns={2} className="mt-6">
          {governanceDocuments.map((d) => (
            <DocumentCard key={d.title} doc={d} />
          ))}
        </ContentGrid>
      </Section>
    </>
  );
}
