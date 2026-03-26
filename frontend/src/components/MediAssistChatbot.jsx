"use client";

import { useState, useRef, useEffect } from "react";

const QUICK_REPLIES = [
  "Find nearby hospitals",
  "Book an appointment",
  "Emergency contacts",
  "Available specialities",
];

const BotIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="10" rx="2" />
    <path d="M12 11V7" />
    <circle cx="12" cy="5" r="2" />
    <path d="M8 15h.01M12 15h.01M16 15h.01" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

const SendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
  </svg>
);

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

const MinimizeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M5 12h14" />
  </svg>
);

const CrosshairIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
  </svg>
);

const formatMessage = (text) =>
  text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/\n/g, "<br/>");

async function sendToAPI(messages) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });

  if (!res.ok) {
    let errMsg = `Server error ${res.status}`;
    try {
      const errData = await res.json();
      errMsg = errData?.error || errMsg;
    } catch {}
    throw new Error(errMsg);
  }

  const data = await res.json();
  if (data?.error) throw new Error(data.error?.message || "API error");
  const content = data?.choices?.[0]?.message?.content;
  if (!content) throw new Error("Empty response from AI");
  return content;
}

const TypingDots = () => (
  <div className="flex items-center gap-1 px-4 py-3">
    {[0, 1, 2].map((i) => (
      <span key={i} style={{ animationDelay: `${i * 0.18}s` }}
        className="w-2 h-2 rounded-full bg-[#0F5C5C]/30 animate-bounce" />
    ))}
  </div>
);

const Avatar = () => (
  <div className="w-7 h-7 rounded-full bg-[#0F5C5C] flex items-center justify-center flex-shrink-0 text-white mt-0.5">
    <BotIcon size={13} />
  </div>
);

