"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

const API = "http://localhost:5000/api";

const Stars = ({ rating }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <svg
        key={s}
        width="15"
        height="15"
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

function getInitials(name = "") {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

const AVATAR_COLORS = ["#0F5C5C","#0e7490","#065f46","#7c3aed","#b45309","#be123c","#1d4ed8","#0369a1"];
function getAvatarColor(name = "") {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + h * 31;
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}

const TABS = ["about", "specialities", "doctors", "timings", "map", "reviews"];

export default function HospitalDetailPage({ params }) {
  const { id } = React.use(params);
  const [hospital, setHospital]             = useState(null);
  const [loading, setLoading]               = useState(true);
  const [notFound, setNotFound]             = useState(false);
  const [activeTab, setActiveTab]           = useState("about");

  // ── Reviews state ──────────────────────────────────────────────────────────
  const [reviews, setReviews]               = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  useEffect(() => {
    fetch(`${API}/hospitals/${id}`)
      .then((res) => {
        if (res.status === 404) { setNotFound(true); return null; }
        return res.json();
      })
      .then((data) => { if (data) setHospital(data); })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  // ── Re-fetch reviews every time the reviews tab is opened ─────────────────
  useEffect(() => {
    if (activeTab !== "reviews") return;

    setReviewsLoading(true);
    fetch(`${API}/reviews/hospital/${id}`)
      .then((res) => res.json())
      .then((json) => { if (json.success) setReviews(json.data); })
      .catch(() => {})
      .finally(() => setReviewsLoading(false));
  }, [activeTab, id]); // ← no reviewsFetched guard — always fetches fresh

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4fafa]">
        <p className="text-[#0F5C5C] opacity-50 text-sm">Loading hospital details...</p>
      </div>
    );
  }

  if (notFound || !hospital) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4fafa]">
        <div className="text-center">
          <p className="text-5xl mb-3">🏥</p>
          <h2 className="text-[#0F5C5C] text-2xl font-bold mb-2">Hospital Not Found</h2>
          <Link href="/hospitals" className="text-[#0F5C5C] text-sm">
            ← Back to listings
          </Link>
        </div>
      </div>
    );
  }

  const specialities = hospital.specialities || [];
  const gallery      = hospital.gallery      || [];
  const doctors      = hospital.doctors      || [];
  const timings = Array.isArray(hospital.timings)
    ? hospital.timings
    : typeof hospital.timings === "string"
    ? JSON.parse(hospital.timings)
    : [];

  return (
    <div className="min-h-screen bg-[#f4fafa] font-sans">

      {/* ── HERO BANNER ── */}
      <div className="relative h-[280px] bg-[#0F5C5C] overflow-hidden">
        <img
          src={hospital.image}
          alt={hospital.name}
          className="w-full h-full object-cover opacity-30"
          onError={(e) => { e.target.style.display = "none"; }}
        />
        <div className="absolute inset-0 flex flex-col justify-end px-12 pb-8">
          <Link
            href="/hospitals"
            className="text-white/75 text-[13px] no-underline inline-flex items-center gap-1.5 mb-3"
          >
            ← Back to Hospitals
          </Link>
          <div className="flex gap-2 flex-wrap mb-2.5">
            {hospital.verified && (
              <span className="bg-[#2ec4a0] text-white text-[11px] font-bold px-3 py-1 rounded-full">
                ✓ Verified
              </span>
            )}
            {hospital.tag && (
              <span className="bg-amber-400 text-amber-900 text-[11px] font-bold px-3 py-1 rounded-full">
                ★ {hospital.tag}
              </span>
            )}
            {hospital.emergency && (
              <span className="bg-red-500 text-white text-[11px] font-bold px-3 py-1 rounded-full">
                🚨 24/7 Emergency
              </span>
            )}
          </div>
          <h1 className="text-white text-3xl font-extrabold mb-2">{hospital.name}</h1>
          <div className="flex items-center gap-2.5">
            <Stars rating={hospital.rating} />
            <span className="text-white font-bold">{hospital.rating}</span>
            <span className="text-white/60 text-[13px]">({hospital.reviews} reviews)</span>
          </div>
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="max-w-[1280px] mx-auto px-6 py-8 flex gap-6 items-start flex-col lg:flex-row">

        {/* ── LEFT MAIN ── */}
        <div className="flex-1 min-w-0 w-full">

          {/* Tab Bar */}
          <div className="bg-white rounded-2xl p-1.5 flex gap-1 mb-5 shadow-[0_2px_8px_rgba(15,92,92,0.07)] overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl border-none cursor-pointer text-[13px] font-semibold capitalize whitespace-nowrap transition-all duration-200 ${
                  activeTab === tab
                    ? "bg-[#0F5C5C] text-white"
                    : "bg-transparent text-gray-500"
                }`}
              >
                {tab}
                {tab === "reviews" && reviews.length > 0 && (
                  <span className="ml-1.5 bg-[#2ec4a0] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {reviews.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* ABOUT */}
          {activeTab === "about" && (
            <div className="bg-white rounded-2xl p-7 shadow-[0_2px_8px_rgba(15,92,92,0.07)]">
              <h2 className="text-[#0F5C5C] text-xl font-bold mb-3">About the Hospital</h2>
              <p className="text-gray-500 leading-relaxed text-sm mb-7">
                {hospital.about || "No description available."}
              </p>
              {gallery.length > 0 && (
                <>
                  <h3 className="text-[#0F5C5C] text-[17px] font-bold mb-4">Gallery</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {gallery.map((img, i) => (
                      <div key={i} className="rounded-xl overflow-hidden bg-[#e6f4f4] aspect-video">
                        <img
                          src={img}
                          alt={`Gallery ${i + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.style.display = "none"; }}
                        />
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* SPECIALITIES */}
          {activeTab === "specialities" && (
            <div className="bg-white rounded-2xl p-7 shadow-[0_2px_8px_rgba(15,92,92,0.07)]">
              <h2 className="text-[#0F5C5C] text-xl font-bold mb-5">Specialities</h2>
              {specialities.length === 0 ? (
                <p className="text-gray-400 text-[13px]">No specialities listed.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {specialities.map((s) => (
                    <div key={s} className="bg-[#e6f4f4] rounded-xl px-4 py-3.5 flex items-center gap-2.5">
                      <span className="text-lg">🏥</span>
                      <span className="text-[#0F5C5C] font-semibold text-[13px]">{s}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* DOCTORS */}
          {activeTab === "doctors" && (
            <div className="bg-white rounded-2xl p-7 shadow-[0_2px_8px_rgba(15,92,92,0.07)]">
              <h2 className="text-[#0F5C5C] text-xl font-bold mb-5">Doctors List</h2>
              {doctors.length === 0 ? (
                <p className="text-gray-400 text-[13px]">No doctors listed for this hospital.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {doctors.map((doc, i) => (
                    <div key={i} className="bg-[#f4fafa] border border-[#e6f4f4] rounded-2xl p-4 flex gap-3.5 items-center">
                      <div className="w-14 h-14 rounded-xl bg-[#e6f4f4] overflow-hidden flex-shrink-0">
                        <img
                          src={doc.image}
                          alt={doc.name}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.style.display = "none"; }}
                        />
                      </div>
                      <div>
                        <p className="text-[#0F5C5C] font-bold text-sm mb-0.5">{doc.name}</p>
                        <p className="text-gray-500 text-xs mb-1">{doc.specialization || doc.speciality}</p>
                        <p className="text-[#2ec4a0] text-xs font-semibold">{doc.experience} exp.</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TIMINGS */}
          {activeTab === "timings" && (
            <div className="bg-white rounded-2xl p-7 shadow-[0_2px_8px_rgba(15,92,92,0.07)]">
              <h2 className="text-[#0F5C5C] text-xl font-bold mb-5">Timings</h2>
              {timings.length === 0 ? (
                <p className="text-gray-400 text-[13px]">No timings listed.</p>
              ) : (
                timings.map((t, i) => (
                  <div
                    key={i}
                    className={`flex justify-between items-center py-3.5 ${
                      i < timings.length - 1 ? "border-b border-gray-100" : ""
                    }`}
                  >
                    <span className="text-gray-700 text-sm font-medium">{t.day}</span>
                    <span
                      className={`text-sm font-bold px-3.5 py-1 rounded-full ${
                        t.time === "Closed" ? "text-red-500 bg-red-100" : "text-[#0F5C5C] bg-[#e6f4f4]"
                      }`}
                    >
                      {t.time}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}

          {/* MAP */}
          {activeTab === "map" && (
            <div className="bg-white rounded-2xl p-7 shadow-[0_2px_8px_rgba(15,92,92,0.07)]">
              <h2 className="text-[#0F5C5C] text-xl font-bold mb-1.5">Location</h2>
              <p className="text-gray-500 text-[13px] mb-4 flex items-center gap-1.5">📍 {hospital.address}</p>
              {hospital.map_embed ? (
                <div className="rounded-2xl overflow-hidden h-[300px] border border-[#e6f4f4]">
                  <iframe
                    src={hospital.map_embed}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              ) : (
                <p className="text-gray-400 text-[13px]">No map available.</p>
              )}
            </div>
          )}

          {/* ── REVIEWS ── */}
          {activeTab === "reviews" && (
            <div className="bg-white rounded-2xl p-7 shadow-[0_2px_8px_rgba(15,92,92,0.07)]">
              <h2 className="text-[#0F5C5C] text-xl font-bold mb-4">Reviews</h2>

              {/* Rating summary */}
              <div className="flex items-center gap-5 bg-[#e6f4f4] rounded-2xl px-6 py-5 mb-6">
                <p className="text-[52px] font-extrabold text-[#0F5C5C] m-0 leading-none">
                  {hospital.rating}
                </p>
                <div>
                  <Stars rating={hospital.rating} />
                  {/* <p className="text-gray-500 text-xs mt-1">{hospital.reviews} total reviews</p> */}
                </div>
              </div>

              {/* Review list */}
              {reviewsLoading ? (
                <p className="text-[#6b9090] text-[13px] text-center py-6">Loading reviews…</p>
              ) : reviews.length === 0 ? (
                <p className="text-gray-400 text-[13px] text-center py-6">
                  No reviews yet. Be the first to share your experience!
                </p>
              ) : (
                <div className="flex flex-col gap-4">
                  {reviews.map((r) => {
                    const color = getAvatarColor(r.name);
                    return (
                      <div
                        key={r.id}
                        className="bg-[#f4fafa] border border-[#e6f4f4] rounded-2xl p-5"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div
                            style={{ background: color }}
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                          >
                            {getInitials(r.name)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[#0a3d3d] font-bold text-sm leading-tight">{r.name}</p>
                            <p className="text-gray-400 text-[11px]">
                              📍 {r.location}
                              {r.created_at && (
                                <span className="ml-2">
                                  · {new Date(r.created_at).toLocaleDateString("en-IN", {
                                    day: "numeric", month: "short", year: "numeric",
                                  })}
                                </span>
                              )}
                            </p>
                          </div>
                          <Stars rating={r.rating} />
                        </div>
                        <p className="text-gray-600 text-[13px] leading-relaxed">{r.review_text}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── RIGHT SIDEBAR ── */}
        <div className="w-full lg:w-[300px] flex-shrink-0 flex flex-col gap-4">

          {/* Contact Card */}
          <div className="bg-white rounded-2xl p-5 shadow-[0_2px_8px_rgba(15,92,92,0.07)]">
            <h3 className="text-[#0F5C5C] font-bold text-base mb-4">Contact</h3>
            {[
              { label: "Phone",   value: hospital.phone,   icon: "📞" },
              { label: "Address", value: hospital.address, icon: "📍" },
              {
                label: "Timings",
                value: hospital.opening && hospital.closing
                  ? `${hospital.opening} – ${hospital.closing}`
                  : "—",
                icon: "🕐",
              },
            ].map(({ label, value, icon }) => (
              <div key={label} className="flex gap-3 items-start py-3 border-b border-gray-100">
                <div className="w-9 h-9 bg-[#e6f4f4] rounded-xl flex items-center justify-center flex-shrink-0 text-base">
                  {icon}
                </div>
                <div>
                  <p className="text-gray-400 text-[11px] font-semibold mb-0.5">{label}</p>
                  <p className="text-gray-800 text-[13px] font-semibold leading-snug">{value}</p>
                </div>
              </div>
            ))}
            <a
              href={`tel:${hospital.phone}`}
              className="mt-4 w-full flex items-center justify-center gap-2 bg-[#0F5C5C] text-white rounded-xl py-3 text-sm font-bold no-underline"
            >
              📞 Call Now
            </a>
            <a
              href={`https://wa.me/${(hospital.phone || "").replace(/\D/g, "")}`}
              target="_blank"
              rel="noreferrer"
              className="mt-2 w-full flex items-center justify-center gap-2 border-[1.5px] border-green-500 text-green-600 rounded-xl py-3 text-sm font-bold no-underline"
            >
              💬 WhatsApp
            </a>
          </div>

          {/* Specialities Sidebar */}
          <div className="bg-white rounded-2xl p-5 shadow-[0_2px_8px_rgba(15,92,92,0.07)]">
            <h3 className="text-[#0F5C5C] font-bold text-base mb-3">Specialities</h3>
            <div className="flex flex-wrap gap-2">
              {specialities.length === 0 ? (
                <span className="text-gray-400 text-[13px]">None listed</span>
              ) : (
                specialities.map((s) => (
                  <span key={s} className="bg-[#e6f4f4] text-[#0F5C5C] text-xs font-semibold px-3 py-1.5 rounded-full">
                    {s}
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Directions Card */}
          <div className="bg-[#0F5C5C] rounded-2xl p-5 text-center">
            <p className="text-white font-bold text-[15px] mb-1">Need Directions?</p>
            <p className="text-white/60 text-xs mb-4">Open in Google Maps</p>
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(hospital.address || "")}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-white text-[#0F5C5C] rounded-xl px-5 py-2.5 text-[13px] font-bold no-underline"
            >
              📍 Get Directions
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}