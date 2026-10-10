'use client';

import { useEffect, useState } from 'react';
import { fetchNewsletterDashboard, type NewsletterDashboard } from '@/lib/newslettersApi';

const StatTile = ({ label, value, tone = 'default' }: { label: string; value: number; tone?: 'default' | 'green' | 'amber' | 'red' | 'blue' }) => {
  const toneClasses = {
    default: 'bg-white text-slate-900',
    green: 'bg-emerald-50 text-emerald-700',
    amber: 'bg-amber-50 text-amber-700',
    red: 'bg-red-50 text-red-700',
    blue: 'bg-sky-50 text-sky-700',
  }[tone];
  return (
    <div className={`rounded-xl border border-slate-200 p-4 ${toneClasses}`}>
      <p className="text-[11px] font-semibold uppercase tracking-wider opacity-80">{label}</p>
      <p className="mt-1 text-2xl font-bold tabular-nums">{value.toLocaleString()}</p>
    </div>
  );
};

const SectionCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <h2 className="mb-4 text-sm font-bold text-[#022D5A]">{title}</h2>
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{children}</div>
  </section>
);

export default function NewsletterDashboardPage() {
  const [data, setData] = useState<NewsletterDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const result = await fetchNewsletterDashboard();
      if (!active) return;
      if (result) {
        setData(result);
        setError(null);
      } else {
        setError('Unable to load dashboard. Please try again.');
      }
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">Loading dashboard…</div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
        {error ?? 'No data available.'}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <SectionCard title="Subscribers">
        <StatTile label="Total" value={data.subscribers.total} />
        <StatTile label="Subscribed" value={data.subscribers.subscribed} tone="green" />
        <StatTile label="Pending" value={data.subscribers.pending} tone="amber" />
        <StatTile label="Unsubscribed" value={data.subscribers.unsubscribed + data.subscribers.suppressed} tone="red" />
      </SectionCard>

      <SectionCard title="Campaigns">
        <StatTile label="Total" value={data.campaigns.total} />
        <StatTile label="Draft" value={data.campaigns.draft} />
        <StatTile label="Sending" value={data.campaigns.sending} tone="blue" />
        <StatTile label="Sent" value={data.campaigns.sent} tone="green" />
      </SectionCard>

      <SectionCard title="Deliveries">
        <StatTile label="Queued" value={data.deliveries.queued} tone="blue" />
        <StatTile label="Sent / Accepted" value={data.deliveries.sent} />
        <StatTile label="Delivered" value={data.deliveries.delivered} tone="green" />
        <StatTile label="Bounced / Failed" value={data.deliveries.bounced + data.deliveries.failed} tone="red" />
      </SectionCard>

      <p className="text-xs text-slate-400">
        Delivery states beyond "accepted by provider" require the Resend webhook to be configured. See NEWSLETTER_SETUP.md.
      </p>
    </div>
  );
}
