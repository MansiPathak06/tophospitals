"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const CATEGORIES = [
  "All", "Health Tips", "Hospital News", "Nutrition",
  "Mental Health", "Surgery", "Cardiology", "Neurology", "Orthopaedics",
];

const ACCENTS = [
  { bar: 'bg-red-500',    cat: 'bg-red-50 text-red-500',       dot: 'bg-red-500'    },
  { bar: 'bg-violet-600', cat: 'bg-violet-50 text-violet-600',  dot: 'bg-violet-600' },
  { bar: 'bg-amber-500',  cat: 'bg-amber-50 text-amber-600',    dot: 'bg-amber-500'  },
  { bar: 'bg-cyan-600',   cat: 'bg-cyan-50 text-cyan-700',      dot: 'bg-cyan-600'   },
  { bar: 'bg-rose-500',   cat: 'bg-rose-50 text-rose-500',      dot: 'bg-rose-500'   },
  { bar: 'bg-emerald-600',cat: 'bg-emerald-50 text-emerald-700',dot: 'bg-emerald-600'},
];

// ── Category Badge ─────────────────────────────────────────────────────────────
const Badge = ({ label, className = '' }) => (
  <span className={`bg-teal-50 text-teal-700 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${className}`}>
    {label}
  </span>
);

// ── Skeleton loader ────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-teal-100 overflow-hidden animate-pulse">
    <div className="h-1 bg-teal-100" />
    <div className="h-44 bg-teal-50" />
    <div className="p-5 space-y-3">
      <div className="h-3 bg-teal-50 rounded-full w-1/3" />
      <div className="h-4 bg-teal-50 rounded-full w-full" />
      <div className="h-4 bg-teal-50 rounded-full w-4/5" />
      <div className="h-3 bg-teal-50 rounded-full w-2/3 mt-4" />
    </div>
  </div>
);

