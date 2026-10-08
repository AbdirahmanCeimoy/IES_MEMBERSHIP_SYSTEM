'use client';

import { useEffect, useMemo, useState } from 'react';
import { fetchUsers, fetchAdminAnalytics, fetchAdminApplications, type AdminUserRow, type AdminAnalytics, type AdminApplicationRow } from '@/lib/adminApi';

const GRADE_LABELS: Record<string, string> = {
  STUDENT: 'Student Member (SMIES)',
  GRADUATE: 'Graduate Member (GMIES)',
  ASSOCIATE: 'Associate Member (AMIES)',
  CORPORATE: 'Corporate Member (MIES)',
  FELLOW: 'Fellow Member (FMIES)',
};

const GRADE_ORDER = ['STUDENT', 'GRADUATE', 'ASSOCIATE', 'CORPORATE', 'FELLOW'] as const;
type GradeKey = typeof GRADE_ORDER[number];

const GRADE_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  STUDENT:   { bg: 'bg-sky-50',     text: 'text-sky-700',     dot: 'bg-sky-500' },
  GRADUATE:  { bg: 'bg-indigo-50',  text: 'text-indigo-700',  dot: 'bg-indigo-500' },
  ASSOCIATE: { bg: 'bg-violet-50',  text: 'text-violet-700',  dot: 'bg-violet-500' },
  CORPORATE: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  FELLOW:    { bg: 'bg-amber-50',   text: 'text-amber-700',   dot: 'bg-amber-500' },
};

interface MemberWithGrade extends AdminUserRow {
  grade?: string;
  applicationStatus?: 'approved' | 'pending' | 'rejected' | 'review' | 'none';
}

