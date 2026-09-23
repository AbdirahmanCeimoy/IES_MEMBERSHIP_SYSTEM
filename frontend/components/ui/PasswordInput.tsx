'use client';

import { useState, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

type PasswordInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>;

/** Password input with a show/hide eye button. */
export const PasswordInput = ({ className, ...rest }: PasswordInputProps) => {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <input
        {...rest}
        type={visible ? 'text' : 'password'}
        className={cn(
          'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 pr-10 text-sm font-normal',
          'focus:border-[#035CB3] focus:outline-none focus:ring-1 focus:ring-[#035CB3]',
          className,
        )}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? 'Hide password' : 'Show password'}
        className="absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-500 hover:text-[#035CB3] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#035CB3]"
        tabIndex={-1}
      >
        {visible ? (
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 3l14 14" />
            <path d="M8.6 8.6a2 2 0 0 0 2.8 2.8" />
            <path d="M6.5 6.5C5.1 7.4 3.9 8.7 3 10c1.8 3 4.4 5 7 5 1 0 1.9-.2 2.7-.6" />
            <path d="M10.5 5.1c3 .3 5.4 2.2 6.5 4.9-.4.7-.9 1.4-1.5 1.9" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 10c1.8-3 4.4-5 7-5s5.2 2 7 5c-1.8 3-4.4 5-7 5s-5.2-2-7-5z" />
            <circle cx="10" cy="10" r="2.2" />
          </svg>
        )}
      </button>
    </div>
  );
};
