'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { saveAuthSession } from '@/lib/authSession';
import { apiJsonRequest } from '@/lib/apiClient';
import { site } from '@/config/site';
import { routes } from '@/config/routes';
import { PasswordInput } from '@/components/ui/PasswordInput';

type ApiUser = { id: string; role?: string } | undefined;

const getErrorMessage = (err: unknown, fallback: string) =>
  err instanceof Error ? err.message : fallback;

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await apiJsonRequest<{
        token?: string;
        user?: ApiUser;
        message?: string | string[];
      }>('/auth/login', 'POST', {
        // Backend accepts either username OR email in this field.
        username: username.trim(),
        password,
      });

      if (!response.ok || !response.data?.token) {
        const message = Array.isArray(response.data?.message)
          ? response.data?.message[0]
          : response.data?.message;
        setError(message || 'Invalid username or password.');
        return;
      }

      saveAuthSession(response.data.token, response.data.user);
      const role = response.data.user?.role;
      const target = role === 'ADMIN' ? '/dashboard' : '/member';
      router.push(target);
    } catch (err) {
      setError(getErrorMessage(err, 'Login failed. Please try again.'));
    } finally {
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
      <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-8">
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
            <h1 className="text-lg font-bold text-[#082B55]">Member Login</h1>
            <p className="mt-1 text-xs text-slate-500">Welcome back. Please sign in to continue.</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3" aria-label="Member login">
            <label className="flex flex-col gap-1 text-xs font-semibold text-[#082B55]">
              Email or Username
              <input
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(event) => {
                  // Allow full email OR plain username — no sanitization here,
                  // strip only obvious whitespace.
                  setUsername(event.target.value.replace(/\s+/g, '').toLowerCase());
                  setError('');
                }}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal focus:border-[#0047AB] focus:outline-none focus:ring-1 focus:ring-[#0047AB]"
                placeholder="you@gmail.com or your.username"
              />
            </label>

            <label className="flex flex-col gap-1 text-xs font-semibold text-[#082B55]">
              <span className="flex items-center justify-between">
                <span>Password</span>
                <Link
                  href={routes.auth.forgotPassword}
                  className="text-[11px] font-medium text-[#0047AB] hover:underline"
                >
                  Forgot password?
                </Link>
              </span>
              <PasswordInput
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setError('');
                }}
                placeholder="••••••••"
              />
              <span className="text-[10px] font-normal text-slate-500">
                8–16 characters · uppercase · lowercase · number
              </span>
            </label>

            {error && (
              <div
                role="alert"
                className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-1 inline-flex items-center justify-center rounded-lg bg-[#66FF00] px-4 py-2.5 text-sm font-semibold text-[#082B55] transition-colors hover:bg-[#5be000] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0047AB] focus-visible:ring-offset-2 disabled:opacity-50"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-slate-500">
            New here?{' '}
            <Link href={routes.membership.apply} className="font-semibold text-[#0047AB] hover:underline">
              Apply for membership
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
