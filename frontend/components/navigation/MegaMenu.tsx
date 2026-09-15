'use client';

import Link from 'next/link';
import type { NavigationEntry } from '@/types/navigation';
import { cn } from '@/lib/cn';

interface MegaMenuProps {
  entry: NavigationEntry;
  onNavigate?: () => void;
  className?: string;
}

export const MegaMenu = ({ entry, onNavigate, className }: MegaMenuProps) => {
  if (!entry.groups?.length) return null;

  return (
    <div
      className={cn(
        'w-[min(44rem,calc(100vw-1rem))] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_20px_50px_-20px_rgba(15,23,42,0.25)]',
        className,
      )}
      role="menu"
    >
      <div
        className={cn(
          'grid gap-0 divide-slate-100',
          entry.groups.length === 1 && 'grid-cols-1',
          entry.groups.length === 2 && 'grid-cols-2 sm:divide-x',
          entry.groups.length >= 3 && 'grid-cols-1 sm:grid-cols-3 sm:divide-x',
        )}
      >
        {entry.groups.map((group) => (
          <div key={group.label} className="flex flex-col gap-1 p-4">
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
              {group.label}
            </p>
            <ul className="flex flex-col">
              {group.items.map((item) => (
                <li key={item.label}>
                  {item.href && (
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      className="group block rounded-md px-2 py-1.5 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0047AB]"
                      role="menuitem"
                    >
                      <span className="block text-sm font-medium text-slate-800 group-hover:text-[#0047AB]">
                        {item.label}
                      </span>
                      {item.description && (
                        <span className="mt-0.5 block text-[11px] leading-snug text-slate-500">
                          {item.description}
                        </span>
                      )}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {entry.href && (
        <div className="border-t border-slate-100 bg-slate-50 px-4 py-2.5">
          <Link
            href={entry.href}
            onClick={onNavigate}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#0047AB] hover:underline"
          >
            View all {entry.label} ›
          </Link>
        </div>
      )}
    </div>
  );
};
