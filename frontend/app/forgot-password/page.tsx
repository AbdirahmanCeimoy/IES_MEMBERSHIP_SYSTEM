'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiJsonRequest } from '@/lib/apiClient';
import { site } from '@/config/site';
import { routes } from '@/config/routes';
import { sanitizeEmail } from '@/lib/inputSanitizers';
import { PasswordInput } from '@/components/ui/PasswordInput';

type Step = 'email' | 'otp' | 'reset' | 'success';

const passwordRules = [
  { label: 'At least 8 characters', test: (v: string) => v.length >= 8 },
  { label: 'One uppercase letter (A-Z)', test: (v: string) => /[A-Z]/.test(v) },
  { label: 'One lowercase letter (a-z)', test: (v: string) => /[a-z]/.test(v) },
  { label: 'One number (0-9)', test: (v: string) => /\d/.test(v) },
  { label: 'One special character (@$!%*?&)', test: (v: string) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(v) },
];

const maskEmail = (email: string) => {
  const [local, domain] = email.split('@');
  if (!local || !domain) return email;
  const visible = local.slice(0, 2);
  return `${visible}${'*'.repeat(Math.max(local.length - 2, 4))}@${domain}`;
};

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmToken, setConfirmToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const handleRequestOtp = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setNotice('');

    if (!email.trim() || !/@/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const response = await apiJsonRequest<{ success?: boolean; message?: string }>(
        '/auth/forgot-password/request',
        'POST',
        { email: email.trim() },
      );
      if (!response.ok) {
        setError(response.data?.message || 'Unable to send code. Please try again.');
        return;
      }
      setStep('otp');
      setNotice('A 6-digit code has been sent to your email address.');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (!/^\d{6}$/.test(otp)) {
      setError('Please enter the 6-digit code.');
      return;
    }

    setLoading(true);
    try {
      const response = await apiJsonRequest<{ success?: boolean; token?: string; message?: string }>(
        '/auth/forgot-password/verify-otp',
        'POST',
        { email: email.trim(), otp },
      );
      if (!response.ok || !response.data?.token) {
        setError(response.data?.message || 'Invalid code. Please try again.');
        return;
      }
      setConfirmToken(response.data.token);
      setStep('reset');
      setNotice('');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (!passwordRules.every((rule) => rule.test(password))) {
      setError('Password does not meet all requirements.');
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
        { token: confirmToken, newPassword: password },
      );
      if (!response.ok) {
        setError(response.data?.message || 'Unable to reset password.');
        return;
      }
      setStep('success');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    setError('');
    try {
      await apiJsonRequest('/auth/forgot-password/request', 'POST', { email: email.trim() });
      setNotice('A new 6-digit code has been sent to your email.');
    } catch {
      setError('Failed to resend code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 px-4 py-8">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
        {/* Logo + brand */}
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

        {/* Step: Email */}
        {step === 'email' && (
          <>
            <div className="mb-4 flex justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#035CB3]/10">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#035CB3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
            </div>
            <h1 className="mb-3 text-center text-3xl font-extrabold text-[#022D5A]">Forgot Password?</h1>
            <p className="mb-6 text-center text-sm leading-relaxed text-slate-500">
              Enter your registered email address and we will
              <br />
              send you a 6-digit code to reset your password.
            </p>

            <form onSubmit={handleRequestOtp} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="fp-email" className="text-sm font-semibold text-[#022D5A]">
                  Email Address
                </label>
                <input
                  id="fp-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(sanitizeEmail(e.target.value));
                    setError('');
                  }}
                  placeholder="you@gmail.com"
                  className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#035CB3] focus:outline-none focus:ring-1 focus:ring-[#035CB3]"
                />
              </div>

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#035CB3] py-3 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#48C184] disabled:opacity-50"
              >
                {loading ? 'Sending…' : 'Send Reset Code'}
                {!loading && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                )}
              </button>

              <Link href={routes.auth.login} className="mt-3 text-center text-sm font-semibold text-slate-600 hover:text-[#035CB3]">
                ← Back to Sign In
              </Link>
            </form>
          </>
        )}

        {/* Step: OTP */}
        {step === 'otp' && (
          <>
            <div className="mb-4 flex justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#035CB3]/10">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#035CB3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
            </div>
            <h1 className="mb-3 text-center text-3xl font-extrabold text-[#022D5A]">Verify Your Email</h1>
            <p className="mb-6 text-center text-sm leading-relaxed text-slate-500">
              Enter the 6-digit code sent by email to
              <br />
              <span className="font-semibold text-[#022D5A]">{maskEmail(email)}</span> to continue.
            </p>

            <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="fp-otp" className="text-sm font-semibold text-[#022D5A]">
                  Email Code
                </label>
                <input
                  id="fp-otp"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  required
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value.replace(/\D/g, '').slice(0, 6));
                    setError('');
                  }}
                  placeholder="123456"
                  className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-center text-2xl font-bold tracking-[0.5em] text-slate-900 placeholder:text-slate-300 placeholder:font-normal placeholder:tracking-normal focus:border-[#035CB3] focus:outline-none focus:ring-1 focus:ring-[#035CB3]"
                />
                {notice && !error && (
                  <p className="mt-1 text-center text-xs font-semibold text-[#3AA870]">{notice}</p>
                )}
              </div>

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-2 inline-flex w-full items-center justify-center rounded-xl bg-[#035CB3] py-3 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#48C184] disabled:opacity-50"
              >
                {loading ? 'Verifying…' : 'Verify & Continue'}
              </button>

              <p className="text-center text-sm text-slate-500">
                Didn&apos;t receive it?{' '}
                <button type="button" onClick={handleResendCode} disabled={loading} className="font-bold text-[#035CB3] hover:underline">
                  Resend via email
                </button>
              </p>

              <Link href={routes.auth.login} className="text-center text-sm font-semibold text-slate-600 hover:text-[#035CB3]">
                ← Back to Sign In
              </Link>
            </form>
          </>
        )}

        {/* Step: Reset */}
        {step === 'reset' && (
          <>
            <div className="mb-4 flex justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#035CB3]/10">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#035CB3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
              </div>
            </div>
            <h1 className="mb-3 text-center text-3xl font-extrabold text-[#022D5A]">Reset Password</h1>
            <p className="mb-6 text-center text-sm leading-relaxed text-slate-500">
              Choose a strong new password for your account.
            </p>

            <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="fp-new" className="text-sm font-semibold text-[#022D5A]">
                  New Password
                </label>
                <PasswordInput
                  id="fp-new"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  maxLength={16}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="New Password"
                  className="!rounded-xl !px-4 !py-3"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="fp-confirm" className="text-sm font-semibold text-[#022D5A]">
                  Confirm Password
                </label>
                <PasswordInput
                  id="fp-confirm"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  maxLength={16}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="Confirm New Password"
                  className="!rounded-xl !px-4 !py-3"
                />
              </div>

              {/* Live password requirements */}
              <div className="rounded-lg bg-slate-100 p-4">
                <p className="mb-2 text-sm font-semibold text-[#022D5A]">Password requirements:</p>
                <ul className="flex flex-col gap-1.5">
                  {passwordRules.map((rule) => {
                    const met = rule.test(password);
                    return (
                      <li key={rule.label} className="flex items-center gap-2 text-sm">
                        {met ? (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3AA870" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="8 12 11 15 16 9" />
                          </svg>
                        ) : (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                          </svg>
                        )}
                        <span className={met ? 'text-[#3AA870]' : 'text-slate-500'}>{rule.label}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#035CB3] py-3 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#48C184] disabled:opacity-50"
              >
                {loading ? 'Resetting…' : 'Reset Password'}
                {!loading && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                )}
              </button>

              <Link href={routes.auth.login} className="text-center text-sm font-semibold text-slate-600 hover:text-[#035CB3]">
                ← Back to Sign In
              </Link>
            </form>
          </>
        )}

        {/* Step: Success */}
        {step === 'success' && (
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#48C184]/15">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#3AA870" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="8 12 11 15 16 9" />
              </svg>
            </div>
            <h1 className="mb-3 text-3xl font-extrabold text-[#022D5A]">Password Reset</h1>
            <p className="mb-6 text-sm leading-relaxed text-slate-500">
              Your password has been reset successfully. You can now sign in with your new password.
            </p>
            <button
              type="button"
              onClick={() => router.push(routes.auth.login)}
              className="inline-flex items-center gap-2 rounded-xl bg-[#035CB3] px-8 py-3 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#48C184]"
            >
              Sign In
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
