'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card } from '@/components/ui/Card';
import {
  buildReportUrl,
  fetchAdminAnalytics,
  fetchAdminStats,
  type AdminAnalytics,
  type AdminStatsResponse,
} from '@/lib/adminApi';
import { getAuthToken } from '@/lib/authSession';

type Period = 'lastMonth' | 'last6Months' | 'lastYear' | 'allTime';

const PERIOD_LABELS: Record<Period, string> = {
  lastMonth: 'Last month',
  last6Months: 'Last 6 months',
  lastYear: 'Last year',
  allTime: 'All time',
};

interface Report {
  title: string;
  description: string;
  format: 'CSV' | 'PDF' | 'Excel';
  key: string;
}

const reports: Report[] = [
  { key: 'members', title: 'Members export', description: 'All approved members with grade, discipline, contact.', format: 'CSV' },
  { key: 'applications', title: 'Applications report', description: 'All applications received (pending/approved/rejected) with dates.', format: 'CSV' },
  { key: 'cpd', title: 'CPD activity summary', description: 'CPD hours logged per member for the current year.', format: 'Excel' },
  { key: 'events', title: 'Events attendance', description: 'Event registrations and attendance figures.', format: 'CSV' },
  { key: 'financials', title: 'Financial summary', description: 'Application fees collected by grade and month.', format: 'PDF' },
  { key: 'discipline', title: 'Discipline distribution', description: 'Members grouped by engineering discipline.', format: 'CSV' },
];

