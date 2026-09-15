'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { apiJsonRequest } from '@/lib/apiClient';
import { buildAuthHeader, getAuthToken, saveAuthSession } from '@/lib/authSession';
import {
  isValidUsername,
  isValidGmail,
  isValidSecurePassword,
  normalizeUsername,
  normalizeEmail,
  USERNAME_RULE,
  EMAIL_RULE,
  SECURE_PASSWORD_RULE,
} from '@/lib/authValidation';
import { sanitizeEmail, sanitizeUsername } from '@/lib/inputSanitizers';
import { PasswordInput } from '@/components/ui/PasswordInput';

const FINALIZE_KEY = 'ies-finalize-credentials-pending';

function FinalizeCredentialsForm() {
  const router = useRouter();
  const params = useSearchParams();
  const initialFullName = params.get('fullName') ?? '';
  const initialEmail = params.get('email') ?? '';

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!getAuthToken()) {
      router.replace('/login');
    }
  }, [router]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    const normalizedUsername = normalizeUsername(username);
    const normalizedEmail = normalizeEmail(email);

    if (!isValidUsername(normalizedUsername)) {
      setError(USERNAME_RULE);
      return;
    }
    if (!isValidGmail(normalizedEmail)) {
      setError(EMAIL_RULE);
      return;
    }
    if (!isValidSecurePassword(password)) {
      setError(SECURE_PASSWORD_RULE);
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const token = getAuthToken();
    if (!token) {
      router.replace('/login');
      return;
    }

    setLoading(true);
    const response = await apiJsonRequest<{ user?: unknown; message?: string }>(
      '/auth/me/finalize-credentials',
      'PATCH',
      {
        username: normalizedUsername,
        email: normalizedEmail,
        fullName: initialFullName || undefined,
        newPassword: password,
      },
      { headers: buildAuthHeader(token) },
    );
    setLoading(false);

    if (!response.ok) {
      const message =
        response.data && typeof response.data === 'object' && 'message' in response.data
          ? String((response.data as { message?: string }).message ?? '')
          : '';
      setError(message || 'Could not save your credentials. Please try again.');
      return;
    }

    if (typeof window !== 'undefined') {
      localStorage.removeItem(FINALIZE_KEY);
    }
    if (response.data?.user) {
      saveAuthSession(token, response.data.user);
    }
    router.replace('/dashboard');
  };

  return (
    <>
      <PageHero
        eyebrow="Finish set-up"
        title="Choose your permanent username and password"
        description="Your membership application was received. Set your own credentials to sign in later - you cannot recover the auto-generated ones."
      />
      <Section>
        <Card padded className="max-w-2xl">
          <form className="flex flex-col gap-3" onSubmit={handleSubmit} aria-label="Finalize credentials">
            <label className="flex flex-col gap-1 text-xs font-semibold text-[#082B55]">
              Username
              <input
                type="text"
                required
                autoComplete="username"
                value={username}
                onChange={(event) => setUsername(sanitizeUsername(event.target.value))}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm font-normal focus:border-[#0047AB] focus:outline-none focus:ring-1 focus:ring-[#0047AB]"
                placeholder="3–32 letters or numbers"
              />
              <span className="text-[11px] font-normal text-slate-500">{USERNAME_RULE}</span>
            </label>

            <label className="flex flex-col gap-1 text-xs font-semibold text-[#082B55]">
              Email
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(sanitizeEmail(event.target.value))}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm font-normal focus:border-[#0047AB] focus:outline-none focus:ring-1 focus:ring-[#0047AB]"
              />
              <span className="text-[11px] font-normal text-slate-500">{EMAIL_RULE}</span>
            </label>

            <label className="flex flex-col gap-1 text-xs font-semibold text-[#082B55]">
              Password
              <PasswordInput
                required
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <span className="text-[11px] font-normal text-slate-500">{SECURE_PASSWORD_RULE}</span>
            </label>

            <label className="flex flex-col gap-1 text-xs font-semibold text-[#082B55]">
              Confirm password
              <PasswordInput
                required
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
              />
            </label>

            {error && (
              <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                {error}
              </div>
            )}

            <div className="mt-2 flex items-center gap-3">
              <Button type="submit" variant="accent" disabled={loading}>
                {loading ? 'Saving…' : 'Save credentials'}
              </Button>
              <Link href="/login" className="text-xs text-slate-500 hover:text-[#0047AB]">
                Sign in instead
              </Link>
            </div>
          </form>
        </Card>
      </Section>
    </>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={null}>
      <FinalizeCredentialsForm />
    </Suspense>
  );
}
