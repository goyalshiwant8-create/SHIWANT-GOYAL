/**
 * ============================================================================
 * SKILLS SECTION COMPONENT
 * ============================================================================
 * Features:
 * - 3 Categorized Cards:
 *   1. Programming (C, Problem Solving, Logic Building)
 *   2. Web Development (HTML5, CSS3, JavaScript)
 *   3. Currently Learning (JavaScript, React, Full-Stack Development)
 * - Transparent proficiency stages (Foundational Core, Active Practice, Actively Exploring)
 * - Zero fake percentages! Instead uses honest progress stages & practical scope descriptions.
 * - Demon Slayer breathing motifs & kanji watermarks.
 */

function Skills({ breathingStyle }) {
  const { skills } = window.portfolioData || {};

  const getStatusBadgeStyle = (status) => {
    if (status.includes("Primary") || status.includes("Strong")) {
      return "bg-emerald-950/80 text-emerald-300 border-emerald-500/30";
    }
    if (status.includes("Active") || status.includes("Core")) {
      return "bg-cyan-950/80 text-cyan-300 border-cyan-500/30";
    }
    return "bg-amber-950/80 text-amber-300 border-amber-500/30";
  };

  return (
    <section id="skills" className="relative py-20 lg:py-28 overflow-hidden bg-white/[0.01]">
      {/* Decorative Katana Slash Divider at top */}
      <div className="max-w-7xl mx-auto px-4 mb-16">
        <div className="relative flex items-center justify-center">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent"></div>
          <span className="absolute px-4 bg-[#080c11] text-xs font-mono text-emerald-400/80 tracking-widest uppercase flex items-center gap-2">
            <span>刀</span> SECTION 02 // TECHNICAL ARSENAL <span>刀</span>
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-emerald-300 mb-3">
            <span className="font-serif">呼吸術</span> {skills?.kanjiSubtitle || "BREATHING DISCIPLINES"}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-space tracking-tight">
            {skills?.heading || "Skills & Arsenal"}
          </h2>
          <p className="mt-4 text-base text-gray-300 leading-relaxed">
            {skills?.description || "A transparent overview of my current technical toolkit. As a 1st-year BCA student, I focus on solid foundational principles rather than superficial claims."}
          </p>
          <div className="w-16 h-1 mx-auto mt-4 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400"></div>
        </div>

        {/* 3 Categories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {(skills?.categories || []).map((category) => (
            <div
              key={category.id}
              className="group relative rounded-2xl bg-[#0c1017]/85 border border-white/10 hover:border-emerald-400/40 p-6 sm:p-7 shadow-xl shadow-black/50 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
            >
              {/* Subtle Tanjiro pattern top bar */}
              <div className="absolute top-0 left-0 right-0 h-1.5 rounded-t-2xl overflow-hidden">
                <div
                  className={`w-full h-full transition-colors ${
                    category.id === "programming"
                      ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                      : category.id === "web-dev"
                      ? "bg-gradient-to-r from-cyan-500 to-blue-500"
                      : "bg-gradient-to-r from-amber-500 to-orange-500"
                  }`}
                ></div>
              </div>

              {/* Category Header */}
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-bold text-lg text-emerald-400 group-hover:scale-105 transition-transform">
                      {category.id === "programming" ? "💻" : category.id === "web-dev" ? "🌐" : "🌱"}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors font-space">
                        {category.title}
                      </h3>
                      <span className="text-xs text-gray-400 font-mono">
                        {category.badge}
                      </span>
                    </div>
                  </div>

                  <span className="font-serif text-2xl text-white/20 group-hover:text-white/40 transition-colors">
                    {category.kanji}
                  </span>
                </div>

                {/* Skill Items in this Category */}
                <div className="mt-6 space-y-5">
                  {category.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/15 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="font-bold text-sm text-gray-100 font-mono flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                          {item.name}
                        </span>

                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded border ${getStatusBadgeStyle(
                            item.status
                          )}`}
                        >
                          {item.level}
                        </span>
                      </div>

                      <p className="text-xs text-gray-400 leading-relaxed">
                        {item.description}
                      </p>

                      {/* Visual indicator (Stage pills instead of fake percent) */}
                      <div className="mt-2.5 flex items-center gap-1.5">
                        <span className="text-[10px] font-mono text-gray-500 uppercase">Stage:</span>
                        <div className="flex items-center gap-1 flex-1">
                          <div className="h-1 rounded-full bg-emerald-500 flex-1"></div>
                          <div
                            className={`h-1 rounded-full flex-1 ${
                              category.id === "learning" ? "bg-amber-500 animate-pulse" : "bg-emerald-500"
                            }`}
                          ></div>
                          <div
                            className={`h-1 rounded-full flex-1 ${
                              category.id === "learning" ? "bg-white/10" : "bg-emerald-500/40"
                            }`}
                          ></div>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-400/90 font-medium">
                          {item.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-gray-500">
                <span>{category.items.length} Disciplines</span>
                <span className="text-gray-400">Total Concentration ⚔️</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

if (typeof window !== "undefined") {
  window.Skills = Skills;
}
