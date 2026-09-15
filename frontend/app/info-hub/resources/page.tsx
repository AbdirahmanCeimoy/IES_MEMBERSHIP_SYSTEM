import { StubPage } from '@/components/public/StubPage';
import { routes } from '@/config/routes';
export const metadata = { title: 'Engineering Resources' };
export default function EngineeringResourcesPage() {
  return (
    <StubPage
      eyebrow="Knowledge"
      title="Engineering Resources"
      description="Curated engineering references, standards and learning material."
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Info Hub', href: routes.infoHub.root },
        { label: 'Engineering Resources' },
      ]}
    />
  );
}
