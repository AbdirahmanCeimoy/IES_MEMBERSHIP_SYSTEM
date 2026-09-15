'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiJsonRequest } from '@/lib/apiClient';
import { site } from '@/config/site';
import { routes } from '@/config/routes';
import {
  EMAIL_RULE,
  USERNAME_RULE,
  SECURE_PASSWORD_RULE,
  isValidGmail,
  isValidUsername,
  isValidSecurePassword,
  normalizeEmail,
  normalizeUsername,
} from '@/lib/authValidation';
import {
  sanitizeDigitsOnly,
  sanitizeEmail,
  sanitizeName,
  sanitizeUsername,
} from '@/lib/inputSanitizers';
import { PasswordInput } from '@/components/ui/PasswordInput';

const extractApiMessage = (data: unknown): string | null => {
  if (typeof data === 'string' && data.trim().length > 0) return data;
  if (data && typeof data === 'object' && 'message' in data) {
    const message = (data as { message?: string | string[] }).message;
    if (Array.isArray(message)) return message.join(', ');
    if (typeof message === 'string') return message;
  }
  return null;
};

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    nationalIdNumber: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = event.target;
    let value = event.target.value;
    if (name === 'username') value = sanitizeUsername(value);
    else if (name === 'fullName') value = sanitizeName(value);
    else if (name === 'email') value = sanitizeEmail(value);
    else if (name === 'nationalIdNumber') value = sanitizeDigitsOnly(value, 11);

    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
    setNotice('');
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setNotice('');
    setLoading(true);

    const username = normalizeUsername(formData.username);
    const fullName = formData.fullName.trim();
    const email = normalizeEmail(formData.email);
    const nationalIdNumber = formData.nationalIdNumber.trim();
    const newPassword = formData.newPassword.trim();
    const confirmNewPassword = formData.confirmNewPassword.trim();

    if (!isValidUsername(username)) {
      setError(USERNAME_RULE);
      setLoading(false);
      return;
    }
    if (!fullName || fullName.length < 2) {
      setError('Full name is required for validation.');
      setLoading(false);
      return;
    }
    if (!email && (!nationalIdNumber || nationalIdNumber.length < 4)) {
      setError('Provide email (admin) or National ID / Passport (membership).');
      setLoading(false);
      return;
    }
    if (email && !isValidGmail(email)) {
      setError(EMAIL_RULE);
      setLoading(false);
      return;
    }
    if (!isValidSecurePassword(newPassword)) {
      setError(SECURE_PASSWORD_RULE);
      setLoading(false);
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError('New password and confirm password do not match.');
      setLoading(false);
      return;
    }

    try {
      const response = await apiJsonRequest<{ message?: string | string[] }>(
        '/auth/forgot-password/reset',
        'POST',
        {
          username,
          fullName,
          email: email || undefined,
          nationalIdNumber,
          newPassword,
        },
      );

      if (!response.ok) {
        setError(
          extractApiMessage(response.data) ||
            'Unable to reset password. Please verify your details.',
        );
        setLoading(false);
        return;
      }

      setNotice('Password reset successful. Redirecting to login…');
      setTimeout(() => router.push(routes.auth.login), 1200);
    } catch {
      setError('Network error while resetting password.');
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col px-4 py-6">
      <div className="mx-auto w-full max-w-5xl">
        <Link
          href={routes.home}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition-colors hover:text-[#0047AB]"
        >
          <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M12 5l-5 5 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to website
        </Link>
      </div>
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-6">
        <Link
          href={routes.home}
          className="mb-5 flex items-center justify-center gap-2"
        >
          <div className="relative h-10 w-10">
            <Image src={site.logo} alt="" fill className="object-contain" />
          </div>
          <span className="text-base font-bold text-[#082B55]">{site.shortName}omalia</span>
        </Link>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 text-center">
            <h1 className="text-lg font-bold text-[#082B55]">Recover Account</h1>
            <p className="mt-1 text-xs text-slate-500">
              Enter your account details and choose a new password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3" aria-label="Password recovery">
            <label className="flex flex-col gap-1 text-xs font-semibold text-[#082B55]">
              Username
              <input
                name="username"
                type="text"
                required
                autoComplete="username"
                value={formData.username}
                onChange={handleChange}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm font-normal focus:border-[#0047AB] focus:outline-none focus:ring-1 focus:ring-[#0047AB]"
              />
            </label>

            <label className="flex flex-col gap-1 text-xs font-semibold text-[#082B55]">
              Full name
              <input
                name="fullName"
                type="text"
                required
                autoComplete="name"
                value={formData.fullName}
                onChange={handleChange}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm font-normal focus:border-[#0047AB] focus:outline-none focus:ring-1 focus:ring-[#0047AB]"
              />
            </label>

            <label className="flex flex-col gap-1 text-xs font-semibold text-[#082B55]">
              Email (admin recovery)
              <input
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm font-normal focus:border-[#0047AB] focus:outline-none focus:ring-1 focus:ring-[#0047AB]"
                placeholder="you@gmail.com"
              />
            </label>

            <label className="flex flex-col gap-1 text-xs font-semibold text-[#082B55]">
              National ID / Passport (membership recovery)
              <input
                name="nationalIdNumber"
                type="text"
                value={formData.nationalIdNumber}
                onChange={handleChange}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm font-normal focus:border-[#0047AB] focus:outline-none focus:ring-1 focus:ring-[#0047AB]"
              />
            </label>

            <label className="flex flex-col gap-1 text-xs font-semibold text-[#082B55]">
              New password
              <PasswordInput
                name="newPassword"
                required
                autoComplete="new-password"
                value={formData.newPassword}
                onChange={handleChange}
              />
              <span className="text-[11px] font-normal text-slate-500">{SECURE_PASSWORD_RULE}</span>
            </label>

            <label className="flex flex-col gap-1 text-xs font-semibold text-[#082B55]">
              Confirm new password
              <PasswordInput
                name="confirmNewPassword"
                required
                autoComplete="new-password"
                value={formData.confirmNewPassword}
                onChange={handleChange}
              />
            </label>

            {error && (
              <div role="alert" className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                {error}
              </div>
            )}
            {notice && (
              <div role="status" className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
                {notice}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-1 inline-flex items-center justify-center rounded-lg bg-[#66FF00] px-4 py-2.5 text-sm font-semibold text-[#082B55] transition-colors hover:bg-[#5be000] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0047AB] focus-visible:ring-offset-2 disabled:opacity-50"
            >
              {loading ? 'Resetting…' : 'Reset password'}
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-slate-500">
            Remembered it?{' '}
            <Link href={routes.auth.login} className="font-semibold text-[#0047AB] hover:underline">
              Back to login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
