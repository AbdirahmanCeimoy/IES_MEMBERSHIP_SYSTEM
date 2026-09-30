import Link from 'next/link';

export const metadata = { title: 'Settings — Member Portal' };

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-xl font-bold text-[#035CB3]">Settings</h1>
      <p className="mt-1 text-sm text-slate-500">Manage your account preferences.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Link
          href="/member/profile"
          className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#035CB3]/10 text-[#035CB3]">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="10" cy="7" r="3" /><path d="M4 17c0-3.3 2.7-6 6-6s6 2.7 6 6" strokeLinecap="round" /></svg>
          </div>
          <p className="mt-3 text-sm font-bold text-[#035CB3] group-hover:text-[#035CB3]">Profile</p>
          <p className="mt-1 text-xs text-slate-500">Personal information and photo.</p>
        </Link>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="4" y="8" width="12" height="9" rx="2" /><path d="M7 8V6a3 3 0 0 1 6 0v2" strokeLinecap="round" /></svg>
          </div>
          <p className="mt-3 text-sm font-bold text-[#035CB3]">Password</p>
          <p className="mt-1 text-xs text-slate-500">Change your password (coming soon).</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#48C184]/15 text-[#3AA870]">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 5l7 5 7-5M3 5h14v10H3z" strokeLinejoin="round" /></svg>
          </div>
          <p className="mt-3 text-sm font-bold text-[#035CB3]">Email preferences</p>
          <p className="mt-1 text-xs text-slate-500">Notification settings (coming soon).</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="10" cy="10" r="7" /><path d="M10 6v4l3 2" strokeLinecap="round" /></svg>
          </div>
          <p className="mt-3 text-sm font-bold text-[#035CB3]">Activity log</p>
          <p className="mt-1 text-xs text-slate-500">Recent account activity (coming soon).</p>
        </div>
      </div>
    </div>
  );
}
