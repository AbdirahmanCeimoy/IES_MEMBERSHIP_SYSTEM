import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { routes } from '@/config/routes';

export const metadata = { title: 'Engineering Resources' };

export default function EngineeringResourcesPage() {
  return (
    <>
      <PageHero
        breadcrumbs={
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Info Hub', href: routes.infoHub.root },
              { label: 'Engineering Resources' },
            ]}
          />
        }
        eyebrow="Info Hub"
        title="Engineering Resources"
        description="Engineering references, standards, and learning materials"
      />
      <Section spacing="compact">
        <p className="text-left text-xs leading-relaxed text-slate-700 sm:text-sm">
          Stay informed and access useful engineering resources, references, guides, and professional materials.
        </p>
      </Section>
    </>
  );
}
