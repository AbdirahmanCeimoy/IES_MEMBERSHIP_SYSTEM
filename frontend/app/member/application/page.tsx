'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAuthToken, getStoredUser, buildAuthHeader } from '@/lib/authSession';
import { apiRequest } from '@/lib/apiClient';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface StoredUser {
  fullName?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  phone?: string;
  nationalId?: string;
  grade?: string;
  gradeLabel?: string;
  role?: string;
}

interface MemberApplication {
  id: string;
  fullName?: string;
  email?: string;
  phone?: string;
  nationalIdNumber?: string;
  membershipGrade?: string;
  organizationName?: string;
  yearsOfExperience?: number;
  stage?: string;
  decision?: string;
  membershipStatus?: string;
  rejectionReason?: string;
  registrationNumber?: string | null;
  certificateNumber?: string | null;
  validUntil?: string | null;
  createdAt?: string;
  updatedAt?: string;
  documents?: Array<{ id: string; type: string; fileName: string }>;
}

type StepStatus = 'done' | 'current' | 'pending' | 'rejected';

interface TimelineStep {
  id: number;
  label: string;
  description: string;
  status: StepStatus;
}

// Backend stage order
const STAGE_INDEX: Record<string, number> = {
  SUBMITTED: 0,
  SCREENING: 1,
  TECHNICAL_REVIEW: 2,
  GRADE_RECOMMENDED: 3,
  PAYMENT_PENDING: 4,
  PAYMENT_CONFIRMED: 5,
  CERTIFICATE_ISSUED: 6,
  REGISTERED: 7,
};

/**
 * 5-step timeline mapping:
 *
 * 1. Submitted       → application exists (any stage)
 * 2. Under Review    → SCREENING or later (admin opened it)
 * 3. Decision        → GRADE_RECOMMENDED or later / decision made
 * 4. Approved        → decision === APPROVED / PAYMENT_PENDING or later
 * 5. Activated       → PAYMENT_CONFIRMED, CERTIFICATE_ISSUED, REGISTERED
 */
function buildTimeline(stage?: string, decision?: string): TimelineStep[] {
  const idx = stage != null ? (STAGE_INDEX[stage] ?? -1) : -1;
  const approved = decision === 'APPROVED';
  const rejected = decision === 'REJECTED';

  const step1Done = idx >= 0;
  const step2Done = idx >= 1; // SCREENING+
  const step3Done = idx >= 3 || approved || rejected; // GRADE_RECOMMENDED+ or decided
  const step4Done = idx >= 4 || approved; // PAYMENT_PENDING+ or approved
  const step5Done = idx >= 5; // PAYMENT_CONFIRMED+

  const resolve = (done: boolean, prevDone: boolean, isRejectedStep = false): StepStatus => {
    if (done && isRejectedStep) return 'rejected';
    if (done) return 'done';
    if (prevDone) return 'current';
    return 'pending';
  };

  return [
    {
      id: 1,
      label: 'Submitted',
      description: 'Application received by IES',
      status: step1Done ? 'done' : 'current',
    },
    {
      id: 2,
      label: 'Under Review',
      description: 'IES Secretariat is reviewing your application',
      status: resolve(step2Done, step1Done),
    },
    {
      id: 3,
      label: 'Decision',
      description: rejected
        ? 'Application was not approved'
        : approved
          ? 'Application approved by IES'
          : 'Awaiting approval decision',
      status: rejected ? 'rejected' : resolve(step3Done, step2Done),
    },
    {
      id: 4,
      label: 'Approved',
      description: 'Membership approved',
      status: rejected ? 'pending' : resolve(step4Done, step3Done),
    },
    {
      id: 5,
      label: 'Activated',
      description: 'Membership account activated',
      status: rejected ? 'pending' : resolve(step5Done, step4Done),
    },
  ];
}

type BadgeTone = 'primary' | 'accent' | 'muted' | 'success' | 'warning';

function getStatusBadge(app: MemberApplication): { label: string; tone: BadgeTone } {
  if (app.decision === 'APPROVED') return { label: 'Approved', tone: 'success' };
  if (app.decision === 'REJECTED') return { label: 'Rejected', tone: 'warning' };
  const stageLabels: Record<string, string> = {
    SUBMITTED: 'Submitted',
    SCREENING: 'Under Review',
    TECHNICAL_REVIEW: 'Under Review',
    GRADE_RECOMMENDED: 'Decision Pending',
    PAYMENT_PENDING: 'Payment Pending',
    PAYMENT_CONFIRMED: 'Payment Confirmed',
    CERTIFICATE_ISSUED: 'Certificate Issued',
    REGISTERED: 'Registered',
  };
  return {
    label: stageLabels[app.stage ?? ''] ?? 'Pending',
    tone: app.stage === 'PAYMENT_PENDING' ? 'warning' : 'primary',
  };
}

