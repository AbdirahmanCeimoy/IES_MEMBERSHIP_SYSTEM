import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { SiteContainer } from './SiteContainer';

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  breadcrumbs?: ReactNode;
  children?: ReactNode;
  tone?: 'default' | 'muted' | 'primary';
  align?: 'left' | 'center';
  className?: string;
}

const toneMap = {
  default: 'bg-white border-b border-slate-200',
  muted: 'bg-slate-50 border-b border-slate-200',
  primary: 'bg-[#0047AB] text-white',
};

export const PageHero = ({
  eyebrow,
  title,
  description,
  actions,
  breadcrumbs,
  children,
  tone = 'muted',
  align = 'center',
  className,
}: PageHeroProps) => {
  const isCenter = align === 'center';
  return (
    <section className={cn(toneMap[tone], className)}>
      <SiteContainer className="py-8 sm:py-12">
        {breadcrumbs && <div className={cn('mb-4', isCenter && 'flex justify-center')}>{breadcrumbs}</div>}
        <div className={cn('flex flex-col gap-4', isCenter && 'items-center text-center')}>
          {eyebrow && (
            <span
              className={cn(
                'text-xs font-semibold uppercase tracking-widest',
                tone === 'primary' ? 'text-[#66FF00]' : 'text-[#0047AB]',
              )}
            >
              {eyebrow}
            </span>
          )}
          <h1
            className={cn(
              'text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl',
              tone === 'primary' ? 'text-white' : 'text-[#082B55]',
            )}
          >
            {title}
          </h1>
          {description && (
            <p
              className={cn(
                'max-w-3xl text-sm sm:text-base',
                tone === 'primary' ? 'text-blue-50' : 'text-slate-600',
                isCenter && 'mx-auto',
              )}
            >
              {description}
            </p>
          )}
          {actions && (
            <div className={cn('mt-2 flex flex-wrap items-center gap-3', isCenter && 'justify-center')}>
              {actions}
            </div>
          )}
          {children}
        </div>
      </SiteContainer>
    </section>
  );
};
