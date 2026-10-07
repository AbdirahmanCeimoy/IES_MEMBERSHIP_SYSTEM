'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
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
  { value: 'review', label: 'In Review' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
];

const GRADE_LABELS: Record<string, string> = {
  STUDENT: 'Student (SMIES)',
  GRADUATE: 'Graduate (GMIES)',
  ASSOCIATE: 'Associate (AMIES)',
  CORPORATE: 'Corporate (MIES)',
  FELLOW: 'Fellow (FMIES)',
};

const GRADE_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  STUDENT:   { bg: 'bg-sky-50',     text: 'text-sky-700',     dot: 'bg-sky-500' },
  GRADUATE:  { bg: 'bg-indigo-50',  text: 'text-indigo-700',  dot: 'bg-indigo-500' },
  ASSOCIATE: { bg: 'bg-violet-50',  text: 'text-violet-700',  dot: 'bg-violet-500' },
  CORPORATE: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  FELLOW:    { bg: 'bg-amber-50',   text: 'text-amber-700',   dot: 'bg-amber-500' },
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
    if (!selected) { setDetail(null); return; }
    fetchApplicationDetail(selected.id).then(setDetail);
  }, [selected]);

  const openDocument = async (docId: string) => {
    if (!selected) return;
    const token = getAuthToken();
    if (!token) return;
    const res = await fetch(buildDocumentUrl(selected.id, docId), {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) { alert('Unable to fetch document.'); return; }
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

  useEffect(() => { load(); }, [load]);

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
    if (ok) { setSelected(null); await load(); }
    else setError('Action failed. Check backend logs.');
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-bold text-[#022D5A]">Applications</h1>
        <p className="mt-0.5 text-sm text-slate-500">
          Review, approve, or reject membership applications.{loading && ' Loading…'}
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {error}
        </div>
      )}

      {/* Filter tabs + search */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-1.5">
            {STATUSES.map((s) => {
              const active = filter === s.value;
              return (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setFilter(s.value)}
                  className={
                    'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-colors ' +
                    (active
                      ? 'border-[#035CB3] bg-[#035CB3] text-white'
                      : 'border-slate-200 text-slate-600 hover:border-[#035CB3] hover:text-[#035CB3]')
                  }
                >
                  {s.label}
                  <span className={
                    'inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold ' +
                    (active ? 'bg-white/25' : 'bg-slate-100 text-slate-600')
                  }>
                    {counts[s.value === 'all' ? 'all' : (s.value as Status)]}
                  </span>
                </button>
              );
            })}
          </div>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, grade..."
            className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm focus:border-[#035CB3] focus:outline-none focus:ring-1 focus:ring-[#035CB3] sm:w-64"
          />
        </div>
      </div>

      {/* Applications table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        {rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#94a3b8" strokeWidth="1.5"><path d="M6 3h6l4 4v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" strokeLinecap="round" strokeLinejoin="round" /><path d="M12 3v4h4" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
            <h3 className="mt-3 text-sm font-semibold text-[#022D5A]">
              {loading ? 'Loading…' : 'No applications to review'}
            </h3>
            <p className="mt-1 max-w-sm text-xs text-slate-500">
              Once members submit applications, they appear here for review.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-left text-[10px] uppercase tracking-widest text-slate-500">
                  <th className="px-5 py-3">Applicant</th>
                  <th className="px-5 py-3">Grade</th>
                  <th className="px-5 py-3">Submitted</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const gradeKey = row.grade?.toUpperCase() ?? '';
                  const c = GRADE_COLORS[gradeKey];
                  return (
                    <tr key={row.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#035CB3] text-xs font-bold text-white">
                            {row.applicant?.[0]?.toUpperCase() ?? 'A'}
                          </div>
                          <div>
                            <p className="font-semibold text-[#022D5A]">{row.applicant}</p>
                            <p className="text-xs text-slate-500">{row.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        {c ? (
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold ${c.bg} ${c.text}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
                            {GRADE_LABELS[gradeKey] ?? row.grade}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-500">{row.grade}</span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-slate-500">{row.submitted}</td>
                      <td className="px-5 py-3">
                        <AppStatusBadge status={row.status} />
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => setSelected(row)}
                          className="rounded-md bg-[#035CB3] px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-[#024A8F]"
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {selected && (
        <>
          <div className="fixed inset-0 z-40 bg-slate-900/40" onClick={() => setSelected(null)} aria-hidden="true" />
          <div
            role="dialog"
            aria-modal="true"
            className="fixed left-1/2 top-1/2 z-50 w-[min(560px,90vw)] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h2 className="text-base font-bold text-[#022D5A]">Review Application</h2>
              <button type="button" onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-700" aria-label="Close">
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 5l10 10M15 5l-10 10" strokeLinecap="round" /></svg>
              </button>
            </div>
            <div className="grid max-h-[60vh] gap-3 overflow-y-auto p-5 text-sm">
              <DetailRow label="Applicant" value={selected.applicant} />
              <DetailRow label="Email" value={selected.email} />
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Grade</span>
                {(() => {
                  const gradeKey = selected.grade?.toUpperCase() ?? '';
                  const c = GRADE_COLORS[gradeKey];
                  return c ? (
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold ${c.bg} ${c.text}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
                      {GRADE_LABELS[gradeKey] ?? selected.grade}
                    </span>
                  ) : <span className="font-medium text-[#022D5A]">{selected.grade}</span>;
                })()}
              </div>
              <DetailRow label="Submitted" value={selected.submitted} />
              <DetailRow label="Application ID" value={selected.id} mono />
              {detail?.phone && <DetailRow label="Phone" value={detail.phone} />}
              {detail?.nationalIdNumber && <DetailRow label="National ID" value={detail.nationalIdNumber} />}

              <div className="mt-2 border-t border-slate-100 pt-3">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Submitted Documents ({detail?.documents?.length ?? 0})
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
                          {doc.filename && <p className="truncate text-[11px] text-slate-500">{doc.filename}</p>}
                        </div>
                        <button
                          type="button"
                          onClick={() => openDocument(doc.id)}
                          className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-[11px] font-semibold text-[#035CB3] hover:border-[#035CB3]"
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
                In Review
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

function DetailRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</span>
      <span className={`text-right ${mono ? 'font-mono text-xs' : 'font-medium'} text-[#022D5A]`}>{value}</span>
    </div>
  );
}

function AppStatusBadge({ status }: { status: Status }) {
  if (status === 'approved') return <span className="rounded-full bg-[#48C184]/15 px-2.5 py-1 text-[10px] font-bold uppercase text-[#48C184]">Approved</span>;
  if (status === 'rejected') return <span className="rounded-full bg-rose-100 px-2.5 py-1 text-[10px] font-bold uppercase text-rose-600">Rejected</span>;
  if (status === 'pending')  return <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-bold uppercase text-amber-700">Pending</span>;
  return <span className="rounded-full bg-[#035CB3]/10 px-2.5 py-1 text-[10px] font-bold uppercase text-[#035CB3]">In Review</span>;
}
