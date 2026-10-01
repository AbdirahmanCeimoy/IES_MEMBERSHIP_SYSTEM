import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';

export const metadata = { title: 'Conferences' };

export default function ConferencesPage() {
  return (
    <>
      <PageHero
        eyebrow="IES Programmes"
        title="Conferences"
        description="National and international engineering conferences hosted or supported by the Institution of Engineers Somalia (IES)"
      />
      <Section spacing="compact">
        <p className="text-left text-xs leading-relaxed text-slate-700 sm:text-sm">
          Connect with engineering professionals, industry leaders, and experts through conferences that promote knowledge sharing and professional networking.
        </p>
      </Section>
    </>
  );
}
