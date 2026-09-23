import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { routes } from '@/config/routes';

export const metadata = { title: 'Strategic Plan 2026–2030' };

export default function StrategicPlanPage() {
  return (
    <>
      <PageHero
        breadcrumbs={
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'About', href: routes.about.root },
              { label: 'Governance Resources', href: routes.about.governance.root },
              { label: 'Strategic Plan 2026–2030' },
            ]}
          />
        }
        eyebrow="About IES"
        title="Strategic Plan 2026–2030"
        description="The IES 5-year strategic plan."
      />
      <Section>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-base leading-relaxed text-slate-600">
            The Strategic Plan 2026–2030 is currently under development and will be published upon completion.
          </p>
        </div>
      </Section>
    </>
  );
}
