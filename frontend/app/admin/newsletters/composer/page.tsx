'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createCampaign, fetchCampaigns, type CampaignRow } from '@/lib/newslettersApi';

const STATUS_STYLES: Record<string, string> = {
  draft: 'bg-slate-100 text-slate-600',
  queued: 'bg-sky-50 text-sky-700',
  sending: 'bg-blue-50 text-blue-700',
  sent: 'bg-emerald-50 text-emerald-700',
  partially_failed: 'bg-amber-50 text-amber-700',
  failed: 'bg-red-50 text-red-700',
};

const fmtDate = (s: string | null) => (s ? new Date(s).toLocaleString() : '—');

export default function ComposerIndexPage() {
  const router = useRouter();
  const [drafts, setDrafts] = useState<CampaignRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const result = await fetchCampaigns({ perPage: 100 });
      setDrafts(result.items.filter((c) => c.status === 'draft' || c.status === 'failed'));
      setLoading(false);
    })();
  }, []);

  const handleCreate = async () => {
    setCreating(true);
    setError(null);
    const draft = await createCampaign({
      subject: 'Untitled newsletter',
      contentHtml: '<p>Start writing here…</p>',
    });
    setCreating(false);
    if (!draft) {
      setError('Could not create a new draft. Please try again.');
      return;
    }
    router.push(`/admin/newsletters/composer/${draft.id}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div>
          <h2 className="text-sm font-bold text-[#022D5A]">Draft newsletters</h2>
          <p className="text-xs text-slate-500">Create a new campaign or continue an existing draft.</p>
        </div>
        <button
          type="button"
          onClick={handleCreate}
          disabled={creating}
          className="inline-flex items-center gap-2 rounded-lg bg-[#035CB3] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#024790] disabled:opacity-70"
        >
          {creating ? 'Creating…' : '+ New newsletter'}
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3 text-left">Subject</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Created</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td className="px-4 py-8 text-center text-slate-400" colSpan={4}>Loading…</td></tr>
              ) : drafts.length === 0 ? (
                <tr><td className="px-4 py-8 text-center text-slate-400" colSpan={4}>No drafts yet. Click "New newsletter" to get started.</td></tr>
              ) : (
                drafts.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50">
                    <td className="px-4 py-2.5 font-medium text-slate-800">{row.subject}</td>
                    <td className="px-4 py-2.5">
                      <span className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold ${STATUS_STYLES[row.status] ?? 'bg-slate-100 text-slate-600'}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-slate-600">{fmtDate(row.createdAt)}</td>
                    <td className="px-4 py-2.5 text-right">
                      <Link
                        href={`/admin/newsletters/composer/${row.id}`}
                        className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-[#035CB3] hover:bg-[#035CB3]/5"
                      >
                        Open
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
