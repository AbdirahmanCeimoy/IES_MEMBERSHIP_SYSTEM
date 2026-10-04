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

type TimelineStatus = 'done' | 'current' | 'pending';

interface TimelineStep {
  label: string;
  description: string;
  status: TimelineStatus;
}

const BACKEND_STAGES = [
  'SUBMITTED',
  'SCREENING',
  'TECHNICAL_REVIEW',
  'GRADE_RECOMMENDED',
  'PAYMENT_PENDING',
  'PAYMENT_CONFIRMED',
  'CERTIFICATE_ISSUED',
  'REGISTERED',
] as const;

function mapStageToTimeline(stage?: string, decision?: string): TimelineStep[] {
  const stageIndex = stage ? BACKEND_STAGES.indexOf(stage as typeof BACKEND_STAGES[number]) : -1;

  if (decision === 'REJECTED') {
    return [
      { label: 'Submitted', description: 'Application received by IES', status: 'done' },
      { label: 'Initial Review', description: 'Secretariat is checking your documents', status: 'done' },
      { label: 'Committee Review', description: 'Membership committee assessment', status: 'done' },
      { label: 'Approval Decision', description: 'Application was not approved', status: 'current' },
    ];
  }

  // Map the 8 backend stages to 4 visible steps:
  // Step 1 (Submitted):         SUBMITTED
  // Step 2 (Initial Review):    SCREENING
  // Step 3 (Committee Review):  TECHNICAL_REVIEW, GRADE_RECOMMENDED
  // Step 4 (Approval Decision): PAYMENT_PENDING, PAYMENT_CONFIRMED, CERTIFICATE_ISSUED, REGISTERED
  const getStatus = (stepStages: number[]): TimelineStatus => {
    const maxForStep = Math.max(...stepStages);
    const minForStep = Math.min(...stepStages);
    if (stageIndex > maxForStep) return 'done';
    if (stageIndex >= minForStep && stageIndex <= maxForStep) return 'current';
    return 'pending';
  };

  if (decision === 'APPROVED' || stageIndex >= 4) {
    return [
      { label: 'Submitted', description: 'Application received by IES', status: 'done' },
      { label: 'Initial Review', description: 'Secretariat is checking your documents', status: 'done' },
      { label: 'Committee Review', description: 'Membership committee assessment', status: 'done' },
      { label: 'Approval Decision', description: 'Final decision by IES Council', status: decision === 'APPROVED' ? 'done' : 'current' },
    ];
  }

  return [
    { label: 'Submitted', description: 'Application received by IES', status: getStatus([0]) },
    { label: 'Initial Review', description: 'Secretariat is checking your documents', status: getStatus([1]) },
    { label: 'Committee Review', description: 'Membership committee assessment', status: getStatus([2, 3]) },
    { label: 'Approval Decision', description: 'Final decision by IES Council', status: getStatus([4, 5, 6, 7]) },
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
    GRADE_RECOMMENDED: 'Under Review',
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
  } catch {
    return iso;
  }
}

const GRADE_LABELS: Record<string, string> = {
  STUDENT: 'Student Member (SMIES)',
  GRADUATE: 'Graduate Member (GMIES)',
  ASSOCIATE: 'Associate Member (AMIES)',
  CORPORATE: 'Corporate Member (MIES)',
  FELLOW: 'Fellow Member (FMIES)',
};

