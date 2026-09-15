import { StubPage } from '@/components/public/StubPage';
import { routes } from '@/config/routes';
export const metadata = { title: 'Presentations' };
export default function PresentationsPage() {
  return (
    <StubPage
      eyebrow="Media"
      title="Presentations"
      description="Presentation decks and slides from IES events."
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Info Hub', href: routes.infoHub.root },
        { label: 'Presentations' },
      ]}
    />
  );
}
