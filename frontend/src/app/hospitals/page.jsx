"use client";
import Link from "next/link";
import { hospitals } from "@/data/hospitals";

const Stars = ({ rating }) => (
  <div style={{ display: "flex", gap: "2px" }}>
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
  <div className="hospital-card" style={{
    background: "#fff",
    borderRadius: "16px",
    boxShadow: "0 2px 12px rgba(15,92,92,0.08)",
    border: "1px solid #e6f4f4",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    transition: "box-shadow 0.2s, transform 0.2s",
  }}>
    {/* Image area */}
    <div style={{ position: "relative", width: "100%", height: "180px", background: "#e6f4f4", flexShrink: 0, overflow: "hidden" }}>
      <img
        src={hospital.image}
        alt={hospital.name}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
        onError={(e) => { e.target.style.display = "none"; }}
      />
      {hospital.verified && (
        <span style={{
          position: "absolute", top: 10, left: 10,
          background: "#0F5C5C", color: "#fff",
          fontSize: 10, fontWeight: 700,
          padding: "3px 10px", borderRadius: 999,
          display: "flex", alignItems: "center", gap: 4,
        }}>
          ✓ Verified
        </span>
      )}
      {hospital.tag && (
        <span style={{
          position: "absolute", top: 10, right: 10,
          background: "#fbbf24", color: "#78350f",
          fontSize: 10, fontWeight: 700,
          padding: "3px 10px", borderRadius: 999,
        }}>
          ★ {hospital.tag}
        </span>
      )}
      {hospital.emergency && (
        <span style={{
          position: "absolute", bottom: 10, right: 10,
          background: "#ef4444", color: "#fff",
          fontSize: 10, fontWeight: 700,
          padding: "3px 10px", borderRadius: 999,
        }}>
          24/7 Emergency
        </span>
      )}
    </div>

    {/* Body */}
    <div style={{ padding: "16px", display: "flex", flexDirection: "column", flex: 1 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 4 }}>
        <h3 style={{ color: "#0F5C5C", fontWeight: 700, fontSize: 15, lineHeight: 1.3, margin: 0 }}>{hospital.name}</h3>
        <span style={{ color: "#f59e0b", fontWeight: 700, fontSize: 14, flexShrink: 0 }}>{hospital.rating}</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
        <Stars rating={hospital.rating} />
        <span style={{ color: "#9ca3af", fontSize: 11 }}>({hospital.reviews})</span>
      </div>

      <div style={{ display: "flex", gap: 6, alignItems: "flex-start", marginBottom: 6 }}>
        <span style={{ color: "#0F5C5C", fontSize: 13, flexShrink: 0 }}>📍</span>
        <span style={{ color: "#6b7280", fontSize: 12, lineHeight: 1.4 }}>{hospital.address}</span>
      </div>

      <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 14 }}>
        <span style={{ color: "#0F5C5C", fontSize: 13, flexShrink: 0 }}>🕐</span>
        <span style={{ color: "#6b7280", fontSize: 12 }}>{hospital.opening} – {hospital.closing}</span>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
        {hospital.specialities.slice(0, 3).map((s) => (
          <span key={s} style={{
            background: "#e6f4f4", color: "#0F5C5C",
            fontSize: 11, fontWeight: 600,
            padding: "3px 10px", borderRadius: 999,
          }}>
            {s}
          </span>
        ))}
        {hospital.specialities.length > 3 && (
          <span style={{
            background: "#f3f4f6", color: "#9ca3af",
            fontSize: 11, padding: "3px 10px", borderRadius: 999,
          }}>
            +{hospital.specialities.length - 3} more
          </span>
        )}
      </div>

      <div style={{
        marginTop: "auto",
        borderTop: "1px solid #f3f4f6",
        paddingTop: 14,
        display: "flex",
        gap: 8,
      }}>
        <a href={`tel:${hospital.phone}`} style={{
          flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          border: "1.5px solid #0F5C5C", color: "#0F5C5C",
          fontSize: 13, fontWeight: 600,
          borderRadius: 10, padding: "10px 0",
          textDecoration: "none", background: "transparent",
        }}>
          📞 Call
        </a>
        <Link href={`/hospitals/${hospital.id}`} style={{
          flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          background: "#0F5C5C", color: "#fff",
          fontSize: 13, fontWeight: 600,
          borderRadius: 10, padding: "10px 0",
          textDecoration: "none",
        }}>
          View Details →
        </Link>
      </div>
    </div>
  </div>
);

export default function HospitalsPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#f4fafa" }}>
      <style>{`
        .hospital-card:hover {
          box-shadow: 0 8px 32px rgba(15,92,92,0.14);
          transform: translateY(-3px);
        }
        .hospitals-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        @media (max-width: 1024px) {
          .hospitals-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 620px) {
          .hospitals-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Header */}
      <div style={{ background: "#fff", padding: "40px 24px", borderBottom: "2px solid #e6f4f4" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <p style={{ color: "#0F5C5C", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 4 }}>
            Discover
          </p>
          <h1 style={{ color: "#0F5C5C", fontSize: 32, fontWeight: 700, marginBottom: 6 }}>
            Top Hospitals Near You
          </h1>
          <p style={{ color: "rgba(15,92,92,0.5)", fontSize: 13 }}>
            {hospitals.length} hospitals listed · Moradabad, UP
          </p>
        </div>
      </div>

      {/* Cards Grid */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 24px" }}>
        <div className="hospitals-grid">
          {hospitals.map((h) => (
            <HospitalCard key={h.id} hospital={h} />
          ))}
        </div>
      </div>
    </div>
  );
}