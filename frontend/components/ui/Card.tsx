import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

type CardTone = 'default' | 'muted' | 'primary';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  tone?: CardTone;
  padded?: boolean;
  interactive?: boolean;
}

const toneMap: Record<CardTone, string> = {
  default: 'bg-white border border-slate-200',
  muted: 'bg-slate-50 border border-slate-200',
  primary: 'bg-[#035CB3] text-white border border-[#035CB3]',
};

export const Card = ({
  children,
  className,
  tone = 'default',
  padded = true,
  interactive = false,
  ...rest
}: CardProps) => (
  <div
    className={cn(
      'rounded-lg',
      toneMap[tone],
      padded && 'p-5',
      interactive && 'transition-colors hover:border-[#035CB3]',
      className,
    )}
    {...rest}
  >
    {children}
  </div>
);

interface CardHeaderProps {
  title: ReactNode;
  eyebrow?: ReactNode;
  description?: ReactNode;
  className?: string;
}

export const CardHeader = ({ title, eyebrow, description, className }: CardHeaderProps) => (
  <div className={cn('flex flex-col gap-1', className)}>
    {eyebrow && (
      <span className="text-[11px] font-semibold uppercase tracking-widest text-[#035CB3]">
        {eyebrow}
      </span>
    )}
    <h3 className="text-base font-semibold text-[#022D5A]">{title}</h3>
    {description && <p className="text-sm text-slate-600">{description}</p>}
  </div>
);
