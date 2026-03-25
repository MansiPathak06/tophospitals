"use client";

import { useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import emailjs from "@emailjs/browser";

// ─────────────────────────────────────────────
//  🔧  REPLACE these with your EmailJS values
//  https://www.emailjs.com/
// ─────────────────────────────────────────────
const EMAILJS_SERVICE_ID  = "service_5plcnyl";
const EMAILJS_TEMPLATE_ID = "template_j3i1mba";
const EMAILJS_PUBLIC_KEY  = "oNwbKEmNd0lRB10Kn";

// ── Icons ─────────────────────────────────────

const PhoneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.18 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 5.49 5.49l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z"/>
  </svg>
);

const MailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);

const LocationIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const ClockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

// ── Contact Info Card ─────────────────────────

const InfoCard = ({ icon, label, value, sub, href }) => (
  <a
    href={href || "#"}
    className="group flex items-start gap-4 p-5 rounded-2xl bg-white border border-[#e0f0f0] hover:border-[#0F5C5C]/30 hover:shadow-lg transition-all duration-300"
  >
    <div className="w-11 h-11 rounded-xl bg-[#e6f4f4] group-hover:bg-[#0F5C5C] flex items-center justify-center text-[#0F5C5C] group-hover:text-white transition-all duration-300 flex-shrink-0">
      {icon}
    </div>
    <div>
      <p className="text-xs font-semibold text-[#0F5C5C]/60 uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-[#1a3333] font-semibold text-sm leading-snug">{value}</p>
      {sub && <p className="text-[#6b9090] text-xs mt-0.5">{sub}</p>}
    </div>
  </a>
);

// ── Social Button ─────────────────────────────

