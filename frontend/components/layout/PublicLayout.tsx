import type { ReactNode } from 'react';
import { PublicHeader } from '@/components/navigation/PublicHeader';
import { Footer } from './Footer';

interface PublicLayoutProps {
  children: ReactNode;
}

export const PublicLayout = ({ children }: PublicLayoutProps) => (
  <div className="flex min-h-screen flex-col bg-white">
    <PublicHeader />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);
