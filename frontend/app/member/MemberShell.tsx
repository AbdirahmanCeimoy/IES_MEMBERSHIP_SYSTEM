'use client';

import { useEffect, useState, type ReactNode } from 'react';
/* useState uses lazy initializer to avoid setState-in-effect */
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

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-64 shrink-0 flex-col border-r border-slate-200 bg-white transition-transform lg:static lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-16 items-center gap-2 border-b border-slate-100 px-4">
          <div className="relative h-9 w-9">
            <Image src={site.logo} alt="" fill className="object-contain" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-bold text-[#035CB3]">{site.shortName}omalia</span>
            <span className="text-[10px] uppercase tracking-widest text-slate-500">Member Portal</span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-3">
          <ul className="flex flex-col gap-1">
            {items.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      active
                        ? 'bg-[#035CB3] text-white'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-[#035CB3]',
                    )}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-slate-100 p-3">
          <div className="mb-2 flex items-center gap-2 rounded-lg bg-slate-50 px-2 py-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#035CB3] text-xs font-bold text-white">
              {(user.firstName?.[0] ?? user.fullName?.[0] ?? user.username?.[0] ?? 'M').toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-[#022D5A]">
                {user.fullName || [user.firstName, user.lastName].filter(Boolean).join(' ') || user.username || 'Member'}
              </p>
              <p className="truncate text-[10px] text-slate-500">
                {user.gradeLabel ?? role}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-rose-700"
          >
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M8 4H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h3M12 7l4 3-4 3M16 10H8" strokeLinecap="round" strokeLinejoin="round" /></svg>
            Sign out
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
              Welcome back, <span className="font-semibold text-[#022D5A]">{user.fullName ?? user.username}</span>
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
