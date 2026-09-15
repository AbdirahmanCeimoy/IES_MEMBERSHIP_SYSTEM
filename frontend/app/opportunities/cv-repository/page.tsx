import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { ContentGrid } from '@/components/public/ContentGrid';
import { routes } from '@/config/routes';

export const metadata = { title: 'CV Repository' };

export default function CVRepositoryPage() {
  return (
    <>
      <PageHero
        breadcrumbs={<Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Opportunities', href: routes.opportunities.root }, { label: 'CV Repository' }]} />}
        eyebrow="Talent"
        title="CV Repository"
        description="Submit your CV to the IES talent pool, or search the repository for engineering talent."
      />
      <Section>
        <ContentGrid columns={2}>
          <Card padded>
            <h3 className="text-sm font-semibold text-[#082B55]">Submit CV</h3>
            <p className="mt-1 text-sm text-slate-600">Add your CV to the IES talent pool.</p>
            <Button href={routes.auth.login} variant="primary" size="sm" className="mt-3">Sign in to submit</Button>
          </Card>
          <Card padded>
            <h3 className="text-sm font-semibold text-[#082B55]">Search CVs</h3>
            <p className="mt-1 text-sm text-slate-600">Registered organizations can browse the repository.</p>
            <Button href="mailto:info@iesomalia.org.so" variant="secondary" size="sm" className="mt-3">Request access</Button>
          </Card>
        </ContentGrid>
        <div className="mt-6">
          <EmptyState
            title="Live repository coming soon"
            description="IES DECISION REQUIRED - access rules, moderation and organization approvals will be wired to the Laravel API."
          />
        </div>
      </Section>
    </>
  );
}
