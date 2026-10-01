import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';

export const metadata = { title: 'Partner Organization Tenders' };

export default function PartnerOrganizationTendersPage() {
  return (
    <>
      <PageHero
        eyebrow="OPPORTUNITIES/TENDERS"
        title="Partner Organization Tenders"
        description="Open tenders and procurement opportunities from IES partner organizations"
      />
      <Section spacing="compact">
        <div className="flex flex-col gap-3 text-left text-xs leading-relaxed text-slate-700 sm:text-sm">
          <p>
            Through its network of partners, IES shares relevant tender and procurement opportunities issued by partner organizations.
          </p>
          <p>
            These opportunities may be of interest to engineering firms, consultants, contractors, suppliers, and other qualified organizations.
          </p>
          <p>
            We encourage organizations to check this section regularly for tender opportunities and procurement notices shared by IES partner organizations.
          </p>
        </div>
      </Section>
    </>
  );
}
