'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// ─── Featured card (dark teal background) ─────────────────────────────────────
const FeaturedBlog = ({ blog }) => (
  <div className="bg-teal-800 rounded-2xl p-8 relative overflow-hidden flex flex-col justify-end min-h-[380px]">
    <div className="absolute -top-10 -right-10 w-56 h-56 rounded-full bg-white/5 pointer-events-none" />
    <div className="absolute top-8 right-16 w-24 h-24 rounded-full bg-white/[0.04]" />

    {blog.category && (
      <span className="inline-block bg-teal-700/60 text-teal-200 text-[11px] font-bold px-3 py-1 rounded-full mb-4 w-fit">
        {blog.category}
      </span>
    )}

    <h3 className="text-white text-2xl font-extrabold leading-snug mb-3">{blog.title}</h3>
    <p className="text-white/70 text-sm leading-relaxed mb-6">{blog.excerpt}</p>

    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-xs">
          {blog.author?.charAt(0) ?? '?'}
        </div>
        <div>
          <div className="text-white text-sm font-semibold">{blog.author}</div>
          <div className="text-white/55 text-[11px]">
            {new Date(blog.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            {blog.read_time && ` · ${blog.read_time}`}
          </div>
        </div>
      </div>
      <Link
        href={`/blogs/${blog.id}`}
        className="bg-white text-teal-800 text-sm font-bold px-5 py-2.5 rounded-xl no-underline whitespace-nowrap hover:bg-teal-50 transition-colors duration-200"
      >
        Read →
      </Link>
    </div>
  </div>
);

// ─── Regular card ─────────────────────────────────────────────────────────────
const ACCENT_COLORS = [
  { bg: 'bg-red-500',    catBg: 'bg-red-50',     catText: 'text-red-500',    authorBg: 'bg-red-500'    },
  { bg: 'bg-violet-600', catBg: 'bg-violet-50',   catText: 'text-violet-600', authorBg: 'bg-violet-600' },
  { bg: 'bg-cyan-700',   catBg: 'bg-cyan-50',     catText: 'text-cyan-700',   authorBg: 'bg-cyan-700'   },
  { bg: 'bg-amber-500',  catBg: 'bg-amber-50',    catText: 'text-amber-600',  authorBg: 'bg-amber-600'  },
];

const BlogCard = ({ blog, index }) => {
  const palette = ACCENT_COLORS[index % ACCENT_COLORS.length];
  return (
    <div className="bg-white rounded-2xl border border-teal-100 overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(15,92,92,0.12)] hover:border-teal-700">
      <div className={`h-1 ${palette.bg}`} />
      <div className="p-5 flex flex-col flex-1">
        {blog.category && (
          <span className={`inline-block ${palette.catBg} ${palette.catText} text-[10px] font-bold px-2.5 py-1 rounded-full mb-3 w-fit tracking-wide`}>
            {blog.category}
          </span>
        )}
        <h3 className="text-teal-950 text-[15px] font-bold leading-snug mb-2.5">{blog.title}</h3>
        <p className="text-gray-500 text-[13px] leading-relaxed mb-4 flex-1">{blog.excerpt}</p>

        <div className="border-t border-gray-100 pt-3.5 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full ${palette.authorBg} flex items-center justify-center text-white font-bold text-[11px]`}>
              {blog.author?.charAt(0) ?? '?'}
            </div>
            <div>
              <div className="text-[12px] font-semibold text-gray-700">{blog.author}</div>
              <div className="text-[10px] text-gray-400">
                {new Date(blog.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                {blog.read_time && ` · ${blog.read_time}`}
              </div>
            </div>
          </div>
          <Link
            href={`/blogs/${blog.id}`}
            className="text-teal-800 text-[12px] font-bold no-underline hover:text-teal-600 transition-colors duration-200"
          >
            Read →
          </Link>
        </div>
      </div>
    </div>
  );
};

// ─── Section skeleton ─────────────────────────────────────────────────────────
const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-teal-100/60 rounded-2xl ${className}`} />
);

// ─── Main export ──────────────────────────────────────────────────────────────
export default function Blogs() {
  const [blogs, setBlogs]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res  = await fetch(`${API}/blogs`);
        const data = await res.json();
        setBlogs(Array.isArray(data) ? data.slice(0, 4) : []);
      } catch (err) {
        console.error('Failed to fetch blogs', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const featured = blogs.find((b) => b.is_featured) ?? blogs[0] ?? null;
  const rest      = blogs.filter((b) => b.id !== featured?.id).slice(0, 3);

  return (
    <section className="bg-teal-50/60 py-20 px-2">
      <div className="max-w-[1280px] mx-auto">

        {/* Header */}
        <div className="flex justify-between items-end mb-10 flex-wrap gap-4">
          <div>
            <p className="text-teal-700 text-[11px] font-bold tracking-[0.14em] uppercase mb-2">Health Reads</p>
            <h2 className="text-teal-950 text-4xl font-extrabold m-0 leading-tight">From Our Medical Blog</h2>
          </div>
          <Link
            href="/blogs"
            className="text-teal-800 text-sm font-bold no-underline flex items-center gap-1 border-[1.5px] border-teal-800 px-5 py-2.5 rounded-xl whitespace-nowrap hover:bg-teal-800 hover:text-white transition-all duration-200"
          >
            View All Posts →
          </Link>
        </div>

        {/* Layout */}
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="min-h-[380px]" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-52" />)}
            </div>
          </div>
        ) : blogs.length === 0 ? (
          <div className="py-16 text-center text-teal-700/40 text-sm">No blog posts published yet.</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {featured && <FeaturedBlog blog={featured} />}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {rest.map((b, i) => <BlogCard key={b.id} blog={b} index={i} />)}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}