import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { routes } from '@/config/routes';

export const metadata = { title: 'Member Check' };

export default function MemberCheckPage() {
  return (
    <>
      <PageHero
        breadcrumbs={<Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Membership', href: routes.membership.root }, { label: 'Member Check' }]} />}
        eyebrow="Verification"
        title="IES Member Check"
        description="Verify the standing of an IES member by name or registration number."
      />

      <Section>
        <Card padded className="max-w-2xl">
          <form className="flex flex-col gap-3" aria-label="Member check">
            <label className="text-sm font-semibold text-[#082B55]" htmlFor="mc-query">
              Member name or registration number
            </label>
            <input
              id="mc-query"
              type="text"
              placeholder="e.g. IES-2025-0001 or Full Name"
              className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-[#0047AB] focus:outline-none focus:ring-1 focus:ring-[#0047AB]"
            />
            <div>
              <Button type="submit" variant="primary" size="md">Check membership</Button>
            </div>
          </form>
        </Card>
      </Section>

      <Section tone="muted">
        <EmptyState
          title="Search backend not yet connected"
          description="IES DECISION REQUIRED - this lookup will be wired to the Laravel members API. For now, contact info@iesomalia.org.so to verify a member."
          action={<Button href="mailto:info@iesomalia.org.so" variant="secondary" size="sm">Email IES</Button>}
        />
      </Section>
    </>
  );
}
