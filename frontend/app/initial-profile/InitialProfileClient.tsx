'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { site } from '@/config/site';
import { routes } from '@/config/routes';
import { engineeringDivisions } from '@/data/institution';
import { countries } from '@/data/countries';
import { sanitizeName } from '@/lib/inputSanitizers';
import { buildAuthHeader, getAuthToken, patchStoredUser } from '@/lib/authSession';
import { apiJsonRequest } from '@/lib/apiClient';

const gradeLabelMap: Record<string, string> = {
  STUDENT: 'Student Member',
  GRADUATE: 'Graduate Member',
  ASSOCIATE: 'Associate Member',
  CORPORATE: 'Corporate Member',
  SENIOR: 'Senior Member',
  FELLOW: 'Fellow Member',
  GRAD_TECHNICIAN: 'Graduate Engineering Technician',
  GRAD_TECHNOLOGIST: 'Graduate Engineering Technologist',
};

interface FormState {
  lastName: string;
  firstName: string;
  middleName: string;
  gender: string;
  title: string;
  dateOfBirth: string;
  nationality: string;
  city: string;
  discipline: string;
  hasDisability: boolean;
  disabilityDetails: string;
  photo: File | null;
  idFile: File | null;
}

const INITIAL: FormState = {
  lastName: '',
  firstName: '',
  middleName: '',
  gender: '',
  title: '',
  dateOfBirth: '',
  nationality: 'Somalia',
  city: '',
  discipline: '',
  hasDisability: false,
  disabilityDetails: '',
  photo: null,
  idFile: null,
};

const REQUIRED_FIELDS: Array<{ key: keyof FormState; label: string }> = [
  { key: 'lastName', label: 'Last Name is required' },
  { key: 'firstName', label: 'First Name is required' },
  { key: 'gender', label: 'Gender is required' },
  { key: 'title', label: 'Title is required' },
  { key: 'dateOfBirth', label: 'Date of Birth is required' },
  { key: 'discipline', label: 'Discipline is required' },
  { key: 'photo', label: 'Passport photo is required' },
  { key: 'idFile', label: 'ID / Passport document is required' },
];

const yearsAgo = (years: number) => {
  const d = new Date();
  d.setFullYear(d.getFullYear() - years);
  return d.toISOString().slice(0, 10);
};
const DOB_MAX = yearsAgo(16);
const DOB_MIN = yearsAgo(100);

const ageFrom = (iso: string): number | null => {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - d.getFullYear();
  const m = today.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age -= 1;
  return age;
};

