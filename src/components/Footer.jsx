"use client";
import Link from "next/link";

const footerLinks = {
  "Quick Links": [
    { label: "Home", href: "/" },
    { label: "Find Hospitals", href: "/hospitals" },
    { label: "Specialities", href: "/specialities" },
    { label: "Blog", href: "/blogs" },
    { label: "About Us", href: "/about" },
  ],
  "Specialities": [
    { label: "Cardiology", href: "/specialities/cardiology" },
    { label: "Neurology", href: "/specialities/neurology" },
    { label: "Orthopaedics", href: "/specialities/orthopaedics" },
    { label: "Gastroenterology", href: "/specialities/gastroenterology" },
    { label: "Urology", href: "/specialities/urology" },
  ],
  "Support": [
    { label: "Contact Us", href: "/contact" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "FAQ", href: "/faq" },
    { label: "Report an Issue", href: "/report" },
  ],
};

const socials = [
  {
    label: "Facebook",
    href: "#",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: "Twitter",
    href: "#",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "#",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "#",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#0F5C5C" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer style={{ background: "#0a3d3d", color: "#fff" }}>
      <style>{`
        .footer-link {
          color: rgba(255,255,255,0.55);
          text-decoration: none;
          font-size: 14px;
          line-height: 2;
          transition: color 0.15s;
          display: block;
        }
        .footer-link:hover { color: #fff; }
        .social-btn {
          width: 40px; height: 40px;
          border-radius: 10px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          display: flex; align-items: center; justify-content: center;
          color: rgba(255,255,255,0.7);
          cursor: pointer; text-decoration: none;
          transition: all 0.18s;
        }
        .social-btn:hover {
          background: rgba(255,255,255,0.16);
          color: #fff;
          transform: translateY(-2px);
        }
        .footer-divider { border: none; border-top: 1px solid rgba(255,255,255,0.08); margin: 0; }
        @media (max-width: 900px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
          .footer-brand { grid-column: 1 / -1 !important; }
        }
        @media (max-width: 500px) {
          .footer-grid { grid-template-columns: 1fr !important; }
          .footer-bottom { flex-direction: column !important; text-align: center; gap: 10px !important; }
        }
      `}</style>

      {/* Main footer content */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "64px 24px 48px" }}>
        <div className="footer-grid" style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr 1fr", gap: "40px 32px" }}>

          {/* Brand column */}
          <div className="footer-brand">
            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: "linear-gradient(135deg, #14b8a6, #0F5C5C)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.58a16 16 0 0 0 6 6l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <span style={{ color: "#fff", fontWeight: 800, fontSize: 18 }}>NearbyHospitals</span>
            </div>

            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 14, lineHeight: 1.75, marginBottom: 24, maxWidth: 280 }}>
              Connecting patients with verified hospitals across Moradabad and beyond. Find the right care at the right time — 24/7.
            </p>

            {/* Contact info */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
              {[
                { icon: "📍", text: "Moradabad, Uttar Pradesh, India" },
                { icon: "📞", text: "+91 98765 43210" },
                { icon: "✉️", text: "hello@nearbyhospitals.in" },
              ].map((c) => (
                <div key={c.text} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 13 }}>{c.icon}</span>
                  <span style={{ color: "rgba(255,255,255,0.55)", fontSize: 13 }}>{c.text}</span>
                </div>
              ))}
            </div>

            {/* Socials */}
            <div style={{ display: "flex", gap: 10 }}>
              {socials.map((s) => (
                <a key={s.label} href={s.href} className="social-btn" aria-label={s.label}>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 style={{ color: "#fff", fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 20 }}>
                {title}
              </h4>
              <nav>
                {links.map((l) => (
                  <Link key={l.label} href={l.href} className="footer-link">{l.label}</Link>
                ))}
              </nav>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div style={{
          marginTop: 52,
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 16,
          padding: "28px 32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 20,
        }}>
          <div>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 17, marginBottom: 4 }}>
              Get Health Tips in Your Inbox
            </div>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>
              Weekly articles from verified doctors. No spam, ever.
            </div>
          </div>
          <div style={{ display: "flex", gap: 0, borderRadius: 12, overflow: "hidden", border: "1.5px solid rgba(255,255,255,0.15)" }}>
            <input
              type="email"
              placeholder="Your email address"
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "none", outline: "none",
                color: "#fff", fontSize: 13,
                padding: "12px 18px",
                width: 240,
              }}
            />
            <button style={{
              background: "#14b8a6", color: "#fff",
              border: "none", cursor: "pointer",
              fontSize: 13, fontWeight: 700,
              padding: "12px 22px",
              whiteSpace: "nowrap",
            }}>
              Subscribe
            </button>
          </div>
        </div>
      </div>

      <hr className="footer-divider" />

      {/* Bottom bar */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 24px" }}>
        <div className="footer-bottom" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, margin: 0 }}>
            © 2026 NearbyHospitals. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: 20 }}>
            {["Privacy Policy", "Terms", "Cookies"].map((t) => (
              <Link key={t} href="#" style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, textDecoration: "none" }}>
                {t}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}