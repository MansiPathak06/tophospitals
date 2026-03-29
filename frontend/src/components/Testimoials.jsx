"use client";
import { useState, useEffect, useRef } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const defaultTestimonials = [
  {
    id: "d1",
    name: "Priya Sharma",
    location: "Delhi",
    hospital: "Apollo Hospital",
    avatarBg: "#0F5C5C",
    rating: 5,
    review_text:
      "The doctors at Apollo were incredibly thorough and compassionate. I was guided through every step of my treatment. Highly recommend for finding trusted care quickly.",
    isDefault: true,
  },
  {
    id: "d2",
    name: "Rahul Verma",
    location: "Noida",
    hospital: "Max Super Speciality",
    avatarBg: "#0e7490",
    rating: 5,
    review_text:
      "Found the perfect specialist within minutes. The verified badges gave me confidence and the booking process was seamless. My family has been using this platform ever since.",
    isDefault: true,
  },
  {
    id: "d3",
    name: "Anjali Singh",
    location: "Gurgaon",
    hospital: "Fortis Hospital",
    avatarBg: "#065f46",
    rating: 4,
    review_text:
      "Excellent platform for locating nearby hospitals with real-time info. The 24/7 emergency filter saved us precious time during a critical situation. Truly a lifesaver!",
    isDefault: true,
  },
  {
    id: "d4",
    name: "Mohit Agarwal",
    location: "Moradabad",
    hospital: "Apollo Hospital",
    avatarBg: "#7c3aed",
    rating: 5,
    review_text:
      "Transparent ratings, real reviews, and verified hospital profiles — this is exactly what healthcare discovery should look like.",
    isDefault: true,
  },
];

const AVATAR_COLORS = [
  "#0F5C5C","#0e7490","#065f46","#7c3aed",
  "#b45309","#be123c","#1d4ed8","#0369a1",
];

