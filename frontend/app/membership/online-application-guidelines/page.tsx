'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { site } from '@/config/site';
import { SiteContainer } from '@/components/layout/SiteContainer';
import { MembershipMenu } from '@/components/public/MembershipMenu';

type Tab = 'individual' | 'organization';

interface IndividualGrade {
  code: string;
  label: string;
  fee: string;
}

const individualGrades: IndividualGrade[] = [
  { code: 'STUDENT', label: 'Student Member', fee: '$5.00' },
  { code: 'GRADUATE', label: 'Graduate Member', fee: '$10.00' },
  { code: 'GRAD_TECHNICIAN', label: 'Graduate Engineering Technician', fee: '$10.00' },
  { code: 'GRAD_TECHNOLOGIST', label: 'Graduate Engineering Technologist', fee: '$10.00' },
  { code: 'ASSOCIATE', label: 'Associate Member', fee: '$30.00' },
];

export default function ApplyPage() {
  const [tab, setTab] = useState<Tab>('individual');

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

      <SiteContainer className="py-12 sm:py-16">
        <h1 className="text-center text-2xl font-bold text-[#022D5A] sm:text-3xl">
          Select Membership Category
        </h1>

        {/* Tabs */}
        <div className="mx-auto mt-8 flex justify-center border-b border-slate-200">
          <button
            type="button"
            onClick={() => setTab('individual')}
            className={
              'px-6 py-3 text-sm font-semibold uppercase tracking-wider transition-colors ' +
              (tab === 'individual'
                ? 'border-b-2 border-[#035CB3] text-[#035CB3]'
                : 'text-slate-400 hover:text-slate-600')
            }
          >
            Individual
          </button>
          <button
            type="button"
            onClick={() => setTab('organization')}
            className={
              'px-6 py-3 text-sm font-semibold uppercase tracking-wider transition-colors ' +
              (tab === 'organization'
                ? 'border-b-2 border-[#035CB3] text-[#035CB3]'
                : 'text-slate-400 hover:text-slate-600')
            }
          >
            Organization
          </button>
        </div>

        {/* Individual tab */}
        {tab === 'individual' && (
          <div className="mx-auto mt-10 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {individualGrades.map((g) => (
              <div
                key={g.code}
                className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex flex-1 flex-col items-center justify-center px-6 py-8">
                  <h3 className="text-center text-base font-bold text-[#022D5A]">{g.label}</h3>
                  <p className="mt-3 text-lg font-bold text-[#035CB3]">{g.fee}</p>
                </div>
                <Link
                  href={`/membership/online-application-guidelines/${g.code.toLowerCase()}`}
                  className="flex items-center justify-center gap-2 bg-[#035CB3] py-3 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#48C184]"
                >
                  Select
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* Organization tab */}
        {tab === 'organization' && (
          <div className="mx-auto mt-10 max-w-2xl">
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-col items-center px-8 py-10 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#035CB3]/10">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#035CB3" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                    <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#022D5A]">Organization Member</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  Organization Membership is available to companies, universities, research institutions, and organizations involved in engineering and technology.
                </p>

                <div className="mt-6 w-full rounded-lg border border-slate-100 bg-slate-50 p-5 text-left">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-500">Requirements</p>
                  <ul className="flex flex-col gap-2">
                    <li className="flex items-start gap-2 text-sm text-slate-700">
                      <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#035CB3]">
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                      </span>
                      Registered organization involved in engineering, technology, education, or related activities.
                    </li>
                    <li className="flex items-start gap-2 text-sm text-slate-700">
                      <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#035CB3]">
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                      </span>
                      Commitment to supporting engineering development and professional standards.
                    </li>
                  </ul>
                </div>

                <Link
                  href="/contact"
                  className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#035CB3] px-8 py-3 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#48C184]"
                >
                  Contact Us to Apply
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        )}
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
}
