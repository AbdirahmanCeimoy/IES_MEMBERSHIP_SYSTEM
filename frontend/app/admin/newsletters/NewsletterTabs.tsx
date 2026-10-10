'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/cn';

const TABS = [
  { label: 'Dashboard', href: '/admin/newsletters' },
  { label: 'Subscribers', href: '/admin/newsletters/subscribers' },
  { label: 'Composer', href: '/admin/newsletters/composer' },
  { label: 'History', href: '/admin/newsletters/history' },
];

const isActive = (pathname: string, href: string) => {
  if (href === '/admin/newsletters') return pathname === href;
  return pathname === href || pathname.startsWith(href + '/');
};

export const NewsletterTabs = () => {
  const pathname = usePathname();
  return (
    <nav className="mb-6 overflow-x-auto border-b border-slate-200">
      <ul className="flex min-w-max gap-1">
        {TABS.map((tab) => {
          const active = isActive(pathname ?? '', tab.href);
          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                className={cn(
                  'inline-block border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors',
                  active
                    ? 'border-[#035CB3] text-[#022D5A]'
                    : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-[#022D5A]',
                )}
              >
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
