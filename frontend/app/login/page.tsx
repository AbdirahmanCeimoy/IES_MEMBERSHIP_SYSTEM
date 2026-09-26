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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
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
        username: email.trim(),
        password,
      });

      if (!response.ok || !response.data?.token) {
        const message = Array.isArray(response.data?.message)
          ? response.data?.message[0]
          : response.data?.message;
        setError(message || 'Invalid email or password.');
        return;
      }

      saveAuthSession(response.data.token, response.data.user);
      const role = response.data.user?.role;
      const target = role === 'ADMIN' ? '/admin' : '/member';
      router.push(target);
    } catch (err) {
      setError(getErrorMessage(err, 'Login failed. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white px-4 py-6">
      {/* Back to website */}
      <div className="mx-auto w-full max-w-md">
        <Link
          href={routes.home}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition-colors hover:text-[#035CB3]"
        >
          <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M12 5l-5 5 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to website
        </Link>
      </div>

      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-8">
        {/* Logo */}
        <div className="mb-3 flex justify-center">
          <div className="relative h-20 w-20">
            <Image src={site.logo} alt="" fill className="object-contain" />
          </div>
        </div>

        {/* Organization Name */}
        <h2 className="mb-8 text-center text-base font-bold leading-snug text-[#035CB3]">
          {site.name}
        </h2>

        {/* Log In Heading */}
        <h1 className="mb-2 text-center text-2xl font-extrabold text-gray-900">
          Log In
        </h1>

        {/* Subtitle */}
        <p className="mb-7 text-center text-sm text-gray-500">
          Please enter your registered email and password below to
          <br />
          Sign in.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" aria-label="Member login">
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="login-email" className="text-sm font-semibold text-gray-900">
              Email
            </label>
            <input
              id="login-email"
              type="text"
              autoComplete="username"
              required
              value={email}
              onChange={(event) => {
                setEmail(event.target.value.replace(/\s+/g, '').toLowerCase());
                setError('');
              }}
              className="rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#035CB3] focus:outline-none focus:ring-1 focus:ring-[#035CB3]"
              placeholder="example@gmail.com"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="login-password" className="text-sm font-semibold text-gray-900">
              Password
            </label>
            <PasswordInput
              id="login-password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setError('');
              }}
              placeholder="Password"
              className="!rounded-xl !px-4 !py-3"
            />
          </div>

          {/* Remember Me + Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-[#035CB3] focus:ring-[#035CB3]"
              />
              Remember me for 7 days
            </label>
            <Link
              href={routes.auth.forgotPassword}
              className="text-sm font-semibold text-[#035CB3] hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Error */}
          {error && (
            <div
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={loading}
            className="mt-1 w-full rounded-xl bg-[#035CB3] py-3 text-sm font-bold text-white transition-colors hover:bg-[#024a94] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#035CB3] focus-visible:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Signing In…' : 'Sign In'}
          </button>
        </form>

        {/* Register Link */}
        <p className="mt-6 text-center text-sm text-gray-500">
          Don&apos;t have an account?{' '}
          <Link href={routes.auth.register} className="font-semibold text-[#035CB3] hover:underline">
            Click here to register
          </Link>
        </p>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} {site.name}
        </p>
      </div>
    </div>
  );
}
