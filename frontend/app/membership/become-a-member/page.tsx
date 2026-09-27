import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { SectionHeading } from '@/components/layout/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ContentGrid } from '@/components/public/ContentGrid';
import { routes } from '@/config/routes';

export const metadata = { title: 'Become a Member' };

interface Reason {
  title: string;
  intro?: string;
  bullets: string[];
  affiliations?: string[];
  closing?: string;
}

const whyJoinReasons: Reason[] = [
  {
    title: 'Professional Development',
    bullets: [
      'Participate in IES conferences, seminars, workshops, and technical events.',
      'Access professional development opportunities to enhance technical and managerial skills.',
      'Enjoy preferential rates for IES training programmes and professional development courses.',
      'Stay updated on engineering practices, emerging technologies, and industry developments.',
      'Participate in training programmes and knowledge-sharing activities.',
      'Contribute to the promotion of engineering excellence, ethics, and best practices.',
    ],
  },
  {
    title: 'International Affiliation',
    intro:
      'IES maintains close links with professional engineering organizations locally, regionally, and internationally to promote cooperation, goodwill, and fellowship among engineers. IES collaborates and is affiliated with:',
    bullets: [],
    affiliations: [
      'World Federation of Engineering Organizations (WFEO).',
      'Federation of African Engineering Organisations (FAEO).',
      'East African Federation of Engineering Organsations (EAFEO).',
      'Other regional and international engineering organizations.',
    ],
    closing:
      'Through these affiliations, IES members gain opportunities to engage with the wider global engineering community.',
  },
  {
    title: 'Networking & Communication',
    bullets: [
      'Connect and share knowledge, ideas, and experiences with fellow engineers.',
      'Build professional relationships with engineers from different sectors and disciplines.',
      'Participate in IES networking activities, technical forums, and professional gatherings.',
      'Engage with engineering professionals, institutions, and industry stakeholders.',
      'Receive updates on IES activities, conferences, seminars, and professional opportunities.',
      'Access engineering news, announcements, and information through IES communication platforms.',
      'Stay informed about developments affecting the engineering profession in Somalia and beyond.',
    ],
  },
  {
    title: 'Membership Benefits',
    bullets: [
      'Participate in IES technical committees and professional activities.',
      'Gain recognition as part of Somalia’s national engineering professional community.',
      'Contribute to the growth and advancement of the engineering profession.',
      'Access opportunities for collaboration, learning, and professional engagement.',
      'Support the development of engineering standards and practices in Somalia.',
    ],
  },
];

export default function BecomeAMemberPage() {
  return (
    <>
      <PageHero
        eyebrow="IES Membership"
        title="Become a Member"
        description="Discover our Membership"
      />

      <Section spacing="compact">
        <h2 className="text-2xl font-extrabold tracking-tight text-[#035CB3] sm:text-3xl">
          Why Become a Member
        </h2>
        <div className="mt-3 flex flex-col gap-3 text-sm leading-relaxed text-slate-700 sm:text-base">
          <p>
            Joining the Institution of Engineers Somalia (IES) is a valuable investment in your future as an engineering and technology professional. Our membership benefits are designed to support your career development at every stage, from university, throughout your professional career, and through retirement.
          </p>
          <p>
            In addition, IES represents the voice of engineers in Somalia and provides a platform for engineering professionals to connect, share knowledge, exchange experiences, and contribute to the advancement of the engineering profession.
          </p>
        </div>
      </Section>

      <Section tone="muted" spacing="compact">
        <h2 className="text-2xl font-extrabold tracking-tight text-[#035CB3] sm:text-3xl">
          Why Engineers Join IES
        </h2>
        <ContentGrid columns={2} className="mt-6">
          {whyJoinReasons.map((reason, i) => (
            <Card key={reason.title} padded className="flex flex-col">
              <div className="mb-3 flex items-center gap-3">
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#035CB3] text-sm font-bold text-white">
                  {i + 1}
                </span>
                <h3 className="text-base font-bold text-[#035CB3]">
                  {reason.title}
                </h3>
              </div>

              {reason.intro && (
                <p className="mb-3 text-sm leading-relaxed text-slate-700">
                  {reason.intro}
                </p>
              )}

              {reason.bullets.length > 0 && (
                <ul className="flex flex-col gap-2">
                  {reason.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm leading-relaxed text-slate-700">
                      <span className="mt-1.5 flex h-1.5 w-1.5 shrink-0 rounded-full bg-[#48C184]" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}

              {reason.affiliations && reason.affiliations.length > 0 && (
                <ul className="mt-1 flex flex-col gap-2">
                  {reason.affiliations.map((a) => (
                    <li key={a} className="flex items-start gap-2 text-sm leading-relaxed text-slate-700">
                      <span className="mt-1.5 flex h-1.5 w-1.5 shrink-0 rounded-full bg-[#035CB3]" />
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              )}

              {reason.closing && (
                <p className="mt-4 text-sm italic leading-relaxed text-slate-600">
                  {reason.closing}
                </p>
              )}
            </Card>
          ))}
        </ContentGrid>
      </Section>

      {/* <Section>
        <div className="mx-auto max-w-2xl text-center">
          <SectionHeading
            eyebrow="Get started"
            title="Ready to join the engineering community?"
            className="items-center text-center"
          />
          <p className="mt-2 text-sm text-slate-600">
            Explore membership categories to find the right grade for your
            qualifications and experience, then follow the online application
            guidelines to submit your application.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button href={routes.membership.categories} variant="primary">
              View Membership Categories
            </Button>
            <Button href={routes.membership.applicationGuidelines} variant="secondary">
              Application Guidelines
            </Button>
          </div>
        </div>
      </Section> */}
    </>
  );
}
