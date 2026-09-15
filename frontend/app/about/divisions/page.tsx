import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Card } from '@/components/ui/Card';
import { ContentGrid } from '@/components/public/ContentGrid';
import { routes } from '@/config/routes';
import { engineeringDivisions } from '@/data/institution';

export const metadata = { title: 'Engineering Divisions' };

export default function DivisionsPage() {
  return (
    <>
      <PageHero
        breadcrumbs={<Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'About', href: routes.about.root }, { label: 'Divisions' }]} />}
        eyebrow="Structure"
        title="Engineering Divisions"
        description="Specialist groups established by IES to further the aims and objectives of the Institution and to promote professional excellence within specific engineering disciplines."
      />
      <Section>
        <div className="mb-6 flex flex-col gap-3 text-sm leading-relaxed text-slate-700 sm:text-base">
          <p>
            All Specialist Groups of IES shall operate in accordance with the IES Constitution and
            shall be guided by the relevant By-laws, policies and regulations of the Institution.
          </p>
          <p>
            Membership of each Division shall comprise people who are elected, admitted, or
            transferred into any category of membership of IES and whose professional qualifications,
            experience or specialization fall within the relevant engineering discipline.
          </p>
        </div>
        <ContentGrid columns={4}>
          {engineeringDivisions.map((d) => (
            <Card key={d} padded interactive>
              <p className="text-sm font-semibold text-[#082B55]">{d}</p>
            </Card>
          ))}
        </ContentGrid>
      </Section>
    </>
  );
}
