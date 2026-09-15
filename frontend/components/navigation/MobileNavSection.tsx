'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { NavigationEntry } from '@/types/navigation';
import { cn } from '@/lib/cn';
import { ChevronIcon } from './ChevronIcon';

interface MobileNavSectionProps {
  entry: NavigationEntry;
  active?: boolean;
  onNavigate: () => void;
}

export const MobileNavSection = ({ entry, active, onNavigate }: MobileNavSectionProps) => {
  const [open, setOpen] = useState(false);

  const hasSubmenu = !!entry.groups?.length || !!entry.children?.length;

  if (!hasSubmenu && entry.href) {
    return (
      <Link
        href={entry.href}
        onClick={onNavigate}
        className={cn(
          'block rounded-md px-3 py-3 text-base font-medium transition-colors',
          active ? 'text-[#0047AB]' : 'text-slate-800 hover:bg-slate-50 hover:text-[#0047AB]',
        )}
      >
        {entry.label}
      </Link>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'flex w-full items-center justify-between rounded-md px-3 py-3 text-left text-base font-medium transition-colors',
          active ? 'text-[#0047AB]' : 'text-slate-800 hover:bg-slate-50',
        )}
        aria-expanded={open}
      >
        <span>{entry.label}</span>
        <ChevronIcon className={cn('h-4 w-4 transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="ml-3 mt-1 border-l border-slate-200 pl-3 pb-2">
          {entry.href && (
            <Link
              href={entry.href}
              onClick={onNavigate}
              className="block rounded-md px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500 hover:text-[#0047AB]"
            >
              View overview
            </Link>
          )}

          {entry.groups?.map((group) => (
            <div key={group.label} className="mt-2 first:mt-0">
              <p className="px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                {group.label}
              </p>
              <ul>
                {group.items.map((item) => (
                  <li key={item.label}>
                    {item.href && (
                      <Link
                        href={item.href}
                        onClick={onNavigate}
                        className="block rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#0047AB]"
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {entry.children && (
            <ul>
              {entry.children.map((item) => (
                <li key={item.label}>
                  {item.href && (
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      className="block rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#0047AB]"
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};
