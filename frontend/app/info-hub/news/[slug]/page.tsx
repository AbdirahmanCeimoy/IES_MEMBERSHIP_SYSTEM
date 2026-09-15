import { notFound } from 'next/navigation';
import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ValueList } from '@/components/public/ValueList';
import { routes } from '@/config/routes';
import { newsArticles } from '@/data/news-articles';

interface Params { slug: string }

export function generateStaticParams() {
  return newsArticles.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const article = newsArticles.find((a) => a.slug === slug);
  return { title: article?.title ?? 'News' };
}

export default async function NewsArticlePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const article = newsArticles.find((a) => a.slug === slug);
  if (!article) return notFound();

  return (
    <>
      <PageHero
        breadcrumbs={
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Info Hub', href: routes.infoHub.root },
              { label: 'News', href: routes.infoHub.news },
              { label: article.title },
            ]}
          />
        }
        eyebrow={article.date}
        title={article.title}
        description={article.intro}
      />

      <Section>
        <div className="grid gap-8 lg:grid-cols-[5fr_2fr]">
          <article className="flex flex-col gap-4 text-sm leading-relaxed text-slate-700 sm:text-base">
            <p>The MoU establishes a framework for collaboration in the following areas:</p>
            <ValueList items={article.areas} />
            <p>{article.closing}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {article.hashtags.map((h) => (
                <Badge key={h} tone="muted">#{h}</Badge>
              ))}
            </div>
          </article>
          <Card padded className="h-fit">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Signed by</p>
            <p className="mt-1 text-sm font-semibold text-[#082B55]">{article.author.name}</p>
            <p className="text-xs text-slate-500">{article.author.role}</p>
            <div className="mt-4">
              <Button href={routes.infoHub.news} variant="secondary" size="sm">‹ All news</Button>
            </div>
          </Card>
        </div>
      </Section>
    </>
  );
}
