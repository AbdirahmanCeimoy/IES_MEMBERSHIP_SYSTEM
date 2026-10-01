import type { ReactNode } from 'react';
import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { routes } from '@/config/routes';

export const metadata = { title: 'Code of Professional Practice & Ethics' };

const coreValues = [
  'Ethical Conduct',
  'Professional Competence',
  'Engineering Excellence',
  'Innovation and Continuous Improvement',
  'Public Safety, Health and Welfare',
  'Equality and Non-Discrimination',
  'Fairness and Professional Integrity',
  'Accountability and Responsibility',
  'Honesty and Trustworthiness',
  'Transparency and Openness',
  'Respect for Human Dignity and Life',
  'Environmental Protection',
  'Sustainable Development',
  'Professional Unity and Service to Society',
];

type Principle = { title: string; body: ReactNode };

const conductPrinciples: Principle[] = [
  {
    title: 'Protection of Public Safety, Health and Welfare',
    body: 'An engineer shall give paramount consideration to the safety, health, and welfare of the public and shall take all reasonable measures to ensure that engineering work does not create avoidable risks of death, injury, ill health, or harm.',
  },
  {
    title: 'Protection of the Environment',
    body: 'An engineer shall take reasonable measures to protect the environment, conserve natural resources, minimise waste, and promote sustainable engineering practices throughout the life cycle of projects and services.',
  },
  {
    title: 'Professional Competence',
    body: (
      <>
        <p>An engineer shall undertake professional work only within areas in which they possess the appropriate education, training, knowledge, experience, and competence.</p>
        <p>An engineer shall perform professional services with due care, diligence, skill, and professional judgement.</p>
      </>
    ),
  },
  {
    title: 'Integrity and Independence',
    body: 'An engineer shall act with honesty, integrity, impartiality, and professional independence and shall not allow personal, financial, political, or other interests to improperly influence professional judgement or responsibilities.',
  },
  {
    title: 'Duty to Clients and Employers',
    body: 'An engineer shall act as a faithful and responsible adviser to their client or employer and shall perform professional duties in good faith, while maintaining professional independence and observing applicable laws, regulations, standards, and ethical requirements.',
  },
  {
    title: 'Confidentiality',
    body: 'An engineer shall respect the confidentiality of information obtained through professional practice and shall not improperly disclose or use confidential information belonging to a client, employer, colleague, or other party.',
  },
  {
    title: 'Conflict of Interest',
    body: (
      <>
        <p>An engineer shall disclose any actual, potential, or perceived conflict of interest that may affect, or appear to affect, their professional judgement or independence.</p>
        <p>An engineer shall take appropriate measures to manage or avoid such conflicts in accordance with professional and ethical requirements.</p>
      </>
    ),
  },
  {
    title: 'Professional Reputation and Dignity',
    body: 'An engineer shall conduct themselves in a manner that upholds the honour, dignity, integrity, and reputation of the engineering profession.',
  },
  {
    title: 'Objectivity and Professional Advice',
    body: (
      <>
        <p>An engineer providing professional advice or an opinion shall base it on adequate knowledge, relevant evidence, sound engineering principles, and professional judgement.</p>
        <p>Professional opinions shall be objective, honest, and reliable.</p>
      </>
    ),
  },
  {
    title: 'Responsibility for Professional Work',
    body: (
      <>
        <p>An engineer shall accept professional responsibility for work undertaken personally or under their supervision, direction, or control.</p>
        <p>An engineer shall take reasonable steps to ensure that persons working under their authority possess the appropriate competence and qualifications for the tasks assigned to them.</p>
      </>
    ),
  },
  {
    title: 'Professional Competence and Continuing Development',
    body: (
      <>
        <p>An engineer shall maintain and continuously develop their professional competence by keeping informed of relevant developments in engineering science, technology, standards, legislation, and professional practice.</p>
        <p>Engineers in supervisory or managerial positions shall, where reasonably practicable, support the professional development of those working under their supervision.</p>
      </>
    ),
  },
  {
    title: 'Professional Advice That Is Overruled',
    body: "Where an engineer's professional advice concerning safety, health, environmental protection, technical integrity, or other significant professional matters is rejected or overruled, the engineer shall take reasonable steps to ensure that the responsible parties are informed of the potential risks and consequences identified by the engineer.",
  },
  {
    title: 'Fairness and Respect for Colleagues',
    body: (
      <>
        <p>An engineer shall treat clients, employers, colleagues, contractors, employees, students, and other professionals fairly, respectfully, and in good faith.</p>
        <p>An engineer shall give appropriate recognition and credit for the work and contributions of others and shall provide and receive professional criticism in a constructive and respectful manner.</p>
      </>
    ),
  },
  {
    title: 'Professional Competition',
    body: 'An engineer shall not unfairly, maliciously, or recklessly damage the professional reputation, employment prospects, or legitimate business interests of another engineer.',
  },
  {
    title: 'Professional Advertising and Public Statements',
    body: (
      <>
        <p>An engineer shall ensure that professional advertisements, publications, public statements, and representations are accurate, factual, and consistent with the dignity of the engineering profession.</p>
        <p>An engineer shall not make misleading, deceptive, exaggerated, or self-laudatory claims concerning their qualifications, experience, competence, or professional achievements.</p>
      </>
    ),
  },
  {
    title: 'Improper Solicitation and Inducements',
    body: 'An engineer shall not improperly solicit professional work or offer, give, request, or accept commissions, inducements, gifts, or other improper benefits for the purpose of securing professional assignments or influencing professional decisions.',
  },
  {
    title: 'Professional Remuneration',
    body: 'An engineer shall not accept remuneration, commissions, or other benefits relating to professional services from a party other than the client or employer without the knowledge and consent of the relevant client or employer.',
  },
  {
    title: 'Qualifications and Professional Titles',
    body: (
      <>
        <p>An engineer shall use only academic, professional, and engineering titles, designations, and credentials that have been lawfully obtained and are recognised by the relevant competent authority or institution.</p>
        <p>An engineer shall not misrepresent their qualifications, professional status, experience, registration, membership, or area of competence.</p>
      </>
    ),
  },
  {
    title: 'Compliance with Laws and Professional Standards',
    body: (
      <>
        <p>An engineer shall comply with applicable laws, regulations, codes, technical standards, contractual obligations, and professional requirements relevant to their practice.</p>
        <p>An engineer shall not knowingly participate in, facilitate, or encourage unlawful, fraudulent, corrupt, unsafe, or unethical engineering practices.</p>
      </>
    ),
  },
  {
    title: 'Reporting Unethical Conduct',
    body: (
      <>
        <p>An engineer shall not knowingly assist, encourage, or participate in conduct that violates this Code.</p>
        <p>Where an engineer becomes aware of serious unethical, unsafe, fraudulent, corrupt, or professionally improper conduct, they should take appropriate steps to address the matter and, where necessary, report it to the Institution or other competent authority in accordance with applicable procedures.</p>
      </>
    ),
  },
];