export default function MediAssistChatbot() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState([{
    role: "assistant",
    content: "Hi! I'm **MediAssist** 👋\nHow can I help you today? You can ask me about hospitals, specialities, or appointments.",
    id: 0,
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open && !minimized) { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); setUnread(false); }
  }, [messages, open, minimized]);

  useEffect(() => {
    if (open && !minimized) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open, minimized]);

  const sendMessage = async (text) => {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;
    const apiHistory = messages.map(({ role, content }) => ({ role, content }));
    const nextHistory = [...apiHistory, { role: "user", content: msg }];
    setMessages((prev) => [...prev, { role: "user", content: msg, id: Date.now() }]);
    setInput("");
    setLoading(true);
    try {
      const reply = await sendToAPI(nextHistory);
      setMessages((prev) => [...prev, { role: "assistant", content: reply, id: Date.now() }]);
      if (!open || minimized) setUnread(true);
    } catch (err) {
      console.error("MediAssist error:", err.message);
      let userMsg = "Sorry, something went wrong. Please try again.";
      if (err.message.includes("401")) userMsg = "Authentication error. Please contact support.";
      else if (err.message.includes("429")) userMsg = "Too many requests — please wait a moment.";
      else if (err.message.includes("500")) userMsg = "Server error. Please try again shortly.";
      else if (err.message.includes("fetch") || err.message.includes("Network")) userMsg = "Network error. Check your internet connection.";
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
        @keyframes pulseRing { 0%{transform:scale(1);opacity:.7} 70%{transform:scale(1.8);opacity:0} 100%{transform:scale(1.8);opacity:0} }
        .chat-up{animation:chatUp .28s cubic-bezier(.34,1.56,.64,1)}
        .msg-in{animation:msgIn .22s ease}
        .pulse-ring::before{content:'';position:absolute;inset:0;border-radius:9999px;background:#2ec4a0;animation:pulseRing 2s ease-out infinite}
        .chat-scroll::-webkit-scrollbar{width:3px}
        .chat-scroll::-webkit-scrollbar-thumb{background:#c8e6e6;border-radius:4px}
      `}</style>
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-3 font-sans">
        {open && minimized && (
          <button onClick={() => setMinimized(false)}
            className="chat-up flex items-center gap-3 bg-[#0F5C5C] text-white px-4 py-3 rounded-2xl shadow-2xl hover:bg-[#177a7a] transition-colors">
            <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center"><BotIcon size={16} /></div>
            <div className="text-left">
              <p className="text-sm font-semibold leading-none">MediAssist</p>
              <p className="text-[11px] text-white/60 mt-0.5">Click to open</p>
            </div>
            {unread && <span className="w-2.5 h-2.5 rounded-full bg-[#2ec4a0] animate-pulse" />}
          </button>
        )}
        {open && !minimized && (
          <div className="chat-up flex flex-col rounded-3xl shadow-2xl overflow-hidden border border-[#daeaea]"
            style={{ width: 370, height: 530, background: "#fff" }}>
            <div className="bg-[#0F5C5C] px-5 py-3.5 flex items-center gap-3 flex-shrink-0">
              <div className="relative w-9 h-9 bg-white/10 rounded-full flex items-center justify-center text-white flex-shrink-0">
                <BotIcon size={17} />
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#2ec4a0] rounded-full border-2 border-[#0F5C5C]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-bold leading-none">MediAssist</p>
                <p className="text-[#2ec4a0] text-[11px] mt-0.5 flex items-center gap-1"><CrosshairIcon /> AI Health Assistant · Online</p>
              </div>
              <button onClick={() => setMinimized(true)} className="text-white/50 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"><MinimizeIcon /></button>
              <button onClick={() => setOpen(false)} className="text-white/50 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"><CloseIcon /></button>
            </div>
            <div className="flex-1 overflow-y-auto chat-scroll px-4 py-4 space-y-3" style={{ background: "#f6fafa" }}>
              {messages.map((m) => (
                <div key={m.id} className={`msg-in flex gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  {m.role === "assistant" && <Avatar />}
                  <div
                    className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${m.role === "user" ? "bg-[#0F5C5C] text-white rounded-tr-sm" : "bg-white text-[#1a3333] rounded-tl-sm shadow-sm border border-[#e4f0f0]"}`}
                    dangerouslySetInnerHTML={{ __html: formatMessage(m.content) }} />
                </div>
              ))}
              {loading && (
                <div className="msg-in flex gap-2 justify-start">
                  <Avatar />
                  <div className="bg-white rounded-2xl rounded-tl-sm shadow-sm border border-[#e4f0f0]"><TypingDots /></div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
            {messages.length === 1 && !loading && (
              <div className="px-4 py-2.5 flex flex-wrap gap-1.5 border-t border-[#eaf4f4]" style={{ background: "#f6fafa" }}>
                {QUICK_REPLIES.map((q) => (
                  <button key={q} onClick={() => sendMessage(q)}
                    className="text-[11px] font-medium bg-white border border-[#0F5C5C]/25 text-[#0F5C5C] px-3 py-1.5 rounded-full hover:bg-[#0F5C5C] hover:text-white transition-all">{q}</button>
                ))}
              </div>
            )}
            <div className="px-3 py-3 bg-white border-t border-[#eaf4f4] flex items-end gap-2 flex-shrink-0">
              <textarea ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder="Type a message…" rows={1} style={{ lineHeight: 1.5, maxHeight: 80, resize: "none" }}
                className="flex-1 text-sm text-[#1a3333] placeholder-gray-400 outline-none bg-[#f6fafa] border border-[#daeaea] focus:border-[#0F5C5C]/40 rounded-2xl px-4 py-2.5 transition-colors" />
              <button onClick={() => sendMessage()} disabled={!input.trim() || loading}
                className="w-10 h-10 rounded-full bg-[#0F5C5C] text-white flex items-center justify-center hover:bg-[#177a7a] disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:scale-105 flex-shrink-0">
                <SendIcon />
              </button>
            </div>
            <p className="text-center text-[10px] text-gray-400 py-1.5 bg-white leading-none">Not a substitute for professional medical advice</p>
          </div>
        )}
        {!open && (
          <button onClick={() => setOpen(true)}
            className="relative w-14 h-14 bg-[#0F5C5C] hover:bg-[#177a7a] text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 pulse-ring">
            <BotIcon size={22} />
            {unread && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#2ec4a0] rounded-full border-2 border-white text-[9px] font-bold flex items-center justify-center text-white">!</span>
            )}
          </button>
        )}
      </div>
    </>
  );
}