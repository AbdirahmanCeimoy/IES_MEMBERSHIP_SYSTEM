import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { routes } from '@/config/routes';
import { seminars, type SeminarEvent } from '@/data/seminars';
import { panelDiscussions } from '@/data/panel-discussions';
import { PhotoGalleryClient } from './PhotoGalleryClient';

export const metadata = { title: 'Gallery - Photos' };

export default function GalleryPhotosPage() {
  // Combine seminars + panel discussions, keep only those with photos
  const combined: SeminarEvent[] = [
    ...seminars,
    ...panelDiscussions,
  ].filter((e) => (e.photos?.length ?? 0) > 0);

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
        eyebrow="Gallery"
        title="Photos"
        description="Explore photos from IES events, activities, programmes, and professional engagements"
      />
      <Section>
        <PhotoGalleryClient events={combined} />
      </Section>
    </>
  );
}
