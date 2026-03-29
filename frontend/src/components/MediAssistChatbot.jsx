"use client";

import { useState, useRef, useEffect, useCallback } from "react";

// ─── Quick replies ─────────────────────────────────────────────────────────────
const QUICK_REPLIES = [
  "Compare hospitals near me",
  "Find hospital by speciality",
  "Emergency contacts",
  "Top rated hospitals",
];

// ─── Icons ─────────────────────────────────────────────────────────────────────
const BotIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="10" rx="2" />
    <path d="M12 11V7" /><circle cx="12" cy="5" r="2" />
    <path d="M8 15h.01M12 15h.01M16 15h.01" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);
const SendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
);
const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
);
const MinimizeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14" /></svg>
);
const CompareIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
  </svg>
);
const StarIcon = ({ filled }) => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill={filled ? "#f59e0b" : "none"} stroke="#f59e0b" strokeWidth="2">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

// ─── Helpers ───────────────────────────────────────────────────────────────────
const formatMessage = (text) =>
  text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/\n/g, "<br/>");

function StarRating({ rating }) {
  return (
    <div style={{ display: "flex", gap: 1 }}>
      {[1, 2, 3, 4, 5].map((s) => <StarIcon key={s} filled={s <= Math.round(rating || 0)} />)}
    </div>
  );
}

