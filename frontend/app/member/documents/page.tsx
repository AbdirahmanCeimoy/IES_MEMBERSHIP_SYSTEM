'use client';

import { useMemo, useState } from 'react';
import { getAuthToken, getStoredUser } from '@/lib/authSession';
import { API_BASE_URL } from '@/lib/apiClient';
import { Card } from '@/components/ui/Card';
import {
  acceptAttr,
  gradeDocuments,
  type DocumentField,
} from '@/data/grade-documents';
import type { GradeCode } from '@/data/grade-requirements';

interface StoredUser {
  fullName?: string;
  grade?: string;
  gradeLabel?: string;
  discipline?: string;
  nationalId?: string;
  phone?: string;
}

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

export default function MemberDocumentsPage() {
  const [user] = useState<StoredUser | null>(() =>
    typeof window === 'undefined' ? null : getStoredUser<StoredUser>() ?? {},
  );

  const grade = (user?.grade ?? 'GRADUATE').toUpperCase();
  const [docs, setDocs] = useState<Record<string, File | null>>({});
  const [errors, setErrors] = useState<string[]>([]);
  const [showErrors, setShowErrors] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const gradeDocs = useMemo<DocumentField[]>(() => {
    const g = grade as GradeCode;
    return gradeDocuments[g] ?? gradeDocuments.GRADUATE;
  }, [grade]);

  const setDoc = (key: string, file: File | null) => {
    setDocs((prev) => ({ ...prev, [key]: file }));
    setShowErrors(false);
    setSuccess(false);
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
    setSuccess(false);

    try {
      const fd = new FormData();
      fd.append('fullName', user?.fullName ?? '');
      fd.append('email', '');
      fd.append('phone', user?.phone ?? '');
      fd.append('nationalIdNumber', user?.nationalId ?? '');
      fd.append('membershipGrade', grade);
      fd.append('yearsOfExperience', '0');
      fd.append('discipline', user?.discipline ?? '');
      fd.append('declarationAccepted', 'true');

      Object.entries(docs).forEach(([key, file]) => {
        if (file) fd.append(key, file);
      });

      const token = getAuthToken();
      const res = await fetch(`${API_BASE_URL}/memberships/applications`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: fd,
      });

      if (res.ok) {
        setSuccess(true);
        setDocs({});
      } else {
        setErrors(['Failed to submit documents. Please try again.']);
        setShowErrors(true);
      }
    } catch {
      setErrors(['Network error. Please check your connection.']);
      setShowErrors(true);
    } finally {
      setLoading(false);
    }
  };

  const uploadedCount = Object.values(docs).filter(Boolean).length;
  const requiredCount = gradeDocs.filter((d) => d.required).length;

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold text-[#022D5A]">Documents</h1>
        <p className="text-sm text-slate-600">
          Upload the required documents for your{' '}
          <span className="font-semibold text-[#035CB3]">
            {gradeLabelMap[grade] ?? grade}
          </span>{' '}
          application. All documents marked with * are required.
        </p>
      </div>

      {success && (
        <div className="rounded-lg border border-[#48C184]/40 bg-[#48C184]/10 px-4 py-3">
          <p className="text-sm font-semibold text-[#3AA870]">
            ✓ Documents submitted successfully. The Secretariat will review your application.
          </p>
        </div>
      )}

      <Card padded>
        <form onSubmit={handleSubmit}>
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
                    className="w-full rounded-md border border-slate-300 bg-white px-2 py-1 text-[11px] file:mr-2 file:rounded file:border-0 file:bg-[#035CB3] file:px-2 file:py-1 file:text-[10px] file:font-semibold file:text-white hover:file:bg-[#48C184]"
                  />
                  {file && (
                    <span className="mt-1 block truncate text-[10px] text-slate-500">{file.name}</span>
                  )}
                </label>
              );
            })}
          </div>

          <div className="mt-6 flex justify-end border-t border-slate-100 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg bg-[#035CB3] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#48C184] disabled:opacity-50"
            >
              {loading ? 'Submitting…' : 'Submit Documents'}
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M8 5l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </form>
      </Card>

      {showErrors && errors.length > 0 && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-rose-700">Missing Documents</p>
          <ul className="mt-2 flex flex-col gap-1 text-sm text-rose-800">
            {errors.map((err) => (
              <li key={err}>• {err}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
