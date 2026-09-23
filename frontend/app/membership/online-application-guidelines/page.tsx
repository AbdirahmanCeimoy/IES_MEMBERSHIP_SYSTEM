import Link from 'next/link';
import { Section } from '@/components/layout/Section';
import { SectionHeading } from '@/components/layout/SectionHeading';
import { Button } from '@/components/ui/Button';
import { SiteContainer } from '@/components/layout/SiteContainer';
import { routes } from '@/config/routes';

export const metadata = { title: 'Apply for Membership' };

interface GradeOption {
  code: string;
  label: string;
  postnominal?: string;
  short: string;
  requirements: string;
  icon: React.ReactNode;
}

const applyGrades: GradeOption[] = [
  {
    code: 'STUDENT',
    label: 'Student Member',
    short: 'Currently enrolled in an accredited engineering programme.',
    requirements: 'Student ID + national ID + passport photo',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    ),
  },
  {
    code: 'GRADUATE',
    label: 'Graduate Member',
    postnominal: 'GMIES',
    short: 'Holds an accredited engineering degree and is early in their career.',
    requirements: 'Degree + CV + 2 proposers/seconders',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
      </svg>
    ),
  },
  {
    code: 'ASSOCIATE',
    label: 'Associate Member',
    postnominal: 'AMIES',
    short: '10+ years of experience in an engineering-related position of responsibility.',
    requirements: 'HND + CV + 2 proposers/seconders',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" />
        <path d="M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
  {
    code: 'CORPORATE',
    label: 'Corporate Member',
    postnominal: 'MIES',
    short: '3+ years post-graduate engineering experience with demonstrated competence.',
    requirements: 'Graduate letter + 3+ years exp. + 2 proposers/seconders',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
      </svg>
    ),
  },
  {
    code: 'SENIOR',
    label: 'Senior Member',
    postnominal: 'SenMIES',
    short: '10+ years professional experience with technical/leadership record.',
    requirements: 'Corporate standing + leadership evidence + referees',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    code: 'FELLOW',
    label: 'Fellow',
    postnominal: 'FIES',
    short: 'Corporate Member for 7+ years with outstanding contribution to engineering.',
    requirements: '15+ yrs experience + senior role + CSR + 2 Fellow proposers',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="7" />
        <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
      </svg>
    ),
  },
];

export default function ApplyPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#022D5A] via-[#035CB3] to-[#024A8F] py-16 text-white sm:py-20">
        <div className="absolute inset-0">
          <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-[#48C184]/10 blur-3xl" />
          <div className="absolute -bottom-10 right-0 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute right-1/4 top-1/4 h-40 w-40 rounded-full bg-[#035CB3]/30 blur-2xl" />
        </div>
        <SiteContainer className="relative text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#48C184]">Join IES</p>
          <h1 className="mx-auto mt-3 max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            Advance Your Engineering Career
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-blue-100 sm:text-base">
            Become part of Somalia&apos;s national engineering community. Choose the membership grade that matches your qualifications and apply in minutes.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button href={routes.membership.requirements} variant="secondary" className="border-white/30 bg-white/10 text-white hover:bg-white/20">
              View Requirements
            </Button>
            <Button href={routes.membership.categories} variant="secondary" className="border-white/30 bg-white/10 text-white hover:bg-white/20">
              Membership Categories
            </Button>
          </div>
        </SiteContainer>
      </section>

      {/* Grade cards */}
      <Section spacing="relaxed">
        <SectionHeading eyebrow="Step 1" title="Choose your membership grade" />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {applyGrades.map((g) => (
            <div
              key={g.code}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="absolute right-0 top-0 h-24 w-24 translate-x-6 -translate-y-6 rounded-full bg-[#035CB3]/[0.04] transition-transform group-hover:scale-150" />
              <div className="relative flex flex-1 flex-col p-6">
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#035CB3]/8 text-[#035CB3]">
                    {g.icon}
                  </div>
                  {g.postnominal && (
                    <span className="rounded-full border border-[#035CB3]/20 bg-[#035CB3]/5 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#035CB3]">
                      {g.postnominal}
                    </span>
                  )}
                </div>
                <h3 className="mt-4 text-base font-bold text-[#022D5A]">{g.label}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{g.short}</p>
                <p className="mt-3 text-[11px] text-slate-400">
                  <span className="font-semibold text-slate-500">Docs:</span> {g.requirements}
                </p>
              </div>
              <div className="border-t border-slate-100 p-4">
                <Link
                  href={`/membership/apply/${g.code.toLowerCase()}`}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#035CB3] to-[#024A8F] py-2.5 text-sm font-bold text-white transition-all hover:shadow-md"
                >
                  Apply as {g.label}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="muted">
        <SectionHeading eyebrow="Not listed here?" title="Other membership categories" description="Honorary, Companion, and Graduate Engineering Technologist/Technician are handled through the Secretariat. Email info@iesomalia.org.so to apply." />
        <div className="mt-4">
          <Button href="mailto:info@iesomalia.org.so" variant="secondary">Email the Secretariat</Button>
        </div>
      </Section>
    </>
  );
}
