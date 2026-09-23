'use client';

import { useEffect, useState } from 'react';

const CSV_URL = '/api/cv-data';
const PER_PAGE = 10;

interface CVEntry {
  timestamp: string;
  name: string;
  discipline: string;
  education: string;
  experience: string;
  cvLink: string;
}

function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let current = '';
  let inQuotes = false;
  let row: string[] = [];

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (inQuotes) {
      if (char === '"' && text[i + 1] === '"') {
        current += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        current += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        row.push(current.trim());
        current = '';
      } else if (char === '\n' || (char === '\r' && text[i + 1] === '\n')) {
        row.push(current.trim());
        if (row.some((cell) => cell !== '')) rows.push(row);
        row = [];
        current = '';
        if (char === '\r') i++;
      } else {
        current += char;
      }
    }
  }
  if (current || row.length > 0) {
    row.push(current.trim());
    if (row.some((cell) => cell !== '')) rows.push(row);
  }
  return rows;
}

function parseEntries(rows: string[][]): CVEntry[] {
  if (rows.length < 2) return [];
  return rows.slice(1).filter((r) => r[2]).map((r) => ({
    timestamp: r[0] || '',
    name: r[2] || '',
    discipline: r[8] || '',
    education: r[9] || '',
    experience: r[10] || '',
    cvLink: r[16] || '',
  }));
}

function formatDate(timestamp: string) {
  if (!timestamp) return '—';
  try {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return timestamp.split(' ')[0] || timestamp;
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return timestamp;
  }
}

function Pagination({ current, total, onChange }: { current: number; total: number; onChange: (p: number) => void }) {
  if (total <= 1) return null;

  const pages: (number | '...')[] = [];
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= current - 1 && i <= current + 1)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  return (
    <div className="mt-6 flex items-center justify-center gap-1.5">
      <button
        type="button"
        onClick={() => onChange(current - 1)}
        disabled={current === 1}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`dots-${i}`} className="px-1 text-sm text-slate-400">...</span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-semibold transition-colors ${
              p === current
                ? 'bg-[#035CB3] text-white shadow-sm'
                : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            {p}
          </button>
        ),
      )}
      <button
        type="button"
        onClick={() => onChange(current + 1)}
        disabled={current === total}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>
  );
}

export function CVTable() {
  const [entries, setEntries] = useState<CVEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(CSV_URL);
        if (!res.ok) {
          const data = await res.json().catch(() => null);
          throw new Error(data?.error || 'Failed to load CV data');
        }
        const text = await res.text();
        const rows = parseCSV(text);
        setEntries(parseEntries(rows));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load CV data.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filtered = entries.filter((e) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      e.name.toLowerCase().includes(q) ||
      e.discipline.toLowerCase().includes(q) ||
      e.education.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const safeP = Math.min(page, totalPages || 1);
  const paginated = filtered.slice((safeP - 1) * PER_PAGE, safeP * PER_PAGE);

  useEffect(() => {
    setPage(1);
  }, [search]);

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-3 py-16">
        <svg className="h-8 w-8 animate-spin text-[#035CB3]" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
          <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
        </svg>
        <p className="text-sm text-slate-500">Loading CV repository...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-50">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-medium text-slate-700">CV repository is being configured</p>
          <p className="mt-1 max-w-sm text-xs text-slate-500">
            The data source is not yet publicly accessible. Please check back shortly.
          </p>
        </div>
        <button type="button" onClick={() => window.location.reload()} className="mt-1 rounded-lg bg-[#035CB3] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#024A8F]">
          Retry
        </button>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <p className="text-sm text-slate-500">No CVs have been submitted yet.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500">
          <span className="font-semibold text-slate-700">{filtered.length}</span>{' '}
          {filtered.length === 1 ? 'CV' : 'CVs'} found
          {totalPages > 1 && (
            <span className="ml-1 text-slate-400">
              — page {safeP} of {totalPages}
            </span>
          )}
        </p>
        <div className="relative">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search by name, discipline..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-[#035CB3] focus:ring-2 focus:ring-[#035CB3]/20 sm:w-72"
          />
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-x-auto rounded-xl border border-slate-200 md:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-[#035CB3] text-white">
              <th className="whitespace-nowrap px-4 py-3 text-xs font-bold uppercase tracking-wide">Timestamp</th>
              <th className="whitespace-nowrap px-4 py-3 text-xs font-bold uppercase tracking-wide">Name</th>
              <th className="whitespace-nowrap px-4 py-3 text-xs font-bold uppercase tracking-wide">Engineering Discipline</th>
              <th className="whitespace-nowrap px-4 py-3 text-xs font-bold uppercase tracking-wide">Highest Level of Education</th>
              <th className="whitespace-nowrap px-4 py-3 text-xs font-bold uppercase tracking-wide">Years of Experience</th>
              <th className="whitespace-nowrap px-4 py-3 text-xs font-bold uppercase tracking-wide">Upload Your CV</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginated.map((entry, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
                <td className="whitespace-nowrap px-4 py-3 text-slate-500">{formatDate(entry.timestamp)}</td>
                <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-800">{entry.name}</td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-600">{entry.discipline || '—'}</td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-600">{entry.education || '—'}</td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-600">{entry.experience || '—'}</td>
                <td className="whitespace-nowrap px-4 py-3">
                  {entry.cvLink ? (
                    <a href={entry.cvLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-md bg-[#035CB3] px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#024A8F]">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      View CV
                    </a>
                  ) : (
                    <span className="text-xs text-slate-400">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="flex flex-col gap-3 md:hidden">
        {paginated.map((entry, i) => (
          <div key={i} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-semibold text-slate-800">{entry.name}</p>
                <p className="mt-0.5 text-xs text-[#035CB3]">{entry.discipline || 'No discipline specified'}</p>
              </div>
              {entry.cvLink && (
                <a href={entry.cvLink} target="_blank" rel="noopener noreferrer" className="shrink-0 rounded-md bg-[#035CB3] px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#024A8F]">
                  View CV
                </a>
              )}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
              <div>
                <p className="font-semibold text-slate-400">Education</p>
                <p className="text-slate-600">{entry.education || '—'}</p>
              </div>
              <div>
                <p className="font-semibold text-slate-400">Experience</p>
                <p className="text-slate-600">{entry.experience || '—'}</p>
              </div>
              <div>
                <p className="font-semibold text-slate-400">Submitted</p>
                <p className="text-slate-600">{formatDate(entry.timestamp)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && entries.length > 0 && (
        <div className="py-10 text-center">
          <p className="text-sm text-slate-500">No CVs match your search.</p>
        </div>
      )}

      <Pagination current={safeP} total={totalPages} onChange={setPage} />
    </div>
  );
}
