import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { routes } from '@/config/routes';

export const metadata = { title: 'IES By-Laws' };

export default function ByLawsPage() {
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
              { label: 'By-Laws' },
            ]}
          />
        }
        eyebrow="About IES"
        title="IES By-Laws"
        // description="Institutional by-laws governing IES operations."
      />
      <Section>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-base leading-relaxed text-slate-600">
            The By-laws will be developed and published following the completion and adoption of the amended Constitution.
          </p>
        </div>
      </Section>
    </>
  );
}
