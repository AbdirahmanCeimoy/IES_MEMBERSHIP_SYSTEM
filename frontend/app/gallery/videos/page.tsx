import { StubPage } from '@/components/public/StubPage';
import { routes } from '@/config/routes';

export const metadata = { title: 'Gallery - Videos' };

export default function GalleryVideosPage() {
  return (
    <StubPage
      eyebrow="Videos"
      title="Gallery - Videos"
      description="Official IES video library and event coverage."
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Gallery', href: routes.gallery.root },
        { label: 'Videos' },
      ]}
      note="IES DECISION REQUIRED - official IES video content will appear here once uploaded."
    />
  );
}
