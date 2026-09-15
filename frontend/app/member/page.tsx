'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getStoredUser } from '@/lib/authSession';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface StoredUser {
  fullName?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  role?: string;
  grade?: string;
  gradeLabel?: string;
  discipline?: string;
}

const quickLinks = [
  { title: 'Application Status', body: 'Track your membership application.', href: '/member/application' },
  { title: 'Update Profile', body: 'Keep your contact and profile up to date.', href: '/member/profile' },
  { title: 'CPD Activities', body: 'Log CPD hours and view your record.', href: '/member/cpd' },
  { title: 'Upcoming Events', body: 'Browse and register for IES events.', href: '/member/events' },
];

export default function MemberOverviewPage() {
  const [user] = useState<StoredUser | null>(() =>
    typeof window === 'undefined' ? null : getStoredUser<StoredUser>() ?? {},
  );

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold text-[#082B55]">Dashboard</h1>
        <p className="text-sm text-slate-600">
          Welcome{user?.fullName ? `, ${user.fullName}` : ''}. Here&apos;s an overview of your membership.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card padded>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Membership status</p>
          <p className="mt-2 text-lg font-semibold text-[#082B55]">Under Review</p>
          <Badge tone="warning" className="mt-2">Pending IES review</Badge>
        </Card>
        <Card padded>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Applied grade</p>
          <p className="mt-2 text-lg font-semibold text-[#082B55]">
            {user?.gradeLabel ?? '-'}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {user?.discipline ?? 'Discipline not set'}
          </p>
        </Card>
        <Card padded>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">CPD hours (2026)</p>
          <p className="mt-2 text-lg font-semibold text-[#082B55]">0</p>
          <p className="mt-1 text-xs text-slate-500">Log your first activity</p>
        </Card>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-slate-500">Quick links</h2>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map((link) => (
            <Card key={link.href} padded interactive>
              <Link href={link.href}>
                <h3 className="text-sm font-semibold text-[#082B55]">{link.title}</h3>
                <p className="mt-1 text-xs text-slate-600">{link.body}</p>
                <p className="mt-3 text-xs font-semibold text-[#0047AB]">Open ›</p>
              </Link>
            </Card>
          ))}
        </div>
      </div>

      <Card padded>
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Account</p>
        <div className="mt-3 grid gap-2 text-sm text-slate-700 md:grid-cols-2">
          <div><span className="font-semibold text-[#082B55]">Username:</span> {user?.username ?? '-'}</div>
          <div><span className="font-semibold text-[#082B55]">Email:</span> {user?.email ?? '-'}</div>
          <div><span className="font-semibold text-[#082B55]">Role:</span> {user?.role ?? 'MEMBER'}</div>
        </div>
      </Card>
    </div>
  );
}
