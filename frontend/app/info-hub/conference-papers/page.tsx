import { StubPage } from '@/components/public/StubPage';
import { routes } from '@/config/routes';
export const metadata = { title: 'Conference Papers' };
export default function ConferencePapersPage() {
  return (
    <StubPage
      eyebrow="Publications"
      title="Conference Papers & Reports"
      description="Papers and reports presented at IES conferences and technical forums."
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Info Hub', href: routes.infoHub.root },
        { label: 'Conference Papers' },
      ]}
    />
  );
}
