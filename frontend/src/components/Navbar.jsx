"use client";
import { useState, useEffect, useRef, useCallback } from "react";

// ─── Reverse geocode using free OpenStreetMap Nominatim API ───────────────────
async function reverseGeocode(lat, lng) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
      { headers: { "Accept-Language": "en" } }
    );
    const data = await res.json();
    const addr = data.address || {};
    // Try city → town → village → county → state
    return (
      addr.city ||
      addr.town ||
      addr.village ||
      addr.county ||
      addr.state_district ||
      addr.state ||
      "Unknown"
    );
  } catch {
    return null;
  }
}

// ─── Location storage key ─────────────────────────────────────────────────────
const LOC_KEY = "medi_user_city";

// ─── Icons ────────────────────────────────────────────────────────────────────
const PinIcon = ({ size = 14, pulse = false }) => (
  <span style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
    {pulse && (
      <span style={{
        position: "absolute", width: 20, height: 20, borderRadius: "50%",
        background: "rgba(46,196,160,0.3)", animation: "locPulse 1.8s ease-out infinite",
      }} />
    )}
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  </span>
);

const ChevronDown = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6" /></svg>
);

const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
);

const GPSIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3" /></svg>
);

const XIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
);

// ─── Popular Indian cities for manual pick ────────────────────────────────────
const POPULAR_CITIES = [
  "Delhi", "Mumbai", "Bangalore", "Chennai", "Kolkata", "Hyderabad",
  "Pune", "Ahmedabad", "Jaipur", "Lucknow", "Noida", "Gurgaon",
  "Agra", "Moradabad", "Kanpur", "Varanasi", "Surat", "Indore",
];

// ─── Location Permission Popup ────────────────────────────────────────────────
function LocationPopup({ onAllow, onDismiss }) {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "rgba(10,40,40,0.55)", backdropFilter: "blur(6px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20, animation: "fadeIn 0.2s ease",
    }}>
      <div style={{
        background: "#fff", borderRadius: 24, padding: "36px 32px",
        maxWidth: 400, width: "100%", textAlign: "center",
        boxShadow: "0 24px 80px rgba(15,92,92,0.2)",
        animation: "slideUp 0.28s cubic-bezier(.34,1.56,.64,1)",
      }}>
        {/* Icon */}
        <div style={{
          width: 72, height: 72, borderRadius: "50%",
          background: "linear-gradient(135deg, #e6f4f4, #d1fae5)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 20px", fontSize: 32,
        }}>
          📍
        </div>

        <h3 style={{ color: "#0a3d3d", fontSize: 20, fontWeight: 800, margin: "0 0 8px" }}>
          Find Hospitals Near You
        </h3>
        <p style={{ color: "#6b9090", fontSize: 14, lineHeight: 1.6, margin: "0 0 28px" }}>
          Allow location access to instantly see hospitals in your city. You can always change it manually later.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <button
            onClick={onAllow}
            style={{
              width: "100%", height: 48, background: "#0F5C5C", color: "#fff",
              border: "none", borderRadius: 50, fontSize: 14, fontWeight: 700,
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              boxShadow: "0 4px 16px rgba(15,92,92,0.3)", transition: "all 0.2s",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#177a7a"}
            onMouseLeave={(e) => e.currentTarget.style.background = "#0F5C5C"}
          >
            <GPSIcon /> Allow Location Access
          </button>
          <button
            onClick={onDismiss}
            style={{
              width: "100%", height: 44, background: "#f4fafa",
              border: "1.5px solid #e6f4f4", borderRadius: 50,
              fontSize: 13, color: "#6b9090", cursor: "pointer",
              fontWeight: 600, transition: "all 0.2s",
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = "#0F5C5C"}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = "#e6f4f4"}
          >
            I'll pick manually
          </button>
        </div>

        <p style={{ color: "#b0c4c4", fontSize: 11, marginTop: 16 }}>
          🔒 Your location is never stored on our servers
        </p>
      </div>
    </div>
  );
}

