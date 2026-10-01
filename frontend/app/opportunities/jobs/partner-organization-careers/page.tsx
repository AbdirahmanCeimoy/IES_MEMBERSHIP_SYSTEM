import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';

export const metadata = { title: 'Partner Organization Careers' };

export default function PartnerOrganizationCareersPage() {
  return (
    <>
      <PageHero
        eyebrow="OPPORTUNITIES/JOBS"
        title="Partner Organization Careers"
        description="Career opportunities from organizations partnering with IES"
      />
      <Section spacing="compact">
        <div className="flex flex-col gap-3 text-left text-xs leading-relaxed text-slate-700 sm:text-sm">
          <p>
            IES works with government institutions, international organizations, professional bodies, private-sector organizations, and other partners across the engineering and development sectors.
          </p>
          <p>
            This section provides career opportunities shared by IES partner organizations that may be relevant to engineers and other professionals.
          </p>
          <p>
            Members and visitors are encouraged to check this section regularly for new opportunities from our partner organizations.
          </p>
        </div>
      </Section>
    </>
  );
}
