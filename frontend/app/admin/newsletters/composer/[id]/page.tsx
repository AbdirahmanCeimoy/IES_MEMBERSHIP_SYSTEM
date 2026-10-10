'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  deleteCampaign,
  fetchCampaign,
  fetchEligibleCount,
  sendCampaign,
  sendTestCampaign,
  updateCampaign,
  type CampaignFull,
} from '@/lib/newslettersApi';

type Status = 'idle' | 'saving' | 'saved' | 'error';

const fmtTime = (d: Date) => d.toLocaleTimeString();

export default function ComposerEditPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id ?? '';

  const [campaign, setCampaign] = useState<CampaignFull | null>(null);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState('');
  const [previewText, setPreviewText] = useState('');
  const [contentHtml, setContentHtml] = useState('');
  const [contentText, setContentText] = useState('');
  const [tab, setTab] = useState<'editor' | 'preview'>('editor');
  const [saveStatus, setSaveStatus] = useState<Status>('idle');
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [eligible, setEligible] = useState<number>(0);
  const [testTo, setTestTo] = useState('');
  const [testStatus, setTestStatus] = useState<string>('');
  const [showSendConfirm, setShowSendConfirm] = useState(false);
  const [sendBusy, setSendBusy] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [showDelete, setShowDelete] = useState(false);

  const isEditable = (campaign?.status ?? 'draft') === 'draft';

  const load = useCallback(async () => {
    const c = await fetchCampaign(id);
    if (c) {
      setCampaign(c);
      setSubject(c.subject);
      setPreviewText(c.previewText ?? '');
      setContentHtml(c.contentHtml);
      setContentText(c.contentText ?? '');
    }
    const eligibleResult = await fetchEligibleCount();
    setEligible(eligibleResult);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  // Autosave (debounced)
  const dirtyRef = useRef(false);
  useEffect(() => {
    dirtyRef.current = true;
  }, [subject, previewText, contentHtml, contentText]);

  useEffect(() => {
    if (!campaign || !isEditable) return;
    const timer = setInterval(async () => {
      if (!dirtyRef.current) return;
      dirtyRef.current = false;
      setSaveStatus('saving');
      const updated = await updateCampaign(campaign.id, {
        subject: subject.trim() || 'Untitled newsletter',
        previewText: previewText.trim() || undefined,
        contentHtml,
        contentText: contentText.trim() || undefined,
      });
      if (updated) {
        setSaveStatus('saved');
        setLastSavedAt(new Date());
      } else {
        setSaveStatus('error');
      }
    }, 2500);
    return () => clearInterval(timer);
  }, [campaign, subject, previewText, contentHtml, contentText, isEditable]);

  const sendTest = async () => {
    if (!campaign || !testTo.trim()) return;
    setTestStatus('Sending test…');
    const res = await sendTestCampaign(campaign.id, testTo.trim());
    setTestStatus(res.ok ? `Test sent to ${testTo.trim()}.` : `Failed: ${res.message ?? 'unknown error'}`);
  };

  const doSend = async () => {
    if (!campaign) return;
    setSendBusy(true);
    setSendError(null);
    const res = await sendCampaign(campaign.id);
    setSendBusy(false);
    if (!res.ok) {
      setSendError(res.message ?? 'Could not start sending.');
      return;
    }
    setShowSendConfirm(false);
    router.push(`/admin/newsletters/history/${campaign.id}`);
  };

  const doDelete = async () => {
    if (!campaign) return;
    const ok = await deleteCampaign(campaign.id);
    if (ok) router.push('/admin/newsletters/composer');
  };

  const previewFrame = useMemo(
    () =>
      `<!doctype html><html><body style="font-family:Arial,sans-serif;color:#0f172a;padding:16px">${contentHtml || '<em style="color:#94a3b8">Nothing to preview yet.</em>'}</body></html>`,
    [contentHtml],
  );

  if (loading) {
    return <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">Loading campaign…</div>;
  }

  if (!campaign) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
        Campaign not found. <Link href="/admin/newsletters/composer" className="underline">Back to drafts</Link>.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <Link href="/admin/newsletters/composer" className="font-semibold text-[#035CB3] hover:underline">‹ All drafts</Link>
          <span>·</span>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 font-semibold uppercase tracking-wider text-slate-600">{campaign.status}</span>
          {saveStatus === 'saving' && <span className="text-slate-400">Saving…</span>}
          {saveStatus === 'saved' && lastSavedAt && <span className="text-slate-400">Saved at {fmtTime(lastSavedAt)}</span>}
          {saveStatus === 'error' && <span className="text-red-500">Save failed</span>}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {isEditable && (
            <button
              type="button"
              onClick={() => setShowDelete(true)}
              className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-red-300 hover:text-red-600"
            >
              Delete draft
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowSendConfirm(true)}
            disabled={!isEditable || eligible === 0}
            className="rounded-md bg-[#48C184] px-4 py-1.5 text-xs font-bold text-white hover:bg-[#2d7a50] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Send to {eligible.toLocaleString()} subscribers
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-1 border-b border-slate-100 px-3">
            {(['editor', 'preview'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`border-b-2 px-3 py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
                  tab === t ? 'border-[#035CB3] text-[#022D5A]' : 'border-transparent text-slate-500 hover:text-[#022D5A]'
                }`}
              >
                {t === 'editor' ? 'Editor' : 'Preview'}
              </button>
            ))}
          </div>

          {tab === 'editor' ? (
            <div className="space-y-3 p-4">
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  disabled={!isEditable}
                  maxLength={255}
                  className="mt-1 h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm focus:border-[#035CB3] focus:outline-none focus:ring-2 focus:ring-[#035CB3]/30 disabled:bg-slate-50"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Preview text</label>
                <input
                  type="text"
                  value={previewText}
                  onChange={(e) => setPreviewText(e.target.value)}
                  disabled={!isEditable}
                  maxLength={255}
                  placeholder="Shown next to the subject in most inboxes."
                  className="mt-1 h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm focus:border-[#035CB3] focus:outline-none focus:ring-2 focus:ring-[#035CB3]/30 disabled:bg-slate-50"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Content (HTML)</label>
                <textarea
                  value={contentHtml}
                  onChange={(e) => setContentHtml(e.target.value)}
                  disabled={!isEditable}
                  rows={16}
                  spellCheck
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-3 font-mono text-xs leading-relaxed focus:border-[#035CB3] focus:outline-none focus:ring-2 focus:ring-[#035CB3]/30 disabled:bg-slate-50"
                />
                <p className="mt-1 text-[11px] text-slate-400">
                  Supported: &lt;p&gt;, &lt;a&gt;, &lt;h1-3&gt;, &lt;ul&gt;/&lt;li&gt;, &lt;img&gt;. The campaign is wrapped in a branded header + unsubscribe footer automatically.
                </p>
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Plain-text fallback (optional)</label>
                <textarea
                  value={contentText}
                  onChange={(e) => setContentText(e.target.value)}
                  disabled={!isEditable}
                  rows={5}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-3 text-xs leading-relaxed focus:border-[#035CB3] focus:outline-none focus:ring-2 focus:ring-[#035CB3]/30 disabled:bg-slate-50"
                />
              </div>
            </div>
          ) : (
            <div className="p-4">
              <p className="mb-2 text-[11px] text-slate-400">Preview — this does not include the brand header or unsubscribe footer that recipients will see.</p>
              <iframe
                srcDoc={previewFrame}
                title="Preview"
                className="h-[640px] w-full rounded-lg border border-slate-200 bg-white"
                sandbox=""
              />
            </div>
          )}
        </div>

        <aside className="space-y-4">
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-sm font-bold text-[#022D5A]">Send a test</h3>
            <p className="mt-1 text-[11px] text-slate-500">Preview the campaign in your inbox. Does not touch subscribers.</p>
            <div className="mt-3 flex gap-2">
              <input
                type="email"
                value={testTo}
                onChange={(e) => setTestTo(e.target.value)}
                placeholder="your@email.com"
                className="h-10 flex-1 rounded-lg border border-slate-300 bg-white px-3 text-sm focus:border-[#035CB3] focus:outline-none focus:ring-2 focus:ring-[#035CB3]/30"
              />
              <button
                type="button"
                onClick={sendTest}
                disabled={!testTo.trim()}
                className="rounded-lg bg-[#035CB3] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#024790] disabled:opacity-50"
              >
                Send test
              </button>
            </div>
            {testStatus && <p className="mt-2 text-[11px] text-slate-500">{testStatus}</p>}
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-sm font-bold text-[#022D5A]">Audience</h3>
            <p className="mt-1 text-[11px] text-slate-500">Confirmed subscribers only. Pending and unsubscribed addresses are skipped automatically.</p>
            <p className="mt-3 text-3xl font-bold text-[#022D5A]">{eligible.toLocaleString()}</p>
            <p className="text-[11px] text-slate-500">eligible recipients</p>
          </section>
        </aside>
      </div>

      {/* Send confirmation */}
      {showSendConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-base font-bold text-[#022D5A]">Send this newsletter?</h3>
            <p className="mt-2 text-sm text-slate-600">
              It will be queued for delivery to <strong>{eligible.toLocaleString()}</strong> confirmed subscriber{eligible === 1 ? '' : 's'}. This action cannot be undone.
            </p>
            {sendError && <p className="mt-2 text-sm text-red-600">{sendError}</p>}
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                disabled={sendBusy}
                onClick={() => setShowSendConfirm(false)}
                className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={sendBusy}
                onClick={doSend}
                className="rounded-md bg-[#48C184] px-4 py-2 text-sm font-bold text-white hover:bg-[#2d7a50] disabled:opacity-50"
              >
                {sendBusy ? 'Starting…' : 'Yes, send now'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {showDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-base font-bold text-[#022D5A]">Delete this draft?</h3>
            <p className="mt-2 text-sm text-slate-600">This cannot be undone.</p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowDelete(false)}
                className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={doDelete}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
