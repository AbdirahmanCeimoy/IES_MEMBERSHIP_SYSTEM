import Image from 'next/image';
import { Section } from '@/components/layout/Section';
import { SiteContainer } from '@/components/layout/SiteContainer';
import { partners } from '@/data/institution';

export const metadata = { title: 'Local Affiliation' };

const localPartners = partners.filter((p) => p.scope === 'Local');

export default function LocalAffiliationPage() {
  return (
    <>
      <section className="bg-[#e8f0fe] border-b border-[#035CB3]/10">
        <SiteContainer className="py-8 sm:py-12">
          <div className="flex flex-col items-center text-center gap-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#035CB3]">Local Affiliates</span>
            <h1 className="text-3xl font-bold tracking-tight text-[#022D5A] sm:text-4xl lg:text-5xl">
              IES National Collaborating Organizations
            </h1>
            <p className="mx-auto max-w-3xl text-sm text-slate-600 sm:text-base">
              The Institution of Engineers Somalia (IES) collaborates with national institutions and organizations that seek to promote and advance the engineering profession and professional best practices in Somalia. Explore the organizations below to learn more about our national collaboration and partnerships.
            </p>
          </div>
        </SiteContainer>
      </section>

      <Section spacing="relaxed">
        <SiteContainer>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {localPartners.map((partner) => (
              <div
                key={partner.href}
                className="group flex flex-col items-center overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 text-center transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="flex h-32 w-32 items-center justify-center rounded-xl bg-slate-50 p-3">
                  {partner.logo ? (
                    <Image
                      src={partner.logo}
                      alt={`${partner.name} Logo`}
                      width={120}
                      height={120}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center rounded-lg bg-[#035CB3]/8">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#035CB3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                        <path d="M6 12v5c3 3 9 3 12 0v-5" />
                      </svg>
                    </div>
                  )}
                </div>

                <h3 className="mt-4 text-sm font-bold text-[#022D5A]">{partner.name}</h3>

                <a
                  href={partner.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#035CB3] px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-[#024A8F]"
                >
                  Visit Website
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </a>
              </div>
            ))}
          </div>
        </SiteContainer>
      </Section>
    </>
  );
}
