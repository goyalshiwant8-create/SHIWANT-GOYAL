/**
 * ============================================================================
 * ABOUT SECTION COMPONENT
 * ============================================================================
 * Features:
 * - "About Me" heading with Demon Slayer watermark
 * - 3 structured narrative paragraphs highlighting Shiwant's learning journey
 * - 4 interactive highlight cards:
 *   🎓 BCA Student, 💻 Aspiring Developer, 🚀 Learning & Building, 🧠 Problem Solving
 * - Profile avatar showcase with Nichirin blade border and Tanjiro checkered accents
 */

function About({ breathingStyle }) {
  const { personal, about } = window.portfolioData || {};

  const iconComponents = {
    GraduationCap: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" />
        <path d="M22 10v6" />
        <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
      </svg>
    ),
    Code: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
    Rocket: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
        <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
        <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
      </svg>
    ),
    Brain: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
        <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
        <path d="M12 5v14" />
      </svg>
    ),
  };

  return (
    <section id="about" className="relative py-20 lg:py-28 overflow-hidden">
      {/* Decorative Katana Slash Divider at top */}
      <div className="max-w-7xl mx-auto px-4 mb-16">
        <div className="relative flex items-center justify-center">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent"></div>
          <span className="absolute px-4 bg-[#080c11] text-xs font-mono text-cyan-400/80 tracking-widest uppercase flex items-center gap-2">
            <span>鍛</span> SECTION 01 // OVERVIEW <span>鍛</span>
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-cyan-300 mb-3">
            <span className="font-serif">滅</span> {about?.kanjiSubtitle || "ABOUT THE DEVELOPER"}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-space tracking-tight">
            {about?.heading || "About Me"}
          </h2>
          <div className="w-16 h-1 mx-auto mt-4 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Portrait & Demon Slayer Rank Card */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative group w-64 sm:w-72 aspect-[4/5] rounded-2xl overflow-hidden bg-gradient-to-b from-[#141b24] to-[#0d1218] border border-white/15 p-2 shadow-2xl shadow-black/80 hover:border-cyan-400/50 transition-all duration-500">
              
              {/* Tanjiro checkered decorative pattern corner */}
              <div className="absolute top-0 right-0 w-16 h-16 opacity-25 pattern-checkered z-10 pointer-events-none"></div>
              
              {/* Inner frame */}
              <div className="relative w-full h-full rounded-xl overflow-hidden bg-[#090d12] flex items-center justify-center">
                <img
                  src={personal?.avatar || "assets/profile-photo.png"}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = personal?.avatarFallback || "assets/profile-photo.svg";
                  }}
                  alt="Shiwant Goyal Portrait"
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                
                {/* Kanji Overlay Badge */}
                <div className="absolute bottom-3 left-3 right-3 p-3 rounded-lg bg-[#0b0f14]/90 backdrop-blur-md border border-white/10 flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-white tracking-wide uppercase font-space">
                      {personal?.name || "Shiwant Goyal"}
                    </h3>
                    <p className="text-[10px] text-cyan-300 font-mono">
                      BCA 1st Year @ BVIMR
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-md bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center font-serif text-sm text-emerald-300 font-bold">
                    滅
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Corps Badge */}
            <div className="mt-6 flex items-center gap-3 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-xs font-mono text-gray-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Discipline: C Programming & Modern Web</span>
            </div>
          </div>

          {/* Right Column: Narrative Content & 4 Cards */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* The 3 Core Content Paragraphs */}
            <div className="space-y-4 text-gray-300 text-base sm:text-lg leading-relaxed">
              {(about?.paragraphs || []).map((para, idx) => (
                <p key={idx} className="relative pl-4 border-l-2 border-cyan-500/40">
                  {para}
                </p>
              ))}
            </div>

            {/* Career Goal Callout Box */}
            <div className="p-5 rounded-xl bg-gradient-to-r from-cyan-950/30 via-emerald-950/20 to-transparent border border-cyan-500/20">
              <div className="flex items-start gap-3">
                <span className="text-xl">🎯</span>
                <div>
                  <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-cyan-400 mb-1">
                    Ultimate Career Vision
                  </h4>
                  <p className="text-sm text-gray-200 font-sans italic">
                    "{personal?.careerGoal || "To become a skilled full-stack developer and build useful, modern, real-world web applications."}"
                  </p>
                </div>
              </div>
            </div>

            {/* 4 Info Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {(about?.infoCards || []).map((card, idx) => (
                <div
                  key={idx}
                  className="group relative p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-cyan-400/40 transition-all duration-300 hover:-translate-y-1 shadow-md shadow-black/40"
                >
                  {/* Subtle kanji background watermark */}
                  <span className="absolute top-2 right-3 font-serif text-3xl text-white/[0.04] group-hover:text-cyan-400/10 pointer-events-none transition-colors">
                    {card.kanji}
                  </span>

                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-lg bg-cyan-950/50 border border-cyan-500/30 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-black transition-colors">
                      {iconComponents[card.icon] || <span>✨</span>}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {card.title}
                      </h4>
                      <p className="text-xs text-gray-400 font-mono mt-0.5">
                        {card.subtitle}
                      </p>
                      <p className="text-xs text-gray-300 mt-2 leading-relaxed">
                        {card.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

if (typeof window !== "undefined") {
  window.About = About;
}
