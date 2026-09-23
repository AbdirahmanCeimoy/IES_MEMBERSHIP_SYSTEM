import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { routes } from '@/config/routes';

export const metadata = { title: 'Code of Professional Practice and Ethics' };

export default function CodeOfProfessionalPracticePage() {
  return (
    <>
      <PageHero
        breadcrumbs={
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'About', href: routes.about.root },
              { label: 'Governance Resources', href: routes.about.governance.root },
              { label: 'Code of Professional Practice and Ethics' },
            ]}
          />
        }
        eyebrow="About IES"
        title="Code of Professional Practice and Ethics"
        // description="Professional practice and ethics code for IES members."
      />
      <Section>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-base leading-relaxed text-slate-600">
            The Code of Professional Practice and Ethics is currently under development and will be published upon completion.
          </p>
        </div>
      </Section>
    </>
  );
}
