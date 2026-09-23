import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { routes } from '@/config/routes';

export const metadata = { title: 'IES Constitution 2026' };

export default function Constitution2026Page() {
  return (
    <>
      <PageHero
        breadcrumbs={
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'About', href: routes.about.root },
              { label: 'Governance Resources', href: routes.about.governance.root },
              { label: 'IES Constitution 2026' },
            ]}
          />
        }
        eyebrow="About IES"
        title="IES Constitution 2026"
        // description="The Constitution of the Institution of Engineers of Somalia."
      />
      <Section>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-base leading-relaxed text-slate-600">
            The Constitution is currently under amendment and will be published upon completion.
          </p>
        </div>
      </Section>
    </>
  );
}
