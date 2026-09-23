'use client';

import { useCallback, useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { fetchPublicEvents, registerForEvent, type EventRow } from '@/lib/adminApi';

export default function MemberEventsPage() {
  const [events, setEvents] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [registeredIds, setRegisteredIds] = useState<Set<string>>(new Set());
  const [busyId, setBusyId] = useState<string | null>(null);
  const [notice, setNotice] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const list = await fetchPublicEvents();
      setEvents(list);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleRegister = async (event: EventRow) => {
    if (registeredIds.has(event.id)) return;
    setBusyId(event.id);
    setNotice('');
    const ok = await registerForEvent(event.id);
    setBusyId(null);
    if (ok) {
      setRegisteredIds((prev) => new Set(prev).add(event.id));
      setNotice(`You are now registered for "${event.title}".`);
    } else {
      setNotice('Registration failed. Please try again.');
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold text-[#022D5A]">Upcoming Events</h1>
        <p className="text-sm text-slate-600">
          Register for IES conferences, seminars and CPD workshops.
          {loading && ' Loading...'}
        </p>
      </div>

      {notice && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {notice}
        </div>
      )}

      {events.length === 0 ? (
        <EmptyState
          title={loading ? 'Loading...' : 'No events published yet'}
          description="Once IES publishes an event, it will appear here for you to register."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {events.map((event) => {
            const isRegistered = registeredIds.has(event.id);
            return (
              <Card key={event.id} padded>
                <div className="mb-2 flex items-center justify-between gap-2">
                  <Badge tone="primary">{event.type}</Badge>
                  <Badge tone="accent">CPD: {event.cpdHours}h</Badge>
                </div>
                <h3 className="text-sm font-semibold text-[#022D5A]">{event.title}</h3>
                <div className="mt-2 flex flex-col gap-1 text-xs text-slate-600">
                  <p>Date: {event.date}</p>
                  {event.location && <p>Location: {event.location}</p>}
                </div>
                {event.description && (
                  <p className="mt-2 line-clamp-3 text-xs text-slate-500">{event.description}</p>
                )}
                <div className="mt-3">
                  <button
                    type="button"
                    disabled={isRegistered || busyId === event.id}
                    onClick={() => handleRegister(event)}
                    className={
                      'inline-flex items-center rounded-lg px-4 py-1.5 text-xs font-semibold transition-colors ' +
                      (isRegistered
                        ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                        : 'bg-[#48C184] text-[#022D5A] hover:bg-[#3AA870] disabled:opacity-50')
                    }
                  >
                    {isRegistered ? '✓ Registered' : busyId === event.id ? 'Registering...' : 'Register'}
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
