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

export const PageHero = ({
  eyebrow,
  title,
  description,
  actions,
  breadcrumbs: _breadcrumbs,
  children,
  tone = 'muted',
  align = 'center',
  className,
}: PageHeroProps) => {
  void _breadcrumbs;
  const isCenter = align === 'center';
  const isPrimary = tone === 'primary' || tone === 'muted';

  if (isPrimary) {
    return (
      <section
        className={cn(
          'relative overflow-hidden bg-gradient-to-br from-[#022D5A] via-[#035CB3] to-[#024A8F] py-16 text-white sm:py-20',
          className,
        )}
      >
        <div className="absolute inset-0">
          <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-[#48C184]/10 blur-3xl" />
          <div className="absolute -bottom-10 right-0 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute right-1/4 top-1/4 h-40 w-40 rounded-full bg-[#035CB3]/30 blur-2xl" />
        </div>
        <SiteContainer className="relative text-center">
          {eyebrow && (
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#48C184]">
              {eyebrow}
            </p>
          )}
          <h1 className="mx-auto mt-3 max-w-3xl text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            {title}
          </h1>
          {description && (
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-blue-100 sm:text-base">
              {description}
            </p>
          )}
          {actions && (
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              {actions}
            </div>
          )}
          {children}
        </SiteContainer>
      </section>
    );
  }

  return (
    <section className={cn('bg-white border-b border-slate-200', className)}>
      <SiteContainer className="py-8 sm:py-12">
        <div className={cn('flex flex-col gap-4', isCenter && 'items-center text-center')}>
          {eyebrow && (
            <span className="text-xs font-semibold uppercase tracking-widest text-[#035CB3]">
              {eyebrow}
            </span>
          )}
          <h1 className={cn('text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-[#022D5A]')}>
            {title}
          </h1>
          {description && (
            <p className={cn('max-w-3xl text-sm sm:text-base text-slate-600', isCenter && 'mx-auto')}>
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
