import { StubPage } from '@/components/public/StubPage';
import { routes } from '@/config/routes';
export const metadata = { title: 'Speeches' };
export default function SpeechesPage() {
  return (
    <StubPage
      eyebrow="Media"
      title="Speeches"
      description="Official speeches by IES leadership."
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Info Hub', href: routes.infoHub.root },
        { label: 'Speeches' },
      ]}
    />
  );
}
