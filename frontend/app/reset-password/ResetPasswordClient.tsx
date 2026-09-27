'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiJsonRequest } from '@/lib/apiClient';
import { site } from '@/config/site';
import { routes } from '@/config/routes';
import { PasswordInput } from '@/components/ui/PasswordInput';

const isValidPassword = (value: string): boolean => {
  if (value.length < 8 || value.length > 16) return false;
  if (!/[a-z]/.test(value)) return false;
  if (!/[A-Z]/.test(value)) return false;
  if (!/\d/.test(value)) return false;
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(value)) return false;
  return true;
};

export const ResetPasswordClient = () => {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get('token') ?? '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (!token) {
      setError('Missing reset token. Please use the link from the email.');
      return;
    }
    if (!isValidPassword(password)) {
      setError('Password: 8-16 characters, must include uppercase, lowercase, number, and symbol.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const response = await apiJsonRequest<{ success?: boolean; message?: string }>(
        '/auth/forgot-password/reset-with-token',
        'POST',
        { token, newPassword: password },
      );
      if (!response.ok) {
        setError(response.data?.message || 'Unable to reset password.');
        setLoading(false);
        return;
      }
      setSuccess(true);
      setTimeout(() => router.push(routes.auth.login), 2000);
    } catch {
      setError('Network error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 px-4 py-8">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
        {/* Logo */}
        <div className="mb-6 flex flex-col items-center gap-3">
          <div className="relative h-20 w-20">
            <Image src={site.logo} alt="" fill className="object-contain" />
          </div>
          <h2 className="text-center text-base font-bold leading-tight text-[#022D5A]">
            The Institution of Engineers
            <br />
            Somalia
          </h2>
        </div>

        {/* Icon */}
        <div className="mb-4 flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#035CB3]/10">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#035CB3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
          </div>
        </div>

        <h1 className="mb-3 text-center text-3xl font-extrabold text-[#022D5A]">
          Reset Password
        </h1>
        <p className="mb-6 text-center text-sm leading-relaxed text-slate-500">
          Create a new password for your IES Member Portal account.
        </p>

        {success ? (
          <div className="rounded-xl border border-[#48C184]/30 bg-[#48C184]/5 p-6 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#48C184]/15 text-2xl text-[#3AA870]">
              ✓
            </div>
            <h2 className="text-base font-bold text-[#022D5A]">Password Reset Successful</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              You can now sign in with your new password. Redirecting to login…
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4" aria-label="Reset password">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="rp-password" className="text-sm font-semibold text-[#022D5A]">
                New Password
              </label>
              <PasswordInput
                id="rp-password"
                autoComplete="new-password"
                required
                minLength={8}
                maxLength={16}
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setError('');
                }}
                placeholder="New Password"
                className="!rounded-xl !px-4 !py-3"
              />
              <span className="text-[11px] text-slate-500">
                8–16 characters · uppercase · lowercase · number · symbol
              </span>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="rp-confirm" className="text-sm font-semibold text-[#022D5A]">
                Confirm Password
              </label>
              <PasswordInput
                id="rp-confirm"
                autoComplete="new-password"
                required
                minLength={8}
                maxLength={16}
                value={confirmPassword}
                onChange={(event) => {
                  setConfirmPassword(event.target.value);
                  setError('');
                }}
                placeholder="Confirm New Password"
                className="!rounded-xl !px-4 !py-3"
              />
            </div>

            {error && (
              <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#035CB3] py-3 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#48C184] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#035CB3] focus-visible:ring-offset-2 disabled:opacity-50"
            >
              {loading ? 'Resetting…' : 'Reset Password'}
            </button>

            <Link
              href={routes.auth.login}
              className="mt-3 inline-flex items-center justify-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-[#035CB3]"
            >
              ← Back to Sign In
            </Link>
          </form>
        )}
      </div>
    </div>
  );
};
