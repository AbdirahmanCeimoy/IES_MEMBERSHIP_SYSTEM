'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { clearAuthSession, getAuthToken, getStoredUser } from '@/lib/authSession';
import { site } from '@/config/site';
import { routes } from '@/config/routes';
import { cn } from '@/lib/cn';

interface StoredUser {
  id?: string;
  username?: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
  grade?: string;
  gradeLabel?: string;
}

interface MenuItem {
  label: string;
  href: string;
  icon: ReactNode;
  roles: readonly ('MEMBER' | 'ADMIN')[];
}

const MENU: MenuItem[] = [
  {
    label: 'Overview',
    href: '/member',
    roles: ['MEMBER', 'ADMIN'],
    icon: (
      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 10l7-6 7 6M5 9v7h10V9" strokeLinecap="round" strokeLinejoin="round" /></svg>
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
    label: 'Documents',
    href: '/member/documents',
    roles: ['MEMBER', 'ADMIN'],
    icon: (
      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 3h8l4 4v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" strokeLinecap="round" strokeLinejoin="round" /><path d="M12 3v4h4" strokeLinecap="round" strokeLinejoin="round" /><path d="M10 15l-2-2m0 0l-2 2m2-2v-4" strokeLinecap="round" strokeLinejoin="round" /></svg>
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
    label: 'CPD Activities',
    href: '/member/cpd',
    roles: ['MEMBER', 'ADMIN'],
    icon: (
      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 5h12l-1 12H5L4 5zM8 3h4v2" strokeLinecap="round" strokeLinejoin="round" /><path d="M8 9v4M12 9v4" strokeLinecap="round" /></svg>
    ),
  },
  {
    label: 'Events',
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
  const [mobileOpen, setMobileOpen] = useState(false);
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
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:px-6">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-700 hover:bg-slate-100 lg:hidden"
              aria-label="Open menu"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h12M4 10h12M4 14h12" strokeLinecap="round" /></svg>
            </button>
            <div className="text-sm text-slate-500">
              <span className="font-semibold text-[#022D5A]">Member</span>
              {' / '}
              {MENU.find((m) => m.href === pathname)?.label ?? 'Overview'}
            </div>
          </div>
          {user.gradeLabel && (
            <span className="hidden rounded-full bg-[#035CB3]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#035CB3] sm:inline-block">
              {user.gradeLabel}
            </span>
          )}
        </header>
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
};