export const InitialProfileClient = () => {
  const router = useRouter();
  const params = useSearchParams();
  const grade = (params.get('grade') ?? 'GRADUATE').toUpperCase();
  const nationalId = params.get('nid') ?? '';
  const phone = params.get('phone') ?? '';

  const [form, setForm] = useState<FormState>(INITIAL);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [showErrors, setShowErrors] = useState(false);
  const [loading, setLoading] = useState(false);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setShowErrors(false);
  };

  const handlePhoto = (file: File | null) => {
    if (photoUrl) URL.revokeObjectURL(photoUrl);
    setPhotoUrl(file ? URL.createObjectURL(file) : null);
    update('photo', file);
  };

  const validate = (): string[] => {
    const missing: string[] = [];
    REQUIRED_FIELDS.forEach(({ key, label }) => {
      const value = form[key];
      if (typeof value === 'string' && !value.trim()) missing.push(label);
      else if (value === null) missing.push(label);
    });
    if (form.dateOfBirth) {
      const age = ageFrom(form.dateOfBirth);
      if (age === null) missing.push('Date of Birth is invalid');
      else if (age < 16) missing.push('You must be at least 16 years old');
      else if (age > 100) missing.push('Date of Birth is unrealistic (over 100 years)');
    }
    return missing;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const found = validate();
    if (found.length > 0) {
      setErrors(found);
      setShowErrors(true);
      return;
    }
    setLoading(true);
    const fullName = [form.title, form.firstName, form.middleName, form.lastName]
      .filter(Boolean)
      .join(' ')
      .trim();

    try {
      await apiJsonRequest('/auth/me', 'PATCH', {
        fullName,
        firstName: form.firstName,
        lastName: form.lastName,
        gender: form.gender,
        title: form.title,
        dateOfBirth: form.dateOfBirth,
        discipline: form.discipline,
        grade,
      }, {
        headers: buildAuthHeader(getAuthToken()),
      });
    } catch {
      // Non-blocking
    }

    patchStoredUser({
      fullName,
      firstName: form.firstName,
      lastName: form.lastName,
      grade,
      gradeLabel: gradeLabelMap[grade] ?? grade,
      discipline: form.discipline,
      gender: form.gender,
      phone,
      nationalId,
    });

    // Store profile data for the documents page
    try {
      sessionStorage.setItem('ies_profile', JSON.stringify({
        fullName,
        phone,
        nationalId,
        grade,
        discipline: form.discipline,
        city: form.city,
      }));
    } catch {
      // sessionStorage unavailable
    }

    setLoading(false);
    router.push('/member');
  };

  const requiredHint = useMemo(() => {
    // Extract the grade name without the "Member" suffix for a cleaner label.
    const label = gradeLabelMap[grade] ?? 'Membership';
    const gradeName = label.replace(/\s*Member$/, '');
    return `Complete your ${gradeName} Membership Profile`;
  }, [grade]);

  // Set the browser tab title dynamically per grade
  useEffect(() => {
    const label = gradeLabelMap[grade] ?? 'Membership';
    document.title = `Initial Profile - ${label} | IES`;
  }, [grade]);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-[#035CB3]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href={routes.home} className="flex items-center gap-2">
            <div className="relative h-10 w-10">
              <Image src={site.logo} alt="" fill className="object-contain" />
            </div>
          </Link>
          <Link href={routes.auth.login} className="text-xs font-semibold uppercase tracking-wider text-white hover:text-[#48C184]">
            Sign in instead ›
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 lg:py-10">
        <div className="mb-5 text-center">
          <span className="inline-block rounded-full bg-[#48C184]/15 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-[#3AA870]">
            {gradeLabelMap[grade] ?? grade}
          </span>
          <h1 className="mt-2 text-2xl font-bold text-[#035CB3]">Initial Profile</h1>
          <p className="mt-1 text-sm text-slate-600">{requiredHint}</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid gap-6 rounded-xl border border-slate-200 bg-white p-6 lg:grid-cols-[minmax(0,220px)_minmax(0,1fr)]"
        >
          {/* Photo + ID uploads */}
          <div className="flex flex-col items-center gap-3 border-b border-slate-100 pb-6 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-6">
            <div className="relative h-40 w-40 overflow-hidden rounded-full bg-slate-100 ring-2 ring-slate-200">
              {photoUrl ? (
                <Image src={photoUrl} alt="Profile preview" fill unoptimized className="object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-slate-400">
                  <svg width="72" height="72" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path d="M10 10a3 3 0 100-6 3 3 0 000 6zm-6 8a6 6 0 1112 0H4z" />
                  </svg>
                </div>
              )}
            </div>
            <p className="text-center text-[11px] text-slate-500">Attach passport-size colored photo</p>
            <label className="w-full">
              <span className="mb-1 block text-[11px] font-semibold text-[#022D5A]">Attach Photo *</span>
              <input
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={(event) => handlePhoto(event.target.files?.[0] ?? null)}
                className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-[11px] file:mr-2 file:rounded-md file:border-0 file:bg-[#035CB3] file:px-2 file:py-1 file:text-[10px] file:font-semibold file:text-white hover:file:bg-[#022D5A]"
              />
              <span className="mt-1 block text-[10px] text-slate-500">PNG and JPEG images only</span>
            </label>
            <label className="w-full">
              <span className="mb-1 block text-[11px] font-semibold text-[#022D5A]">Attach ID/Passport *</span>
              <input
                type="file"
                accept=".pdf"
                onChange={(event) => update('idFile', event.target.files?.[0] ?? null)}
                className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-[11px] file:mr-2 file:rounded-md file:border-0 file:bg-[#035CB3] file:px-2 file:py-1 file:text-[10px] file:font-semibold file:text-white hover:file:bg-[#022D5A]"
              />
              <span className="mt-1 block text-[10px] text-slate-500">PDF documents only</span>
            </label>
          </div>

          {/* Field grid */}
          <div className="grid gap-3 md:grid-cols-2">
            {/* Names row: First / Middle / Last in one row */}
            <div className="grid gap-3 md:col-span-2 md:grid-cols-3">
              <label className="flex flex-col gap-1 text-xs font-semibold text-[#022D5A]">
                First Name *
                <input
                  type="text"
                   placeholder="Enter Your First Name"
                  required
                  value={form.firstName}
                  onChange={(event) => update('firstName', sanitizeName(event.target.value))}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal focus:border-[#035CB3] focus:outline-none focus:ring-1 focus:ring-[#035CB3]"
                />
              </label>
              <label className="flex flex-col gap-1 text-xs font-semibold text-[#022D5A]">
                Middle Name *
                <input
                  type="text"
                  placeholder="Enter Your Middle Name"
                  value={form.middleName}
                  onChange={(event) => update('middleName', sanitizeName(event.target.value))}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal focus:border-[#035CB3] focus:outline-none focus:ring-1 focus:ring-[#035CB3]"
                />
              </label>
              <label className="flex flex-col gap-1 text-xs font-semibold text-[#022D5A]">
                Last Name *
                <input
                  type="text"
                   placeholder="Enter Your Last Name"
                  required
                  value={form.lastName}
                  onChange={(event) => update('lastName', sanitizeName(event.target.value))}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal focus:border-[#035CB3] focus:outline-none focus:ring-1 focus:ring-[#035CB3]"
                />
              </label>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1 text-xs font-semibold text-[#022D5A]">
                Gender *
                <select
                  required
                  value={form.gender}
                  onChange={(event) => update('gender', event.target.value)}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal focus:border-[#035CB3] focus:outline-none focus:ring-1 focus:ring-[#035CB3]"
                >
                  <option value="">Select Your Gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                </select>
              </label>
              <label className="flex flex-col gap-1 text-xs font-semibold text-[#022D5A]">
                Title *
                <select
                  required
                  value={form.title}
                  onChange={(event) => update('title', event.target.value)}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal focus:border-[#035CB3] focus:outline-none focus:ring-1 focus:ring-[#035CB3]"
                >
                  <option value="">Select Your Title</option>
                  <option>Eng.</option>
                  <option>Dr.</option>
                  <option>Prof.</option>
                  <option>Mr.</option>
                  <option>Mrs.</option>
                  <option>Ms.</option>
                </select>
              </label>
            </div>
            <label className="flex flex-col gap-1 text-xs font-semibold text-[#022D5A]">
              Date of Birth *
              <input
                type="date"
                required
                value={form.dateOfBirth}
                min={DOB_MIN}
                max={DOB_MAX}
                onChange={(event) => update('dateOfBirth', event.target.value)}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal focus:border-[#035CB3] focus:outline-none focus:ring-1 focus:ring-[#035CB3]"
              />
              <span className="text-[10px] font-normal text-slate-500">Must be at least 16 years old</span>
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-[#022D5A]">
              National ID/Passport No. *
              <input
                type="text"
                 placeholder="Enter Your National ID/Passport No"
                value={nationalId}
                readOnly
                className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-normal text-slate-600"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-[#022D5A]">
              Nationality *
              <input
                type="text"
                list="nationality-countries"
                placeholder="Search or Select Your Country (e.g., Somalia)"
                value={form.nationality}
                onChange={(event) => update('nationality', sanitizeName(event.target.value))}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal focus:border-[#035CB3] focus:outline-none focus:ring-1 focus:ring-[#035CB3]"
              />
              <datalist id="nationality-countries">
                {countries.map((country) => (
                  <option key={country} value={country} />
                ))}
              </datalist>
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-[#022D5A]">
              City/Town
              <input
                type="text"
                value={form.city}
                onChange={(event) => update('city', sanitizeName(event.target.value))}
                placeholder="Enter Your City/Town (e.g; Mogadishu)"
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal focus:border-[#035CB3] focus:outline-none focus:ring-1 focus:ring-[#035CB3]"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-[#022D5A] md:col-span-2">
              Discipline *
              <select
                required
                value={form.discipline}
                onChange={(event) => update('discipline', event.target.value)}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal focus:border-[#035CB3] focus:outline-none focus:ring-1 focus:ring-[#035CB3]"
              >
                <option value="">Select Your Engineering Discipline</option>
                {engineeringDivisions.map((division) => (
                  <option key={division} value={division}>{division}</option>
                ))}
              </select>
            </label>

            <div className="md:col-span-2">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.hasDisability}
                  onChange={(event) => update('hasDisability', event.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-[#035CB3] focus:ring-[#035CB3]"
                />
                <span className="text-[#022D5A]">Any Form of Disability</span>
              </label>
              {form.hasDisability && (
                <textarea
                  placeholder="Please Specify Your Disability"
                  value={form.disabilityDetails}
                  onChange={(event) => update('disabilityDetails', event.target.value)}
                  rows={2}
                  className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal focus:border-[#035CB3] focus:outline-none focus:ring-1 focus:ring-[#035CB3]"
                />
              )}
            </div>

            <div className="md:col-span-2 flex justify-end pt-2">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-lg bg-[#48C184] px-6 py-2.5 text-sm font-semibold text-[#022D5A] transition-colors hover:bg-[#3AA870] disabled:opacity-50"
              >
                {loading ? 'Saving…' : 'Create Profile'}
                <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M8 5l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </form>

        {showErrors && errors.length > 0 && (
          <>
            <div
              className="fixed inset-0 z-40 bg-slate-900/40"
              onClick={() => setShowErrors(false)}
              aria-hidden="true"
            />
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Validation errors"
              className="fixed left-1/2 top-1/2 z-50 w-[min(400px,90vw)] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-5 shadow-xl"
            >
              <h2 className="text-base font-semibold text-[#022D5A]">Something went wrong</h2>
              <ul className="mt-4 flex flex-col gap-2 text-sm text-slate-700">
                {errors.map((err) => (
                  <li key={err} className="flex items-center gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-700">
                      <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <circle cx="10" cy="10" r="8" />
                        <path d="M7 7l6 6M13 7l-6 6" strokeLinecap="round" />
                      </svg>
                    </span>
                    {err}
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowErrors(false)}
                  className="rounded-lg bg-[#035CB3] px-5 py-2 text-sm font-semibold text-white hover:bg-[#022D5A]"
                >
                  Try Again
                </button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};
