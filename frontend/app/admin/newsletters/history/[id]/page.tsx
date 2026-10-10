'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import {
  fetchCampaign,
  fetchDeliveries,
  retryFailedDeliveries,
  type CampaignFull,
  type DeliveryRow,
  type DeliveryStatus,
  type PageResult,
} from '@/lib/newslettersApi';

const DELIVERY_STATUS_FILTERS: { value: DeliveryStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'queued', label: 'Queued' },
  { value: 'sent', label: 'Sent' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'bounced', label: 'Bounced' },
  { value: 'failed', label: 'Failed' },
];

const STATUS_STYLES: Record<string, string> = {
  queued: 'bg-sky-50 text-sky-700',
  sent: 'bg-blue-50 text-blue-700',
  delivered: 'bg-emerald-50 text-emerald-700',
  bounced: 'bg-amber-50 text-amber-700',
  failed: 'bg-red-50 text-red-700',
  unsubscribed_before_send: 'bg-slate-100 text-slate-500',
};

const fmtDate = (s: string | null) => (s ? new Date(s).toLocaleString() : '—');

export default function CampaignHistoryDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? '';
  const [campaign, setCampaign] = useState<CampaignFull | null>(null);
  const [deliveries, setDeliveries] = useState<PageResult<DeliveryRow>>({ items: [], total: 0, page: 1, perPage: 100 });
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<DeliveryStatus | 'all'>('all');
  const [page, setPage] = useState(1);
  const [retrying, setRetrying] = useState(false);
  const [retryMsg, setRetryMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const [c, d] = await Promise.all([
      fetchCampaign(id),
      fetchDeliveries(id, { page, perPage: 100, status: status === 'all' ? undefined : status }),
    ]);
    setCampaign(c);
    setDeliveries(d);
    setLoading(false);
  }, [id, page, status]);

  useEffect(() => {
    void load();
  }, [load]);

  const doRetry = async () => {
    setRetrying(true);
    setRetryMsg(null);
    const result = await retryFailedDeliveries(id);
    setRetrying(false);
    setRetryMsg(result.ok ? `Requeued ${result.requeued ?? 0} failed deliveries.` : 'Could not requeue.');
    void load();
  };

  const totalPages = Math.max(1, Math.ceil(deliveries.total / deliveries.perPage));

  if (loading && !campaign) {
    return <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">Loading…</div>;
  }

  if (!campaign) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
        Campaign not found. <Link href="/admin/newsletters/history" className="underline">Back to history</Link>.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Link href="/admin/newsletters/history" className="text-xs font-semibold text-[#035CB3] hover:underline">‹ All history</Link>
            <h2 className="mt-1 text-base font-bold text-[#022D5A]">{campaign.subject}</h2>
            <p className="text-xs text-slate-500">
              Status: <span className="font-semibold">{campaign.status}</span> · Started {fmtDate(campaign.startedAt)} · Completed {fmtDate(campaign.completedAt)}
            </p>
          </div>
          {campaign.failedCount > 0 && (
            <button
              type="button"
              onClick={doRetry}
              disabled={retrying}
              className="rounded-lg bg-[#035CB3] px-4 py-2 text-xs font-semibold text-white hover:bg-[#024790] disabled:opacity-50"
            >
              {retrying ? 'Requeueing…' : `Retry ${campaign.failedCount.toLocaleString()} failed`}
            </button>
          )}
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-5">
          <div className="rounded-lg bg-slate-50 p-3 text-xs"><p className="text-slate-500">Recipients</p><p className="mt-0.5 text-xl font-bold text-slate-800 tabular-nums">{campaign.recipientCount.toLocaleString()}</p></div>
          <div className="rounded-lg bg-sky-50 p-3 text-xs"><p className="text-sky-700">Accepted</p><p className="mt-0.5 text-xl font-bold text-sky-900 tabular-nums">{campaign.acceptedCount.toLocaleString()}</p></div>
          <div className="rounded-lg bg-emerald-50 p-3 text-xs"><p className="text-emerald-700">Delivered</p><p className="mt-0.5 text-xl font-bold text-emerald-900 tabular-nums">{campaign.deliveredCount.toLocaleString()}</p></div>
          <div className="rounded-lg bg-amber-50 p-3 text-xs"><p className="text-amber-700">Bounced</p><p className="mt-0.5 text-xl font-bold text-amber-900 tabular-nums">{campaign.bouncedCount.toLocaleString()}</p></div>
          <div className="rounded-lg bg-red-50 p-3 text-xs"><p className="text-red-700">Failed</p><p className="mt-0.5 text-xl font-bold text-red-900 tabular-nums">{campaign.failedCount.toLocaleString()}</p></div>
        </div>
        {retryMsg && <p className="mt-3 text-xs text-slate-600">{retryMsg}</p>}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap gap-1">
          {DELIVERY_STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => { setPage(1); setStatus(f.value); }}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                status === f.value ? 'bg-[#035CB3] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
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
                <th className="px-4 py-3 text-left">Sent</th>
                <th className="px-4 py-3 text-left">Delivered</th>
                <th className="px-4 py-3 text-left">Message ID</th>
                <th className="px-4 py-3 text-left">Error</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {deliveries.items.length === 0 ? (
                <tr><td className="px-4 py-8 text-center text-slate-400" colSpan={6}>No deliveries match the filter.</td></tr>
              ) : (
                deliveries.items.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50">
                    <td className="px-4 py-2.5 font-medium text-slate-800">{row.email}</td>
                    <td className="px-4 py-2.5">
                      <span className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold ${STATUS_STYLES[row.status] ?? 'bg-slate-100 text-slate-600'}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-slate-600">{fmtDate(row.sentAt)}</td>
                    <td className="px-4 py-2.5 text-slate-600">{fmtDate(row.deliveredAt)}</td>
                    <td className="px-4 py-2.5 font-mono text-[11px] text-slate-500">{row.providerMessageId ?? '—'}</td>
                    <td className="px-4 py-2.5 text-xs text-red-600">{row.failureReason ?? ''}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between gap-2 border-t border-slate-100 px-4 py-3 text-xs text-slate-500">
          <span>Showing {deliveries.items.length} of {deliveries.total.toLocaleString()}</span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 disabled:opacity-50"
            >
              ‹ Prev
            </button>
            <span className="px-2">{deliveries.page} / {totalPages}</span>
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
    </div>
  );
}
