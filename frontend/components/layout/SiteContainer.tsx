import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface SiteContainerProps {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'section' | 'main' | 'header' | 'footer' | 'nav';
}

export const SiteContainer = ({
  children,
  className,
  as: Tag = 'div',
}: SiteContainerProps) => (
  <Tag className={cn('mx-auto w-full max-w-7xl px-2 sm:px-4 lg:px-6', className)}>
    {children}
  </Tag>
);
