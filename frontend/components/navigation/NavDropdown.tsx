'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import type { NavigationEntry } from '@/types/navigation';
import { cn } from '@/lib/cn';
import { ChevronIcon } from './ChevronIcon';
import { MegaMenu } from './MegaMenu';
import { DropdownMenu } from './DropdownMenu';

interface NavDropdownProps {
  entry: NavigationEntry;
  active?: boolean;
}

/**
 * Hover intent + keyboard navigation for menu entries.
 * The panel is anchored directly to the trigger's wrapper (no vertical gap
 * that would create a flicker dead-zone).
 * The blur backdrop is portalled to <body> to escape the sticky header's
 * stacking context so it can visually cover the page hero.
 */
export const NavDropdown = ({ entry, active }: NavDropdownProps) => {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const cancelClose = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  }, [cancelClose]);

  useEffect(() => cancelClose, [cancelClose]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const handleFocusOut = (event: React.FocusEvent<HTMLDivElement>) => {
    const next = event.relatedTarget as Node | null;
    if (!wrapperRef.current || !next || !wrapperRef.current.contains(next)) {
      setOpen(false);
    }
  };

  const TriggerContent = (
    <>
      {entry.label}
      <ChevronIcon
        className={cn('transition-transform', open && 'rotate-180')}
      />
    </>
  );

  const showBackdrop =
    open && (!!entry.groups?.length || !!entry.children?.length);

  return (
    <div
      ref={wrapperRef}
      className="relative"
      onMouseEnter={() => {
        cancelClose();
        setOpen(true);
      }}
      onMouseLeave={scheduleClose}
      onFocus={cancelClose}
      onBlur={handleFocusOut}
    >
      {entry.href ? (
        <Link
          href={entry.href}
          className={cn(
            'inline-flex items-center gap-1 whitespace-nowrap rounded-md px-2 py-1.5 text-sm font-medium transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0047AB]',
            active ? 'text-[#0047AB]' : 'text-slate-700 hover:text-[#0047AB]',
          )}
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={() => setOpen(false)}
        >
          {TriggerContent}
        </Link>
      ) : (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={cn(
            'inline-flex items-center gap-1 whitespace-nowrap rounded-md px-2 py-1.5 text-sm font-medium transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0047AB]',
            active ? 'text-[#0047AB]' : 'text-slate-700 hover:text-[#0047AB]',
          )}
          aria-haspopup="menu"
          aria-expanded={open}
        >
          {TriggerContent}
        </button>
      )}

      {showBackdrop && typeof document !== 'undefined' &&
        createPortal(
          <div
            aria-hidden="true"
            className="fixed inset-x-0 bottom-0 top-16 z-[30] bg-white/10 backdrop-blur-[2px]"
            onMouseEnter={scheduleClose}
          />,
          document.body,
        )}

      {open && (
        <div
          className={cn(
            'absolute left-0 top-full z-[60] pt-2',
            entry.layout === 'mega' && 'left-1/2 -translate-x-1/2',
          )}
        >
          {entry.layout === 'mega' && entry.groups ? (
            <MegaMenu entry={entry} onNavigate={() => setOpen(false)} />
          ) : entry.children ? (
            <DropdownMenu items={entry.children} onNavigate={() => setOpen(false)} />
          ) : null}
        </div>
      )}
    </div>
  );
};
