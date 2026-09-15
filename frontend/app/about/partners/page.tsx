import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { SectionHeading } from '@/components/layout/SectionHeading';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { ContentGrid } from '@/components/public/ContentGrid';
import { PartnerCard } from '@/components/public/PartnerCard';
import { routes } from '@/config/routes';
import { partners } from '@/data/institution';

export const metadata = { title: 'Partners & Affiliations' };

const grouped = partners.reduce<Record<string, typeof partners>>((acc, p) => {
  const key = p.scope ?? 'Other';
  acc[key] = acc[key] ?? [];
  acc[key].push(p);
  return acc;
}, {});

export default function PartnersPage() {
  return (
    <>
      <PageHero
        breadcrumbs={<Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'About', href: routes.about.root }, { label: 'Partners' }]} />}
        eyebrow="Collaborations"
        title="Partners and Affiliations"
        description="IES works with institutions and organizations that promote and develop the engineering profession, best practices, sustainable development and the welfare of engineers in Somalia and around the world."
      />
      <Section>
        {Object.entries(grouped).map(([scope, list]) => (
          <div key={scope} className="mb-8 last:mb-0">
            <SectionHeading eyebrow={scope} title={`${scope} partners`} />
            <ContentGrid columns={3} className="mt-4">
              {list.map((p) => (
                <PartnerCard key={p.href} partner={p} />
              ))}
            </ContentGrid>
          </div>
        ))}
      </Section>
    </>
  );
}
