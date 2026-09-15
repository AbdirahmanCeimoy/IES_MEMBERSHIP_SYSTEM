import { StubPage } from '@/components/public/StubPage';
import { routes } from '@/config/routes';
export const metadata = { title: 'Documentary' };
export default function DocumentaryPage() {
  return (
    <StubPage
      eyebrow="Media"
      title="Documentary"
      description="Documentary media produced or curated by IES."
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Info Hub', href: routes.infoHub.root },
        { label: 'Documentary' },
      ]}
    />
  );
}
