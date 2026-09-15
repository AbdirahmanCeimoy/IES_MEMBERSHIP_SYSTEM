'use client';

import Link from 'next/link';
import { cn } from '@/lib/cn';

interface NavItemProps {
  label: string;
  href: string;
  active?: boolean;
  className?: string;
}

export const NavItem = ({ label, href, active, className }: NavItemProps) => (
  <Link
    href={href}
    className={cn(
      'inline-flex items-center whitespace-nowrap rounded-md px-2 py-1.5 text-sm font-medium transition-colors',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0047AB]',
      active
        ? 'text-[#0047AB]'
        : 'text-slate-700 hover:text-[#0047AB]',
      className,
    )}
    aria-current={active ? 'page' : undefined}
  >
    {label}
  </Link>
);
