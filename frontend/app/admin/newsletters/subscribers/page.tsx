'use client';

import { useCallback, useEffect, useState } from 'react';
import { fetchSubscribers, suppressSubscriber, type PageResult, type SubscriberRow, type SubscriberStatus } from '@/lib/newslettersApi';

const STATUS_FILTERS: { value: SubscriberStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'subscribed', label: 'Confirmed' },
  { value: 'pending', label: 'Pending' },
  { value: 'unsubscribed', label: 'Unsubscribed' },
  { value: 'suppressed', label: 'Suppressed' },
];

const STATUS_STYLES: Record<SubscriberStatus, string> = {
  subscribed: 'bg-emerald-50 text-emerald-700',
  pending: 'bg-amber-50 text-amber-700',
  unsubscribed: 'bg-slate-100 text-slate-600',
  suppressed: 'bg-red-50 text-red-700',
};

const fmtDate = (s: string | null) => {
  if (!s) return '—';
  try {
    return new Date(s).toLocaleDateString();
  } catch {
    return s;
  }
};

export default function AdminNewsletterSubscribersPage() {
  const [data, setData] = useState<PageResult<SubscriberRow>>({ items: [], total: 0, page: 1, perPage: 50 });
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<SubscriberStatus | 'all'>('all');
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [confirmSuppress, setConfirmSuppress] = useState<SubscriberRow | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const result = await fetchSubscribers({ q, status, page, perPage: 50 });
    setData(result);
    setLoading(false);
  }, [q, status, page]);

  useEffect(() => {
    void load();
  }, [load]);

  // Debounce search
  const [searchInput, setSearchInput] = useState('');
  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      setQ(searchInput.trim());
    }, 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  const handleSuppress = async (row: SubscriberRow) => {
    setBusy(true);
    const ok = await suppressSubscriber(row.id);
    setBusy(false);
    setConfirmSuppress(null);
    if (ok) void load();
  };

  const totalPages = Math.max(1, Math.ceil(data.total / data.perPage));

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
        <input
          type="search"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search by email…"
          className="h-10 flex-1 rounded-lg border border-slate-300 bg-white px-3 text-sm focus:border-[#035CB3] focus:outline-none focus:ring-2 focus:ring-[#035CB3]/30"
        />
        <div className="flex flex-wrap gap-1">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => {
                setPage(1);
                setStatus(f.value);
              }}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                status === f.value
                  ? 'bg-[#035CB3] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Confirmed</th>
                <th className="px-4 py-3 text-left">Subscribed</th>
                <th className="px-4 py-3 text-left">Source</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td className="px-4 py-8 text-center text-slate-400" colSpan={6}>Loading…</td></tr>
              ) : data.items.length === 0 ? (
                <tr><td className="px-4 py-8 text-center text-slate-400" colSpan={6}>No subscribers found.</td></tr>
              ) : (
                data.items.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50">
                    <td className="px-4 py-2.5 font-medium text-slate-800">{row.email}</td>
                    <td className="px-4 py-2.5">
                      <span className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold ${STATUS_STYLES[row.status]}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-slate-600">{fmtDate(row.emailVerifiedAt)}</td>
                    <td className="px-4 py-2.5 text-slate-600">{fmtDate(row.createdAt)}</td>
                    <td className="px-4 py-2.5 text-slate-500">{row.source ?? '—'}</td>
                    <td className="px-4 py-2.5 text-right">
                      {row.status !== 'suppressed' && row.status !== 'unsubscribed' && (
                        <button
                          type="button"
                          onClick={() => setConfirmSuppress(row)}
                          className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 hover:border-red-300 hover:text-red-600"
                        >
                          Suppress
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-slate-100 px-4 py-3 text-xs text-slate-500">
          <span>
            Showing {data.items.length} of {data.total.toLocaleString()}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 disabled:opacity-50"
            >
              ‹ Prev
            </button>
            <span className="px-2">
              {data.page} / {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 disabled:opacity-50"
            >
              Next ›
            </button>
          </div>
        </div>
      </div>

      {confirmSuppress && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-base font-bold text-[#022D5A]">Suppress subscriber?</h3>
            <p className="mt-2 text-sm text-slate-600">
              <strong>{confirmSuppress.email}</strong> will no longer receive any newsletter. This cannot be reversed from the admin panel — the subscriber would need to subscribe and reconfirm themselves.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                disabled={busy}
                onClick={() => setConfirmSuppress(null)}
                className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => handleSuppress(confirmSuppress)}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
              >
                {busy ? 'Suppressing…' : 'Yes, suppress'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
