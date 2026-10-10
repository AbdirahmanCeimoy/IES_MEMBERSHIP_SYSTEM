'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { fetchCampaigns, type CampaignRow, type PageResult } from '@/lib/newslettersApi';

const STATUS_STYLES: Record<string, string> = {
  draft: 'bg-slate-100 text-slate-600',
  queued: 'bg-sky-50 text-sky-700',
  sending: 'bg-blue-50 text-blue-700',
  sent: 'bg-emerald-50 text-emerald-700',
  partially_failed: 'bg-amber-50 text-amber-700',
  failed: 'bg-red-50 text-red-700',
};

const fmtDate = (s: string | null) => (s ? new Date(s).toLocaleString() : '—');

export default function NewsletterHistoryPage() {
  const [data, setData] = useState<PageResult<CampaignRow>>({ items: [], total: 0, page: 1, perPage: 25 });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const result = await fetchCampaigns({ page, perPage: 25 });
      setData(result);
      setLoading(false);
    })();
  }, [page]);

  const totalPages = Math.max(1, Math.ceil(data.total / data.perPage));
  const sentOrInFlight = data.items.filter((c) => c.status !== 'draft');

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3 text-left">Subject</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-right">Recipients</th>
                <th className="px-4 py-3 text-right">Accepted</th>
                <th className="px-4 py-3 text-right">Delivered</th>
                <th className="px-4 py-3 text-right">Bounced</th>
                <th className="px-4 py-3 text-right">Failed</th>
                <th className="px-4 py-3 text-left">Completed</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td className="px-4 py-8 text-center text-slate-400" colSpan={9}>Loading…</td></tr>
              ) : sentOrInFlight.length === 0 ? (
                <tr><td className="px-4 py-8 text-center text-slate-400" colSpan={9}>No campaigns have been sent yet.</td></tr>
              ) : (
                sentOrInFlight.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50">
                    <td className="px-4 py-2.5 font-medium text-slate-800">{row.subject}</td>
                    <td className="px-4 py-2.5">
                      <span className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold ${STATUS_STYLES[row.status] ?? 'bg-slate-100 text-slate-600'}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right tabular-nums">{row.recipientCount.toLocaleString()}</td>
                    <td className="px-4 py-2.5 text-right tabular-nums">{row.acceptedCount.toLocaleString()}</td>
                    <td className="px-4 py-2.5 text-right tabular-nums text-emerald-700">{row.deliveredCount.toLocaleString()}</td>
                    <td className="px-4 py-2.5 text-right tabular-nums text-amber-700">{row.bouncedCount.toLocaleString()}</td>
                    <td className="px-4 py-2.5 text-right tabular-nums text-red-700">{row.failedCount.toLocaleString()}</td>
                    <td className="px-4 py-2.5 text-slate-600">{fmtDate(row.completedAt)}</td>
                    <td className="px-4 py-2.5 text-right">
                      <Link
                        href={`/admin/newsletters/history/${row.id}`}
                        className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-[#035CB3] hover:bg-[#035CB3]/5"
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-slate-100 px-4 py-3 text-xs text-slate-500">
          <span>Showing {sentOrInFlight.length} of {data.total.toLocaleString()}</span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 disabled:opacity-50"
            >
              ‹ Prev
            </button>
            <span className="px-2">{data.page} / {totalPages}</span>
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

      <p className="text-xs text-slate-400">
        Delivery counts beyond "accepted" require the Resend webhook. See NEWSLETTER_SETUP.md §4.
      </p>
    </div>
  );
}
