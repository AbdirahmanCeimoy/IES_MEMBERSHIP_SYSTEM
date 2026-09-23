import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ContentGrid } from '@/components/public/ContentGrid';
import { routes } from '@/config/routes';

export const metadata = { title: 'Gallery' };

export default function GalleryPage() {
  return (
    <>
      <PageHero
        breadcrumbs={<Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Gallery' }]} />}
        eyebrow="Media"
        title="IES Gallery"
        description="Official photography and video coverage of IES events and activities."
      />
      <Section>
        <ContentGrid columns={2}>
          <Card padded interactive>
            <h2 className="text-base font-semibold text-[#022D5A]">Photos</h2>
            <p className="mt-1 text-sm text-slate-600">Official event and activity photography.</p>
            <Button href={routes.gallery.photos} variant="secondary" size="sm" className="mt-3">Browse photos ›</Button>
          </Card>
          <Card padded interactive>
            <h2 className="text-base font-semibold text-[#022D5A]">Videos</h2>
            <p className="mt-1 text-sm text-slate-600">IES video library and event coverage.</p>
            <Button href={routes.gallery.videos} variant="secondary" size="sm" className="mt-3">Browse videos ›</Button>
          </Card>
        </ContentGrid>
      </Section>
    </>
  );
}
