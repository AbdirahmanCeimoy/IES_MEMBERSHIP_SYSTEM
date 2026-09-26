'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiJsonRequest } from '@/lib/apiClient';
import { patchStoredUser, saveAuthSession } from '@/lib/authSession';
import { site } from '@/config/site';
import { routes } from '@/config/routes';
import {
  sanitizeDigitsOnly,
  sanitizeEmail,
  sanitizePhone,
} from '@/lib/inputSanitizers';
import { PasswordInput } from '@/components/ui/PasswordInput';

const gradeLabels: Record<string, string> = {
  STUDENT: 'Student Member',
  GRADUATE: 'Graduate Member',
  ASSOCIATE: 'Associate Member',
  CORPORATE: 'Corporate Member',
  SENIOR: 'Senior Member',
  FELLOW: 'Fellow Member',
  GRAD_TECHNICIAN: 'Graduate Engineering Technician',
  GRAD_TECHNOLOGIST: 'Graduate Engineering Technologist',
};

const buildUsernameFromEmail = (email: string): string => {
  const local = email.split('@')[0] ?? '';
  const cleaned = local.replace(/[^a-z0-9]/g, '').slice(0, 20);
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${cleaned}${suffix}`;
};

const isValidPassword = (value: string): boolean => {
  if (value.length < 8 || value.length > 16) return false;
  if (!/[a-z]/.test(value)) return false;
  if (!/[A-Z]/.test(value)) return false;
  if (!/\d/.test(value)) return false;
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(value)) return false;
  return true;
};

export const RegisterClient = () => {
  const router = useRouter();
  const params = useSearchParams();
  const grade = (params.get('grade') ?? 'GRADUATE').toUpperCase();
  const gradeLabel = gradeLabels[grade] ?? 'Individual';

  const [form, setForm] = useState({
    email: '',
    phone: '',
    nationalId: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showConsent, setShowConsent] = useState(false);

  const handleChange = (name: keyof typeof form) => (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    let value = event.target.value;
    if (name === 'email') value = sanitizeEmail(value);
    else if (name === 'phone') value = sanitizePhone(value);
    else if (name === 'nationalId') {
      // Allow letters and digits (passports can have letters, e.g. AB1234567)
      value = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 11);
    }
    setForm((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const validate = (): string | null => {
    if (!/^[a-z0-9._%+-]+@gmail\.com$/.test(form.email))
      return 'Email must be a valid Gmail address (e.g. yourname@gmail.com).';
    const digits = form.phone.replace(/\D/g, '');
    if (digits.length < 9 || digits.length > 15)
      return 'Mobile number must be 9–15 digits.';
    if (!/^[A-Z0-9]{7,11}$/.test(form.nationalId))
      return 'National ID / Passport must be 7 to 11 characters (letters and digits).';
    if (!isValidPassword(form.password))
      return 'Password: 8–16 characters, must include uppercase, lowercase, number, and symbol.';
    if (form.password !== form.confirmPassword)
      return 'Passwords do not match.';
    return null;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    // Show consent modal before proceeding
    setShowConsent(true);
  };

  const handleConsentAgree = async () => {
    setShowConsent(false);
    setLoading(true);

    const username = buildUsernameFromEmail(form.email);
    try {
      const response = await apiJsonRequest<{
        token?: string;
        user?: unknown;
        message?: string | string[];
      }>('/auth/signup', 'POST', {
        username,
        password: form.password,
        fullName: username,
        email: form.email,
        grade,
      });

      if (!response.ok || !response.data?.token) {
        const msg = Array.isArray(response.data?.message)
          ? response.data?.message[0]
          : response.data?.message;
        setError(msg || 'Account creation failed. Please try again.');
        setLoading(false);
        return;
      }

      saveAuthSession(response.data.token, response.data.user);
      // Persist the applied grade + contact bits into local session so the
      // dashboard sidebar can show them even if the user does not complete
      // Initial Profile immediately.
      patchStoredUser({
        grade,
        gradeLabel: gradeLabel,
        phone: form.phone,
        nationalId: form.nationalId,
      });
      // OTP endpoint is not yet wired on the backend - skip verify-otp and
      // go straight to initial profile. Re-enable once the /auth/otp/send
      // and /auth/otp/verify endpoints exist.
      router.push(
        `/initial-profile?grade=${grade}` +
        `&phone=${encodeURIComponent(form.phone)}` +
        `&nid=${encodeURIComponent(form.nationalId)}`,
      );
    } catch {
      setError('Network error. Please check your connection and try again.');
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col px-4 py-6">
      <div className="mx-auto w-full max-w-5xl">
        <Link
          href={routes.membership.applicationGuidelines}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition-colors hover:text-[#035CB3]"
        >
          <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M12 5l-5 5 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to Grade Selection
        </Link>
      </div>
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-6">
        <Link href={routes.home} className="mb-5 flex items-center justify-center gap-2">
          <div className="relative h-12 w-12">
            <Image src={site.logo} alt="" fill className="object-contain" />
          </div>
        </Link>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 text-center">
            <h1 className="text-lg font-bold text-[#022D5A]">REGISTER</h1>
            <p className="mt-1 text-xs font-semibold text-slate-500">
              as a New Individual {gradeLabel}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <label className="flex flex-col gap-1 text-xs font-semibold text-[#022D5A]">
              Email Address
              <input
                type="email"
                autoComplete="email"
                required
                value={form.email}
                onChange={handleChange('email')}
                placeholder="Enter Your Email Address"
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal focus:border-[#035CB3] focus:outline-none focus:ring-1 focus:ring-[#035CB3]"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-[#022D5A]">
              Mobile No.
              <input
                type="tel"
                autoComplete="tel"
                required
                value={form.phone}
                onChange={handleChange('phone')}
                placeholder="Enter Your Mobile No."
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal focus:border-[#035CB3] focus:outline-none focus:ring-1 focus:ring-[#035CB3]"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-[#022D5A]">
              National ID/Passport No.
              <input
                type="text"
                required
                value={form.nationalId}
                onChange={handleChange('nationalId')}
                placeholder="Enter Your National ID/Passport No"
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm  focus:border-[#035CB3] focus:outline-none focus:ring-1 focus:ring-[#035CB3]"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-[#022D5A]">
              Password
              <PasswordInput
                autoComplete="new-password"
                 placeholder=" Enter Your New Password"
                required
                minLength={8}
                maxLength={16}
                value={form.password}
                onChange={handleChange('password')}
              />
              <span className="text-[10px] font-normal text-slate-500">
                8–16 characters · uppercase · lowercase · number · symbol
              </span>
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-[#022D5A]">
              Confirm 
              <PasswordInput
                autoComplete="new-password"
                 placeholder="  Confirm Your Password"
                required
                minLength={8}
                maxLength={16}
                value={form.confirmPassword}
                onChange={handleChange('confirmPassword')}
              />
            </label>

            {error && (
              <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-1 inline-flex items-center justify-center rounded-lg bg-[#48C184] px-4 py-2.5 text-sm font-bold uppercase tracking-wide text-[#022D5A] transition-colors hover:bg-[#3AA870] disabled:opacity-50"
            >
              {loading ? 'Creating account…' : 'Create My Account'}
            </button>
          </form>

        </div>
      </div>

      {/* Consent Modal */}
      {showConsent && (
        <>
          <div
            className="fixed inset-0 z-40 bg-slate-900/50"
            onClick={() => setShowConsent(false)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="consent-title"
            className="fixed left-1/2 top-1/2 z-50 w-[min(460px,90vw)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-lg bg-white shadow-2xl"
          >
            <div className="bg-slate-100 px-6 py-4">
              <h2 id="consent-title" className="text-base font-bold text-[#022D5A]">
                Consent to Share Information
              </h2>
            </div>
            <div className="px-6 py-6">
              <p className="text-sm leading-relaxed text-slate-700">
                I consent to the processing of my personal data for the purposes of the membership application process.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-6 py-3">
              <button
                type="button"
                onClick={() => setShowConsent(false)}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-500 transition-colors hover:text-slate-700"
              >
                Disagree
              </button>
              <button
                type="button"
                onClick={handleConsentAgree}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#035CB3] transition-colors hover:text-[#48C184]"
              >
                Agree
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
