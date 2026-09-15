'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { publicNavigation } from '@/config/navigation';
import { site } from '@/config/site';
import { routes } from '@/config/routes';
import type { NavigationEntry } from '@/types/navigation';
import { cn } from '@/lib/cn';
import { MobileNavSection } from './MobileNavSection';
import { Button } from '@/components/ui/Button';

const collectHrefs = (entry: NavigationEntry): string[] => {
  const hrefs: string[] = [];
  if (entry.href) hrefs.push(entry.href);
  entry.children?.forEach((c) => c.href && hrefs.push(c.href));
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
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0047AB]"
        aria-label="Open navigation menu"
        aria-expanded={open}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      <div
        className={cn(
          'fixed inset-0 z-50 flex flex-col bg-white transition-opacity duration-200',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        aria-hidden={!open}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
          <Link href={routes.home} onClick={() => setOpen(false)} className="flex items-center gap-2">
            <div className="relative h-9 w-9">
              <Image src={site.logo} alt={`${site.shortName} logo`} fill className="object-contain" />
            </div>
            <span className="text-sm font-bold text-[#0047AB]">{site.shortName}omalia</span>
          </Link>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100"
            aria-label="Close menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6l-12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 py-3">
          {publicNavigation.map((entry) => (
            <MobileNavSection
              key={entry.label}
              entry={entry}
              active={isEntryActive(pathname, entry)}
              onNavigate={() => setOpen(false)}
            />
          ))}
        </div>

        <div className="border-t border-slate-100 bg-white p-4">
          <div className="flex flex-col gap-2">
            <Button
              href={site.cta.primary.href}
              variant="primary"
              size="lg"
              className="w-full justify-center"
            >
              {site.cta.primary.label}
            </Button>
            <Button
              href={site.cta.secondary.href}
              variant="secondary"
              size="lg"
              className="w-full justify-center"
            >
              {site.cta.secondary.label}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
