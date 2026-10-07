'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import type { NavigationItem } from '@/types/navigation';
import { cn } from '@/lib/cn';

interface DropdownMenuProps {
  items: NavigationItem[];
  onNavigate?: () => void;
  className?: string;
}

const SubMenuChevron = ({ flip }: { flip?: boolean }) => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={cn('ml-auto shrink-0', flip && 'rotate-180')}>
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const DropdownItem = ({
  item,
  onNavigate,
  isLast,
}: {
  item: NavigationItem;
  onNavigate?: () => void;
  isLast: boolean;
}) => {
  const [subOpen, setSubOpen] = useState(false);
  const [flipLeft, setFlipLeft] = useState(false);
  const itemRef = useRef<HTMLLIElement>(null);
  const hasChildren = item.children && item.children.length > 0;

  useEffect(() => {
    if (!subOpen || !itemRef.current) return;
    const rect = itemRef.current.getBoundingClientRect();
    const spaceRight = window.innerWidth - rect.right;
    setFlipLeft(spaceRight < 260);
  }, [subOpen]);

  return (
    <li
      ref={itemRef}
      className="relative"
      onMouseEnter={() => hasChildren && setSubOpen(true)}
      onMouseLeave={() => hasChildren && setSubOpen(false)}
    >
      {item.href ? (
        item.external ? (
          <a
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onNavigate}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 transition-colors',
              'hover:bg-slate-50 hover:text-[#035CB3]',
              'focus-visible:outline-none focus-visible:bg-slate-50 focus-visible:text-[#035CB3]',
              !isLast && 'border-b border-slate-100',
            )}
            role="menuitem"
          >
            {item.label}
          </a>
        ) : (
          <Link
            href={item.href}
            onClick={onNavigate}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 transition-colors',
              'hover:bg-slate-50 hover:text-[#035CB3]',
              'focus-visible:outline-none focus-visible:bg-slate-50 focus-visible:text-[#035CB3]',
              !isLast && 'border-b border-slate-100',
            )}
            role="menuitem"
          >
            {item.label}
            {hasChildren && <SubMenuChevron flip={flipLeft} />}
          </Link>
        )
      ) : hasChildren ? (
        <button
          type="button"
          onClick={(e) => e.preventDefault()}
          className={cn(
            'flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-slate-700 transition-colors',
            'hover:bg-slate-50 hover:text-[#035CB3]',
            'focus-visible:outline-none focus-visible:bg-slate-50 focus-visible:text-[#035CB3]',
            !isLast && 'border-b border-slate-100',
          )}
          role="menuitem"
          aria-haspopup="true"
          aria-expanded={subOpen}
        >
          {item.label}
          <SubMenuChevron flip={flipLeft} />
        </button>
      ) : item.inactive ? (
        <button
          type="button"
          onClick={(e) => e.preventDefault()}
          className={cn(
            'flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-slate-700 transition-colors',
            'hover:bg-slate-50 hover:text-[#035CB3]',
            'focus-visible:outline-none focus-visible:bg-slate-50 focus-visible:text-[#035CB3]',
            !isLast && 'border-b border-slate-100',
          )}
          role="menuitem"
        >
          {item.label}
        </button>
      ) : (
        <span
          className={cn(
            'flex cursor-not-allowed items-center gap-2 px-4 py-2.5 text-sm text-slate-400',
            !isLast && 'border-b border-slate-100',
          )}
          role="menuitem"
          aria-disabled="true"
          title="Coming soon"
        >
          <span>{item.label}</span>
          <span className="ml-auto rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Soon
          </span>
        </span>
      )}
      {hasChildren && subOpen && (
        <div className={cn('absolute top-0 z-[70]', flipLeft ? 'right-full pr-1' : 'left-full pl-1')}>
          <div className="w-60 overflow-visible rounded-lg border border-slate-200 bg-white shadow-[0_20px_50px_-20px_rgba(15,23,42,0.25)]" role="menu">
            <ul className="flex flex-col">
              {item.children!.map((child, i) => (
                <DropdownItem
                  key={child.label}
                  item={child}
                  onNavigate={onNavigate}
                  isLast={i === item.children!.length - 1}
                />
              ))}
            </ul>
          </div>
        </div>
      )}
    </li>
  );
};

export const DropdownMenu = ({ items, onNavigate, className }: DropdownMenuProps) => (
  <div
    className={cn(
      'w-64 overflow-visible rounded-lg border border-slate-200 bg-white shadow-[0_20px_50px_-20px_rgba(15,23,42,0.25)]',
      className,
    )}
    role="menu"
  >
    <ul className="flex flex-col">
      {items.map((item, index) => (
        <DropdownItem
          key={item.label}
          item={item}
          onNavigate={onNavigate}
          isLast={index === items.length - 1}
        />
      ))}
    </ul>
  </div>
);
