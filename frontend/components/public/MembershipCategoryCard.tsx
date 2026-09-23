import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export interface MembershipCategory {
  code: string;
  title: string;
  postnominal?: string;
  summary: string;
  href?: string;
}

export const MembershipCategoryCard = ({ category }: { category: MembershipCategory }) => (
  <Card className="flex flex-col gap-3" padded interactive>
    <div className="flex items-start justify-between gap-2">
      <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
        {category.code}
      </span>
      {category.postnominal && <Badge tone="primary">{category.postnominal}</Badge>}
    </div>
    <h3 className="text-sm font-semibold text-[#022D5A]">{category.title}</h3>
    <p className="text-xs leading-relaxed text-slate-600">{category.summary}</p>
    {category.href && (
      <Link
        href={category.href}
        className="mt-auto text-xs font-semibold text-[#035CB3] hover:underline"
      >
        Learn more ›
      </Link>
    )}
  </Card>
);
