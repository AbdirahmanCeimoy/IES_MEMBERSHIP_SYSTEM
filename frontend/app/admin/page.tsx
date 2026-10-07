'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchAdminStats, fetchAdminAnalytics, type AdminStatsResponse, type AdminAnalytics } from '@/lib/adminApi';

const GRADE_LABELS: Record<string, string> = {
  STUDENT: 'Student (SMIES)',
  GRADUATE: 'Graduate (GMIES)',
  ASSOCIATE: 'Associate (AMIES)',
  CORPORATE: 'Corporate (MIES)',
  FELLOW: 'Fellow (FMIES)',
};

const GRADE_ORDER = ['STUDENT', 'GRADUATE', 'ASSOCIATE', 'CORPORATE', 'FELLOW'] as const;

const GRADE_COLORS: Record<string, { bg: string; text: string; accent: string }> = {
  STUDENT:   { bg: 'bg-sky-50',     text: 'text-sky-700',     accent: 'bg-sky-500' },
  GRADUATE:  { bg: 'bg-indigo-50',  text: 'text-indigo-700',  accent: 'bg-indigo-500' },
  ASSOCIATE: { bg: 'bg-violet-50',  text: 'text-violet-700',  accent: 'bg-violet-500' },
  CORPORATE: { bg: 'bg-emerald-50', text: 'text-emerald-700', accent: 'bg-emerald-500' },
  FELLOW:    { bg: 'bg-amber-50',   text: 'text-amber-700',   accent: 'bg-amber-500' },
};

