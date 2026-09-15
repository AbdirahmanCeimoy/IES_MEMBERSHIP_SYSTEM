import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { SectionHeading } from '@/components/layout/SectionHeading';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ContentGrid } from '@/components/public/ContentGrid';
import { ValueList } from '@/components/public/ValueList';
import { routes } from '@/config/routes';

export const metadata = { title: 'Organization Membership' };

const requirements = [
  'Registered organization involved in engineering, technology, education or related activities.',
  'Commitment to supporting engineering development and professional standards.',
];

const benefits = [
  'Corporate recognition as a partner of Somalia\'s national engineering body.',
  'Access to technical collaboration and joint activities.',
  'Participation in policy dialogue and industry platforms.',
  'Visibility across IES events, publications and channels.',
  'A pipeline of qualified engineers through IES membership.',
];

export default function OrganizationMembershipPage() {
  return (
    <>
      <PageHero
        breadcrumbs={<Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Membership', href: routes.membership.root }, { label: 'Organizations' }]} />}
        eyebrow="Membership"
        title="Organization Membership"
        description="Membership open to companies, universities, research institutions and organizations involved in engineering and technology."
      />
      <Section>
        <ContentGrid columns={2}>
          <Card padded>
            <SectionHeading eyebrow="Eligibility" title="Requirements" />
            <div className="mt-4">
              <ValueList items={requirements} />
            </div>
          </Card>
          <Card padded>
            <SectionHeading eyebrow="Value" title="Benefits" />
            <div className="mt-4">
              <ValueList items={benefits} />
            </div>
          </Card>
        </ContentGrid>
        <div className="mt-6">
          <Button href="mailto:info@iesomalia.org.so" variant="primary">Enquire about organization membership</Button>
        </div>
      </Section>
    </>
  );
}
