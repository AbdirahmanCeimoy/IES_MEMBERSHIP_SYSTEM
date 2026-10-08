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
        eyebrow="Gallery"
        title="Videos"
        description="Explore the official IES video library featuring event highlights, activities, interviews, and other IES programmes"
      />
      <Section>
        <VideoGalleryClient videos={galleryVideos} />
      </Section>
    </>
  );
}