const SocialBtn = ({ href, label, children, color }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-200 hover:scale-110 ${color}`}
  >
    {children}
  </a>
);

// ── Input field ───────────────────────────────

const Field = ({ label, error, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold text-[#2a5252] uppercase tracking-wider">{label}</label>
    {children}
    {error && <p className="text-red-500 text-xs">{error}</p>}
  </div>
);

const inputCls = (err) =>
  `w-full px-4 py-3 rounded-xl text-sm text-[#1a3333] placeholder-[#9bbdbd] bg-[#f6fafa] border ${
    err ? "border-red-400 focus:border-red-400" : "border-[#daeaea] focus:border-[#0F5C5C]/50"
  } outline-none focus:ring-2 ${err ? "focus:ring-red-100" : "focus:ring-[#0F5C5C]/10"} transition-all duration-200`;

// ── Main Page ─────────────────────────────────

export default function ContactPage() {
  const formRef = useRef(null);

  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | success | error

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name    = "Name is required";
    if (!form.email.trim())   e.email   = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.message.trim()) e.message = "Message cannot be empty";
    return e;
  };

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors((p) => ({ ...p, [e.target.name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setStatus("sending");
    try {
      await emailjs.sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        formRef.current,
        EMAILJS_PUBLIC_KEY
      );
      setStatus("success");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#f4fafa]">

        {/* ── Hero banner ── */}
        <section className="bg-[#0F5C5C] relative overflow-hidden py-16 px-6">
          {/* decorative rings */}
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full border-[40px] border-white/5 pointer-events-none" />
          <div className="absolute -bottom-20 -left-10 w-56 h-56 rounded-full border-[32px] border-white/5 pointer-events-none" />

          <div className="max-w-[1280px] mx-auto text-center relative z-10">
            <span className="inline-block bg-[#2ec4a0]/20 text-[#2ec4a0] text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4">
              Get In Touch
            </span>
            <h1 className="text-white text-4xl md:text-5xl font-bold leading-tight mb-4">
              We're Here to <span className="text-[#2ec4a0]">Help You</span>
            </h1>
            <p className="text-white/65 text-base max-w-lg mx-auto">
              Have a question about a hospital, need an appointment, or just want to talk? Reach out — we respond within 24 hours.
            </p>
          </div>
        </section>

        {/* ── Main content ── */}
        <section className="max-w-[1280px] mx-auto px-6 md:px-12 py-16 grid md:grid-cols-[1fr_420px] gap-12 items-start">

          {/* LEFT — Form */}
          <div className="bg-white rounded-3xl shadow-sm border border-[#e0f0f0] p-8 md:p-10">

            {status === "success" ? (
              /* Success state */
              <div className="flex flex-col items-center justify-center text-center py-12 gap-4">
                <div className="w-20 h-20 rounded-full bg-[#e6f4f4] flex items-center justify-center text-[#0F5C5C]">
                  <CheckIcon />
                </div>
                <h2 className="text-2xl font-bold text-[#0F5C5C]">Message Sent!</h2>
                <p className="text-[#6b9090] max-w-xs">
                  Thank you for reaching out. Our team will get back to you within 24 hours.
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="mt-4 px-7 py-2.5 bg-[#0F5C5C] text-white rounded-full text-sm font-semibold hover:bg-[#177a7a] transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-[#1a3333] mb-1">Send Us a Message</h2>
                  <p className="text-[#6b9090] text-sm">Fill in the form and we'll get back to you shortly.</p>
                </div>

                <form ref={formRef} onSubmit={handleSubmit} className="space-y-5" noValidate>
                  {/* Row 1 */}
                  <div className="grid sm:grid-cols-2 gap-5">
                    <Field label="Full Name *" error={errors.name}>
                      <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Rahul Sharma"
                        className={inputCls(errors.name)}
                      />
                    </Field>
                    <Field label="Email Address *" error={errors.email}>
                      <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="rahul@email.com"
                        className={inputCls(errors.email)}
                      />
                    </Field>
                  </div>

                  {/* Row 2 */}
                  <div className="grid sm:grid-cols-2 gap-5">
                    <Field label="Phone Number" error={errors.phone}>
                      <input
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+91 98765 43210"
                        className={inputCls(false)}
                      />
                    </Field>
                    <Field label="Subject" error={errors.subject}>
                      <select
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        className={inputCls(false) + " cursor-pointer"}
                      >
                        <option value="">Select a topic…</option>
                        <option>Find a Hospital</option>
                        <option>Book Appointment</option>
                        <option>General Inquiry</option>
                        <option>Emergency Help</option>
                        <option>Feedback</option>
                      </select>
                    </Field>
                  </div>

                  {/* Message */}
                  <Field label="Message *" error={errors.message}>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={5}
                      placeholder="Tell us how we can help you…"
                      className={inputCls(errors.message) + " resize-none"}
                    />
                  </Field>

                  {/* Error banner */}
                  {status === "error" && (
                    <p className="text-sm text-red-500 bg-red-50 border border-red-200 px-4 py-3 rounded-xl">
                      Something went wrong. Please try again or call us directly.
                    </p>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="w-full h-[50px] bg-[#0F5C5C] hover:bg-[#177a7a] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(15,92,92,0.3)] flex items-center justify-center gap-2 text-sm tracking-wide"
                  >
                    {status === "sending" ? (
                      <>
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                        </svg>
                        Sending…
                      </>
                    ) : (
                      <>
                        Send Message
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                        </svg>
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>

          {/* RIGHT — Info */}
          <div className="flex flex-col gap-6">

            {/* Contact cards */}
            <div className="grid gap-3">
              <InfoCard
                icon={<PhoneIcon />}
                label="Emergency & Helpline"
                value="1800-000-0000 (Toll Free)"
                sub="Available 24 × 7"
                href="tel:+911800000000"
              />
              <InfoCard
                icon={<MailIcon />}
                label="Email Us"
                value="support@tophospitals.in"
                sub="We reply within 24 hours"
                href="mailto:support@tophospitals.in"
              />
              <InfoCard
                icon={<LocationIcon />}
                label="Our Office"
                value="Moradabad, Uttar Pradesh"
                sub="India — 244001"
              />
              <InfoCard
                icon={<ClockIcon />}
                label="Working Hours"
                value="Mon – Sat: 9:00 AM – 7:00 PM"
                sub="Sunday: 10:00 AM – 4:00 PM"
              />
            </div>

            {/* Social links */}
            <div className="bg-white border border-[#e0f0f0] rounded-2xl p-6">
              <p className="text-xs font-bold text-[#0F5C5C]/60 uppercase tracking-widest mb-4">Follow Us</p>
              <div className="flex gap-3">
                <SocialBtn href="#" label="Facebook" color="border-[#1877f2]/30 text-[#1877f2] hover:bg-[#1877f2] hover:text-white hover:border-[#1877f2]">
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                  </svg>
                </SocialBtn>
                <SocialBtn href="#" label="Instagram" color="border-[#e1306c]/30 text-[#e1306c] hover:bg-[#e1306c] hover:text-white hover:border-[#e1306c]">
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                  </svg>
                </SocialBtn>
                <SocialBtn href="#" label="Twitter / X" color="border-[#1da1f2]/30 text-[#1da1f2] hover:bg-[#1da1f2] hover:text-white hover:border-[#1da1f2]">
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
                  </svg>
                </SocialBtn>
                <SocialBtn href="#" label="WhatsApp" color="border-[#25d366]/30 text-[#25d366] hover:bg-[#25d366] hover:text-white hover:border-[#25d366]">
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M11.998 0C5.374 0 0 5.373 0 12c0 2.126.558 4.118 1.528 5.845L.057 23.885l6.224-1.634A11.95 11.95 0 0 0 12 24c6.626 0 12-5.373 12-12S18.624 0 11.998 0zm.002 21.818a9.818 9.818 0 0 1-5.001-1.368l-.36-.214-3.714.975.993-3.62-.236-.373A9.81 9.81 0 0 1 2.18 12c0-5.42 4.4-9.818 9.82-9.818 5.422 0 9.82 4.398 9.82 9.818 0 5.421-4.398 9.818-9.82 9.818z"/>
                  </svg>
                </SocialBtn>
                <SocialBtn href="#" label="YouTube" color="border-[#ff0000]/30 text-[#ff0000] hover:bg-[#ff0000] hover:text-white hover:border-[#ff0000]">
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
                    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/>
                  </svg>
                </SocialBtn>
              </div>
            </div>

            {/* Quick help note */}
            <div className="bg-[#0F5C5C] rounded-2xl p-6 text-white">
              <p className="font-bold text-base mb-1">Need Immediate Help?</p>
              <p className="text-white/65 text-sm mb-4">For medical emergencies, please call immediately.</p>
              <a
                href="tel:112"
                className="inline-flex items-center gap-2 bg-[#2ec4a0] hover:bg-[#26a98a] text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                Call 112 — Emergency
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}