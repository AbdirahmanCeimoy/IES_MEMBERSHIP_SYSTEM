import Link from 'next/link';
import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { SectionHeading } from '@/components/layout/SectionHeading';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ContentGrid } from '@/components/public/ContentGrid';
import { routes } from '@/config/routes';

export const metadata = { title: 'Apply for Membership' };

interface GradeOption {
  code: string;
  label: string;
  postnominal?: string;
  short: string;
  requirements: string;
}

/**
 * Only the grades the backend RegistrationForm currently supports.
 * The document mentions additional categories (Honorary, Companion,
 * Graduate Technologist/Technician) - those need backend + form work
 * before being surfaced here.
 */
const applyGrades: GradeOption[] = [
  {
    code: 'STUDENT',
    label: 'Student Member',
    short: 'Currently enrolled in an accredited engineering programme.',
    requirements: 'Student ID + national ID + passport photo',
  },
  {
    code: 'GRADUATE',
    label: 'Graduate Member',
    postnominal: 'GMIES',
    short: 'Holds an accredited engineering degree and is early in their career.',
    requirements: 'Degree + CV + 2 proposers/seconders',
  },
  {
    code: 'ASSOCIATE',
    label: 'Associate Member',
    postnominal: 'AMIES',
    short: '10+ years of experience in an engineering-related position of responsibility.',
    requirements: 'HND + CV + 2 proposers/seconders',
  },
  {
    code: 'CORPORATE',
    label: 'Corporate Member',
    postnominal: 'MIES',
    short: '3+ years post-graduate engineering experience with demonstrated competence.',
    requirements: 'Graduate letter + 3+ years exp. + 2 proposers/seconders',
  },
  {
    code: 'SENIOR',
    label: 'Senior Member',
    postnominal: 'SenMIES',
    short: '10+ years professional experience with technical/leadership record.',
    requirements: 'Corporate standing + leadership evidence + referees',
  },
  {
    code: 'FELLOW',
    label: 'Fellow',
    postnominal: 'FIES',
    short: 'Corporate Member for 7+ years with outstanding contribution to engineering.',
    requirements: '15+ yrs experience + senior role + CSR + 2 Fellow proposers',
  },
];

export default function ApplyPage() {
  return (
    <>
      <PageHero
        align="center"
        breadcrumbs={<Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Membership', href: routes.membership.root }, { label: 'Apply' }]} />}
        eyebrow="Join Us"
        title="Advance Your Engineering Career"
        description="Become part of Somalia's national engineering community. Choose the membership grade that matches your qualifications and apply in minutes."
        actions={
          <Button href={routes.membership.requirements} variant="secondary">
            View all requirements
          </Button>
        }
      />

      <Section>
        <SectionHeading eyebrow="Step 1" title="Choose your membership grade" />
        <ContentGrid columns={3} className="mt-6">
          {applyGrades.map((g) => (
            <Card key={g.code} padded interactive className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                  {g.code}
                </span>
                {g.postnominal && <Badge tone="primary">{g.postnominal}</Badge>}
              </div>
              <h3 className="text-sm font-semibold text-[#082B55]">{g.label}</h3>
              <p className="text-xs text-slate-600">{g.short}</p>
              <p className="mt-2 text-[11px] text-slate-500">
                <span className="font-semibold text-slate-600">Docs:</span> {g.requirements}
              </p>
              <div className="mt-auto pt-3">
                <Link
                  href={`/membership/apply/${g.code.toLowerCase()}`}
                  className="inline-flex w-full items-center justify-center rounded-lg bg-[#66FF00] px-4 py-2 text-xs font-semibold text-[#082B55] transition-colors hover:bg-[#5be000]"
                >
                  Apply as {g.label}
                </Link>
              </div>
            </Card>
          ))}
        </ContentGrid>
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
