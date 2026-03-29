"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useCity } from "@/hooks/useCity";
import Link from "next/link";

const API = "http://localhost:5000/api";

const Stars = ({ rating }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <svg key={s} width="13" height="13" viewBox="0 0 24 24"
        fill={s <= Math.round(rating) ? "#f59e0b" : "none"}
        stroke="#f59e0b" strokeWidth="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ))}
  </div>
);
const GridIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
  </svg>
);
const ListIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="5" rx="1"/><rect x="3" y="10" width="18" height="5" rx="1"/>
    <rect x="3" y="17" width="18" height="5" rx="1"/>
  </svg>
);

const HospitalCard = ({ hospital, isGrid }) => (
  <div className={`bg-white rounded-2xl shadow-[0_2px_12px_rgba(15,92,92,0.08)] border border-[#e6f4f4] overflow-hidden transition-all duration-200 hover:shadow-[0_8px_32px_rgba(15,92,92,0.14)] hover:-translate-y-1 ${isGrid ? "flex flex-col" : "flex flex-row"}`}>
    <div className={`relative bg-[#e6f4f4] flex-shrink-0 overflow-hidden ${isGrid ? "w-full h-44" : "w-56 h-auto"}`}>
      <img src={hospital.image} alt={hospital.name}
        className="w-full h-full object-cover"
        onError={(e) => { e.target.style.display = "none"; }} />
      {hospital.verified && (
        <span className="absolute top-2.5 left-2.5 bg-[#0F5C5C] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">✓ Verified</span>
      )}
      {hospital.tag && (
        <span className="absolute top-2.5 right-2.5 bg-amber-400 text-amber-900 text-[10px] font-bold px-2.5 py-0.5 rounded-full">★ {hospital.tag}</span>
      )}
      {hospital.emergency && (
        <span className="absolute bottom-2.5 right-2.5 bg-red-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">24/7 Emergency</span>
      )}
    </div>
    <div className="p-4 flex flex-col flex-1">
      <div className="flex justify-between items-start gap-2 mb-1">
        <h3 className="text-[#0F5C5C] font-bold text-[15px] leading-snug m-0">{hospital.name}</h3>
        <span className="text-amber-400 font-bold text-sm flex-shrink-0">{hospital.rating}</span>
      </div>
      <div className="flex items-center gap-1.5 mb-3">
        <Stars rating={hospital.rating} />
        <span className="text-gray-400 text-[11px]">({hospital.reviews})</span>
      </div>
      <div className="flex gap-1.5 items-start mb-1.5">
        <span className="text-[#0F5C5C] text-[13px] flex-shrink-0">📍</span>
        <span className="text-gray-500 text-xs leading-snug">{hospital.address}</span>
      </div>
      <div className="flex gap-1.5 items-center mb-3.5">
        <span className="text-[#0F5C5C] text-[13px] flex-shrink-0">🕐</span>
        <span className="text-gray-500 text-xs">{hospital.opening} – {hospital.closing}</span>
      </div>
      <div className="flex flex-wrap gap-1.5 mb-4">
        {(hospital.specialities || []).slice(0, 3).map((s) => (
          <span key={s} className="bg-[#e6f4f4] text-[#0F5C5C] text-[11px] font-semibold px-2.5 py-0.5 rounded-full">{s}</span>
        ))}
        {(hospital.specialities || []).length > 3 && (
          <span className="bg-gray-100 text-gray-400 text-[11px] px-2.5 py-0.5 rounded-full">+{hospital.specialities.length - 3} more</span>
        )}
      </div>
      <div className="mt-auto border-t border-gray-100 pt-3.5 flex gap-2">
        <a href={`tel:${hospital.phone}`}
          className="flex-1 flex items-center justify-center gap-1.5 border-[1.5px] border-[#0F5C5C] text-[#0F5C5C] text-[13px] font-semibold rounded-xl py-2.5 no-underline bg-transparent">
          📞 Call
        </a>
        <Link href={`/hospitals/${hospital.id}`}
          className="flex-1 flex items-center justify-center gap-1.5 bg-[#0F5C5C] text-white text-[13px] font-semibold rounded-xl py-2.5 no-underline">
          View Details →
        </Link>
      </div>
    </div>
  </div>
);

