'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Card } from '@/components/ui/Card';
import { routes } from '@/config/routes';
import type { GradeRequirements } from '@/data/grade-requirements';

interface Props {
  spec: GradeRequirements;
}

export const GradeRequirementsClient = ({ spec }: Props) => {
  const router = useRouter();
  const [accepted, setAccepted] = useState(false);

  const handleContinue = () => {
    if (!accepted) return;
    router.push(`/register?grade=${spec.code}`);
  };

  return (
    <>
      <PageHero
        eyebrow={spec.postnominal ? `${spec.label} · ${spec.postnominal}` : spec.label}
        title={spec.headline}
        description={spec.summary}
        breadcrumbs={
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Membership', href: routes.membership.root },
              { label: 'Apply', href: routes.membership.applicationGuidelines },
              { label: spec.label },
            ]}
          />
        }
      />

      <Section tone="muted">
        <Card padded className="mx-auto max-w-3xl">
          <div className="mb-5 flex items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
              Requirements checklist
            </p>
          </div>

          <ol className="flex flex-col gap-3">
            {spec.requirements.map((req, index) => (
              <li key={req} className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#035CB3] text-xs font-bold text-white">
                  {index + 1}
                </span>
                <span className="pt-0.5 text-sm text-slate-700">{req}</span>
              </li>
            ))}
          </ol>

          {spec.notes && spec.notes.length > 0 && (
            <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-amber-700">
                Important notes
              </p>
              <ul className="flex flex-col gap-1 text-xs text-amber-900">
                {spec.notes.map((note) => (
                  <li key={note}>• {note}</li>
                ))}
              </ul>
            </div>
          )}

          <label className="mt-6 flex items-start gap-2 border-t border-slate-100 pt-4 cursor-pointer">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(event) => setAccepted(event.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#035CB3] focus:ring-[#035CB3]"
            />
            <span className="text-sm text-slate-700">
              I confirm I meet the requirements above and{' '}
              <Link href={routes.membership.root} className="font-semibold text-[#035CB3] hover:underline">
                accept the IES Membership Policy and Terms
              </Link>
              .
            </span>
          </label>

          <div className="mt-5 flex flex-col-reverse items-center justify-between gap-3 border-t border-slate-100 pt-4 sm:flex-row">
            <Link
              href={routes.membership.applicationGuidelines}
              className="text-xs font-semibold text-slate-500 hover:text-[#035CB3]"
            >
              ‹ Choose a different grade
            </Link>
            <button
              type="button"
              onClick={handleContinue}
              disabled={!accepted}
              className="inline-flex items-center gap-2 rounded-lg bg-[#48C184] px-6 py-2.5 text-sm font-semibold text-[#022D5A] transition-colors hover:bg-[#3AA870] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
            >
              Continue to application
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M8 5l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </Card>
      </Section>
    </>
  );
};