export default function AdminMembersPage() {
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [applications, setApplications] = useState<AdminApplicationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [gradeFilter, setGradeFilter] = useState<'all' | GradeKey>('all');

  useEffect(() => {
    Promise.all([
      fetchUsers(),
      fetchAdminAnalytics(),
      fetchAdminApplications(),
    ])
      .then(([userList, analyticsRes, apps]) => {
        setUsers(userList.filter((u) => u.role === 'MEMBER'));
        setAnalytics(analyticsRes);
        setApplications(apps);
      })
      .finally(() => setLoading(false));
  }, []);

  // Merge users with their application grade/status
  const members: MemberWithGrade[] = useMemo(() => {
    const appByEmail = new Map<string, AdminApplicationRow>();
    for (const app of applications) {
      if (app.email) appByEmail.set(app.email.toLowerCase(), app);
    }
    return users.map((u) => {
      const app = u.email ? appByEmail.get(u.email.toLowerCase()) : undefined;
      return {
        ...u,
        grade: app?.grade?.toUpperCase(),
        applicationStatus: app?.status ?? 'none',
      };
    });
  }, [users, applications]);

  const gradeCounts = useMemo(() => {
    const counts: Record<string, number> = { all: members.length };
    for (const g of GRADE_ORDER) counts[g] = 0;
    for (const m of members) {
      if (m.grade && m.grade in counts) counts[m.grade]++;
    }
    return counts;
  }, [members]);

  const filtered = useMemo(() => {
    let list = members;
    if (gradeFilter !== 'all') {
      list = list.filter((m) => m.grade === gradeFilter);
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (u) =>
          (u.fullName ?? '').toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q) ||
          u.username?.toLowerCase().includes(q) ||
          u.id?.toLowerCase().includes(q),
      );
    }
    return list;
  }, [members, gradeFilter, search]);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-bold text-[#022D5A]">Members</h1>
        <p className="mt-0.5 text-sm text-slate-500">
          Approved and active IES members. {loading && 'Loading...'}
        </p>
      </div>

      {/* Grade distribution overview */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {GRADE_ORDER.map((g) => {
          const c = GRADE_COLORS[g];
          const count = analytics?.grades?.[g] ?? gradeCounts[g] ?? 0;
          return (
            <button
              key={g}
              type="button"
              onClick={() => setGradeFilter(gradeFilter === g ? 'all' : g)}
              className={
                'rounded-xl border bg-white p-4 text-left shadow-sm transition-all hover:shadow-md ' +
                (gradeFilter === g ? 'border-[#035CB3] ring-2 ring-[#035CB3]/20' : 'border-slate-200')
              }
            >
              <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${c.bg}`}>
                <span className={`h-2 w-2 rounded-full ${c.dot}`} />
              </div>
              <p className="mt-3 text-xl font-bold text-[#022D5A]">{count}</p>
              <p className={`mt-0.5 text-[11px] font-semibold ${c.text}`}>{GRADE_LABELS[g]}</p>
            </button>
          );
        })}
      </div>

      {/* Filter tabs + search */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-1.5">
            <FilterPill
              label="All"
              count={gradeCounts.all}
              active={gradeFilter === 'all'}
              onClick={() => setGradeFilter('all')}
            />
            {GRADE_ORDER.map((g) => (
              <FilterPill
                key={g}
                label={g.charAt(0) + g.slice(1).toLowerCase()}
                count={gradeCounts[g] ?? 0}
                active={gradeFilter === g}
                onClick={() => setGradeFilter(g)}
              />
            ))}
          </div>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, username..."
            className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm focus:border-[#035CB3] focus:outline-none focus:ring-1 focus:ring-[#035CB3] sm:w-64"
          />
        </div>
      </div>

      {/* Members table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#94a3b8" strokeWidth="1.5"><circle cx="7" cy="8" r="3" /><circle cx="14" cy="8" r="2.5" /><path d="M2 17c0-2.8 2.2-5 5-5s5 2.2 5 5M12 17c0-2 1.5-4 4-4s3 1 3 3" strokeLinecap="round" /></svg>
            </div>
            <h3 className="mt-3 text-sm font-semibold text-[#022D5A]">
              {loading ? 'Loading...' : 'No members found'}
            </h3>
            <p className="mt-1 max-w-sm text-xs text-slate-500">
              Approved applicants appear here as members with their registration numbers and grades.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-left text-[10px] uppercase tracking-widest text-slate-500">
                  <th className="px-5 py-3">Member</th>
                  <th className="px-5 py-3">Grade</th>
                  <th className="px-5 py-3">Member ID</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((m) => {
                  const c = m.grade ? GRADE_COLORS[m.grade] : null;
                  return (
                    <tr key={m.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#035CB3] text-xs font-bold text-white">
                            {(m.fullName?.[0] ?? m.username?.[0] ?? 'M').toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-[#022D5A]">{m.fullName || m.username}</p>
                            <p className="text-xs text-slate-500">@{m.username}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        {m.grade && c ? (
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold ${c.bg} ${c.text}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
                            {GRADE_LABELS[m.grade] ?? m.grade}
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400">-</span>
                        )}
                      </td>
                      <td className="px-5 py-3 font-mono text-xs text-slate-600">{m.id.slice(0, 8)}</td>
                      <td className="px-5 py-3 text-slate-600">{m.email}</td>
                      <td className="px-5 py-3">
                        <AppStatusBadge status={m.applicationStatus} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function FilterPill({ label, count, active, onClick }: {
  label: string; count: number; active: boolean; onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-colors ' +
        (active
          ? 'border-[#035CB3] bg-[#035CB3] text-white'
          : 'border-slate-200 text-slate-600 hover:border-[#035CB3] hover:text-[#035CB3]')
      }
    >
      {label}
      <span className={
        'inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold ' +
        (active ? 'bg-white/25' : 'bg-slate-100 text-slate-600')
      }>
        {count}
      </span>
    </button>
  );
}

function AppStatusBadge({ status }: { status?: string }) {
  if (status === 'approved') return <span className="rounded-full bg-[#48C184]/15 px-2.5 py-1 text-[10px] font-bold uppercase text-[#48C184]">Approved</span>;
  if (status === 'rejected') return <span className="rounded-full bg-rose-100 px-2.5 py-1 text-[10px] font-bold uppercase text-rose-600">Rejected</span>;
  if (status === 'pending')  return <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-bold uppercase text-amber-700">Pending</span>;
  if (status === 'review')   return <span className="rounded-full bg-[#035CB3]/10 px-2.5 py-1 text-[10px] font-bold uppercase text-[#035CB3]">In Review</span>;
  return <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase text-slate-500">No Application</span>;
}
