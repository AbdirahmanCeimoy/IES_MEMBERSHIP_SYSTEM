import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { SectionHeading } from '@/components/layout/SectionHeading';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ContentGrid } from '@/components/public/ContentGrid';
import { routes } from '@/config/routes';
import { committees, executiveCommittee } from '@/data/institution';

export const metadata = { title: 'Committees' };

export default function CommitteesPage() {
  return (
    <>
      <PageHero
        breadcrumbs={<Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'About', href: routes.about.root }, { label: 'Committees' }]} />}
        eyebrow="Governance"
        title="Committees 2026–2028"
        description="Standing committees of the Institution of Engineers of Somalia."
      />

      <Section>
        <SectionHeading eyebrow="Executive Committee" title="Officers of the Institution" />
        <ContentGrid columns={2} className="mt-4">
          {executiveCommittee.map((p) => (
            <Card key={p.name} padded>
              <p className="text-sm font-semibold text-[#082B55]">{p.name}</p>
              <p className="text-xs text-slate-600">{p.role}</p>
            </Card>
          ))}
        </ContentGrid>
      </Section>

      <Section tone="muted">
        <SectionHeading eyebrow="Standing Committees" title="Committee structure" description="Each committee is led by a Chairperson and a Vice Chairperson elected in accordance with the IES Constitution. IES DECISION REQUIRED - individual chair names to be published once confirmed." />
        <ContentGrid columns={2} className="mt-6">
          {committees.slice(1).map((c) => (
            <Card key={c.name} padded>
              <div className="mb-2 flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-[#082B55]">{c.name}</h3>
                <Badge tone="muted">2026–2028</Badge>
              </div>
              <ul className="text-xs text-slate-600">
                {c.roles.map((r) => (
                  <li key={r} className="border-b border-slate-100 py-1 last:border-0">
                    {r}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </ContentGrid>
      </Section>
    </>
  );
}
