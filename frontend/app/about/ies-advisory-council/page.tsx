import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { routes } from '@/config/routes';

export const metadata = { title: 'Advisory Council' };

export default function AdvisoryCouncilPage() {
  return (
    <>
      <PageHero
        breadcrumbs={<Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'About', href: routes.about.root }, { label: 'Advisory Council' }]} />}
        eyebrow="About IES"
        title="IES Advisory Council"
        description="Discover our Advisory Council"
      />
      <Section spacing="compact">
        <p className="text-base font-medium leading-relaxed text-slate-700 sm:text-lg mt-2 mb-2">
          IES Advisory Council is being established to provide expert guidance and support to the Institution. Information about its members will be published on this page in due course.
        </p>
      </Section> 
    </>
  );
}
