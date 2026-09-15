import Image from 'next/image';
import HomeSlider from '@/components/HomeSlider';
import { Section } from '@/components/layout/Section';
import { SectionHeading } from '@/components/layout/SectionHeading';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ContentGrid } from '@/components/public/ContentGrid';
import { NewsCard } from '@/components/public/NewsCard';
import { MembershipCategoryCard } from '@/components/public/MembershipCategoryCard';
import { PartnerCard } from '@/components/public/PartnerCard';
import { ValueList } from '@/components/public/ValueList';
import { routes } from '@/config/routes';
import { site } from '@/config/site';
import {
  institutionSummary,
  missionStatement,
  visionStatement,
  coreValues,
  partners,
} from '@/data/institution';
import { membershipCategories } from '@/data/membership';
import { featuredNews } from '@/data/news';

export default function HomePage() {
  return (
    <>
      {/* Hero - full-bleed slider, centered institutional title */}
      <section className="relative isolate w-full overflow-hidden bg-[#082B55] text-white">
        <div className="absolute inset-0 w-full">
          <HomeSlider />
          <div className="absolute inset-0 bg-gradient-to-b from-[#082B55]/70 via-[#082B55]/55 to-[#0047AB]/70" />
        </div>
        <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-4 py-20 text-center sm:py-24 lg:py-28">
          <h1 className="text-3xl font-extrabold uppercase tracking-wide drop-shadow-md sm:text-4xl lg:text-5xl">
            The Institution of Engineers Somalia
          </h1>
          <p className="mt-4 max-w-2xl text-base text-blue-50 sm:text-lg">
            Advancing engineering excellence in Somalia. Collaborating with government
            and stakeholders to strengthen the industry and drive sustainable development.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button href={site.cta.primary.href} variant="accent" size="lg">
              Become a Member
            </Button>
            <Button
              href={site.cta.partner.href}
              variant="secondary"
              size="lg"
              className="border-white/40 bg-transparent text-white hover:bg-white/10"
            >
              Become a Partner
            </Button>
          </div>
        </div>
      </section>

      {/* President's Message preview */}
      <Section tone="default" spacing="relaxed">
        <div className="grid gap-8 lg:grid-cols-[2fr_3fr] lg:items-center">
          <Card className="flex flex-col items-start gap-3 bg-slate-50" padded>
            <Badge tone="primary">Message from the President</Badge>
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0047AB] text-lg font-bold text-white">
                OA
              </div>
              <div>
                <p className="text-sm font-semibold text-[#082B55]">Eng. Omar Abdi Arab, CE</p>
                <p className="text-xs text-slate-500">President, IES</p>
              </div>
            </div>
          </Card>

          <div className="flex flex-col gap-3">
            <SectionHeading
              eyebrow="Welcome"
              title="Building a resilient Somalia through engineering excellence"
              description="Somalia stands at a defining moment. Our nation needs resilient roads, bridges, water systems, ports, airports, renewable energy and modern urban infrastructure - engineers are at the centre of this transformation."
            />
            <Button href={routes.about.presidentMessage} variant="ghost" className="w-fit px-0">
              Read the full message ›
            </Button>
          </div>
        </div>
      </Section>

      {/* About preview: mission / vision / values */}
      <Section tone="muted" spacing="relaxed">
        <SectionHeading
          eyebrow="About IES"
          title="A trusted national body for engineering excellence"
          description={institutionSummary}
        />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Card padded>
            <Badge tone="primary" className="mb-2">Mission</Badge>
            <p className="text-sm leading-relaxed text-slate-700">{missionStatement}</p>
          </Card>
          <Card padded>
            <Badge tone="primary" className="mb-2">Vision</Badge>
            <p className="text-sm leading-relaxed text-slate-700">{visionStatement}</p>
          </Card>
          <Card padded>
            <Badge tone="accent" className="mb-2">Core Values</Badge>
            <ValueList items={coreValues} />
          </Card>
        </div>
        <div className="mt-6">
          <Button href={routes.about.root} variant="secondary">Learn more about IES</Button>
        </div>
      </Section>

      {/* Membership preview */}
      <Section spacing="relaxed">
        <SectionHeading
          eyebrow="Membership"
          title="Recognising engineers at every stage of their career"
          description="From student to Fellow, IES membership categories support career progression while maintaining high standards of competence, ethics and professional excellence."
          actions={<Button href={routes.membership.categories} variant="secondary" size="sm">All categories</Button>}
        />
        <ContentGrid columns={3} className="mt-8">
          {membershipCategories.slice(0, 6).map((category) => (
            <MembershipCategoryCard key={category.code} category={category} />
          ))}
        </ContentGrid>
      </Section>

      {/* Latest news */}
      <Section tone="muted" spacing="relaxed">
        <SectionHeading
          eyebrow="Info Hub"
          title="Latest news"
          description="Recent announcements and partnerships from the Institution of Engineers of Somalia."
          actions={<Button href={routes.infoHub.news} variant="secondary" size="sm">All news</Button>}
        />
        <ContentGrid columns={4} className="mt-8">
          {featuredNews.map((item) => (
            <NewsCard key={item.href} item={item} />
          ))}
        </ContentGrid>
      </Section>

      {/* Partners */}
      <Section spacing="relaxed">
        <SectionHeading
          eyebrow="Affiliations"
          title="Partners and collaborating organizations"
          description="IES works with international, regional and academic institutions to advance the engineering profession."
          actions={<Button href={routes.about.partners} variant="secondary" size="sm">All partners</Button>}
        />
        <ContentGrid columns={3} className="mt-8">
          {partners.slice(0, 6).map((partner) => (
            <PartnerCard key={partner.href} partner={partner} />
          ))}
        </ContentGrid>
      </Section>

      {/* Final CTA */}
      {/* Hidden preload to keep logo referenced when slider images fail */}
      <div className="sr-only">
        <Image src={site.logo} alt="" width={1} height={1} />
      </div>
    </>
  );
}