const societyResponsibilities = [
  'Promote safe and sustainable engineering practices;',
  'Consider the long-term consequences of engineering decisions;',
  'Support efficient and responsible use of resources;',
  'Respect human dignity and fundamental rights;',
  'Promote inclusive and equitable access to engineering solutions;',
  'Communicate significant engineering risks honestly and objectively; and',
  'Contribute to the advancement of engineering knowledge and professional practice in Somalia.',
];

const disciplinaryMeasures: Principle[] = [
  {
    title: 'Written Warning',
    body: 'A formal written warning may be issued for a minor or first breach where the circumstances do not warrant a more serious sanction.',
  },
  {
    title: 'Reprimand',
    body: 'A formal reprimand may be issued where a breach is considered more serious or where previous warnings have not resulted in appropriate corrective action.',
  },
  {
    title: 'Suspension',
    body: 'Membership may be suspended for a specified period in cases of serious professional misconduct.',
  },
  {
    title: 'Demotion of Membership Category',
    body: "Where permitted by the Institution's membership framework, a member may be moved to a lower membership category as a disciplinary measure.",
  },
  {
    title: 'Expulsion',
    body: "Membership may be terminated or withdrawn in cases involving grave or repeated professional misconduct, subject to the Institution's Constitution, By-laws, and applicable procedures.",
  },
  {
    title: 'Other Appropriate Measures',
    body: 'The Institution may apply other proportionate measures permitted under its governing documents and applicable laws.',
  },
];

