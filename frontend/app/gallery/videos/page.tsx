import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { routes } from '@/config/routes';
import { galleryVideos } from '@/data/gallery-videos';
import { VideoGalleryClient } from './VideoGalleryClient';

export const metadata = { title: 'Gallery - Videos' };

export default function GalleryVideosPage() {
  return (
    <>
      <PageHero
        breadcrumbs={
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Gallery', href: routes.gallery.root },
              { label: 'Videos' },
            ]}
          />
        }
        eyebrow="Videos"
        title="Gallery - Videos"
        description="Official IES video library and event coverage — click any video to play."
      />
      <Section>
        <VideoGalleryClient videos={galleryVideos} />
      </Section>
    </>
  );
}
