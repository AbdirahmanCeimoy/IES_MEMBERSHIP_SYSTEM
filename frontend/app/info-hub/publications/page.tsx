import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { routes } from '@/config/routes';

export const metadata = { title: 'Publications' };

export default function PublicationsPage() {
  return (
    <>
      <PageHero
        breadcrumbs={
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Info Hub', href: routes.infoHub.root },
              { label: 'Publications' },
            ]}
          />
        }
        eyebrow="Info Hub"
        title="IES Publications"
        description="Technical papers, reports, and guidelines from IES"
      />
      <Section spacing="compact">
        <p className="text-left text-xs leading-relaxed text-slate-700 sm:text-sm">
          Stay updated with IES publications, professional insights, and developments shaping the engineering profession in Somalia.
        </p>
      </Section>
    </>
  );
}
