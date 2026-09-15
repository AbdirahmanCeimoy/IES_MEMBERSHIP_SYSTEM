import { StubPage } from '@/components/public/StubPage';
import { routes } from '@/config/routes';
export const metadata = { title: 'Jobs' };
export default function JobsPage() {
  return (
    <StubPage
      eyebrow="Careers"
      title="Jobs"
      description="IES career opportunities and partner-organization openings."
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Opportunities', href: routes.opportunities.root },
        { label: 'Jobs' },
      ]}
    />
  );
}
