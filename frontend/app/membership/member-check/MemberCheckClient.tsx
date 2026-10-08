'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { apiRequest, API_BASE_URL } from '@/lib/apiClient';
import { site } from '@/config/site';
import { SiteContainer } from '@/components/layout/SiteContainer';
import { MembershipMenu } from '@/components/public/MembershipMenu';
import { Footer } from '@/components/layout/Footer';

interface MemberResult {
  registrationNumber?: string;
  certificateNumber?: string;
  fullName?: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string;
  phone?: string | null;
  nationalId?: string | null;
  title?: string | null;
  gender?: string | null;
  dateOfBirth?: string | null;
  discipline?: string | null;
  specialization?: string | null;
  city?: string | null;
  nationality?: string | null;
  membershipGrade?: string;
  status?: string;
  validUntil?: string | null;
  photoUrl?: string | null;
}


interface SearchResponse {
  total?: number;
  members?: MemberResult[];
}

const DetailRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex items-center justify-between gap-4 px-4 py-3">
    <p className="text-sm font-semibold text-slate-700">{label}</p>
    <div className="text-right">{value}</div>
  </div>
);

const STATUS_LABELS: Record<string, string> = {
  GOOD_STANDING: 'Good Standing',
  NOT_IN_GOOD_STANDING: 'Not in Good Standing',
  SUSPENDED: 'Suspended',
  INACTIVE: 'Inactive',
  PENDING: 'Pending',
  EXPIRED: 'Expired',
  RESIGNED: 'Resigned',
  TERMINATED: 'Terminated',
};

const STATUS_STYLES: Record<string, string> = {
  GOOD_STANDING: 'bg-[#48C184] text-white',
  NOT_IN_GOOD_STANDING: 'bg-amber-500 text-white',
  SUSPENDED: 'bg-orange-500 text-white',
  INACTIVE: 'bg-slate-400 text-white',
  PENDING: 'bg-amber-100 text-amber-700',
  EXPIRED: 'bg-rose-200 text-rose-900',
  RESIGNED: 'bg-slate-500 text-white',
  TERMINATED: 'bg-red-600 text-white',
};