export default function HospitalsPage() {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const { city, clearCity }       = useCity();
  const [isGrid, setIsGrid] = useState(true);

  const searchParams = useSearchParams();
  const router       = useRouter();

  // ── Initialize search from URL param ──────────────────────────────────────
  const [search, setSearch] = useState("");
  useEffect(() => {
    const q = searchParams.get("search") || "";
 setSearch(q);
 }, [searchParams])

  useEffect(() => {
    fetch(`${API}/hospitals`)
      .then((res) => res.json())
      .then((data) => { setHospitals(Array.isArray(data) ? data : []); })
      .catch(() => setError("Failed to load hospitals. Make sure the backend is running."))
      .finally(() => setLoading(false));
  }, []);

  // ── Filter logic: city + search (name & specialities) ─────────────────────
  const displayed = hospitals.filter((h) => {
    const q = search.toLowerCase().trim();

    const matchesSearch = !q || (
      h.name?.toLowerCase().includes(q) ||
      h.specialities?.some((s) => s.toLowerCase().includes(q))
    );

    const matchesCity = !city ||
      h.city?.toLowerCase().includes(city.toLowerCase());

    return matchesSearch && matchesCity;
  });

  // ── Update URL when search changes ────────────────────────────────────────
  const handleSearchChange = (val) => {
    setSearch(val);
    const params = new URLSearchParams(searchParams.toString());
    if (val.trim()) params.set("search", val.trim());
    else params.delete("search");
    router.replace(`/hospitals?${params.toString()}`, { scroll: false });
  };

  const clearSearch = () => handleSearchChange("");

  return (
    <div className="min-h-screen bg-[#f4fafa]">

      {/* ── Header ── */}
      <div className="bg-white px-6 py-10 border-b-2 border-[#e6f4f4]">
        <div className="max-w-[1280px] mx-auto">
          <p className="text-[#0F5C5C] text-[11px] font-bold tracking-widest uppercase mb-1">Discover</p>
          <h1 className="text-[#0F5C5C] text-3xl font-bold mb-4">
            Top Hospitals {city ? `in ${city}` : "Near You"}
          </h1>

          {/* ── Search bar ── */}
          {/* <div className="flex items-center bg-[#f4fafa] border border-[#e6f4f4] rounded-full overflow-hidden max-w-lg focus-within:border-[#0F5C5C]/40 focus-within:ring-2 focus-within:ring-[#0F5C5C]/10 transition-all">
            <svg className="ml-4 text-[#0F5C5C]/50 flex-shrink-0"
              xmlns="http://www.w3.org/2000/svg" width="16" height="16"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search by hospital name or speciality…"
              className="flex-1 px-3 py-3 text-sm text-[#1a3333] placeholder-gray-400 outline-none bg-transparent"
            />
            {search && (
              <button onClick={clearSearch}
                className="text-gray-300 hover:text-gray-500 px-3 text-xl transition-colors">
                ×
              </button>
            )}
          </div> */}

        <div className="flex items-center justify-between mt-3">
  <p className="text-[#0F5C5C]/50 text-[13px]">
    {loading ? "Loading..." : `${displayed.length} hospital${displayed.length !== 1 ? "s" : ""} found`}
  </p>
  <div className="flex items-center gap-1 border-[1.5px] border-[#0F5C5C] rounded-full p-1">
    <button onClick={() => setIsGrid(true)}
      className={`p-2 rounded-full transition-all duration-200 ${isGrid ? "bg-[#0F5C5C] text-white" : "text-[#0F5C5C]"}`}>
      <GridIcon />
    </button>
    <button onClick={() => setIsGrid(false)}
      className={`p-2 rounded-full transition-all duration-200 ${!isGrid ? "bg-[#0F5C5C] text-white" : "text-[#0F5C5C]"}`}>
      <ListIcon />
    </button>
  </div>
</div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-[1280px] mx-auto px-6 py-10">

        {/* Active filters banners */}
        {(city || search) && !loading && (
          <div className="flex items-center gap-3 mb-6 px-5 py-3 bg-white rounded-2xl border border-[#e6f4f4] shadow-sm text-sm flex-wrap">
            {search && (
              <span className="text-[13px] text-[#1a3333]">
                🔍 Results for <strong className="text-[#0F5C5C]">"{search}"</strong>
              </span>
            )}
            {search && city && <span className="text-gray-200">|</span>}
            {city && (
              <span className="text-[13px] text-[#1a3333]">
                📍 in <strong className="text-[#0F5C5C]">{city}</strong>
              </span>
            )}
            <span className="text-gray-400 text-[12px]">— {displayed.length} result{displayed.length !== 1 ? "s" : ""}</span>

            <div className="ml-auto flex gap-2">
              {search && (
                <button onClick={clearSearch}
                  className="text-[12px] font-semibold text-[#0F5C5C] border border-[#0F5C5C]/30 rounded-full px-4 py-1.5 hover:bg-[#e6f4f4] transition-colors">
                  Clear Search ×
                </button>
              )}
              {city && (
                <button onClick={clearCity}
                  className="text-[12px] font-semibold text-[#0F5C5C] border border-[#0F5C5C]/30 rounded-full px-4 py-1.5 hover:bg-[#e6f4f4] transition-colors">
                  Clear City ×
                </button>
              )}
            </div>
          </div>
        )}

        {/* States */}
        {loading ? (
          <div className="text-center py-16 text-[#0F5C5C] opacity-50">Loading hospitals...</div>
        ) : error ? (
          <div className="text-center py-16 text-red-500 text-sm">{error}</div>
        ) : displayed.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🔍</p>
            <h3 className="text-[#0F5C5C] font-bold text-lg mb-2">No hospitals found</h3>
            <p className="text-gray-400 text-sm mb-6">
              {search
                ? `No results for "${search}"${city ? ` in ${city}` : ""}.`
                : `No hospitals found${city ? ` in ${city}` : ""}.`}
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              {search && (
                <button onClick={clearSearch}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#0F5C5C] text-white text-sm font-semibold rounded-full hover:bg-[#177a7a] transition-colors shadow-md">
                  Clear Search
                </button>
              )}
              {city && (
                <button onClick={clearCity}
                  className="inline-flex items-center gap-2 px-6 py-2.5 border border-[#0F5C5C] text-[#0F5C5C] text-sm font-semibold rounded-full hover:bg-[#e6f4f4] transition-colors">
                  View All Cities
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className={isGrid ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "flex flex-col gap-4"}>
            {displayed.map((h) => (
              <HospitalCard key={h.id} hospital={h} isGrid={isGrid} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}