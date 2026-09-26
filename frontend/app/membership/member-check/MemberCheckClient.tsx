'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/Badge';
import { apiRequest } from '@/lib/apiClient';
import { site } from '@/config/site';
import { SiteContainer } from '@/components/layout/SiteContainer';
import { MembershipMenu } from '@/components/public/MembershipMenu';
import { Footer } from '@/components/layout/Footer';

interface MemberResult {
  registrationNumber?: string;
  certificateNumber?: string;
  fullName?: string;
  email?: string;
  membershipGrade?: string;
  status?: string;
  validUntil?: string | null;
}

interface SearchResponse {
  total?: number;
  members?: MemberResult[];
}

export const MemberCheckClient = () => {
  const [query, setQuery] = useState('');
  const [members, setMembers] = useState<MemberResult[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const term = query.trim();
    if (!term) return;
    setLoading(true);
    setMembers([]);
    setTotal(0);
    setSearched(true);

    const encoded = encodeURIComponent(term);
    const res = await apiRequest<SearchResponse>(`/memberships/search?q=${encoded}`);
    setLoading(false);

    if (!res.ok || !res.data) {
      setMembers([]);
      setTotal(0);
      return;
    }
    setMembers(res.data.members ?? []);
    setTotal(res.data.total ?? 0);
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Top bar */}
      <header className="bg-[#035CB3]">
        <SiteContainer className="flex items-center justify-between py-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-10 w-10">
              <Image src={site.logo} alt="" fill className="object-contain" />
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/member"
              className="inline-flex items-center gap-2 rounded-md bg-white/15 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#48C184]"
            >
              My Account
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
            <MembershipMenu />
          </div>
        </SiteContainer>
      </header>

      <main className="flex-1">
        <SiteContainer className="py-16 sm:py-20">
          <h1 className="text-center text-2xl font-extrabold uppercase tracking-wide text-[#022D5A] sm:text-3xl">
            Search Members
          </h1>

          {/* Search bar with button */}
          <form onSubmit={handleSubmit} className="mx-auto mt-8 flex max-w-4xl overflow-hidden rounded-lg border border-slate-200 shadow-sm">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by Member No / ID or Passport / Email / Member Name"
              className="flex-1 px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-[#035CB3] px-6 py-3 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#48C184] disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Search Members'}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
          </form>

          {/* Search Results header */}
          <div className="mx-auto mt-8 flex max-w-4xl items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="text-sm font-bold text-[#022D5A]">Search Results</h2>
            <p className="text-sm text-slate-600">
              Found <span className="font-bold text-[#022D5A]">{total}</span> of total results
            </p>
          </div>

          {/* Results area */}
          <div className="mx-auto mt-6 max-w-4xl space-y-4">
            {members.length > 0 &&
              members.map((member, idx) => (
                <div key={idx} className="rounded-lg border border-slate-200 p-5 shadow-sm">
                  <div className="mb-3 flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div>
                      <p className={
                        'text-[11px] font-semibold uppercase tracking-widest ' +
                        (member.status === 'PENDING' ? 'text-amber-600' : 'text-[#48C184]')
                      }>
                        {member.status === 'PENDING' ? 'Pending Application' : 'Verified'}
                      </p>
                      <h3 className="mt-1 text-lg font-bold text-[#022D5A]">
                        {member.fullName || 'Member'}
                      </h3>
                    </div>
                    <div className={
                      'flex h-11 w-11 items-center justify-center rounded-full text-xl ' +
                      (member.status === 'PENDING'
                        ? 'bg-amber-100 text-amber-600'
                        : 'bg-[#48C184]/15 text-[#3AA870]')
                    }>
                      {member.status === 'PENDING' ? '⏳' : '✓'}
                    </div>
                  </div>
                  <dl className="grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
                    {member.registrationNumber && (
                      <div>
                        <dt className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                          Registration No.
                        </dt>
                        <dd className="mt-0.5 font-mono text-[#022D5A]">{member.registrationNumber}</dd>
                      </div>
                    )}
                    {member.certificateNumber && (
                      <div>
                        <dt className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                          Certificate No.
                        </dt>
                        <dd className="mt-0.5 font-mono text-[#022D5A]">{member.certificateNumber}</dd>
                      </div>
                    )}
                    {member.membershipGrade && (
                      <div>
                        <dt className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                          Grade
                        </dt>
                        <dd className="mt-0.5">
                          <Badge tone="primary">{member.membershipGrade}</Badge>
                        </dd>
                      </div>
                    )}
                    {member.status && (
                      <div>
                        <dt className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                          Status
                        </dt>
                        <dd className="mt-0.5">
                          <Badge tone={
                            member.status === 'ACTIVE'
                              ? 'success'
                              : member.status === 'PENDING'
                                ? 'muted'
                                : 'warning'
                          }>
                            {member.status}
                          </Badge>
                        </dd>
                      </div>
                    )}
                    {member.email && (
                      <div className="sm:col-span-2">
                        <dt className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                          Email
                        </dt>
                        <dd className="mt-0.5 text-[#022D5A]">{member.email}</dd>
                      </div>
                    )}
                  </dl>
                </div>
              ))}

            {searched && !loading && members.length === 0 && (
              <div className="rounded-lg border border-slate-200 p-5 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                    !
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#022D5A]">No matching member</p>
                    <p className="mt-1 text-xs text-slate-600">
                      No IES member found for <span className="font-mono">{query}</span>. Please
                      double-check the name, email, registration or certificate number. For assistance, contact{' '}
                      <a href="mailto:info@iesomalia.org.so" className="font-semibold text-[#035CB3] hover:underline">
                        info@iesomalia.org.so
                      </a>.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="mx-auto mt-6 flex max-w-4xl items-center justify-end gap-2">
            <button
              type="button"
              disabled
              className="flex h-8 w-8 items-center justify-center rounded border border-slate-200 text-slate-400 disabled:cursor-not-allowed"
              aria-label="Previous page"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded bg-[#035CB3] text-xs font-bold text-white"
              aria-label="Page 1"
            >
              1
            </button>
            <button
              type="button"
              disabled
              className="flex h-8 w-8 items-center justify-center rounded border border-slate-200 text-slate-400 disabled:cursor-not-allowed"
              aria-label="Next page"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>

          {/* Summary */}
          <div className="mx-auto mt-10 max-w-4xl">
            <h3 className="text-base font-bold text-[#022D5A]">Summary</h3>
            {searched ? (
              <p className="mt-2 text-sm text-slate-600">
                {total > 0
                  ? `Found ${total} IES member${total === 1 ? '' : 's'} matching "${query}".`
                  : `No members found matching "${query}".`}
              </p>
            ) : (
              <p className="mt-2 text-sm text-slate-500">
                Enter a Member No, ID/Passport, Email, or Member Name above to search the IES member register.
              </p>
            )}
          </div>
        </SiteContainer>
      </main>

      {/* Full site footer */}
      <Footer />
    </div>
  );
};
