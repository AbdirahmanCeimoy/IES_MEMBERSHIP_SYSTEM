import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { routes } from '@/config/routes';

export const metadata = { title: 'Documentary' };

export default function DocumentaryPage() {
  return (
    <>
      <PageHero
        breadcrumbs={
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Info Hub', href: routes.infoHub.root },
              { label: 'Documentary' },
            ]}
          />
        }
        eyebrow="info hub"
        title="Documentary"
        description="Documentaries showcasing IES activities, events, and engineering initiatives in Somalia"
      />
      <Section spacing="compact">
        <p className="text-left text-xs leading-relaxed text-slate-700 sm:text-sm">
          This section will feature documentaries highlighting IES activities, engineering initiatives, events, and the development of the engineering profession in Somalia.
        </p>
      </Section>
    </>
  );
}
