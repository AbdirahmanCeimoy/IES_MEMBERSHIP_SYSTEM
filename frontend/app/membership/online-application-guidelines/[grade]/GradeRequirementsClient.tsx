'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { routes } from '@/config/routes';
import { site } from '@/config/site';
import { SiteContainer } from '@/components/layout/SiteContainer';
import { MembershipMenu } from '@/components/public/MembershipMenu';
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
    <div className="min-h-screen bg-white">
      {/* Top bar */}
      <header className="bg-[#035CB3]">
        <SiteContainer className="flex items-center justify-between py-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-10 w-10">
              <Image src={site.logo} alt="" fill className="object-contain" />
            </div>
          </Link>
          <MembershipMenu />
        </SiteContainer>
      </header>

      <SiteContainer className="py-10 sm:py-14">
        <Card padded className="mx-auto max-w-4xl">
          <h2 className="mb-8 text-center text-2xl font-extrabold text-[#022D5A] sm:text-3xl">
            {spec.headline}
          </h2>

          <ol className="flex flex-col gap-4">
            {spec.requirements.map((req, index) => (
              <li key={req} className="flex items-start gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#035CB3] text-sm font-bold text-white">
                  {index + 1}
                </span>
                <span className="pt-1 text-base text-slate-700">{req}</span>
              </li>
            ))}
          </ol>

          {spec.notes && spec.notes.length > 0 && (
            <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 px-5 py-4">
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-amber-700">
                Important notes
              </p>
              <ul className="flex flex-col gap-1.5 text-sm text-amber-900">
                {spec.notes.map((note) => (
                  <li key={note}>• {note}</li>
                ))}
              </ul>
            </div>
          )}

          <label className="mt-8 flex items-start gap-2 border-t border-slate-100 pt-5 cursor-pointer">
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

          <div className="mt-6 flex flex-col-reverse items-center justify-between gap-3 border-t border-slate-100 pt-5 sm:flex-row">
            <Link
              href={routes.membership.applicationGuidelines}
              className="text-xs font-semibold text-slate-500 hover:text-[#035CB3]"
            >
              ‹ Choose a Different Grade
            </Link>
            <button
              type="button"
              onClick={handleContinue}
              disabled={!accepted}
              className="inline-flex items-center gap-2 rounded-lg bg-[#035CB3] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#48C184] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
            >
              Continue to application
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M8 5l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </Card>
      </SiteContainer>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 py-4">
        <SiteContainer className="flex items-center justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            The Institution of Engineers Somalia (IES) @ {new Date().getFullYear()}
          </p>
        </SiteContainer>
      </footer>
    </div>
  );
};
