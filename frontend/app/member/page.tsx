'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { buildAuthHeader, getAuthToken, getStoredUser } from '@/lib/authSession';
import { apiRequest, API_BASE_URL } from '@/lib/apiClient';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface StoredUser {
  fullName?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  phone?: string;
  nationalId?: string;
  role?: string;
  grade?: string;
  gradeLabel?: string;
  discipline?: string;
  title?: string;
  gender?: string;
  dateOfBirth?: string;
  city?: string;
  nationality?: string;
}

interface MembershipDocument {
  id?: string;
  type?: string;
  fileName?: string;
}

interface MembershipApplication {
  id?: string;
  membershipGrade?: string;
  stage?: string;
  decision?: string;
  registrationNumber?: string | null;
  certificateNumber?: string | null;
  createdAt?: string;
  documents?: MembershipDocument[];
}

const quickLinks = [
  { title: 'Upload Documents', body: 'Submit the required documents for your application.', href: '/member/documents' },
  { title: 'Application Status', body: 'Track your membership application.', href: '/member/application' },
  { title: 'Update Profile', body: 'Keep your contact and profile up to date.', href: '/member/profile' },
  { title: 'CPD Activities', body: 'Log CPD hours and view your record.', href: '/member/cpd' },
  { title: 'Upcoming Events', body: 'Browse and register for IES events.', href: '/member/events' },
];

/**
 * Profile completion in 30% steps:
 *   Step 1 — Profile filled       : 30%
 *   Step 2 — Documents uploaded   : 30%
 *   Step 3 — Payment made         : 30%
 *   Step 4 — Approved by IES      : 10%
 */
const isProfileFilled = (user: StoredUser | null): boolean => {
  if (!user) return false;
  const required = [
    user.title, user.firstName, user.lastName, user.gender, user.dateOfBirth,
    user.discipline, user.grade, user.email, user.phone, user.nationalId,
  ];
  return required.every((v) => v && String(v).trim() !== '');
};

const calculateProfileCompletion = (
  user: StoredUser | null,
  applications: MembershipApplication[] = [],
): number => {
  let pct = 0;
  // Step 1: Profile fields filled (30%)
  if (isProfileFilled(user)) pct += 30;
  const latest = applications[0];
  // Step 2: Documents uploaded (30%) - at least one document attached
  if (latest && (latest.documents?.length ?? 0) > 0) pct += 30;
  // Step 3: Payment / Application submitted (30%) - application exists means fees process was accepted
  if (latest) pct += 30;
  // Step 4: Approved by IES (10%)
  if (latest?.decision === 'APPROVED') pct += 10;
  return pct;
};

const formatDate = (iso?: string): string => {
  if (!iso) return '-';
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return iso;
  }
};

