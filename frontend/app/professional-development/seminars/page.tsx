import { StubPage } from '@/components/public/StubPage';
import { routes } from '@/config/routes';
export const metadata = { title: 'Seminars' };
export default function SeminarsPage() {
  return (
    <StubPage
      eyebrow="Seminars"
      title="IES Seminars"
      description="Seminars keeping members informed about the latest advancements in technology, engineering practices and management strategies."
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Professional Development', href: routes.professionalDevelopment.root },
        { label: 'Seminars' },
      ]}
    />
  );
}
