'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { fetchAdminStats, type AdminStatsResponse } from '@/lib/adminApi';

const quickActions = [
  { title: 'Review Applications', body: 'Approve or reject membership submissions.', href: '/admin/applications' },
  { title: 'Manage Members', body: 'Search, edit and manage member accounts.', href: '/admin/members' },
  { title: 'Post News', body: 'Publish announcements to the public site.', href: '/admin/news' },
  { title: 'Schedule Events', body: 'Create IES events and workshops.', href: '/admin/events' },
];

export default function AdminOverviewPage() {
  const [data, setData] = useState<AdminStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAdminStats()
      .then((res) => {
        if (res) setData(res);
        else setError('Unable to load stats. Backend may be offline.');
      })
      .finally(() => setLoading(false));
  }, []);

  const stats = data?.stats;
  const recent = data?.recent ?? [];

  const cards = [
    { label: 'Total members', value: stats?.totalMembers ?? 0, hint: 'Approved and active', tone: 'primary' as const },
    { label: 'Pending applications', value: stats?.pendingApplications ?? 0, hint: 'Awaiting review', tone: 'warning' as const },
    { label: 'Approved this month', value: stats?.approvedThisMonth ?? 0, hint: 'This calendar month', tone: 'success' as const },
    { label: 'Organizations', value: stats?.organizations ?? 0, hint: 'Corporate partners', tone: 'muted' as const },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold text-[#022D5A]">Admin Overview</h1>
        <p className="text-sm text-slate-600">
          Institution-wide dashboard.
          {loading && ' Loading live data…'}
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Card key={c.label} padded>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">{c.label}</p>
            <p className="mt-2 text-3xl font-bold text-[#022D5A]">{c.value}</p>
            {c.hint && <Badge tone={c.tone} className="mt-2">{c.hint}</Badge>}
          </Card>
        ))}
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-slate-500">
          Quick actions
        </h2>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((a) => (
            <Card key={a.href} padded interactive>
              <Link href={a.href}>
                <h3 className="text-sm font-semibold text-[#022D5A]">{a.title}</h3>
                <p className="mt-1 text-xs text-slate-600">{a.body}</p>
                <p className="mt-3 text-xs font-semibold text-[#035CB3]">Open →</p>
              </Link>
            </Card>
          ))}
        </div>
      </div>

      <Card padded>
        <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-500">
          Recent activity
        </h2>
        {recent.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">
            No recent activity.
          </p>
        ) : (
          <ul className="mt-3 divide-y divide-slate-100">
            {recent.map((entry) => (
              <li key={entry.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                <div>
                  <span className="font-semibold text-[#022D5A]">{entry.applicant}</span>
                  <span className="text-slate-500"> - {entry.grade}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge tone={entry.status === 'APPROVED' ? 'success' : entry.status === 'PENDING' ? 'warning' : 'muted'}>
                    {entry.status}
                  </Badge>
                  <span className="text-xs text-slate-500">
                    {entry.when ? new Date(entry.when).toLocaleDateString() : ''}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
