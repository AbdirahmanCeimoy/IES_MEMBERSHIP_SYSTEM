import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { SectionHeading } from '@/components/layout/SectionHeading';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { ContentGrid } from '@/components/public/ContentGrid';
import { routes } from '@/config/routes';

export const metadata = { title: 'Board Nominations' };

const keyPartners = [
  'World Federation of Engineering Organizations (WFEO)',
  'Federation of African Engineering Organisations (FAEO)',
  'East African Federation of Engineering Organisations (EAFEO)',
  'Engineering institutions and professional bodies',
  'Government institutions and development partners',
];

export default function BoardNominationsPage() {
  return (
    <>
      <PageHero
        breadcrumbs={<Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'About', href: routes.about.root }, { label: 'Board Nominations' }]} />}
        eyebrow="Appointments"
        title="Nominations by IES to Boards"
        description="IES actively nominates its members to serve on various boards, committees and professional platforms, contributing their expertise to the engineering profession and the development of society."
      />

      <Section>
        <SectionHeading eyebrow="Key Partners" title="Where IES nominates members" />
        <ContentGrid columns={2} className="mt-4">
          {keyPartners.map((p) => (
            <Card key={p} padded>
              <p className="text-sm text-slate-700">{p}</p>
            </Card>
          ))}
        </ContentGrid>
      </Section>

      <Section tone="muted">
        <SectionHeading eyebrow="Nominees" title="Members Nominated by IES" />
        <div className="mt-6">
          <EmptyState
            title="Nominee roster coming soon"
            description="IES DECISION REQUIRED - the list of nominated members with names, designations and organizations will appear here once confirmed."
          />
        </div>
      </Section>
    </>
  );
}
