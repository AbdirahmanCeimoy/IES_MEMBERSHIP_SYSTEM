import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
  className?: string;
}

export const EmptyState = ({ title, description, action, icon, className }: EmptyStateProps) => (
  <div
    className={cn(
      'flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center',
      className,
    )}
  >
    {icon && <div className="text-slate-400">{icon}</div>}
    <h3 className="text-base font-semibold text-[#082B55]">{title}</h3>
    {description && <p className="max-w-md text-sm text-slate-600">{description}</p>}
    {action && <div className="mt-2">{action}</div>}
  </div>
);
