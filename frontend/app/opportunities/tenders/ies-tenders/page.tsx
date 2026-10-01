import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';

export const metadata = { title: 'IES Tenders' };

export default function IESTendersPage() {
  return (
    <>
      <PageHero
        eyebrow="OPPORTUNITIES/TENDERS"
        title="IES Tenders"
        description="Open tenders and procurement opportunities from the Institution of Engineers Somalia (IES)"
      />
      <Section spacing="compact">
        <div className="flex flex-col gap-3 text-left text-xs leading-relaxed text-slate-700 sm:text-sm">
          <p>
            IES is committed to transparency, professionalism, and fair procurement practices.
          </p>
          <p>
            This section provides information on tender and procurement opportunities issued by the Institution of Engineers Somalia for eligible companies, consultants, contractors, suppliers, and service providers.
          </p>
          <p>
            Interested organizations are encouraged to regularly check this section for new IES tender opportunities and relevant procurement notices.
          </p>
        </div>
      </Section>
    </>
  );
}
