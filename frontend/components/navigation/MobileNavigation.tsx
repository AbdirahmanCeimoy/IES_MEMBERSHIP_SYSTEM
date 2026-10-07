'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { publicNavigation } from '@/config/navigation';
import { site } from '@/config/site';
import type { NavigationEntry } from '@/types/navigation';
import { cn } from '@/lib/cn';
import { MobileNavSection } from './MobileNavSection';
import { Button } from '@/components/ui/Button';

const collectHrefs = (entry: NavigationEntry): string[] => {
  const hrefs: string[] = [];
  if (entry.href) hrefs.push(entry.href);
  const walk = (items?: { href?: string; children?: typeof items }[]) => {
    items?.forEach((c) => {
      if (c.href) hrefs.push(c.href);
      walk(c.children);
    });
  };
  walk(entry.children);
  entry.groups?.forEach((g) => g.items.forEach((i) => i.href && hrefs.push(i.href)));
  return hrefs;
};

const isEntryActive = (pathname: string | null, entry: NavigationEntry) => {
  if (!pathname) return false;
  const hrefs = collectHrefs(entry);
  return hrefs.some((href) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`),
  );
};

export const MobileNavigation = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);
  return (
    <div className="xl:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#035CB3]"
        aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={open}
        aria-controls="mobile-navigation"
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 6l12 12M18 6l-12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        )}
      </button>

      {open && (
        <div
          className="absolute inset-x-0 top-full z-40 h-[100dvh] bg-slate-900/20"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      <div
        id="mobile-navigation"
        className={cn(
          'absolute inset-x-0 top-full z-50 origin-top border-b border-slate-200 bg-white shadow-lg transition-all duration-200',
          open ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-2 opacity-0',
        )}
        aria-hidden={!open}
      >
        <nav
          aria-label="Mobile"
          className="mx-auto max-h-[calc(100dvh-4rem)] w-full md:max-h-[calc(100dvh-6.5rem)] max-w-3xl overflow-y-auto px-4 pb-5 pt-3 sm:px-6"
        >
          <div className="flex flex-col">
            {publicNavigation.map((entry) => (
              <MobileNavSection
                key={entry.label}
                entry={entry}
                active={isEntryActive(pathname, entry)}
                onNavigate={() => setOpen(false)}
              />
            ))}
          </div>

          <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
            <Button
              href={site.cta.primary.href}
              variant="primary"
              size="lg"
              className="w-full justify-center rounded-lg"
            >
              {site.cta.primary.label}
            </Button>
            <Button
              href={site.cta.secondary.href}
              variant="secondary"
              size="lg"
              className="w-full justify-center rounded-lg"
            >
              {site.cta.secondary.label}
            </Button>
          </div>
        </nav>
      </div>
    </div>
  );
};
