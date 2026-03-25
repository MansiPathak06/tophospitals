"use client";
import React, { useState } from "react";
import Link from "next/link";
import { hospitals } from "@/data/hospitals";

const Stars = ({ rating }) => (
  <div style={{ display: "flex", gap: 2 }}>
    {[1, 2, 3, 4, 5].map((s) => (
      <svg key={s} width="15" height="15" viewBox="0 0 24 24"
        fill={s <= Math.round(rating) ? "#f59e0b" : "none"}
        stroke="#f59e0b" strokeWidth="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ))}
  </div>
);

const TABS = ["about", "specialities", "doctors", "timings", "map", "reviews"];

export default function HospitalDetailPage({ params }) {
  const { id } = React.use(params);
  const hospital = hospitals.find((h) => h.id === id);
  const [activeTab, setActiveTab] = useState("about");

  if (!hospital) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f4fafa" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: 48, marginBottom: 12 }}>🏥</p>
          <h2 style={{ color: "#0F5C5C", fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Hospital Not Found</h2>
          <Link href="/hospitals" style={{ color: "#0F5C5C", fontSize: 14 }}>← Back to listings</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f4fafa", fontFamily: "sans-serif" }}>

      {/* ── HERO BANNER ── */}
      <div style={{ position: "relative", height: 280, background: "#0F5C5C", overflow: "hidden" }}>
        <img
          src={hospital.image}
          alt={hospital.name}
          style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.3 }}
          onError={(e) => { e.target.style.display = "none"; }}
        />
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column", justifyContent: "flex-end",
          padding: "0 48px 32px",
        }}>
          <Link href="/hospitals" style={{
            color: "rgba(255,255,255,0.75)", fontSize: 13, textDecoration: "none",
            display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 12,
          }}>
            ← Back to Hospitals
          </Link>

          {/* Badges */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
            {hospital.verified && (
              <span style={{ background: "#2ec4a0", color: "#fff", fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 999 }}>
                ✓ Verified
              </span>
            )}
            {hospital.tag && (
              <span style={{ background: "#fbbf24", color: "#78350f", fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 999 }}>
                ★ {hospital.tag}
              </span>
            )}
            {hospital.emergency && (
              <span style={{ background: "#ef4444", color: "#fff", fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 999 }}>
                🚨 24/7 Emergency
              </span>
            )}
          </div>

          <h1 style={{ color: "#fff", fontSize: 32, fontWeight: 800, margin: "0 0 8px" }}>{hospital.name}</h1>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Stars rating={hospital.rating} />
            <span style={{ color: "#fff", fontWeight: 700 }}>{hospital.rating}</span>
            <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>({hospital.reviews} reviews)</span>
          </div>
        </div>
      </div>

      {/* ── BODY ── */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px", display: "flex", gap: 24, alignItems: "flex-start" }}>

        {/* ── LEFT MAIN ── */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Tab Bar */}
          <div style={{
            background: "#fff", borderRadius: 14, padding: 6,
            display: "flex", gap: 4, marginBottom: 20,
            boxShadow: "0 2px 8px rgba(15,92,92,0.07)",
            overflowX: "auto",
          }}>
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: "8px 18px", borderRadius: 10, border: "none", cursor: "pointer",
                  fontSize: 13, fontWeight: 600, textTransform: "capitalize", whiteSpace: "nowrap",
                  background: activeTab === tab ? "#0F5C5C" : "transparent",
                  color: activeTab === tab ? "#fff" : "#6b7280",
                  transition: "all 0.2s",
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* ── ABOUT ── */}
          {activeTab === "about" && (
            <div style={{ background: "#fff", borderRadius: 16, padding: 28, boxShadow: "0 2px 8px rgba(15,92,92,0.07)" }}>
              <h2 style={{ color: "#0F5C5C", fontSize: 20, fontWeight: 700, marginBottom: 12 }}>About the Hospital</h2>
              <p style={{ color: "#6b7280", lineHeight: 1.7, fontSize: 14, marginBottom: 28 }}>{hospital.about}</p>

              <h3 style={{ color: "#0F5C5C", fontSize: 17, fontWeight: 700, marginBottom: 16 }}>Gallery</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                {hospital.gallery.map((img, i) => (
                  <div key={i} style={{ borderRadius: 12, overflow: "hidden", background: "#e6f4f4", aspectRatio: "16/9" }}>
                    <img src={img} alt={`Gallery ${i + 1}`}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      onError={(e) => { e.target.style.display = "none"; }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── SPECIALITIES ── */}
          {activeTab === "specialities" && (
            <div style={{ background: "#fff", borderRadius: 16, padding: 28, boxShadow: "0 2px 8px rgba(15,92,92,0.07)" }}>
              <h2 style={{ color: "#0F5C5C", fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Specialities</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                {hospital.specialities.map((s) => (
                  <div key={s} style={{
                    background: "#e6f4f4", borderRadius: 12,
                    padding: "14px 16px", display: "flex", alignItems: "center", gap: 10,
                  }}>
                    <span style={{ fontSize: 18 }}>🏥</span>
                    <span style={{ color: "#0F5C5C", fontWeight: 600, fontSize: 13 }}>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── DOCTORS ── */}
          {activeTab === "doctors" && (
            <div style={{ background: "#fff", borderRadius: 16, padding: 28, boxShadow: "0 2px 8px rgba(15,92,92,0.07)" }}>
              <h2 style={{ color: "#0F5C5C", fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Doctors List</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
                {hospital.doctors.map((doc, i) => (
                  <div key={i} style={{
                    background: "#f4fafa", border: "1px solid #e6f4f4",
                    borderRadius: 14, padding: 16, display: "flex", gap: 14, alignItems: "center",
                  }}>
                    <div style={{ width: 56, height: 56, borderRadius: 12, background: "#e6f4f4", overflow: "hidden", flexShrink: 0 }}>
                      <img src={doc.image} alt={doc.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        onError={(e) => { e.target.style.display = "none"; }}
                      />
                    </div>
                    <div>
                      <p style={{ color: "#0F5C5C", fontWeight: 700, fontSize: 14, margin: "0 0 2px" }}>{doc.name}</p>
                      <p style={{ color: "#6b7280", fontSize: 12, margin: "0 0 4px" }}>{doc.speciality}</p>
                      <p style={{ color: "#2ec4a0", fontSize: 12, fontWeight: 600, margin: 0 }}>{doc.experience} exp.</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── TIMINGS ── */}
          {activeTab === "timings" && (
            <div style={{ background: "#fff", borderRadius: 16, padding: 28, boxShadow: "0 2px 8px rgba(15,92,92,0.07)" }}>
              <h2 style={{ color: "#0F5C5C", fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Timings</h2>
              {hospital.timings.map((t, i) => (
                <div key={i} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "14px 0",
                  borderBottom: i < hospital.timings.length - 1 ? "1px solid #f3f4f6" : "none",
                }}>
                  <span style={{ color: "#374151", fontSize: 14, fontWeight: 500 }}>{t.day}</span>
                  <span style={{
                    fontSize: 14, fontWeight: 700,
                    color: t.time === "Closed" ? "#ef4444" : "#0F5C5C",
                    background: t.time === "Closed" ? "#fee2e2" : "#e6f4f4",
                    padding: "4px 14px", borderRadius: 999,
                  }}>
                    {t.time}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* ── MAP ── */}
          {activeTab === "map" && (
            <div style={{ background: "#fff", borderRadius: 16, padding: 28, boxShadow: "0 2px 8px rgba(15,92,92,0.07)" }}>
              <h2 style={{ color: "#0F5C5C", fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Location</h2>
              <p style={{ color: "#6b7280", fontSize: 13, marginBottom: 16, display: "flex", alignItems: "center", gap: 6 }}>
                📍 {hospital.address}
              </p>
              <div style={{ borderRadius: 14, overflow: "hidden", height: 300, border: "1px solid #e6f4f4" }}>
                <iframe
                  src={hospital.mapEmbed}
                  width="100%" height="100%"
                  style={{ border: 0 }}
                  allowFullScreen loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          )}

          {/* ── REVIEWS ── */}
          {activeTab === "reviews" && (
            <div style={{ background: "#fff", borderRadius: 16, padding: 28, boxShadow: "0 2px 8px rgba(15,92,92,0.07)" }}>
              <h2 style={{ color: "#0F5C5C", fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Reviews</h2>
              <div style={{
                display: "flex", alignItems: "center", gap: 20,
                background: "#e6f4f4", borderRadius: 14, padding: "20px 24px", marginBottom: 20,
              }}>
                <p style={{ fontSize: 52, fontWeight: 800, color: "#0F5C5C", margin: 0 }}>{hospital.rating}</p>
                <div>
                  <Stars rating={hospital.rating} />
                  <p style={{ color: "#6b7280", fontSize: 12, marginTop: 4 }}>{hospital.reviews} total reviews</p>
                </div>
              </div>
              <p style={{ color: "#9ca3af", fontSize: 13, textAlign: "center", padding: "24px 0" }}>
                Reviews will be loaded dynamically in future.
              </p>
            </div>
          )}
        </div>

        {/* ── RIGHT SIDEBAR ── */}
        <div style={{ width: 300, flexShrink: 0, display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Contact Card */}
          <div style={{ background: "#fff", borderRadius: 16, padding: 20, boxShadow: "0 2px 8px rgba(15,92,92,0.07)" }}>
            <h3 style={{ color: "#0F5C5C", fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Contact</h3>

            {[
              { label: "Phone", value: hospital.phone, icon: "📞" },
              { label: "Address", value: hospital.address, icon: "📍" },
              { label: "Timings", value: `${hospital.opening} – ${hospital.closing}`, icon: "🕐" },
            ].map(({ label, value, icon }) => (
              <div key={label} style={{
                display: "flex", gap: 12, alignItems: "flex-start",
                padding: "12px 0", borderBottom: "1px solid #f3f4f6",
              }}>
                <div style={{
                  width: 36, height: 36, background: "#e6f4f4",
                  borderRadius: 10, display: "flex", alignItems: "center",
                  justifyContent: "center", flexShrink: 0, fontSize: 16,
                }}>
                  {icon}
                </div>
                <div>
                  <p style={{ color: "#9ca3af", fontSize: 11, fontWeight: 600, margin: "0 0 2px" }}>{label}</p>
                  <p style={{ color: "#1f2937", fontSize: 13, fontWeight: 600, margin: 0, lineHeight: 1.4 }}>{value}</p>
                </div>
              </div>
            ))}

            <a href={`tel:${hospital.phone}`} style={{
              marginTop: 16, width: "100%", display: "flex", alignItems: "center",
              justifyContent: "center", gap: 8, background: "#0F5C5C", color: "#fff",
              borderRadius: 12, padding: "12px 0", fontSize: 14, fontWeight: 700,
              textDecoration: "none", boxSizing: "border-box",
            }}>
              📞 Call Now
            </a>
            <a
              href={`https://wa.me/${hospital.phone.replace(/\D/g, "")}`}
              target="_blank" rel="noreferrer"
              style={{
                marginTop: 8, width: "100%", display: "flex", alignItems: "center",
                justifyContent: "center", gap: 8, border: "1.5px solid #22c55e", color: "#16a34a",
                borderRadius: 12, padding: "12px 0", fontSize: 14, fontWeight: 700,
                textDecoration: "none", boxSizing: "border-box",
              }}
            >
              💬 WhatsApp
            </a>
          </div>

          {/* Specialities */}
          <div style={{ background: "#fff", borderRadius: 16, padding: 20, boxShadow: "0 2px 8px rgba(15,92,92,0.07)" }}>
            <h3 style={{ color: "#0F5C5C", fontWeight: 700, fontSize: 16, marginBottom: 12 }}>Specialities</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {hospital.specialities.map((s) => (
                <span key={s} style={{
                  background: "#e6f4f4", color: "#0F5C5C",
                  fontSize: 12, fontWeight: 600,
                  padding: "5px 12px", borderRadius: 999,
                }}>
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Directions */}
          <div style={{
            background: "#0F5C5C", borderRadius: 16, padding: 20, textAlign: "center",
          }}>
            <p style={{ color: "#fff", fontWeight: 700, fontSize: 15, margin: "0 0 4px" }}>Need Directions?</p>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, margin: "0 0 16px" }}>Open in Google Maps</p>
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(hospital.address)}`}
              target="_blank" rel="noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "#fff", color: "#0F5C5C",
                borderRadius: 10, padding: "10px 20px",
                fontSize: 13, fontWeight: 700, textDecoration: "none",
              }}
            >
              📍 Get Directions
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}