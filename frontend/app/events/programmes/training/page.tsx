import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';

export const metadata = { title: 'Training' };

export default function TrainingPage() {
  return (
    <>
      <PageHero
        eyebrow="IES Programmes"
        title="Training"
        description="Structured training programmes offered by IES to strengthen the technical and professional capabilities of engineers"
      />
      <Section spacing="compact">
        <p className="text-left text-xs leading-relaxed text-slate-700 sm:text-sm">
          Enhance your knowledge and professional skills through practical training programmes designed for engineers and professionals.
        </p>
      </Section>
    </>
  );
}
