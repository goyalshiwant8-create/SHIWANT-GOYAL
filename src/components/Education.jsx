/**
 * ============================================================================
 * EDUCATION SECTION COMPONENT
 * ============================================================================
 * Features:
 * - Bachelor of Computer Applications (BCA)
 * - 1st Year // Currently Pursuing
 * - Institution: BVIMR, New Delhi
 * - Clean modern timeline / card design with college logo integration
 * - Demon Slayer "Path of Knowledge" motif
 */

function Education({ breathingStyle }) {
  const { education, personal } = window.portfolioData || {};

  return (
    <section id="education" className="relative py-20 lg:py-28 overflow-hidden bg-white/[0.01]">
      {/* Decorative Katana Slash Divider at top */}
      <div className="max-w-7xl mx-auto px-4 mb-16">
        <div className="relative flex items-center justify-center">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent"></div>
          <span className="absolute px-4 bg-[#080c11] text-xs font-mono text-cyan-400/80 tracking-widest uppercase flex items-center gap-2">
            <span>学</span> SECTION 04 // ACADEMIC FOUNDATION <span>学</span>
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-cyan-300 mb-3">
            <span className="font-serif">学問</span> {education?.kanjiSubtitle || "PATH OF KNOWLEDGE"}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-space tracking-tight">
            {education?.heading || "Education"}
          </h2>
          <div className="w-16 h-1 mx-auto mt-4 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400"></div>
        </div>

        {/* Education Timeline Card */}
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-2xl bg-[#0c1017]/90 border border-white/10 hover:border-cyan-400/40 p-6 sm:p-10 shadow-2xl shadow-black/60 transition-all duration-300">
            
            {/* Top Bar with Status Pulse */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/15 p-2 flex items-center justify-center overflow-hidden shadow-inner">
                  <img
                    src={personal?.collegeLogo || "assets/college-logo.png"}
                    alt="BVIMR College Logo"
                    className="w-full h-full object-contain filter drop-shadow"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "assets/college-logo.svg";
                    }}
                    loading="lazy"
                  />
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white font-space">
                    {education?.degree || "Bachelor of Computer Applications (BCA)"}
                  </h3>
                  <p className="text-xs sm:text-sm text-cyan-300 font-mono mt-0.5">
                    {education?.institution || "Bharati Vidyapeeth Institute of Management & Research (BVIMR)"}
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>{education?.status || "Currently Pursuing"} (1st Year)</span>
              </div>
            </div>

            {/* Core Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-6 border-b border-white/5">
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-[11px] font-mono text-gray-400 uppercase tracking-wider block">
                  Current Year
                </span>
                <span className="text-base font-bold text-white font-space mt-1 block">
                  {education?.year || "1st Year"}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-[11px] font-mono text-gray-400 uppercase tracking-wider block">
                  Location
                </span>
                <span className="text-base font-bold text-white font-space mt-1 block">
                  {education?.location || "New Delhi, India"}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-[11px] font-mono text-gray-400 uppercase tracking-wider block">
                  Degree Timeline
                </span>
                <span className="text-base font-bold text-white font-space mt-1 block">
                  {education?.period || "2025 – 2028 (Expected)"}
                </span>
              </div>
            </div>

            {/* Description & Coursework Highlights */}
            <div className="pt-6 space-y-4">
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                {education?.description}
              </p>

              <div className="space-y-2.5 pt-2">
                <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-cyan-400">
                  Key Academic Highlights & Practical Focus:
                </h4>

                <ul className="space-y-2">
                  {(education?.highlights || []).map((highlight, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-300">
                      <span className="text-cyan-400 mt-0.5">✦</span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Footer Watermark */}
            <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-gray-500">
              <span>Department of Computer Applications</span>
              <span className="flex items-center gap-1 text-gray-400">
                <span className="text-emerald-400">🎓</span> Academic Pursuit
              </span>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

if (typeof window !== "undefined") {
  window.Education = Education;
}
