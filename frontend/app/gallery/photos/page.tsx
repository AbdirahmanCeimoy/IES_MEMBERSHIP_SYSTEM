import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { routes } from '@/config/routes';
import { seminars } from '@/data/seminars';
import { PhotoGalleryClient } from './PhotoGalleryClient';

export const metadata = { title: 'Gallery - Photos' };

export default function GalleryPhotosPage() {
  // Only seminars that have photos to show (poster-only entries are skipped)
  const withPhotos = seminars.filter((s) => (s.photos?.length ?? 0) > 0);

  return (
    <>
      <PageHero
        breadcrumbs={
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Gallery', href: routes.gallery.root },
              { label: 'Photos' },
            ]}
          />
        }
        eyebrow="Photography"
        title="Gallery - Photos"
        description="Visual highlights from IES seminars and events — click any event to view all its photos."
      />
      <Section>
        <PhotoGalleryClient events={withPhotos} />
      </Section>
    </>
  );
}
