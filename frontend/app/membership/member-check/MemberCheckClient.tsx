'use client';

import { useState } from 'react';
import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { routes } from '@/config/routes';
import { apiRequest } from '@/lib/apiClient';

interface VerifyResult {
  registrationNumber?: string;
  certificateNumber?: string;
  fullName?: string;
  membershipGrade?: string;
  status?: string;
  approvedAt?: string | null;
  verified?: boolean;
  message?: string;
}

export const MemberCheckClient = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const term = query.trim();
    if (!term) return;
    setLoading(true);
    setResult(null);
    setNotFound(false);

    // Backend accepts a registration number or a certificate number.
    // Query both so users can paste either one.
    const encoded = encodeURIComponent(term);
    const res = await apiRequest<VerifyResult>(
      `/memberships/verify?registrationNumber=${encoded}&certificateNumber=${encoded}`,
    );
    setLoading(false);

    if (!res.ok || !res.data) {
      setNotFound(true);
      return;
    }
    if (res.data.verified === false || !res.data.fullName) {
      setNotFound(true);
      return;
    }
    setResult(res.data);
  };

  return (
    <>
      <PageHero
        breadcrumbs={<Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Membership', href: routes.membership.root }, { label: 'Member Check' }]} />}
        eyebrow="Verification"
        title="IES Member Check"
        description="Verify the standing of an IES member by name or registration number."
      />

      <Section>
        <Card padded className="mx-auto max-w-2xl">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3" aria-label="Member check">
            <label className="text-sm font-semibold text-[#022D5A]" htmlFor="mc-query">
              Registration or certificate number
            </label>
            <input
              id="mc-query"
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setNotFound(false);
              }}
              placeholder="e.g. IES-2025-0001 or CERT-2025-0042"
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#035CB3] focus:outline-none focus:ring-1 focus:ring-[#035CB3]"
              required
            />
            <div>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center rounded-lg bg-[#035CB3] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#022D5A] disabled:opacity-50"
              >
                {loading ? 'Checking...' : 'Check membership'}
              </button>
            </div>
          </form>
        </Card>
      </Section>

      {(result || notFound) && (
        <Section tone="muted">
          <div className="mx-auto max-w-2xl">
            {result && (
              <Card padded>
                <div className="mb-4 flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-[#48C184]">
                      Verified
                    </p>
                    <h2 className="mt-1 text-lg font-bold text-[#022D5A]">
                      {result.fullName || 'Member'}
                    </h2>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#48C184]/15 text-2xl text-[#3AA870]">
                    ✓
                  </div>
                </div>
                <dl className="grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
                  {result.registrationNumber && (
                    <div>
                      <dt className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                        Registration No.
                      </dt>
                      <dd className="mt-0.5 font-mono text-[#022D5A]">{result.registrationNumber}</dd>
                    </div>
                  )}
                  {result.certificateNumber && (
                    <div>
                      <dt className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                        Certificate No.
                      </dt>
                      <dd className="mt-0.5 font-mono text-[#022D5A]">{result.certificateNumber}</dd>
                    </div>
                  )}
                  {result.membershipGrade && (
                    <div>
                      <dt className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                        Grade
                      </dt>
                      <dd className="mt-0.5">
                        <Badge tone="primary">{result.membershipGrade}</Badge>
                      </dd>
                    </div>
                  )}
                  {result.status && (
                    <div>
                      <dt className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                        Status
                      </dt>
                      <dd className="mt-0.5">
                        <Badge tone={result.status === 'APPROVED' ? 'success' : 'warning'}>
                          {result.status}
                        </Badge>
                      </dd>
                    </div>
                  )}
                  {result.approvedAt && (
                    <div className="sm:col-span-2">
                      <dt className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                        Member since
                      </dt>
                      <dd className="mt-0.5 text-[#022D5A]">
                        {new Date(result.approvedAt).toLocaleDateString()}
                      </dd>
                    </div>
                  )}
                </dl>
              </Card>
            )}

            {notFound && (
              <Card padded>
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                    !
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#022D5A]">No matching member</p>
                    <p className="mt-1 text-xs text-slate-600">
                      No IES member found for <span className="font-mono">{query}</span>. Please
                      double-check the registration or certificate number. For assistance, contact{' '}
                      <a href="mailto:info@iesomalia.org.so" className="font-semibold text-[#035CB3] hover:underline">
                        info@iesomalia.org.so
                      </a>.
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </Section>
      )}
    </>
  );
};
