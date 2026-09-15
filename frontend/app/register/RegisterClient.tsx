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

  const handleChange = (name: keyof typeof form) => (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    let value = event.target.value;
    if (name === 'email') value = sanitizeEmail(value);
    else if (name === 'phone') value = sanitizePhone(value);
    else if (name === 'nationalId') value = sanitizeDigitsOnly(value, 11);
    setForm((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const validate = (): string | null => {
    if (!/^[a-z0-9._%+-]+@gmail\.com$/.test(form.email))
      return 'Email must be a valid Gmail address (e.g. yourname@gmail.com).';
    const digits = form.phone.replace(/\D/g, '');
    if (digits.length < 9 || digits.length > 15)
      return 'Mobile number must be 9–15 digits.';
    if (!/^\d{11}$/.test(form.nationalId))
      return 'National ID / Passport must be exactly 11 digits.';
    if (!isValidPassword(form.password))
      return 'Password: 8–16 characters, at least one uppercase, one lowercase and one number.';
    if (form.password !== form.confirmPassword)
      return 'Passwords do not match.';
    return null;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
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
          href={routes.membership.apply}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition-colors hover:text-[#0047AB]"
        >
          <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M12 5l-5 5 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to grade selection
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
            <h1 className="text-lg font-bold text-[#082B55]">REGISTER</h1>
            <p className="mt-1 text-xs font-semibold text-slate-500">
              For new individual {gradeLabel.toLowerCase()} application
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <label className="flex flex-col gap-1 text-xs font-semibold text-[#082B55]">
              Email Address
              <input
                type="email"
                autoComplete="email"
                required
                value={form.email}
                onChange={handleChange('email')}
                placeholder="apdirahmanbashirapdullahi@gmail.com"
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal focus:border-[#0047AB] focus:outline-none focus:ring-1 focus:ring-[#0047AB]"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-[#082B55]">
              Mobile No.
              <input
                type="tel"
                autoComplete="tel"
                required
                value={form.phone}
                onChange={handleChange('phone')}
                placeholder="+252 61 2074218"
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal focus:border-[#0047AB] focus:outline-none focus:ring-1 focus:ring-[#0047AB]"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-[#082B55]">
              Your ID / Passport No.
              <input
                type="text"
                inputMode="numeric"
                required
                value={form.nationalId}
                onChange={handleChange('nationalId')}
                placeholder="11-digit National ID"
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal focus:border-[#0047AB] focus:outline-none focus:ring-1 focus:ring-[#0047AB]"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-[#082B55]">
              Password
              <PasswordInput
                autoComplete="new-password"
                required
                value={form.password}
                onChange={handleChange('password')}
              />
              <span className="text-[10px] font-normal text-slate-500">
                8–16 characters · uppercase · lowercase · number
              </span>
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-[#082B55]">
              Confirm Password
              <PasswordInput
                autoComplete="new-password"
                required
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
              className="mt-1 inline-flex items-center justify-center rounded-lg bg-[#66FF00] px-4 py-2.5 text-sm font-bold uppercase tracking-wide text-[#082B55] transition-colors hover:bg-[#5be000] disabled:opacity-50"
            >
              {loading ? 'Creating account…' : 'Create My Account'}
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-slate-500">
            Already have an account?{' '}
            <Link href={routes.auth.login} className="font-semibold text-[#0047AB] hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
