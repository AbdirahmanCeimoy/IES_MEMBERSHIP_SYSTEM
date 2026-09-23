'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { fetchUsers, type AdminUserRow } from '@/lib/adminApi';

export default function AdminMembersPage() {
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchUsers()
      .then((list) => setUsers(list.filter((u) => u.role === 'MEMBER')))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (!search) return users;
    const q = search.toLowerCase();
    return users.filter(
      (u) =>
        (u.fullName ?? '').toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.id?.toLowerCase().includes(q),
    );
  }, [users, search]);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold text-[#022D5A]">Members</h1>
        <p className="text-sm text-slate-600">
          Approved and active IES members. {loading && 'Loading...'}
        </p>
      </div>

      <Card padded>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            {users.length} total members
          </span>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, ID..."
            className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm focus:border-[#035CB3] focus:outline-none focus:ring-1 focus:ring-[#035CB3] sm:w-64"
          />
        </div>
      </Card>

      <Card padded>
        {filtered.length === 0 ? (
          <EmptyState
            title={loading ? 'Loading...' : 'No members yet'}
            description="Approved applicants appear here as members with their registration numbers."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-widest text-slate-500">
                  <th className="py-2 pr-4">Member</th>
                  <th className="py-2 pr-4">ID</th>
                  <th className="py-2 pr-4">Email</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((m) => (
                  <tr key={m.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 pr-4">
                      <p className="font-semibold text-[#022D5A]">{m.fullName || m.username}</p>
                      <p className="text-xs text-slate-500">@{m.username}</p>
                    </td>
                    <td className="py-3 pr-4 font-mono text-xs text-slate-700">{m.id.slice(0, 8)}</td>
                    <td className="py-3 pr-4 text-slate-700">{m.email}</td>
                    <td className="py-3">
                      <Badge tone="success">Active</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
