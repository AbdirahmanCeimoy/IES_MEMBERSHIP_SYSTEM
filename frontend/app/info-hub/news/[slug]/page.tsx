import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Section } from '@/components/layout/Section';
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

const urlRegex = /(https?:\/\/[^\s]+)/g;

/** Linkify URLs within a single line of text. */
const linkify = (text: string, keyPrefix: string) => {
  const parts = text.split(urlRegex);
  return parts.map((part, i) =>
    urlRegex.test(part) ? (
      <a
        key={`${keyPrefix}-${i}`}
        href={part}
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold text-[#035CB3] underline hover:text-[#48C184]"
      >
        {part}
      </a>
    ) : (
      <span key={`${keyPrefix}-${i}`}>{part}</span>
    ),
  );
};

/**
 * Render a paragraph string with awareness of structure:
 * - Lines starting with "- " become a bullet list
 * - Short standalone text without a trailing period/colon becomes a sub-heading
 * - Plain text renders as a paragraph, with "\n" turned into <br>
 */
const renderParagraph = (text: string, key: number) => {
  const lines = text.split('\n');
  const allBullets = lines.length > 0 && lines.every((l) => l.trim().startsWith('- '));

  if (allBullets) {
    return (
      <ul key={key} className="list-disc space-y-1 pl-6 marker:text-[#035CB3]">
        {lines.map((line, i) => (
          <li key={i}>{linkify(line.trim().replace(/^-\s+/, ''), `b-${i}`)}</li>
        ))}
      </ul>
    );
  }

  const isHeading = lines.length === 1 && text.length <= 40 && !/[.:!?]$/.test(text.trim());
  if (isHeading) {
    return (
      <h2 key={key} className="mt-2 text-lg font-bold text-[#022D5A] sm:text-xl">
        {linkify(text, 'h')}
      </h2>
    );
  }

  return (
    <p key={key}>
      {lines.map((line, idx) => (
        <span key={idx}>
          {linkify(line, `l-${idx}`)}
          {idx < lines.length - 1 && <br />}
        </span>
      ))}
    </p>
  );
};

export default async function NewsArticlePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const article = newsArticles.find((a) => a.slug === slug);
  if (!article) return notFound();

  return (
    <>
      <Section>
        <div className="mx-auto max-w-4xl">
          {/* Compact title above article content */}
          <div className="mb-6 text-center">
            {article.date && (
              <p className="text-xs font-bold uppercase tracking-widest text-[#035CB3]">
                {article.date}
              </p>
            )}
            <h1 className="mt-2 text-2xl font-extrabold leading-tight text-[#022D5A] sm:text-3xl">
              {article.title}
            </h1>
          </div>

          <article className="flex flex-col gap-5 text-sm leading-relaxed text-slate-700 sm:text-base">
            {/* Hero image */}
            {article.image && (
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-slate-100 shadow-sm">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  sizes="(min-width: 1024px) 900px, 100vw"
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* Intro paragraph */}
            <p className="text-base leading-relaxed text-slate-800 sm:text-lg">
              {article.intro}
            </p>

            {/* Additional paragraphs */}
            {article.paragraphs?.map((p, i) => renderParagraph(p, i))}

            {/* Areas list (only when not hidden) */}
            {!article.hideAreas && article.areas.length > 0 && (
              <>
                <p>The MoU establishes a framework for collaboration in the following areas:</p>
                <ValueList items={article.areas} />
              </>
            )}

            {/* Closing paragraph */}
            {article.closing && <p>{article.closing}</p>}

            {/* CTA button */}
            {article.cta && (
              <div className="mt-2">
                <Button href={article.cta.href} variant="primary">
                  {article.cta.label} →
                </Button>
              </div>
            )}

            {/* Hashtags */}
            <div className="mt-4 flex flex-wrap gap-1.5">
              {article.hashtags.map((h) => (
                <Badge key={h} tone="muted">#{h}</Badge>
              ))}
            </div>

          </article>

          {/* Signature card - only show when not hidden (universities have real signatures) */}
          {!article.hideSignature && (
            <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-[#035CB3]/5 via-white to-[#48C184]/5 shadow-sm">
              <div className="flex flex-col items-center gap-4 px-6 py-6 sm:flex-row sm:justify-between">
                <div className="flex items-center gap-4">
                  {/* Avatar circle with initials */}
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#035CB3] to-[#022D5A] text-lg font-bold text-white shadow-md">
                    {article.author.name
                      .split(' ')
                      .filter((s) => s && !s.endsWith('.'))
                      .slice(0, 2)
                      .map((s) => s[0])
                      .join('')
                      .toUpperCase()}
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-[#48C184]">
                      Signed by
                    </p>
                    <p className="mt-0.5 text-base font-bold text-[#022D5A]">{article.author.name}</p>
                    <p className="text-xs text-slate-600">{article.author.role}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Back link - always at bottom (announcements return to the Announcements index) */}
          <div className="mt-8 flex justify-center">
            {article.kind === 'announcement' ? (
              <Button href={routes.infoHub.announcements} variant="secondary" size="sm">‹ All Announcements</Button>
            ) : (
              <Button href={routes.infoHub.news} variant="secondary" size="sm">‹ All News</Button>
            )}
          </div>
        </div>
      </Section>
    </>
  );
}
