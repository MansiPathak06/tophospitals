"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const API = "http://localhost:5000/api";

const Stars = ({ rating }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <svg
        key={s}
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill={s <= Math.round(rating) ? "#f59e0b" : "none"}
        stroke="#f59e0b"
        strokeWidth="2"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ))}
  </div>
);

const HospitalCard = ({ hospital }) => (
  <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(15,92,92,0.08)] border border-[#e6f4f4] flex flex-col overflow-hidden transition-all duration-200 hover:shadow-[0_8px_32px_rgba(15,92,92,0.14)] hover:-translate-y-1">
    {/* Image */}
    <div className="relative w-full h-44 bg-[#e6f4f4] flex-shrink-0 overflow-hidden">
      <img
        src={hospital.image}
        alt={hospital.name}
        className="w-full h-full object-cover"
        onError={(e) => { e.target.style.display = "none"; }}
      />
      {hospital.verified && (
        <span className="absolute top-2.5 left-2.5 bg-[#0F5C5C] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
          ✓ Verified
        </span>
      )}
      {hospital.tag && (
        <span className="absolute top-2.5 right-2.5 bg-amber-400 text-amber-900 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
          ★ {hospital.tag}
        </span>
      )}
      {hospital.emergency && (
        <span className="absolute bottom-2.5 right-2.5 bg-red-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
          24/7 Emergency
        </span>
      )}
    </div>

    {/* Body */}
    <div className="p-4 flex flex-col flex-1">
      <div className="flex justify-between items-start gap-2 mb-1">
        <h3 className="text-[#0F5C5C] font-bold text-[15px] leading-snug m-0">
          {hospital.name}
        </h3>
        <span className="text-amber-400 font-bold text-sm flex-shrink-0">
          {hospital.rating}
        </span>
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
        <span className="text-gray-500 text-xs">
          {hospital.opening} – {hospital.closing}
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {(hospital.specialities || []).slice(0, 3).map((s) => (
          <span
            key={s}
            className="bg-[#e6f4f4] text-[#0F5C5C] text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
          >
            {s}
          </span>
        ))}
        {(hospital.specialities || []).length > 3 && (
          <span className="bg-gray-100 text-gray-400 text-[11px] px-2.5 py-0.5 rounded-full">
            +{hospital.specialities.length - 3} more
          </span>
        )}
      </div>

      <div className="mt-auto border-t border-gray-100 pt-3.5 flex gap-2">
        <a
          href={`tel:${hospital.phone}`}
          className="flex-1 flex items-center justify-center gap-1.5 border-[1.5px] border-[#0F5C5C] text-[#0F5C5C] text-[13px] font-semibold rounded-xl py-2.5 no-underline bg-transparent"
        >
          📞 Call
        </a>
        <Link
          href={`/hospitals/${hospital.id}`}
          className="flex-1 flex items-center justify-center gap-1.5 bg-[#0F5C5C] text-white text-[13px] font-semibold rounded-xl py-2.5 no-underline"
        >
          View Details →
        </Link>
      </div>
    </div>
  </div>
);

export default function HospitalsPage() {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API}/hospitals`)
      .then((res) => res.json())
      .then((data) => { setHospitals(Array.isArray(data) ? data : []); })
      .catch(() => setError("Failed to load hospitals. Make sure the backend is running."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#f4fafa]">
      {/* Header */}
      <div className="bg-white px-6 py-10 border-b-2 border-[#e6f4f4]">
        <div className="max-w-[1280px] mx-auto">
          <p className="text-[#0F5C5C] text-[11px] font-bold tracking-widest uppercase mb-1">
            Discover
          </p>
          <h1 className="text-[#0F5C5C] text-3xl font-bold mb-1.5">
            Top Hospitals Near You
          </h1>
          <p className="text-[#0F5C5C]/50 text-[13px]">
            {loading ? "Loading..." : `${hospitals.length} hospitals listed · Moradabad, UP`}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1280px] mx-auto px-6 py-10">
        {loading ? (
          <div className="text-center py-16 text-[#0F5C5C] opacity-50">
            Loading hospitals...
          </div>
        ) : error ? (
          <div className="text-center py-16 text-red-500 text-sm">{error}</div>
        ) : hospitals.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-5xl mb-3">🏥</p>
            <p className="text-[#0F5C5C] opacity-50 text-sm">No hospitals added yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {hospitals.map((h) => (
              <HospitalCard key={h.id} hospital={h} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}