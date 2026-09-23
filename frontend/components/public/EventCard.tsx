import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export interface EventItem {
  title: string;
  date: string;
  location?: string;
  type?: string;
  excerpt?: string;
  href: string;
}

export const EventCard = ({ event }: { event: EventItem }) => (
  <Card className="flex flex-col gap-2" padded interactive>
    <div className="flex items-center gap-2">
      {event.type && <Badge tone="accent">{event.type}</Badge>}
      <span className="text-[11px] text-slate-500">{event.date}</span>
    </div>
    <Link href={event.href} className="text-sm font-semibold text-[#022D5A] hover:text-[#035CB3]">
      {event.title}
    </Link>
    {event.location && <p className="text-xs text-slate-500">📍 {event.location}</p>}
    {event.excerpt && <p className="line-clamp-2 text-xs text-slate-600">{event.excerpt}</p>}
  </Card>
);