export default function AdminReportsPage() {
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [stats, setStats] = useState<AdminStatsResponse | null>(null);
  const [period, setPeriod] = useState<Period>('lastMonth');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchAdminAnalytics(), fetchAdminStats()])
      .then(([a, s]) => {
        setAnalytics(a);
        setStats(s);
      })
      .finally(() => setLoading(false));
  }, []);

  const genderTotals = useMemo(() => {
    if (!analytics) return { total: 0, male: 0, female: 0 };
    const g = analytics.gender;
    const total = g.MALE + g.FEMALE;
    return { total, male: g.MALE, female: g.FEMALE };
  }, [analytics]);

  const monthly = stats?.monthly ?? [];
  const maxApps = Math.max(1, ...monthly.map((m) => m.applications));

  const handleDownload = async (key: string) => {
    const token = getAuthToken();
    if (!token) return;
    const res = await fetch(buildReportUrl(key), {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      alert('Download failed. Backend may be offline.');
      return;
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ies-${key}-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const periodTotal = analytics?.periods[period] ?? 0;
  const periodApprovals = analytics?.approvals[period] ?? 0;

  const genderPct = (n: number) =>
    genderTotals.total ? Math.round((n / genderTotals.total) * 100) : 0;

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold text-[#022D5A]">Reports & Analytics</h1>
        <p className="text-sm text-slate-600">
          Registration insights, gender split, and downloadable exports.
          {loading && ' Loading live data…'}
        </p>
      </div>

      {/* Period selector */}
      <div className="flex flex-wrap gap-1.5">
        {(Object.keys(PERIOD_LABELS) as Period[]).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPeriod(p)}
            className={
              'inline-flex items-center rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors ' +
              (period === p
                ? 'border-[#035CB3] bg-[#035CB3] text-white'
                : 'border-slate-200 bg-white text-slate-600 hover:border-[#035CB3] hover:text-[#035CB3]')
            }
          >
            {PERIOD_LABELS[p]}
          </button>
        ))}
      </div>

      {/* Period totals — 2 big cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card padded className="relative overflow-hidden">
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[#035CB3]/5" />
          <div className="relative">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
              Registrations · {PERIOD_LABELS[period]}
            </p>
            <p className="mt-3 text-4xl font-bold text-[#022D5A]">{periodTotal}</p>
            <p className="mt-1 text-xs text-slate-500">Total membership applications submitted</p>
          </div>
        </Card>
        <Card padded className="relative overflow-hidden">
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[#48C184]/10" />
          <div className="relative">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
              Approvals · {PERIOD_LABELS[period]}
            </p>
            <p className="mt-3 text-4xl font-bold text-[#022D5A]">{periodApprovals}</p>
            <p className="mt-1 text-xs text-slate-500">Applications approved in this period</p>
          </div>
        </Card>
      </div>

      {/* Gender breakdown */}
      <Card padded>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-500">
            Gender
          </h2>
          <span className="text-xs text-slate-500">
            Total: <span className="font-semibold text-[#022D5A]">{genderTotals.total}</span>
          </span>
        </div>

        {/* Segmented bar */}
        <div className="mb-4 flex h-3 w-full overflow-hidden rounded-full bg-slate-100">
          {genderTotals.total > 0 ? (
            <>
              <div className="bg-[#035CB3]" style={{ width: `${genderPct(genderTotals.male)}%` }} />
              <div className="bg-[#48C184]" style={{ width: `${genderPct(genderTotals.female)}%` }} />
            </>
          ) : null}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-slate-100 p-3">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#035CB3]" />
              <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">Male</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-[#022D5A]">{genderTotals.male}</p>
            <p className="text-[11px] text-slate-500">{genderPct(genderTotals.male)}% of total</p>
          </div>
          <div className="rounded-lg border border-slate-100 p-3">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#48C184]" />
              <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">Female</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-[#022D5A]">{genderTotals.female}</p>
            <p className="text-[11px] text-slate-500">{genderPct(genderTotals.female)}% of total</p>
          </div>
        </div>
      </Card>

      {/* Monthly trend */}
      <Card padded>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-slate-500">
          Monthly applications
        </h2>
        <div className="flex h-40 items-end gap-3">
          {monthly.length === 0 ? (
            <p className="mx-auto self-center text-xs text-slate-500">No data yet.</p>
          ) : (
            monthly.map((m) => {
              const pct = Math.max(4, Math.round((m.applications / maxApps) * 100));
              return (
                <div key={`${m.year}-${m.month}`} className="flex flex-1 flex-col items-center gap-1">
                  <div className="flex h-full w-full items-end">
                    <div
                      className="mx-auto w-full max-w-8 rounded-t bg-gradient-to-t from-[#035CB3] to-[#48C184] transition-all"
                      style={{ height: `${pct}%` }}
                      title={`${m.applications} applications`}
                    />
                  </div>
                  <p className="text-[10px] font-semibold text-slate-500">{m.month}</p>
                  <p className="text-xs font-bold text-[#022D5A]">{m.applications}</p>
                </div>
              );
            })
          )}
        </div>
      </Card>

      {/* Grade distribution */}
      {analytics?.grades && Object.keys(analytics.grades).length > 0 && (
        <Card padded>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-slate-500">
            By membership grade
          </h2>
          <div className="grid gap-2">
            {Object.entries(analytics.grades).map(([grade, count]) => {
              const total = Object.values(analytics.grades).reduce((a, b) => a + b, 0) || 1;
              const pct = Math.round((count / total) * 100);
              return (
                <div key={grade} className="flex items-center gap-3">
                  <span className="w-28 text-xs font-semibold text-[#022D5A]">{grade}</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full bg-[#035CB3]" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="w-16 text-right text-xs font-mono text-slate-600">{count} · {pct}%</span>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Exports grid */}
      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-slate-500">
          Available exports
        </h2>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {reports.map((r) => (
            <Card key={r.key} padded>
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-[#022D5A]">{r.title}</h3>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                  {r.format}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-600">{r.description}</p>
              <button
                type="button"
                onClick={() => handleDownload(r.key)}
                className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-[#035CB3] hover:text-[#035CB3]"
              >
                <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10 3v10M6 9l4 4 4-4M4 17h12" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Download
              </button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
