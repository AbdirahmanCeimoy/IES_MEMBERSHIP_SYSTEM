import { StubPage } from '@/components/public/StubPage';
import { routes } from '@/config/routes';
export const metadata = { title: 'Tenders' };
export default function TendersPage() {
  return (
    <StubPage
      eyebrow="Procurement"
      title="Tenders"
      description="Open tenders at IES and partner organizations."
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Opportunities', href: routes.opportunities.root },
        { label: 'Tenders' },
      ]}
    />
  );
}
