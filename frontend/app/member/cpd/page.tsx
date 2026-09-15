'use client';

import { useMemo, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';

interface CpdEntry {
  id: string;
  activity: string;
  category: string;
  date: string;
  hours: number;
  status: 'approved' | 'pending';
}

const initialEntries: CpdEntry[] = [];

export default function CpdPage() {
  const [entries, setEntries] = useState<CpdEntry[]>(initialEntries);
  const [form, setForm] = useState({ activity: '', category: 'Workshop', date: '', hours: '' });

  const totals = useMemo(() => {
    const approved = entries.filter((e) => e.status === 'approved').reduce((sum, e) => sum + e.hours, 0);
    const pending = entries.filter((e) => e.status === 'pending').reduce((sum, e) => sum + e.hours, 0);
    return { approved, pending, target: 30 };
  }, [entries]);

  const progressPct = Math.min(100, Math.round((totals.approved / totals.target) * 100));

  const handleAdd = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.activity.trim() || !form.date || !form.hours) return;
    const hours = Number(form.hours);
    if (!Number.isFinite(hours) || hours <= 0) return;
    setEntries((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        activity: form.activity.trim(),
        category: form.category,
        date: form.date,
        hours,
        status: 'pending',
      },
    ]);
    setForm({ activity: '', category: 'Workshop', date: '', hours: '' });
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold text-[#082B55]">CPD Activities</h1>
        <p className="text-sm text-slate-600">Log your continuing professional development and track your annual target.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card padded>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Approved hours</p>
          <p className="mt-2 text-2xl font-bold text-[#082B55]">{totals.approved}</p>
        </Card>
        <Card padded>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Pending review</p>
          <p className="mt-2 text-2xl font-bold text-[#082B55]">{totals.pending}</p>
        </Card>
        <Card padded>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Annual target</p>
          <p className="mt-2 text-2xl font-bold text-[#082B55]">{totals.target}</p>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full bg-[#66FF00] transition-all"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <p className="mt-1 text-[11px] text-slate-500">{progressPct}% complete</p>
        </Card>
      </div>

      <Card padded>
        <h2 className="text-sm font-semibold text-[#082B55]">Log a new CPD activity</h2>
        <form onSubmit={handleAdd} className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <label className="flex flex-col gap-1 text-xs font-semibold text-[#082B55] lg:col-span-2">
            Activity
            <input
              type="text"
              value={form.activity}
              onChange={(e) => setForm((prev) => ({ ...prev, activity: e.target.value }))}
              placeholder="e.g. IES CPD workshop on structural design"
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal focus:border-[#0047AB] focus:outline-none focus:ring-1 focus:ring-[#0047AB]"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs font-semibold text-[#082B55]">
            Category
            <select
              value={form.category}
              onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal focus:border-[#0047AB] focus:outline-none focus:ring-1 focus:ring-[#0047AB]"
            >
              <option>Workshop</option>
              <option>Conference</option>
              <option>Seminar</option>
              <option>Training</option>
              <option>Self-study</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs font-semibold text-[#082B55]">
            Date
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal focus:border-[#0047AB] focus:outline-none focus:ring-1 focus:ring-[#0047AB]"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs font-semibold text-[#082B55]">
            Hours
            <input
              type="number"
              min="0"
              step="0.5"
              value={form.hours}
              onChange={(e) => setForm((prev) => ({ ...prev, hours: e.target.value }))}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal focus:border-[#0047AB] focus:outline-none focus:ring-1 focus:ring-[#0047AB]"
            />
          </label>
          <div className="lg:col-span-5">
            <button
              type="submit"
              className="inline-flex items-center rounded-lg bg-[#66FF00] px-5 py-2 text-sm font-semibold text-[#082B55] transition-colors hover:bg-[#5be000]"
            >
              Add activity
            </button>
          </div>
        </form>
      </Card>

      <Card padded>
        <h2 className="text-sm font-semibold text-[#082B55]">Activity log</h2>
        {entries.length === 0 ? (
          <div className="mt-3">
            <EmptyState
              title="No CPD activities logged yet"
              description="Use the form above to add your first activity. IES will review pending entries and count approved hours toward your annual target."
            />
          </div>
        ) : (
          <ul className="mt-3 divide-y divide-slate-100">
            {entries.map((entry) => (
              <li key={entry.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                <div>
                  <p className="text-sm font-semibold text-[#082B55]">{entry.activity}</p>
                  <p className="text-xs text-slate-500">{entry.category} · {entry.date}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-[#082B55]">{entry.hours}h</span>
                  <Badge tone={entry.status === 'approved' ? 'success' : 'warning'}>
                    {entry.status}
                  </Badge>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
