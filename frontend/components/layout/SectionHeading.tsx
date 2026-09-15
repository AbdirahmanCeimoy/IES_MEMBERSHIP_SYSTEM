import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
  actions?: ReactNode;
  as?: 'h1' | 'h2' | 'h3';
}

export const SectionHeading = ({
  eyebrow,
  title,
  description,
  align = 'left',
  className,
  actions,
  as: Tag = 'h2',
}: SectionHeadingProps) => {
  const isCenter = align === 'center';
  return (
    <div
      className={cn(
        'flex flex-col gap-3',
        isCenter && 'items-center text-center',
        !isCenter && actions && 'sm:flex-row sm:items-start sm:justify-between sm:gap-6',
        className,
      )}
    >
      <div className={cn('flex flex-col gap-2', isCenter && 'items-center')}>
        {eyebrow && (
          <span className="text-xs font-semibold uppercase tracking-widest text-[#0047AB]">
            {eyebrow}
          </span>
        )}
        <Tag className="text-2xl font-bold tracking-tight text-[#082B55] sm:text-3xl">
          {title}
        </Tag>
        {description && (
          <p className={cn('max-w-2xl text-sm text-slate-600 sm:text-base', isCenter && 'mx-auto')}>
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex shrink-0 flex-wrap items-center gap-2 sm:pt-1">{actions}</div>
      )}
    </div>
  );
};
