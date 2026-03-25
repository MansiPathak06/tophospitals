"use client";
import { useState } from "react";

const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    role: "Patient · Apollo Hospital",
    avatar: "PS",
    avatarBg: "#0F5C5C",
    rating: 5,
    text: "The doctors at Apollo were incredibly thorough and compassionate. I was guided through every step of my treatment. Highly recommend NearbyHospitals for finding trusted care quickly.",
  },
  {
    id: 2,
    name: "Rahul Verma",
    role: "Patient · Max Super Speciality",
    avatar: "RV",
    avatarBg: "#0e7490",
    rating: 5,
    text: "Found the perfect specialist within minutes. The verified badges gave me confidence and the booking process was seamless. My family has been using this platform ever since.",
  },
  {
    id: 3,
    name: "Anjali Singh",
    role: "Patient · Fortis Hospital",
    avatar: "AS",
    avatarBg: "#065f46",
    rating: 4,
    text: "Excellent platform for locating nearby hospitals with real-time info. The 24/7 emergency filter saved us precious time during a critical situation. Truly a lifesaver!",
  },
  {
    id: 4,
    name: "Mohit Agarwal",
    role: "Patient · Apollo Hospital",
    avatar: "MA",
    avatarBg: "#7c3aed",
    rating: 5,
    text: "Transparent ratings, real reviews, and verified hospital profiles — this is exactly what healthcare discovery should look like. Thank you for building this for Moradabad.",
  },
];

const Stars = ({ rating }) => (
  <div style={{ display: "flex", gap: 3 }}>
    {[1, 2, 3, 4, 5].map((s) => (
      <svg key={s} width="14" height="14" viewBox="0 0 24 24"
        fill={s <= rating ? "#f59e0b" : "none"}
        stroke="#f59e0b" strokeWidth="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ))}
  </div>
);

export default function Testimonials() {
  const [active, setActive] = useState(0);

  return (
    <section style={{ background: "#fff", padding: "80px 24px" }}>
      <style>{`
        .testi-card {
          background: #f4fafa;
          border: 1.5px solid #e6f4f4;
          border-radius: 20px;
          padding: 28px 24px;
          cursor: pointer;
          transition: all 0.25s ease;
          position: relative;
          overflow: hidden;
        }
        .testi-card.active {
          background: #0F5C5C;
          border-color: #0F5C5C;
          box-shadow: 0 12px 40px rgba(15,92,92,0.25);
          transform: translateY(-4px);
        }
        .testi-card:hover:not(.active) {
          border-color: #0F5C5C;
          transform: translateY(-2px);
        }
        .testi-dot {
          width: 10px; height: 10px;
          border-radius: 50%;
          background: #d1fae5;
          border: none; cursor: pointer;
          transition: all 0.2s;
          padding: 0;
        }
        .testi-dot.active { background: #0F5C5C; width: 28px; border-radius: 5px; }

        @media (max-width: 900px) {
          .testi-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 580px) {
          .testi-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <p style={{ color: "#0F5C5C", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 8 }}>
            What Patients Say
          </p>
          <h2 style={{ color: "#0a3d3d", fontSize: 34, fontWeight: 800, margin: "0 0 12px", lineHeight: 1.2 }}>
            Trusted by Thousands
          </h2>
          <p style={{ color: "rgba(15,92,92,0.55)", fontSize: 15, maxWidth: 460, margin: "0 auto" }}>
            Real stories from real patients who found the right care at the right time.
          </p>
        </div>

        {/* Cards */}
        <div className="testi-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginBottom: 36 }}>
          {testimonials.map((t, i) => (
            <div key={t.id} className={`testi-card${active === i ? " active" : ""}`} onClick={() => setActive(i)}>
              {/* Quote mark */}
              <div style={{
                position: "absolute", top: 14, right: 18,
                fontSize: 60, lineHeight: 1,
                color: active === i ? "rgba(255,255,255,0.1)" : "rgba(15,92,92,0.06)",
                fontFamily: "Georgia, serif", pointerEvents: "none",
              }}>
                "
              </div>

              {/* Avatar + Name */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                <div style={{
                  width: 42, height: 42, borderRadius: "50%",
                  background: active === i ? "rgba(255,255,255,0.2)" : t.avatarBg,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontWeight: 800, fontSize: 14, flexShrink: 0,
                }}>
                  {t.avatar}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: active === i ? "#fff" : "#0a3d3d" }}>
                    {t.name}
                  </div>
                  <div style={{ fontSize: 11, color: active === i ? "rgba(255,255,255,0.65)" : "#9ca3af", marginTop: 1 }}>
                    {t.role}
                  </div>
                </div>
              </div>

              <Stars rating={t.rating} />

              <p style={{
                marginTop: 12, fontSize: 13, lineHeight: 1.65,
                color: active === i ? "rgba(255,255,255,0.88)" : "#4b5563",
              }}>
                {t.text}
              </p>
            </div>
          ))}
        </div>

        {/* Dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
          {testimonials.map((_, i) => (
            <button key={i} className={`testi-dot${active === i ? " active" : ""}`} onClick={() => setActive(i)} aria-label={`Testimonial ${i + 1}`} />
          ))}
        </div>
      </div>
    </section>
  );
}