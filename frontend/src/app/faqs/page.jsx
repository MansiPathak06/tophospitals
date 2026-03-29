"use client";
import Footer from "@/components/Footer";
import { useState } from "react";

const faqs = [
  {
    category: "General",
    icon: "🔹",
    items: [
      {
        q: "What is TopHospitalsNearMe?",
        a: "TopHospitalsNearMe is a platform that helps users find the best hospitals near their location based on specialties, ratings, distance, and facilities.",
      },
      {
        q: "Is this service free to use?",
        a: "Yes, searching and exploring hospitals on our platform is completely free for users.",
      },
      {
        q: "How do I find hospitals near me?",
        a: "You can use the search bar, enable location access, or apply filters like specialty, rating, or distance to find hospitals near you.",
      },
      {
        q: "Are the hospital details verified?",
        a: "We aim to provide accurate and updated data from trusted sources, but we recommend confirming details directly with the hospital.",
      },
    ],
  },
  {
    category: "Search & Filters",
    icon: "🔍",
    items: [
      {
        q: "What filters can I use?",
        a: "You can filter hospitals based on location, specialty (Cardiology, Orthopedics, etc.), ratings, distance, insurance accepted, and facilities available.",
      },
      {
        q: "Can I search for a specific hospital?",
        a: "Yes, simply type the hospital name in the search bar to find it directly.",
      },
      {
        q: "Can I sort hospitals by rating or distance?",
        a: "Yes, you can sort results by highest rating, nearest distance, or popularity.",
      },
    ],
  },
  {
    category: "Bookings & Appointments",
    icon: "📅",
    items: [
      {
        q: "Can I book an appointment through this platform?",
        a: "Yes, you can book appointments by selecting a doctor, time slot, and preferred date.",
      },
      {
        q: "Will I get confirmation after booking?",
        a: "Yes, you will receive confirmation via SMS/Email (if implemented) and also through an on-screen confirmation message.",
      },
      {
        q: "Can I cancel or reschedule appointments?",
        a: "Yes, depending on hospital policies, you can modify or cancel your booking through the platform.",
      },
    ],
  },
  {
    category: "Doctors & Services",
    icon: "👨‍⚕️",
    items: [
      {
        q: "Can I view doctor details?",
        a: "Yes, you can see the doctor's name, specialization, experience, ratings, consultation fees, and availability.",
      },
      {
        q: "Can I compare hospitals?",
        a: "Yes, you can compare hospitals based on ratings, fees, facilities, and services offered.",
      },
    ],
  },
  {
    category: "Reviews & Ratings",
    icon: "⭐",
    items: [
      {
        q: "Are the reviews real?",
        a: "We encourage real user reviews. Some may be moderated to prevent spam or misuse and ensure quality.",
      },
      {
        q: "Can I leave a review?",
        a: "Yes, after visiting a hospital, you can rate and review your experience directly on the platform.",
      },
    ],
  },
  {
    category: "Location & Distance",
    icon: "📍",
    items: [
      {
        q: "How is distance calculated?",
        a: "Distance is calculated based on your current location or the location you have selected on the platform.",
      },
      {
        q: "What if my location is incorrect?",
        a: "You can manually enter or change your location anytime from the search bar or location settings.",
      },
    ],
  },
  {
    category: "Insurance & Cost",
    icon: "💳",
    items: [
      {
        q: "Can I filter hospitals by insurance?",
        a: "Yes, you can filter hospitals that accept Ayushman Bharat, private insurance, and other insurance providers.",
      },
      {
        q: "Does the platform show treatment costs?",
        a: "We may show estimated costs or consultation fees where available to help you plan better.",
      },
    ],
  },
  {
    category: "Tech & Features",
    icon: "⚙️",
    items: [
      {
        q: "What is the chatbot feature?",
        a: "The chatbot helps you find hospitals by asking a few questions about your needs and guiding you to the best options.",
      },
      {
        q: "Can I save favorite hospitals?",
        a: "Yes, you can save hospitals to your favorites list for quick access later.",
      },
      {
        q: "Is my data safe?",
        a: "Yes, we follow standard security practices to protect your personal data and privacy.",
      },
    ],
  },
  {
    category: "Contact & Support",
    icon: "📞",
    items: [
      {
        q: "How can I contact support?",
        a: "You can use the Contact Page or email our support team for help with any queries.",
      },
      {
        q: "How can hospitals list themselves?",
        a: "Hospitals can contact us directly through our platform to get listed and reach more patients.",
      },
    ],
  },
  {
    category: "Advanced Features",
    icon: "🚀",
    items: [
      {
        q: "Can I find emergency hospitals nearby?",
        a: "Yes, you can filter hospitals that offer emergency services for urgent care needs.",
      },
      {
        q: "Does it show 24/7 hospitals?",
        a: "Yes, hospitals with 24/7 availability are clearly marked on the platform.",
      },
      {
        q: "Can I see hospital facilities?",
        a: "Yes, facilities like ICU, ambulance, labs, etc. are listed on each hospital's page.",
      },
      {
        q: "Does it support multiple cities?",
        a: "Yes, you can search hospitals across different cities throughout India.",
      },
      {
        q: "Can I see hospital images and gallery?",
        a: "Yes, hospital pages include images and gallery sections so you can get a feel for the facility before visiting.",
      },
    ],
  },
];