// ─── City Dropdown ────────────────────────────────────────────────────────────
function CityDropdown({ currentCity, onSelect, onDetect, detecting, onClose }) {
  const [search, setSearch] = useState("");
  const ref = useRef(null);

  const filtered = POPULAR_CITIES.filter((c) =>
    c.toLowerCase().includes(search.toLowerCase())
  );

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <div ref={ref} style={{
      position: "absolute", top: "calc(100% + 10px)", left: 0,
      width: 280, background: "#fff",
      border: "1.5px solid #e6f4f4", borderRadius: 18,
      boxShadow: "0 16px 50px rgba(15,92,92,0.15)",
      zIndex: 200, overflow: "hidden",
      animation: "dropIn 0.2s cubic-bezier(.34,1.56,.64,1)",
    }}>
      {/* Header */}
      <div style={{ padding: "14px 14px 10px", borderBottom: "1px solid #f0f8f8" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#0F5C5C", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Select City
          </span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 2 }}>
            <XIcon />
          </button>
        </div>

        {/* Auto-detect button */}
        <button
          onClick={onDetect}
          disabled={detecting}
          style={{
            width: "100%", height: 38, background: detecting ? "#f4fafa" : "linear-gradient(135deg,#0F5C5C,#177a7a)",
            color: detecting ? "#6b9090" : "#fff",
            border: "none", borderRadius: 10, fontSize: 12, fontWeight: 600,
            cursor: detecting ? "not-allowed" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            marginBottom: 10, transition: "all 0.2s",
          }}
        >
          {detecting ? (
            <><span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>⟳</span> Detecting…</>
          ) : (
            <><GPSIcon /> Use My Current Location</>
          )}
        </button>

        {/* Search */}
        <div style={{ position: "relative" }}>
          <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }}>
            <SearchIcon />
          </span>
          <input
            autoFocus
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search city…"
            style={{
              width: "100%", height: 36, background: "#f4fafa",
              border: "1.5px solid #e6f4f4", borderRadius: 10,
              paddingLeft: 30, paddingRight: 10, fontSize: 13,
              color: "#1a3333", outline: "none", boxSizing: "border-box",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => e.target.style.borderColor = "#0F5C5C"}
            onBlur={(e) => e.target.style.borderColor = "#e6f4f4"}
          />
        </div>
      </div>

      {/* City list */}
      <div style={{ maxHeight: 220, overflowY: "auto", padding: "6px 8px" }}>
        {filtered.length === 0 ? (
          <div style={{ padding: "16px", textAlign: "center", color: "#9ca3af", fontSize: 13 }}>
            No city found
          </div>
        ) : (
          filtered.map((city) => (
            <button
              key={city}
              onClick={() => { onSelect(city); onClose(); }}
              style={{
                width: "100%", textAlign: "left", padding: "8px 10px",
                background: city === currentCity ? "#e6f4f4" : "transparent",
                color: city === currentCity ? "#0F5C5C" : "#2a5252",
                border: "none", borderRadius: 8, fontSize: 13,
                fontWeight: city === currentCity ? 700 : 400,
                cursor: "pointer", display: "flex", alignItems: "center",
                justifyContent: "space-between", transition: "background 0.15s",
              }}
              onMouseEnter={(e) => { if (city !== currentCity) e.currentTarget.style.background = "#f4fafa"; }}
              onMouseLeave={(e) => { if (city !== currentCity) e.currentTarget.style.background = "transparent"; }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 11, opacity: 0.5 }}>📍</span> {city}
              </span>
              {city === currentCity && <span style={{ fontSize: 10, color: "#2ec4a0", fontWeight: 800 }}>✓ Active</span>}
            </button>
          ))
        )}
      </div>

      <div style={{ padding: "8px 14px", background: "#f9fefe", borderTop: "1px solid #f0f8f8", fontSize: 10, color: "#b0c4c4" }}>
        💡 Hospitals will filter by selected city
      </div>
    </div>
  );
}

