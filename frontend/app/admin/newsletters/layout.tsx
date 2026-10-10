import type { ReactNode } from 'react';
import { NewsletterTabs } from './NewsletterTabs';

export const metadata = { title: 'Newsletter — Admin' };

export default function NewslettersAdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="p-4 sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#022D5A] sm:text-2xl">Newsletter</h1>
          <p className="text-xs text-slate-500 sm:text-sm">Manage subscribers, compose and send campaigns.</p>
        </div>
      </div>
      <NewsletterTabs />
      {children}
    </div>
  );
}
