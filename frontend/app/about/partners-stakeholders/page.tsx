import Image from 'next/image';
import { Section } from '@/components/layout/Section';
import { SiteContainer } from '@/components/layout/SiteContainer';
import { stakeholders } from '@/data/stakeholders';

export const metadata = { title: 'Sponsors & Stakeholders' };

export default function PartnersStakeholdersPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-[#022D5A] to-[#035CB3] py-14 text-center text-white">
        <SiteContainer>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Sponsors &amp; Stakeholders</h1>
          <p className="mx-auto mt-3 max-w-3xl text-sm leading-relaxed text-blue-100 sm:text-base">
            We work with sponsors and stakeholders, including government institutions, international organizations, professional associations, academic institutions, engineering industries, and other partners, to advance the engineering profession, promote professional excellence, and support sustainable engineering development in Somalia.
          </p>
        </SiteContainer>
      </section>

      <Section spacing="relaxed">
        <SiteContainer>
          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {stakeholders.map((s) => (
              <div
                key={s.name}
                className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white p-6 text-center transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex h-24 w-24 items-center justify-center">
                  <Image
                    src={s.logo}
                    alt={s.name}
                    width={96}
                    height={96}
                    className="h-full w-full object-contain"
                  />
                </div>
                <p className="text-xs font-bold uppercase tracking-wide text-[#022D5A]">{s.name}</p>
              </div>
            ))}
          </div>
        </SiteContainer>
      </Section>
    </>
  );
}
