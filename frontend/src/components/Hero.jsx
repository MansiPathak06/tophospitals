"use client";

const Hero = () => {
  return (
    <section className="w-full bg-[#0F5C5C] relative overflow-hidden flex items-center min-h-[220px] md:min-h-[260px]">

      {/* Decorative circles */}
      <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-[#2ec4a0]/10 pointer-events-none" />
      <div className="absolute -bottom-20 -left-10 w-72 h-72 rounded-full bg-[#0a3e3e]/60 pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-40 h-40 rounded-full bg-[#2ec4a0]/5 pointer-events-none" />

      {/* Heartbeat line */}
      <div className="absolute inset-0 opacity-[0.07] pointer-events-none">
        <svg viewBox="0 0 1440 200" preserveAspectRatio="none" className="w-full h-full">
          <polyline
            points="0,100 180,100 240,35 280,165 320,55 365,125 410,100 1440,100"
            fill="none" stroke="white" strokeWidth="2.5"
          />
        </svg>
      </div>

      {/* Dot grid pattern */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "28px 28px" }}
      />

      <div className="max-w-[1100px] mx-auto px-6 md:px-10 w-full flex items-center justify-between gap-6 relative z-10 py-8">

        {/* LEFT */}
        <div className="flex-1 text-left">

          {/* Badge */}
          <div className="flex items-center gap-2 bg-[#2ec4a0]/15 border border-[#2ec4a0]/30 rounded-full px-4 py-1.5 mb-4 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2ec4a0] animate-pulse" />
            <span className="text-[#2ec4a0] text-[11px] font-bold tracking-widest uppercase">
              Trusted Healthcare Platform
            </span>
          </div>

          <h1 className="text-white text-2xl md:text-[32px] lg:text-[38px] font-bold leading-[1.2] mb-3">
            Comprehensive{" "}
            <span className="text-[#2ec4a0]">Health Care</span>
            <br className="hidden md:block" />
            <span className="text-white/80 text-xl md:text-2xl font-normal"> for Everyone</span>
          </h1>

          <p className="text-white/60 text-sm md:text-[15px] max-w-md leading-relaxed mb-5">
            Discover verified hospitals near you — trusted by thousands of patients across India.
          </p>

          {/* Stats row */}
          <div className="flex items-center gap-5 flex-wrap">
            {[
              { value: "500+", label: "Hospitals" },
              { value: "50K+", label: "Patients" },
              { value: "4.8★", label: "Avg Rating" },
            ].map(({ value, label }) => (
              <div key={label} className="flex items-center gap-2">
                <span className="text-[#2ec4a0] font-bold text-base md:text-lg">{value}</span>
                <span className="text-white/40 text-xs">{label}</span>
              </div>
            ))}
          </div>

        </div>

        {/* RIGHT IMAGE */}
        <div className="relative flex-shrink-0 hidden sm:block">

          {/* Ring behind doctor */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180px] h-[180px] md:w-[220px] md:h-[220px] rounded-full border border-[#2ec4a0]/20" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140px] h-[140px] md:w-[170px] md:h-[170px] rounded-full bg-[#2ec4a0]/10" />

          <img
            src="/images/doctor.png"
            alt="Doctor"
            className="relative h-[150px] md:h-[185px] lg:h-[210px] w-auto object-contain drop-shadow-lg"
          />

          {/* Floating pill badge */}
          <div className="absolute -top-2 -right-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1.5 flex items-center gap-1.5">
            <span className="text-[10px] text-white font-semibold">24/7 Support</span>
            <span className="w-1.5 h-1.5 bg-[#2ec4a0] rounded-full animate-pulse" />
          </div>

          {/* Floating rating badge */}
          <div className="absolute -bottom-1 -left-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-3 py-2">
            <p className="text-[10px] text-white/60 leading-none mb-0.5">Patient Rating</p>
            <p className="text-white font-bold text-sm leading-none">4.8 / 5.0 ⭐</p>
          </div>
        </div>

      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-[#0a3e3e]/40 to-transparent pointer-events-none" />
    </section>
  );
};

export default Hero;