import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { SectionHeading } from '@/components/layout/SectionHeading';
import { Card } from '@/components/ui/Card';

export const metadata = { title: 'Account Activation' };

const activationSteps = [
  {
    step: 1,
    title: 'Complete your online application',
    description:
      'Fill in the online membership application form with your personal details, qualifications, and professional experience. Upload all required supporting documents.',
  },
  {
    step: 2,
    title: 'Pay the application fee',
    description:
      'Submit the applicable application and membership fee for your chosen membership grade. Payment details are provided during the application process.',
  },
  {
    step: 3,
    title: 'Wait for Council review',
    description:
      'Your application will be reviewed by the IES Membership Committee and Council. This process ensures all applicants meet the required standards for their membership grade.',
  },
  {
    step: 4,
    title: 'Receive activation email',
    description:
      'Once your application is approved, you will receive an activation email with instructions to access your IES member account, certificate, and membership benefits.',
  },
];

export default function AccountActivationPage() {
  return (
    <>
      <PageHero
        eyebrow="Membership"
        title="Account Activation"
        description="Follow these steps to activate your IES membership account after completing your registration."
      />

      <Section>
        <SectionHeading
          eyebrow="Activation process"
          title="How to activate your membership"
        />
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {activationSteps.map((item) => (
            <Card key={item.step} padded>
              <div className="mb-3 flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#035CB3] text-sm font-bold text-white">
                  {item.step}
                </span>
                <h3 className="text-sm font-semibold text-[#022D5A]">
                  {item.title}
                </h3>
              </div>
              <p className="text-sm text-slate-600">{item.description}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section tone="muted">
        <Card padded className="mx-auto max-w-2xl">
          <div className="text-center">
            <h3 className="text-sm font-semibold text-[#022D5A]">
              Need assistance?
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              For assistance with account activation, contact{' '}
              <a
                href="mailto:info@iesomalia.org.so"
                className="font-semibold text-[#035CB3] hover:underline"
              >
                info@iesomalia.org.so
              </a>
            </p>
          </div>
        </Card>
      </Section>
    </>
  );
}
