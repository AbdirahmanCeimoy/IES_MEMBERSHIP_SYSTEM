'use client';

import { usePathname } from 'next/navigation';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { IESAssistantWidget } from '@/components/ies-assistant/IESAssistantWidget';

type AppShellProps = {
  children: React.ReactNode;
};

const isPathIn = (pathname: string | null, prefixes: readonly string[]) =>
  !!pathname && prefixes.some((p) => pathname === p || pathname.startsWith(`${p}/`));

const APP_ROUTES = ['/dashboard', '/admin', '/member'] as const;
const AUTH_ROUTES = ['/login', '/forgot-password', '/reset-password', '/verify-otp', '/verify-email', '/signup', '/register', '/initial-profile'] as const;
const BARE_ROUTES = ['/membership/online-application-guidelines', '/membership/member-check'] as const;
// Admin workflows exclude the public widget so admin screens stay distraction-free.
const ASSISTANT_HIDDEN = ['/admin'] as const;

const AppShell = ({ children }: AppShellProps) => {
  const pathname = usePathname();
  const showAssistant = !isPathIn(pathname, ASSISTANT_HIDDEN);

  if (isPathIn(pathname, APP_ROUTES)) {
    return (
      <>
        <main className="min-h-screen bg-slate-50">{children}</main>
        {showAssistant && <IESAssistantWidget />}
      </>
    );
  }

  if (isPathIn(pathname, AUTH_ROUTES)) {
    return (
      <>
        <main className="min-h-screen bg-slate-50">{children}</main>
        {showAssistant && <IESAssistantWidget />}
      </>
    );
  }

  if (isPathIn(pathname, BARE_ROUTES)) {
    return (
      <>
        <main className="min-h-screen bg-white">{children}</main>
        {showAssistant && <IESAssistantWidget />}
      </>
    );
  }

  return (
    <>
      <PublicLayout>{children}</PublicLayout>
      {showAssistant && <IESAssistantWidget />}
    </>
  );
};

export default AppShell;
