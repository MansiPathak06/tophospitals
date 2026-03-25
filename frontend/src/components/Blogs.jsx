"use client";
import Link from "next/link";

const blogs = [
  {
    id: 1,
    category: "Heart Health",
    categoryColor: "text-red-500",
    categoryBg: "bg-red-50",
    accentBg: "bg-red-500",
    title: "10 Warning Signs You Should Never Ignore About Your Heart",
    excerpt: "Chest tightness, shortness of breath, or unusual fatigue — learn which symptoms demand immediate medical attention and when to rush to the ER.",
    author: "Dr. Rajan Mehta",
    authorInitials: "RM",
    authorBg: "bg-teal-800",
    date: "Mar 18, 2026",
    readTime: "5 min read",
    featured: true,
  },
  {
    id: 2,
    category: "Neurology",
    categoryColor: "text-violet-600",
    categoryBg: "bg-violet-50",
    accentBg: "bg-violet-600",
    title: "Understanding Migraines: Causes, Triggers & Modern Treatments",
    excerpt: "A deep dive into why migraines happen and how neurologists are helping patients find lasting relief with new-generation therapies.",
    author: "Dr. Sneha Kapoor",
    authorInitials: "SK",
    authorBg: "bg-violet-600",
    date: "Mar 12, 2026",
    readTime: "7 min read",
    featured: false,
  },
  {
    id: 3,
    category: "Orthopaedics",
    categoryColor: "text-cyan-700",
    categoryBg: "bg-cyan-50",
    accentBg: "bg-cyan-700",
    title: "Knee Replacement: What to Expect Before, During & After Surgery",
    excerpt: "From pre-op tests to post-surgical physiotherapy, a complete patient guide to knee replacement recovery at top Moradabad hospitals.",
    author: "Dr. Arjun Tiwari",
    authorInitials: "AT",
    authorBg: "bg-cyan-700",
    date: "Mar 6, 2026",
    readTime: "6 min read",
    featured: false,
  },
  {
    id: 4,
    category: "Nutrition",
    categoryColor: "text-amber-600",
    categoryBg: "bg-amber-50",
    accentBg: "bg-amber-500",
    title: "The Diabetic Diet: Foods That Help Control Blood Sugar Naturally",
    excerpt: "Endocrinologists share their top food recommendations and simple meal-planning strategies to keep blood glucose levels in a healthy range.",
    author: "Dr. Kavya Sinha",
    authorInitials: "KS",
    authorBg: "bg-amber-600",
    date: "Feb 28, 2026",
    readTime: "4 min read",
    featured: false,
  },
];

const FeaturedBlog = ({ blog }) => (
  <div className="bg-teal-800 rounded-2xl p-8 relative overflow-hidden flex flex-col justify-end min-h-[380px]">
    {/* BG decorations */}
    <div className="absolute -top-10 -right-10 w-56 h-56 rounded-full bg-white/5 pointer-events-none" />
    <div className="absolute top-8 right-16 w-24 h-24 rounded-full bg-white/[0.04]" />

    <span className={`inline-block ${blog.categoryBg} ${blog.categoryColor} text-[11px] font-bold px-3 py-1 rounded-full mb-4 w-fit`}>
      {blog.category}
    </span>

    <h3 className="text-white text-2xl font-extrabold leading-snug mb-3">
      {blog.title}
    </h3>

    <p className="text-white/70 text-sm leading-relaxed mb-6">
      {blog.excerpt}
    </p>

    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-xs">
          {blog.authorInitials}
        </div>
        <div>
          <div className="text-white text-sm font-semibold">{blog.author}</div>
          <div className="text-white/55 text-[11px]">{blog.date} · {blog.readTime}</div>
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

const BlogCard = ({ blog }) => (
  <div className="bg-white rounded-2xl border border-teal-100 overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(15,92,92,0.12)] hover:border-teal-700">
    {/* Top accent bar */}
    <div className={`h-1 ${blog.accentBg}`} />

    <div className="p-5 flex flex-col flex-1">
      <span className={`inline-block ${blog.categoryBg} ${blog.categoryColor} text-[10px] font-bold px-2.5 py-1 rounded-full mb-3 w-fit tracking-wide`}>
        {blog.category}
      </span>

      <h3 className="text-teal-950 text-[15px] font-bold leading-snug mb-2.5">
        {blog.title}
      </h3>

      <p className="text-gray-500 text-[13px] leading-relaxed mb-4 flex-1">
        {blog.excerpt}
      </p>

      <div className="border-t border-gray-100 pt-3.5 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full ${blog.authorBg} flex items-center justify-center text-white font-bold text-[11px]`}>
            {blog.authorInitials}
          </div>
          <div>
            <div className="text-[12px] font-semibold text-gray-700">{blog.author}</div>
            <div className="text-[10px] text-gray-400">{blog.date} · {blog.readTime}</div>
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

export default function Blogs() {
  const [featured, ...rest] = blogs;

  return (
    <section className="bg-teal-50/60 py-20 px-2">
      <div className="max-w-[1280px] mx-auto">

        {/* Header */}
        <div className="flex justify-between items-end mb-10 flex-wrap gap-4">
          <div>
            <p className="text-teal-700 text-[11px] font-bold tracking-[0.14em] uppercase mb-2">
              Health Reads
            </p>
            <h2 className="text-teal-950 text-4xl font-extrabold m-0 leading-tight">
              From Our Medical Blog
            </h2>
          </div>
          <Link
            href="/blogs"
            className="text-teal-800 text-sm font-bold no-underline flex items-center gap-1 border-[1.5px] border-teal-800 px-5 py-2.5 rounded-xl whitespace-nowrap hover:bg-teal-800 hover:text-white transition-all duration-200"
          >
            View All Posts →
          </Link>
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FeaturedBlog blog={featured} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {rest.map((b) => (
              <BlogCard key={b.id} blog={b} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}