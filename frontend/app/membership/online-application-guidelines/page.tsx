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
  { code: 'FELLOW', label: 'Fellow Member (FMIES)', fee: '$50.00' },
  { code: 'SENIOR', label: 'Senior Member (SenMIES)', fee: '$30.00' },
  { code: 'CORPORATE', label: 'Corporate Member (CMIES)', fee: '$20.00' },
  { code: 'ASSOCIATE', label: 'Associate Member (AMIES)', fee: '$20.00' },
  { code: 'GRADUATE', label: 'Graduate Member (GMIES)', fee: '$10.00' },
  { code: 'GRAD_TECHNOLOGIST', label: 'Graduate Engineering Technologist', fee: '$10.00' },
  { code: 'GRAD_TECHNICIAN', label: 'Graduate Engineering Technician', fee: '$10.00' },
  { code: 'STUDENT', label: 'Student Member (SMIES)', fee: '$5.00' },
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
          <div className="mx-auto mt-10 max-w-3xl space-y-6">
            {/* Main heading */}
            <div className="text-center">
              <h2 className="text-2xl font-extrabold tracking-tight text-[#035CB3] sm:text-3xl">
                Join our Organizational Membership
              </h2>
            </div>

            {/* Objective */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-3 text-lg font-bold text-[#035CB3]">Objective</h3>
              <div className="flex flex-col gap-3 text-sm leading-relaxed text-slate-700 sm:text-base">
                <p>
                  The Institution of Engineers Somalia (IES) welcomes companies, universities, research institutions, and other organizations engaged in engineering, technology, education, research and development, contracting, manufacturing, and related activities to become Organization Members.
                </p>
                <p>
                  Organization Membership provides a platform for collaboration between IES and industry, academia, research institutions, and other relevant organizations. It promotes professional networking, knowledge exchange, continuing professional development, and greater contribution of the engineering profession to the development of Somali society.
                </p>
              </div>
            </div>

            {/* Eligibility */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-3 text-lg font-bold text-[#035CB3]">Eligibility</h3>
              <p className="mb-3 text-sm text-slate-700">Organization Membership is open to:</p>
              <ul className="flex flex-col gap-2">
                {[
                  'Companies and organizations legally registered in Somalia.',
                  'Engineering and technology companies.',
                  'Contracting and construction companies.',
                  'Manufacturing and engineering-related industries.',
                  'Universities and academic institutions.',
                  'Research and development institutions.',
                  'Other organizations engaged in engineering, technology, education, or related activities.',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm leading-relaxed text-slate-700">
                    <span className="mt-1.5 flex h-1.5 w-1.5 shrink-0 rounded-full bg-[#48C184]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Membership Requirements */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-3 text-lg font-bold text-[#035CB3]">IES Organizational Membership Requirements</h3>
              <p className="mb-3 text-sm text-slate-700">Organizations applying for membership should:</p>
              <ul className="flex flex-col gap-2">
                {[
                  'Be a legally registered organization in Somalia.',
                  'Be engaged in engineering, technology, education, research, contracting, manufacturing, or related activities.',
                  'Demonstrate an interest in supporting engineering development and professional standards.',
                  'Provide the required organizational information and documentation requested by IES.',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm leading-relaxed text-slate-700">
                    <span className="mt-1.5 flex h-1.5 w-1.5 shrink-0 rounded-full bg-[#48C184]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Membership Fee */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-3 text-lg font-bold text-[#035CB3]">IES Organizational Membership Fee</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg bg-[#035CB3]/5 p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-[#035CB3]">Annual Subscription</p>
                  <p className="mt-1 text-2xl font-extrabold text-[#022D5A]">$ 500</p>
                </div>
                <div className="rounded-lg bg-[#48C184]/10 p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-[#3AA870]">Entrance Fee</p>
                  <p className="mt-1 text-2xl font-extrabold text-[#022D5A]">$ 0</p>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-bold text-[#035CB3]">IES Organizational Membership Benefits</h3>
              <div className="flex flex-col gap-5">
                {[
                  {
                    title: 'Continuing Professional Development (CPD)',
                    items: [
                      'Access to IES conferences, seminars, workshops, and other professional development activities.',
                      'Opportunities for continuing education and professional upgrading.',
                      'Members’ rates for IES-organized events.',
                      'Member rates are applicable to two (2) nominated employees of the organization.',
                    ],
                  },
                  {
                    title: 'Professional Networking and Collaboration',
                    items: [
                      'Opportunities to connect with engineers, engineering organizations, academic institutions, government institutions, and industry stakeholders.',
                      'Opportunities to participate in IES programs, initiatives, and professional activities.',
                      'Support for collaboration between industry, academia, and the engineering profession.',
                    ],
                  },
                  {
                    title: 'Updates and Professional Information',
                    items: [
                      'Receive updates on relevant government regulations, engineering developments, and professional matters.',
                      'Receive information about activities, programs, and opportunities organized by IES and allied institutions.',
                    ],
                  },
                  {
                    title: 'Marketing and Outreach',
                    items: [
                      'Organization’s name and logo may be featured on the IES website as an Organization Member.',
                      'Opportunities to increase organizational visibility through appropriate IES activities and communication channels.',
                    ],
                  },
                  {
                    title: 'Contribution to Engineering Development',
                    items: [
                      'Opportunity to support the development and advancement of the engineering profession in Somalia.',
                      'Opportunity to contribute to initiatives that promote professional standards, knowledge, innovation, and engineering development.',
                    ],
                  },
                ].map((benefit, idx) => (
                  <div key={benefit.title}>
                    <div className="mb-2 flex items-center gap-2">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#035CB3] text-xs font-bold text-white">
                        {idx + 1}
                      </span>
                      <h4 className="text-sm font-bold text-[#022D5A] sm:text-base">{benefit.title}</h4>
                    </div>
                    <ul className="ml-8 flex flex-col gap-1.5">
                      {benefit.items.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm leading-relaxed text-slate-700">
                          <span className="mt-1.5 flex h-1.5 w-1.5 shrink-0 rounded-full bg-[#48C184]" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Closing / Join CTA */}
            <div className="rounded-xl border border-[#035CB3]/15 bg-gradient-to-br from-[#e8f0fe] to-white p-6 text-center shadow-sm">
              <h3 className="text-lg font-bold text-[#022D5A] sm:text-xl">
                Join IES as an Organization Member
              </h3>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
                Organizations interested in joining IES as an Organizational Member can apply by completing the IES Organizational Membership Form below and providing the required organizational and registration information.              </p>
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSfOeDL1ZMm_FxPd58XY1TvrG5j4D9PdhLStUAarG6Ait-G1Uw/viewform?usp=header"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#022D5A] px-8 py-3 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#035CB3]"
              >
                Apply for IES Organizational Membership
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </a>
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
