import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { Card } from '@/components/ui/Card';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { ContentGrid } from '@/components/public/ContentGrid';
import { routes } from '@/config/routes';
import { whatWeDo } from '@/data/institution';

export const metadata = { title: 'What We Do – About IES' };

export default function WhatWeDoPage() {
  return (
    <>
      <PageHero
        breadcrumbs={<Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'About IES', href: routes.about.root }, { label: 'What We Do' }]} />}
        eyebrow="About IES"
        title="What We Do"
        description="IES provides valuable services to its members and the engineering community through various activities designed to advance the profession."
      />

      <Section>
        <h2 className="text-2xl font-extrabold tracking-tight text-[#035CB3] sm:text-3xl">
          How IES supports engineers and the profession
        </h2>
        <ContentGrid columns={2} className="mt-8">
          {whatWeDo.map((item) => (
            <Card key={item.title} padded>
              <h3 className="text-sm font-semibold text-[#022D5A]">{item.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{item.body}</p>
            </Card>
          ))}
        </ContentGrid>
      </Section>
    </>
  );
}
