import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { routes } from '@/config/routes';

export const metadata = { title: 'Speeches' };

export default function SpeechesPage() {
  return (
    <>
      <PageHero
        breadcrumbs={
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Info Hub', href: routes.infoHub.root },
              { label: 'Speeches' },
            ]}
          />
        }
        eyebrow="Info Hub"
        title="Speeches"
        description="Official speeches by IES leadership"
      />
      <Section spacing="compact">
        <p className="text-left text-xs leading-relaxed text-slate-700 sm:text-sm">
          Follow key messages, perspectives, and highlights from IES leaders and distinguished guests at professional events.
        </p>
      </Section>
    </>
  );
}
