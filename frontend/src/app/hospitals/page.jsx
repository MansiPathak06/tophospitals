"use client";
import Link from "next/link";
import { useState } from "react";
import { hospitals } from "@/data/hospitals";


const INITIAL_COUNT = 3;

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

const HospitalCard = ({ hospital }) => (
  <div className="group bg-white rounded-2xl border border-[#e6f4f4] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden">

    {/* Image */}
    <div className="relative w-full h-44 bg-[#e6f4f4] flex-shrink-0 overflow-hidden">
      <img
        src={hospital.image}
        alt={hospital.name}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        onError={(e) => { e.target.style.display = "none"; }}
      />
      {hospital.verified && (
        <span className="absolute top-2.5 left-2.5 bg-[#0F5C5C] text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1">
          ✓ Verified
        </span>
      )}
      {hospital.tag && (
        <span className="absolute top-2.5 right-2.5 bg-amber-400 text-amber-900 text-[10px] font-bold px-3 py-1 rounded-full">
          ★ {hospital.tag}
        </span>
      )}
      {hospital.emergency && (
        <span className="absolute bottom-2.5 right-2.5 bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-full">
          24/7 Emergency
        </span>
      )}
    </div>

    {/* Body */}
    <div className="flex flex-col flex-1 p-4">
      <div className="flex justify-between items-start gap-2 mb-1">
        <h3 className="text-[#0F5C5C] font-bold text-[15px] leading-snug">{hospital.name}</h3>
        <span className="text-amber-500 font-bold text-sm flex-shrink-0">{hospital.rating}</span>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <Stars rating={hospital.rating} />
        <span className="text-gray-400 text-[11px]">({hospital.reviews})</span>
      </div>

      <div className="flex gap-1.5 items-start mb-1.5">
        <span className="text-[#0F5C5C] text-[13px] flex-shrink-0">📍</span>
        <span className="text-gray-500 text-xs leading-relaxed">{hospital.address}</span>
      </div>

      <div className="flex gap-1.5 items-center mb-4">
        <span className="text-[#0F5C5C] text-[13px] flex-shrink-0">🕐</span>
        <span className="text-gray-500 text-xs">{hospital.opening} – {hospital.closing}</span>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {hospital.specialities.slice(0, 3).map((s) => (
          <span key={s} className="bg-[#e6f4f4] text-[#0F5C5C] text-[11px] font-semibold px-2.5 py-1 rounded-full">
            {s}
          </span>
        ))}
        {hospital.specialities.length > 3 && (
          <span className="bg-gray-100 text-gray-400 text-[11px] px-2.5 py-1 rounded-full">
            +{hospital.specialities.length - 3} more
          </span>
        )}
      </div>

      {/* Buttons */}
      <div className="mt-auto pt-3 border-t border-gray-100 flex gap-2">
        <a
          href={`tel:${hospital.phone}`}
          className="flex-1 flex items-center justify-center gap-1.5 border-[1.5px] border-[#0F5C5C] text-[#0F5C5C] hover:bg-[#0F5C5C] hover:text-white text-[13px] font-semibold rounded-xl py-2.5 transition-colors duration-200"
        >
          📞 Call
        </a>
        <Link
          href={`/hospitals/${hospital.id}`}
          className="flex-1 flex items-center justify-center gap-1.5 bg-[#0F5C5C] hover:bg-[#177a7a] text-white text-[13px] font-semibold rounded-xl py-2.5 transition-colors duration-200"
        >
          View Details →
        </Link>
      </div>
    </div>
  </div>
);

export default function HospitalsPage() {
  const [showAll, setShowAll] = useState(false);

  const visibleHospitals = showAll ? hospitals : hospitals.slice(0, INITIAL_COUNT);
  const hasMore = hospitals.length > INITIAL_COUNT;

  const handleShowLess = () => {
    document.getElementById("hospitals-top")?.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => setShowAll(false), 300);
  };

  return (
    <>
     
      <div className="min-h-screen bg-[#f4fafa]">

        {/* ── Hero header ── */}
        <div className="bg-white border-b-2 border-[#e6f4f4] px-6 py-10">
          <div
            id="hospitals-top"
            className="max-w-[1280px] mx-auto flex items-end justify-between flex-wrap gap-4"
          >
            <div>
              <p className="text-[#0F5C5C] text-[11px] font-bold tracking-widest uppercase mb-1.5">
                Discover
              </p>
              <h1 className="text-[#0F5C5C] text-3xl md:text-4xl font-bold mb-1">
                Top Hospitals Near You
              </h1>
              <p className="text-[#0F5C5C]/50 text-sm">
                {hospitals.length} hospitals listed · Moradabad, UP
              </p>
            </div>

            {/* View All button — only visible when collapsed */}
            {hasMore && !showAll && (
              <button
                onClick={() => setShowAll(true)}
                className="inline-flex items-center gap-2 border-[1.5px] border-[#0F5C5C] text-[#0F5C5C] hover:bg-[#0F5C5C] hover:text-white text-sm font-semibold px-6 py-2.5 rounded-full transition-all duration-200"
              >
                View All Hospitals →
              </button>
            )}
          </div>
        </div>

        {/* ── Cards grid ── */}
        <div className="max-w-[1280px] mx-auto px-6 py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleHospitals.map((h) => (
              <HospitalCard key={h.id} hospital={h} />
            ))}
          </div>

          {/* Show Less button — after expand */}
          {showAll && (
            <div className="flex justify-center mt-10">
              <button
                onClick={handleShowLess}
                className="inline-flex items-center gap-2 border-[1.5px] border-[#0F5C5C] text-[#0F5C5C] hover:bg-[#0F5C5C] hover:text-white text-sm font-semibold px-6 py-2.5 rounded-full transition-all duration-200"
              >
                ↑ Show Less
              </button>
            </div>
          )}
        </div>

      </div>
    </>
  );
}