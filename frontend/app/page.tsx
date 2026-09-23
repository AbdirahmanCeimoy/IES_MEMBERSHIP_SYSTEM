import Image from 'next/image';
import HomeSlider from '@/components/HomeSlider';
import { Section } from '@/components/layout/Section';
import { SectionHeading } from '@/components/layout/SectionHeading';
import { Button } from '@/components/ui/Button';
import { NewsCard } from '@/components/public/NewsCard';
import { PartnersStakeholdersStrip } from '@/components/public/PartnersStakeholdersStrip';
import { routes } from '@/config/routes';
import { site } from '@/config/site';
import {
  institutionSummary,
  missionStatement,
  visionStatement,
} from '@/data/institution';
import { featuredNews } from '@/data/news';

export default function HomePage() {
  return (
    <>
      {/* Hero - full-bleed slider, centered institutional title */}
      <section className="relative isolate w-full overflow-hidden bg-[#022D5A] text-white">
        <div className="absolute inset-0 w-full">
          <HomeSlider />
          <div className="absolute inset-0 bg-gradient-to-b from-[#022D5A]/70 via-[#022D5A]/55 to-[#035CB3]/70" />
        </div>
        <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-4 py-20 text-center sm:py-24 lg:py-28">
          <h1 className="text-3xl font-extrabold uppercase tracking-wide drop-shadow-md sm:text-4xl lg:text-5xl">
            Advancing engineering excellence in Somalia
          </h1>
          <p className="mt-4 max-w-2xl text-base text-blue-50 sm:text-lg">
            The Institution of Engineers Somalia (IES) works in collaboration with institutions and organizations that seek to promote and advance the engineering profession and best practices both nationally and internationally.
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

      {/* About preview: mission / vision / values */}
      <Section tone="muted" spacing="relaxed">
        <SectionHeading
          eyebrow="About IES"
          title="A trusted national body for engineering excellence"
          description={institutionSummary}
        />

        {/* Mission & Vision */}
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#035CB3] to-[#024A8F] p-8 text-white shadow-lg transition-transform hover:-translate-y-0.5">
            <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/5" />
            <div className="absolute -bottom-4 -left-4 h-20 w-20 rounded-full bg-white/5" />
            <div className="relative">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2a14.5 14.5 0 000 20 14.5 14.5 0 000-20" />
                  <path d="M2 12h20" />
                </svg>
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-blue-200">Our Mission</p>
              <p className="mt-2 text-base leading-relaxed text-blue-50">{missionStatement}</p>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#48C184] to-[#2d7a50] p-8 text-white shadow-lg transition-transform hover:-translate-y-0.5">
            <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/5" />
            <div className="absolute -bottom-4 -left-4 h-20 w-20 rounded-full bg-white/5" />
            <div className="relative">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-green-100">Our Vision</p>
              <p className="mt-2 text-base leading-relaxed text-green-50">{visionStatement}</p>
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div className="mt-14 text-center">
          <h3 className="text-2xl font-extrabold tracking-tight text-[#022D5A]">Our Core Values</h3>
          <div className="mx-auto mt-8 grid grid-cols-3 gap-6 sm:grid-cols-6">
            {[
              { label: 'Integrity', icon: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" /></> },
              { label: 'Inclusivity', icon: <><circle cx="12" cy="7" r="3" /><circle cx="5" cy="9" r="2.5" /><circle cx="19" cy="9" r="2.5" /><path d="M2 20v-1a4 4 0 013.5-3.97" /><path d="M22 20v-1a4 4 0 00-3.5-3.97" /><path d="M6 20v-1a6 6 0 0112 0v1" /></> },
              { label: 'Professionalism', icon: <><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" /></> },
              { label: 'Innovation', icon: <><path d="M9 18h6" /><path d="M10 22h4" /><path d="M12 2a7 7 0 00-4 12.7V17h8v-2.3A7 7 0 0012 2z" /></> },
              { label: 'Sustainability', icon: <><circle cx="12" cy="12" r="10" /><path d="M12 2c-3 4-3 10 0 20" /><path d="M12 2c3 4 3 10 0 20" /><path d="M2 12h20" /><path d="M8 8c1.5 1 3 1 4 0" /></> },
              { label: 'Social Responsibility', icon: <><circle cx="9" cy="8" r="2.5" /><circle cx="17" cy="9" r="2" /><path d="M4 20v-1a5 5 0 0110 0v1" /><path d="M14 20v-1a4 4 0 018 0v1" /><path d="M12 4.5l1 1 1.5-1.5-2.5-1.5-2.5 1.5 1.5 1.5z" /></> },
            ].map((value) => (
              <div key={value.label} className="flex flex-col items-center gap-3">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#035CB3]/8 transition-colors hover:bg-[#035CB3]/15">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#035CB3]/12">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#035CB3" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      {value.icon}
                    </svg>
                  </div>
                </div>
                <p className="text-xs font-bold uppercase tracking-wide text-[#022D5A]">{value.label}</p>
              </div>
            ))}
          </div>
        </div>

      </Section>

      {/* President's Message */}
      <Section tone="default" spacing="relaxed">
        <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-[#022D5A] to-[#035CB3] shadow-xl">
          <div className="grid lg:grid-cols-[auto_1fr]">
            <div className="relative hidden lg:block">
              <div className="relative h-full w-72 xl:w-80">
                <Image
                  src="/Presedent-Arab.png"
                  alt="Eng. Omar Abdi Arab, CE - President, IES"
                  fill
                  className="object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#022D5A]/40" />
              </div>
            </div>
            <div className="flex flex-col justify-center px-8 py-10 lg:px-12 lg:py-14">
              <p className="text-xs font-bold uppercase tracking-widest text-blue-300">Message from the President</p>
              <h2 className="mt-3 text-2xl font-extrabold leading-tight text-white lg:text-3xl">
                Building a resilient Somalia through engineering excellence
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-blue-100">
                Somalia stands at a defining moment. Our nation needs resilient roads, bridges, water systems, ports, airports, renewable energy and modern urban infrastructure — engineers are at the centre of this transformation.
              </p>
              <div className="mt-6 flex items-center gap-4">
                <div className="h-12 w-12 overflow-hidden rounded-full border-2 border-white/30 lg:hidden">
                  <Image src="/Presedent-Arab.png" alt="" width={48} height={48} className="h-full w-full object-cover object-top" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Eng. Omar Abdi Arab, CE</p>
                  <p className="text-xs text-blue-200">President, Institution of Engineers Somalia</p>
                </div>
              </div>
              <Button href="/about/president-message" variant="accent" size="sm" className="mt-6 w-fit">
                Read Full Message
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* Latest news */}
      <Section tone="muted" spacing="relaxed">
        <SectionHeading
          eyebrow="Info Hub"
          title="Latest news"
          description="Recent announcements and partnerships from the Institution of Engineers of Somalia."
          actions={<Button href={routes.infoHub.news} variant="secondary" size="sm">All news</Button>}
        />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featuredNews.map((item) => (
            <NewsCard key={item.href} item={item} />
          ))}
        </div>
      </Section>

      {/* Partners & Stakeholders strip */}
      <PartnersStakeholdersStrip />

      {/* Final CTA */}
      {/* Hidden preload to keep logo referenced when slider images fail */}
      <div className="sr-only">
        <Image src={site.logo} alt="" width={1} height={1} />
      </div>
    </>
  );
}