const disciplinaryProcedures: Principle[] = [
  {
    title: 'Notice of Allegation',
    body: 'Before disciplinary proceedings are formally considered, the member shall be informed of the allegation or complaint against them and provided with sufficient information to understand the matter.',
  },
  {
    title: 'Right to Be Heard',
    body: 'A member shall be given a reasonable and fair opportunity to respond to the allegations and to present relevant evidence or representations before a decision is made.',
  },
  {
    title: 'Impartiality',
    body: 'Any person involved in determining a disciplinary matter shall act impartially and shall disclose any actual or potential conflict of interest.',
  },
  {
    title: 'Evidence and Consideration',
    body: "The disciplinary body shall consider the available evidence objectively and shall reach its decision based on the facts and applicable provisions of the Institution's governing documents.",
  },
  {
    title: 'Decision',
    body: 'A disciplinary decision shall be communicated to the member in writing and shall state the outcome and, where appropriate, the disciplinary measure imposed.',
  },
  {
    title: 'Appeal',
    body: (
      <>
        <p>A member who is subject to a disciplinary decision shall have the right to appeal in accordance with the Institution&apos;s Constitution, By-laws, Policies and Regulations.</p>
        <p>The applicable appeal procedure shall specify the time limit, grounds for appeal, composition of the appeal body, and manner in which the appeal shall be considered.</p>
      </>
    ),
  },
  {
    title: 'Finality of Decision',
    body: 'The decision of the authorised appeal body shall be final within the Institution, subject to any rights or remedies available under applicable law.',
  },
];

const naturalJustice = [
  'the right to be informed of the allegation;',
  'the right to be heard;',
  'the right to have allegations considered impartially;',
  'the right to present relevant evidence and representations;',
  'the right to receive a reasoned decision; and',
  "the right to appeal where provided for under the Institution's governing documents.",
];

const pad2 = (n: number) => String(n).padStart(2, '0');

