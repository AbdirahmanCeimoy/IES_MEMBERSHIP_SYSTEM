'use client';

import Link from 'next/link';
import type { NavigationItem } from '@/types/navigation';
import { cn } from '@/lib/cn';

interface DropdownMenuProps {
  items: NavigationItem[];
  onNavigate?: () => void;
  className?: string;
}

export const DropdownMenu = ({ items, onNavigate, className }: DropdownMenuProps) => (
  <div
    className={cn(
      'w-64 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_20px_50px_-20px_rgba(15,23,42,0.25)]',
      className,
    )}
    role="menu"
  >
    <ul className="flex flex-col">
      {items.map((item, index) => (
        <li key={item.label}>
          {item.href && (
            <Link
              href={item.href}
              onClick={onNavigate}
              className={cn(
                'block px-4 py-2.5 text-sm text-slate-700 transition-colors',
                'hover:bg-slate-50 hover:text-[#0047AB]',
                'focus-visible:outline-none focus-visible:bg-slate-50 focus-visible:text-[#0047AB]',
                index !== items.length - 1 && 'border-b border-slate-100',
              )}
              role="menuitem"
            >
              {item.label}
            </Link>
          )}
        </li>
      ))}
    </ul>
  </div>
);
