import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { SiteContainer } from '@/components/layout/SiteContainer';
import { routes } from '@/config/routes';

export const metadata = { title: 'Engineering Divisions' };

const divisions: { title: string; icon: React.ReactNode }[] = [
  {
    title: 'Civil Engineering',
    icon: <><path d="M3 21h18" /><path d="M5 21V9l7-5 7 5v12" /><path d="M9 21v-6h6v6" /></>,
  },
  {
    title: 'Architectural Engineering',
    icon: <><path d="M3 21h18" /><rect x="6" y="8" width="12" height="13" /><path d="M9 21v-5h6v5" /><path d="M6 8l6-5 6 5" /></>,
  },
  {
    title: 'Mechanical Engineering',
    icon: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z" /></>,
  },
  {
    title: 'Electrical and Electronics Engineering',
    icon: <><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></>,
  },
  {
    title: 'Telecommunications Engineering',
    icon: <><path d="M12 2v6" /><path d="M8.5 6.5a5 5 0 007 0" /><path d="M5.5 3.5a9 9 0 0013 0" /><circle cx="12" cy="16" r="2" /><path d="M12 18v4" /></>,
  },
  {
    title: 'Computer Engineering',
    icon: <><rect x="4" y="4" width="16" height="12" rx="1" /><path d="M2 20h20" /><path d="M9 20v-4" /><path d="M15 20v-4" /></>,
  },
  {
    title: 'Chemical Engineering',
    icon: <><path d="M10 2v6.5L4.5 19a1.7 1.7 0 001.5 2.5h12a1.7 1.7 0 001.5-2.5L14 8.5V2" /><path d="M8.5 2h7" /><path d="M7.5 15h9" /></>,
  },
  {
    title: 'Petroleum Engineering',
    icon: <><path d="M12 2s5 6 5 10a5 5 0 01-10 0c0-4 5-10 5-10z" /></>,
  },
  {
    title: 'Agricultural Engineering',
    icon: <><path d="M12 22c5-3 8-7 8-12a8 8 0 00-16 0c0 5 3 9 8 12z" /><path d="M12 6v10" /><path d="M9 9c1.5 1 4.5 1 6 0" /></>,
  },
  {
    title: 'Aerospace Engineering',
    icon: <><path d="M12 2c1 3 1 6 1 9l7 4-1 2-7-2-1 5 2 2-1 1-3-1-3 1-1-1 2-2-1-5-7 2-1-2 7-4c0-3 0-6 1-9z" /></>,
  },
  {
    title: 'Automobile Engineering',
    icon: <><path d="M3 13l2-6a2 2 0 012-1.5h10A2 2 0 0119 7l2 6" /><rect x="2" y="13" width="20" height="5" rx="1" /><circle cx="7" cy="18.5" r="1.5" /><circle cx="17" cy="18.5" r="1.5" /></>,
  },
  {
    title: 'Biomedical Engineering',
    icon: <><path d="M3 12h4l2-6 4 12 2-6h6" /></>,
  },
  {
    title: 'Biotechnology Engineering',
    icon: <><path d="M8 3c0 5 8 5 8 10s-8 5-8 10" /><path d="M16 3c0 5-8 5-8 10s8 5 8 10" /><path d="M8.5 8h7" /><path d="M8.5 18h7" /></>,
  },
  {
    title: 'Biochemical Engineering',
    icon: <><circle cx="6" cy="6" r="2" /><circle cx="18" cy="6" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="6" cy="18" r="2" /><circle cx="18" cy="18" r="2" /><path d="M7.5 7.5L10.5 10.5" /><path d="M16.5 7.5L13.5 10.5" /><path d="M10.5 13.5L7.5 16.5" /><path d="M13.5 13.5L16.5 16.5" /></>,
  },
  {
    title: 'Food Engineering',
    icon: <><path d="M7 2v20" /><path d="M4 2v7a3 3 0 003 3 3 3 0 003-3V2" /><path d="M17 2c-1.5 0-3 2-3 5s1 5 3 5V22" /></>,
  },
  {
    title: 'Ceramic Engineering',
    icon: <><path d="M7 3h10l-1 4H8L7 3z" /><path d="M8 7c-1.5 3-1.5 6 0 9s1.5 4 0 5h8c-1.5-1-1.5-2 0-5s1.5-6 0-9" /></>,
  },
  {
    title: 'Environmental Engineering',
    icon: <><circle cx="12" cy="12" r="9" /><path d="M12 3c-3 4-3 14 0 18" /><path d="M12 3c3 4 3 14 0 18" /><path d="M3 12h18" /><path d="M5 7c2 1.5 12 1.5 14 0" /><path d="M5 17c2-1.5 12-1.5 14 0" /></>,
  },
  {
    title: 'Industrial Engineering',
    icon: <><path d="M3 21V10l5 3V9l5 3V5l5 3v13z" /><path d="M3 21h18" /></>,
  },
  {
    title: 'Marine Engineering',
    icon: <><circle cx="12" cy="5" r="2" /><path d="M12 7v9" /><path d="M8 10h8" /><path d="M4 15c1.5 2 3.5 2 5 0 1.5 2 3.5 2 5 0 1.5 2 3.5 2 5 0" /><path d="M4 20c1.5 2 3.5 2 5 0 1.5 2 3.5 2 5 0 1.5 2 3.5 2 5 0" /></>,
  },
  {
    title: 'Mining Engineering',
    icon: <><path d="M3 20l6-14 6 14" /><path d="M12 20l4-9 5 9" /><path d="M2 20h20" /></>,
  },
];

export default function DivisionsPage() {
  return (
    <>
      <PageHero
        breadcrumbs={<Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'About', href: routes.about.root }, { label: 'Divisions' }]} />}
        eyebrow="About IES"
        title="Our Engineering Divisions"
        description="Specialist groups established by IES to further the aims and objectives of the Institution and to promote professional excellence within specific engineering disciplines."
      />
      <Section>
        <SiteContainer>
          <div className="mb-10 flex flex-col gap-3 text-sm leading-relaxed text-slate-700 sm:text-base">
            <p>
              These Engineering Divisions are specialist groups established by the Institution of Engineers Somalia (IES) to further the aims and objectives of the Institution and to promote professional excellence within specific engineering disciplines. All Engineering Divisions of IES shall operate in accordance with the IES Constitution and shall be guided by the relevant By-laws, policies, and regulations of the Institution.
            </p>
            <p>
              Membership of each Division shall comprise persons who are members of IES in accordance with the IES Constitution and By-laws and whose professional qualifications, experience, or area of specialization falls within the relevant engineering discipline.
            </p>
            <p>
              The name, professional designation, membership category, and other relevant details of each member of a Division shall be recorded in the Register of Members maintained by the IES Secretariat or such other office as may be designated by the Institution.
            </p>
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-extrabold tracking-tight text-[#022D5A] sm:text-3xl">Available Divisions</h2>
            <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-[#48C184]" />
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {divisions.map((division) => (
              <div
                key={division.title}
                className="group flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-6 text-center transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-[#035CB3] to-[#022D5A] shadow-md transition-transform group-hover:scale-105">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    {division.icon}
                  </svg>
                </div>
                <p className="mt-4 text-sm font-bold text-[#022D5A]">{division.title}</p>
              </div>
            ))}
          </div>
        </SiteContainer>
      </Section>
    </>
  );
}
