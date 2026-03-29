'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// ─── Featured card (large, dark teal) ────────────────────────────────────────
const FeaturedBlog = ({ blog }) => (
  <div className="group relative bg-teal-800 rounded-2xl overflow-hidden flex flex-col justify-end min-h-[420px] row-span-2 shadow-xl">
    {blog.image_url && (
      <img
        src={blog.image_url}
        alt={blog.title}
        className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-50 group-hover:scale-105 transition-all duration-700"
      />
    )}
    {/* Gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-teal-950 via-teal-900/70 to-transparent" />

    {/* Decorative blobs */}
    <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-teal-500/10 pointer-events-none" />

    <div className="relative p-7 flex flex-col justify-end h-full">
      {/* Featured badge */}
      <span className="inline-block bg-teal-400/20 border border-teal-400/30 text-teal-200 text-[10px] font-bold px-3 py-1 rounded-full mb-3 w-fit tracking-widest uppercase">
        ⭐ Featured
      </span>
      {blog.category && (
        <span className="inline-block bg-teal-700/60 text-teal-200 text-[10px] font-bold px-3 py-1 rounded-full mb-3 w-fit">
          {blog.category}
        </span>
      )}
      <h3 className="text-white text-2xl font-extrabold leading-snug mb-3 drop-shadow">
        {blog.title}
      </h3>
      <p className="text-white/65 text-sm leading-relaxed mb-6 line-clamp-3">{blog.excerpt}</p>

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-teal-400/30 border border-teal-300/30 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {blog.author?.charAt(0) ?? '?'}
          </div>
          <div>
            <div className="text-white text-sm font-semibold">{blog.author}</div>
            <div className="text-white/50 text-[11px]">
              {new Date(blog.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              {blog.read_time && ` · ${blog.read_time}`}
            </div>
          </div>
        </div>
        <Link
          href={`/blogs/${blog.id}`}
          className="bg-white text-teal-800 text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-teal-50 transition-colors duration-200 whitespace-nowrap"
        >
          Read Article →
        </Link>
      </div>
    </div>
  </div>
);

// ─── Accent palette for regular cards ────────────────────────────────────────
const ACCENTS = [
  { bar: 'bg-red-500',    cat: 'bg-red-50 text-red-500',    dot: 'bg-red-500'    },
  { bar: 'bg-violet-600', cat: 'bg-violet-50 text-violet-600', dot: 'bg-violet-600' },
  { bar: 'bg-amber-500',  cat: 'bg-amber-50 text-amber-600',  dot: 'bg-amber-500'  },
  { bar: 'bg-cyan-600',   cat: 'bg-cyan-50 text-cyan-700',    dot: 'bg-cyan-600'   },
];

// ─── Regular blog card ────────────────────────────────────────────────────────
const BlogCard = ({ blog, index }) => {
  const acc = ACCENTS[index % ACCENTS.length];
  return (
    <Link
      href={`/blogs/${blog.id}`}
      className="group bg-white rounded-2xl border border-teal-100 overflow-hidden flex flex-col hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(15,92,92,0.12)] hover:border-teal-300 transition-all duration-200"
    >
      {/* Top accent bar */}
      <div className={`h-1 ${acc.bar}`} />
      {/* Thumbnail */}
      <div className="relative h-40 bg-teal-50 overflow-hidden">
        {blog.image_url ? (
          <img
            src={blog.image_url}
            alt={blog.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-teal-700/80 to-teal-400/60 flex items-center justify-center">
            <span className="text-white text-3xl">📝</span>
          </div>
        )}
        {blog.category && (
          <span className={`absolute top-2.5 left-2.5 text-[10px] font-bold px-2.5 py-1 rounded-full ${acc.cat}`}>
            {blog.category}
          </span>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-teal-950 text-[14px] font-bold leading-snug mb-1.5 group-hover:text-teal-600 transition-colors line-clamp-2">
          {blog.title}
        </h3>
        <p className="text-gray-400 text-xs leading-relaxed mb-3 flex-1 line-clamp-2">{blog.excerpt}</p>
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full ${acc.dot} flex items-center justify-center text-white font-bold text-[10px]`}>
              {blog.author?.charAt(0) ?? '?'}
            </div>
            <span className="text-gray-600 text-[11px] font-semibold truncate max-w-[90px]">{blog.author}</span>
          </div>
          {blog.read_time && <span className="text-gray-400 text-[10px]">⏱ {blog.read_time}</span>}
        </div>
      </div>
    </Link>
  );
};

// ─── Skeleton loaders ─────────────────────────────────────────────────────────
const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-teal-100/60 rounded-2xl ${className}`} />
);

// ─── Main export ──────────────────────────────────────────────────────────────
export default function BlogsHomeSection() {
  const [blogs, setBlogs]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res  = await fetch(`${API}/blogs`);
        const data = await res.json();
        setBlogs(Array.isArray(data) ? data.slice(0, 5) : []);
      } catch (err) {
        console.error('Failed to fetch blogs', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const featured = blogs.find((b) => b.is_featured) ?? blogs[0] ?? null;
  const rest      = blogs.filter((b) => b.id !== featured?.id).slice(0, 4);

  return (
    <section className="bg-gradient-to-b from-teal-50/40 to-white py-20 px-4">
      <div className="max-w-[1280px] mx-auto">

        {/* Header */}
        <div className="flex justify-between items-end mb-10 flex-wrap gap-4">
          <div>
            <p className="text-teal-600 text-[11px] font-bold tracking-[0.16em] uppercase mb-2">🩺 Health Reads</p>
            <h2 className="text-teal-950 text-3xl md:text-4xl font-extrabold leading-tight">
              From Our Medical Blog
            </h2>
            <p className="text-gray-400 text-sm mt-2">Expert advice, wellness tips & hospital news.</p>
          </div>
          <Link
            href="/blogs"
            className="text-teal-800 text-sm font-bold border-[1.5px] border-teal-800 px-5 py-2.5 rounded-xl flex items-center gap-1.5 hover:bg-teal-800 hover:text-white transition-all duration-200 whitespace-nowrap"
          >
            View All Posts →
          </Link>
        </div>

        {/* Grid layout */}
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-5">
            <Skeleton className="min-h-[420px]" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-52" />)}
            </div>
          </div>
        ) : blogs.length === 0 ? (
          <div className="py-16 text-center text-teal-700/40 text-sm">No blog posts published yet.</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-5">
            {/* Featured (left, tall) */}
            {featured && <FeaturedBlog blog={featured} />}

            {/* 4 regular cards (right, 2×2 grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {rest.map((b, i) => <BlogCard key={b.id} blog={b} index={i} />)}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}