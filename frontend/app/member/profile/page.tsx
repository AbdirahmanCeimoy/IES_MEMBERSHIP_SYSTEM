'use client';

import { useState } from 'react';
import { getStoredUser } from '@/lib/authSession';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { sanitizeEmail, sanitizeName, sanitizePhone } from '@/lib/inputSanitizers';

interface StoredUser {
  fullName?: string;
  username?: string;
  email?: string;
  role?: string;
}

export default function MyProfilePage() {
  const [user] = useState<StoredUser | null>(() =>
    typeof window === 'undefined' ? null : getStoredUser<StoredUser>() ?? {},
  );

  const [form, setForm] = useState({
    fullName: user?.fullName ?? '',
    email: user?.email ?? '',
    phone: '',
    organization: '',
  });
  const [saved, setSaved] = useState(false);

  const handleChange = (name: keyof typeof form) => (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    let value = event.target.value;
    if (name === 'fullName') value = sanitizeName(value);
    else if (name === 'email') value = sanitizeEmail(value);
    else if (name === 'phone') value = sanitizePhone(value);
    setForm((prev) => ({ ...prev, [name]: value }));
    setSaved(false);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Backend PATCH /auth/me not yet wired here.
    setSaved(true);
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold text-[#082B55]">Profile</h1>
        <p className="text-sm text-slate-600">
          Keep your contact and profile information current. Some fields can only be updated once every 2 months.
        </p>
      </div>

      <Card padded className="max-w-2xl">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-xs font-semibold text-[#082B55]">
              Full name
              <input
                type="text"
                value={form.fullName}
                onChange={handleChange('fullName')}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal focus:border-[#0047AB] focus:outline-none focus:ring-1 focus:ring-[#0047AB]"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-[#082B55]">
              Email
              <input
                type="email"
                value={form.email}
                onChange={handleChange('email')}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal focus:border-[#0047AB] focus:outline-none focus:ring-1 focus:ring-[#0047AB]"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-[#082B55]">
              Phone
              <input
                type="tel"
                value={form.phone}
                onChange={handleChange('phone')}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal focus:border-[#0047AB] focus:outline-none focus:ring-1 focus:ring-[#0047AB]"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-[#082B55]">
              Organization
              <input
                type="text"
                value={form.organization}
                onChange={handleChange('organization')}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal focus:border-[#0047AB] focus:outline-none focus:ring-1 focus:ring-[#0047AB]"
              />
            </label>
          </div>
          {saved && (
            <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
              Changes saved locally - backend sync will be wired next.
            </div>
          )}
          <div>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-lg bg-[#66FF00] px-6 py-2 text-sm font-semibold text-[#082B55] transition-colors hover:bg-[#5be000]"
            >
              Save changes
            </button>
          </div>
        </form>
      </Card>

      <EmptyState
        title="Password & security"
        description="Change password and two-factor authentication controls will land here once the backend endpoints are connected."
      />
    </div>
  );
}
