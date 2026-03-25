"use client";
import Link from "next/link";
import Navbar from "@/components/Navbar";

// ── Dummy layout data (replace with API fetch later) ──
const CATEGORIES = ["All", "Health Tips", "Hospital News", "Nutrition", "Mental Health", "Surgery"];

const FEATURED_BLOG = {
  id: 1,
  title: "10 Things You Should Know Before Visiting a Hospital",
  excerpt:
    "Knowing what to expect before stepping into a hospital can ease anxiety and help you get the best care possible. Here's a complete guide for patients.",
  category: "Health Tips",
  author: "Dr. Priya Sharma",
  authorRole: "Senior Physician",
  date: "March 20, 2025",
  readTime: "6 min read",
  image: "/images/blog1.jpg",
};

const BLOGS = [
  {
    id: 2,
    title: "How to Choose the Right Hospital for Your Treatment",
    excerpt: "Not all hospitals are the same. Learn what factors matter most when selecting a healthcare provider near you.",
    category: "Hospital News",
    author: "Dr. Anil Verma",
    date: "March 15, 2025",
    readTime: "4 min read",
    image: "/images/blog2.jpg",
  },
  {
    id: 3,
    title: "Top 5 Nutrition Tips for a Speedy Recovery",
    excerpt: "What you eat after a surgery or illness can dramatically affect how fast you recover. Nutrition experts share their top advice.",
    category: "Nutrition",
    author: "Neha Gupta, Dietitian",
    date: "March 10, 2025",
    readTime: "5 min read",
    image: "/images/blog3.jpg",
  },
  {
    id: 4,
    title: "Mental Health Matters: Breaking the Stigma in India",
    excerpt: "Mental health awareness is growing in India but stigma still holds many back from seeking help. Here's what you need to know.",
    category: "Mental Health",
    author: "Dr. Rohit Mehta",
    date: "March 5, 2025",
    readTime: "7 min read",
    image: "/images/blog4.jpg",
  },
  {
    id: 5,
    title: "Understanding Laparoscopic Surgery: A Patient's Guide",
    excerpt: "Laparoscopic surgery is minimally invasive and offers faster recovery. Learn how it works and when it's recommended.",
    category: "Surgery",
    author: "Dr. Sunita Rao",
    date: "Feb 28, 2025",
    readTime: "5 min read",
    image: "/images/blog5.jpg",
  },
  {
    id: 6,
    title: "Daily Habits That Improve Your Heart Health",
    excerpt: "Small lifestyle changes can have a big impact on your heart. Cardiologists share the habits that matter most.",
    category: "Health Tips",
    author: "Dr. Kavita Singh",
    date: "Feb 20, 2025",
    readTime: "4 min read",
    image: "/images/blog6.jpg",
  },
  {
    id: 7,
    title: "What Is Preventive Healthcare and Why Does It Matter?",
    excerpt: "Preventive care is about staying healthy before illness strikes. Discover how regular checkups can save lives.",
    category: "Health Tips",
    author: "Dr. Anil Verma",
    date: "Feb 14, 2025",
    readTime: "3 min read",
    image: "/images/blog7.jpg",
  },
];

// ── Category Badge ──
const Badge = ({ label }) => (
  <span className="bg-[#e6f4f4] text-[#0F5C5C] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
    {label}
  </span>
);

