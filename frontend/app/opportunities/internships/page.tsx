import { StubPage } from '@/components/public/StubPage';
import { routes } from '@/config/routes';
export const metadata = { title: 'Internships' };
export default function InternshipsPage() {
  return (
    <StubPage
      eyebrow="Early career"
      title="Internships"
      description="Internship openings for engineering students and graduates."
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Opportunities', href: routes.opportunities.root },
        { label: 'Internships' },
      ]}
    />
  );
}