const GRADE_LABELS: Record<string, string> = {
  STUDENT: 'Student Member (SMIES)',
  GRADUATE: 'Graduate Member (GMIES)',
  ASSOCIATE: 'Associate Member (AMIES)',
  CORPORATE: 'Corporate Member (MIES)',
  SENIOR: 'Senior Member (SMIES)',
  FELLOW: 'Fellow Member (FIES)',
  GRAD_TECHNICIAN: 'Graduate Technician (GradTech)',
  GRAD_TECHNOLOGIST: 'Graduate Technologist (GradTechno)',
};

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

          {/* Search bar - hidden once a successful result is shown */}
          {members.length === 0 && (
            <form onSubmit={handleSubmit} className="mx-auto mt-8 flex max-w-4xl overflow-hidden rounded-lg border border-slate-200 shadow-sm">
              <div className="relative flex flex-1 items-center">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by Name, Email, ID/Passport, or Phone Number"
                  className="h-full flex-1 px-4 py-3 pr-10 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
                  required
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery('');
                      setMembers([]);
                      setTotal(0);
                      setSearched(false);
                    }}
                    aria-label="Clear search"
                    className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-7 w-7 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                  >
                    <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="5" x2="15" y2="15" />
                      <line x1="15" y1="5" x2="5" y2="15" />
                    </svg>
                  </button>
                )}
              </div>
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
          )}

          {/* Search Results header - shown only when a result is present */}
          {members.length > 0 && (
            <div className="mx-auto mt-8 flex max-w-5xl items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-3">
                <h2 className="text-sm font-bold text-[#022D5A]">Search Results</h2>
                <p className="text-xs text-slate-500">
                  Found <span className="font-bold text-[#022D5A]">{total}</span> of total results
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setMembers([]);
                  setTotal(0);
                  setSearched(false);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-[#035CB3] hover:bg-slate-50"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                New Search
              </button>
            </div>
          )}

          {/* Results area */}
          <div className="mx-auto mt-6 max-w-5xl space-y-6">
            {members.length > 0 &&
              members.map((member, idx) => {
                // fullName already includes title (e.g. "Eng. Abdirahman Ceimoy") from Initial Profile.
                // Fall back to first + last name if fullName looks like a raw username or is empty.
                const looksLikeUsername = !!member.fullName && !/\s/.test(member.fullName);
                const composed = [member.title, member.firstName, member.lastName]
                  .filter(Boolean)
                  .join(' ')
                  .trim();
                const displayName = (looksLikeUsername && composed
                  ? composed
                  : (member.fullName ?? composed)).toUpperCase();
                const statusKey = (member.status ?? 'PENDING').toUpperCase();
                const statusLabel = STATUS_LABELS[statusKey] ?? statusKey;
                const statusStyle = STATUS_STYLES[statusKey] ?? 'bg-slate-200 text-slate-700';
                return (
                  <div key={idx} className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="grid gap-6 p-6 sm:grid-cols-[220px_1fr]">
                      {/* Left column: Photo + Name */}
                      <div className="flex flex-col items-center gap-3">
                        <div className="relative h-40 w-40 overflow-hidden rounded-md border border-slate-200 bg-slate-100">
                          {member.photoUrl ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={
                                member.photoUrl.startsWith('http')
                                  ? member.photoUrl
                                  : `${API_BASE_URL.replace(/\/api$/, '')}${member.photoUrl}`
                              }
                              alt={member.fullName ?? 'Member'}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-slate-400">
                              <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <circle cx="12" cy="8" r="4" />
                                <path d="M4 21v-1a6 6 0 0112 0v1" />
                                <path d="M12 21v-1" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <p className="text-center text-xs font-bold uppercase tracking-wider text-[#022D5A]">
                          {displayName || 'MEMBER'}
                        </p>
                      </div>

                      {/* Right column: Details table */}
                      <div className="flex flex-col gap-4">
                        <div className="rounded-lg border border-slate-200">
                          <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
                            <h4 className="text-sm font-bold text-[#022D5A]">Membership Details</h4>
                          </div>
                          <div className="divide-y divide-slate-100">
                            <DetailRow label="Membership Status" value={
                              <span className={
                                'inline-flex items-center rounded-full px-3 py-0.5 text-xs font-bold ' + statusStyle
                              }>
                                {statusLabel}
                              </span>
                            } />
                            <DetailRow label="Member No." value={
                              <span className="font-mono text-sm text-[#022D5A]">
                                {member.registrationNumber ?? '-'}
                              </span>
                            } />
                            <DetailRow label="Member Category" value={
                              <span className="text-sm font-semibold text-[#022D5A]">
                                {member.membershipGrade
                                  ? (GRADE_LABELS[member.membershipGrade] ?? member.membershipGrade)
                                  : '-'}
                              </span>
                            } />
                            <DetailRow label="Email" value={
                              <span className="text-sm text-slate-700">
                                {member.email ?? '-'}
                              </span>
                            } />
                            <DetailRow label="Discipline" value={
                              <span className="text-sm text-slate-700">
                                {member.discipline ?? '-'}
                              </span>
                            } />
                            <DetailRow label="Gender" value={
                              <span className="text-sm text-slate-700 capitalize">
                                {member.gender ? member.gender.toLowerCase() : '-'}
                              </span>
                            } />
                          </div>
                        </div>

                        {/* Specialization - its own section (IEK-style) */}
                        <div className="rounded-lg border border-slate-200">
                          <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
                            <h4 className="text-sm font-bold text-[#022D5A]">Specialization</h4>
                          </div>
                          <div className="px-4 py-4">
                            {member.specialization ? (
                              <p className="text-sm text-slate-700">{member.specialization}</p>
                            ) : (
                              <p className="text-xs italic text-slate-400">Not provided</p>
                            )}
                          </div>
                        </div>

                        {/* Certificate section (optional) */}
                        {member.certificateNumber && (
                          <div className="rounded-lg border border-slate-200">
                            <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
                              <h4 className="text-sm font-bold text-[#022D5A]">Certificate</h4>
                            </div>
                            <div className="px-4 py-3">
                              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Certificate No.</p>
                              <p className="mt-1 font-mono text-sm text-[#022D5A]">{member.certificateNumber}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

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
                {/* Enter a Member No, ID/Passport, Email, or Member Name above to search the IES member register. */}
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
