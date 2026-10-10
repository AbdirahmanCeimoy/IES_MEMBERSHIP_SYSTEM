'use client';

import { useId, useState } from 'react';
import { apiJsonRequest } from '@/lib/apiClient';

type ServerResponse = { success: boolean; message?: string };

type Feedback =
  | { kind: 'idle' }
  | { kind: 'success'; text: string }
  | { kind: 'duplicate'; text: string }
  | { kind: 'error'; text: string };

const SUCCESS = 'Thanks for subscribing! Please check your inbox for confirmation.';
const DUPLICATE = 'This email is already subscribed.';
const INVALID = 'Please enter a valid email address.';
const ERROR = 'Unable to subscribe right now. Please try again.';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function NewsletterForm() {
  const emailId = useId();
  const feedbackId = useId();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading'>('idle');
  const [feedback, setFeedback] = useState<Feedback>({ kind: 'idle' });

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === 'loading') return;

    const trimmed = email.trim();
    if (!EMAIL_RE.test(trimmed)) {
      setFeedback({ kind: 'error', text: INVALID });
      return;
    }

    setStatus('loading');
    setFeedback({ kind: 'idle' });

    try {
      const res = await apiJsonRequest<ServerResponse>(
        '/newsletters/subscribe',
        'POST',
        { email: trimmed, source: 'footer' },
      );

      if (res.ok && res.data?.success) {
        const message = res.data?.message ?? SUCCESS;
        if (message === DUPLICATE) {
          setFeedback({ kind: 'duplicate', text: DUPLICATE });
        } else {
          setFeedback({ kind: 'success', text: SUCCESS });
          setEmail('');
        }
      } else if (res.status === 422) {
        setFeedback({ kind: 'error', text: INVALID });
      } else {
        setFeedback({ kind: 'error', text: ERROR });
      }
    } catch {
      setFeedback({ kind: 'error', text: ERROR });
    } finally {
      setStatus('idle');
    }
  };

  const loading = status === 'loading';
  const isError = feedback.kind === 'error';

  return (
    <div className="mx-auto w-full max-w-md text-center">
      <h3 className="text-sm font-bold text-slate-800">Subscribe to our Newsletter</h3>
      <p className="mt-0.5 text-[11px] text-slate-500">
        Stay informed about all IES initiatives &amp; events
      </p>

      <form
        onSubmit={onSubmit}
        noValidate
        className="mx-auto mt-2.5 flex max-w-sm items-center gap-2"
        aria-describedby={feedback.kind === 'idle' ? undefined : feedbackId}
      >
        <label htmlFor={emailId} className="sr-only">
          Email address
        </label>
        <input
          id={emailId}
          type="email"
          name="email"
          inputMode="email"
          autoComplete="email"
          required
          aria-invalid={isError || undefined}
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          className="h-9 flex-1 rounded-md border border-slate-300 bg-white px-3 text-xs text-slate-800 placeholder:text-slate-400 transition-colors focus:border-[#035CB3] focus:outline-none focus:ring-1 focus:ring-[#035CB3]/40 disabled:bg-slate-50"
        />
        <button
          type="submit"
          disabled={loading}
          aria-busy={loading}
          className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-md bg-[#035CB3] px-4 text-xs font-semibold text-white transition-colors hover:bg-[#024790] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#48C184] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? (
            <>
              <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" aria-hidden="true" />
              …
            </>
          ) : (
            'Subscribe'
          )}
        </button>
      </form>

      <p
        id={feedbackId}
        role={isError ? 'alert' : 'status'}
        aria-live="polite"
        className={`mt-1.5 min-h-[1rem] text-[11px] ${
          feedback.kind === 'idle'
            ? 'text-transparent'
            : feedback.kind === 'success'
              ? 'text-emerald-600'
              : feedback.kind === 'duplicate'
                ? 'text-slate-500'
                : 'text-red-600'
        }`}
      >
        {feedback.kind === 'idle' ? ' ' : feedback.text}
      </p>
    </div>
  );
}
