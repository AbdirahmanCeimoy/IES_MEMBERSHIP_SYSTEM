'use client';

import { usePathname } from 'next/navigation';
import { PublicLayout } from '@/components/layout/PublicLayout';

type AppShellProps = {
  children: React.ReactNode;
};

const isPathIn = (pathname: string | null, prefixes: readonly string[]) =>
  !!pathname && prefixes.some((p) => pathname === p || pathname.startsWith(`${p}/`));

const APP_ROUTES = ['/dashboard', '/admin', '/member'] as const;
const AUTH_ROUTES = ['/login', '/forgot-password', '/reset-password', '/verify-otp', '/signup', '/register', '/initial-profile'] as const;

const AppShell = ({ children }: AppShellProps) => {
  const pathname = usePathname();

  if (isPathIn(pathname, APP_ROUTES)) {
    return <main className="min-h-screen bg-slate-50">{children}</main>;
  }

  if (isPathIn(pathname, AUTH_ROUTES)) {
    return <main className="min-h-screen bg-slate-50">{children}</main>;
  }

  return <PublicLayout>{children}</PublicLayout>;
};

export default AppShell;
