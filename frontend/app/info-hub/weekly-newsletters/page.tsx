import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { routes } from '@/config/routes';

export const metadata = { title: 'Newsletters' };

export default function NewslettersPage() {
  return (
    <>
      <PageHero
        breadcrumbs={
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Info Hub', href: routes.infoHub.root },
              { label: 'Newsletters' },
            ]}
          />
        }
        eyebrow="Info Hub"
        title="IES Newsletters"
        description="Weekly and periodic newsletters distributed to IES members"
      />
      <Section spacing="compact">
        <p className="text-left text-xs leading-relaxed text-slate-700 sm:text-sm">
          Stay up to date with the latest IES news, activities, events, opportunities, and developments in the Somali engineering community.
        </p>
      </Section>
    </>
  );
}
