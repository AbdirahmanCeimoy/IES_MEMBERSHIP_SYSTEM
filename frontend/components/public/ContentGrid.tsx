import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface ContentGridProps {
  children: ReactNode;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
  gap?: 'sm' | 'md' | 'lg';
}

const gapMap = { sm: 'gap-3', md: 'gap-4', lg: 'gap-6' };

const columnMap: Record<1 | 2 | 3 | 4, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
};

export const ContentGrid = ({ children, columns = 3, className, gap = 'md' }: ContentGridProps) => (
  <div className={cn('grid', gapMap[gap], columnMap[columns], className)}>{children}</div>
);
