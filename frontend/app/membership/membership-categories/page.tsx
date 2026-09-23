import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { ContentGrid } from '@/components/public/ContentGrid';
import { MembershipCategoryCard } from '@/components/public/MembershipCategoryCard';
import { routes } from '@/config/routes';
import { membershipCategories } from '@/data/membership';

export const metadata = { title: 'Membership Categories' };

export default function CategoriesPage() {
  return (
    <>
      <PageHero
        breadcrumbs={<Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Membership', href: routes.membership.root }, { label: 'Categories' }]} />}
        eyebrow="Membership"
        title="Membership Categories"
        description="IES provides membership categories that recognise engineers and engineering professionals at different stages of their academic and professional development, from student level to senior professional leadership."
      />
      <Section>
        <ContentGrid columns={3}>
          {membershipCategories.map((c) => (
            <MembershipCategoryCard key={c.code} category={c} />
          ))}
        </ContentGrid>
      </Section>
    </>
  );
}
