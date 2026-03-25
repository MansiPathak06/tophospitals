"use client";
import { useState } from "react";


const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-[#0F5C5C]/15 shadow-[0_2px_24px_rgba(15,92,92,0.08)]">

      {/* ── MAIN BAR ── */}
      <div className="max-w-[1280px] mx-auto px-8 h-[72px] flex items-center gap-7">

        {/* LOGO */}
        <a href="/" className="flex items-center flex-shrink-0">
          <img src="/images/logo.png" alt="Hospital Logo" className="h-24 w-24 object-cover" />
        </a>

       

        {/* NAV LINKS */}
        <div className="hidden md:flex items-center gap-1 ml-auto">
          <a
            href="/blogs"
            className="relative px-[14px] py-2 text-sm font-medium text-[#2a5252] rounded-lg transition-all duration-200 hover:bg-[#e6f4f4] hover:text-[#0F5C5C] group"
          >
            Blogs
            <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-5 h-[2px] bg-[#2ec4a0] rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
          </a>
          <a
            href="/contact"
            className="relative px-[14px] py-2 text-sm font-medium text-[#2a5252] rounded-lg transition-all duration-200 hover:bg-[#e6f4f4] hover:text-[#0F5C5C] group"
          >
            Contact
            <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-5 h-[2px] bg-[#2ec4a0] rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
          </a>
        </div>

        {/* CALL US BUTTON */}
        <a
          href="tel:+911800000000"
          className="hidden md:flex items-center gap-2 px-[22px] h-[42px] bg-[#0F5C5C] text-white rounded-full text-[13.5px] font-semibold tracking-wide shadow-[0_4px_16px_rgba(15,92,92,0.28)] transition-all duration-200 hover:bg-[#177a7a] hover:shadow-[0_6px_22px_rgba(15,92,92,0.38)] hover:-translate-y-px active:translate-y-0 ml-2 flex-shrink-0"
        >
          <span className="w-2 h-2 rounded-full bg-[#2ec4a0] animate-pulse" />
          Call Us
        </a>

        {/* HAMBURGER */}
        <button
          className="md:hidden ml-auto flex flex-col justify-center gap-[5px] w-9 h-9 bg-transparent border-none cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className={`block w-6 h-0.5 bg-[#0F5C5C] rounded transition-all duration-300 origin-center ${
              menuOpen ? "translate-y-[7px] rotate-45" : ""
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-[#0F5C5C] rounded transition-all duration-300 ${
              menuOpen ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-[#0F5C5C] rounded transition-all duration-300 origin-center ${
              menuOpen ? "-translate-y-[7px] -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {/* ── MOBILE MENU ── */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-[#0F5C5C]/15 px-6 pb-5 pt-4 flex flex-col gap-1">
          {/* Mobile Search */}
          <div className="relative mb-2">
            <svg
              className="absolute left-[15px] top-1/2 -translate-y-1/2 text-[#6b9090] pointer-events-none"
              xmlns="http://www.w3.org/2000/svg"
              width="16" height="16"
              fill="none" viewBox="0 0 24 24"
              stroke="currentColor" strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="search"
              placeholder="Search doctors, services…"
              className="w-full h-[42px] bg-[#e6f4f4] border border-[#0F5C5C]/15 rounded-full pl-11 pr-4 text-[13.5px] text-[#1a3333] placeholder-[#6b9090] outline-none focus:border-[#177a7a] focus:ring-[3px] focus:ring-[#0F5C5C]/10 focus:bg-white transition-all duration-200"
            />
          </div>

          <a href="/blogs" className="px-3 py-2.5 text-sm font-medium text-[#2a5252] rounded-lg hover:bg-[#e6f4f4] hover:text-[#0F5C5C] transition-colors duration-200">
            Blogs
          </a>
          <a href="/contact" className="px-3 py-2.5 text-sm font-medium text-[#2a5252] rounded-lg hover:bg-[#e6f4f4] hover:text-[#0F5C5C] transition-colors duration-200">
            Contact
          </a>
          <a
            href="tel:+911800000000"
            className="mt-2 flex justify-center items-center gap-2 h-[42px] bg-[#0F5C5C] text-white rounded-full text-[13.5px] font-semibold tracking-wide shadow-[0_4px_16px_rgba(15,92,92,0.28)] hover:bg-[#177a7a] transition-all duration-200"
          >
            <span className="w-2 h-2 rounded-full bg-[#2ec4a0] animate-pulse" />
            Call Us
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;