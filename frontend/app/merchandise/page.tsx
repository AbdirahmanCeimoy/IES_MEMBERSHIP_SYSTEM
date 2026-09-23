import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { SectionHeading } from '@/components/layout/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { routes } from '@/config/routes';

export const metadata = { title: 'IES Merchandise' };

export default function MerchandisePage() {
  return (
    <>
      <PageHero
        eyebrow="Shop"
        title="IES Merchandise"
        description="Official branded merchandise from the Institution of Engineers Somalia."
      />
      <Section>
        <SectionHeading eyebrow="Official Gear" title="IES Branded Items" />
        <Card padded className="mt-6">
          <h3 className="text-base font-semibold text-[#022D5A]">IES Official Store</h3>
          <p className="mt-2 text-sm text-slate-600">
            Show your professional pride with official IES merchandise. From membership badges and certificates
            to professional accessories, the IES store offers quality branded items for members and supporters
            of the engineering profession in Somalia.
          </p>
          <Button href={routes.merchandise.store} variant="primary" size="md" className="mt-4">
            Browse Store
          </Button>
        </Card>
      </Section>
    </>
  );
}
