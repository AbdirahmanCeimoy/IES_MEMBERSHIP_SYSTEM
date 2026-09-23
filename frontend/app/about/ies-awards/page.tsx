import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { routes } from '@/config/routes';

export const metadata = { title: 'IES Awards – About IES' };

export default function AwardsPage() {
  return (
    <>
      <PageHero
        breadcrumbs={<Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'About IES', href: routes.about.root }, { label: 'IES Awards' }]} />}
        eyebrow="About IES"
        title="IES Awards"
        // description="Recognizing excellence in engineering and outstanding contributions to the profession."
      />

      <Section>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-base leading-relaxed text-slate-600">
            This section will feature the recipients of IES Awards, recognizing outstanding contributions and achievements in the engineering profession. Award details and recipient profiles will be published here as they become available.
          </p>
        </div>
      </Section>
    </>
  );
}
