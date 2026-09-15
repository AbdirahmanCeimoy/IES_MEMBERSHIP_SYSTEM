'use client';

import { cn } from '@/lib/cn';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  label?: string;
  className?: string;
  /** Max number of page-number buttons shown between the arrows. Default 3. */
  visiblePages?: number;
}

const buildVisiblePages = (current: number, total: number, visible: number): number[] => {
  if (total <= visible) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const half = Math.floor(visible / 2);
  let start = Math.max(1, current - half);
  let end = start + visible - 1;
  if (end > total) {
    end = total;
    start = Math.max(1, end - visible + 1);
  }
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};

export const Pagination = ({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  label = 'items',
  className,
  visiblePages = 3,
}: PaginationProps) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safeCurrent = Math.min(Math.max(1, currentPage), totalPages);
  const rangeStart = (safeCurrent - 1) * pageSize + 1;
  const rangeEnd = Math.min(safeCurrent * pageSize, totalItems);
  const pages = buildVisiblePages(safeCurrent, totalPages, visiblePages);

  if (totalItems === 0) return null;

  const prevDisabled = safeCurrent <= 1;
  const nextDisabled = safeCurrent >= totalPages;

  return (
    <nav
      className={cn(
        'mt-4 flex flex-col items-center justify-between gap-3 border-t border-slate-100 pt-4 sm:flex-row',
        className,
      )}
      aria-label="Pagination"
    >
      <p className="text-xs text-slate-500">
        Showing <span className="font-semibold text-slate-700">{rangeStart}</span>
        {rangeEnd > rangeStart && (
          <>
            {' '}–{' '}
            <span className="font-semibold text-slate-700">{rangeEnd}</span>
          </>
        )}{' '}
        of <span className="font-semibold text-slate-700">{totalItems}</span> {label}
      </p>

      <ul className="flex items-center gap-1">
        <li>
          <button
            type="button"
            onClick={() => onPageChange(safeCurrent - 1)}
            disabled={prevDisabled}
            aria-label="Previous page"
            className={cn(
              'inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-600 transition-colors',
              'hover:border-[#0047AB] hover:text-[#0047AB]',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0047AB]',
              prevDisabled && 'cursor-not-allowed opacity-40 hover:border-slate-200 hover:text-slate-600',
            )}
          >
            <svg width="12" height="12" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M12 5l-5 5 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </li>

        {pages.map((page) => {
          const isActive = page === safeCurrent;
          return (
            <li key={page}>
              <button
                type="button"
                onClick={() => onPageChange(page)}
                aria-current={isActive ? 'page' : undefined}
                aria-label={`Go to page ${page}`}
                className={cn(
                  'inline-flex h-8 min-w-8 items-center justify-center rounded-md border px-2 text-xs font-semibold transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0047AB]',
                  isActive
                    ? 'border-[#0047AB] bg-[#0047AB] text-white'
                    : 'border-slate-200 text-slate-700 hover:border-[#0047AB] hover:text-[#0047AB]',
                )}
              >
                {page}
              </button>
            </li>
          );
        })}

        <li>
          <button
            type="button"
            onClick={() => onPageChange(safeCurrent + 1)}
            disabled={nextDisabled}
            aria-label="Next page"
            className={cn(
              'inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-600 transition-colors',
              'hover:border-[#0047AB] hover:text-[#0047AB]',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0047AB]',
              nextDisabled && 'cursor-not-allowed opacity-40 hover:border-slate-200 hover:text-slate-600',
            )}
          >
            <svg width="12" height="12" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M8 5l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </li>
      </ul>
    </nav>
  );
};

/**
 * usePagination - headless helper for state and paged slicing.
 * Keeps page state in the URL is intentionally NOT here so callers can
 * decide: transient state, URL query, or server-side.
 */
