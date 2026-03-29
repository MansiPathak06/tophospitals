"use client";

const Hero = () => {
  return (
    <section className="w-full bg-[#0F5C5C] min-h-[200px] md:min-h-[230px] relative overflow-hidden flex items-center">

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0F5C5C] via-[#0F5C5C]/95 to-transparent z-0" />

      {/* Heartbeat line */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg viewBox="0 0 1440 200" preserveAspectRatio="none" className="w-full h-full">
          <polyline
            points="0,100 200,100 260,40 300,160 340,60 380,130 420,100 1440,100"
            fill="none"
            stroke="white"
            strokeWidth="2"
          />
        </svg>
      </div>

      <div className="max-w-[1100px] mx-auto px-5 md:px-8 w-full flex items-center justify-between gap-4 relative z-10">

        {/* LEFT */}
        <div className="flex-1 text-left">

          <p className="text-[#2ec4a0] text-[10px] tracking-widest uppercase mb-1 font-semibold">
            Trusted Healthcare Platform
          </p>

          <h1 className="text-white text-2xl md:text-3xl lg:text-[34px] font-bold leading-tight mb-2">
            Comprehensive{" "}
            <span className="text-[#2ec4a0] relative">
              Health Care
              <span className="absolute left-0 bottom-0 w-full h-[2px] bg-[#2ec4a0]/40 rounded-full" />
            </span>
          </h1>

          <p className="text-white/70 text-xs md:text-sm max-w-sm">
            Discover verified hospitals near you — trusted by thousands of patients.
          </p>

        </div>

        {/* RIGHT IMAGE */}
        <div className="relative flex-shrink-0">

          {/* Glow effect */}
          <div className="absolute -inset-4 bg-[#2ec4a0]/20 blur-2xl rounded-full opacity-60" />

          <img
            src="/images/doctor.png"
            alt="Doctor"
            className="relative h-[140px] md:h-[170px] lg:h-[190px] w-auto object-contain"
          />
        </div>

      </div>

      {/* Bottom soft fade */}
      <div className="absolute bottom-0 left-0 right-0 h-5 bg-gradient-to-t from-[#0a3e3e]/50 to-transparent pointer-events-none" />
    </section>
  );
};

export default Hero;