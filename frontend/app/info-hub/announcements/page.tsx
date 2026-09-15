import { StubPage } from '@/components/public/StubPage';
import { routes } from '@/config/routes';
export const metadata = { title: 'Announcements' };
export default function AnnouncementsPage() {
  return (
    <StubPage
      eyebrow="Announcements"
      title="IES Announcements"
      description="Official notices and announcements from the Institution."
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Info Hub', href: routes.infoHub.root },
        { label: 'Announcements' },
      ]}
    />
  );
}
