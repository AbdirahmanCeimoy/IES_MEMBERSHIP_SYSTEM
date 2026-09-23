import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { routes } from '@/config/routes';

export const metadata = { title: 'Policies & Regulations' };

export default function PoliciesAndRegulationsPage() {
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
              { label: 'Policies & Regulations' },
            ]}
          />
        }
        eyebrow="About IES"
        title="Policies & Regulations"
        // description="Adopted policies and regulations of the Institution."
      />
      <Section>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-base leading-relaxed text-slate-600">
            IES Policies and Regulations are currently under development and will be published as they are finalized.
          </p>
        </div>
      </Section>
    </>
  );
}
