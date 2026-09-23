import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { routes } from '@/config/routes';

export const metadata = { title: 'Annual Reports' };

export default function AnnualReportsPage() {
  return (
    <>
      <PageHero
        breadcrumbs={
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'About', href: routes.about.root },
              { label: 'Governance Resources', href: routes.about.governance.root },
              { label: 'IES Documents', href: routes.about.governance.iesDocuments.root },
              { label: 'Annual Reports' },
            ]}
          />
        }
        eyebrow="About IES"
        title="Annual Reports"
        // description="Annual institutional reports of IES."
      />
      <Section>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-base leading-relaxed text-slate-600">
            The Annual Report is currently under preparation and will be published upon completion.
          </p>
        </div>
      </Section>
    </>
  );
}
