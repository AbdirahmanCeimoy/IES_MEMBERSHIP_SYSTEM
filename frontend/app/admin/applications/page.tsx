'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import {
  buildDocumentUrl,
  decideApplication,
  fetchAdminApplications,
  fetchApplicationDetail,
  type AdminApplicationRow,
  type ApplicationDetail,
} from '@/lib/adminApi';
import { getAuthToken } from '@/lib/authSession';

type Status = AdminApplicationRow['status'];

const STATUSES: { value: 'all' | Status; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'review', label: 'In review' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
];

const statusTone: Record<Status, 'primary' | 'warning' | 'success' | 'muted'> = {
  pending: 'warning',
  review: 'primary',
  approved: 'success',
  rejected: 'muted',
};

export default function AdminApplicationsPage() {
  const [rows, setRows] = useState<AdminApplicationRow[]>([]);
  const [filter, setFilter] = useState<'all' | Status>('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<AdminApplicationRow | null>(null);
  const [detail, setDetail] = useState<ApplicationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!selected) {
      setDetail(null);
      return;
    }
    fetchApplicationDetail(selected.id).then(setDetail);
  }, [selected]);

  const openDocument = async (docId: string) => {
    if (!selected) return;
    const token = getAuthToken();
    if (!token) return;
    const res = await fetch(buildDocumentUrl(selected.id, docId), {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      alert('Unable to fetch document.');
      return;
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank', 'noopener');
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
  };

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const list = await fetchAdminApplications(filter, search);
      setRows(list);
    } catch {
      setError('Failed to load applications.');
    } finally {
      setLoading(false);
    }
  }, [filter, search]);

  useEffect(() => {
    load();
  }, [load]);

  const counts = useMemo(() => ({
    all: rows.length,
    pending: rows.filter((r) => r.status === 'pending').length,
    review: rows.filter((r) => r.status === 'review').length,
    approved: rows.filter((r) => r.status === 'approved').length,
    rejected: rows.filter((r) => r.status === 'rejected').length,
  }), [rows]);

  const decide = async (decision: 'APPROVED' | 'REJECTED' | 'REVIEW') => {
    if (!selected) return;
    setActionLoading(true);
    const ok = await decideApplication(selected.id, decision);
    setActionLoading(false);
    if (ok) {
      setSelected(null);
      await load();
    } else {
      setError('Action failed. Check backend logs.');
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold text-[#022D5A]">Applications</h1>
        <p className="text-sm text-slate-600">
          Review, approve, or reject membership applications.
          {loading && ' Loading…'}
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {error}
        </div>
      )}

      <Card padded>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-1.5">
            {STATUSES.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => setFilter(s.value)}
                className={
                  'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-colors ' +
                  (filter === s.value
                    ? 'border-[#035CB3] bg-[#035CB3] text-white'
                    : 'border-slate-200 text-slate-600 hover:border-[#035CB3] hover:text-[#035CB3]')
                }
              >
                {s.label}
                <span
                  className={
                    'inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] ' +
                    (filter === s.value ? 'bg-white/25' : 'bg-slate-100 text-slate-600')
                  }
                >
                  {counts[s.value === 'all' ? 'all' : (s.value as Status)]}
                </span>
              </button>
            ))}
          </div>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, grade..."
            className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm focus:border-[#035CB3] focus:outline-none focus:ring-1 focus:ring-[#035CB3] sm:w-64"
          />
        </div>
      </Card>

      <Card padded>
        {rows.length === 0 ? (
          <EmptyState
            title={loading ? 'Loading…' : 'No applications to review'}
            description="Once members submit applications, they appear here for review."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-widest text-slate-500">
                  <th className="py-2 pr-4">Applicant</th>
                  <th className="py-2 pr-4">Grade</th>
                  <th className="py-2 pr-4">Submitted</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 pr-4">
                      <p className="font-semibold text-[#022D5A]">{row.applicant}</p>
                      <p className="text-xs text-slate-500">{row.email}</p>
                    </td>
                    <td className="py-3 pr-4 text-slate-700">{row.grade}</td>
                    <td className="py-3 pr-4 text-slate-500">{row.submitted}</td>
                    <td className="py-3 pr-4">
                      <Badge tone={statusTone[row.status]}>{row.status}</Badge>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        type="button"
                        onClick={() => setSelected(row)}
                        className="rounded-md border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 hover:border-[#035CB3] hover:text-[#035CB3]"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {selected && (
        <>
          <div
            className="fixed inset-0 z-40 bg-slate-900/40"
            onClick={() => setSelected(null)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            className="fixed left-1/2 top-1/2 z-50 w-[min(560px,90vw)] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h2 className="text-base font-bold text-[#022D5A]">Review application</h2>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="text-slate-400 hover:text-slate-700"
                aria-label="Close"
              >
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 5l10 10M15 5l-10 10" strokeLinecap="round" /></svg>
              </button>
            </div>
            <div className="grid max-h-[60vh] gap-3 overflow-y-auto p-5 text-sm">
              <div><span className="font-semibold text-[#022D5A]">Applicant:</span> {selected.applicant}</div>
              <div><span className="font-semibold text-[#022D5A]">Email:</span> {selected.email}</div>
              <div><span className="font-semibold text-[#022D5A]">Grade:</span> {selected.grade}</div>
              <div><span className="font-semibold text-[#022D5A]">Submitted:</span> {selected.submitted}</div>
              <div><span className="font-semibold text-[#022D5A]">Application ID:</span> <span className="font-mono text-xs">{selected.id}</span></div>
              {detail?.phone && (
                <div><span className="font-semibold text-[#022D5A]">Phone:</span> {detail.phone}</div>
              )}
              {detail?.nationalIdNumber && (
                <div><span className="font-semibold text-[#022D5A]">National ID:</span> {detail.nationalIdNumber}</div>
              )}

              {/* Documents */}
              <div className="mt-2 border-t border-slate-100 pt-3">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                  Submitted documents ({detail?.documents?.length ?? 0})
                </p>
                {!detail?.documents || detail.documents.length === 0 ? (
                  <p className="text-xs text-slate-500">
                    {detail === null ? 'Loading documents...' : 'No documents attached.'}
                  </p>
                ) : (
                  <ul className="flex flex-col gap-1.5">
                    {detail.documents.map((doc) => (
                      <li key={doc.id} className="flex items-center justify-between gap-2 rounded-md border border-slate-100 bg-slate-50 px-3 py-2">
                        <div className="min-w-0">
                          <p className="truncate text-xs font-semibold text-[#022D5A]">
                            {doc.label || doc.type || 'Document'}
                          </p>
                          {doc.filename && (
                            <p className="truncate text-[11px] text-slate-500">{doc.filename}</p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => openDocument(doc.id)}
                          className="rounded-md border border-slate-300 px-2.5 py-1 text-[11px] font-semibold text-[#035CB3] hover:bg-white"
                        >
                          View
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 border-t border-slate-100 bg-slate-50 px-5 py-3">
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => decide('REJECTED')}
                className="rounded-lg border border-rose-300 bg-white px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50 disabled:opacity-50"
              >
                Reject
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => decide('REVIEW')}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-[#035CB3] hover:text-[#035CB3] disabled:opacity-50"
              >
                In review
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => decide('APPROVED')}
                className="rounded-lg bg-[#48C184] px-4 py-2 text-sm font-semibold text-[#022D5A] hover:bg-[#3AA870] disabled:opacity-50"
              >
                {actionLoading ? '…' : 'Approve'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