function getInitials(name = "") {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

function getAvatarColor(name = "") {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + h * 31;
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}

function Stars({ rating }) {
  return (
    <div style={{ display: "flex", gap: 3 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} width="14" height="14" viewBox="0 0 24 24"
          fill={s <= rating ? "#f59e0b" : "none"}
          stroke={s <= rating ? "#f59e0b" : "#d1d5db"} strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState(defaultTestimonials);
  const [active, setActive]             = useState(0);
  const [loading, setLoading]           = useState(true);
  const [showModal, setShowModal]       = useState(false);
  const [submitted, setSubmitted]       = useState(false);
  const [submitting, setSubmitting]     = useState(false);
  const [apiError, setApiError]         = useState("");

  const [form, setForm]           = useState({ name: "", location: "", hospital: "", rating: 0, review_text: "" });
  const [hoveredStar, setHoveredStar] = useState(0);
  const [errors, setErrors]       = useState({});

  const scrollRef    = useRef(null);
  const intervalRef  = useRef(null);

  // ── Fetch reviews from backend ──
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res  = await fetch(`${API_BASE}/api/reviews`);
        const json = await res.json();
        if (json.success && json.data.length > 0) {
          setTestimonials([...defaultTestimonials, ...json.data]);
        }
      } catch (err) {
        console.warn("Could not fetch reviews:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  // ── Auto-scroll on mobile ──
  useEffect(() => {
    const startAutoScroll = () => {
      intervalRef.current = setInterval(() => {
        const isMobile = window.innerWidth < 768;
        if (!isMobile) return;

        setActive((prev) => {
          const next = (prev + 1) % testimonials.length;
          const scroll = scrollRef.current;
          if (scroll) {
            const card = scroll.children[next];
            card?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
          }
          return next;
        });
      }, 3000);
    };

    startAutoScroll();
    return () => clearInterval(intervalRef.current);
  }, [testimonials.length]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.location.trim()) e.location = "Location is required";
    if (!form.review_text.trim() || form.review_text.trim().length < 20)
      e.review_text = "Please write at least 20 characters";
    if (form.rating === 0) e.rating = "Please select a rating";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }

    setSubmitting(true);
    setApiError("");

    try {
      const res = await fetch(`${API_BASE}/api/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          location: form.location.trim(),
          hospital: form.hospital.trim() || null,
          rating: form.rating,
          review_text: form.review_text.trim(),
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setApiError(json.message || "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }

      setTestimonials((prev) => [...prev, json.data]);
      setActive(testimonials.length);
      setSubmitted(true);

      setTimeout(() => {
        setShowModal(false);
        setSubmitted(false);
        setForm({ name: "", location: "", hospital: "", rating: 0, review_text: "" });
        setErrors({});
        setHoveredStar(0);
      }, 2500);
    } catch (err) {
      setApiError("Network error. Please check your connection.");
    } finally {
      setSubmitting(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setErrors({});
    setApiError("");
    setHoveredStar(0);
  };

  const visibleStar = hoveredStar || form.rating;

  return (
    <section style={{ background: "#fff", padding: "80px 24px", position: "relative" }}>
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
          flex: 0 0 280px;
          scroll-snap-align: start;
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
          box-shadow: 0 4px 20px rgba(15,92,92,0.10);
        }
        .testi-scroll {
          display: flex;
          gap: 20px;
          overflow-x: auto;
          padding-bottom: 8px;
          padding-top: 8px; 
          scrollbar-width: thin;
          scrollbar-color: #d1fae5 transparent;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
        }
        .testi-scroll::-webkit-scrollbar { height: 4px; }
        .testi-scroll::-webkit-scrollbar-thumb { background: #d1fae5; border-radius: 4px; }
        .testi-dot {
          width: 10px; height: 10px; border-radius: 50%;
          background: #d1fae5; border: none; cursor: pointer;
          transition: all 0.2s; padding: 0;
        }
        .testi-dot.active { background: #0F5C5C; width: 28px; border-radius: 5px; }
        .add-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 12px 26px; background: #0F5C5C; color: #fff;
          border: none; border-radius: 50px; font-size: 14px;
          font-weight: 600; cursor: pointer; transition: all 0.2s;
          box-shadow: 0 4px 16px rgba(15,92,92,0.28);
        }
        .add-btn:hover { background: #177a7a; transform: translateY(-1px); box-shadow: 0 6px 22px rgba(15,92,92,0.35); }
        .modal-overlay {
          position: fixed; inset: 0;
          background: rgba(10,40,40,0.55);
          backdrop-filter: blur(4px); z-index: 999;
          display: flex; align-items: center; justify-content: center;
          padding: 20px; animation: fadeIn 0.2s ease;
        }
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes slideUp { from { opacity:0; transform:translateY(24px) } to { opacity:1; transform:translateY(0) } }
        .modal-box {
          background: #fff; border-radius: 24px; padding: 36px 32px;
          width: 100%; max-width: 480px; max-height: 90vh; overflow-y: auto;
          box-shadow: 0 24px 80px rgba(0,0,0,0.18);
          animation: slideUp 0.25s ease; position: relative;
        }
        .form-input {
          width: 100%; height: 44px; background: #f4fafa;
          border: 1.5px solid #e6f4f4; border-radius: 12px;
          padding: 0 14px; font-size: 14px; color: #1a3333;
          outline: none; transition: all 0.2s; box-sizing: border-box;
        }
        .form-input:focus { border-color: #0F5C5C; background: #fff; box-shadow: 0 0 0 3px rgba(15,92,92,0.10); }
        .form-input.err { border-color: #ef4444; }
        .form-textarea {
          width: 100%; background: #f4fafa; border: 1.5px solid #e6f4f4;
          border-radius: 12px; padding: 12px 14px; font-size: 14px;
          color: #1a3333; outline: none; transition: all 0.2s;
          resize: vertical; min-height: 100px; font-family: inherit; box-sizing: border-box;
        }
        .form-textarea:focus { border-color: #0F5C5C; background: #fff; box-shadow: 0 0 0 3px rgba(15,92,92,0.10); }
        .form-textarea.err { border-color: #ef4444; }
        .submit-btn {
          width: 100%; height: 46px; background: #0F5C5C; color: #fff;
          border: none; border-radius: 50px; font-size: 15px;
          font-weight: 700; cursor: pointer; transition: all 0.2s; margin-top: 4px;
        }
        .submit-btn:hover:not(:disabled) { background: #177a7a; }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .new-badge {
          position: absolute; top: 12px; left: 12px;
          background: #2ec4a0; color: #fff; font-size: 10px;
          font-weight: 700; padding: 2px 8px; border-radius: 20px;
        }
        .err-text { color: #ef4444; font-size: 11px; margin-top: 4px; }
        .loc-icon { display: flex; align-items: center; gap: 3px; }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .testi-card { flex: 0 0 85vw; }
        }
        @media (max-width: 580px) {
          .modal-box { padding: 28px 20px; }
          .name-loc-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <p style={{ color: "#0F5C5C", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 8 }}>
            What Patients Say
          </p>
          <h2 style={{ color: "#0a3d3d", fontSize: 34, fontWeight: 800, margin: "0 0 12px", lineHeight: 1.2 }}>
            Trusted by Thousands
          </h2>
          <p style={{ color: "rgba(15,92,92,0.55)", fontSize: 15, maxWidth: 460, margin: "0 auto 24px" }}>
            Real stories from real patients who found the right care at the right time.
          </p>
          <button className="add-btn" onClick={() => setShowModal(true)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Share Your Experience
          </button>
        </div>

        {/* Cards */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#6b9090", fontSize: 14 }}>
            Loading reviews…
          </div>
        ) : (
          <div className="testi-scroll" ref={scrollRef} style={{ marginBottom: 32 }}>
            {testimonials.map((t, i) => {
              const isActive = active === i;
              const initials = getInitials(t.name);
              const color    = t.avatarBg || getAvatarColor(t.name);
              return (
                <div
                  key={t.id}
                  className={`testi-card${isActive ? " active" : ""}`}
                  onClick={() => setActive(i)}
                >
                  {!t.isDefault && <span className="new-badge">New ✨</span>}
                  <div style={{ position: "absolute", top: 14, right: 18, fontSize: 60, lineHeight: 1, color: isActive ? "rgba(255,255,255,0.1)" : "rgba(15,92,92,0.06)", fontFamily: "Georgia,serif", pointerEvents: "none" }}>"</div>

                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                    <div style={{ width: 42, height: 42, borderRadius: "50%", background: isActive ? "rgba(255,255,255,0.2)" : color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 14, flexShrink: 0 }}>
                      {initials}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: isActive ? "#fff" : "#0a3d3d" }}>{t.name}</div>
                      {t.hospital && (
                        <div style={{ fontSize: 11, color: isActive ? "rgba(255,255,255,0.65)" : "#9ca3af", marginTop: 1 }}>
                          Patient · {t.hospital}
                        </div>
                      )}
                      {t.location && (
                        <div className="loc-icon" style={{ fontSize: 11, color: isActive ? "rgba(255,255,255,0.5)" : "#b0c4c4", marginTop: 2 }}>
                          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                            <circle cx="12" cy="9" r="2.5" />
                          </svg>
                          {t.location}
                        </div>
                      )}
                    </div>
                  </div>

                  <Stars rating={t.rating} />

                  <p style={{ marginTop: 12, fontSize: 13, lineHeight: 1.65, color: isActive ? "rgba(255,255,255,0.88)" : "#4b5563" }}>
                    {t.review_text}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* Dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
          {testimonials.map((_, i) => (
            <button key={i} className={`testi-dot${active === i ? " active" : ""}`} onClick={() => setActive(i)} aria-label={`Review ${i + 1}`} />
          ))}
        </div>
      </div>

      {/* ── MODAL ── */}
      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="modal-box">
            {/* Close btn */}
            <button onClick={closeModal} style={{ position: "absolute", top: 16, right: 16, background: "#f4fafa", border: "none", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#6b9090" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12" /></svg>
            </button>

            {submitted ? (
              <div style={{ textAlign: "center", padding: "24px 0" }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#d1fae5", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0F5C5C" strokeWidth="2.5"><path d="M20 6 9 17l-5-5" /></svg>
                </div>
                <h3 style={{ color: "#0a3d3d", fontSize: 20, fontWeight: 800, margin: "0 0 8px" }}>Thank You! 🎉</h3>
                <p style={{ color: "#6b9090", fontSize: 14 }}>Your review is now live for everyone to see.</p>
              </div>
            ) : (
              <>
                <h3 style={{ color: "#0a3d3d", fontSize: 20, fontWeight: 800, margin: "0 0 4px" }}>Share Your Experience</h3>
                <p style={{ color: "#6b9090", fontSize: 13, margin: "0 0 24px" }}>Help others find trusted hospitals near them.</p>

                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {/* Name + Location */}
                  <div className="name-loc-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 600, color: "#2a5252", display: "block", marginBottom: 6 }}>Your Name *</label>
                      <input className={`form-input${errors.name ? " err" : ""}`} placeholder="e.g. Priya Sharma" value={form.name}
                        onChange={(e) => { setForm({ ...form, name: e.target.value }); setErrors({ ...errors, name: "" }); }} />
                      {errors.name && <p className="err-text">{errors.name}</p>}
                    </div>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 600, color: "#2a5252", display: "block", marginBottom: 6 }}>Location *</label>
                      <input className={`form-input${errors.location ? " err" : ""}`} placeholder="e.g. Delhi" value={form.location}
                        onChange={(e) => { setForm({ ...form, location: e.target.value }); setErrors({ ...errors, location: "" }); }} />
                      {errors.location && <p className="err-text">{errors.location}</p>}
                    </div>
                  </div>

                  {/* Hospital */}
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#2a5252", display: "block", marginBottom: 6 }}>
                      Hospital Name <span style={{ color: "#9ca3af", fontWeight: 400 }}>(optional)</span>
                    </label>
                    <input className="form-input" placeholder="e.g. Apollo Hospital" value={form.hospital}
                      onChange={(e) => setForm({ ...form, hospital: e.target.value })} />
                  </div>

                  {/* Stars */}
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#2a5252", display: "block", marginBottom: 8 }}>Your Rating *</label>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <svg key={s} width="32" height="32" viewBox="0 0 24 24"
                          fill={s <= visibleStar ? "#f59e0b" : "none"}
                          stroke={s <= visibleStar ? "#f59e0b" : "#d1d5db"} strokeWidth="2"
                          style={{ cursor: "pointer", transition: "all 0.15s", transform: s <= visibleStar ? "scale(1.12)" : "scale(1)" }}
                          onMouseEnter={() => setHoveredStar(s)}
                          onMouseLeave={() => setHoveredStar(0)}
                          onClick={() => { setForm({ ...form, rating: s }); setErrors({ ...errors, rating: "" }); }}>
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      ))}
                      {form.rating > 0 && (
                        <span style={{ marginLeft: 6, fontSize: 13, color: "#0F5C5C", fontWeight: 600 }}>
                          {["","Poor","Fair","Good","Very Good","Excellent"][form.rating]}
                        </span>
                      )}
                    </div>
                    {errors.rating && <p className="err-text">{errors.rating}</p>}
                  </div>

                  {/* Text */}
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#2a5252", display: "block", marginBottom: 6 }}>Your Review *</label>
                    <textarea className={`form-textarea${errors.review_text ? " err" : ""}`}
                      placeholder="Tell others about your experience…"
                      value={form.review_text}
                      onChange={(e) => { setForm({ ...form, review_text: e.target.value }); setErrors({ ...errors, review_text: "" }); }} />
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                      {errors.review_text ? <p className="err-text" style={{ margin: 0 }}>{errors.review_text}</p> : <span />}
                      <span style={{ fontSize: 11, color: "#9ca3af" }}>{form.review_text.length} chars</span>
                    </div>
                  </div>

                  {/* API error */}
                  {apiError && (
                    <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "10px 14px", color: "#dc2626", fontSize: 13 }}>
                      {apiError}
                    </div>
                  )}

                  <button className="submit-btn" onClick={handleSubmit} disabled={submitting}>
                    {submitting ? "Posting…" : "Post Review →"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}