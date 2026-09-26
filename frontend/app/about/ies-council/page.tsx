import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { SectionHeading } from '@/components/layout/SectionHeading';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { ContentGrid } from '@/components/public/ContentGrid';
import { PersonCard } from '@/components/public/PersonCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { routes } from '@/config/routes';
import { executiveCommittee } from '@/data/institution';

export const metadata = { title: 'IES Council' };

export default function CouncilPage() {
  return (
    <>
      <PageHero
        breadcrumbs={<Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'About', href: routes.about.root }, { label: 'Council' }]} />}
        eyebrow="About IES"
        title="IES Council 2026 – 2028"
        description="The principal governing body of the Institution of Engineers Somalia (IES)."
      />

      <Section>
        <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
          <div className="flex flex-col gap-3 text-sm leading-relaxed text-slate-700 sm:text-base">
            <p>
             The governance and affairs of the Institution of Engineers Somalia (IES) are entrusted to the IES Council, which serves as the principal governing body of the Institution. The Council is responsible for providing strategic leadership, establishing policies, overseeing the implementation of the Institution’s objectives, and promoting the advancement of the engineering profession in Somalia.
            </p>
            <p>
             The Council consists of the President, 1st Vice President, 2nd Vice President, Honorary Secretary, Honorary Treasurer, nine (9) Ordinary Council Members, including the Chairpersons of the IES Branches, who are elected by the members of the Institution at the Annual General Meeting (AGM), and the Immediate Past President, in accordance with the IES Constitution.
            </p>
            <p>
              The Council provides leadership in areas including professional standards, membership development, engineering education, Continuing Professional Development (CPD), innovation, and the promotion of ethical engineering practice.
            </p>
            <p>The Council has recently been reconstituted. Updated profiles and photographs of Council members will be published here shortly.</p>
          </div>
          <Card padded>
            <Badge tone="primary" className="mb-2">Council composition</Badge>
            <ul className="text-sm text-slate-700">
              <li className="border-b border-slate-100 py-1.5">President</li>
              <li className="border-b border-slate-100 py-1.5">1st Vice President</li>
              <li className="border-b border-slate-100 py-1.5">2nd Vice President
</li>
              <li className="border-b border-slate-100 py-1.5">Honorary Secretary</li>
              <li className="border-b border-slate-100 py-1.5">Honorary Treasurer</li>
              <li className="py-1.5">9 Elected Council Members</li>
              <li className="py-1.5">Chairpersons of IES Branches</li>
               <li className="py-1.5">Immidiate Past President</li>
            </ul>
          </Card>
        </div>
      </Section>

      {/* <Section tone="muted">
        <SectionHeading eyebrow="Leadership" title="Executive officers" description="Current officers of the Institution." />
        <ContentGrid columns={2} className="mt-6">
          {executiveCommittee.map((p) => (
            <PersonCard key={p.name} person={p} />
          ))}
        </ContentGrid>
      </Section> */}
{/* 
      <Section>
        <SectionHeading eyebrow="Council Members" title="15 elected members" />
        <div className="mt-6">
          <EmptyState
            title="Full council roster coming soon"
            description="IES DECISION REQUIRED - the elected 15 Council Members will be published here once the Institution shares the confirmed list. Contact info@iesomalia.org.so for enquiries."
          />
        </div>
      </Section> */}

      {/* <Section tone="muted">
        <SectionHeading eyebrow="Past leaders" title="Honour Board - Past Presidents" />
        <div className="mt-6">
          <EmptyState
            title="Past Presidents roster pending"
            description="IES DECISION REQUIRED - Honour Board entries will appear here once verified by the Institution."
          />
        </div>
      </Section> */}
    </>
  );
}
