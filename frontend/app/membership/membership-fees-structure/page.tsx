import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ContentGrid } from '@/components/public/ContentGrid';
import { EmptyState } from '@/components/ui/EmptyState';
import { routes } from '@/config/routes';
import { membershipRequirements } from '@/data/membership';

export const metadata = { title: 'Membership Fees' };

export default function FeesPage() {
  return (
    <>
      <PageHero
        breadcrumbs={<Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Membership', href: routes.membership.root }, { label: 'Fees' }]} />}
        eyebrow="Membership"
        title="Membership Fees Structure"
        description="Application fees for each IES membership category."
      />
      <Section>
        <ContentGrid columns={4}>
          {membershipRequirements.map((r) => (
            <Card key={r.category} padded>
              <p className="text-xs text-slate-500">{r.category}</p>
              <p className="mt-1 text-2xl font-bold text-[#022D5A]">{r.fee}</p>
              <Badge tone="muted" className="mt-2">Application Fee</Badge>
            </Card>
          ))}
        </ContentGrid>
      </Section>
      <Section tone="muted">
        <EmptyState
          title="Annual subscription and renewal fees"
          description="IES DECISION REQUIRED - the annual subscription schedule, renewal fees and organization membership fees will be published here once approved by the Institution."
        />
      </Section>
    </>
  );
}
