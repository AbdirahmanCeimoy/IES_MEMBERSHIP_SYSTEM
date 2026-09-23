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
      'inline-flex items-center whitespace-nowrap rounded-md px-1.5 py-1.5 text-[13px] font-medium transition-colors',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#035CB3]',
      active
        ? 'text-[#035CB3]'
        : 'text-slate-700 hover:text-[#035CB3]',
      className,
    )}
    aria-current={active ? 'page' : undefined}
  >
    {label}
  </Link>
);
