'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { fetchOrganizations, type OrganizationRow } from '@/lib/adminApi';

export default function AdminOrganizationsPage() {
  const [orgs, setOrgs] = useState<OrganizationRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrganizations()
      .then(setOrgs)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold text-[#022D5A]">Organizations</h1>
        <p className="text-sm text-slate-600">
          Corporate and institutional membership applications.
          {loading && ' Loading...'}
        </p>
      </div>
      <Card padded>
        {orgs.length === 0 ? (
          <EmptyState
            title={loading ? 'Loading...' : 'No organization applications'}
            description="Companies, universities and NGOs that apply for organization membership will appear here."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-widest text-slate-500">
                  <th className="py-2 pr-4">Organization</th>
                  <th className="py-2 pr-4">Sector</th>
                  <th className="py-2 pr-4">Contact</th>
                  <th className="py-2 pr-4">Submitted</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {orgs.map((o) => (
                  <tr key={o.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 pr-4 font-semibold text-[#022D5A]">
                      {o.organizationName || o.name || '-'}
                    </td>
                    <td className="py-3 pr-4 text-slate-700">{o.sector ?? '-'}</td>
                    <td className="py-3 pr-4 text-slate-500">{o.contactPerson || o.contactEmail || '-'}</td>
                    <td className="py-3 pr-4 text-slate-500">
                      {o.createdAt ? new Date(o.createdAt).toLocaleDateString() : '-'}
                    </td>
                    <td className="py-3">
                      <Badge
                        tone={
                          o.status === 'APPROVED'
                            ? 'success'
                            : o.status === 'PENDING'
                              ? 'warning'
                              : 'muted'
                        }
                      >
                        {o.status?.toLowerCase() ?? 'unknown'}
                      </Badge>
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
