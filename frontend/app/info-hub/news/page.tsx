'use client';

import { useState } from 'react';
import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { ContentGrid } from '@/components/public/ContentGrid';
import { NewsCard } from '@/components/public/NewsCard';
import { Pagination } from '@/components/ui/Pagination';
import { routes } from '@/config/routes';
import { featuredNews } from '@/data/news';

const PAGE_SIZE = 6;

export default function NewsIndexPage() {
  const [page, setPage] = useState(1);
  const start = (page - 1) * PAGE_SIZE;
  const items = featuredNews.slice(start, start + PAGE_SIZE);

  return (
    <>
      <PageHero
        breadcrumbs={<Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Info Hub', href: routes.infoHub.root }, { label: 'News' }]} />}
        eyebrow="News"
        title="Latest news from IES"
        description="Announcements, partnerships and updates from the Institution of Engineers of Somalia."
      />
      <Section>
        <ContentGrid columns={3}>
          {items.map((n) => (
            <NewsCard key={n.href} item={n} />
          ))}
        </ContentGrid>
        <Pagination
          currentPage={page}
          totalItems={featuredNews.length}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
          label="articles"
        />
      </Section>
    </>
  );
}