export default function MyApplicationPage() {
  const [user] = useState<StoredUser | null>(() =>
    typeof window === 'undefined' ? null : getStoredUser<StoredUser>() ?? {},
  );
  const [applications, setApplications] = useState<MemberApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      setLoading(false);
      return;
    }
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
      } catch {
        /* network error */
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const latest = applications[0];
  const timeline = latest
    ? mapStageToTimeline(latest.stage, latest.decision)
    : mapStageToTimeline();
  const badge = latest ? getStatusBadge(latest) : null;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-[#035CB3]">My Application</h1>
        <p className="text-sm text-slate-600">Track the progress of your membership application.</p>
      </div>

      {loading ? (
        <Card padded>
          <div className="flex items-center justify-center py-12">
            <svg className="h-6 w-6 animate-spin text-[#035CB3]" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
            <span className="ml-3 text-sm text-slate-500">Loading application data...</span>
          </div>
        </Card>
      ) : !latest ? (
        <Card padded>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="12" y1="18" x2="12" y2="12" />
                <line x1="9" y1="15" x2="15" y2="15" />
              </svg>
            </div>
            <h3 className="mt-4 text-base font-semibold text-[#022D5A]">No Application Found</h3>
            <p className="mt-1.5 max-w-sm text-sm text-slate-500">
              You have not submitted a membership application yet. Complete your profile and submit an application to get started.
            </p>
            <Link
              href="/member/profile"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#035CB3] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#024A8F]"
            >
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="10" cy="7" r="3" />
                <path d="M4 17c0-3.3 2.7-6 6-6s6 2.7 6 6" strokeLinecap="round" />
              </svg>
              Go to Profile
            </Link>
          </div>
        </Card>
      ) : (
        <>
          {/* Application ID + Status Badge */}
          <Card padded>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                  Application ID
                </p>
                <p className="mt-1 font-mono text-sm font-semibold text-[#035CB3]">
                  {latest.id.length > 12 ? `${latest.id.slice(0, 8)}...${latest.id.slice(-4)}` : latest.id}
                </p>
              </div>
              {badge && <Badge tone={badge.tone}>{badge.label}</Badge>}
            </div>

            {/* Rejection reason */}
            {latest.decision === 'REJECTED' && latest.rejectionReason && (
              <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 p-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-rose-700">Rejection Reason</p>
                <p className="mt-1 text-sm text-rose-800">{latest.rejectionReason}</p>
              </div>
            )}

            {/* Timeline */}
            <ol className="mt-5 flex flex-col gap-4">
              {timeline.map((step, index) => (
                <li key={step.label} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className={
                        'flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ' +
                        (step.status === 'done'
                          ? 'bg-[#48C184] text-white'
                          : step.status === 'current'
                            ? 'bg-[#035CB3] text-white ring-4 ring-blue-100'
                            : 'bg-white text-slate-400 ring-1 ring-slate-200')
                      }
                    >
                      {step.status === 'done' ? (
                        <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        index + 1
                      )}
                    </div>
                    {index < timeline.length - 1 && (
                      <div
                        className={
                          'mt-1 h-8 w-0.5 ' + (step.status === 'done' ? 'bg-[#48C184]' : 'bg-slate-200')
                        }
                      />
                    )}
                  </div>
                  <div className="pt-1">
                    <p
                      className={
                        'text-sm font-semibold ' +
                        (step.status === 'done' || step.status === 'current' ? 'text-[#035CB3]' : 'text-slate-500')
                      }
                    >
                      {step.label}
                    </p>
                    <p className="text-xs text-slate-500">{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Card>

          {/* Application Details */}
          <Card padded>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Application Details</p>
            <div className="mt-3 grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Applicant</span>
                <p className="mt-0.5 font-medium text-[#022D5A]">{latest.fullName ?? user?.fullName ?? '-'}</p>
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Email</span>
                <p className="mt-0.5 font-medium text-[#022D5A]">{latest.email ?? user?.email ?? '-'}</p>
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Phone</span>
                <p className="mt-0.5 font-medium text-[#022D5A]">{latest.phone ?? user?.phone ?? '-'}</p>
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">National ID</span>
                <p className="mt-0.5 font-medium text-[#022D5A]">{latest.nationalIdNumber ?? user?.nationalId ?? '-'}</p>
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Applied Grade</span>
                <p className="mt-0.5 font-medium text-[#022D5A]">
                  {GRADE_LABELS[latest.membershipGrade ?? ''] ?? latest.membershipGrade ?? '-'}
                </p>
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Date Submitted</span>
                <p className="mt-0.5 font-medium text-[#022D5A]">{formatDate(latest.createdAt)}</p>
              </div>
              {latest.organizationName && (
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Organization</span>
                  <p className="mt-0.5 font-medium text-[#022D5A]">{latest.organizationName}</p>
                </div>
              )}
              {latest.registrationNumber && (
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Registration No.</span>
                  <p className="mt-0.5 font-mono font-medium text-[#48C184]">{latest.registrationNumber}</p>
                </div>
              )}
            </div>
          </Card>

          {/* Documents */}
          {latest.documents && latest.documents.length > 0 && (
            <Card padded>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Submitted Documents</p>
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

          {/* All Applications Table (if more than one) */}
          {applications.length > 1 && (
            <Card padded>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Application History</p>
              <div className="mt-3 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      <th className="pb-2 pr-4">Application No</th>
                      <th className="pb-2 pr-4">Applied Category</th>
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
                            {app.id.length > 12 ? `${app.id.slice(0, 8)}...` : app.id}
                          </td>
                          <td className="py-2.5 pr-4 text-[#022D5A]">
                            {GRADE_LABELS[app.membershipGrade ?? ''] ?? app.membershipGrade ?? '-'}
                          </td>
                          <td className="py-2.5 pr-4 text-slate-600">
                            {formatDate(app.createdAt)}
                          </td>
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