// ─── Main Navbar ──────────────────────────────────────────────────────────────
const Navbar = () => {
  const [menuOpen, setMenuOpen]       = useState(false);
  const [cityDropOpen, setCityDropOpen] = useState(false);
  const [showLocPopup, setShowLocPopup] = useState(false);
  const [city, setCity]               = useState(null);   // null = not set yet
  const [detecting, setDetecting]     = useState(false);
  const cityBtnRef                    = useRef(null);

  // ── On mount: check localStorage, then show popup if first visit ────────────
  useEffect(() => {
    const saved = localStorage.getItem(LOC_KEY);
    if (saved) {
      setCity(saved);
    } else {
      // Show popup after 800ms so page loads first
      const t = setTimeout(() => setShowLocPopup(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  // ── Persist city to localStorage & dispatch event for other components ───────
  const applyCity = useCallback((c) => {
    setCity(c);
    localStorage.setItem(LOC_KEY, c);
    // Dispatch custom event so HospitalsList / any page can react
    window.dispatchEvent(new CustomEvent("cityChanged", { detail: { city: c } }));
  }, []);

  // ── Geolocation detect ────────────────────────────────────────────────────────
  const detectLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setDetecting(true);
    setShowLocPopup(false);

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const detectedCity = await reverseGeocode(coords.latitude, coords.longitude);
        if (detectedCity) {
          applyCity(detectedCity);
        } else {
          alert("Could not detect city. Please select manually.");
        }
        setDetecting(false);
      },
      (err) => {
        console.warn("Geolocation error:", err.message);
        setDetecting(false);
        setShowLocPopup(false);
        setCityDropOpen(true); // fall back to manual picker
      },
      { timeout: 8000 }
    );
  }, [applyCity]);

  // ── Popup handlers ────────────────────────────────────────────────────────────
  const handlePopupAllow  = () => detectLocation();
  const handlePopupDismiss = () => { setShowLocPopup(false); setCityDropOpen(true); };

  return (
    <>
      <style>{`
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes dropIn  { from{opacity:0;transform:translateY(-8px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes locPulse{ 0%{transform:scale(1);opacity:.6} 70%{transform:scale(2.2);opacity:0} 100%{opacity:0} }
        @keyframes spin    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>

      {/* ── Location Permission Popup ── */}
      {showLocPopup && (
        <LocationPopup onAllow={handlePopupAllow} onDismiss={handlePopupDismiss} />
      )}

      <nav className="sticky top-0 z-50 bg-white border-b border-[#0F5C5C]/15 shadow-[0_2px_24px_rgba(15,92,92,0.08)]">

        {/* ── MAIN BAR ── */}
        <div className="max-w-[1280px] mx-auto px-8 h-[72px] flex items-center gap-5">

          {/* LOGO */}
          <a href="/" className="flex items-center flex-shrink-0">
            <img src="/images/logo.png" alt="Hospital Logo" className="h-24 w-24 object-cover" />
          </a>

          {/* ── LOCATION PICKER ── */}
          <div ref={cityBtnRef} style={{ position: "relative" }} className="hidden md:block">
            <button
              onClick={() => setCityDropOpen((v) => !v)}
              style={{
                display: "flex", alignItems: "center", gap: 7,
                height: 40, padding: "0 14px",
                background: city ? "#e6f4f4" : "#f4fafa",
                border: `1.5px solid ${city ? "#0F5C5C" : "#e6f4f4"}`,
                borderRadius: 50, cursor: "pointer",
                transition: "all 0.2s", fontSize: 13, fontWeight: 600,
                color: city ? "#0F5C5C" : "#6b9090",
                minWidth: 140,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#0F5C5C"; e.currentTarget.style.background = "#e6f4f4"; }}
              onMouseLeave={(e) => { if (!cityDropOpen) { e.currentTarget.style.borderColor = city ? "#0F5C5C" : "#e6f4f4"; e.currentTarget.style.background = city ? "#e6f4f4" : "#f4fafa"; } }}
            >
              <PinIcon size={14} pulse={detecting} />
              <span style={{ maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {detecting ? "Detecting…" : city || "Select City"}
              </span>
              <span style={{ marginLeft: "auto", opacity: 0.5, transform: cityDropOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }}>
                <ChevronDown />
              </span>
            </button>

            {cityDropOpen && (
              <CityDropdown
                currentCity={city}
                onSelect={applyCity}
                onDetect={detectLocation}
                detecting={detecting}
                onClose={() => setCityDropOpen(false)}
              />
            )}
          </div>

          {/* NAV LINKS */}
          <div className="hidden md:flex items-center gap-1 ml-auto">
            {["Blogs", "FAQs", "Contact"].map((label) => (
              <a key={label} href={`/${label.toLowerCase()}`}
                className="relative px-[14px] py-2 text-sm font-medium text-[#2a5252] rounded-lg transition-all duration-200 hover:bg-[#e6f4f4] hover:text-[#0F5C5C] group">
                {label}
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-5 h-[2px] bg-[#2ec4a0] rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
              </a>
            ))}
          </div>

          {/* CALL US */}
          <a href="tel:+911800000000"
            className="hidden md:flex items-center gap-2 px-[22px] h-[42px] bg-[#0F5C5C] text-white rounded-full text-[13.5px] font-semibold tracking-wide shadow-[0_4px_16px_rgba(15,92,92,0.28)] transition-all duration-200 hover:bg-[#177a7a] hover:shadow-[0_6px_22px_rgba(15,92,92,0.38)] hover:-translate-y-px active:translate-y-0 ml-2 flex-shrink-0">
            <span className="w-2 h-2 rounded-full bg-[#2ec4a0] animate-pulse" />
            Call Us
          </a>

          {/* HAMBURGER */}
          <button className="md:hidden ml-auto flex flex-col justify-center gap-[5px] w-9 h-9 bg-transparent border-none cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            <span className={`block w-6 h-0.5 bg-[#0F5C5C] rounded transition-all duration-300 origin-center ${menuOpen ? "translate-y-[7px] rotate-45" : ""}`} />
            <span className={`block w-6 h-0.5 bg-[#0F5C5C] rounded transition-all duration-300 ${menuOpen ? "opacity-0" : "opacity-100"}`} />
            <span className={`block w-6 h-0.5 bg-[#0F5C5C] rounded transition-all duration-300 origin-center ${menuOpen ? "-translate-y-[7px] -rotate-45" : ""}`} />
          </button>
        </div>

        {/* ── MOBILE MENU ── */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-[#0F5C5C]/15 px-6 pb-5 pt-4 flex flex-col gap-2">

            {/* Mobile location picker */}
            <div style={{ marginBottom: 4 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#6b9090", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
                Your Location
              </p>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={detectLocation}
                  disabled={detecting}
                  style={{
                    flex: 1, height: 40, background: "#0F5C5C", color: "#fff",
                    border: "none", borderRadius: 10, fontSize: 12, fontWeight: 600,
                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  }}
                >
                  {detecting ? "Detecting…" : <><GPSIcon /> Detect Location</>}
                </button>
                <div style={{ position: "relative", flex: 2 }}>
                  <select
                    value={city || ""}
                    onChange={(e) => applyCity(e.target.value)}
                    style={{
                      width: "100%", height: 40, background: "#f4fafa",
                      border: "1.5px solid #e6f4f4", borderRadius: 10,
                      padding: "0 10px", fontSize: 13, color: "#1a3333",
                      outline: "none", appearance: "none",
                    }}
                  >
                    <option value="">Pick a city…</option>
                    {POPULAR_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              {city && (
                <p style={{ fontSize: 11, color: "#2ec4a0", fontWeight: 600, marginTop: 5 }}>
                  ✓ Showing hospitals in {city}
                </p>
              )}
            </div>

            {["Blogs", "FAQs", "Contact"].map((label) => (
              <a key={label} href={`/${label.toLowerCase()}`}
                className="px-3 py-2.5 text-sm font-medium text-[#2a5252] rounded-lg hover:bg-[#e6f4f4] hover:text-[#0F5C5C] transition-colors duration-200">
                {label}
              </a>
            ))}
            <a href="tel:+911800000000"
              className="mt-2 flex justify-center items-center gap-2 h-[42px] bg-[#0F5C5C] text-white rounded-full text-[13.5px] font-semibold tracking-wide shadow-[0_4px_16px_rgba(15,92,92,0.28)] hover:bg-[#177a7a] transition-all duration-200">
              <span className="w-2 h-2 rounded-full bg-[#2ec4a0] animate-pulse" />
              Call Us
            </a>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;