// ── Featured Blog Card ──
const FeaturedCard = ({ blog }) => (
  <div className="group relative bg-white rounded-3xl border border-[#e6f4f4] shadow-md overflow-hidden flex flex-col lg:flex-row hover:shadow-xl transition-shadow duration-300">
    {/* Image */}
    <div className="relative lg:w-1/2 h-64 lg:h-auto bg-[#e6f4f4] flex-shrink-0 overflow-hidden">
      <img
        src={blog.image}
        alt={blog.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        onError={(e) => {
          e.target.style.display = "none";
        }}
      />
      {/* Fallback gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0F5C5C] to-[#2ec4a0] opacity-80 flex items-center justify-center">
        <span className="text-white text-6xl">🏥</span>
      </div>
      <div className="absolute top-4 left-4">
        <span className="bg-[#2ec4a0] text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
          ⭐ Featured
        </span>
      </div>
    </div>

    {/* Content */}
    <div className="flex flex-col justify-center p-8 lg:p-10">
      <Badge label={blog.category} />
      <h2 className="text-[#0F5C5C] text-2xl lg:text-3xl font-bold leading-tight mt-3 mb-4">
        {blog.title}
      </h2>
      <p className="text-gray-500 text-sm leading-relaxed mb-6">{blog.excerpt}</p>

      <div className="flex items-center gap-4 mb-6">
        <div className="w-9 h-9 rounded-full bg-[#e6f4f4] flex items-center justify-center text-[#0F5C5C] font-bold text-sm flex-shrink-0">
          {blog.author.charAt(0)}
        </div>
        <div>
          <p className="text-[#0F5C5C] text-sm font-semibold">{blog.author}</p>
          <p className="text-gray-400 text-xs">{blog.authorRole}</p>
        </div>
        <div className="ml-auto flex items-center gap-3 text-gray-400 text-xs">
          <span>📅 {blog.date}</span>
          <span>·</span>
          <span>⏱ {blog.readTime}</span>
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

// ── Regular Blog Card ──
const BlogCard = ({ blog }) => (
  <div className="group bg-white rounded-2xl border border-[#e6f4f4] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden">
    {/* Image */}
    <div className="relative w-full h-48 bg-[#e6f4f4] flex-shrink-0 overflow-hidden">
      <img
        src={blog.image}
        alt={blog.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        onError={(e) => {
          e.target.style.display = "none";
        }}
      />
      {/* Fallback gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0F5C5C]/80 to-[#2ec4a0]/60 flex items-center justify-center">
        <span className="text-white text-4xl">📝</span>
      </div>
      <div className="absolute top-3 left-3">
        <Badge label={blog.category} />
      </div>
    </div>

    {/* Content */}
    <div className="flex flex-col flex-1 p-5">
      <h3 className="text-[#0F5C5C] font-bold text-[15px] leading-snug mb-2 group-hover:text-[#177a7a] transition-colors">
        {blog.title}
      </h3>
      <p className="text-gray-400 text-xs leading-relaxed mb-4 flex-1">{blog.excerpt}</p>

      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#e6f4f4] flex items-center justify-center text-[#0F5C5C] font-bold text-xs flex-shrink-0">
            {blog.author.charAt(0)}
          </div>
          <span className="text-[#0F5C5C] text-xs font-semibold truncate max-w-[100px]">{blog.author}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-400 text-[11px]">
          <span>⏱ {blog.readTime}</span>
        </div>
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

// ── Main Blog Page ──
export default function BlogsPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#f4fafa]">

        {/* ── Page Header ── */}
        <div className="bg-white border-b-2 border-[#e6f4f4] px-6 py-10">
          <div className="max-w-[1280px] mx-auto">
            <p className="text-[#0F5C5C] text-[11px] font-bold tracking-widest uppercase mb-2">
              Our Blog
            </p>
            <div className="flex items-end justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-[#0F5C5C] text-3xl md:text-4xl font-bold mb-1">
                  Health Articles & Insights
                </h1>
                <p className="text-[#0F5C5C]/50 text-sm">
                  Expert advice, hospital news, and wellness tips — all in one place.
                </p>
              </div>
              {/* Search bar */}
              <div className="flex items-center bg-[#f4fafa] border border-[#e6f4f4] rounded-full overflow-hidden px-4 py-2.5 gap-2 w-full md:w-72">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0F5C5C" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  placeholder="Search articles..."
                  className="flex-1 bg-transparent text-sm text-gray-600 placeholder-gray-400 outline-none"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 flex-wrap mt-6">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  className={`text-xs font-semibold px-4 py-2 rounded-full border transition-all duration-200 ${
                    cat === "All"
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
          <div className="mb-12">
            <p className="text-[#0F5C5C] text-[11px] font-bold tracking-widest uppercase mb-4">
              ⭐ Featured Article
            </p>
            <FeaturedCard blog={FEATURED_BLOG} />
          </div>

          {/* Latest Articles */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <p className="text-[#0F5C5C] text-[11px] font-bold tracking-widest uppercase">
                📰 Latest Articles
              </p>
              <span className="text-gray-400 text-xs">{BLOGS.length} articles</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {BLOGS.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>
          </div>

          {/* Load More — placeholder for pagination */}
          <div className="flex justify-center mt-12">
            <button className="inline-flex items-center gap-2 border-[1.5px] border-[#0F5C5C] text-[#0F5C5C] hover:bg-[#0F5C5C] hover:text-white text-sm font-semibold px-8 py-3 rounded-full transition-all duration-200">
              Load More Articles ↓
            </button>
          </div>

        </div>

        {/* ── Newsletter Banner ── */}
        <div className="bg-[#0F5C5C] mt-10 py-14 px-6">
          <div className="max-w-[600px] mx-auto text-center">
            <p className="text-[#2ec4a0] text-[11px] font-bold tracking-widest uppercase mb-3">
              Stay Updated
            </p>
            <h2 className="text-white text-2xl md:text-3xl font-bold mb-3">
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