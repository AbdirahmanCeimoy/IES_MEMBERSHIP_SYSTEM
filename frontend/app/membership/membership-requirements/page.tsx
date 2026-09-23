import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ContentGrid } from '@/components/public/ContentGrid';
import { ValueList } from '@/components/public/ValueList';
import { routes } from '@/config/routes';
import { membershipRequirements } from '@/data/membership';

export const metadata = { title: 'Membership Requirements' };

export default function RequirementsPage() {
  return (
    <>
      <PageHero
        breadcrumbs={<Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Membership', href: routes.membership.root }, { label: 'Requirements' }]} />}
        eyebrow="Membership"
        title="Application Requirements"
        description="Documents, referees and fees required for each IES membership category. Every applicant must be supported by two existing IES members (proposer and seconder)."
      />
      <Section>
        <ContentGrid columns={2}>
          {membershipRequirements.map((r) => (
            <Card key={r.category} padded>
              <div className="mb-3 flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-[#022D5A]">{r.category}</h3>
                <Badge tone="accent">Fee: {r.fee}</Badge>
              </div>
              <ValueList items={r.items} />
            </Card>
          ))}
        </ContentGrid>
      </Section>
    </>
  );
}
