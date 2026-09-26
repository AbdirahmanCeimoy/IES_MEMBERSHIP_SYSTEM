import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { SiteContainer } from '@/components/layout/SiteContainer';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { routes } from '@/config/routes';
import { secretariatPositions } from '@/data/institution';

export const metadata = { title: 'Secretariat' };

function PersonIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21v-1a6 6 0 0112 0v1" />
    </svg>
  );
}

function StaffCard({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center overflow-hidden rounded-2xl border border-slate-200 bg-white text-center transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex h-44 w-full items-center justify-center bg-slate-100">
        <PersonIcon className="h-20 w-20 text-[#035CB3]" />
      </div>
      <div className="px-4 py-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#035CB3]">{title}</p>
      </div>
    </div>
  );
}

export default function SecretariatPage() {
  const [ceo, ...staff] = secretariatPositions;

  return (
    <>
      <PageHero
        breadcrumbs={<Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'About', href: routes.about.root }, { label: 'Secretariat' }]} />}
        eyebrow="About IES"
        title="Discover The IES Secretariat"
      />

      <Section>
        <SiteContainer>
          <p className="text-sm leading-relaxed text-slate-700 sm:text-base">
            The Secretariat, headed by the Chief Executive Officer (CEO), supports the operations of the Institution of Engineers Somalia (IES). The Secretariat is responsible for the day-to-day administration and management of the Institution, ensuring the effective implementation of its mandate, policies, programmes, and strategic objectives.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
            The IES Secretariat works collaboratively with the Institution&apos;s leadership, members, government institutions, development partners, professional organizations, and other stakeholders to advance the engineering profession and contribute to Somalia&apos;s sustainable development.
          </p>
        </SiteContainer>
      </Section>

      {/* Secretariat Staff */}
      <section className="border-t border-slate-200 bg-white py-12 sm:py-16">
        <SiteContainer>
          <h2 className="mb-2 text-center text-2xl font-extrabold text-[#022D5A] sm:text-3xl">
            Secretariat Staff
          </h2>
          <div className="mx-auto mb-10 h-1 w-12 rounded-full bg-[#035CB3]" />

          {/* CEO - centered alone */}
          <div className="mx-auto mb-8 max-w-xs">
            <StaffCard title={ceo} />
          </div>

          {/* Rest of staff - 4 columns */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {staff.map((title) => (
              <StaffCard key={title} title={title} />
            ))}
          </div>
        </SiteContainer>
      </section>

    </>
  );
}
