'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiJsonRequest } from '@/lib/apiClient';
import { site } from '@/config/site';

const maskEmail = (email: string): string => {
  const [local, domain] = email.split('@');
  if (!local || !domain) return email;
  const visible = local.slice(0, 2);
  return `${visible}${'*'.repeat(Math.max(local.length - 2, 4))}@${domain}`;
};

export const VerifyEmailClient = () => {
  const router = useRouter();
  const params = useSearchParams();
  const email = (params.get('email') ?? '').trim();
  const grade = params.get('grade') ?? '';
  const phone = params.get('phone') ?? '';
  const nid = params.get('nid') ?? '';

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [resendCountdown, setResendCountdown] = useState(300);

  useEffect(() => {
    if (resendCountdown <= 0) return;
    const t = setTimeout(() => setResendCountdown((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCountdown]);

  const handleVerify = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    if (!/^\d{6}$/.test(otp)) {
      setError('Please enter the 6-digit verification code.');
      return;
    }
    setLoading(true);
    try {
      const res = await apiJsonRequest<{ success?: boolean; message?: string }>(
        '/auth/email/verify',
        'POST',
        { email, otp },
      );
      if (!res.ok) {
        setError(res.data?.message || 'Invalid or expired code.');
        setLoading(false);
        return;
      }
      // Verified — proceed to initial profile
      router.push(
        `/initial-profile?grade=${grade}` +
        `&phone=${encodeURIComponent(phone)}` +
        `&nid=${encodeURIComponent(nid)}`,
      );
    } catch {
      setError('Network error. Please try again.');
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setNotice('');
    setError('');
    setResendLoading(true);
    try {
      const res = await apiJsonRequest<{ success?: boolean; message?: string }>(
        '/auth/email/send-verification',
        'POST',
        { email },
      );
      if (!res.ok) {
        setError(res.data?.message || 'Failed to resend code.');
      } else {
        setNotice('A new verification code has been sent to your email.');
        setResendCountdown(300);
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-white px-4 py-6">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-[#035CB3]/10 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-[#48C184]/10 blur-3xl" aria-hidden="true" />

      <div className="relative mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-4">
        {/* Logo */}
        <div className="mb-3 flex justify-center">
          <div className="relative h-16 w-16">
            <Image src={site.logo} alt="" fill className="object-contain" />
          </div>
        </div>

        {/* Organization Name */}
        <h2 className="mb-3 text-center text-base font-bold leading-snug text-[#035CB3]">
          The Institution of Engineers
          <br />
          Somalia (IES)
        </h2>

        {/* Shield icon */}
        <div className="mb-4 flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#035CB3]/10">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#035CB3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
        </div>

        {/* Heading */}
        <h1 className="mb-2 text-center text-3xl font-extrabold text-[#022D5A]">
          Verify your email
        </h1>
        <p className="mb-6 text-center text-sm text-slate-500">
          Enter the verification code sent to{' '}
          <span className="font-semibold text-[#022D5A]">{maskEmail(email)}</span>.
        </p>

        <form onSubmit={handleVerify} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="verify-code" className="text-sm font-semibold text-[#022D5A]">
              Verification Code
            </label>
            <input
              id="verify-code"
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
            <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 inline-flex w-full items-center justify-center rounded-xl bg-[#035CB3] py-3 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#48C184] disabled:opacity-50"
          >
            {loading ? 'Verifying…' : 'Verify & Continue'}
          </button>

          <p className="text-center text-sm text-slate-600">
            Didn&apos;t receive it?{' '}
            {resendCountdown > 0 ? (
              <span className="font-semibold text-slate-400">
                Resend code ({String(Math.floor(resendCountdown / 60)).padStart(2, '0')}:{String(resendCountdown % 60).padStart(2, '0')})
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={resendLoading}
                className="font-bold text-[#035CB3] hover:underline"
              >
                {resendLoading ? 'Sending…' : 'Resend code'}
              </button>
            )}
          </p>
        </form>

        <p className="mt-8 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} The Institution of Engineers Somalia (IES)
        </p>
      </div>
    </div>
  );
};
