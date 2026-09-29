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

/** Derive the current status from the latest application if the backend does not send one. */
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

/**
 * Profile completion in 30% steps + 10% for approval:
 *   Step 1 — Profile filled       : 30%
 *   Step 2 — Documents uploaded   : 30%
 *   Step 3 — Payment / Application submitted: 30%
 *   Step 4 — Approved by IES      : 10%
 */
const calculateProfileCompletion = (user: StoredUser | null, applications: MembershipApp[] = []): number => {
  if (!user) return 0;
  const required = [
    user.title, user.firstName, user.lastName, user.gender, user.dateOfBirth,
    user.discipline, user.grade, user.email, user.phone, user.nationalId,
  ];
  const profileFilled = required.every((v) => v && String(v).trim() !== '');
  const latest = applications[0];
  let pct = 0;
  if (profileFilled) pct += 30;
  if (latest && (latest.documents?.length ?? 0) > 0) pct += 30;
  if (latest) pct += 30;
  if (latest?.decision === 'APPROVED') pct += 10;
  return pct;
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
    label: 'Payments',
    href: '/member/payments',
    roles: ['MEMBER', 'ADMIN'],
    icon: (
      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="5" width="16" height="11" rx="2" /><path d="M2 9h16M6 13h3" strokeLinecap="round" /></svg>
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
        /* ignore — header shows 0% when unknown */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleLogout = () => {
    clearAuthSession();
    router.push(routes.home);
  };

  const role = (user?.role as 'MEMBER' | 'ADMIN') ?? 'MEMBER';
  const items = MENU.filter((item) => item.roles.includes(role));
  const displayName = user?.fullName || [user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.username || 'Member';

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside
        className={cn(
          'group/aside fixed inset-y-0 left-0 z-40 flex shrink-0 flex-col border-r border-white/10 bg-[#022D5A] text-slate-100 transition-[width,transform] duration-200 lg:static lg:translate-x-0',
          collapsed ? 'w-[68px]' : 'w-64',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className={cn('flex h-16 items-center border-b border-white/10', collapsed ? 'justify-center px-2' : 'gap-2 px-4')}>
          <div className="relative h-9 w-9 shrink-0">
            <Image src={site.logo} alt="" fill className="object-contain" />
          </div>
          {!collapsed && (
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-bold text-white">{site.shortName}omalia</span>
              <span className="text-[10px] uppercase tracking-widest text-[#48C184]">Member Portal</span>
            </div>
          )}
        </div>

        {/* Collapse toggle - floating pill on the right edge */}
        <button
          type="button"
          onClick={toggleCollapsed}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="absolute -right-3 top-20 z-10 hidden h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-white text-[#022D5A] shadow-md transition-all hover:scale-110 hover:bg-[#48C184] lg:flex"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            className={cn('transition-transform duration-200', collapsed && 'rotate-180')}
            aria-hidden="true"
          >
            <path d="M12 5l-5 5 5 5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <nav className="flex-1 overflow-y-auto overflow-x-hidden p-2">
          <ul className="flex flex-col gap-1">
            {items.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    title={collapsed ? item.label : undefined}
                    className={cn(
                      'group relative flex items-center rounded-lg text-sm font-medium transition-colors',
                      collapsed ? 'h-10 w-full justify-center px-0' : 'gap-2.5 px-3 py-2',
                      active
                        ? 'bg-[#035CB3] text-white shadow-sm'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white',
                    )}
                  >
                    <span className={cn('shrink-0', active && 'text-[#48C184]')}>{item.icon}</span>
                    {!collapsed && <span className="truncate">{item.label}</span>}
                    {active && !collapsed && (
                      <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#48C184]" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className={cn('border-t border-white/10', collapsed ? 'p-2' : 'p-3')}>
          <div className={cn('mb-2 flex items-center rounded-lg bg-white/5', collapsed ? 'justify-center p-2' : 'gap-2 px-2 py-2')}>
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#48C184] text-xs font-bold text-[#022D5A]">
              {(user.firstName?.[0] ?? user.fullName?.[0] ?? user.username?.[0] ?? 'M').toUpperCase()}
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-white">
                  {displayName}
                </p>
                <p className="truncate text-[10px] uppercase tracking-wider text-[#48C184]">
                  {user.gradeLabel ?? role}
                </p>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={handleLogout}
            title={collapsed ? 'Sign out' : undefined}
            className={cn(
              'flex w-full items-center rounded-lg text-xs font-semibold text-slate-300 transition-colors hover:bg-white/5 hover:text-rose-400',
              collapsed ? 'h-9 justify-center' : 'gap-2 px-3 py-2',
            )}
          >
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M8 4H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h3M12 7l4 3-4 3M16 10H8" strokeLinecap="round" strokeLinejoin="round" /></svg>
            {!collapsed && 'Sign out'}
          </button>
        </div>
      </aside>

      {/* Backdrop (mobile) */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top strip: IEK-style. Left = hamburger + Reg/Category/Status pills. Right = incomplete-profile + notifications + user dropdown. */}
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:px-6">
          <div className="flex items-center gap-3 lg:gap-6">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-700 hover:bg-slate-100 lg:hidden"
              aria-label="Open menu"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h12M4 10h12M4 14h12" strokeLinecap="round" /></svg>
            </button>
            {(() => {
              const latest = applications[0];
              const status = deriveStatus(latest);
              const regNo = latest?.registrationNumber ?? user.username ?? '- -';
              const category = user.gradeLabel ?? latest?.membershipGrade ?? '- -';
              return (
                <div className="hidden items-center gap-5 text-[11px] font-semibold uppercase tracking-wider text-slate-500 md:flex">
                  <span className="flex items-center gap-1.5">
                    Registration No:
                    <span className="font-mono text-[#022D5A]">{regNo}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    Category:
                    <span className="text-[#022D5A]">{category}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    Membership Status:
                    <span className={cn('rounded-full px-2.5 py-0.5 text-[10px] font-bold', STATUS_STYLES[status])}>
                      {STATUS_LABELS[status]}
                    </span>
                  </span>
                </div>
              );
            })()}
          </div>
          <div className="flex items-center gap-2">
            {(() => {
              const pct = calculateProfileCompletion(user, applications);
              const isComplete = pct === 100;
              return (
                <Link
                  href="/member/profile"
                  className={cn(
                    'hidden items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-colors sm:inline-flex',
                    isComplete
                      ? 'bg-[#48C184]/15 text-[#3AA870] hover:bg-[#48C184]/25'
                      : 'bg-rose-100 text-rose-600 hover:bg-rose-200',
                  )}
                  title={`Profile ${pct}% complete`}
                >
                  <svg width="20" height="20" viewBox="0 0 36 36" aria-hidden="true">
                    <path
                      d="M18 2.5 a 15.5 15.5 0 0 1 0 31 a 15.5 15.5 0 0 1 0 -31"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      opacity="0.3"
                    />
                    <path
                      d="M18 2.5 a 15.5 15.5 0 0 1 0 31 a 15.5 15.5 0 0 1 0 -31"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeDasharray={`${pct}, 100`}
                      strokeLinecap="round"
                    />
                  </svg>
                  {isComplete ? `Profile Complete` : `Incomplete Profile — ${pct}%`}
                </Link>
              );
            })()}
            {/* Notification bell */}
            <button
              type="button"
              className="relative inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-[#022D5A]"
              aria-label="Notifications"
            >
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M10 3a5 5 0 0 0-5 5v3l-2 2h14l-2-2V8a5 5 0 0 0-5-5z" strokeLinejoin="round" /><path d="M8 16a2 2 0 0 0 4 0" strokeLinecap="round" /></svg>
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
            </button>
            {/* User dropdown: Profile, Settings, Sign out */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserMenuOpen((v) => !v)}
                className="inline-flex h-9 items-center gap-2 rounded-full px-1 pr-3 text-slate-600 transition-colors hover:bg-slate-100"
                aria-label="Open user menu"
                aria-expanded={userMenuOpen}
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#035CB3] text-xs font-bold text-white">
                  {(user.firstName?.[0] ?? user.fullName?.[0] ?? user.username?.[0] ?? 'M').toUpperCase()}
                </span>
                <span className="hidden max-w-[120px] truncate text-xs font-semibold text-[#022D5A] sm:inline">
                  {displayName}
                </span>
                <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" className={cn('transition-transform', userMenuOpen && 'rotate-180')} aria-hidden="true">
                  <path d="M5 8l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {userMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setUserMenuOpen(false)}
                    aria-hidden="true"
                  />
                  <div
                    role="menu"
                    className="absolute right-0 top-11 z-30 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg"
                  >
                    <div className="border-b border-slate-100 px-3 py-3">
                      <p className="truncate text-sm font-bold text-[#022D5A]">{displayName}</p>
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
                        onClick={() => {
                          setUserMenuOpen(false);
                          handleLogout();
                        }}
                        className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50"
                      >
                        <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M8 4H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h3M12 7l4 3-4 3M16 10H8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        Sign out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>
        {/* Breadcrumb under the top strip */}
        <div className="border-b border-slate-100 bg-white px-4 py-2 text-xs text-slate-500 lg:px-6">
          <span className="font-semibold text-[#022D5A]">Member</span>
          {' / '}
          {MENU.find((m) => m.href === pathname)?.label ?? 'Dashboard'}
        </div>
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
};
