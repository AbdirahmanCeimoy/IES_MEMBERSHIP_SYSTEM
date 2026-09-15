import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { SectionHeading } from '@/components/layout/SectionHeading';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ContentGrid } from '@/components/public/ContentGrid';
import { NewsCard } from '@/components/public/NewsCard';
import { routes } from '@/config/routes';
import { featuredNews } from '@/data/news';

export const metadata = { title: 'Info Hub' };

const sections = [
  { title: 'News', body: 'Institutional news and announcements.', href: routes.infoHub.news },
  { title: 'Announcements', body: 'Official notices from the Institution.', href: routes.infoHub.announcements },
  { title: 'Publications', body: 'Technical papers, reports and guidelines.', href: routes.infoHub.publications },
  { title: 'Engineering Magazine', body: 'The IES Engineering in Somalia Magazine.', href: routes.infoHub.magazine },
  { title: 'Conference Papers', body: 'Papers and reports from IES conferences.', href: routes.infoHub.conferencePapers },
  { title: 'Engineering Resources', body: 'Curated engineering references and learning material.', href: routes.infoHub.resources },
  { title: 'Documentary', body: 'Documentary media produced or curated by IES.', href: routes.infoHub.documentary },
  { title: 'Presentations', body: 'Presentation decks from IES events.', href: routes.infoHub.presentations },
  { title: 'Speeches', body: 'Official speeches by IES leadership.', href: routes.infoHub.speeches },
  { title: 'Newsletters', body: 'Weekly and periodic IES newsletters.', href: routes.infoHub.newsletters },
];

export default function InfoHubPage() {
  return (
    <>
      <PageHero
        breadcrumbs={<Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Info Hub' }]} />}
        eyebrow="Knowledge"
        title="IES Info Hub"
        description="News, announcements, publications, engineering resources and everything the Institution shares with members and the public."
      />

      <Section>
        <SectionHeading eyebrow="Recent" title="Latest news" actions={<Button href={routes.infoHub.news} variant="secondary" size="sm">All news</Button>} />
        <ContentGrid columns={4} className="mt-6">
          {featuredNews.map((n) => (
            <NewsCard key={n.href} item={n} />
          ))}
        </ContentGrid>
      </Section>

      <Section tone="muted">
        <SectionHeading eyebrow="Explore" title="All Info Hub sections" />
        <ContentGrid columns={3} className="mt-6">
          {sections.map((s) => (
            <Card key={s.href} padded interactive>
              <h3 className="text-sm font-semibold text-[#082B55]">{s.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{s.body}</p>
              <Button href={s.href} variant="ghost" size="sm" className="mt-2 px-0">Open ›</Button>
            </Card>
          ))}
        </ContentGrid>
      </Section>
    </>
  );
}
