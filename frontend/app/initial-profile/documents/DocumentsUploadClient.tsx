'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { site } from '@/config/site';
import { routes } from '@/config/routes';
import { getAuthToken } from '@/lib/authSession';
import { API_BASE_URL } from '@/lib/apiClient';
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

export const DocumentsUploadClient = () => {
  const router = useRouter();
  const params = useSearchParams();
  const grade = (params.get('grade') ?? 'GRADUATE').toUpperCase();
  const nationalId = params.get('nid') ?? '';
  const phone = params.get('phone') ?? '';

  const [docs, setDocs] = useState<Record<string, File | null>>({});
  const [errors, setErrors] = useState<string[]>([]);
  const [showErrors, setShowErrors] = useState(false);
  const [loading, setLoading] = useState(false);

  const gradeDocs = useMemo<DocumentField[]>(() => {
    const g = grade as GradeCode;
    return gradeDocuments[g] ?? gradeDocuments.GRADUATE;
  }, [grade]);

  const setDoc = (key: string, file: File | null) => {
    setDocs((prev) => ({ ...prev, [key]: file }));
    setShowErrors(false);
  };

  const validate = (): string[] => {
    const missing: string[] = [];
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

    // Read profile data saved by the previous step
    let profileData = { fullName: '', phone: '', nationalId: '', discipline: '', city: '' };
    try {
      const stored = sessionStorage.getItem('ies_profile');
      if (stored) {
        profileData = { ...profileData, ...JSON.parse(stored) };
      }
    } catch {
      // fallback to URL params
    }

    try {
      const fd = new FormData();
      fd.append('fullName', profileData.fullName);
      fd.append('email', '');
      fd.append('phone', profileData.phone || phone);
      fd.append('nationalIdNumber', profileData.nationalId || nationalId);
      fd.append('membershipGrade', grade);
      fd.append('yearsOfExperience', '0');
      fd.append('discipline', profileData.discipline);
      fd.append('declarationAccepted', 'true');

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
      // Non-blocking
    }

    try {
      sessionStorage.removeItem('ies_profile');
    } catch {
      // ignore
    }

    setLoading(false);
    router.push('/member');
  };

  const uploadedCount = Object.values(docs).filter(Boolean).length;
  const requiredCount = gradeDocs.filter((d) => d.required).length;

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

      <main className="mx-auto max-w-4xl px-4 py-6 lg:py-10">
        <div className="mb-5 text-center">
          <h1 className="text-2xl font-bold text-[#022D5A]">Required Documents</h1>
          <p className="mt-1 text-sm text-slate-600">
            Upload the documents required for your{' '}
            <span className="font-semibold text-[#035CB3]">
              {gradeLabelMap[grade] ?? grade}
            </span>{' '}
            application.
          </p>
        </div>

        {/* Progress indicator */}
        <div className="mb-6 flex items-center justify-center gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#48C184] text-xs font-bold text-white">
              <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 10 8 14 16 6" /></svg>
            </span>
            <span className="text-xs font-semibold text-slate-500">Profile</span>
          </div>
          <div className="h-px w-10 bg-slate-300" />
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#035CB3] text-xs font-bold text-white">
              2
            </span>
            <span className="text-xs font-semibold text-[#035CB3]">Documents</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
              Required Documents
            </p>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-600">
              {uploadedCount} / {requiredCount}
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

          <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
            <Link
              href={`/initial-profile?grade=${grade}&nid=${encodeURIComponent(nationalId)}&phone=${encodeURIComponent(phone)}`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition-colors hover:text-[#035CB3]"
            >
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M12 5l-5 5 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Back to Profile
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg bg-[#48C184] px-6 py-2.5 text-sm font-semibold text-[#022D5A] transition-colors hover:bg-[#3AA870] disabled:opacity-50"
            >
              {loading ? 'Submitting…' : 'Submit Application'}
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M8 5l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
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
              <h2 className="text-base font-semibold text-[#022D5A]">Missing Documents</h2>
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
