'use client';

import { useState } from 'react';

const ROWS_PER_PAGE_OPTIONS = [10, 25, 50];

interface Statement {
  documentNo: string;
  documentType: string;
  description: string;
  amount: string;
  dueDate: string;
  postingDate: string;
}

const MOCK_STATEMENTS: Statement[] = [];

export default function BillingPage() {
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);

  const totalRows = MOCK_STATEMENTS.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / rowsPerPage));
  const paged = MOCK_STATEMENTS.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-bold text-[#035CB3]">Billing</h1>
        <p className="mt-0.5 text-xs text-slate-500">My Transactions</p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        {/* Tab bar */}
        <div className="border-b border-slate-200 px-5 pt-4">
          <div className="inline-flex gap-0">
            <button
              type="button"
              className="rounded-t-md border border-b-0 border-slate-300 bg-white px-5 py-2 text-sm font-semibold text-[#022D5A]"
            >
              My Statement
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <th className="px-5 py-3">Document No</th>
                <th className="px-5 py-3">Document Type</th>
                <th className="px-5 py-3">Description</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3">Due Date</th>
                <th className="px-5 py-3">Posting Date</th>
                <th className="px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-14 text-center text-sm text-slate-400">
                    No data available
                  </td>
                </tr>
              ) : (
                paged.map((row) => (
                  <tr key={row.documentNo} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-5 py-3 font-mono text-xs text-[#035CB3]">{row.documentNo}</td>
                    <td className="px-5 py-3 text-slate-700">{row.documentType}</td>
                    <td className="px-5 py-3 text-slate-700">{row.description}</td>
                    <td className="px-5 py-3 font-semibold text-[#022D5A]">{row.amount}</td>
                    <td className="px-5 py-3 text-slate-600">{row.dueDate}</td>
                    <td className="px-5 py-3 text-slate-600">{row.postingDate}</td>
                    <td className="px-5 py-3">
                      <button
                        type="button"
                        className="rounded-md bg-[#035CB3] px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#024A8F]"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination footer */}
        <div className="flex flex-wrap items-center justify-end gap-3 border-t border-slate-200 px-5 py-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Rows per page:</span>
            <select
              value={rowsPerPage}
              onChange={(e) => { setRowsPerPage(Number(e.target.value)); setPage(1); }}
              className="rounded border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#035CB3]"
            >
              {ROWS_PER_PAGE_OPTIONS.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <span className="min-w-[60px] text-right">
              {totalRows === 0 ? '0' : `${(page - 1) * rowsPerPage + 1}–${Math.min(page * rowsPerPage, totalRows)}`} of {totalRows}
            </span>
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="flex h-7 w-7 items-center justify-center rounded hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 5l-5 5 5 5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="flex h-7 w-7 items-center justify-center rounded hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 5l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
