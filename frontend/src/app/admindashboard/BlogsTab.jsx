'use client';

import { useState, useEffect, useCallback } from 'react';

const API = 'http://localhost:5000/api';

function authHeaders(token) {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
}

// ─── Modal (copy of existing pattern) ─────────────────────────────────────────
function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    const fn = (e) => e.key === 'Escape' && onClose();
    if (open) window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-[560px] mx-4 bg-[#0d1425] border border-white/10 rounded-2xl p-8 shadow-2xl shadow-black/50 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-slate-100">{title}</h3>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-300 hover:bg-white/5 rounded-lg px-2 py-1 text-sm transition-all"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function MField({ label, children }) {
  return (
    <div className="mb-3.5">
      <label className="block text-[11.5px] font-medium text-slate-500 mb-1.5 uppercase tracking-wide">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  'w-full bg-white/[0.03] border border-white/8 rounded-[10px] px-3.5 py-2.5 text-slate-200 text-[13.5px] placeholder:text-slate-600 outline-none transition-all focus:border-indigo-500/50 focus:bg-indigo-500/[0.04] focus:ring-2 focus:ring-indigo-500/10';

const textareaCls = inputCls + ' resize-y min-h-[80px]';

const CATEGORIES = ['Health Tips', 'Hospital News', 'Nutrition', 'Mental Health', 'Surgery', 'Cardiology', 'Neurology', 'Orthopaedics'];

const EMPTY_FORM = {
  title: '', excerpt: '', content: '', category: '',
  author: '', author_role: '', image_url: '', read_time: '',
  is_featured: false, published: true,
};

export default function BlogsTab({ token, showToast }) {
  const [blogs, setBlogs]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [modal, setModal]         = useState(false);        // add/edit modal
  const [editBlog, setEditBlog]   = useState(null);         // null = add mode
  const [form, setForm]           = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting]   = useState(null);

  // ── Fetch ────────────────────────────────────────────────────────────────────
  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/blogs/admin/all`, { headers: authHeaders(token) });
      const data = await res.json();
      setBlogs(Array.isArray(data) ? data : []);
    } catch {
      showToast('Failed to fetch blogs', 'error');
    } finally {
      setLoading(false);
    }
  }, [token, showToast]);

  useEffect(() => { if (token) fetchBlogs(); }, [token, fetchBlogs]);

  // ── Open modal ───────────────────────────────────────────────────────────────
  const openAdd = () => {
    setEditBlog(null);
    setForm(EMPTY_FORM);
    setModal(true);
  };

  const openEdit = (blog) => {
    setEditBlog(blog);
    setForm({
      title:       blog.title       ?? '',
      excerpt:     blog.excerpt     ?? '',
      content:     blog.content     ?? '',
      category:    blog.category    ?? '',
      author:      blog.author      ?? '',
      author_role: blog.author_role ?? '',
      image_url:   blog.image_url   ?? '',
      read_time:   blog.read_time   ?? '',
      is_featured: blog.is_featured ?? false,
      published:   blog.published   ?? true,
    });
    setModal(true);
  };

  const closeModal = () => { setModal(false); setEditBlog(null); };

  // ── Field helper ─────────────────────────────────────────────────────────────
  const set = (field) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((p) => ({ ...p, [field]: val }));
  };

  // ── Submit ───────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { showToast('Title is required', 'error'); return; }
    setSubmitting(true);
    try {
      const url    = editBlog ? `${API}/blogs/${editBlog.id}` : `${API}/blogs`;
      const method = editBlog ? 'PUT' : 'POST';
      const res    = await fetch(url, {
        method,
        headers: authHeaders(token),
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      closeModal();
      await fetchBlogs();
      showToast(editBlog ? 'Blog updated successfully' : 'Blog created successfully');
    } catch {
      showToast('Failed to save blog', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Delete ───────────────────────────────────────────────────────────────────
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

  // ── Toggle publish ────────────────────────────────────────────────────────────
  const togglePublish = async (blog) => {
    try {
      await fetch(`${API}/blogs/${blog.id}`, {
        method:  'PUT',
        headers: authHeaders(token),
        body:    JSON.stringify({ published: !blog.published }),
      });
      await fetchBlogs();
      showToast(blog.published ? 'Blog unpublished' : 'Blog published');
    } catch {
      showToast('Failed to update blog', 'error');
    }
  };

  // ── Toggle featured ───────────────────────────────────────────────────────────
  const toggleFeatured = async (blog) => {
    try {
      await fetch(`${API}/blogs/${blog.id}`, {
        method:  'PUT',
        headers: authHeaders(token),
        body:    JSON.stringify({ is_featured: !blog.is_featured }),
      });
      await fetchBlogs();
      showToast(blog.is_featured ? 'Removed from featured' : 'Marked as featured');
    } catch {
      showToast('Failed to update blog', 'error');
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-7">
        <div>
          <h2 className="text-[26px] font-semibold text-slate-100 tracking-tight">Blog Posts</h2>
          <p className="text-[13px] text-slate-500 mt-1">
            Create and manage health articles shown on the website.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-emerald-600 text-white text-[13.5px] font-semibold shadow-lg shadow-indigo-500/20 hover:opacity-90 transition-all"
        >
          + New Post
        </button>
      </div>

      {/* Table */}
      <div className="bg-[#0d1425] border border-white/[0.07] rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-white/[0.015]">
              {['Title', 'Category', 'Author', 'Status', 'Featured', 'Date', 'Actions'].map((h) => (
                <th
                  key={h}
                  className="px-5 py-2.5 text-left text-[11px] uppercase tracking-wider text-slate-600 font-semibold border-b border-white/[0.05]"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-slate-600 text-sm">
                  Loading…
                </td>
              </tr>
            ) : blogs.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <div className="py-12 text-center">
                    <div className="text-3xl opacity-30 mb-2">📝</div>
                    <p className="text-[13.5px] text-slate-600">No blog posts yet. Create your first one.</p>
                  </div>
                </td>
              </tr>
            ) : (
              blogs.map((blog) => (
                <tr key={blog.id} className="hover:bg-white/[0.015] transition-colors">
                  {/* Title */}
                  <td className="px-5 py-3.5 border-b border-white/[0.04] max-w-[220px]">
                    <p className="text-[13.5px] font-medium text-slate-200 truncate" title={blog.title}>
                      {blog.title}
                    </p>
                    {blog.read_time && (
                      <p className="text-[11px] text-slate-600 mt-0.5">{blog.read_time}</p>
                    )}
                  </td>

                  {/* Category */}
                  <td className="px-5 py-3.5 border-b border-white/[0.04]">
                    {blog.category ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-300">
                        {blog.category}
                      </span>
                    ) : (
                      <span className="text-[13px] text-slate-600">—</span>
                    )}
                  </td>

                  {/* Author */}
                  <td className="px-5 py-3.5 border-b border-white/[0.04]">
                    <p className="text-[13px] text-slate-400 truncate max-w-[130px]">{blog.author || '—'}</p>
                    {blog.author_role && (
                      <p className="text-[11px] text-slate-600 mt-0.5 truncate">{blog.author_role}</p>
                    )}
                  </td>

                  {/* Published toggle */}
                  <td className="px-5 py-3.5 border-b border-white/[0.04]">
                    <button
                      onClick={() => togglePublish(blog)}
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-all ${
                        blog.published
                          ? 'bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20'
                          : 'bg-slate-500/10 text-slate-400 hover:bg-slate-500/20'
                      }`}
                    >
                      {blog.published ? '● Published' : '○ Draft'}
                    </button>
                  </td>

                  {/* Featured toggle */}
                  <td className="px-5 py-3.5 border-b border-white/[0.04]">
                    <button
                      onClick={() => toggleFeatured(blog)}
                      className={`text-[18px] transition-all hover:scale-110 ${
                        blog.is_featured ? 'opacity-100' : 'opacity-20 hover:opacity-50'
                      }`}
                      title={blog.is_featured ? 'Remove featured' : 'Mark as featured'}
                    >
                      ⭐
                    </button>
                  </td>

                  {/* Date */}
                  <td className="px-5 py-3.5 border-b border-white/[0.04]">
                    <span className="text-[12px] text-slate-600">
                      {new Date(blog.created_at).toLocaleDateString('en-IN')}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-3.5 border-b border-white/[0.04]">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(blog)}
                        className="text-[12px] text-indigo-300/60 border border-indigo-500/20 hover:border-indigo-500/50 hover:text-indigo-300 hover:bg-indigo-500/8 px-3 py-1.5 rounded-lg transition-all"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(blog.id)}
                        disabled={deleting === blog.id}
                        className="text-[12px] text-red-300/60 border border-red-500/20 hover:border-red-500/40 hover:text-red-300 hover:bg-red-500/8 px-3 py-1.5 rounded-lg transition-all disabled:opacity-40"
                      >
                        {deleting === blog.id ? '…' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Add / Edit Modal ── */}
      <Modal
        open={modal}
        onClose={closeModal}
        title={editBlog ? 'Edit Blog Post' : 'New Blog Post'}
      >
        <form onSubmit={handleSubmit}>
          <MField label="Title *">
            <input
              className={inputCls}
              placeholder="e.g. 10 Tips for a Healthy Heart"
              value={form.title}
              onChange={set('title')}
            />
          </MField>

          <MField label="Excerpt (short description)">
            <textarea
              className={textareaCls}
              placeholder="A brief summary shown on the blog card…"
              value={form.excerpt}
              onChange={set('excerpt')}
              rows={2}
            />
          </MField>

          <MField label="Full Content">
            <textarea
              className={textareaCls}
              placeholder="Write the full article content here…"
              value={form.content}
              onChange={set('content')}
              rows={5}
            />
          </MField>

          <div className="grid grid-cols-2 gap-3">
            <MField label="Category">
              <select
                className={inputCls + ' [&>option]:bg-[#0d1425]'}
                value={form.category}
                onChange={set('category')}
              >
                <option value="">— Select —</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </MField>
            <MField label="Read Time">
              <input
                className={inputCls}
                placeholder="e.g. 5 min read"
                value={form.read_time}
                onChange={set('read_time')}
              />
            </MField>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <MField label="Author Name">
              <input
                className={inputCls}
                placeholder="Dr. Priya Sharma"
                value={form.author}
                onChange={set('author')}
              />
            </MField>
            <MField label="Author Role">
              <input
                className={inputCls}
                placeholder="Senior Physician"
                value={form.author_role}
                onChange={set('author_role')}
              />
            </MField>
          </div>

          <MField label="Image URL">
            <input
              className={inputCls}
              placeholder="https://… or /images/blog.jpg"
              value={form.image_url}
              onChange={set('image_url')}
            />
          </MField>

          {/* Toggles */}
          <div className="flex items-center gap-6 mt-1 mb-5">
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <div
                onClick={() => setForm((p) => ({ ...p, published: !p.published }))}
                className={`w-9 h-5 rounded-full relative transition-colors ${
                  form.published ? 'bg-emerald-500' : 'bg-white/10'
                }`}
              >
                <span
                  className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${
                    form.published ? 'left-[18px]' : 'left-0.5'
                  }`}
                />
              </div>
              <span className="text-[13px] text-slate-400">Published</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer group">
              <div
                onClick={() => setForm((p) => ({ ...p, is_featured: !p.is_featured }))}
                className={`w-9 h-5 rounded-full relative transition-colors ${
                  form.is_featured ? 'bg-amber-500' : 'bg-white/10'
                }`}
              >
                <span
                  className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${
                    form.is_featured ? 'left-[18px]' : 'left-0.5'
                  }`}
                />
              </div>
              <span className="text-[13px] text-slate-400">Featured</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-5 border-t border-white/[0.06]">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2.5 rounded-[10px] bg-white/[0.03] border border-white/8 text-slate-500 hover:text-slate-300 text-sm transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-[10px] bg-gradient-to-r from-indigo-600 to-emerald-600 text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-all"
            >
              {submitting ? 'Saving…' : editBlog ? 'Update Post' : 'Create Post'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}