'use client';

import { useState } from 'react';
import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { ContentGrid } from '@/components/public/ContentGrid';
import { NewsCard } from '@/components/public/NewsCard';
import { Pagination } from '@/components/ui/Pagination';
import { routes } from '@/config/routes';
import { latestAnnouncements } from '@/data/news';

const PAGE_SIZE = 6;

export default function AnnouncementsIndexPage() {
  const [page, setPage] = useState(1);
  const start = (page - 1) * PAGE_SIZE;
  const items = latestAnnouncements.slice(start, start + PAGE_SIZE);

  return (
    <>
      <PageHero
        breadcrumbs={
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Info Hub', href: routes.infoHub.root },
              { label: 'Announcements' },
            ]}
          />
        }
        eyebrow="Info Hub"
        title="Latest Announcements"
      >
        <p className="mx-auto mt-3 max-w-2xl text-xs text-blue-100 sm:text-sm">
          Discover our Latest Announcements &amp; Upcoming Events
        </p>
      </PageHero>
      <Section>
        <ContentGrid columns={3}>
          {items.map((a) => (
            <NewsCard key={a.href} item={a} />
          ))}
        </ContentGrid>
        <Pagination
          currentPage={page}
          totalItems={latestAnnouncements.length}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
          label="announcements"
        />
      </Section>
    </>
  );
}
