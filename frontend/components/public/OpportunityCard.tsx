import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export interface OpportunityItem {
  title: string;
  organization?: string;
  type: 'Job' | 'Internship' | 'Tender' | string;
  deadline?: string;
  location?: string;
  href: string;
}

export const OpportunityCard = ({ item }: { item: OpportunityItem }) => (
  <Card className="flex flex-col gap-2" padded interactive>
    <div className="flex items-center justify-between gap-2">
      <Badge tone="primary">{item.type}</Badge>
      {item.deadline && (
        <span className="text-[11px] font-semibold text-amber-700">Deadline: {item.deadline}</span>
      )}
    </div>
    <Link href={item.href} className="text-sm font-semibold text-[#022D5A] hover:text-[#035CB3]">
      {item.title}
    </Link>
    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
      {item.organization && <span>{item.organization}</span>}
      {item.location && <span>· {item.location}</span>}
    </div>
  </Card>
);