const SectionCard = ({
  number,
  title,
  children,
}: {
  number: number;
  title: string;
  children: ReactNode;
}) => (
  <article
    id={`section-${pad2(number)}`}
    className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md sm:p-8"
  >
    <div className="flex flex-col gap-5 sm:flex-row sm:gap-6">
      <div className="shrink-0">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-[#035CB3] to-[#024A8F] text-lg font-bold text-white shadow-md">
          {pad2(number)}
        </div>
      </div>
      <div className="flex-1">
        <h2 className="text-2xl font-bold tracking-tight text-[#022D5A] sm:text-3xl">
          {title}
        </h2>
        <div className="mt-4 space-y-4 text-base leading-relaxed text-slate-700">
          {children}
        </div>
      </div>
    </div>
  </article>
);

const NumberedList = ({
  items,
  accent = 'blue',
}: {
  items: Principle[];
  accent?: 'blue' | 'green';
}) => {
  const badge =
    accent === 'green'
      ? 'bg-[#48C184]/15 text-[#2d7a50] ring-1 ring-[#48C184]/30'
      : 'bg-[#035CB3]/10 text-[#035CB3] ring-1 ring-[#035CB3]/20';
  return (
    <ol className="space-y-4">
      {items.map((item, i) => (
        <li
          key={item.title}
          className="flex gap-4 rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-[#035CB3]/30 sm:p-5"
        >
          <span
            className={`mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${badge}`}
          >
            {i + 1}
          </span>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-[#022D5A] sm:text-lg">
              {item.title}
            </h3>
            <div className="mt-1.5 space-y-2 text-sm leading-relaxed text-slate-700 sm:text-base">
              {typeof item.body === 'string' ? <p>{item.body}</p> : item.body}
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
};

const CheckList = ({ items }: { items: string[] }) => (
  <ul className="space-y-2.5">
    {items.map((item) => (
      <li key={item} className="flex items-start gap-3">
        <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#48C184]/15 text-[#48C184]">
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </span>
        <span className="text-sm leading-relaxed text-slate-700 sm:text-base">{item}</span>
      </li>
    ))}
  </ul>
);

export default function CodeOfProfessionalPracticePage() {
  return (
    <>
      <PageHero
        breadcrumbs={
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'About', href: routes.about.root },
              { label: 'Governance Instruments', href: routes.about.governance.root },
              { label: 'Code of Professional Practice & Ethics' },
            ]}
          />
        }
        eyebrow="Governance Instruments"
        description="IES Code of Conduct of the Institution of Engineers Somalia (IES)"
        title="Code of Professional Practice & Ethics "
      />

      <Section tone="muted">
        <div className="space-y-6">
          <SectionCard number={1} title="Preamble">
            <p>
              Engineering is a profession founded on the application of scientific knowledge, technical expertise, creativity, and professional judgement to improve the quality of life and promote the safety, health, and welfare of society. Engineering practice encompasses the planning, design, construction, operation, maintenance, management, and advancement of infrastructure, systems, technologies, and services, with due regard to environmental protection and the sustainable use of resources.
            </p>
            <p>
              The Institution of Engineers Somalia (IES) is committed to promoting the highest standards of professional conduct and ethical practice among its members and to advancing engineering for the benefit of society.
            </p>
            <p>
              Members of the Institution are expected to uphold the dignity, integrity, and reputation of the engineering profession and to place the public interest, safety, health, welfare, and protection of the environment above personal or professional gain.
            </p>
            <p>
              This Code of Professional Practice and Ethics establishes the fundamental principles and standards of conduct expected of all members of the Institution of Engineers Somalia (IES).
            </p>
          </SectionCard>

          <SectionCard number={2} title="Core Values">
            <p>Members of IES shall uphold the following core values:</p>
            <ol className="grid gap-3 sm:grid-cols-2">
              {coreValues.map((value, i) => (
                <li
                  key={value}
                  className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50/60 p-3"
                >
                  <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#48C184]/15 text-xs font-bold text-[#2d7a50] ring-1 ring-[#48C184]/30">
                    {pad2(i + 1)}
                  </span>
                  <span className="text-sm font-medium text-[#022D5A] sm:text-base">{value}</span>
                </li>
              ))}
            </ol>
            <p>
              The community places its trust in the competence, judgement, and integrity of engineers. Members shall therefore conduct themselves in a manner that preserves public confidence in the engineering profession and places the legitimate interests of society above personal interests.
            </p>
          </SectionCard>

          <SectionCard number={3} title="Code of Professional Conduct">
            <p>Every member of the Institution of Engineers Somalia (IES) shall observe the following principles:</p>
            <NumberedList items={conductPrinciples} accent="blue" />
          </SectionCard>

          <SectionCard number={4} title="Professional Responsibility to Society">
            <p>
              Engineers have a responsibility to contribute positively to society and to recognise the broader social, economic, environmental, and cultural consequences of engineering decisions.
            </p>
            <p>Members shall, where reasonably practicable:</p>
            <CheckList items={societyResponsibilities} />
          </SectionCard>

          <SectionCard number={5} title="Compliance with the Code">
            <p>
              Membership of the Institution of Engineers Somalia (IES) carries an obligation to comply with this Code.
            </p>
            <p>
              Every member shall familiarise themselves with the Code and shall conduct their professional activities in accordance with its principles and requirements.
            </p>
            <p>
              A member shall cooperate honestly and fully with any authorised professional or disciplinary process established by the Institution.
            </p>
          </SectionCard>

          <SectionCard number={6} title="Disciplinary Matters">
            <p>
              An alleged breach of this Code may be considered by the Institution where a complaint is properly submitted and supported by sufficient information or evidence.
            </p>
            <p>
              Disciplinary matters shall be handled fairly, impartially, confidentially, and in accordance with the Institution&apos;s Constitution, By-laws, Policies and Regulations, and applicable laws.
            </p>
            <p>
              Where appropriate, the Institution may establish a disciplinary or professional conduct panel to consider the matter.
            </p>
            <p>
              The panel shall comprise an appropriate number of suitably qualified and impartial persons as determined by the Institution&apos;s governing framework.
            </p>
          </SectionCard>

          <SectionCard number={7} title="Disciplinary Measures">
            <p>
              Where a member is found to have breached this Code, the Institution may apply an appropriate disciplinary measure, taking into account the nature, seriousness, circumstances, and consequences of the breach.
            </p>
            <p>Possible measures may include:</p>
            <NumberedList items={disciplinaryMeasures} accent="green" />
          </SectionCard>

          <SectionCard number={8} title="Disciplinary Procedures">
            <NumberedList items={disciplinaryProcedures} accent="blue" />
          </SectionCard>

          <SectionCard number={9} title="Natural Justice and Fair Procedure">
            <p>
              All disciplinary proceedings under this Code shall observe the principles of natural justice and procedural fairness, including:
            </p>
            <CheckList items={naturalJustice} />
          </SectionCard>

          <SectionCard number={10} title="Review and Amendment">
            <p>
              The Institution of Engineers Somalia (IES) may periodically review this Code to ensure that it remains relevant to developments in engineering practice, professional standards, legislation, technology, environmental requirements, and the needs of society.
            </p>
            <p>
              Any amendment to this Code shall be made in accordance with the Constitution, By-laws, and approved governance procedures of the Institution.
            </p>
          </SectionCard>

          <SectionCard number={11} title="Professional Commitment">
            <p>
              By becoming and remaining a member of the Institution of Engineers Somalia (IES), every member is expected to uphold the principles of this Code and to contribute to a culture of professionalism, integrity, competence, safety, accountability, and service to society.
            </p>
            <p>
              Engineering is a profession entrusted with significant responsibility to society. Members of the Institution shall honour that responsibility through competent, ethical, and professional practice.
            </p>
          </SectionCard>
        </div>
      </Section>
    </>
  );
}
