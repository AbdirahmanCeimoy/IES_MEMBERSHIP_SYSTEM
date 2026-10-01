import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';

export const metadata = { title: 'IES Career' };

export default function IESCareerPage() {
  return (
    <>
      <PageHero
        eyebrow="OPPORTUNITIES/JOBS"
        title="IES Career"
        description="Explore career opportunities within the Institution of Engineers Somalia (IES)"
      />
      <Section spacing="compact">
        <div className="flex flex-col gap-3 text-left text-xs leading-relaxed text-slate-700 sm:text-sm">
          <p>
            At the Institution of Engineers Somalia (IES), we value our people and are committed to providing opportunities for talented professionals to contribute to the development of engineering in Somalia.
          </p>
          <p>
            IES career opportunities may include positions across engineering, administration, project management, professional development, and other areas supporting our work.
          </p>
          <p>
            We encourage qualified professionals and members to check this section regularly for career opportunities with IES.
          </p>
        </div>
      </Section>
    </>
  );
}
