import Link from 'next/link';
import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { ContentGrid } from '@/components/public/ContentGrid';
import { PartnerCard } from '@/components/public/PartnerCard';
import { routes } from '@/config/routes';
import { partners } from '@/data/institution';

export const metadata = { title: 'Affiliations & Partners' };

const localPartners = partners.filter((p) => p.scope === 'Local');
const internationalPartners = partners.filter((p) => p.scope === 'International');

export default function PartnersPage() {
  return (
    <>
      <PageHero
        breadcrumbs={
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'About', href: routes.about.root },
              { label: 'Affiliations & Partners' },
            ]}
          />
        }
        eyebrow="Collaborations"
        title="Affiliations & Partners"
        description="IES works with institutions and organizations that promote and develop the engineering profession, best practices, sustainable development and the welfare of engineers in Somalia and around the world."
      />

      {/* Local Affiliations & Partners */}
      <Section tone="default">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-[#035CB3] sm:text-3xl">
              Local Affiliations &amp; Partners
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Somali institutions, ministries and organizations collaborating with IES to advance the engineering profession nationally.
            </p>
          </div>
          <Link
            href={routes.about.partners.local}
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#035CB3] hover:text-[#48C184]"
          >
            View all local
            <span aria-hidden>→</span>
          </Link>
        </div>
        <ContentGrid columns={3}>
          {localPartners.map((p) => (
            <PartnerCard key={p.href} partner={p} />
          ))}
        </ContentGrid>
      </Section>

      {/* International Affiliations & Partners */}
      <Section tone="muted">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-[#035CB3] sm:text-3xl">
              International Affiliations &amp; Partners
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Regional and international engineering organizations linking IES members to the global engineering community.
            </p>
          </div>
          <Link
            href={routes.about.partners.international}
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#035CB3] hover:text-[#48C184]"
          >
            View all international
            <span aria-hidden>→</span>
          </Link>
        </div>
        <ContentGrid columns={3}>
          {internationalPartners.map((p) => (
            <PartnerCard key={p.href} partner={p} />
          ))}
        </ContentGrid>
      </Section>

      {/* CTA */}
      <Section tone="default">
        <div className="mx-auto max-w-3xl rounded-2xl border border-[#035CB3]/15 bg-gradient-to-br from-[#e8f0fe] to-white p-8 text-center shadow-sm sm:p-10">
          <h3 className="text-2xl font-extrabold tracking-tight text-[#022D5A] sm:text-3xl">
            Want to Partner with IES?
          </h3>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
            We welcome collaboration with institutions, organizations, and stakeholders committed to advancing the engineering profession in Somalia and beyond.
          </p>
          <Link
            href={routes.contact}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#022D5A] px-8 py-3 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#035CB3]"
          >
            Contact Us
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
      </Section>
    </>
  );
}