function formatDate(iso?: string): string {
  if (!iso) return '-';
  try {
    return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch { return iso; }
}

const GRADE_LABELS: Record<string, string> = {
  STUDENT: 'Student Member (SMIES)',
  GRADUATE: 'Graduate Member (GMIES)',
  ASSOCIATE: 'Associate Member (AMIES)',
  CORPORATE: 'Corporate Member (MIES)',
  FELLOW: 'Fellow Member (FMIES)',
};

// Step circle component
function StepCircle({ step }: { step: TimelineStep }) {
  if (step.status === 'done') {
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#48C184] text-white">
        <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M4 10l5 5 7-7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    );
  }
  if (step.status === 'current') {
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#035CB3] text-white ring-4 ring-blue-100">
        <div className="h-2 w-2 rounded-full bg-white" />
      </div>
    );
  }
  if (step.status === 'rejected') {
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-500 text-white">
        <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M6 6l8 8M14 6l-8 8" strokeLinecap="round" />
        </svg>
      </div>
    );
  }
  // pending
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-slate-200 bg-white text-xs font-bold text-slate-400">
      {step.id}
    </div>
  );
}

export default function MyApplicationPage() {
  const [user] = useState<StoredUser | null>(() =>
    typeof window === 'undefined' ? null : getStoredUser<StoredUser>() ?? {},
  );
  const [applications, setApplications] = useState<MemberApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) { setLoading(false); return; }
    let cancelled = false;
    (async () => {
      try {
        const res = await apiRequest<unknown>('/memberships/my-applications', {
          headers: buildAuthHeader(token),
        });
        if (cancelled || !res.ok) return;
        const raw = res.data as unknown;
        const list = Array.isArray(raw) ? raw : [];
        setApplications(list as MemberApplication[]);
      } catch { /* network error */ }
      finally { if (!cancelled) setLoading(false); }
    })();
    return () => { cancelled = true; };
  }, []);

  const latest = applications[0];
  const timeline = buildTimeline(latest?.stage, latest?.decision);
  const badge = latest ? getStatusBadge(latest) : null;

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-bold text-[#035CB3]">My Application</h1>
        <p className="mt-0.5 text-sm text-slate-500">Track the progress of your membership application.</p>
      </div>

      {loading ? (
        <Card padded>
          <div className="flex items-center justify-center py-10">
            <svg className="h-5 w-5 animate-spin text-[#035CB3]" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
            <span className="ml-3 text-sm text-slate-500">Loading application data...</span>
          </div>
        </Card>
      ) : !latest ? (
        <>
          {/* Empty-state banner with CTA */}
          <Card padded>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Application Status</p>
                <p className="mt-0.5 text-sm font-semibold text-slate-600">Not Submitted</p>
              </div>
              <Badge tone="muted">Not Started</Badge>
            </div>

            <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700">What to do next</p>
              <p className="mt-1 text-sm text-amber-800">
                Complete your profile and submit a membership application to begin the review process.
              </p>
              <Link
                href="/member/profile"
                className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-[#035CB3] px-3 py-1.5 text-xs font-bold uppercase text-white transition-colors hover:bg-[#024A8F]"
              >
                <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="10" cy="7" r="3" /><path d="M4 17c0-3.3 2.7-6 6-6s6 2.7 6 6" strokeLinecap="round" />
                </svg>
                Go to Profile
              </Link>
            </div>

            {/* 5-step timeline — Step 1 is current */}
            <div className="mt-5">
              <p className="mb-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Application Progress</p>
              <ol className="flex flex-col gap-0">
                {timeline.map((step, i) => (
                  <li key={step.id} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <StepCircle step={step} />
                      {i < timeline.length - 1 && (
                        <div className="w-0.5 flex-1 bg-slate-200" style={{ height: 28 }} />
                      )}
                    </div>
                    <div className={i < timeline.length - 1 ? 'pb-5 pt-1' : 'pt-1'}>
                      <p className={
                        'text-sm font-semibold ' +
                        (step.status === 'current' ? 'text-[#035CB3]' : 'text-slate-400')
                      }>
                        {step.label}
                      </p>
                      <p className={
                        'text-xs ' +
                        (step.status === 'pending' ? 'text-slate-300' : 'text-slate-500')
                      }>
                        {step.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </Card>
        </>
      ) : (
        <>
          {/* Status header */}
          <Card padded>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Application ID</p>
                <p className="mt-0.5 font-mono text-sm font-semibold text-[#035CB3]">
                  {latest.id.length > 12 ? `${latest.id.slice(0, 8)}…${latest.id.slice(-4)}` : latest.id}
                </p>
              </div>
              {badge && <Badge tone={badge.tone}>{badge.label}</Badge>}
            </div>

            {/* Rejection reason */}
            {latest.decision === 'REJECTED' && latest.rejectionReason && (
              <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-rose-700">Rejection Reason</p>
                <p className="mt-1 text-sm text-rose-800">{latest.rejectionReason}</p>
              </div>
            )}

            {/* 5-step timeline */}
            <div className="mt-5">
              <p className="mb-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Application Progress</p>
              <ol className="flex flex-col gap-0">
                {timeline.map((step, i) => (
                  <li key={step.id} className="flex items-start gap-3">
                    {/* Circle + connector */}
                    <div className="flex flex-col items-center">
                      <StepCircle step={step} />
                      {i < timeline.length - 1 && (
                        <div className={
                          'w-0.5 flex-1 ' +
                          (step.status === 'done'
                            ? 'bg-[#48C184]'
                            : step.status === 'rejected'
                              ? 'bg-rose-300'
                              : 'bg-slate-200')
                        } style={{ height: 28 }} />
                      )}
                    </div>

                    {/* Text */}
                    <div className={i < timeline.length - 1 ? 'pb-5 pt-1' : 'pt-1'}>
                      <p className={
                        'text-sm font-semibold ' +
                        (step.status === 'done'
                          ? 'text-[#48C184]'
                          : step.status === 'current'
                            ? 'text-[#035CB3]'
                            : step.status === 'rejected'
                              ? 'text-rose-500'
                              : 'text-slate-400')
                      }>
                        {step.label}
                      </p>
                      <p className={
                        'text-xs ' +
                        (step.status === 'pending' ? 'text-slate-300' : 'text-slate-500')
                      }>
                        {step.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </Card>

          {/* Application Details */}
          <Card padded>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Application Details</p>
            <div className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Applicant</span>
                <p className="mt-0.5 font-medium text-[#022D5A]">{latest.fullName ?? user?.fullName ?? '-'}</p>
              </div>
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Email</span>
                <p className="mt-0.5 font-medium text-[#022D5A]">{latest.email ?? user?.email ?? '-'}</p>
              </div>
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Phone</span>
                <p className="mt-0.5 font-medium text-[#022D5A]">{latest.phone ?? user?.phone ?? '-'}</p>
              </div>
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">National ID</span>
                <p className="mt-0.5 font-medium text-[#022D5A]">{latest.nationalIdNumber ?? user?.nationalId ?? '-'}</p>
              </div>
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Applied Grade</span>
                <p className="mt-0.5 font-medium text-[#022D5A]">
                  {GRADE_LABELS[latest.membershipGrade ?? ''] ?? latest.membershipGrade ?? '-'}
                </p>
              </div>
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Date Submitted</span>
                <p className="mt-0.5 font-medium text-[#022D5A]">{formatDate(latest.createdAt)}</p>
              </div>
              {latest.organizationName && (
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Organization</span>
                  <p className="mt-0.5 font-medium text-[#022D5A]">{latest.organizationName}</p>
                </div>
              )}
              {latest.registrationNumber && (
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Registration No.</span>
                  <p className="mt-0.5 font-mono font-medium text-[#48C184]">{latest.registrationNumber}</p>
                </div>
              )}
            </div>
          </Card>

          {/* Submitted Documents */}
          {latest.documents && latest.documents.length > 0 && (
            <Card padded>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Submitted Documents</p>
              <ul className="mt-3 divide-y divide-slate-100">
                {latest.documents.map((doc) => (
                  <li key={doc.id} className="flex items-center gap-3 py-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#035CB3]/10 text-[#035CB3]">
                      <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M6 3h6l4 4v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2z" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12 3v4h4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-[#022D5A]">
                        {doc.type.replace(/_/g, ' ')}
                      </p>
                    </div>
                    <Badge tone="muted">Uploaded</Badge>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Application history */}
          {applications.length > 1 && (
            <Card padded>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Application History</p>
              <div className="mt-3 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      <th className="pb-2 pr-4">Application No</th>
                      <th className="pb-2 pr-4">Category</th>
                      <th className="pb-2 pr-4">Date</th>
                      <th className="pb-2 pr-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((app) => {
                      const appBadge = getStatusBadge(app);
                      return (
                        <tr key={app.id} className="border-b border-slate-50">
                          <td className="py-2.5 pr-4 font-mono text-xs text-[#035CB3]">
                            {app.id.length > 12 ? `${app.id.slice(0, 8)}…` : app.id}
                          </td>
                          <td className="py-2.5 pr-4 text-[#022D5A]">
                            {GRADE_LABELS[app.membershipGrade ?? ''] ?? app.membershipGrade ?? '-'}
                          </td>
                          <td className="py-2.5 pr-4 text-slate-500">{formatDate(app.createdAt)}</td>
                          <td className="py-2.5 pr-4">
                            <Badge tone={appBadge.tone}>{appBadge.label}</Badge>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
