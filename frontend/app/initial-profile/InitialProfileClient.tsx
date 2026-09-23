'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { site } from '@/config/site';
import { routes } from '@/config/routes';
import { engineeringDivisions } from '@/data/institution';
import { sanitizeName } from '@/lib/inputSanitizers';
import { buildAuthHeader, getAuthToken, patchStoredUser } from '@/lib/authSession';
import { apiJsonRequest, API_BASE_URL } from '@/lib/apiClient';
import {
  acceptAttr,
  gradeDocuments,
  type DocumentField,
} from '@/data/grade-documents';
import type { GradeCode } from '@/data/grade-requirements';

const gradeLabelMap: Record<string, string> = {
  STUDENT: 'Student Member',
  GRADUATE: 'Graduate Member',
  ASSOCIATE: 'Associate Member',
  CORPORATE: 'Corporate Member',
  SENIOR: 'Senior Member',
  FELLOW: 'Fellow Member',
};

interface FormState {
  lastName: string;
  firstName: string;
  otherNames: string;
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
  otherNames: '',
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
/** Minimum age 16, maximum sensible age 100. */
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

  const [form, setForm] = useState<FormState>(INITIAL);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [showErrors, setShowErrors] = useState(false);
  const [loading, setLoading] = useState(false);
  const [docs, setDocs] = useState<Record<string, File | null>>({});

  const gradeDocs = useMemo<DocumentField[]>(() => {
    const g = grade as GradeCode;
    return gradeDocuments[g] ?? gradeDocuments.GRADUATE;
  }, [grade]);

  const setDoc = (key: string, file: File | null) => {
    setDocs((prev) => ({ ...prev, [key]: file }));
    setShowErrors(false);
  };

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
    // Grade-specific document requirements.
    gradeDocs.forEach((field) => {
      if (field.required && !docs[field.key]) {
        missing.push(`${field.label} is required`);
      }
    });
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
    const fullName = [form.title, form.firstName, form.otherNames, form.lastName]
      .filter(Boolean)
      .join(' ')
      .trim();