export default function MemberOverviewPage() {
  const [user] = useState<StoredUser | null>(() =>
    typeof window === 'undefined' ? null : getStoredUser<StoredUser>() ?? {},
  );
  const [applications, setApplications] = useState<MembershipApplication[]>([]);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) return;
    apiRequest<{ items?: MembershipApplication[] } | MembershipApplication[]>(
      '/memberships/my-applications',
      { headers: buildAuthHeader(token) },
    ).then((res) => {
      if (!res.ok || !res.data) return;
      const items = Array.isArray(res.data) ? res.data : (res.data.items ?? []);
      setApplications(items);
    }).catch(() => {});
  }, []);

  const profilePct = calculateProfileCompletion(user, applications);
  const isComplete = profilePct === 100;
  const displayName = user?.fullName || [user?.title, user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.username || 'Member';
  const latestApp = applications[0];
  const registrationNo = latestApp?.registrationNumber ?? '-';
  const category = user?.gradeLabel ?? user?.grade ?? '-';
  const decision = latestApp?.decision ?? 'PENDING';
  const membershipStatus =
    decision === 'APPROVED' ? 'ACTIVE' :
    decision === 'REJECTED' ? 'REJECTED' :
    latestApp ? 'UNDER REVIEW' : 'PROFILE INCOMPLETE';

  return (
    <div className="flex flex-col gap-5">
      {/* Top summary bar (like IEK header) */}
      <div className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Registration No</p>
          <p className="mt-1 font-mono text-sm font-bold text-[#022D5A]">{registrationNo}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Category</p>
          <p className="mt-1 text-sm font-bold text-[#022D5A]">{category}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Membership Status</p>
          <span className={
            'mt-1 inline-flex items-center rounded-full px-3 py-0.5 text-[11px] font-bold ' +
            (membershipStatus === 'ACTIVE'
              ? 'bg-[#48C184] text-white'
              : membershipStatus === 'REJECTED'
                ? 'bg-rose-100 text-rose-700'
                : 'bg-amber-100 text-amber-700')
          }>
            {membershipStatus}
          </span>
        </div>
        <div className="flex items-center justify-start sm:justify-end">
          <Link
            href="/member/profile"
            className={
              'inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold ' +
              (isComplete
                ? 'bg-[#48C184]/15 text-[#3AA870]'
                : 'bg-rose-100 text-rose-600')
            }
          >
            <span className="relative flex h-6 w-6 items-center justify-center">
              <svg viewBox="0 0 36 36" className="absolute inset-0" aria-hidden="true">
                <path
                  d="M18 2.5 a 15.5 15.5 0 0 1 0 31 a 15.5 15.5 0 0 1 0 -31"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  opacity="0.25"
                />
                <path
                  d="M18 2.5 a 15.5 15.5 0 0 1 0 31 a 15.5 15.5 0 0 1 0 -31"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeDasharray={`${profilePct}, 100`}
                  strokeLinecap="round"
                />
              </svg>
            </span>
            {isComplete ? `Profile Complete!` : `Incomplete Profile ! ${profilePct}%`}
          </Link>
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-[#022D5A]">Dashboard</h1>
        <p className="text-sm text-slate-600">
          Welcome{displayName ? `, ${displayName}` : ''}. Here&apos;s an overview of your membership.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        <Card padded>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Membership Status</p>
          <p className="mt-2 text-lg font-semibold text-[#022D5A]">
            {membershipStatus === 'ACTIVE' ? 'Good Standing' : membershipStatus === 'UNDER REVIEW' ? 'Under Review' : 'Not in Good Standing'}
          </p>
          <Badge tone={membershipStatus === 'ACTIVE' ? 'success' : membershipStatus === 'REJECTED' ? 'warning' : 'warning'} className="mt-2">
            {membershipStatus === 'ACTIVE' ? 'Active member' : 'Pending IES review'}
          </Badge>
        </Card>
        <Card padded>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Applied Grade</p>
          <p className="mt-2 text-lg font-semibold text-[#022D5A]">
            {user?.gradeLabel ?? '-'}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {user?.discipline ?? 'Discipline not set'}
          </p>
        </Card>
        <Card padded>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">CPD Hours (2026)</p>
          <p className="mt-2 text-lg font-semibold text-[#022D5A]">0</p>
          <p className="mt-1 text-xs text-slate-500">Log your first activity</p>
        </Card>
        <Card padded>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Notifications</p>
          <p className="mt-2 text-lg font-semibold text-[#022D5A]">0</p>
          <p className="mt-1 text-xs text-slate-500">No new notifications</p>
        </Card>
      </div>

      {/* General Information + My Applications */}
      <div className="grid gap-5 lg:grid-cols-[1fr_1.4fr]">
        {/* General Information */}
        <Card padded>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">General Information</p>
          <div className="mt-4 flex flex-col items-center gap-3">
            <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-slate-100 ring-4 ring-[#035CB3]/10">
              {(() => {
                const photoDoc = applications[0]?.documents?.find((d) => d.type === 'PASSPORT_PHOTO');
                if (photoDoc?.id) {
                  const src = `${API_BASE_URL.replace(/\/api$/, '')}/api/memberships/public-photo/${photoDoc.id}`;
                  return (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={src} alt={displayName} className="h-full w-full object-cover" />
                  );
                }
                return (
                  <span className="text-2xl font-bold text-[#035CB3]">
                    {(user?.firstName?.[0] ?? user?.fullName?.[0] ?? 'M').toUpperCase()}
                  </span>
                );
              })()}
            </div>
            <p className="text-center text-sm font-bold uppercase tracking-wider text-[#022D5A]">
              {displayName}
            </p>
            {user?.gradeLabel && (
              <span className="rounded-full bg-[#035CB3]/10 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#035CB3]">
                {user.gradeLabel}
              </span>
            )}
          </div>
          <dl className="mt-5 divide-y divide-slate-100 text-sm">
            <Detail label="Registration No." value={registrationNo} mono />
            <Detail label="Email" value={user?.email ?? '-'} />
            <Detail label="Phone" value={user?.phone ?? '-'} />
            <Detail label="ID / Passport" value={user?.nationalId ?? '-'} mono />
            <Detail label="Gender" value={user?.gender ? user.gender.charAt(0) + user.gender.slice(1).toLowerCase() : '-'} />
            <Detail label="Date of Birth" value={formatDate(user?.dateOfBirth)} />
            <Detail label="Discipline" value={user?.discipline ?? '-'} />
            <Detail label="City" value={user?.city ?? '-'} />
            <Detail label="Nationality" value={user?.nationality ?? '-'} />
          </dl>
        </Card>

        {/* My Membership Applications */}
        <Card padded className="overflow-hidden">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">My Membership Applications</p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] uppercase tracking-widest text-slate-500">
                  <th className="px-3 py-3 font-bold">Application No</th>
                  <th className="px-3 py-3 font-bold">Applied Category</th>
                  <th className="px-3 py-3 font-bold">Date</th>
                  <th className="px-3 py-3 font-bold">Status</th>
                  <th className="px-3 py-3 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-3 py-8 text-center text-sm text-slate-500">
                      No applications yet. Complete your profile and submit documents to apply.
                    </td>
                  </tr>
                )}
                {applications.map((app) => (
                  <tr key={app.id} className="border-b border-slate-100">
                    <td className="px-3 py-3 font-mono text-xs text-[#022D5A]">
                      {app.id ? `IES-${app.id.slice(0, 8).toUpperCase()}` : '-'}
                    </td>
                    <td className="px-3 py-3 text-sm text-slate-700">{app.membershipGrade ?? '-'}</td>
                    <td className="px-3 py-3 text-xs text-slate-600">{formatDate(app.createdAt)}</td>
                    <td className="px-3 py-3">
                      <Badge tone={
                        app.decision === 'APPROVED' ? 'success' :
                        app.decision === 'REJECTED' ? 'warning' : 'muted'
                      }>
                        {app.decision ?? 'PENDING'}
                      </Badge>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <Link
                        href="/member/application"
                        className="inline-flex items-center gap-1 rounded-md bg-[#035CB3] px-3 py-1 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#48C184]"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-slate-500">Quick Links</h2>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
          {quickLinks.map((link) => (
            <Card key={link.href} padded interactive>
              <Link href={link.href}>
                <h3 className="text-sm font-semibold text-[#022D5A]">{link.title}</h3>
                <p className="mt-1 text-xs text-slate-600">{link.body}</p>
                <p className="mt-3 text-xs font-semibold text-[#035CB3]">Open ›</p>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

const Detail = ({ label, value, mono }: { label: string; value: string; mono?: boolean }) => (
  <div className="flex items-center justify-between gap-3 py-2">
    <p className="text-xs font-semibold text-slate-500">{label}</p>
    <p className={'text-right text-sm text-[#022D5A] ' + (mono ? 'font-mono' : '')}>{value}</p>
  </div>
);