// ─── Hospital Compare Card ─────────────────────────────────────────────────────
function CompareCard({ hospitals, condition }) {
  if (!hospitals || hospitals.length === 0) return null;

  const fields = [
    { key: "rating",      label: "Rating",      format: (v) => v ? `${v}/5` : "N/A" },
    { key: "city",        label: "Location",    format: (v) => v || "N/A" },
    { key: "phone",       label: "Phone",       format: (v) => v || "N/A" },
    { key: "specialities",label: "Specialities",format: (v) => v || "N/A" },
    { key: "fees",        label: "Est. Fees",   format: (v) => v ? `₹${v}` : "Contact" },
    { key: "emergency",   label: "Emergency",   format: (v) => v ? "✅ 24/7" : "❌ No" },
  ];

  // Pick best for each field
  const getBest = (key) => {
    if (key === "rating") return Math.max(...hospitals.map((h) => parseFloat(h.rating) || 0));
    if (key === "fees") return Math.min(...hospitals.map((h) => parseFloat(h.fees) || Infinity));
    return null;
  };

  return (
    <div style={{
      background: "#fff",
      border: "1.5px solid #e6f4f4",
      borderRadius: 16,
      overflow: "hidden",
      margin: "8px 0",
      fontSize: 12,
      boxShadow: "0 4px 20px rgba(15,92,92,0.10)",
    }}>
      {/* Header */}
      <div style={{ background: "#0F5C5C", padding: "10px 14px", display: "flex", alignItems: "center", gap: 6 }}>
        <CompareIcon />
        <span style={{ color: "#fff", fontWeight: 700, fontSize: 12 }}>
          Hospital Comparison {condition ? `· ${condition}` : ""}
        </span>
        <span style={{ marginLeft: "auto", background: "rgba(255,255,255,0.15)", color: "#fff", fontSize: 10, padding: "2px 8px", borderRadius: 20, fontWeight: 600 }}>
          ✨ Smart Compare
        </span>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f4fafa" }}>
              <th style={{ padding: "8px 12px", textAlign: "left", color: "#6b9090", fontWeight: 600, fontSize: 11, borderBottom: "1px solid #e6f4f4", minWidth: 80 }}>
                Feature
              </th>
              {hospitals.map((h, i) => (
                <th key={i} style={{ padding: "8px 12px", textAlign: "center", borderBottom: "1px solid #e6f4f4", minWidth: 120 }}>
                  <div style={{ color: "#0F5C5C", fontWeight: 700, fontSize: 12 }}>{h.name}</div>
                  {h.rating && <StarRating rating={h.rating} />}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {fields.map((f, fi) => {
              const best = getBest(f.key);
              return (
                <tr key={f.key} style={{ background: fi % 2 === 0 ? "#fff" : "#f9fefe" }}>
                  <td style={{ padding: "7px 12px", color: "#4b7070", fontWeight: 600, fontSize: 11, borderBottom: "1px solid #f0f8f8" }}>
                    {f.label}
                  </td>
                  {hospitals.map((h, i) => {
                    const val = h[f.key];
                    const isBest = best !== null && (
                      (f.key === "rating" && parseFloat(val) === best) ||
                      (f.key === "fees" && parseFloat(val) === best)
                    );
                    return (
                      <td key={i} style={{ padding: "7px 12px", textAlign: "center", borderBottom: "1px solid #f0f8f8" }}>
                        <span style={{
                          background: isBest ? "#d1fae5" : "transparent",
                          color: isBest ? "#065f46" : "#1a3333",
                          fontWeight: isBest ? 700 : 400,
                          padding: isBest ? "2px 6px" : 0,
                          borderRadius: 6,
                          fontSize: 11,
                        }}>
                          {f.format(val)}
                          {isBest && " 🏆"}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={{ padding: "8px 14px", background: "#f4fafa", color: "#6b9090", fontSize: 10, borderTop: "1px solid #e6f4f4" }}>
        🏆 Highlighted cells indicate the best value · Fees are estimates, please confirm with the hospital
      </div>
    </div>
  );
}

// ─── Typing dots ───────────────────────────────────────────────────────────────
const TypingDots = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "10px 14px" }}>
    {[0, 1, 2].map((i) => (
      <span key={i} style={{
        width: 7, height: 7, borderRadius: "50%", background: "rgba(15,92,92,0.3)",
        display: "inline-block", animation: "bounce 1s infinite",
        animationDelay: `${i * 0.18}s`,
      }} />
    ))}
  </div>
);

const Avatar = () => (
  <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#0F5C5C", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "#fff", marginTop: 2 }}>
    <BotIcon size={13} />
  </div>
);

// ─── Main chatbot ──────────────────────────────────────────────────────────────
export default function MediAssistChatbot() {
  const [open, setOpen]           = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages]   = useState([{
    role: "assistant",
    content: "Hi! I'm **MediAssist** 👋\nI can help you **compare hospitals** by rating, fees, specialities & facilities — just tell me what you're looking for or what condition you need treated.",
    id: 0,
  }]);
  const [input, setInput]         = useState("");
  const [loading, setLoading]     = useState(false);
  const [unread, setUnread]       = useState(false);
  const [hospitals, setHospitals] = useState([]);
  const [compareData, setCompareData] = useState(null); // { hospitals, condition }

  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  // ── Fetch hospitals from your backend ────────────────────────────────────────
  useEffect(() => {
    fetch("http://localhost:5000/api/hospitals")
      .then((r) => r.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : data.data || [];
        setHospitals(list);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (open && !minimized) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      setUnread(false);
    }
  }, [messages, open, minimized]);

  useEffect(() => {
    if (open && !minimized) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open, minimized]);

  // ── Build hospital context for AI ────────────────────────────────────────────
  const buildHospitalContext = useCallback(() => {
    if (!hospitals.length) return "No hospital data available yet.";
    return hospitals.map((h) =>
      `- **${h.name}** | City: ${h.city || "N/A"} | Rating: ${h.rating || "N/A"}/5 | Phone: ${h.phone || "N/A"} | Specialities: ${h.specialities || h.specialization || "General"} | Emergency: ${h.emergency_services ? "Yes" : "No"} | Est. Fees: ${h.fees ? "₹" + h.fees : "Contact hospital"}`
    ).join("\n");
  }, [hospitals]);

  // ── Detect compare intent & extract hospitals ─────────────────────────────────
  const detectCompare = useCallback((userMsg, aiReply) => {
    const compareKeywords = ["compare", "comparison", "vs", "versus", "better", "difference between", "which is better", "best hospital for"];
    const isCompareIntent = compareKeywords.some((k) => userMsg.toLowerCase().includes(k));
    if (!isCompareIntent) return null;

    // Find hospitals mentioned in AI reply or user message
    const combined = (userMsg + " " + aiReply).toLowerCase();
    const matched = hospitals.filter((h) =>
      combined.includes(h.name.toLowerCase()) ||
      (h.city && combined.includes(h.city.toLowerCase()))
    ).slice(0, 3);

    // Extract condition/speciality from message
    const conditionMatch = userMsg.match(/for\s+([\w\s]+?)(?:\s+hospital|\s+treatment|$|\?)/i);
    const condition = conditionMatch ? conditionMatch[1].trim() : null;

    return matched.length >= 2 ? { hospitals: matched, condition } : null;
  }, [hospitals]);

  // ── Send message ──────────────────────────────────────────────────────────────
  const sendMessage = async (text) => {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;

    const hospitalContext = buildHospitalContext();

    const systemPrompt = `You are MediAssist, a smart and empathetic AI assistant for a hospital finder platform in India.
Your PRIMARY role is helping patients find and COMPARE hospitals from the database below.

HOSPITAL DATABASE (use ONLY this data):
${hospitalContext}

YOUR KEY FEATURES:
1. **Hospital Comparison** — When asked to compare, list hospitals side by side covering: rating, location, specialities, fees, emergency availability. This is your MOST IMPORTANT feature. Always highlight the best option for the user's specific condition.
2. **Condition-based Matching** — If user mentions a condition (e.g. "heart problem", "cancer", "fracture"), match them to hospitals with relevant specialities.
3. **Rating Comparison** — Always mention ratings when comparing. Highlight the highest rated.
4. **Fee Comparison** — If fee data exists, compare costs. If not, say "Contact hospital for fee details."
5. **Facilities** — Mention emergency services, specialities available.

RULES:
- ONLY recommend hospitals from the database above. Never invent hospitals.
- If no hospitals match the city/condition, say so honestly and show what's available.
- For comparisons, structure your reply clearly with hospital names bolded.
- Keep responses concise and warm.
- If someone describes an emergency, tell them to call 112 immediately.
- Never diagnose conditions. Always recommend consulting a doctor.`;

    const apiHistory = messages.map(({ role, content }) => ({ role, content }));
    const nextHistory = [...apiHistory, { role: "user", content: msg }];

    setMessages((prev) => [...prev, { role: "user", content: msg, id: Date.now() }]);
    setInput("");
    setLoading(true);
    setCompareData(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextHistory, systemPrompt }),
      });
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const data = await res.json();
      if (data?.error) throw new Error(data.error?.message || "API error");
      const reply = data?.choices?.[0]?.message?.content;
      if (!reply) throw new Error("Empty response");

      // Check if compare card should show
      const compare = detectCompare(msg, reply);
      if (compare) setCompareData(compare);

      setMessages((prev) => [...prev, { role: "assistant", content: reply, id: Date.now(), showCompare: !!compare }]);
      if (!open || minimized) setUnread(true);
    } catch (err) {
      let userMsg = "Sorry, something went wrong. Please try again.";
      if (err.message.includes("401")) userMsg = "Authentication error. Please contact support.";
      else if (err.message.includes("429")) userMsg = "Too many requests — please wait a moment.";
      setMessages((prev) => [...prev, { role: "assistant", content: `⚠️ ${userMsg}`, id: Date.now() }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes chatUp { from{opacity:0;transform:translateY(20px) scale(0.96)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes msgIn  { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        @keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} }
        @keyframes pulseRing { 0%{transform:scale(1);opacity:.7} 70%{transform:scale(1.8);opacity:0} 100%{transform:scale(1.8);opacity:0} }
        .chat-up{animation:chatUp .28s cubic-bezier(.34,1.56,.64,1)}
        .msg-in{animation:msgIn .22s ease}
        .pulse-ring::before{content:'';position:absolute;inset:0;border-radius:9999px;background:#2ec4a0;animation:pulseRing 2s ease-out infinite}
        .chat-scroll::-webkit-scrollbar{width:3px}
        .chat-scroll::-webkit-scrollbar-thumb{background:#c8e6e6;border-radius:4px}
        .compare-badge{background:linear-gradient(135deg,#0F5C5C,#2ec4a0);color:#fff;font-size:10px;font-weight:700;padding:3px 9px;border-radius:20px;display:inline-flex;align-items:center;gap:4px;margin-bottom:6px}
      `}</style>

      <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 12, fontFamily: "system-ui, sans-serif" }}>

        {/* Minimized pill */}
        {open && minimized && (
          <button onClick={() => setMinimized(false)} className="chat-up"
            style={{ display: "flex", alignItems: "center", gap: 12, background: "#0F5C5C", color: "#fff", padding: "10px 16px", borderRadius: 20, border: "none", cursor: "pointer", boxShadow: "0 8px 30px rgba(15,92,92,0.35)" }}>
            <div style={{ width: 32, height: 32, background: "rgba(255,255,255,0.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}><BotIcon size={16} /></div>
            <div style={{ textAlign: "left" }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 700 }}>MediAssist</p>
              <p style={{ margin: 0, fontSize: 11, opacity: 0.6 }}>Click to open</p>
            </div>
            {unread && <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#2ec4a0" }} />}
          </button>
        )}

        {/* Chat window */}
        {open && !minimized && (
          <div className="chat-up" style={{ width: 390, height: 560, background: "#fff", borderRadius: 24, boxShadow: "0 20px 60px rgba(15,92,92,0.18)", border: "1.5px solid #daeaea", display: "flex", flexDirection: "column", overflow: "hidden" }}>

            {/* Header */}
            <div style={{ background: "#0F5C5C", padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
              <div style={{ position: "relative", width: 36, height: 36, background: "rgba(255,255,255,0.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", flexShrink: 0 }}>
                <BotIcon size={17} />
                <span style={{ position: "absolute", bottom: -1, right: -1, width: 12, height: 12, background: "#2ec4a0", borderRadius: "50%", border: "2px solid #0F5C5C" }} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, color: "#fff", fontSize: 14, fontWeight: 700 }}>MediAssist</p>
                <p style={{ margin: 0, color: "#2ec4a0", fontSize: 11 }}>
                  🏥 Hospital Compare AI · {hospitals.length} hospitals loaded
                </p>
              </div>
              {/* Compare badge */}
              <div style={{ background: "rgba(46,196,160,0.2)", border: "1px solid rgba(46,196,160,0.4)", borderRadius: 8, padding: "3px 8px", display: "flex", alignItems: "center", gap: 4 }}>
                <CompareIcon />
                <span style={{ color: "#2ec4a0", fontSize: 10, fontWeight: 700 }}>COMPARE</span>
              </div>
              <button onClick={() => setMinimized(true)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", padding: 6, borderRadius: 8, display: "flex" }}><MinimizeIcon /></button>
              <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", padding: 6, borderRadius: 8, display: "flex" }}><CloseIcon /></button>
            </div>

            {/* Feature highlight bar */}
            <div style={{ background: "linear-gradient(90deg, #e6faf6, #f0fafa)", borderBottom: "1px solid #d1fae5", padding: "6px 14px", display: "flex", gap: 10, alignItems: "center", overflowX: "auto", flexShrink: 0 }}>
              {["⭐ Compare Ratings", "💰 Compare Fees", "🏥 Match Speciality", "🚨 Emergency Filter"].map((f) => (
                <span key={f} style={{ fontSize: 10, fontWeight: 600, color: "#0F5C5C", whiteSpace: "nowrap", background: "rgba(15,92,92,0.07)", padding: "3px 8px", borderRadius: 20 }}>
                  {f}
                </span>
              ))}
            </div>

            {/* Messages */}
            <div className="chat-scroll" style={{ flex: 1, overflowY: "auto", padding: "14px 14px", display: "flex", flexDirection: "column", gap: 10, background: "#f6fafa" }}>
              {messages.map((m, idx) => (
                <div key={m.id} className="msg-in">
                  <div style={{ display: "flex", gap: 8, justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                    {m.role === "assistant" && <Avatar />}
                    <div style={{
                      maxWidth: "80%",
                      padding: "10px 14px",
                      borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                      background: m.role === "user" ? "#0F5C5C" : "#fff",
                      color: m.role === "user" ? "#fff" : "#1a3333",
                      fontSize: 13,
                      lineHeight: 1.6,
                      boxShadow: m.role === "assistant" ? "0 2px 8px rgba(15,92,92,0.08)" : "none",
                      border: m.role === "assistant" ? "1px solid #e4f0f0" : "none",
                    }}
                      dangerouslySetInnerHTML={{ __html: formatMessage(m.content) }}
                    />
                  </div>
                  {/* Show compare card after the relevant assistant message */}
                  {m.showCompare && compareData && (
                    <div style={{ marginTop: 8 }}>
                      <CompareCard hospitals={compareData.hospitals} condition={compareData.condition} />
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="msg-in" style={{ display: "flex", gap: 8 }}>
                  <Avatar />
                  <div style={{ background: "#fff", borderRadius: "18px 18px 18px 4px", border: "1px solid #e4f0f0", boxShadow: "0 2px 8px rgba(15,92,92,0.08)" }}>
                    <TypingDots />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Quick replies */}
            {messages.length === 1 && !loading && (
              <div style={{ padding: "10px 12px", display: "flex", flexWrap: "wrap", gap: 6, borderTop: "1px solid #eaf4f4", background: "#f6fafa", flexShrink: 0 }}>
                {QUICK_REPLIES.map((q) => (
                  <button key={q} onClick={() => sendMessage(q)} style={{
                    fontSize: 11, fontWeight: 600, background: "#fff",
                    border: "1.5px solid rgba(15,92,92,0.2)", color: "#0F5C5C",
                    padding: "5px 11px", borderRadius: 20, cursor: "pointer", transition: "all 0.15s",
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "#0F5C5C"; e.currentTarget.style.color = "#fff"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#0F5C5C"; }}
                  >{q}</button>
                ))}
              </div>
            )}

            {/* Input */}
            <div style={{ padding: "10px 12px", background: "#fff", borderTop: "1px solid #eaf4f4", display: "flex", alignItems: "flex-end", gap: 8, flexShrink: 0 }}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder="Compare hospitals, ask about specialities…"
                rows={1}
                style={{ flex: 1, fontSize: 13, color: "#1a3333", outline: "none", background: "#f6fafa", border: "1.5px solid #daeaea", borderRadius: 18, padding: "9px 14px", resize: "none", maxHeight: 80, lineHeight: 1.5, fontFamily: "inherit" }}
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                style={{ width: 40, height: 40, borderRadius: "50%", background: "#0F5C5C", color: "#fff", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, opacity: (!input.trim() || loading) ? 0.4 : 1, transition: "all 0.2s" }}
              >
                <SendIcon />
              </button>
            </div>

            <p style={{ textAlign: "center", fontSize: 10, color: "#b0c4c4", padding: "5px 0", background: "#fff", margin: 0 }}>
              Not a substitute for professional medical advice
            </p>
          </div>
        )}

        {/* FAB */}
        {!open && (
          <button
            onClick={() => setOpen(true)}
            className="pulse-ring"
            style={{ position: "relative", width: 56, height: 56, background: "#0F5C5C", color: "#fff", borderRadius: "50%", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 30px rgba(15,92,92,0.4)", transition: "all 0.2s" }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.1)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
          >
            <BotIcon size={22} />
            {unread && (
              <span style={{ position: "absolute", top: -2, right: -2, width: 16, height: 16, background: "#2ec4a0", borderRadius: "50%", border: "2px solid #fff", fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>!</span>
            )}
          </button>
        )}
      </div>
    </>
  );
}