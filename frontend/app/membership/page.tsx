import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { SectionHeading } from '@/components/layout/SectionHeading';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ContentGrid } from '@/components/public/ContentGrid';
import { MembershipCategoryCard } from '@/components/public/MembershipCategoryCard';
import { CTASection } from '@/components/public/CTASection';
import { ValueList } from '@/components/public/ValueList';
import { routes } from '@/config/routes';
import {
  whyJoinPillars,
  commonMembershipBenefits,
  membershipCategories,
} from '@/data/membership';

export const metadata = { title: 'Membership' };

export default function MembershipPage() {
  return (
    <>
      <PageHero
        breadcrumbs={<Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Membership' }]} />}
        eyebrow="Membership"
        title="Why join the Institution of Engineers of Somalia"
        description="Joining IES is a valuable investment in your future as an engineering and technology professional. Our benefits support your career from university, throughout your professional life, and through retirement."
        actions={
          <>
            <Button href={routes.membership.apply} variant="primary">Apply for Membership</Button>
            <Button href={routes.membership.categories} variant="secondary">See Categories</Button>
          </>
        }
      />

      <Section>
        <SectionHeading eyebrow="Why join IES" title="Four reasons engineers join IES" />
        <ContentGrid columns={2} className="mt-6">
          {whyJoinPillars.map((pillar, i) => (
            <Card key={pillar.title} padded>
              <Badge tone="primary" className="mb-2">{String(i + 1).padStart(2, '0')}</Badge>
              <h3 className="text-sm font-semibold text-[#082B55]">{pillar.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{pillar.body}</p>
            </Card>
          ))}
        </ContentGrid>
      </Section>

      <Section tone="muted">
        <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
          <div>
            <SectionHeading eyebrow="Categories" title="Membership grades" description="Recognising engineers at every stage of their academic and professional development." />
            <ContentGrid columns={2} className="mt-6">
              {membershipCategories.slice(0, 6).map((c) => (
                <MembershipCategoryCard key={c.code} category={c} />
              ))}
            </ContentGrid>
            <div className="mt-4">
              <Button href={routes.membership.categories} variant="secondary" size="sm">All categories</Button>
            </div>
          </div>
          <div>
            <SectionHeading eyebrow="Benefits" title="Common benefits" />
            <Card padded className="mt-4">
              <ValueList items={commonMembershipBenefits} />
            </Card>
            <div className="mt-4">
              <Button href={routes.membership.benefits} variant="secondary" size="sm">Benefits by grade</Button>
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="Ready to apply?" title="Application quick links" />
        <ContentGrid columns={3} className="mt-6">
          <Card padded>
            <h3 className="text-sm font-semibold text-[#082B55]">Requirements</h3>
            <p className="mt-1 text-sm text-slate-600">Documents and referees required for each grade.</p>
            <Button href={routes.membership.requirements} variant="ghost" size="sm" className="mt-3 px-0">
              View requirements ›
            </Button>
          </Card>
          <Card padded>
            <h3 className="text-sm font-semibold text-[#082B55]">Fees</h3>
            <p className="mt-1 text-sm text-slate-600">Application fees for each membership category.</p>
            <Button href={routes.membership.fees} variant="ghost" size="sm" className="mt-3 px-0">
              View fees ›
            </Button>
          </Card>
          <Card padded>
            <h3 className="text-sm font-semibold text-[#082B55]">Organizations</h3>
            <p className="mt-1 text-sm text-slate-600">Organization membership for companies and institutions.</p>
            <Button href={routes.membership.organizations} variant="ghost" size="sm" className="mt-3 px-0">
              View organization membership ›
            </Button>
          </Card>
        </ContentGrid>
      </Section>

      <CTASection
        eyebrow="Apply today"
        title="Join the national engineering community"
        primaryLabel="Apply for Membership"
        primaryHref={routes.membership.apply}
        secondaryLabel="Member Check"
        secondaryHref={routes.membership.memberCheck}
      />
    </>
  );
}
