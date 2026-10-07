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
}

interface MenuItem {
  label: string;
  href: string;
  icon: ReactNode;
}

const MENU: MenuItem[] = [
  {
    label: 'Overview',
    href: '/admin',
    icon: (<svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 10l7-6 7 6M5 9v7h10V9" strokeLinecap="round" strokeLinejoin="round" /></svg>),
  },
  {
    label: 'Applications',
    href: '/admin/applications',
    icon: (<svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 3h6l4 4v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" strokeLinecap="round" strokeLinejoin="round" /><path d="M12 3v4h4M8 12h4M8 15h5" strokeLinecap="round" strokeLinejoin="round" /></svg>),
  },
  {
    label: 'Members',
    href: '/admin/members',
    icon: (<svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="7" cy="8" r="3" /><circle cx="14" cy="8" r="2.5" /><path d="M2 17c0-2.8 2.2-5 5-5s5 2.2 5 5M12 17c0-2 1.5-4 4-4s3 1 3 3" strokeLinecap="round" /></svg>),
  },
  {
    label: 'Users',
    href: '/admin/users',
    icon: (<svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="10" cy="7" r="3" /><path d="M4 17c0-3.3 2.7-6 6-6s6 2.7 6 6" strokeLinecap="round" /></svg>),
  },
  {
    label: 'News & Content',
    href: '/admin/news',
    icon: (<svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 4h9v12H4zM13 8h3v8H4" strokeLinecap="round" strokeLinejoin="round" /><path d="M7 7h3M7 10h3M7 13h3" strokeLinecap="round" /></svg>),
  },
  {
    label: 'Events',
    href: '/admin/events',
    icon: (<svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="4" width="14" height="14" rx="2" /><path d="M3 8h14M7 3v3M13 3v3" strokeLinecap="round" /></svg>),
  },
  {
    label: 'Reports',
    href: '/admin/reports',
    icon: (<svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 15V8M9 15V5M14 15v-4" strokeLinecap="round" /><path d="M3 18h15" strokeLinecap="round" /></svg>),
  },
];

export const AdminShell = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [user] = useState<StoredUser | null>(() =>
    typeof window === 'undefined' ? null : getStoredUser<StoredUser>() ?? {},
  );
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem('admin.sidebar.collapsed') === '1';
  });

  const toggleCollapsed = () => {
    setCollapsed((v) => {
      const next = !v;
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('admin.sidebar.collapsed', next ? '1' : '0');
      }
      return next;
    });
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!getAuthToken()) {
      router.replace(routes.auth.login);
      return;
    }
    const u = getStoredUser<StoredUser>();
    if (u?.role !== 'ADMIN') {
      router.replace('/member');
    }
  }, [router]);

  const handleLogout = () => {
    clearAuthSession();
    router.push(routes.home);
  };

  if (!user) return null;

  const displayName = user.fullName || [user.firstName, user.lastName].filter(Boolean).join(' ') || user.username || 'Admin';

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
              <span className="text-[9px] uppercase tracking-widest text-[#48C184]">Admin Panel</span>
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
          <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5"
            className={cn('transition-transform duration-200', collapsed && 'rotate-180')} aria-hidden="true">
            <path d="M12 5l-5 5 5 5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <nav className="flex-1 overflow-y-auto overflow-x-hidden p-2">
          <ul className="flex flex-col gap-0.5">
            {MENU.map((item) => {
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
              {(user.firstName?.[0] ?? user.fullName?.[0] ?? user.username?.[0] ?? 'A').toUpperCase()}
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-[#022D5A]">{displayName}</p>
                <p className="truncate text-[10px] uppercase tracking-wider text-[#48C184]">Administrator</p>
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

      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-slate-900/30 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top header */}
        <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-700 hover:bg-slate-100 lg:hidden"
              aria-label="Open menu"
            >
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h12M4 10h12M4 14h12" strokeLinecap="round" /></svg>
            </button>
            <div className="hidden items-center gap-2 md:flex">
              <span className="rounded-full bg-[#48C184]/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#48C184]">
                Admin
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Institution Control Panel
              </span>
            </div>
          </div>

          {/* User avatar dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setUserMenuOpen((v) => !v)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[#035CB3] text-sm font-bold text-white transition-colors hover:bg-[#024A8F]"
              aria-label="Open user menu"
              aria-expanded={userMenuOpen}
            >
              {(user.firstName?.[0] ?? user.fullName?.[0] ?? user.username?.[0] ?? 'A').toUpperCase()}
            </button>
            {userMenuOpen && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setUserMenuOpen(false)} aria-hidden="true" />
                <div role="menu" className="absolute right-0 top-10 z-30 w-52 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                  <div className="border-b border-slate-100 px-4 py-3">
                    <p className="truncate text-sm font-bold text-[#035CB3]">{displayName}</p>
                    <p className="truncate text-[11px] text-slate-500">{user.email ?? ''}</p>
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
        </header>

        {/* Breadcrumb bar */}
        <div className="border-b border-slate-100 bg-white px-4 py-1.5 text-xs text-slate-500 lg:px-6">
          <span className="font-semibold text-[#035CB3]">Admin</span>
          {' / '}
          {MENU.find((m) => m.href === pathname)?.label ?? 'Overview'}
        </div>

        <main className="flex-1 bg-slate-50 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
};
