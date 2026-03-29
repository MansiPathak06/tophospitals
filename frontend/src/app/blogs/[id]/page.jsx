'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// ── Skeleton ──────────────────────────────────────────────────────────────────
const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-teal-100/60 rounded-xl ${className}`} />
);

// ── Table of Contents ─────────────────────────────────────────────────────────
const TableOfContents = ({ headings }) => {
  const [active, setActive] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );
    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [headings]);

  if (!headings.length) return null;

  return (
    <div className="bg-teal-50 border border-teal-100 rounded-2xl p-5 sticky top-24">
      <p className="text-teal-800 text-[11px] font-bold tracking-widest uppercase mb-4">
        📋 Table of Contents
      </p>
      <ul className="space-y-2">
        {headings.map(({ id, text, level }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className={`block text-[13px] leading-snug transition-colors duration-150 py-0.5 border-l-2 pl-3 ${
                active === id
                  ? 'border-teal-600 text-teal-700 font-semibold'
                  : 'border-transparent text-gray-500 hover:text-teal-600 hover:border-teal-300'
              } ${level === 3 ? 'pl-6' : ''}`}
            >
              {text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

// ── Render rich HTML content from DB ─────────────────────────────────────────
const BlogContent = ({ html }) => {
  if (!html) return null;
  return (
    <div
      className="
        prose prose-teal max-w-none
        prose-headings:font-extrabold prose-headings:text-teal-900 prose-headings:leading-tight
        prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
        prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
        prose-p:text-gray-700 prose-p:leading-relaxed prose-p:text-[15px]
        prose-a:text-teal-600 prose-a:font-medium hover:prose-a:text-teal-800
        prose-strong:text-teal-900
        prose-ul:my-5 prose-ol:my-5
        prose-li:text-gray-700 prose-li:text-[15px] prose-li:leading-relaxed
        prose-li:marker:text-teal-500
        prose-img:rounded-2xl prose-img:shadow-lg prose-img:my-8
        prose-blockquote:border-l-4 prose-blockquote:border-teal-400
        prose-blockquote:bg-teal-50 prose-blockquote:rounded-r-xl prose-blockquote:py-2 prose-blockquote:px-5
        prose-blockquote:text-teal-800 prose-blockquote:not-italic
        prose-code:bg-teal-50 prose-code:text-teal-700 prose-code:rounded prose-code:px-1.5 prose-code:py-0.5
        prose-pre:bg-teal-950 prose-pre:text-teal-100 prose-pre:rounded-2xl
        prose-hr:border-teal-100 prose-hr:my-10
      "
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

// ── Related Blog Card ─────────────────────────────────────────────────────────
const RelatedCard = ({ blog }) => (
  <Link href={`/blogs/${blog.id}`} className="group block bg-white rounded-2xl border border-teal-100 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
    <div className="h-40 bg-teal-100 overflow-hidden relative">
      {blog.image_url ? (
        <img src={blog.image_url} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-teal-700 to-teal-400 flex items-center justify-center">
          <span className="text-white text-3xl">📝</span>
        </div>
      )}
      {blog.category && (
        <span className="absolute top-3 left-3 bg-white/90 text-teal-700 text-[10px] font-bold px-2.5 py-1 rounded-full">
          {blog.category}
        </span>
      )}
    </div>
    <div className="p-4">
      <h4 className="text-teal-900 font-bold text-sm leading-snug mb-2 group-hover:text-teal-600 transition-colors">{blog.title}</h4>
      <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">{blog.excerpt}</p>
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
        <span className="text-teal-800 text-[11px] font-semibold">{blog.author}</span>
        {blog.read_time && <span className="text-gray-400 text-[10px]">⏱ {blog.read_time}</span>}
      </div>
    </div>
  </Link>
);

// ── Extract headings for TOC ──────────────────────────────────────────────────
function extractHeadings(html) {
  if (!html || typeof window === 'undefined') return [];
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const nodes = doc.querySelectorAll('h2, h3');
  return Array.from(nodes).map((el, i) => {
    const id = el.id || `heading-${i}`;
    el.id = id;
    return { id, text: el.textContent, level: parseInt(el.tagName[1]) };
  });
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function BlogDetailPage({ params }) {
  const { id } = use(params);
  const [blog, setBlog]         = useState(null);
  const [related, setRelated]   = useState([]);
  const [headings, setHeadings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      try {
        const res  = await fetch(`${API}/blogs/${id}`);
        if (!res.ok) { setNotFound(true); return; }
        const data = await res.json();
        setBlog(data);
        setHeadings(extractHeadings(data.content));

        // Fetch related (same category)
        const relRes  = await fetch(`${API}/blogs${data.category ? `?category=${encodeURIComponent(data.category)}` : ''}`);
        const relData = await relRes.json();
        setRelated((Array.isArray(relData) ? relData : []).filter((b) => b.id !== data.id).slice(0, 3));
      } catch (err) {
        console.error(err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  // ── Loading state ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-white">
          <Skeleton className="h-[420px] w-full rounded-none" />
          <div className="max-w-[1280px] mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12">
            <div className="space-y-4">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="mt-8 space-y-3">
                {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-4 w-full" />)}
              </div>
            </div>
            <div><Skeleton className="h-64 w-full" /></div>
          </div>
        </div>
      </>
    );
  }

  // ── Not found ─────────────────────────────────────────────────────────────
  if (notFound || !blog) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
          <p className="text-6xl">📭</p>
          <h1 className="text-2xl font-bold text-teal-900">Blog not found</h1>
          <p className="text-gray-500 text-sm">The article you're looking for doesn't exist or has been removed.</p>
          <Link href="/blogs" className="mt-4 bg-teal-700 text-white font-semibold px-6 py-3 rounded-full text-sm hover:bg-teal-800 transition-colors">
            ← Back to Blog
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white">

        {/* ── Hero Banner ── */}
        <div className="relative w-full h-[420px] md:h-[500px] overflow-hidden bg-teal-900">
          {blog.image_url ? (
            <img
              src={blog.image_url}
              alt={blog.title}
              className="w-full h-full object-cover opacity-60"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-teal-900 via-teal-700 to-teal-500" />
          )}

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-teal-950 via-teal-950/60 to-transparent" />

          {/* Breadcrumb */}
          <div className="absolute top-6 left-6 flex items-center gap-2 text-white/70 text-xs font-medium">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/blogs" className="hover:text-white transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-white/50 truncate max-w-[200px]">{blog.title}</span>
          </div>

          {/* Hero content */}
          <div className="absolute bottom-0 left-0 right-0 px-6 pb-10 max-w-[860px] mx-auto">
            {blog.category && (
              <span className="inline-block bg-teal-400/20 border border-teal-400/40 text-teal-200 text-[11px] font-bold px-3 py-1 rounded-full mb-4 tracking-wider uppercase">
                {blog.category}
              </span>
            )}
            <h1 className="text-white text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-4 drop-shadow-lg">
              {blog.title}
            </h1>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-teal-500/40 border-2 border-teal-300/40 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {blog.author?.charAt(0) ?? '?'}
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{blog.author}</p>
                  {blog.author_role && <p className="text-white/60 text-xs">{blog.author_role}</p>}
                </div>
              </div>
              <div className="flex items-center gap-4 text-white/60 text-xs ml-auto">
                <span>
                  📅 {new Date(blog.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'long', year: 'numeric',
                  })}
                </span>
                {blog.read_time && <span>⏱ {blog.read_time}</span>}
              </div>
            </div>
          </div>
        </div>

        {/* ── Main Layout ── */}
        <div className="max-w-[1280px] mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12">

            {/* ── Article Content ── */}
            <article>
              {/* Excerpt / lead */}
              {blog.excerpt && (
                <p className="text-teal-800 text-lg font-medium leading-relaxed mb-8 pb-8 border-b border-teal-100">
                  {blog.excerpt}
                </p>
              )}

              {/* Main content */}
              <BlogContent html={blog.content} />

              {/* Share row */}
              <div className="mt-12 pt-8 border-t border-teal-100 flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-lg">
                    {blog.author?.charAt(0) ?? '?'}
                  </div>
                  <div>
                    <p className="text-teal-900 font-bold text-sm">{blog.author}</p>
                    {blog.author_role && <p className="text-gray-400 text-xs">{blog.author_role}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-xs mr-2">Share:</span>
                  {[
                    { label: 'Twitter', href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(blog.title)}&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}` },
                    { label: 'WhatsApp', href: `https://wa.me/?text=${encodeURIComponent(blog.title + ' ' + (typeof window !== 'undefined' ? window.location.href : ''))}` },
                    { label: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}` },
                  ].map(({ label, href }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold border border-teal-200 text-teal-700 px-3 py-1.5 rounded-full hover:bg-teal-700 hover:text-white hover:border-teal-700 transition-all duration-150"
                    >
                      {label}
                    </a>
                  ))}
                </div>
              </div>

              {/* Back link */}
              <div className="mt-8">
                <Link
                  href="/blogs"
                  className="inline-flex items-center gap-2 text-teal-700 text-sm font-semibold hover:text-teal-900 transition-colors"
                >
                  ← Back to All Articles
                </Link>
              </div>
            </article>

            {/* ── Sidebar ── */}
            <aside className="space-y-8">
              {/* Table of Contents */}
              <TableOfContents headings={headings} />

              {/* Tags */}
              {blog.category && (
                <div className="bg-white border border-teal-100 rounded-2xl p-5">
                  <p className="text-teal-800 text-[11px] font-bold tracking-widest uppercase mb-3">🏷️ Category</p>
                  <Link
                    href={`/blogs?category=${encodeURIComponent(blog.category)}`}
                    className="inline-block bg-teal-50 text-teal-700 text-xs font-bold px-3 py-1.5 rounded-full border border-teal-200 hover:bg-teal-700 hover:text-white transition-all"
                  >
                    {blog.category}
                  </Link>
                </div>
              )}

              {/* Newsletter */}
              <div className="bg-teal-800 rounded-2xl p-6 text-center">
                <p className="text-teal-200 text-[11px] font-bold tracking-widest uppercase mb-2">📬 Newsletter</p>
                <h3 className="text-white text-lg font-extrabold leading-tight mb-2">Stay Informed</h3>
                <p className="text-white/60 text-xs leading-relaxed mb-4">Get the latest health articles straight to your inbox.</p>
                <input
                  type="email"
                  placeholder="Your email..."
                  className="w-full bg-teal-700/50 border border-teal-600 text-white placeholder-white/40 text-sm px-4 py-2.5 rounded-xl outline-none focus:border-teal-300 transition-colors mb-3"
                />
                <button className="w-full bg-teal-400 hover:bg-teal-300 text-teal-900 text-sm font-bold py-2.5 rounded-xl transition-colors">
                  Subscribe →
                </button>
              </div>
            </aside>
          </div>

          {/* ── Related Articles ── */}
          {related.length > 0 && (
            <div className="mt-16 pt-10 border-t border-teal-100">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-teal-600 text-[11px] font-bold tracking-widest uppercase mb-1">Continue Reading</p>
                  <h2 className="text-teal-900 text-2xl font-extrabold">Related Articles</h2>
                </div>
                <Link href="/blogs" className="text-teal-700 text-sm font-semibold border border-teal-200 px-4 py-2 rounded-full hover:bg-teal-700 hover:text-white transition-all">
                  View All →
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {related.map((b) => <RelatedCard key={b.id} blog={b} />)}
              </div>
            </div>
          )}
        </div>

      </div>
    </>
  );
}