import Link from 'next/link';
import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { SectionHeading } from '@/components/layout/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ContentGrid } from '@/components/public/ContentGrid';
import { ValueList } from '@/components/public/ValueList';
import { CTASection } from '@/components/public/CTASection';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { routes } from '@/config/routes';
import {
  institutionSummary,
  institutionSummaryExtended,
  missionStatement,
  visionStatement,
  objectives,
  coreValues,
  whatWeDo,
} from '@/data/institution';

export const metadata = { title: 'About IES' };

const aboutSections = [
  { label: "President's Message", href: routes.about.presidentMessage, description: 'Message from Eng. Omar Abdi Arab, President of IES.' },
  { label: 'IES Council', href: routes.about.council, description: 'The principal governing body of the Institution.' },
  { label: 'Advisory Council', href: routes.about.advisoryCouncil, description: 'Strategic advisors supporting the IES Council.' },
  { label: 'Committees', href: routes.about.committees, description: 'Standing committees of the Institution 2026–2028.' },
  { label: 'Engineering Divisions', href: routes.about.divisions, description: 'Specialist groups across engineering disciplines.' },
  { label: 'Secretariat', href: routes.about.secretariat, description: 'The Secretariat team supporting IES operations.' },
  { label: 'Partners & Affiliations', href: routes.about.partners, description: 'International, regional and academic partners.' },
  { label: 'Board Nominations', href: routes.about.boardNominations, description: 'Members nominated by IES to boards and committees.' },
  { label: 'Governance Documents', href: routes.about.governance, description: 'By-Laws, Constitution, Code of Ethics and more.' },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        breadcrumbs={<Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'About IES' }]} />}
        eyebrow="About IES"
        title="Who We Are"
        description="Advancing engineering through knowledge, innovation and service for the benefit of humanity."
      />

      <Section>
        <div className="grid gap-8 lg:grid-cols-[3fr_2fr]">
          <div className="flex flex-col gap-4">
            <p className="text-sm leading-relaxed text-slate-700 sm:text-base">{institutionSummary}</p>
            <p className="text-sm leading-relaxed text-slate-700 sm:text-base">{institutionSummaryExtended}</p>
          </div>
          <div className="flex flex-col gap-3">
            <Card padded>
              <Badge tone="primary" className="mb-2">Vision</Badge>
              <p className="text-sm leading-relaxed text-slate-700">{visionStatement}</p>
            </Card>
            <Card padded>
              <Badge tone="primary" className="mb-2">Mission</Badge>
              <p className="text-sm leading-relaxed text-slate-700">{missionStatement}</p>
            </Card>
          </div>
        </div>
      </Section>

      <Section tone="muted">
        <SectionHeading eyebrow="Ideals" title="Objectives of IES" />
        <ContentGrid columns={2} className="mt-6">
          {objectives.map((obj) => (
            <Card key={obj.title} padded>
              <h3 className="text-sm font-semibold text-[#082B55]">{obj.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{obj.body}</p>
            </Card>
          ))}
        </ContentGrid>
      </Section>

      <Section>
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="What We Do" title="Services & activities" />
            <div className="mt-4 flex flex-col gap-3">
              {whatWeDo.slice(0, 4).map((item) => (
                <div key={item.title} className="border-l-2 border-[#0047AB] pl-3">
                  <h3 className="text-sm font-semibold text-[#082B55]">{item.title}</h3>
                  <p className="text-sm text-slate-600">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <SectionHeading eyebrow="Guided by" title="Our core values" />
            <div className="mt-4">
              <Card padded>
                <ValueList items={coreValues} />
              </Card>
            </div>
            <div className="mt-4">
              <Button href={routes.about.governance} variant="secondary" size="sm">
                Governance documents
              </Button>
            </div>
          </div>
        </div>
      </Section>

      <Section tone="muted">
        <SectionHeading eyebrow="Explore" title="More about the Institution" />
        <ContentGrid columns={3} className="mt-6">
          {aboutSections.map((s) => (
            <Card key={s.href} padded interactive>
              <Link href={s.href} className="flex flex-col gap-1">
                <h3 className="text-sm font-semibold text-[#082B55]">{s.label}</h3>
                <p className="text-xs text-slate-600">{s.description}</p>
                <span className="mt-2 text-xs font-semibold text-[#0047AB]">Learn more ›</span>
              </Link>
            </Card>
          ))}
        </ContentGrid>
      </Section>

      <CTASection
        eyebrow="Join us"
        title="Become part of Somalia's engineering community"
        primaryLabel="Apply for Membership"
        primaryHref={routes.membership.apply}
        secondaryLabel="Membership categories"
        secondaryHref={routes.membership.categories}
      />
    </>
  );
}