const FAQItem = ({ q, a, index }) => {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
        open
          ? "border-[#0F5C5C]/40 shadow-[0_4px_24px_rgba(15,92,92,0.12)]"
          : "border-[#0F5C5C]/10 hover:border-[#0F5C5C]/25 hover:shadow-[0_2px_16px_rgba(15,92,92,0.08)]"
      } bg-white`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left gap-4 cursor-pointer group"
      >
        <div className="flex items-center gap-3">
          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#e6f4f4] text-[#0F5C5C] text-xs font-bold flex items-center justify-center">
            {index + 1}
          </span>
          <span className="text-[15px] font-semibold text-[#1a3333] group-hover:text-[#0F5C5C] transition-colors duration-200">
            {q}
          </span>
        </div>
        <span
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
            open ? "bg-[#0F5C5C] text-white rotate-45" : "bg-[#e6f4f4] text-[#0F5C5C]"
          }`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </span>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          open ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 pb-5 pt-0">
          <div className="h-px bg-[#0F5C5C]/10 mb-4" />
          <p className="text-[14px] text-[#4a7070] leading-relaxed pl-10">{a}</p>
        </div>
      </div>
    </div>
  );
};

const FAQsPage = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const allCategories = ["All", ...faqs.map((f) => f.category)];

  const filtered = faqs
    .map((section) => ({
      ...section,
      items: section.items.filter(
        (item) =>
          item.q.toLowerCase().includes(search.toLowerCase()) ||
          item.a.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter(
      (section) =>
        (activeCategory === "All" || section.category === activeCategory) &&
        section.items.length > 0
    );

  const totalFiltered = filtered.reduce((sum, s) => sum + s.items.length, 0);

  return (
    <div className="min-h-screen bg-[#f4fbfb]">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#0F5C5C] via-[#177a7a] to-[#1a9090] relative overflow-hidden">
        {/* decorative circles */}
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute top-8 left-1/3 w-24 h-24 rounded-full bg-[#2ec4a0]/10 pointer-events-none" />

        <div className="max-w-[860px] mx-auto px-6 py-16 relative">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[#2ec4a0] text-sm font-semibold tracking-widest uppercase">Help Center</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Frequently Asked <span className="text-[#2ec4a0]">Questions</span>
          </h1>
          <p className="text-white/70 text-[15px] max-w-xl mb-8">
            Everything you need to know about finding and booking the best hospitals near you.
          </p>

          {/* Search */}
          <div className="relative max-w-lg">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b9090] pointer-events-none"
              xmlns="http://www.w3.org/2000/svg"
              width="18" height="18"
              fill="none" viewBox="0 0 24 24"
              stroke="currentColor" strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your question…"
              className="w-full h-[50px] bg-white/95 border border-white/20 rounded-full pl-12 pr-5 text-[14px] text-[#1a3333] placeholder-[#6b9090] outline-none focus:ring-[3px] focus:ring-[#2ec4a0]/40 transition-all duration-200 shadow-lg"
            />
            {search && (
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#6b9090]">
                {totalFiltered} result{totalFiltered !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="sticky top-[72px] z-40 bg-white/90 backdrop-blur-sm border-b border-[#0F5C5C]/10 shadow-sm">
        <div className="max-w-[1100px] mx-auto px-6 py-3 flex gap-2 overflow-x-auto scrollbar-hide">
          {allCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-[13px] font-semibold transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-[#0F5C5C] text-white shadow-[0_2px_12px_rgba(15,92,92,0.3)]"
                  : "bg-[#e6f4f4] text-[#2a5252] hover:bg-[#cceaea] hover:text-[#0F5C5C]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ Sections */}
      <div className="max-w-[860px] mx-auto px-6 py-12">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-[#4a7070] text-lg font-medium">No results found for "{search}"</p>
            <p className="text-[#6b9090] text-sm mt-1">Try a different keyword or browse by category.</p>
          </div>
        ) : (
          filtered.map((section) => (
            <div key={section.category} className="mb-10">
              {/* Section Header */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xl">{section.icon}</span>
                <h2 className="text-[18px] font-bold text-[#0F5C5C]">{section.category}</h2>
                <span className="ml-auto text-[12px] text-[#6b9090] bg-[#e6f4f4] px-3 py-0.5 rounded-full font-medium">
                  {section.items.length} Q{section.items.length !== 1 ? "s" : ""}
                </span>
              </div>

              <div className="flex flex-col gap-3">
                {section.items.map((item, i) => (
                  <FAQItem key={i} q={item.q} a={item.a} index={i} />
                ))}
              </div>
            </div>
          ))
        )}

        {/* Bottom CTA */}
        <div className="mt-10 rounded-3xl bg-gradient-to-br from-[#0F5C5C] to-[#177a7a] p-8 text-center relative overflow-hidden">
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
          <p className="text-white font-semibold text-lg mb-1">Still have questions?</p>
          <p className="text-white/70 text-sm mb-5">Our support team is happy to help you anytime.</p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#2ec4a0] text-white rounded-full text-[14px] font-semibold hover:bg-[#25a98a] transition-colors duration-200 shadow-lg"
          >
            Contact Support
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default FAQsPage;