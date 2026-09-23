import { cn } from '@/lib/cn';

interface LoadingStateProps {
  label?: string;
  className?: string;
}

export const LoadingState = ({ label = 'Loading…', className }: LoadingStateProps) => (
  <div
    className={cn(
      'flex items-center justify-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-10 text-sm text-slate-500',
      className,
    )}
    role="status"
    aria-live="polite"
  >
    <span className="inline-block h-3 w-3 animate-pulse rounded-full bg-[#035CB3]" />
    {label}
  </div>
);
