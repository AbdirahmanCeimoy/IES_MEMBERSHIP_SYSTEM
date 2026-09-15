import { StubPage } from '@/components/public/StubPage';
import { routes } from '@/config/routes';
export const metadata = { title: 'Publications' };
export default function PublicationsPage() {
  return (
    <StubPage
      eyebrow="Publications"
      title="IES Publications"
      description="Technical papers, reports, newsletters and guidelines from the Institution."
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Info Hub', href: routes.infoHub.root },
        { label: 'Publications' },
      ]}
    />
  );
}
