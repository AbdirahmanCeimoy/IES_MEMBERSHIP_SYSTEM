import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { routes } from '@/config/routes';

export const metadata = { title: 'Membership Fees Structure' };

interface FeeRow {
  category: string;
  applicationFee: string;
  annualSubscription: string;
}

const feeRows: FeeRow[] = [
  { category: 'Fellow Member (FMIES)', applicationFee: '$50', annualSubscription: '$100' },
  { category: 'Senior Member (SenMIES)', applicationFee: '$30', annualSubscription: '$50' },
  { category: 'Corporate Member (CMIES)', applicationFee: '$20', annualSubscription: '$40' },
  { category: 'Associate Member (AMIES)', applicationFee: '$20', annualSubscription: '$40' },
  { category: 'Graduate Member (GMIES)', applicationFee: '$10', annualSubscription: '$20' },
  { category: 'Graduate Engineering Technologist', applicationFee: '$10', annualSubscription: '$20' },
  { category: 'Graduate Engineering Technician', applicationFee: '$10', annualSubscription: '$20' },
  { category: 'Student Member (SMIES)', applicationFee: '$5', annualSubscription: 'N/A' },
  { category: 'Affiliate/Partner Organizations', applicationFee: 'N/A', annualSubscription: '$500' },
];

const steps = [
  'Select the membership grade that is most appropriate for your qualifications and professional experience.',
  'Complete the membership application online.',
  'Submit the required information and supporting documents.',
  'Await confirmation of your membership application from IES.',
];

export default function FeesPage() {
  return (
    <>
      <PageHero
        breadcrumbs={
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Membership', href: routes.membership.root },
              { label: 'Fees Structure' },
            ]}
          />
        }
        eyebrow="Membership"
        title="IES Membership Fees Structure"
        description="Discover IES Membership Fees Structure"
      />

      {/* <section className="bg-white py-4 sm:py-5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-left text-2xl font-extrabold tracking-tight text-[#035CB3] sm:text-3xl">
            Join the Institution of Engineers Somalia (IES)
          </h2>
        </div>
      </section> */}

      {/* CTA + steps - moved above the table */}
      <section className="bg-slate-50 py-4 sm:py-5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h3 className="text-left text-xl font-extrabold text-[#035CB3] sm:text-2xl">
            Become a Member of the Institution of Engineers Somalia (IES) today!
          </h3>
          <p className="mt-2 text-left text-sm leading-relaxed text-slate-700 sm:text-base">
            Engineering graduates and professionals from recognized institutions can apply for the appropriate membership category based on their qualifications and experience.
          </p>

          <h4 className="mt-4 mb-3 text-lg font-bold text-[#035CB3] sm:text-xl">Joining is Easy</h4>
          <ol className="mt-2 flex flex-col gap-3">
            {steps.map((step, idx) => (
              <li key={step} className="flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#035CB3] text-xs font-bold text-white">
                  {idx + 1}
                </span>
                <span className="pt-1 text-sm leading-relaxed text-slate-700 sm:text-base">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Membership Fees notes - moved above the table */}
      <section className="bg-white py-4 sm:py-5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h3 className="mb-1 text-left text-xl font-bold text-[#035CB3] sm:text-2xl">Membership Fees</h3>
          <p className="text-left text-sm leading-relaxed text-slate-700 sm:text-base">
            Membership fees vary depending on the membership category. Please refer to the applicable membership fee schedule for details.
          </p>
        </div>
      </section>

      {/* Fees Table */}
      <Section tone="muted" spacing="compact">
        {/* <h3 className="mb-4 text-lg font-bold text-[#022D5A] sm:text-xl">Fees</h3> */}
        <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-[#035CB3] text-white">
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider">Membership Category</th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider">Application Fee (USD)</th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider">Annual Subscription Fee (USD)</th>
              </tr>
            </thead>
            <tbody>
              {feeRows.map((row, idx) => (
                <tr
                  key={row.category}
                  className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}
                >
                  <td className="border-t border-slate-100 px-6 py-3.5 text-sm font-semibold text-[#022D5A]">
                    {row.category}
                  </td>
                  <td className="border-t border-slate-100 px-6 py-3.5 text-sm text-slate-700">
                    <span className="font-mono font-semibold text-[#035CB3]">{row.applicationFee}</span>
                  </td>
                  <td className="border-t border-slate-100 px-6 py-3.5 text-sm text-slate-700">
                    <span
                      className={
                        row.annualSubscription === 'N/A'
                          ? 'font-mono text-slate-400'
                          : 'font-mono font-semibold text-[#3AA870]'
                      }
                    >
                      {row.annualSubscription}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
        </div>
       <p className="font-semibold mt-4 text-sm leading-relaxed text-slate-700 sm:text-base">
  Members are requested to pay their annual membership subscriptions promptly at the beginning of each year to maintain their membership in good standing.
</p>
      </Section>
    </>
  );
}
