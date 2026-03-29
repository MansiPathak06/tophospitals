"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useCity } from "@/hooks/useCity";
import Link from "next/link";

const API = "http://localhost:5000/api";

const Stars = ({ rating }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <svg key={s} width="10" height="10" viewBox="0 0 24 24"
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
  <div className={`group bg-white rounded-xl border border-[#e6f4f4] shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${isGrid ? "flex flex-col" : "flex flex-row"}`}>
    
    <div className={`relative bg-[#e6f4f4] flex-shrink-0 overflow-hidden ${isGrid ? "w-full h-36" : "w-44 h-auto min-h-full"}`}>
      <img src={hospital.image} alt={hospital.name}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        onError={(e) => { e.target.style.display = "none"; }} />
      {hospital.verified && (
        <span className="absolute top-2 left-2 bg-[#0F5C5C] text-white text-[9px] font-bold px-2 py-0.5 rounded-full">✓ Verified</span>
      )}
      {hospital.tag && (
        <span className="absolute top-2 right-2 bg-amber-400 text-amber-900 text-[9px] font-bold px-2 py-0.5 rounded-full">★ {hospital.tag}</span>
      )}
      {hospital.emergency && (
        <span className="absolute bottom-2 right-2 bg-red-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">24/7 ER</span>
      )}
    </div>

    <div className="p-3.5 flex flex-col flex-1">
      <div className="flex justify-between items-start gap-1 mb-0.5">
        <h3 className="text-[#0F5C5C] font-bold text-[13px] leading-tight line-clamp-1 m-0">{hospital.name}</h3>
        <span className="text-amber-400 font-bold text-xs flex-shrink-0">{hospital.rating}</span>
      </div>

      <div className="flex items-center gap-1 mb-2">
        <Stars rating={hospital.rating} />
        <span className="text-gray-400 text-[10px]">({hospital.reviews})</span>
      </div>

      <div className="flex gap-1 items-start mb-1">
        <span className="text-[11px] flex-shrink-0 mt-px">📍</span>
        <span className="text-gray-500 text-[11px] leading-snug line-clamp-1">{hospital.address}</span>
      </div>

      <div className="flex gap-1 items-center mb-2.5">
        <span className="text-[11px] flex-shrink-0">🕐</span>
        <span className="text-gray-500 text-[11px]">{hospital.opening} – {hospital.closing}</span>
      </div>

      <div className="flex flex-wrap gap-1 mb-3">
        {(hospital.specialities || []).slice(0, 2).map((s) => (
          <span key={s} className="bg-[#e6f4f4] text-[#0F5C5C] text-[10px] font-semibold px-2 py-0.5 rounded-full">{s}</span>
        ))}
        {(hospital.specialities || []).length > 2 && (
          <span className="bg-gray-100 text-gray-400 text-[10px] px-2 py-0.5 rounded-full">+{hospital.specialities.length - 2}</span>
        )}
      </div>

      <div className="mt-auto pt-2.5 border-t border-gray-100 flex gap-2">
        <a href={`tel:${hospital.phone}`}
          className="flex-1 flex items-center justify-center gap-1 border-[1.5px] border-[#0F5C5C] text-[#0F5C5C] text-[11px] font-semibold rounded-lg py-2 no-underline bg-transparent transition-colors hover:bg-[#0F5C5C] hover:text-white duration-200">
          📞 Call
        </a>
        <Link href={`/hospitals/${hospital.id}`}
          className="flex-1 flex items-center justify-center gap-1 bg-[#0F5C5C] text-white text-[11px] font-semibold rounded-lg py-2 no-underline transition-colors hover:bg-[#177a7a] duration-200">
          Details →
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
  const [isGrid, setIsGrid]       = useState(true);

  const searchParams = useSearchParams();
  const router       = useRouter();

  const [search, setSearch] = useState("");
  useEffect(() => {
    const q = searchParams.get("search") || "";
    setSearch(q);
  }, [searchParams]);

  useEffect(() => {
    fetch(`${API}/hospitals`)
      .then((res) => res.json())
      .then((data) => { setHospitals(Array.isArray(data) ? data : []); })
      .catch(() => setError("Failed to load hospitals. Make sure the backend is running."))
      .finally(() => setLoading(false));
  }, []);

  const displayed = hospitals.filter((h) => {
    const q = search.toLowerCase().trim();
    const matchesSearch = !q || (
      h.name?.toLowerCase().includes(q) ||
      h.specialities?.some((s) => s.toLowerCase().includes(q))
    );
    const matchesCity = !city || h.city?.toLowerCase().includes(city.toLowerCase());
    return matchesSearch && matchesCity;
  });

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

      {/* Header */}
      <div className="px-6 py-2 border-[#e6f4f4]">
        <div className="max-w-[1280px] mx-auto">
          <p className="text-[#0F5C5C] text-[11px] font-bold tracking-widest uppercase mb-1">Discover</p>
          <h1 className="text-[#0F5C5C] text-3xl font-bold mb-4">
            Top Hospitals {city ? `in ${city}` : "Near You"}
          </h1>

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

      {/* Content */}
      <div className="max-w-[1280px] mx-auto px-6 py-4">

        {/* Active filters */}
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
        <div className={isGrid
  ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
  : "flex flex-col gap-3"}>
            {displayed.map((h) => (
              <HospitalCard key={h.id} hospital={h} isGrid={isGrid} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}