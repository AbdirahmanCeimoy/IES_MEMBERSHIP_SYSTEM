import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { SectionHeading } from '@/components/layout/SectionHeading';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Card } from '@/components/ui/Card';
import { ContentGrid } from '@/components/public/ContentGrid';
import { routes } from '@/config/routes';
import Link from 'next/link';

export const metadata = { title: 'Governance Resources' };

const governanceItems = [
  {
    title: 'IES Documents',
    description: 'By-Laws, Policies & Regulations, and Annual Reports.',
    href: routes.about.governance.iesDocuments.root,
  },
  {
    title: 'IES Brochure',
    description: 'Official IES informational brochure.',
    href: routes.about.governance.brochure,
  },
  {
    title: 'IES Constitution 2026',
    description: 'The Constitution of the Institution of Engineers of Somalia.',
    href: routes.about.governance.constitution2026,
  },
  {
    title: 'Code of Professional Practice and Ethics',
    description: 'Professional practice and ethics code for members.',
    href: routes.about.governance.codeOfProfessionalPractice,
  },
  {
    title: 'Strategic Plan 2026–2030',
    description: 'The IES 5-year strategic plan.',
    href: routes.about.governance.strategicPlan2026_2030,
  },
];

export default function GovernancePage() {
  return (
    <>
      <PageHero
        breadcrumbs={<Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'About', href: routes.about.root }, { label: 'Governance Resources' }]} />}
        eyebrow="About IES"
        title="Governance Resources"
        description="Core institutional documents that guide the operations, ethics and strategic direction of the Institution of Engineers Somalia."
      />
      <Section>
        <SectionHeading title="Available Documents" />
        <ContentGrid columns={2} className="mt-6">
          {governanceItems.map((item) => (
            <Link key={item.title} href={item.href} className="block">
              <Card padded className="h-full transition-colors hover:border-[#035CB3]/30">
                <h3 className="text-sm font-semibold text-[#035CB3]">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{item.description}</p>
              </Card>
            </Link>
          ))}
        </ContentGrid>
      </Section>
    </>
  );
}
