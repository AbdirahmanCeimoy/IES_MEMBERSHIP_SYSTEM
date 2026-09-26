import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { SiteContainer } from '@/components/layout/SiteContainer';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { routes } from '@/config/routes';
import { committees } from '@/data/institution';

export const metadata = { title: 'Committees' };

export default function CommitteesPage() {
  return (
    <>
      <PageHero
        breadcrumbs={<Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'About', href: routes.about.root }, { label: 'Committees' }]} />}
        eyebrow="About IES"
        title="IES Committees"
        description="Committees of the Institution of Engineers Somalia (IES)"
      />

      <Section spacing="relaxed">
        <SiteContainer>
          <h2 className="mb-8 text-center text-2xl font-extrabold text-[#035CB3] sm:text-3xl">
            The Committees 2026–2028
          </h2>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#022D5A]">Committees</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#022D5A]">Title</th>
                </tr>
              </thead>
              <tbody>
                {committees.map((committee) =>
                  committee.roles.map((role, roleIdx) => (
                    <tr
                      key={`${committee.name}-${role}`}
                      className={roleIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}
                    >
                      {roleIdx === 0 ? (
                        <td
                          rowSpan={committee.roles.length}
                          className="border-t border-slate-200 px-6 py-4 align-top text-sm font-bold text-[#022D5A]"
                        >
                          {committee.name}
                        </td>
                      ) : null}
                      <td className="border-t border-slate-100 px-6 py-3 text-sm text-slate-700">
                        {role}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </SiteContainer>
      </Section>
    </>
  );
}
