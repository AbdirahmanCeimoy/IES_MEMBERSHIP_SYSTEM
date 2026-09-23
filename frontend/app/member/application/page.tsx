'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getStoredUser } from '@/lib/authSession';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';

interface StoredUser {
  fullName?: string;
  username?: string;
  email?: string;
  role?: string;
}

const timelineSteps = [
  { label: 'Submitted', done: true, description: 'Application received by IES' },
  { label: 'Initial Review', done: false, current: true, description: 'Secretariat is checking your documents' },
  { label: 'Committee Review', done: false, description: 'Membership committee assessment' },
  { label: 'Approval Decision', done: false, description: 'Final decision by IES Council' },
  { label: 'Certificate Issued', done: false, description: 'Registration number and certificate' },
];

export default function MyApplicationPage() {
  const [user] = useState<StoredUser | null>(() =>
    typeof window === 'undefined' ? null : getStoredUser<StoredUser>() ?? {},
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-[#022D5A]">My Application</h1>
        <p className="text-sm text-slate-600">Track the progress of your membership application.</p>
      </div>

      <Card padded>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
              Application ID
            </p>
            <p className="mt-1 text-sm font-mono font-semibold text-[#022D5A]">- pending -</p>
          </div>
          <Badge tone="warning">Under Review</Badge>
        </div>

        <ol className="mt-5 flex flex-col gap-4">
          {timelineSteps.map((step, index) => (
            <li key={step.label} className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={
                    'flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ' +
                    (step.done
                      ? 'bg-[#48C184] text-[#022D5A]'
                      : step.current
                        ? 'bg-[#035CB3] text-white ring-4 ring-blue-100'
                        : 'bg-white text-slate-400 ring-1 ring-slate-200')
                  }
                >
                  {step.done ? '✓' : index + 1}
                </div>
                {index < timelineSteps.length - 1 && (
                  <div
                    className={
                      'mt-1 h-8 w-0.5 ' + (step.done ? 'bg-[#48C184]' : 'bg-slate-200')
                    }
                  />
                )}
              </div>
              <div className="pt-1">
                <p
                  className={
                    'text-sm font-semibold ' +
                    (step.done || step.current ? 'text-[#022D5A]' : 'text-slate-500')
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

      <Card padded>
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Submitted details</p>
        <div className="mt-3 grid gap-2 text-sm text-slate-700 md:grid-cols-2">
          <div><span className="font-semibold text-[#022D5A]">Applicant:</span> {user?.fullName ?? user?.username ?? '-'}</div>
          <div><span className="font-semibold text-[#022D5A]">Email:</span> {user?.email ?? '-'}</div>
        </div>
        <div className="mt-4">
          <EmptyState
            title="Live application data not yet connected"
            description="This page will show your submitted profile and documents once the backend /member/my-applications endpoint is wired to the dashboard."
            action={
              <Link href="/member" className="text-xs font-semibold text-[#035CB3] hover:underline">
                ‹ Back to overview
              </Link>
            }
          />
        </div>
      </Card>
    </div>
  );
}
