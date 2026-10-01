import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { routes } from '@/config/routes';

export const metadata = { title: 'Engineering Magazine' };

export default function MagazinePage() {
  return (
    <>
      <PageHero
        breadcrumbs={
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Info Hub', href: routes.infoHub.root },
              { label: 'Magazine' },
            ]}
          />
        }
        eyebrow="Info Hub"
        title="Engineering in Somalia Magazine"
        description="Technical articles, industry insights, and professional perspectives"
      />
      <Section spacing="compact">
        <p className="text-left text-xs leading-relaxed text-slate-700 sm:text-sm">
          Stay connected with the latest stories, projects, innovations, and developments shaping engineering in Somalia.
        </p>
      </Section>
    </>
  );
}
