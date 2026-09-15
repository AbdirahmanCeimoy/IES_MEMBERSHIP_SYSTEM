import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export interface NewsItem {
  title: string;
  excerpt: string;
  date: string;
  href: string;
  category?: string;
}

export const NewsCard = ({ item }: { item: NewsItem }) => (
  <Card className="flex flex-col gap-3" padded interactive>
    <div className="flex items-center justify-between gap-3">
      {item.category ? <Badge tone="primary">{item.category}</Badge> : <span />}
      <time className="text-[11px] text-slate-500">{item.date}</time>
    </div>
    <Link href={item.href} className="group">
      <h3 className="text-sm font-semibold text-[#082B55] group-hover:text-[#0047AB]">
        {item.title}
      </h3>
    </Link>
    <p className="line-clamp-3 text-xs leading-relaxed text-slate-600">{item.excerpt}</p>
    <Link
      href={item.href}
      className="mt-auto text-xs font-semibold text-[#0047AB] hover:underline"
    >
      Read more ›
    </Link>
  </Card>
);
