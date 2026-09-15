import { cn } from '@/lib/cn';

export const ChevronIcon = ({ className }: { className?: string }) => (
  <svg
    className={cn('h-3 w-3', className)}
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M6 8l4 4 4-4" />
  </svg>
);
