"use client";

const Hero = () => {
  return (
    <section className="w-full bg-[#0F5C5C] relative overflow-hidden flex items-center min-h-[180px] md:min-h-[210px]">

      {/* Decorative circles */}
      <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-[#2ec4a0]/10 pointer-events-none" />
      <div className="absolute -bottom-20 -left-10 w-72 h-72 rounded-full bg-[#0a3e3e]/60 pointer-events-none" />

      {/* Heartbeat */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
        <svg viewBox="0 0 1440 200" className="w-full h-full">
          <polyline
            points="0,100 180,100 240,35 280,165 320,55 365,125 410,100 1440,100"
            fill="none"
            stroke="white"
            strokeWidth="2"
          />
        </svg>
      </div>

      {/* Container (SHIFT LEFT FIX) */}
    <div className="max-w-[1280px] mx-auto px-5 md:px-8 pl-2 md:pl-6 lg:pl-10 w-full flex items-center justify-between gap-4 relative z-10 py-5">

        {/* LEFT */}
        <div className="flex-1 text-left">

          {/* Badge */}
          <div className="flex items-center gap-2 bg-[#2ec4a0]/15 border border-[#2ec4a0]/30 rounded-full px-3 py-1 mb-3 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2ec4a0] animate-pulse" />
            <span className="text-[#2ec4a0] text-[10px] font-bold tracking-widest uppercase">
              Trusted Healthcare Platform
            </span>
          </div>

          <h1 className="text-white text-xl md:text-[26px] lg:text-[30px] font-bold leading-tight mb-2">
            Comprehensive{" "}
            <span className="text-[#2ec4a0]">Health Care</span>
            <br className="hidden md:block" />
            <span className="text-white/80 text-base md:text-lg font-normal">
              for Everyone
            </span>
          </h1>

          <p className="text-white/60 text-xs md:text-sm max-w-sm leading-relaxed mb-4">
            Discover verified hospitals near you — trusted by thousands of patients across India.
          </p>

          
        </div>

        {/* RIGHT IMAGE */}
        <div className="relative flex-shrink-0 hidden sm:block">

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150px] h-[150px] rounded-full border border-[#2ec4a0]/20" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110px] h-[110px] rounded-full bg-[#2ec4a0]/10" />

          <img
            src="/images/doctor1.png"
            alt="Doctor"
            className="relative h-[130px] md:h-[150px] w-auto object-contain"
          />

          {/* Badge */}
          <div className="absolute -top-2 -right-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-2 py-1 flex items-center gap-1">
            <span className="text-[9px] text-white font-semibold">24/7</span>
            <span className="w-1 h-1 bg-[#2ec4a0] rounded-full animate-pulse" />
          </div>
        </div>

      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-[#0a3e3e]/40 to-transparent pointer-events-none" />
    </section>
  );
};

export default Hero;