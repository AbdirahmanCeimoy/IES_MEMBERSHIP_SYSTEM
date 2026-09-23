'use client';

import { Suspense, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { site } from '@/config/site';
import { routes } from '@/config/routes';

const OTP_LENGTH = 6;

function OtpVerifyInner() {
  const router = useRouter();
  const params = useSearchParams();
  const contact = params.get('to') ?? 'your email';
  const nextUrl = params.get('next') ?? routes.auth.login;

  const [digits, setDigits] = useState<string[]>(() => Array(OTP_LENGTH).fill(''));
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const setInputRef = (index: number) => (el: HTMLInputElement | null) => {
    inputsRef.current[index] = el;
  };

  const handleDigit = (index: number, value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[index] = cleaned;
      return next;
    });
    setError('');
    if (cleaned && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number) => (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
    if (event.key === 'ArrowLeft' && index > 0) inputsRef.current[index - 1]?.focus();
    if (event.key === 'ArrowRight' && index < OTP_LENGTH - 1) inputsRef.current[index + 1]?.focus();
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!pasted) return;
    event.preventDefault();
    setDigits(() => {
      const next = Array(OTP_LENGTH).fill('');
      for (let i = 0; i < pasted.length; i += 1) next[i] = pasted[i];
      return next;
    });
    inputsRef.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  const handleVerify = async () => {
    const code = digits.join('');
    if (code.length < OTP_LENGTH) {
      setError('Please enter all 6 digits.');
      return;
    }
    setLoading(true);
    // TODO: backend endpoint /auth/verify-otp not yet available.
    await new Promise((resolve) => setTimeout(resolve, 400));
    setLoading(false);
    router.push(nextUrl);
  };

  const complete = digits.every((d) => d !== '');

  return (
    <div className="flex min-h-screen flex-col px-4 py-6">
      <div className="mx-auto w-full max-w-5xl">
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
        <Link href={routes.home} className="mb-5 flex items-center justify-center gap-2">
          <div className="relative h-10 w-10">
            <Image src={site.logo} alt="" fill className="object-contain" />
          </div>
          <span className="text-base font-bold text-[#022D5A]">{site.shortName}omalia</span>
        </Link>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 text-center">
            <h1 className="text-lg font-bold text-[#022D5A]">Verify OTP code</h1>
            <p className="mt-1 text-xs text-slate-500">
              An OTP was sent to <span className="font-semibold text-[#035CB3]">{contact}</span>. Enter the 6-digit code below.
            </p>
          </div>

          <div className="flex justify-center gap-2 sm:gap-3">
            {digits.map((digit, index) => (
              <input
                key={index}
                ref={setInputRef(index)}
                type="text"
                inputMode="numeric"
                autoComplete={index === 0 ? 'one-time-code' : 'off'}
                maxLength={1}
                value={digit}
                onChange={(event) => handleDigit(index, event.target.value)}
                onKeyDown={handleKeyDown(index)}
                onPaste={handlePaste}
                className="h-12 w-10 rounded-lg border border-slate-300 bg-white text-center text-lg font-semibold text-[#022D5A] focus:border-[#035CB3] focus:outline-none focus:ring-1 focus:ring-[#035CB3] sm:h-14 sm:w-12"
              />
            ))}
          </div>

          {error && (
            <div className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
              {error}
            </div>
          )}

          <div className="mt-5 flex flex-col-reverse items-center justify-between gap-3 sm:flex-row">
            <button
              type="button"
              className="text-xs font-semibold text-slate-500 hover:text-[#035CB3]"
              onClick={() => {
                setDigits(Array(OTP_LENGTH).fill(''));
                inputsRef.current[0]?.focus();
              }}
            >
              Resend OTP
            </button>
            <button
              type="button"
              onClick={handleVerify}
              disabled={!complete || loading}
              className="inline-flex items-center gap-2 rounded-lg bg-[#48C184] px-6 py-2.5 text-sm font-semibold text-[#022D5A] transition-colors hover:bg-[#3AA870] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
            >
              {loading ? 'Verifying…' : 'Verify OTP'}
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M8 5l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <p className="mt-4 text-center text-xs text-slate-500">
            Wrong details?{' '}
            <Link href={routes.auth.login} className="font-semibold text-[#035CB3] hover:underline">
              Back to login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={null}>
      <OtpVerifyInner />
    </Suspense>
  );
}
