import Image from 'next/image';
import Link from 'next/link';
import { Section } from '@/components/layout/Section';
import { SiteContainer } from '@/components/layout/SiteContainer';
import { partners } from '@/data/institution';
import { routes } from '@/config/routes';

export const metadata = { title: 'International Affiliation' };

const internationalPartners = partners.filter((p) => p.scope === 'International');

export default function InternationalAffiliationPage() {
  return (
    <>
      <section className="bg-[#e8f0fe] border-b border-[#035CB3]/10">
        <SiteContainer className="py-8 sm:py-12">
          <div className="flex flex-col items-center text-center gap-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#035CB3]">International Affiliates</span>
            <h1 className="text-3xl font-bold tracking-tight text-[#022D5A] sm:text-4xl lg:text-5xl">
              IES International Collaborating Organizations
            </h1>
            <p className="mx-auto max-w-3xl text-sm text-slate-600 sm:text-base">
              The Institution of Engineers Somalia (IES) collaborates with international institutions and organizations that seek to promote and advance the engineering profession and professional best practices globally. Explore the organizations below to learn more and visit their official websites.
            </p>
          </div>
        </SiteContainer>
      </section>

      <Section spacing="relaxed">
        <SiteContainer>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {internationalPartners.map((partner) => (
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
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 2a14.5 14.5 0 000 20 14.5 14.5 0 000-20" />
                        <path d="M2 12h20" />
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

      {/* Want to Partner CTA */}
      <section className="border-t border-slate-100 bg-white py-16 sm:py-20">
        <SiteContainer>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-extrabold text-[#022D5A] sm:text-3xl">
              Want to Partner with IES?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-slate-600 sm:text-base">
              We welcome organizations that share our commitment to engineering excellence and professional development to collaborate with and support IES initiatives.
            </p>
            <Link
              href={routes.contact}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#022D5A] px-8 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#03407a] sm:text-base"
            >
              Contact Us for Partnership
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </SiteContainer>
      </section>
    </>
  );
}
