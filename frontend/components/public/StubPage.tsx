import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { Breadcrumbs, type BreadcrumbItem } from '@/components/layout/Breadcrumbs';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';

interface StubPageProps {
  eyebrow: string;
  title: string;
  description?: string;
  breadcrumbs: BreadcrumbItem[];
  note?: string;
  contactHref?: string;
}

export const StubPage = ({
  eyebrow,
  title,
  description,
  breadcrumbs,
  note,
  contactHref = 'mailto:info@iesomalia.org.so',
}: StubPageProps) => (
  <>
    <PageHero
      breadcrumbs={<Breadcrumbs items={breadcrumbs} />}
      eyebrow={eyebrow}
      title={title}
      description={description}
    />
    <Section>
      <EmptyState
        title="Content coming soon"
        description={
          note ??
          'IES DECISION REQUIRED - this section will be populated once the Institution shares the confirmed content.'
        }
        action={<Button href={contactHref} variant="secondary" size="sm">Contact IES</Button>}
      />
    </Section>
  </>
);
