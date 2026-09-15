import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

type BadgeTone = 'primary' | 'accent' | 'muted' | 'success' | 'warning';

interface BadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
}

const toneMap: Record<BadgeTone, string> = {
  primary: 'bg-blue-50 text-[#0047AB] border-blue-100',
  accent: 'bg-[#66FF00]/15 text-[#082B55] border-[#66FF00]/40',
  muted: 'bg-slate-100 text-slate-700 border-slate-200',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
};

export const Badge = ({ children, tone = 'primary', className }: BadgeProps) => (
  <span
    className={cn(
      'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider',
      toneMap[tone],
      className,
    )}
  >
    {children}
  </span>
);
