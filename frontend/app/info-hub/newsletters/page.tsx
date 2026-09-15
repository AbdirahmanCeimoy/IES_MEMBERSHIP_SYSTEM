import { StubPage } from '@/components/public/StubPage';
import { routes } from '@/config/routes';
export const metadata = { title: 'Newsletters' };
export default function NewslettersPage() {
  return (
    <StubPage
      eyebrow="Newsletters"
      title="IES Newsletters"
      description="Weekly and periodic newsletters distributed to IES members."
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Info Hub', href: routes.infoHub.root },
        { label: 'Newsletters' },
      ]}
    />
  );
}
