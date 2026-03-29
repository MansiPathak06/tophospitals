'use client';

import { useState, useEffect, useCallback } from 'react';
import BlogBuilder from './BlogsBuilder';

const API = 'http://localhost:5000/api';

function authHeaders(token) {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
}

// ─── Main BlogsTab ────────────────────────────────────────────────────────────
export default function BlogsTab({ token, showToast }) {
  const [blogs, setBlogs]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [deleting, setDeleting]   = useState(null);
  const [search, setSearch]       = useState('');

  // null = list view | 'new' = new post | blog object = edit existing
  const [builderMode, setBuilderMode] = useState(null);

  // ── Fetch all blogs (admin) ───────────────────────────────────────────────
  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${API}/blogs/admin/all`, { headers: authHeaders(token) });
      const data = await res.json();
      setBlogs(Array.isArray(data) ? data : []);
    } catch {
      showToast('Failed to fetch blogs', 'error');
    } finally {
      setLoading(false);
    }
  }, [token, showToast]);

  useEffect(() => { if (token) fetchBlogs(); }, [token, fetchBlogs]);

  // ── If in builder mode, render the builder taking full height ─────────────
  if (builderMode !== null) {
    return (
      // Escape the admin layout padding by using negative margins
      <div style={{ margin: '-2.25rem -2.25rem', height: 'calc(100vh - 0px)' }}>
        <BlogBuilder
          token={token}
          showToast={showToast}
          editingBlog={builderMode === 'new' ? null : builderMode}
          onBack={async () => {
            setBuilderMode(null);
            await fetchBlogs();
          }}
        />
      </div>
    );
  }

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!confirm('Delete this blog post? This cannot be undone.')) return;
    setDeleting(id);
    try {
      await fetch(`${API}/blogs/${id}`, { method: 'DELETE', headers: authHeaders(token) });
      await fetchBlogs();
      showToast('Blog deleted');
    } catch {
      showToast('Failed to delete blog', 'error');
    } finally {
      setDeleting(null);
    }
  };

  // ── Toggle publish / featured ─────────────────────────────────────────────
  const toggle = async (blog, field) => {
    try {
      await fetch(`${API}/blogs/${blog.id}`, {
        method: 'PUT', headers: authHeaders(token),
        body: JSON.stringify({ [field]: !blog[field] }),
      });
      await fetchBlogs();
      const label =
        field === 'published'
          ? blog.published ? 'Blog unpublished' : 'Blog published'
          : blog.is_featured ? 'Removed from featured' : 'Marked as featured';
      showToast(label);
    } catch {
      showToast('Failed to update blog', 'error');
    }
  };

  const filtered = blogs.filter(b =>
    [b.title, b.author, b.category].some(f => f?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      {/* ── Header ── */}
      <div className="flex items-start justify-between mb-7 flex-wrap gap-4">
        <div>
          <h2 className="text-[26px] font-semibold text-teal-50 tracking-tight">Blog Posts</h2>
          <p className="text-[13px] text-teal-700 mt-1">
            {blogs.length} post{blogs.length !== 1 ? 's' : ''} · {blogs.filter(b => b.published).length} published
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Search */}
          <div className="flex items-center gap-2 bg-teal-500/[0.03] border border-teal-500/10 rounded-xl px-3 py-2">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-teal-700">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Search posts…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent text-teal-200 text-[12px] outline-none placeholder:text-teal-800 w-36"
            />
          </div>

          {/* Single entry point: Blog Builder */}
          <button
            onClick={() => setBuilderMode('new')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-500 text-white text-[13px] font-bold shadow-lg shadow-teal-500/20 hover:opacity-90 transition-all"
          >
            ✦ New Post
          </button>
        </div>
      </div>

      {/* ── Stats row ── */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Total Posts', value: blogs.length,                           color: 'text-teal-300'   },
          { label: 'Published',   value: blogs.filter(b => b.published).length,  color: 'text-emerald-400'},
          { label: 'Drafts',      value: blogs.filter(b => !b.published).length, color: 'text-amber-400'  },
          
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-[#134545] border border-teal-500/[0.08] rounded-xl px-4 py-3">
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-[11px] text-teal-200 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* ── Table ── */}
      <div className="bg-[#144747] border border-teal-500/[0.08] rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-teal-500/[0.03]">
              {['Title', 'Category', 'Author', 'Status', '★', 'Date', 'Actions'].map(h => (
                <th key={h} className="px-5 py-3 text-left text-[10.5px] uppercase tracking-wider text-teal-200 font-bold border-b border-teal-500/[0.07]">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="text-center py-12 text-teal-200 text-sm">Loading…</td></tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <div className="py-14 text-center">
                    <div className="text-4xl opacity-80 mb-3">📝</div>
                    <p className="text-[13px] text-teal-200">
                      {search ? 'No posts match your search.' : 'No blog posts yet. Create your first one.'}
                    </p>
                    {!search && (
                      <button onClick={() => setBuilderMode('new')}
                        className="mt-4 px-5 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-500 text-white text-[12px] font-bold hover:opacity-90 transition-all">
                        ✦ Open Blog Builder
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map(blog => (
                <tr key={blog.id} className="hover:bg-teal-500/[0.02] transition-colors">
                  {/* Title */}
                  <td className="px-5 py-3.5 border-b border-teal-500/[0.05] max-w-[220px]">
                    <p className="text-[13.5px] font-medium text-teal-100 truncate" title={blog.title}>{blog.title}</p>
                    {blog.read_time && <p className="text-[11px] text-teal-800 mt-0.5">{blog.read_time}</p>}
                  </td>

                  {/* Category */}
                  <td className="px-5 py-3.5 border-b border-teal-500/[0.05]">
                    {blog.category
                      ? <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-500/10 text-teal-300">{blog.category}</span>
                      : <span className="text-teal-800 text-sm">—</span>}
                  </td>

                  {/* Author */}
                  <td className="px-5 py-3.5 border-b border-teal-500/[0.05]">
                    <p className="text-[13px] text-teal-400 truncate max-w-[120px]">{blog.author || '—'}</p>
                    {blog.author_role && <p className="text-[11px] text-teal-700 mt-0.5 truncate">{blog.author_role}</p>}
                  </td>

                  {/* Publish toggle */}
                  <td className="px-5 py-3.5 border-b border-teal-500/[0.05]">
                    <button onClick={() => toggle(blog, 'published')}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition-all ${blog.published ? 'bg-teal-500/10 text-teal-300 hover:bg-teal-500/20' : 'bg-teal-900/20 text-teal-700 hover:bg-teal-900/30'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${blog.published ? 'bg-teal-400' : 'bg-teal-800'}`}/>
                      {blog.published ? 'Published' : 'Draft'}
                    </button>
                  </td>

                  {/* Featured */}
                  <td className="px-5 py-3.5 border-b border-teal-500/[0.05]">
                    <button onClick={() => toggle(blog, 'is_featured')}
                      className={`text-lg transition-all hover:scale-110 ${blog.is_featured ? 'opacity-100' : 'opacity-15 hover:opacity-40'}`}
                      title={blog.is_featured ? 'Remove featured' : 'Mark featured'}>
                      ⭐
                    </button>
                  </td>

                  {/* Date */}
                  <td className="px-5 py-3.5 border-b border-teal-500/[0.05]">
                    <span className="text-[12px] text-teal-700">
                      {new Date(blog.created_at).toLocaleDateString('en-IN')}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-3.5 border-b border-teal-500/[0.05]">
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => setBuilderMode(blog)}
                        className="text-[11px] text-cyan-400/70 border border-cyan-500/20 hover:border-cyan-400/50 hover:text-cyan-300 hover:bg-cyan-500/[0.05] px-2.5 py-1.5 rounded-lg transition-all font-semibold"
                        title="Edit in Blog Builder">
                        ✦ Edit
                      </button>
                      <button onClick={() => handleDelete(blog.id)} disabled={deleting === blog.id}
                        className="text-[11px] text-red-400/50 border border-red-500/20 hover:border-red-500/40 hover:text-red-300 px-2.5 py-1.5 rounded-lg transition-all disabled:opacity-30">
                        {deleting === blog.id ? '…' : 'Del'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}