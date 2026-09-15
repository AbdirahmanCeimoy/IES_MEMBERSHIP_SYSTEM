'use client';

import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';

interface AdminApplication {
  id: string;
  applicant: string;
  grade: string;
  submitted: string;
  status: 'pending' | 'approved' | 'rejected';
}

const sample: AdminApplication[] = [];

export default function AllApplicationsPage() {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold text-[#082B55]">All Applications</h1>
        <p className="text-sm text-slate-600">Admin-only view of every submitted membership application.</p>
      </div>

      <Card padded>
        {sample.length === 0 ? (
          <EmptyState
            title="Live application feed not connected"
            description="Once the /memberships/applications admin endpoint is wired, all submissions will list here with status filters and per-row actions."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-widest text-slate-500">
                  <th className="pb-2 pr-4">Applicant</th>
                  <th className="pb-2 pr-4">Grade</th>
                  <th className="pb-2 pr-4">Submitted</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {sample.map((row) => (
                  <tr key={row.id} className="border-b border-slate-100">
                    <td className="py-2 pr-4 text-[#082B55]">{row.applicant}</td>
                    <td className="py-2 pr-4">{row.grade}</td>
                    <td className="py-2 pr-4 text-slate-500">{row.submitted}</td>
                    <td className="py-2">
                      <Badge
                        tone={
                          row.status === 'approved'
                            ? 'success'
                            : row.status === 'rejected'
                              ? 'warning'
                              : 'primary'
                        }
                      >
                        {row.status}
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
