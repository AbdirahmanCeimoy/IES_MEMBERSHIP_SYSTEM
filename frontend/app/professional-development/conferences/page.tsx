import { StubPage } from '@/components/public/StubPage';
import { routes } from '@/config/routes';
export const metadata = { title: 'Conferences' };
export default function ConferencesPage() {
  return (
    <StubPage
      eyebrow="Conferences"
      title="IES Conferences"
      description="National and international engineering conferences hosted or supported by IES."
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Professional Development', href: routes.professionalDevelopment.root },
        { label: 'Conferences' },
      ]}
    />
  );
}