// ── Featured Blog Card ─────────────────────────────────────────────────────────
const FeaturedCard = ({ blog }) => (
  <div className="group relative bg-teal-800 rounded-3xl overflow-hidden flex flex-col lg:flex-row min-h-[360px] shadow-xl hover:shadow-2xl transition-shadow duration-300">
    {/* Image */}
    <div className="relative lg:w-[45%] h-64 lg:h-auto bg-teal-900 flex-shrink-0 overflow-hidden">
      {blog.image_url ? (
        <img
          src={blog.image_url}
          alt={blog.title}
          className="w-full h-full object-cover opacity-60 group-hover:opacity-75 group-hover:scale-105 transition-all duration-700"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-teal-900 to-teal-600 flex items-center justify-center">
          <span className="text-white text-6xl">🏥</span>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-teal-800/60 hidden lg:block" />
      <div className="absolute top-4 left-4">
        <span className="bg-teal-400/20 border border-teal-300/40 text-teal-200 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
          ⭐ Featured
        </span>
      </div>
    </div>

    {/* Content */}
    <div className="flex flex-col justify-center p-8 lg:p-10">
      {blog.category && (
        <span className="inline-block bg-teal-700/60 text-teal-200 text-[10px] font-bold px-3 py-1 rounded-full mb-3 w-fit">
          {blog.category}
        </span>
      )}
      <h2 className="text-white text-2xl lg:text-3xl font-extrabold leading-tight mb-3 drop-shadow">
        {blog.title}
      </h2>
      <p className="text-white/65 text-sm leading-relaxed mb-6">{blog.excerpt}</p>

      <div className="flex items-center gap-4 mb-7">
        <div className="w-10 h-10 rounded-full bg-teal-500/30 border border-teal-300/30 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          {blog.author?.charAt(0) ?? '?'}
        </div>
        <div>
          <p className="text-white text-sm font-semibold">{blog.author}</p>
          {blog.author_role && <p className="text-white/50 text-xs">{blog.author_role}</p>}
        </div>
        <div className="ml-auto flex items-center gap-3 text-white/50 text-xs">
          <span>📅 {new Date(blog.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          {blog.read_time && <><span>·</span><span>⏱ {blog.read_time}</span></>}
        </div>
      </div>

      <Link
        href={`/blogs/${blog.id}`}
        className="self-start inline-flex items-center gap-2 bg-white hover:bg-teal-50 text-teal-800 text-sm font-bold px-6 py-3 rounded-xl transition-colors duration-200"
      >
        Read Article →
      </Link>
    </div>
  </div>
);

// ── Regular Blog Card ──────────────────────────────────────────────────────────
const BlogCard = ({ blog, index }) => {
  const acc = ACCENTS[index % ACCENTS.length];
  return (
    <div className="group bg-white rounded-2xl border border-teal-100 overflow-hidden flex flex-col hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(15,92,92,0.12)] hover:border-teal-300 transition-all duration-200">
      <div className={`h-1 ${acc.bar}`} />
      <div className="relative h-48 bg-teal-50 overflow-hidden">
        {blog.image_url ? (
          <img
            src={blog.image_url}
            alt={blog.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-teal-700/80 to-teal-400/60 flex items-center justify-center">
            <span className="text-white text-4xl">📝</span>
          </div>
        )}
        {blog.category && (
          <div className="absolute top-3 left-3">
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${acc.cat}`}>
              {blog.category}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-5">
        <h3 className="text-teal-950 font-bold text-[15px] leading-snug mb-2 group-hover:text-teal-600 transition-colors line-clamp-2">
          {blog.title}
        </h3>
        <p className="text-gray-400 text-xs leading-relaxed mb-4 flex-1 line-clamp-3">{blog.excerpt}</p>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full ${acc.dot} flex items-center justify-center text-white font-bold text-xs flex-shrink-0`}>
              {blog.author?.charAt(0) ?? '?'}
            </div>
            <div>
              <span className="text-gray-700 text-[12px] font-semibold block truncate max-w-[110px]">{blog.author}</span>
              <span className="text-gray-400 text-[10px]">
                {new Date(blog.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>
          </div>
          {blog.read_time && <span className="text-gray-400 text-[11px]">⏱ {blog.read_time}</span>}
        </div>

        <Link
          href={`/blogs/${blog.id}`}
          className="mt-4 flex items-center justify-center gap-1.5 border-[1.5px] border-teal-700 text-teal-700 hover:bg-teal-700 hover:text-white text-[13px] font-semibold rounded-xl py-2.5 transition-colors duration-200"
        >
          Read More →
        </Link>
      </div>
    </div>
  );
};

// ── Main Blog Listing Page ─────────────────────────────────────────────────────
export default function BlogsPage() {
  const [allBlogs, setAllBlogs]             = useState([]);
  const [loading, setLoading]               = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch]                 = useState("");
  const [page, setPage]                     = useState(1);
  const PER_PAGE = 6;

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res  = await fetch(`${API}/blogs`);
        const data = await res.json();
        setAllBlogs(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch blogs', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => { setPage(1); }, [activeCategory, search]);

  const featured = allBlogs.find((b) => b.is_featured) ?? null;

  const filtered = allBlogs.filter((b) => {
    const matchCat    = activeCategory === "All" || b.category === activeCategory;
    const matchSearch = b.title?.toLowerCase().includes(search.toLowerCase()) ||
                        b.excerpt?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch && !b.is_featured;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-teal-50/50 to-white">

        {/* ── Page Header ── */}
        <div className="bg-white border-b-2 border-teal-100 px-6 py-10">
          <div className="max-w-[1280px] mx-auto">
            <p className="text-teal-600 text-[11px] font-bold tracking-widest uppercase mb-2">Our Blog</p>
            <div className="flex items-end justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-teal-950 text-3xl md:text-4xl font-extrabold mb-1">
                  Health Articles & Insights
                </h1>
                <p className="text-gray-400 text-sm">
                  Expert advice, hospital news, and wellness tips — all in one place.
                </p>
              </div>
              {/* Search */}
              <div className="flex items-center bg-teal-50 border border-teal-100 rounded-full overflow-hidden px-4 py-2.5 gap-2 w-full md:w-72">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0F5C5C" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-gray-600 placeholder-gray-400 outline-none"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 flex-wrap mt-6">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`text-xs font-semibold px-4 py-2 rounded-full border transition-all duration-200 ${
                    cat === activeCategory
                      ? "bg-teal-700 text-white border-teal-700"
                      : "bg-white text-teal-700 border-teal-100 hover:bg-teal-700 hover:text-white hover:border-teal-700"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Content ── */}
        <div className="max-w-[1280px] mx-auto px-6 py-10">

          {/* Featured */}
          {loading ? (
            <div className="mb-12 h-80 bg-white rounded-3xl border border-teal-100 animate-pulse" />
          ) : featured ? (
            <div className="mb-12">
              <p className="text-teal-600 text-[11px] font-bold tracking-widest uppercase mb-4">⭐ Featured Article</p>
              <FeaturedCard blog={featured} />
            </div>
          ) : null}

          {/* Latest Articles */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <p className="text-teal-700 text-[11px] font-bold tracking-widest uppercase">📰 Latest Articles</p>
              {!loading && (
                <span className="text-gray-400 text-xs">{filtered.length} article{filtered.length !== 1 ? 's' : ''}</span>
              )}
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : paginated.length === 0 ? (
              <div className="py-20 text-center">
                <p className="text-4xl mb-3">📭</p>
                <p className="text-gray-400 text-sm">No articles found. Try a different filter or search term.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginated.map((blog, i) => (
                  <BlogCard key={blog.id} blog={blog} index={i} />
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-12">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-5 py-2 rounded-full border-[1.5px] border-teal-700 text-teal-700 text-sm font-semibold disabled:opacity-30 hover:bg-teal-700 hover:text-white transition-all"
              >
                ← Prev
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-9 h-9 rounded-full text-sm font-semibold border-[1.5px] transition-all ${
                    page === i + 1
                      ? 'bg-teal-700 text-white border-teal-700'
                      : 'border-teal-100 text-teal-700 hover:bg-teal-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-5 py-2 rounded-full border-[1.5px] border-teal-700 text-teal-700 text-sm font-semibold disabled:opacity-30 hover:bg-teal-700 hover:text-white transition-all"
              >
                Next →
              </button>
            </div>
          )}
        </div>

        {/* ── Newsletter Banner ── */}
        <div className="bg-teal-800 mt-10 py-14 px-6">
          <div className="max-w-[600px] mx-auto text-center">
            <p className="text-teal-300 text-[11px] font-bold tracking-widest uppercase mb-3">Stay Updated</p>
            <h2 className="text-white text-2xl md:text-3xl font-extrabold mb-3">
              Get Health Tips in Your Inbox
            </h2>
            <p className="text-white/60 text-sm mb-6">
              Subscribe to our newsletter for the latest articles, hospital news, and wellness advice.
            </p>
            <div className="flex items-center bg-white rounded-full overflow-hidden shadow-lg max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email..."
                className="flex-1 px-5 py-3.5 text-sm text-gray-700 placeholder-gray-400 outline-none"
              />
              <button className="bg-teal-500 hover:bg-teal-400 text-white text-sm font-bold px-6 py-3.5 rounded-full m-1 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}