'use client';

import { usePathname } from 'next/navigation';
import { publicNavigation } from '@/config/navigation';
import type { NavigationEntry } from '@/types/navigation';
import { NavItem } from './NavItem';
import { NavDropdown } from './NavDropdown';

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
  return hrefs.some((href) => {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(`${href}/`);
  });
};

export const DesktopNavigation = () => {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary" className="hidden items-center gap-0.5 xl:flex">
      {publicNavigation.map((entry) => {
        const active = isEntryActive(pathname, entry);
        const hasSubmenu =
          entry.layout === 'mega' || entry.layout === 'dropdown' ||
          !!entry.groups?.length || !!entry.children?.length;

        if (hasSubmenu) {
          return <NavDropdown key={entry.label} entry={entry} active={active} />;
        }

        return entry.href ? (
          <NavItem key={entry.label} label={entry.label} href={entry.href} active={active} />
        ) : null;
      })}
    </nav>
  );
};
