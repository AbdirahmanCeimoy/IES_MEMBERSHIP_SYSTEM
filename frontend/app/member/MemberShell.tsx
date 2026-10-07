'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { buildAuthHeader, clearAuthSession, getAuthToken, getStoredUser } from '@/lib/authSession';
import { apiRequest } from '@/lib/apiClient';
import { site } from '@/config/site';
import { routes } from '@/config/routes';
import { cn } from '@/lib/cn';

interface StoredUser {
  id?: string;
  username?: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  email?: string;
  role?: string;
  grade?: string;
  gradeLabel?: string;
  title?: string;
  gender?: string;
  dateOfBirth?: string;
  discipline?: string;
  phone?: string;
  nationalId?: string;
  city?: string;
  nationality?: string;
}

interface MembershipApp {
  id?: string;
  decision?: string;
  membershipGrade?: string;
  registrationNumber?: string | null;
  membershipStatus?: string | null;
  validUntil?: string | null;
  documents?: Array<{ id?: string }>;
}

type MembershipStatus =
  | 'GOOD_STANDING'
  | 'NOT_IN_GOOD_STANDING'
  | 'SUSPENDED'
  | 'INACTIVE'
  | 'PENDING'
  | 'EXPIRED'
  | 'RESIGNED'
  | 'TERMINATED';

const STATUS_LABELS: Record<MembershipStatus, string> = {
  GOOD_STANDING: 'Good Standing',
  NOT_IN_GOOD_STANDING: 'Not in Good Standing',
  SUSPENDED: 'Suspended',
  INACTIVE: 'Inactive',
  PENDING: 'Pending',
  EXPIRED: 'Expired',
  RESIGNED: 'Resigned',
  TERMINATED: 'Terminated',
};

const STATUS_STYLES: Record<MembershipStatus, string> = {
  GOOD_STANDING: 'bg-[#48C184] text-white',
  NOT_IN_GOOD_STANDING: 'bg-amber-500 text-white',
  SUSPENDED: 'bg-orange-500 text-white',
  INACTIVE: 'bg-slate-400 text-white',
  PENDING: 'bg-amber-200 text-amber-900',
  EXPIRED: 'bg-rose-200 text-rose-900',
  RESIGNED: 'bg-slate-500 text-white',
  TERMINATED: 'bg-red-600 text-white',
};

const deriveStatus = (app?: MembershipApp): MembershipStatus => {
  if (!app) return 'INACTIVE';
  if (app.membershipStatus && app.membershipStatus in STATUS_LABELS) {
    return app.membershipStatus as MembershipStatus;
  }
  if (app.decision === 'APPROVED') {
    const validUntil = app.validUntil ? new Date(app.validUntil).getTime() : 0;
    return validUntil > Date.now() ? 'GOOD_STANDING' : 'EXPIRED';
  }
  if (app.decision === 'REJECTED') return 'INACTIVE';
  return 'PENDING';
};

interface MenuItem {
  label: string;
  href: string;
  icon: ReactNode;
  roles: readonly ('MEMBER' | 'ADMIN')[];
}

const MENU: MenuItem[] = [
  {
    label: 'Dashboard',
    href: '/member',
    roles: ['MEMBER', 'ADMIN'],
    icon: (
      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 10l7-6 7 6M5 9v7h10V9" strokeLinecap="round" strokeLinejoin="round" /></svg>
    ),
  },
  {
    label: 'Profile',
    href: '/member/profile',
    roles: ['MEMBER', 'ADMIN'],
    icon: (
      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="10" cy="7" r="3" /><path d="M4 17c0-3.3 2.7-6 6-6s6 2.7 6 6" strokeLinecap="round" /></svg>
    ),
  },
  {
    label: 'My Application',
    href: '/member/application',
    roles: ['MEMBER', 'ADMIN'],
    icon: (
      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 3h6l4 4v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" strokeLinecap="round" strokeLinejoin="round" /><path d="M12 3v4h4M8 12h4M8 15h5" strokeLinecap="round" strokeLinejoin="round" /></svg>
    ),
  },
  {
    label: 'Bills',
    href: '/member/bills',
    roles: ['MEMBER', 'ADMIN'],
    icon: (
      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 2h10v16l-2.5-1.5L10 18l-2.5-1.5L5 18V2z" strokeLinejoin="round" /><path d="M8 7h4M8 10h4M8 13h3" strokeLinecap="round" /></svg>
    ),
  },
  {
    label: 'IES Events',
    href: '/member/events',
    roles: ['MEMBER', 'ADMIN'],
    icon: (
      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="4" width="14" height="14" rx="2" /><path d="M3 8h14M7 3v3M13 3v3" strokeLinecap="round" /></svg>
    ),
  },
  {
    label: 'All Applications',
    href: '/member/all-applications',
    roles: ['ADMIN'],
    icon: (
      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 6h12M4 10h12M4 14h8" strokeLinecap="round" /></svg>
    ),
  },
];

