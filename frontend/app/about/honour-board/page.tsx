import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { SectionHeading } from '@/components/layout/SectionHeading';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { routes } from '@/config/routes';

export const metadata = { title: 'Honour Board (Past Presidents) – About IES' };

export default function HonourBoardPage() {
  return (
    <>
      <PageHero
        breadcrumbs={<Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'About IES', href: routes.about.root }, { label: 'Honour Board' }]} />}
        eyebrow="About IES"
        title="Honour Board (Past Presidents)"
        
        description="Discover our contributions to the engineering community."
      />

      <Section>
        <SectionHeading eyebrow="Leadership Legacy" title="Past Presidents of IES" />
        <div className="mx-auto mt-8 max-w-2xl text-center">
          <p className="text-base leading-relaxed text-slate-600">
            This section is reserved for the distinguished engineers who will have served as President of the Institution of Engineers Somalia (IES). Profiles and terms of office will be published here as the leadership history of the Institution develops.
          </p>
        </div>
      </Section>

    </>
  );
}
