import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { routes } from '@/config/routes';

export const metadata = { title: 'Presentations' };

export default function PresentationsPage() {
  return (
    <>
      <PageHero
        breadcrumbs={
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Info Hub', href: routes.infoHub.root },
              { label: 'Presentations' },
            ]}
          />
        }
        eyebrow="Info Hub"
        title="Presentations"
        description="Presentation materials and slides from IES events and activities"
      />
      <Section spacing="compact">
        <p className="text-left text-xs leading-relaxed text-slate-700 sm:text-sm">
          Keep an eye on technical insights, expert perspectives, and key ideas shared through IES programmes and professional events.
        </p>
      </Section>
    </>
  );
}