export const MemberShell = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [user] = useState<StoredUser | null>(() =>
    typeof window === 'undefined' ? null : getStoredUser<StoredUser>() ?? {},
  );
  const [applications, setApplications] = useState<MembershipApp[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [chipOpen, setChipOpen] = useState(false);
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem('member.sidebar.collapsed') === '1';
  });

  const toggleCollapsed = () => {
    setCollapsed((v) => {
      const next = !v;
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('member.sidebar.collapsed', next ? '1' : '0');
      }
      return next;
    });
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && !getAuthToken()) {
      router.replace(routes.auth.login);
    }
  }, [router]);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await apiRequest<unknown>('/memberships/my-applications', {
          headers: buildAuthHeader(token),
        });
        if (cancelled || !res.ok) return;
        const raw = res.data as unknown;
        const list = Array.isArray(raw)
          ? raw
          : ((raw as { applications?: unknown[]; items?: unknown[] })?.applications
              ?? (raw as { applications?: unknown[]; items?: unknown[] })?.items
              ?? []);
        setApplications(Array.isArray(list) ? (list as MembershipApp[]) : []);
      } catch {
        /* ignore */
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const handleLogout = () => {
    clearAuthSession();
    router.push(routes.home);
  };

  const role = (user?.role as 'MEMBER' | 'ADMIN') ?? 'MEMBER';
  const items = MENU.filter((item) => item.roles.includes(role));
  const displayName = user?.fullName || [user?.firstName, user?.lastName].filter(Boolean).join(' ') || 'Member';

  // Profile completion for breadcrumb indicator
  const PROFILE_KEYS = ['title', 'firstName', 'lastName', 'gender', 'dateOfBirth', 'discipline', 'grade', 'email', 'phone', 'nationalId'] as const;
  const filledCount = PROFILE_KEYS.filter((k) => { const v = (user as Record<string, unknown>)[k]; return v && String(v).trim() !== ''; }).length;
  const latestApp = applications[0];
  let shellProfilePct = Math.round((filledCount / PROFILE_KEYS.length) * 30);
  if ((latestApp?.documents?.length ?? 0) > 0) shellProfilePct += 30;
  if (latestApp) shellProfilePct += 30;
  if (latestApp?.decision === 'APPROVED') shellProfilePct += 10;
  shellProfilePct = Math.min(100, shellProfilePct);
  const shellProfileComplete = shellProfilePct >= 100;

  if (!user) return null;

  const circ = 2 * Math.PI * 10;
  const shellDash = (shellProfilePct / 100) * circ;

  // Checklist items for the dropdown
  const profileFieldsFilled = filledCount === PROFILE_KEYS.length;
  const checklistItems = [
    {
      id: 'profile',
      label: 'PERSONAL INFORMATION',
      description: `${filledCount} / ${PROFILE_KEYS.length} fields completed`,
      done: profileFieldsFilled,
      href: '/member/profile',
      readonly: false,
    },
    {
      id: 'documents',
      label: 'DOCUMENTS',
      description: 'Upload required membership documents',
      done: (latestApp?.documents?.length ?? 0) > 0,
      href: '/member/application',
      readonly: false,
    },
    {
      id: 'application',
      label: 'APPLICATION',
      description: 'Submit your membership application',
      done: !!latestApp,
      href: '/member/application',
      readonly: false,
    },
    {
      id: 'approval',
      label: 'IES APPROVAL',
      description: 'Waiting for IES review and approval',
      done: latestApp?.decision === 'APPROVED',
      href: '/member/application',
      readonly: true,
    },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside
        className={cn(
          'group/aside fixed inset-y-0 left-0 z-40 flex shrink-0 flex-col border-r border-slate-200 bg-white text-slate-700 transition-[width,transform] duration-200 lg:static lg:translate-x-0',
          collapsed ? 'w-[60px]' : 'w-52',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* Logo */}
        <div className={cn('flex h-14 items-center border-b border-slate-200', collapsed ? 'justify-center px-2' : 'gap-2 px-4')}>
          <div className="relative h-8 w-8 shrink-0">
            <Image src={site.logo} alt="" fill className="object-contain" />
          </div>
          {!collapsed && (
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-bold text-[#022D5A]">{site.shortName}omalia</span>
              <span className="text-[9px] uppercase tracking-widest text-[#48C184]">Member Portal</span>
            </div>
          )}
        </div>

        {/* Collapse toggle */}
        <button
          type="button"
          onClick={toggleCollapsed}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="absolute -right-3 top-16 z-10 hidden h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-[#035CB3] shadow-md transition-all hover:scale-110 hover:bg-[#035CB3] hover:text-white lg:flex"
        >
          <svg
            width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5"
            className={cn('transition-transform duration-200', collapsed && 'rotate-180')}
            aria-hidden="true"
          >
            <path d="M12 5l-5 5 5 5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <nav className="flex-1 overflow-y-auto overflow-x-hidden p-2">
          <ul className="flex flex-col gap-0.5">
            {items.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    title={collapsed ? item.label : undefined}
                    className={cn(
                      'flex items-center rounded-lg text-sm font-medium transition-colors',
                      collapsed ? 'h-10 w-full justify-center px-0' : 'gap-2.5 px-3 py-2',
                      active
                        ? 'bg-[#035CB3] text-white shadow-sm'
                        : 'text-slate-600 hover:bg-[#035CB3]/10 hover:text-[#035CB3]',
                    )}
                  >
                    <span className={cn('shrink-0', active ? 'text-white' : '')}>{item.icon}</span>
                    {!collapsed && <span className="truncate">{item.label}</span>}
                    {active && !collapsed && (
                      <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white/70" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom user card */}
        <div className={cn('border-t border-slate-200', collapsed ? 'p-2' : 'p-3')}>
          <div className={cn('mb-2 flex items-center rounded-lg bg-slate-50', collapsed ? 'justify-center p-2' : 'gap-2 px-2 py-2')}>
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#035CB3] text-xs font-bold text-white">
              {(user.firstName?.[0] ?? user.fullName?.[0] ?? user.username?.[0] ?? 'M').toUpperCase()}
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-[#022D5A]">{displayName}</p>
                <p className="truncate text-[10px] uppercase tracking-wider text-[#48C184]">
                  {user.gradeLabel ?? role}
                </p>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={handleLogout}
            title={collapsed ? 'Logout' : undefined}
            className={cn(
              'flex w-full items-center rounded-lg text-xs font-semibold text-slate-500 transition-colors hover:bg-rose-50 hover:text-rose-600',
              collapsed ? 'h-9 justify-center' : 'gap-2 px-3 py-2',
            )}
          >
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M8 4H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h3M12 7l4 3-4 3M16 10H8" strokeLinecap="round" strokeLinejoin="round" /></svg>
            {!collapsed && 'Logout'}
          </button>
        </div>
      </aside>

      {/* Backdrop (mobile) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-slate-900/30 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top header */}
        <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 lg:px-6">
          <div className="flex items-center gap-3 lg:gap-5">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-700 hover:bg-slate-100 lg:hidden"
              aria-label="Open menu"
            >
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h12M4 10h12M4 14h12" strokeLinecap="round" /></svg>
            </button>
            {(() => {
              const latest = applications[0];
              const hasReg = !!latest?.registrationNumber;
              const hasCategory = !!(user.gradeLabel ?? latest?.membershipGrade);
              const hasStatus = !!latest?.membershipStatus || latest?.decision === 'APPROVED';
              const regNo = latest?.registrationNumber;
              const category = user.gradeLabel ?? latest?.membershipGrade;
              const status = deriveStatus(latest);
              return (
                <div className="hidden items-center gap-4 text-[11px] font-semibold uppercase tracking-wider text-slate-500 md:flex">
                  <span className="flex items-center gap-1">
                    Registration No:
                    {hasReg ? (
                      <span className="font-mono text-[#035CB3]">{regNo}</span>
                    ) : (
                      <span className="text-slate-400">-- --</span>
                    )}
                  </span>
                  <span className="flex items-center gap-1">
                    Category:
                    {hasCategory ? (
                      <span className="text-[#035CB3]">{category}</span>
                    ) : (
                      <span className="text-slate-400">-- --</span>
                    )}
                  </span>
                  <span className="flex items-center gap-1">
                    Membership Status:
                    {hasStatus ? (
                      <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-bold', STATUS_STYLES[status])}>
                        {STATUS_LABELS[status]}
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-orange-500 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                        -- --
                      </span>
                    )}
                  </span>
                </div>
              );
            })()}
          </div>

          <div className="flex items-center gap-1">
            {/* Notification bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => { setNotifOpen((v) => !v); setUserMenuOpen(false); setChipOpen(false); }}
                className="relative inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-[#035CB3]"
                aria-label="Notifications"
              >
                <svg width="17" height="17" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M10 3a5 5 0 0 0-5 5v3l-2 2h14l-2-2V8a5 5 0 0 0-5-5z" strokeLinejoin="round" /><path d="M8 16a2 2 0 0 0 4 0" strokeLinecap="round" /></svg>
              </button>
              {notifOpen && (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => setNotifOpen(false)} aria-hidden="true" />
                  <div className="absolute right-0 top-10 z-30 w-72 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                    <div className="border-b border-slate-100 px-4 py-3">
                      <p className="text-sm font-bold text-[#022D5A]">Notifications</p>
                    </div>
                    <div className="flex flex-col items-center justify-center gap-2 px-4 py-8 text-center">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                        <path d="M13.73 21a2 2 0 0 1-3.46 0" strokeLinecap="round" />
                      </svg>
                      <p className="text-sm font-semibold text-slate-700">No Notifications</p>
                      <p className="text-xs text-slate-400">You're all caught up!</p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* User avatar dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => { setUserMenuOpen((v) => !v); setNotifOpen(false); setChipOpen(false); }}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#035CB3] text-sm font-bold text-white transition-colors hover:bg-[#024A8F]"
                aria-label="Open user menu"
                aria-expanded={userMenuOpen}
              >
                {(user.firstName?.[0] ?? user.fullName?.[0] ?? 'M').toUpperCase()}
              </button>
              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => setUserMenuOpen(false)} aria-hidden="true" />
                  <div role="menu" className="absolute right-0 top-10 z-30 w-52 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                    <div className="border-b border-slate-100 px-4 py-3">
                      <p className="truncate text-sm font-bold text-[#035CB3]">{displayName}</p>
                      <p className="truncate text-[11px] text-slate-500">{user.email ?? ''}</p>
                    </div>
                    <div className="flex flex-col p-1 text-sm">
                      <Link
                        href="/member/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 rounded-md px-3 py-2 text-slate-700 hover:bg-slate-100 hover:text-[#035CB3]"
                      >
                        <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="10" cy="7" r="3" /><path d="M4 17c0-3.3 2.7-6 6-6s6 2.7 6 6" strokeLinecap="round" /></svg>
                        Profile
                      </Link>
                      <Link
                        href="/member/settings"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 rounded-md px-3 py-2 text-slate-700 hover:bg-slate-100 hover:text-[#035CB3]"
                      >
                        <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="10" cy="10" r="3" /><path d="M10 2v2M10 16v2M4.9 4.9l1.4 1.4M13.7 13.7l1.4 1.4M2 10h2M16 10h2M4.9 15.1l1.4-1.4M13.7 6.3l1.4-1.4" strokeLinecap="round" /></svg>
                        Settings
                      </Link>
                    </div>
                    <div className="border-t border-slate-100 p-1">
                      <button
                        type="button"
                        onClick={() => { setUserMenuOpen(false); handleLogout(); }}
                        className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50"
                      >
                        <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M8 4H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h3M12 7l4 3-4 3M16 10H8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        Logout
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Breadcrumb bar — left: path, right: incomplete profile chip + dropdown */}
        <div className="relative flex items-center justify-between border-b border-slate-100 bg-white px-4 py-1.5 text-xs text-slate-500 lg:px-6">
          <span>
            <span className="font-semibold text-[#035CB3]">Member</span>
            {' / '}
            {MENU.find((m) => m.href === pathname)?.label ?? 'Dashboard'}
          </span>

          {!shellProfileComplete && (
            <div className="relative">
              <button
                type="button"
                onClick={() => { setChipOpen((v) => !v); setNotifOpen(false); setUserMenuOpen(false); }}
                className="flex items-center gap-2 rounded-lg bg-rose-50 px-3 py-1 transition-colors hover:bg-rose-100"
              >
                <svg width="28" height="28" viewBox="0 0 36 36" className="shrink-0">
                  <circle cx="18" cy="18" r="10" fill="none" stroke="#fecaca" strokeWidth="3" />
                  <circle
                    cx="18" cy="18" r="10"
                    fill="none"
                    stroke="#dc2626"
                    strokeWidth="3"
                    strokeDasharray={`${shellDash} ${circ}`}
                    strokeLinecap="round"
                    transform="rotate(-90 18 18)"
                  />
                  <text x="18" y="22" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#dc2626">{shellProfilePct}%</text>
                </svg>
                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600">
                  Incomplete Profile !
                </span>
              </button>

              {chipOpen && (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => setChipOpen(false)} aria-hidden="true" />
                  <div className="absolute right-0 top-full z-30 mt-1.5 w-80 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
                    {/* Panel header */}
                    <div className="border-b border-slate-100 bg-slate-50 px-4 py-3">
                      <p className="text-sm font-bold text-[#022D5A]">Application Checklist</p>
                      <p className="mt-0.5 text-[11px] text-slate-500">Complete the requirements below</p>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200">
                        <div
                          className="h-1.5 rounded-full bg-[#035CB3] transition-all"
                          style={{ width: `${shellProfilePct}%` }}
                        />
                      </div>
                      <p className="mt-1 text-[10px] font-semibold text-slate-400">{shellProfilePct}% complete</p>
                    </div>

                    {/* Checklist items */}
                    <div className="divide-y divide-slate-100">
                      {checklistItems.map((item) => (
                        <div key={item.id} className="flex items-center justify-between gap-3 px-4 py-3">
                          <div className="min-w-0 flex-1">
                            <p className="text-[11px] font-bold uppercase tracking-wide text-slate-700">{item.label}</p>
                            <p className="text-[10px] text-slate-400">{item.description}</p>
                          </div>
                          <div className="flex shrink-0 items-center gap-2">
                            {item.done ? (
                              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="#48C184" strokeWidth="2.5">
                                <path d="M4 10l5 5 7-7" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            ) : (
                              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="#f59e0b" strokeWidth="2">
                                <path d="M10 3L2 17h16L10 3z" strokeLinejoin="round" />
                                <path d="M10 9v4M10 14.5h.01" strokeLinecap="round" />
                              </svg>
                            )}
                            {!item.done && !item.readonly ? (
                              <Link
                                href={item.href}
                                onClick={() => setChipOpen(false)}
                                className="flex items-center gap-1 rounded-md bg-orange-500 px-2.5 py-1 text-[10px] font-bold uppercase text-white transition-colors hover:bg-orange-600"
                              >
                                COMPLETE
                                <svg width="10" height="10" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5">
                                  <path d="M5 10h10M12 7l3 3-3 3" strokeLinecap="round" />
                                </svg>
                              </Link>
                            ) : (
                              <span className={cn(
                                'rounded-md px-2.5 py-1 text-[10px] font-bold uppercase',
                                item.done
                                  ? 'bg-slate-100 text-slate-400'
                                  : 'bg-slate-100 text-slate-400',
                              )}>
                                {item.done ? 'DONE' : 'PENDING'}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        <main className="flex-1 bg-slate-50 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
};
