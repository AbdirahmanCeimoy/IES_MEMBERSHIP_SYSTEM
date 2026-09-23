'use client';

import { useCallback, useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import {
  createAnnouncement,
  fetchAnnouncements,
  type AnnouncementRow,
} from '@/lib/adminApi';

export default function AdminNewsPage() {
  const [posts, setPosts] = useState<AnnouncementRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [form, setForm] = useState({ title: '', category: 'News', body: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const list = await fetchAnnouncements();
      setPosts(list);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handlePublish = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.title.trim() || !form.body.trim()) {
      setError('Title and body are required.');
      return;
    }
    setSubmitting(true);
    setError('');
    const ok = await createAnnouncement(form);
    setSubmitting(false);
    if (ok) {
      setShowEditor(false);
      setForm({ title: '', category: 'News', body: '' });
      await load();
    } else {
      setError('Publish failed. Check backend connection.');
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#022D5A]">News & Content</h1>
          <p className="text-sm text-slate-600">
            Publish news, announcements and publications.
            {loading && ' Loading...'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowEditor(true)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#48C184] px-4 py-2 text-sm font-semibold text-[#022D5A] hover:bg-[#3AA870]"
        >
          + New post
        </button>
      </div>

      <Card padded>
        {posts.length === 0 ? (
          <EmptyState
            title={loading ? 'Loading...' : 'No posts yet'}
            description="Create a news post, announcement, or publication."
          />
        ) : (
          <ul className="divide-y divide-slate-100">
            {posts.map((post) => (
              <li key={post.id} className="flex items-start justify-between gap-3 py-3">
                <div>
                  <p className="text-sm font-semibold text-[#022D5A]">{post.title}</p>
                  <p className="text-xs text-slate-500">
                    {post.category ?? 'Announcement'}
                    {post.createdAt ? ` · ${new Date(post.createdAt).toLocaleDateString()}` : ''}
                  </p>
                  {post.body && (
                    <p className="mt-1 line-clamp-2 text-xs text-slate-600">{post.body}</p>
                  )}
                </div>
                <Badge tone="success">Published</Badge>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {showEditor && (
        <>
          <div className="fixed inset-0 z-40 bg-slate-900/40" onClick={() => setShowEditor(false)} />
          <div className="fixed left-1/2 top-1/2 z-50 w-[min(560px,90vw)] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h2 className="text-base font-bold text-[#022D5A]">New post</h2>
              <button onClick={() => setShowEditor(false)} className="text-slate-400 hover:text-slate-700">
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 5l10 10M15 5l-10 10" strokeLinecap="round" /></svg>
              </button>
            </div>
            <form onSubmit={handlePublish} className="flex flex-col gap-3 p-5">
              <label className="flex flex-col gap-1 text-xs font-semibold text-[#022D5A]">
                Title
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal focus:border-[#035CB3] focus:outline-none focus:ring-1 focus:ring-[#035CB3]"
                />
              </label>
              <label className="flex flex-col gap-1 text-xs font-semibold text-[#022D5A]">
                Category
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal focus:border-[#035CB3] focus:outline-none focus:ring-1 focus:ring-[#035CB3]"
                >
                  <option>News</option>
                  <option>Announcement</option>
                  <option>Publication</option>
                </select>
              </label>
              <label className="flex flex-col gap-1 text-xs font-semibold text-[#022D5A]">
                Body
                <textarea
                  rows={6}
                  required
                  value={form.body}
                  onChange={(e) => setForm({ ...form, body: e.target.value })}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal focus:border-[#035CB3] focus:outline-none focus:ring-1 focus:ring-[#035CB3]"
                />
              </label>
              {error && (
                <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                  {error}
                </div>
              )}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditor(false)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-[#035CB3] hover:text-[#035CB3]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-lg bg-[#48C184] px-4 py-2 text-sm font-semibold text-[#022D5A] hover:bg-[#3AA870] disabled:opacity-50"
                >
                  {submitting ? 'Publishing...' : 'Publish'}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
