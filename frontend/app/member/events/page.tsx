'use client';

import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';

interface MemberEvent {
  id: string;
  title: string;
  type: 'Workshop' | 'Seminar' | 'Conference' | 'AGM';
  date: string;
  location: string;
  cpdHours: number;
  registered: boolean;
}

const events: MemberEvent[] = [
  {
    id: 'wed-2026',
    title: 'World Engineering Day 2026',
    type: 'Conference',
    date: '4 March 2026',
    location: 'Mogadishu',
    cpdHours: 6,
    registered: false,
  },
  {
    id: 'inwed-2026',
    title: 'International Women in Engineering Day',
    type: 'Seminar',
    date: '23 June 2026',
    location: 'Mogadishu',
    cpdHours: 4,
    registered: false,
  },
];

export default function MemberEventsPage() {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold text-[#082B55]">Upcoming Events</h1>
        <p className="text-sm text-slate-600">Register for IES conferences, seminars and CPD workshops.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {events.map((event) => (
          <Card key={event.id} padded>
            <div className="mb-2 flex items-center justify-between gap-2">
              <Badge tone="primary">{event.type}</Badge>
              <Badge tone="accent">CPD: {event.cpdHours}h</Badge>
            </div>
            <h3 className="text-sm font-semibold text-[#082B55]">{event.title}</h3>
            <div className="mt-2 flex flex-col gap-1 text-xs text-slate-600">
              <p>📅 {event.date}</p>
              <p>📍 {event.location}</p>
            </div>
            <div className="mt-3">
              <button
                type="button"
                className="inline-flex items-center rounded-lg bg-[#66FF00] px-4 py-1.5 text-xs font-semibold text-[#082B55] transition-colors hover:bg-[#5be000]"
              >
                Register
              </button>
            </div>
          </Card>
        ))}
      </div>

      <EmptyState
        title="Full calendar coming soon"
        description="Once the backend events endpoint is connected, the full IES 2026 calendar will appear here."
      />
    </div>
  );
}
