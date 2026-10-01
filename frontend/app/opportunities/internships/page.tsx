import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { routes } from '@/config/routes';

export const metadata = { title: 'Internships' };

export default function InternshipsPage() {
  return (
    <>
      <PageHero
        breadcrumbs={
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Opportunities', href: routes.opportunities.root },
              { label: 'Internships' },
            ]}
          />
        }
        eyebrow="OPPORTUNITIES"
        title="Internships"
        description="Internship openings for engineering students and graduates"
      />
      <Section spacing="compact">
        <div className="flex flex-col gap-3 text-left text-xs leading-relaxed text-slate-700 sm:text-sm">
          <p>
            This section provides information on internship opportunities relevant to engineering students, graduates, and early-career professionals.
          </p>
          <p>
            Internship opportunities may be shared through IES and its professional, institutional, and development partners.
          </p>
          <p>
            Students and early-career professionals are encouraged to check this section regularly for new internship opportunities.
          </p>
        </div>
      </Section>
    </>
  );
}
