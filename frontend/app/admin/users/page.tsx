'use client';

import { useCallback, useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import {
  deleteUser,
  fetchUsers,
  updateUserRole,
  type AdminUserRow,
} from '@/lib/adminApi';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const list = await fetchUsers();
      setUsers(list);
    } catch {
      setError('Failed to load users.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const toggleRole = async (u: AdminUserRow) => {
    setBusyId(u.id);
    const nextRole = u.role === 'ADMIN' ? 'MEMBER' : 'ADMIN';
    const ok = await updateUserRole(u.id, nextRole);
    setBusyId(null);
    if (ok) await load();
    else setError('Role update failed.');
  };

  const handleDelete = async (u: AdminUserRow) => {
    if (!confirm(`Delete ${u.email}? This cannot be undone.`)) return;
    setBusyId(u.id);
    const ok = await deleteUser(u.id);
    setBusyId(null);
    if (ok) await load();
    else setError('Delete failed.');
  };

  const filtered = users.filter((u) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      u.username?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      (u.fullName ?? '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#022D5A]">User accounts</h1>
          <p className="text-sm text-slate-600">
            Manage user accounts, roles and access.
            {loading && ' Loading...'}
          </p>
        </div>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, email, username..."
          className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm focus:border-[#035CB3] focus:outline-none focus:ring-1 focus:ring-[#035CB3] sm:w-72"
        />
      </div>

      {error && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {error}
        </div>
      )}

      <Card padded>
        {filtered.length === 0 ? (
          <EmptyState
            title={loading ? 'Loading users...' : 'No users found'}
            description="Registered accounts will appear here."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-widest text-slate-500">
                  <th className="py-2 pr-4">User</th>
                  <th className="py-2 pr-4">Email</th>
                  <th className="py-2 pr-4">Role</th>
                  <th className="py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 pr-4">
                      <p className="font-semibold text-[#022D5A]">{u.fullName || u.username}</p>
                      <p className="text-xs text-slate-500">@{u.username}</p>
                    </td>
                    <td className="py-3 pr-4 text-slate-700">{u.email}</td>
                    <td className="py-3 pr-4">
                      <Badge tone={u.role === 'ADMIN' ? 'primary' : 'muted'}>{u.role}</Badge>
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex justify-end gap-1.5">
                        <button
                          type="button"
                          disabled={busyId === u.id}
                          onClick={() => toggleRole(u)}
                          className="rounded-md border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 hover:border-[#035CB3] hover:text-[#035CB3] disabled:opacity-50"
                        >
                          {u.role === 'ADMIN' ? 'Make MEMBER' : 'Make ADMIN'}
                        </button>
                        <button
                          type="button"
                          disabled={busyId === u.id}
                          onClick={() => handleDelete(u)}
                          className="rounded-md border border-rose-300 px-3 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-50 disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </div>
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
