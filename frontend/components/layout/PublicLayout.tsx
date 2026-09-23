'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { PublicHeader } from '@/components/navigation/PublicHeader';
import { Footer } from './Footer';

const HIDE_CTA_PATHS = ['/opportunities/cv-repository/view-cvs'];

interface PublicLayoutProps {
  children: ReactNode;
}

export const PublicLayout = ({ children }: PublicLayoutProps) => {
  const pathname = usePathname();
  const hideCta = HIDE_CTA_PATHS.includes(pathname);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <PublicHeader />
      <main className="flex-1">{children}</main>
      <Footer hideCta={hideCta} />
    </div>
  );
};