export default function AdminOverviewPage() {
  const [data, setData] = useState<AdminStatsResponse | null>(null);
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([fetchAdminStats(), fetchAdminAnalytics()])
      .then(([stats, analyticsRes]) => {
        if (stats) setData(stats);
        else setError('Unable to load stats. Backend may be offline.');
        if (analyticsRes) setAnalytics(analyticsRes);
      })
      .finally(() => setLoading(false));
  }, []);

  const stats = data?.stats;
  const grades = analytics?.grades ?? {};
  const totalGraded = Object.values(grades).reduce((s, n) => s + (n ?? 0), 0);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-bold text-[#022D5A]">Admin Overview</h1>
        <p className="mt-0.5 text-sm text-slate-500">
          Institution-wide dashboard.{loading && ' Loading live data…'}
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {error}
        </div>
      )}

      {/* 3 compact stat cards */}
      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard
          icon={<svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="7" cy="8" r="3" /><circle cx="14" cy="8" r="2.5" /><path d="M2 17c0-2.8 2.2-5 5-5s5 2.2 5 5M12 17c0-2 1.5-4 4-4s3 1 3 3" strokeLinecap="round" /></svg>}
          value={stats?.totalMembers ?? 0}
          label="Total Members"
          hint="Approved & active"
          tone="primary"
        />
        <StatCard
          icon={<svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="10" cy="10" r="8" /><path d="M10 6v4l3 2" strokeLinecap="round" /></svg>}
          value={stats?.pendingApplications ?? 0}
          label="Pending Applications"
          hint="Awaiting review"
          tone="warning"
        />
        <StatCard
          icon={<svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 10l5 5 7-7" strokeLinecap="round" strokeLinejoin="round" /></svg>}
          value={stats?.approvedThisMonth ?? 0}
          label="Approved This Month"
          hint="Calendar month"
          tone="success"
        />
      </div>

      {/* Pipeline + Grade distribution */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Application Pipeline */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#022D5A]">Application Pipeline</h2>
            <Link href="/admin/applications" className="text-[11px] font-semibold text-[#035CB3] hover:underline">
              View all ›
            </Link>
          </div>
          <div className="mt-4 flex flex-col gap-3">
            <PipelineRow
              label="Submitted"
              count={(stats?.pendingApplications ?? 0) + (stats?.inReviewApplications ?? 0)}
              total={(stats?.pendingApplications ?? 0) + (stats?.inReviewApplications ?? 0) + (stats?.approvedApplications ?? 0) + (stats?.rejectedApplications ?? 0)}
              color="bg-[#035CB3]"
              dot="bg-[#035CB3]"
            />
            <PipelineRow
              label="In Review"
              count={stats?.inReviewApplications ?? 0}
              total={(stats?.pendingApplications ?? 0) + (stats?.inReviewApplications ?? 0) + (stats?.approvedApplications ?? 0) + (stats?.rejectedApplications ?? 0)}
              color="bg-amber-500"
              dot="bg-amber-500"
            />
            <PipelineRow
              label="Approved"
              count={stats?.approvedApplications ?? 0}
              total={(stats?.pendingApplications ?? 0) + (stats?.inReviewApplications ?? 0) + (stats?.approvedApplications ?? 0) + (stats?.rejectedApplications ?? 0)}
              color="bg-[#48C184]"
              dot="bg-[#48C184]"
            />
            <PipelineRow
              label="Rejected"
              count={stats?.rejectedApplications ?? 0}
              total={(stats?.pendingApplications ?? 0) + (stats?.inReviewApplications ?? 0) + (stats?.approvedApplications ?? 0) + (stats?.rejectedApplications ?? 0)}
              color="bg-rose-500"
              dot="bg-rose-500"
            />
          </div>
        </div>

        {/* Member Grades Distribution */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#022D5A]">Members by Grade</h2>
            <Link href="/admin/members" className="text-[11px] font-semibold text-[#035CB3] hover:underline">
              View members ›
            </Link>
          </div>
          <div className="mt-4 flex flex-col gap-2">
            {GRADE_ORDER.map((g) => {
              const count = grades[g] ?? 0;
              const pct = totalGraded > 0 ? (count / totalGraded) * 100 : 0;
              const colors = GRADE_COLORS[g];
              return (
                <div key={g} className="flex items-center gap-3">
                  <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${colors.bg}`}>
                    <span className={`h-2 w-2 rounded-full ${colors.accent}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-slate-700">{GRADE_LABELS[g]}</span>
                      <span className="font-mono font-bold text-[#022D5A]">{count}</span>
                    </div>
                    <div className="mt-1 h-1 overflow-hidden rounded-full bg-slate-100">
                      <div className={`h-1 ${colors.accent}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
            {totalGraded === 0 && !loading && (
              <p className="mt-2 text-center text-xs text-slate-400">No grade data yet.</p>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}

type Tone = 'primary' | 'warning' | 'success' | 'muted';

function StatCard({ icon, value, label, hint, tone }: {
  icon: React.ReactNode;
  value: number;
  label: string;
  hint: string;
  tone: Tone;
}) {
  const toneClasses: Record<Tone, string> = {
    primary: 'bg-[#035CB3]/10 text-[#035CB3]',
    warning: 'bg-amber-100 text-amber-600',
    success: 'bg-[#48C184]/15 text-[#48C184]',
    muted:   'bg-slate-100 text-slate-500',
  };
  const hintClasses: Record<Tone, string> = {
    primary: 'bg-[#035CB3]/10 text-[#035CB3]',
    warning: 'bg-amber-100 text-amber-700',
    success: 'bg-[#48C184]/15 text-[#48C184]',
    muted:   'bg-slate-100 text-slate-500',
  };
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${toneClasses[tone]}`}>
        {icon}
      </div>
      <p className="mt-3 text-2xl font-bold text-[#022D5A]">{value}</p>
      <p className="mt-0.5 text-xs text-slate-500">{label}</p>
      <span className={`mt-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${hintClasses[tone]}`}>
        {hint}
      </span>
    </div>
  );
}

function PipelineRow({ label, count, total, color, dot }: {
  label: string; count: number; total: number; color: string; dot: string;
}) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <span className={`h-2 w-2 shrink-0 rounded-full ${dot}`} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-semibold text-slate-700">{label}</span>
          <span className="font-mono font-bold text-[#022D5A]">{count}</span>
        </div>
        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-100">
          <div className={`h-1.5 ${color}`} style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  );
}

