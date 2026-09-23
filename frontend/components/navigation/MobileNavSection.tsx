'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { NavigationEntry, NavigationItem } from '@/types/navigation';
import { cn } from '@/lib/cn';
import { ChevronIcon } from './ChevronIcon';

interface MobileNavSectionProps {
  entry: NavigationEntry;
  active?: boolean;
  onNavigate: () => void;
}

const MobileSubItem = ({
  item,
  onNavigate,
  depth = 0,
}: {
  item: NavigationItem;
  onNavigate: () => void;
  depth?: number;
}) => {
  const [open, setOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;

  if (!hasChildren && item.href) {
    return (
      <li>
        {item.external ? (
          <a
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onNavigate}
            className="block rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#035CB3]"
          >
            {item.label}
          </a>
        ) : (
          <Link
            href={item.href}
            onClick={onNavigate}
            className="block rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#035CB3]"
          >
            {item.label}
          </Link>
        )}
      </li>
    );
  }

  return (
    <li>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-50"
        aria-expanded={open}
      >
        <span>{item.label}</span>
        <ChevronIcon className={cn('h-3.5 w-3.5 transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="ml-3 border-l border-slate-200 pl-2">
          {item.href && (
            <Link
              href={item.href}
              onClick={onNavigate}
              className="block rounded-md px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 hover:text-[#035CB3]"
            >
              View all
            </Link>
          )}
          <ul>
            {item.children!.map((child) => (
              <MobileSubItem key={child.label} item={child} onNavigate={onNavigate} depth={depth + 1} />
            ))}
          </ul>
        </div>
      )}
    </li>
  );
};

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
          active ? 'text-[#035CB3]' : 'text-slate-800 hover:bg-slate-50 hover:text-[#035CB3]',
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
          active ? 'text-[#035CB3]' : 'text-slate-800 hover:bg-slate-50',
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
              className="block rounded-md px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500 hover:text-[#035CB3]"
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
                        className="block rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#035CB3]"
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
                <MobileSubItem key={item.label} item={item} onNavigate={onNavigate} />
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};
