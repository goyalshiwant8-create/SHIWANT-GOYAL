/**
 * ============================================================================
 * LEARNING JOURNEY COMPONENT
 * ============================================================================
 * Features:
 * - "My Learning Journey"
 * - 01 — Programming Fundamentals (C & logical thinking)
 * - 02 — Web Fundamentals (HTML, CSS, modern layout)
 * - 03 — JavaScript (Interactive web applications)
 * - 04 — Full-Stack Development (Future goal: frontend, backend, databases, APIs, deployment)
 * - Visually attractive timeline with Demon Slayer Breathing Forms (壱, 弐, 参, 肆)
 */

function LearningJourney({ breathingStyle }) {
  const { journey } = window.portfolioData || {};

  return (
    <section id="journey" className="relative py-20 lg:py-28 overflow-hidden">
      {/* Decorative Katana Slash Divider at top */}
      <div className="max-w-7xl mx-auto px-4 mb-16">
        <div className="relative flex items-center justify-center">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent"></div>
          <span className="absolute px-4 bg-[#080c11] text-xs font-mono text-cyan-400/80 tracking-widest uppercase flex items-center gap-2">
            <span>道</span> SECTION 05 // PATH OF MASTERY <span>道</span>
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-cyan-300 mb-3">
            <span className="font-serif">修行の道</span> {journey?.kanjiSubtitle || "STEPS OF MASTERY"}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-space tracking-tight">
            {journey?.heading || "My Learning Journey"}
          </h2>
          <p className="mt-4 text-base text-gray-300 leading-relaxed">
            {journey?.description || "A clear step-by-step roadmap showing where I started, what I'm mastering right now, and where I am headed next."}
          </p>
          <div className="w-16 h-1 mx-auto mt-4 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400"></div>
        </div>

        {/* Timeline Container */}
        <div className="relative max-w-4xl mx-auto">
          {/* Central Glowing Spine Line */}
          <div className="hidden md:block absolute left-1/2 top-4 bottom-8 -translate-x-1/2 w-0.5 bg-gradient-to-b from-cyan-500/50 via-emerald-500/50 to-purple-500/30"></div>

          {/* Timeline Milestones */}
          <div className="space-y-12">
            {(journey?.steps || []).map((step, idx) => {
              const isEven = idx % 2 === 0;

              return (
                <div
                  key={step.step}
                  className={`relative flex flex-col md:flex-row items-center ${
                    isEven ? "md:flex-row-reverse" : ""
                  } gap-6 md:gap-12`}
                >
                  {/* Central Node Marker on Spine */}
                  <div className="hidden md:flex absolute left-1/2 top-8 -translate-x-1/2 w-10 h-10 rounded-full bg-[#0c1017] border-2 border-cyan-400/80 shadow-[0_0_15px_rgba(6,182,212,0.6)] items-center justify-center z-10 font-serif text-sm font-bold text-cyan-300">
                    {step.kanji}
                  </div>

                  {/* Card Content */}
                  <div className="w-full md:w-1/2">
                    <div className="group relative rounded-2xl bg-[#0c1017]/90 border border-white/10 hover:border-cyan-400/40 p-6 sm:p-7 shadow-xl shadow-black/50 transition-all duration-300 hover:-translate-y-1">
                      
                      {/* Step Number & Breathing Form */}
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400 font-space">
                            {step.step}
                          </span>
                          <span className="text-xs font-mono text-gray-400">
                            {step.breathingForm}
                          </span>
                        </div>

                        {/* Status Badge */}
                        <span
                          className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border ${
                            step.statusColor === "emerald"
                              ? "bg-emerald-950/80 text-emerald-300 border-emerald-500/40"
                              : step.statusColor === "cyan"
                              ? "bg-cyan-950/80 text-cyan-300 border-cyan-500/40"
                              : step.statusColor === "amber"
                              ? "bg-amber-950/80 text-amber-300 border-amber-500/40"
                              : "bg-purple-950/80 text-purple-300 border-purple-500/40"
                          }`}
                        >
                          {step.status}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors font-space">
                        {step.title}
                      </h3>

                      {/* Description */}
                      <p className="mt-2 text-sm text-gray-300 leading-relaxed">
                        {step.description}
                      </p>

                      {/* Learning Point Checklist */}
                      <div className="mt-4 pt-3 border-t border-white/5 space-y-1.5">
                        {(step.points || []).map((point, pIdx) => (
                          <div key={pIdx} className="flex items-start gap-2 text-xs text-gray-400">
                            <span className="text-cyan-400 mt-0.5">⚔️</span>
                            <span>{point}</span>
                          </div>
                        ))}
                      </div>

                      {/* Decorative Kanji Watermark */}
                      <span className="absolute bottom-3 right-4 font-serif text-3xl text-white/[0.04] pointer-events-none">
                        {step.kanji}
                      </span>
                    </div>
                  </div>

                  {/* Empty Spacer on opposing side for balanced 2-column layout on desktop */}
                  <div className="hidden md:block w-1/2"></div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}

if (typeof window !== "undefined") {
  window.LearningJourney = LearningJourney;
}
