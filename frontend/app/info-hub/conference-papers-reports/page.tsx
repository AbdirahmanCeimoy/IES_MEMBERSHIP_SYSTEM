import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { routes } from '@/config/routes';

export const metadata = { title: 'Conference Papers' };

export default function ConferencePapersPage() {
  return (
    <>
      <PageHero
        breadcrumbs={
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Info Hub', href: routes.infoHub.root },
              { label: 'Conference Papers' },
            ]}
          />
        }
        eyebrow="Info Hub"
        title="Conference Papers & Reports"
        description="Papers and reports presented at IES conferences and technical forums"
      />
      <Section spacing="compact">
        <p className="text-left text-xs leading-relaxed text-slate-700 sm:text-sm">
          Stay updated with key discussions, technical insights, and outcomes from engineering conferences and professional events.
        </p>
      </Section>
    </>
  );
}
