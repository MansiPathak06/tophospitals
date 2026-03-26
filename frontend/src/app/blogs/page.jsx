"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const CATEGORIES = ["All", "Health Tips", "Hospital News", "Nutrition", "Mental Health", "Surgery", "Cardiology", "Neurology", "Orthopaedics"];

// ── Category Badge ─────────────────────────────────────────────────────────────
const Badge = ({ label }) => (
  <span className="bg-[#e6f4f4] text-[#0F5C5C] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
    {label}
  </span>
);

// ── Skeleton loader ────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-[#e6f4f4] overflow-hidden animate-pulse">
    <div className="h-48 bg-[#e6f4f4]" />
    <div className="p-5 space-y-3">
      <div className="h-3 bg-[#e6f4f4] rounded-full w-1/3" />
      <div className="h-4 bg-[#e6f4f4] rounded-full w-full" />
      <div className="h-4 bg-[#e6f4f4] rounded-full w-4/5" />
      <div className="h-3 bg-[#e6f4f4] rounded-full w-2/3 mt-4" />
    </div>
  </div>
);

// ── Featured Blog Card ─────────────────────────────────────────────────────────
const FeaturedCard = ({ blog }) => (
  <div className="group relative bg-white rounded-3xl border border-[#e6f4f4] shadow-md overflow-hidden flex flex-col lg:flex-row hover:shadow-xl transition-shadow duration-300">
    {/* Image */}
    <div className="relative lg:w-1/2 h-64 lg:h-auto bg-[#e6f4f4] flex-shrink-0 overflow-hidden">
      {blog.image_url ? (
        <img
          src={blog.image_url}
          alt={blog.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F5C5C] to-[#2ec4a0] flex items-center justify-center">
          <span className="text-white text-6xl">🏥</span>
        </div>
      )}
      <div className="absolute top-4 left-4">
        <span className="bg-[#2ec4a0] text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
          ⭐ Featured
        </span>
      </div>
    </div>

    {/* Content */}
    <div className="flex flex-col justify-center p-8 lg:p-10">
      {blog.category && <Badge label={blog.category} />}
      <h2 className="text-[#0F5C5C] text-2xl lg:text-3xl font-bold leading-tight mt-3 mb-4">
        {blog.title}
      </h2>
      <p className="text-gray-500 text-sm leading-relaxed mb-6">{blog.excerpt}</p>

      <div className="flex items-center gap-4 mb-6">
        <div className="w-9 h-9 rounded-full bg-[#e6f4f4] flex items-center justify-center text-[#0F5C5C] font-bold text-sm flex-shrink-0">
          {blog.author?.charAt(0) ?? '?'}
        </div>
        <div>
          <p className="text-[#0F5C5C] text-sm font-semibold">{blog.author}</p>
          {blog.author_role && <p className="text-gray-400 text-xs">{blog.author_role}</p>}
        </div>
        <div className="ml-auto flex items-center gap-3 text-gray-400 text-xs">
          <span>📅 {new Date(blog.created_at).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}</span>
          {blog.read_time && <><span>·</span><span>⏱ {blog.read_time}</span></>}
        </div>
      </div>

      <Link
        href={`/blogs/${blog.id}`}
        className="self-start inline-flex items-center gap-2 bg-[#0F5C5C] hover:bg-[#177a7a] text-white text-sm font-semibold px-6 py-3 rounded-full transition-colors duration-200"
      >
        Read Article →
      </Link>
    </div>
  </div>
);

// ── Regular Blog Card ──────────────────────────────────────────────────────────
const BlogCard = ({ blog }) => (
  <div className="group bg-white rounded-2xl border border-[#e6f4f4] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden">
    <div className="relative w-full h-48 bg-[#e6f4f4] flex-shrink-0 overflow-hidden">
      {blog.image_url ? (
        <img
          src={blog.image_url}
          alt={blog.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F5C5C]/80 to-[#2ec4a0]/60 flex items-center justify-center">
          <span className="text-white text-4xl">📝</span>
        </div>
      )}
      {blog.category && (
        <div className="absolute top-3 left-3">
          <Badge label={blog.category} />
        </div>
      )}
    </div>

    <div className="flex flex-col flex-1 p-5">
      <h3 className="text-[#0F5C5C] font-bold text-[15px] leading-snug mb-2 group-hover:text-[#177a7a] transition-colors">
        {blog.title}
      </h3>
      <p className="text-gray-400 text-xs leading-relaxed mb-4 flex-1">{blog.excerpt}</p>

      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#e6f4f4] flex items-center justify-center text-[#0F5C5C] font-bold text-xs flex-shrink-0">
            {blog.author?.charAt(0) ?? '?'}
          </div>
          <span className="text-[#0F5C5C] text-xs font-semibold truncate max-w-[100px]">{blog.author}</span>
        </div>
        {blog.read_time && <span className="text-gray-400 text-[11px]">⏱ {blog.read_time}</span>}
      </div>

      <Link
        href={`/blogs/${blog.id}`}
        className="mt-4 flex items-center justify-center gap-1.5 border-[1.5px] border-[#0F5C5C] text-[#0F5C5C] hover:bg-[#0F5C5C] hover:text-white text-[13px] font-semibold rounded-xl py-2.5 transition-colors duration-200"
      >
        Read More →
      </Link>
    </div>
  </div>
);

// ── Main Blog Page ─────────────────────────────────────────────────────────────
export default function BlogsPage() {
  const [allBlogs, setAllBlogs]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch]             = useState("");
  const [page, setPage]                 = useState(1);
  const PER_PAGE = 6;

  // ── Fetch published blogs from backend ──────────────────────────────────────
  useEffect(() => {
    const fetchBlogs = async () => {
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
    };
    fetchBlogs();
  }, []);

  // Reset page on filter change
  useEffect(() => { setPage(1); }, [activeCategory, search]);

  // ── Derived lists ────────────────────────────────────────────────────────────
  const featured = allBlogs.find((b) => b.is_featured) ?? null;

  const filtered = allBlogs.filter((b) => {
    const matchCat    = activeCategory === "All" || b.category === activeCategory;
    const matchSearch = b.title?.toLowerCase().includes(search.toLowerCase()) ||
                        b.excerpt?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch && !b.is_featured; // exclude featured from grid
  });

  const totalPages    = Math.ceil(filtered.length / PER_PAGE);
  const paginated     = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#f4fafa]">

        {/* ── Page Header ── */}
        <div className="bg-white border-b-2 border-[#e6f4f4] px-6 py-10">
          <div className="max-w-[1280px] mx-auto">
            <p className="text-[#0F5C5C] text-[11px] font-bold tracking-widest uppercase mb-2">Our Blog</p>
            <div className="flex items-end justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-[#0F5C5C] text-3xl md:text-4xl font-bold mb-1">
                  Health Articles & Insights
                </h1>
                <p className="text-[#0F5C5C]/50 text-sm">
                  Expert advice, hospital news, and wellness tips — all in one place.
                </p>
              </div>
              {/* Search */}
              <div className="flex items-center bg-[#f4fafa] border border-[#e6f4f4] rounded-full overflow-hidden px-4 py-2.5 gap-2 w-full md:w-72">
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
                      ? "bg-[#0F5C5C] text-white border-[#0F5C5C]"
                      : "bg-white text-[#0F5C5C] border-[#e6f4f4] hover:bg-[#0F5C5C] hover:text-white hover:border-[#0F5C5C]"
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
            <div className="mb-12 h-72 bg-white rounded-3xl border border-[#e6f4f4] animate-pulse" />
          ) : featured ? (
            <div className="mb-12">
              <p className="text-[#0F5C5C] text-[11px] font-bold tracking-widest uppercase mb-4">
                ⭐ Featured Article
              </p>
              <FeaturedCard blog={featured} />
            </div>
          ) : null}

          {/* Latest Articles */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <p className="text-[#0F5C5C] text-[11px] font-bold tracking-widest uppercase">
                📰 Latest Articles
              </p>
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
                {paginated.map((blog) => (
                  <BlogCard key={blog.id} blog={blog} />
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
                className="px-5 py-2 rounded-full border-[1.5px] border-[#0F5C5C] text-[#0F5C5C] text-sm font-semibold disabled:opacity-30 hover:bg-[#0F5C5C] hover:text-white transition-all"
              >
                ← Prev
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-9 h-9 rounded-full text-sm font-semibold border-[1.5px] transition-all ${
                    page === i + 1
                      ? 'bg-[#0F5C5C] text-white border-[#0F5C5C]'
                      : 'border-[#e6f4f4] text-[#0F5C5C] hover:bg-[#e6f4f4]'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-5 py-2 rounded-full border-[1.5px] border-[#0F5C5C] text-[#0F5C5C] text-sm font-semibold disabled:opacity-30 hover:bg-[#0F5C5C] hover:text-white transition-all"
              >
                Next →
              </button>
            </div>
          )}

        </div>

        {/* ── Newsletter Banner ── */}
        <div className="bg-[#0F5C5C] mt-10 py-14 px-6">
          <div className="max-w-[600px] mx-auto text-center">
            <p className="text-[#2ec4a0] text-[11px] font-bold tracking-widest uppercase mb-3">Stay Updated</p>
            <h2 className="text-white text-2xl md:text-3xl font-bold mb-3">Get Health Tips in Your Inbox</h2>
            <p className="text-white/60 text-sm mb-6">
              Subscribe to our newsletter for the latest articles, hospital news, and wellness advice.
            </p>
            <div className="flex items-center bg-white rounded-full overflow-hidden shadow-lg max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email..."
                className="flex-1 px-5 py-3.5 text-sm text-gray-700 placeholder-gray-400 outline-none"
              />
              <button className="bg-[#2ec4a0] hover:bg-[#25a98a] text-white text-sm font-semibold px-6 py-3.5 rounded-full m-1 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}