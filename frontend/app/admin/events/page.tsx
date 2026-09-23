'use client';

import { useCallback, useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import {
  createEvent,
  fetchAdminEvents,
  type EventRow,
} from '@/lib/adminApi';

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    type: 'WORKSHOP',
    date: '',
    location: '',
    cpdHours: '',
    description: '',
    notifyMembers: true,
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const list = await fetchAdminEvents();
      setEvents(list);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handlePublish = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setNotice('');
    if (!form.title.trim() || !form.date) {
      setError('Title and date are required.');
      return;
    }
    setSubmitting(true);
    const result = await createEvent({
      title: form.title.trim(),
      type: form.type,
      date: form.date,
      location: form.location || undefined,
      cpdHours: Number(form.cpdHours || 0),
      description: form.description || undefined,
      notifyMembers: form.notifyMembers,
    });
    setSubmitting(false);
    if (result.ok) {
      setShowEditor(false);
      setForm({ title: '', type: 'WORKSHOP', date: '', location: '', cpdHours: '', description: '', notifyMembers: true });
      setNotice(
        result.notified
          ? `Event published. Notified ${result.notified} member${result.notified === 1 ? '' : 's'} by email.`
          : 'Event published.',
      );
      await load();
    } else {
      setError('Publish failed. Check backend connection.');
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#022D5A]">Events</h1>
          <p className="text-sm text-slate-600">
            Create IES events, workshops and conferences.
            {loading && ' Loading...'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => { setShowEditor(true); setNotice(''); }}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#48C184] px-4 py-2 text-sm font-semibold text-[#022D5A] hover:bg-[#3AA870]"
        >
          + New event
        </button>
      </div>

      {notice && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {notice}
        </div>
      )}

      <Card padded>
        {events.length === 0 ? (
          <EmptyState
            title={loading ? 'Loading...' : 'No events yet'}
            description="Publish an IES event and it will appear on /professional-development/events for members to register."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-widest text-slate-500">
                  <th className="py-2 pr-4">Event</th>
                  <th className="py-2 pr-4">Type</th>
                  <th className="py-2 pr-4">Date</th>
                  <th className="py-2 pr-4">Location</th>
                  <th className="py-2 pr-4">Registered</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {events.map((e) => (
                  <tr key={e.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 pr-4 font-semibold text-[#022D5A]">{e.title}</td>
                    <td className="py-3 pr-4"><Badge tone="primary">{e.type}</Badge></td>
                    <td className="py-3 pr-4 text-slate-500">{e.date}</td>
                    <td className="py-3 pr-4 text-slate-700">{e.location ?? '-'}</td>
                    <td className="py-3 pr-4 text-slate-700">{e.registered ?? 0}</td>
                    <td className="py-3">
                      <Badge tone={e.status === 'PUBLISHED' ? 'success' : 'muted'}>
                        {e.status?.toLowerCase()}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {showEditor && (
        <>
          <div className="fixed inset-0 z-40 bg-slate-900/40" onClick={() => setShowEditor(false)} />
          <div className="fixed left-1/2 top-1/2 z-50 w-[min(560px,90vw)] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h2 className="text-base font-bold text-[#022D5A]">New event</h2>
              <button onClick={() => setShowEditor(false)} className="text-slate-400 hover:text-slate-700">
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 5l10 10M15 5l-10 10" strokeLinecap="round" /></svg>
              </button>
            </div>
            <form onSubmit={handlePublish} className="flex max-h-[80vh] flex-col gap-3 overflow-y-auto p-5">
              <label className="flex flex-col gap-1 text-xs font-semibold text-[#022D5A]">
                Event title
                <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal focus:border-[#035CB3] focus:outline-none focus:ring-1 focus:ring-[#035CB3]" />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col gap-1 text-xs font-semibold text-[#022D5A]">
                  Type
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal focus:border-[#035CB3] focus:outline-none focus:ring-1 focus:ring-[#035CB3]">
                    <option value="WORKSHOP">Workshop</option>
                    <option value="SEMINAR">Seminar</option>
                    <option value="CONFERENCE">Conference</option>
                    <option value="AGM">AGM</option>
                    <option value="TRAINING">Training</option>
                  </select>
                </label>
                <label className="flex flex-col gap-1 text-xs font-semibold text-[#022D5A]">
                  Date
                  <input type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal focus:border-[#035CB3] focus:outline-none focus:ring-1 focus:ring-[#035CB3]" />
                </label>
              </div>
              <label className="flex flex-col gap-1 text-xs font-semibold text-[#022D5A]">
                Location
                <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal focus:border-[#035CB3] focus:outline-none focus:ring-1 focus:ring-[#035CB3]" />
              </label>
              <label className="flex flex-col gap-1 text-xs font-semibold text-[#022D5A]">
                CPD hours
                <input type="number" min="0" step="0.5" value={form.cpdHours} onChange={(e) => setForm({ ...form, cpdHours: e.target.value })} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal focus:border-[#035CB3] focus:outline-none focus:ring-1 focus:ring-[#035CB3]" />
              </label>
              <label className="flex flex-col gap-1 text-xs font-semibold text-[#022D5A]">
                Description
                <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal focus:border-[#035CB3] focus:outline-none focus:ring-1 focus:ring-[#035CB3]" />
              </label>
              <label className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                <input
                  type="checkbox"
                  checked={form.notifyMembers}
                  onChange={(e) => setForm({ ...form, notifyMembers: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-300 text-[#035CB3]"
                />
                <span className="text-xs text-slate-700">
                  <span className="font-semibold text-[#022D5A]">Notify all members by email</span> when this event is published
                </span>
              </label>
              {error && (
                <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{error}</div>
              )}
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowEditor(false)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-[#035CB3] hover:text-[#035CB3]">Cancel</button>
                <button type="submit" disabled={submitting} className="rounded-lg bg-[#48C184] px-4 py-2 text-sm font-semibold text-[#022D5A] hover:bg-[#3AA870] disabled:opacity-50">
                  {submitting ? 'Publishing...' : 'Publish event'}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
