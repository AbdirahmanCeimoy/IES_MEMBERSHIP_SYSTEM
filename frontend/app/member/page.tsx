'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { buildAuthHeader, getAuthToken, getStoredUser } from '@/lib/authSession';
import { apiRequest } from '@/lib/apiClient';
import { fetchPublicEvents, type EventRow } from '@/lib/adminApi';

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
}

interface MembershipDocument {
  id?: string;
}

interface MembershipApplication {
  id?: string;
  membershipGrade?: string;
  stage?: string;
  decision?: string;
  membershipStatus?: string;
  registrationNumber?: string | null;
  createdAt?: string;
  documents?: MembershipDocument[];
}

const formatYear = (iso?: string): string => {
  if (!iso) return '-';
  try { return String(new Date(iso).getFullYear()); } catch { return '-'; }
};

const deriveStatus = (app?: MembershipApplication): string => {
  if (!app) return 'NOT IN GOOD STANDING';
  if (app.membershipStatus === 'GOOD_STANDING' || app.decision === 'APPROVED') return 'GOOD STANDING';
  if (app.membershipStatus === 'SUSPENDED') return 'SUSPENDED';
  if (app.membershipStatus === 'PENDING' || (app.stage && app.decision !== 'REJECTED')) return 'PENDING';
  return 'NOT IN GOOD STANDING';
};

const GRADE_LABELS: Record<string, string> = {
  STUDENT: 'Student Member (SMIES)',
  GRADUATE: 'Graduate Member (GMIES)',
  ASSOCIATE: 'Associate Member (AMIES)',
  CORPORATE: 'Corporate Member (MIES)',
  FELLOW: 'Fellow Member (FMIES)',
};

export default function MemberOverviewPage() {
  const [user] = useState<StoredUser | null>(() =>
    typeof window === 'undefined' ? null : getStoredUser<StoredUser>() ?? {},
  );
  const [applications, setApplications] = useState<MembershipApplication[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<EventRow[]>([]);
  const [loadingApps, setLoadingApps] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(true);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) { setLoadingApps(false); return; }
    apiRequest<unknown>('/memberships/my-applications', { headers: buildAuthHeader(token) })
      .then((res) => {
        if (!res.ok || !res.data) return;
        const raw = res.data as unknown;
        const items = Array.isArray(raw) ? raw : (raw as { items?: MembershipApplication[] }).items ?? [];
        setApplications(items as MembershipApplication[]);
      })
      .catch(() => {})
      .finally(() => setLoadingApps(false));
  }, []);

  useEffect(() => {
    fetchPublicEvents()
      .then((events) => setUpcomingEvents(events.slice(0, 4)))
      .catch(() => {})
      .finally(() => setLoadingEvents(false));
  }, []);

  const latestApp = applications[0];
  const memberStatus = deriveStatus(latestApp);
  const isGoodStanding = memberStatus === 'GOOD STANDING';

  return (
    <div className="flex flex-col gap-5">
      {/* 3 Stat Cards - compact */}
      <div className="grid gap-3 sm:grid-cols-3">
        {/* Member Since */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#035CB3]/10 text-[#035CB3]">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
          <p className="mt-3 text-xl font-bold text-[#022D5A]">
            {loadingApps ? '-' : formatYear(latestApp?.createdAt)}
          </p>
          <p className="mt-0.5 text-xs text-slate-500">Member Since</p>
        </div>

        {/* Events Attended */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#035CB3]/10 text-[#035CB3]">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <p className="mt-3 text-xl font-bold text-[#022D5A]">0</p>
          <p className="mt-0.5 text-xs text-slate-500">Events Attended</p>
          <Link href="/member/events" className="mt-1 block text-[11px] font-semibold text-[#035CB3] hover:underline">
            Browse events ›
          </Link>
        </div>

        {/* Membership Status */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className={
            'flex h-8 w-8 items-center justify-center rounded-lg ' +
            (isGoodStanding ? 'bg-[#48C184]/15 text-[#48C184]' : 'bg-rose-100 text-rose-500')
          }>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <line x1="2" y1="10" x2="22" y2="10" />
            </svg>
          </div>
          <p className={
            'mt-3 text-sm font-bold leading-tight ' +
            (isGoodStanding ? 'text-[#48C184]' : 'text-rose-500')
          }>
            {loadingApps ? '-' : memberStatus}
          </p>
          <p className="mt-0.5 text-xs text-slate-500">Membership Status</p>
          <p className="mt-0.5 text-[11px] text-slate-400">
            {user?.gradeLabel ?? GRADE_LABELS[user?.grade ?? ''] ?? 'Grade not set'}
          </p>
        </div>
      </div>

      {/* Recent Activity + Upcoming Events */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Recent Activity */}
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <h2 className="text-sm font-bold text-[#022D5A]">Recent Activity</h2>
          <div className="mt-4 flex min-h-[90px] flex-col items-center justify-center text-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5">
              <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" />
              <path d="M12 8v4l3 3" strokeLinecap="round" />
            </svg>
            <p className="mt-2 text-xs text-slate-400">No recent activity found.</p>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#022D5A]">Upcoming Events</h2>
            <Link href="/member/events" className="text-xs font-semibold text-[#035CB3] hover:underline">
              All events
            </Link>
          </div>
          {loadingEvents ? (
            <div className="mt-4 flex min-h-[90px] items-center justify-center">
              <svg className="h-4 w-4 animate-spin text-[#035CB3]" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
            </div>
          ) : upcomingEvents.length === 0 ? (
            <div className="mt-4 flex min-h-[90px] flex-col items-center justify-center text-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" />
              </svg>
              <p className="mt-2 text-xs text-slate-400">No upcoming events found.</p>
            </div>
          ) : (
            <ul className="mt-3 space-y-2">
              {upcomingEvents.map((ev) => (
                <li key={ev.id} className="flex items-start gap-3 rounded-lg border border-slate-100 p-2.5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#035CB3]/10 text-[#035CB3]">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" />
                      <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-[#022D5A]">{ev.title}</p>
                    <p className="text-[11px] text-slate-500">{ev.date}{ev.location ? ` · ${ev.location}` : ''}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
