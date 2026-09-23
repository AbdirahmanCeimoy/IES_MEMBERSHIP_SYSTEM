import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { SectionHeading } from '@/components/layout/SectionHeading';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Card } from '@/components/ui/Card';
import { ContentGrid } from '@/components/public/ContentGrid';
import { routes } from '@/config/routes';
import { secretariatPositions } from '@/data/institution';

export const metadata = { title: 'Secretariat' };

export default function SecretariatPage() {
  return (
    <>
      <PageHero
        breadcrumbs={<Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'About', href: routes.about.root }, { label: 'Secretariat' }]} />}
        eyebrow="About IES"
        title="The IES Secretariat"
        description="The Secretariat, headed by the Chief Executive Officer (CEO), supports the day-to-day administration and management of IES."
      />


      <Section>
        <div className="mb-6 grid gap-4 text-sm leading-relaxed text-slate-700 sm:text-base lg:grid-cols-2">
          <p>
            The Secretariat is responsible for the day-to-day administration and management of the
            Institution, ensuring the effective implementation of its mandate, policies, programmes
            and strategic objectives.
          </p>
          <p>
            The IES Secretariat works collaboratively with the Institution&apos;s leadership,
            members, government institutions, development partners, professional organizations and
            other stakeholders to advance the engineering profession and contribute to Somalia&apos;s
            sustainable development.
          </p>
          
        </div>

        <SectionHeading eyebrow="Positions" title="Secretariat structure" />
        <ContentGrid columns={3} className="mt-4">
          {secretariatPositions.map((role, i) => (
            <Card key={role} padded>
              <p className="text-[11px] font-semibold text-slate-400">
                {String(i + 1).padStart(2, '0')}
              </p>
              <p className="text-sm font-semibold text-[#022D5A]">{role}</p>
            </Card>
          ))}
        </ContentGrid>
      </Section>
    </>
  );
}
