"use client";

const Hero = () => {
  return (
    <section className="w-full bg-[#0F5C5C] min-h-[520px] h-155 relative overflow-hidden flex items-center">

      {/* heartbeat line SVG background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg viewBox="0 0 1440 200" preserveAspectRatio="none" className="w-full h-full">
          <polyline
            points="0,100 200,100 260,40 300,160 340,60 380,130 420,100 1440,100"
            fill="none"
            stroke="white"
            strokeWidth="3"
          />
        </svg>
      </div>

      {/* Content wrapper */}
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 w-full flex flex-col md:flex-row items-center justify-between gap-8 py-12 md:py-0">

        {/* LEFT — Text */}
        <div className="flex-1 z-10 text-center md:text-left">
          <p className="text-[#2ec4a0] text-sm font-semibold tracking-widest uppercase mb-3">
            Welcome, here you will get
          </p>

          <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Comprehensive <br />
            <span className="text-[#2ec4a0]">Health Care.</span>
          </h1>

          <p className="text-white/70 text-base md:text-lg max-w-md mb-8 mx-auto md:mx-0">
            Find the best hospitals near you — rated, verified, and trusted by thousands of patients.
          </p>

          {/* Search bar */}
          <div className="flex items-center bg-white rounded-full shadow-lg overflow-hidden max-w-md mx-auto md:mx-0">
            <svg
              className="ml-4 text-[#0F5C5C] flex-shrink-0"
              xmlns="http://www.w3.org/2000/svg"
              width="18" height="18"
              fill="none" viewBox="0 0 24 24"
              stroke="currentColor" strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search hospitals, specialities…"
              className="flex-1 px-4 py-3.5 text-sm text-[#1a3333] placeholder-gray-400 outline-none bg-transparent"
            />
            <button className="bg-[#0F5C5C] hover:bg-[#177a7a] transition-colors text-white text-sm font-semibold px-6 py-3.5 rounded-full m-1">
              Search
            </button>
          </div>

          {/* Quick stats */}
          <div className="flex gap-8 mt-8 justify-center md:justify-start">
            <div>
              <p className="text-white font-bold text-2xl">500+</p>
              <p className="text-white/60 text-xs">Hospitals Listed</p>
            </div>
            <div className="w-px bg-white/20" />
            <div>
              <p className="text-white font-bold text-2xl">50+</p>
              <p className="text-white/60 text-xs">Specialities</p>
            </div>
            <div className="w-px bg-white/20" />
            <div>
              <p className="text-white font-bold text-2xl">10k+</p>
              <p className="text-white/60 text-xs">Happy Patients</p>
            </div>
          </div>
        </div>

        {/* RIGHT — Doctor image */}
        <div className="flex-shrink-0 z-10 flex items-end justify-center md:justify-end w-full md:w-auto">
          <img
            src="/images/doctor.png"
            alt="Doctor"
            className="h-[320px] md:h-[420px] lg:h-[480px] w-auto object-contain drop-shadow-2xl"
          />
        </div>
      </div>

      {/* bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-[#0a3e3e]/40 to-transparent pointer-events-none" />
    </section>
  );
};

export default Hero;