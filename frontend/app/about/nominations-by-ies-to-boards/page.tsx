import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Card } from '@/components/ui/Card';
import { ContentGrid } from '@/components/public/ContentGrid';
import { routes } from '@/config/routes';

export const metadata = { title: 'Board Nominations' };

const keyPartners = [
  'World Federation of Engineering Organizations (WFEO)',
  'Federation of African Engineering Organisations (FAEO)',
  'East African Federation of Engineering Organisations (EAFEO)',
  'Engineering institutions and professional bodies',
  'Government institutions and development partners',
];

const nominees = [
  {
    name: 'Assistant Prof. Dr. Abdullahi Mohamed Samatar',
    designation: 'Board Member',
    organization: 'Chief Corporate Strategy at Hormud University',
  },
  {
    name: 'Prof. Dr. Mohamud Ahmed Jimale',
    designation: 'Board Member',
    organization: 'Chairperson, National Commission for Higher Education (NCHE)',
  },
  {
    name: 'Eng. Abdifitah Abshir Ibrahim',
    designation: 'Board Member',
    organization: 'Ministry of Energy and Water Resources, Federal Government of Somalia',
  },
  {
    name: 'Eng. Khalid Ahmed Ali',
    designation: 'Chairman',
    organization: 'Executive Director, Somali Real Estate & Construction (SORECA)',
  },
  {
    name: 'Eng. Abdirizak Warsame Abdulle',
    designation: 'Deputy Chairman',
    organization: 'President, Jamhuriya University of Science and Technology (JUST)',
  },
  {
    name: 'Eng. Abdirizak Heri Jama',
    designation: 'Board Member',
    organization: 'Dean Faculty of Engineering & Technology, Jazeera University',
  },
  {
    name: 'Arch. Amina Ahmed Nur',
    designation: 'Board Member',
    organization: 'Head of the Architectural Engineering Program, Simad University',
  },
];

export default function BoardNominationsPage() {
  return (
    <>
      <PageHero
        breadcrumbs={<Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'About', href: routes.about.root }, { label: 'Board Nominations' }]} />}
        eyebrow="About IES"
        title="Nominations by IES to Boards"
        description="Discover Members Nominated by the Institution of Engineers Somalia (IES) to Boards."
      />

      <Section>
        <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
          The Institution of Engineers Somalia (IES) actively nominates its members to serve on various boards, committees, and professional platforms,
         contributing their expertise to the engineering profession and the development of society.
        </p>
        <h2 className="mt-6 text-2xl font-extrabold tracking-tight text-[#035CB3] sm:text-3xl">
          Members Nominated by IES
        </h2>
        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-[#035CB3] text-white">
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">Designation</th>
                  <th className="px-4 py-3 font-semibold">Titles & Organization</th>
                </tr>
              </thead>
              <tbody>
                {nominees.map((n, i) => (
                  <tr
                    key={n.name}
                    className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}
                  >
                    <td className="px-4 py-3 font-medium text-[#022D5A]">{n.name}</td>
                    <td className="px-4 py-3 text-slate-700">{n.designation}</td>
                    <td className="px-4 py-3 text-slate-600">{n.organization}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <p className="mt-4 text-sm text-slate-500">
          For more information on IES activities, upcoming events, and membership registration, please continue visiting the IES website.
        </p>
      </Section>

      <Section tone="muted" spacing="compact">
        <p className="text-xs font-bold uppercase tracking-widest text-[#035CB3]">Key Partner Organizations</p>
        <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
          While specific appointments are updated regularly, IES collaborates with several key partner organizations and professional bodies.
        </p>
        <ContentGrid columns={2} className="mt-6">
          {keyPartners.map((p) => (
            <Card key={p} padded className="transition-colors hover:border-[#035CB3]/30">
              <p className="text-sm font-semibold text-[#035CB3]">{p}</p>
            </Card>
          ))}
        </ContentGrid>
      </Section>
    </>
  );
}