    // 1) Persist profile fields to /auth/me so the admin analytics update.
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
      // Non-blocking: continue with the membership submission.
    }

    // 2) Submit the membership application with grade documents via multipart.
    try {
      const fd = new FormData();
      fd.append('fullName', fullName);
      fd.append('email', ''); // backend uses the authenticated user's email
      fd.append('phone', form.city); // best-effort - phone came from URL earlier
      fd.append('nationalIdNumber', nationalId);
      fd.append('membershipGrade', grade);
      fd.append('yearsOfExperience', '0');
      fd.append('discipline', form.discipline);
      fd.append('declarationAccepted', 'true');
      // Attach the general photo + ID (in addition to grade-specific docs).
      if (form.photo) fd.append('passportPhotoFileName', form.photo);
      if (form.idFile) fd.append('idOrPassportFileName', form.idFile);
      Object.entries(docs).forEach(([key, file]) => {
        if (file) fd.append(key, file);
      });

      const token = getAuthToken();
      await fetch(`${API_BASE_URL}/memberships/applications`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: fd,
      });
    } catch {
      // Non-blocking: user still lands in the member portal.
    }

    patchStoredUser({
      fullName,
      firstName: form.firstName,
      lastName: form.lastName,
      grade,
      gradeLabel: gradeLabelMap[grade] ?? grade,
      discipline: form.discipline,
      gender: form.gender,
    });

    setLoading(false);
    router.push('/member');
  };

  const requiredHint = useMemo(
    () =>
      `Complete your ${grade.toLowerCase()} profile - this becomes part of your membership application.`,
    [grade],
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-4 py-3">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href={routes.home} className="flex items-center gap-2">
            <div className="relative h-8 w-8">
              <Image src={site.logo} alt="" fill className="object-contain" />
            </div>
            <span className="text-sm font-bold text-[#022D5A]">{site.shortName}omalia</span>
          </Link>
          <Link href={routes.auth.login} className="text-xs font-semibold text-slate-500 hover:text-[#035CB3]">
            Sign in instead ›
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 lg:py-10">
        <div className="mb-5 text-center">
          <h1 className="text-2xl font-bold text-[#022D5A]">Initial Profile</h1>
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
              <span className="mb-1 block text-[11px] font-semibold text-[#022D5A]">Attach ID / Passport *</span>
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
            <label className="flex flex-col gap-1 text-xs font-semibold text-[#022D5A]">
              Last Name *
              <input
                type="text"
                required
                value={form.lastName}
                onChange={(event) => update('lastName', sanitizeName(event.target.value))}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal focus:border-[#035CB3] focus:outline-none focus:ring-1 focus:ring-[#035CB3]"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-[#022D5A]">
              First Name *
              <input
                type="text"
                required
                value={form.firstName}
                onChange={(event) => update('firstName', sanitizeName(event.target.value))}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal focus:border-[#035CB3] focus:outline-none focus:ring-1 focus:ring-[#035CB3]"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-[#022D5A]">
              Other Names
              <input
                type="text"
                value={form.otherNames}
                onChange={(event) => update('otherNames', sanitizeName(event.target.value))}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal focus:border-[#035CB3] focus:outline-none focus:ring-1 focus:ring-[#035CB3]"
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1 text-xs font-semibold text-[#022D5A]">
                Gender *
                <select
                  required
                  value={form.gender}
                  onChange={(event) => update('gender', event.target.value)}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal focus:border-[#035CB3] focus:outline-none focus:ring-1 focus:ring-[#035CB3]"
                >
                  <option value="">Select…</option>
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
                  <option value="">Select…</option>
                  <option>Mr</option>
                  <option>Mrs</option>
                  <option>Ms</option>
                  <option>Dr</option>
                  <option>Eng.</option>
                  <option>Prof.</option>
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
              ID / Passport No. *
              <input
                type="text"
                value={nationalId}
                readOnly
                className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-normal text-slate-600"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-[#022D5A]">
              Nationality *
              <input
                type="text"
                value={form.nationality}
                onChange={(event) => update('nationality', sanitizeName(event.target.value))}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal focus:border-[#035CB3] focus:outline-none focus:ring-1 focus:ring-[#035CB3]"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-[#022D5A]">
              City / Town
              <input
                type="text"
                value={form.city}
                onChange={(event) => update('city', sanitizeName(event.target.value))}
                placeholder="e.g. Mogadishu"
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
                <option value="">Select an engineering discipline…</option>
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
                <span className="text-[#022D5A]">Any form of disability</span>
              </label>
              {form.hasDisability && (
                <textarea
                  placeholder="Please describe (kept confidential and used only for reasonable accommodation)"
                  value={form.disabilityDetails}
                  onChange={(event) => update('disabilityDetails', event.target.value)}
                  rows={2}
                  className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal focus:border-[#035CB3] focus:outline-none focus:ring-1 focus:ring-[#035CB3]"
                />
              )}
            </div>

            {/* Grade-specific documents section */}
            <div className="md:col-span-2 border-t border-slate-100 pt-4">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                    Required Documents
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Attach the documents required for your{' '}
                    <span className="font-semibold text-[#022D5A]">
                      {gradeLabelMap[grade] ?? grade}
                    </span>{' '}
                    application.
                  </p>
                </div>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-600">
                  {Object.values(docs).filter(Boolean).length} / {gradeDocs.filter((d) => d.required).length}
                </span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {gradeDocs.map((field) => {
                  const file = docs[field.key];
                  return (
                    <label key={field.key + field.label} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                      <span className="mb-1 flex items-center justify-between text-[11px] font-semibold text-[#022D5A]">
                        <span className="truncate">
                          {field.label}
                          {field.required ? ' *' : ' (optional)'}
                        </span>
                        {file && (
                          <span className="ml-2 shrink-0 rounded-full bg-[#48C184]/15 px-1.5 text-[9px] font-bold uppercase text-[#3AA870]">
                            ✓
                          </span>
                        )}
                      </span>
                      {field.helper && (
                        <span className="mb-1 block text-[10px] text-slate-500">{field.helper}</span>
                      )}
                      <input
                        type="file"
                        accept={acceptAttr(field.accept)}
                        onChange={(event) => setDoc(field.key, event.target.files?.[0] ?? null)}
                        className="w-full rounded-md border border-slate-300 bg-white px-2 py-1 text-[11px] file:mr-2 file:rounded file:border-0 file:bg-[#035CB3] file:px-2 file:py-1 file:text-[10px] file:font-semibold file:text-white hover:file:bg-[#022D5A]"
                      />
                      {file && (
                        <span className="mt-1 block truncate text-[10px] text-slate-500">{file.name}</span>
                      )}
                    </label>
                  );
                })}
              </div>
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

        {/* Error modal (like reference) */}
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
