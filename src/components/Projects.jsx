/**
 * ============================================================================
 * PROJECTS SECTION COMPONENT
 * ============================================================================
 * Features:
 * - Dynamic list fed from portfolioData.js
 * - Project 1: Portfolio Website (In Progress)
 * - Project 2: C Programming Projects (Learning / Ongoing)
 * - "More Projects Coming Soon..." card
 * - Every card includes: Title, Description, Tech badges, View Project button, GitHub button
 * - Clean Demon Slayer scroll / nichirin card styling with hover glow
 */

function Projects({ breathingStyle, onOpenProjectModal }) {
  const { projects } = window.portfolioData || {};
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeCategory, setActiveCategory] = React.useState("all");

  const filteredProjects = (projects?.items || []).filter((project) => {
    const matchesCategory =
      activeCategory === "all"
        ? true
        : activeCategory === "c"
        ? project.tech.includes("C") || project.id.includes("c-")
        : project.tech.includes("React") || project.tech.includes("HTML5");

    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      project.title.toLowerCase().includes(query) ||
      project.description.toLowerCase().includes(query) ||
      (project.details && project.details.toLowerCase().includes(query)) ||
      project.tech.some((t) => t.toLowerCase().includes(query));

    return matchesCategory && matchesSearch;
  });

  const handleLinkClick = (e, url) => {
    if (url.startsWith("#")) {
      e.preventDefault();
      if (window.soundManager) window.soundManager.playClick();
      const elem = document.querySelector(url);
      if (elem) {
        const offset = 80;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = elem.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    } else {
      if (window.soundManager) window.soundManager.playKatanaChime();
    }
  };

  return (
    <section id="projects" className="relative py-20 lg:py-28 overflow-hidden">
      {/* Decorative Katana Slash Divider at top */}
      <div className="max-w-7xl mx-auto px-4 mb-16">
        <div className="relative flex items-center justify-center">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent"></div>
          <span className="absolute px-4 bg-[#080c11] text-xs font-mono text-cyan-400/80 tracking-widest uppercase flex items-center gap-2">
            <span>巻</span> SECTION 03 // SLAYER MISSIONS <span>巻</span>
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-cyan-300 mb-3">
            <span className="font-serif">戦歴</span> {projects?.kanjiSubtitle || "MISSION SCROLLS"}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-space tracking-tight">
            {projects?.heading || "Featured Projects"}
          </h2>
          <p className="mt-4 text-base text-gray-300 leading-relaxed">
            {projects?.description || "A showcase of real code and practical assignments. Each project marks a milestone in my journey from initial syntax to production code."}
          </p>
          <div className="w-16 h-1 mx-auto mt-4 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400"></div>
        </div>

        {/* Dynamic Search & Category Filter Controls */}
        <div className="max-w-3xl mx-auto mb-12 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0c1017]/80 p-3 rounded-2xl border border-white/10 backdrop-blur-md">
          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: "all", label: "All Projects" },
              { id: "c", label: "C & Algorithms 💻" },
              { id: "web", label: "Web & React 🌐" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  if (window.soundManager) window.soundManager.playClick();
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? "bg-gradient-to-r from-cyan-600 to-emerald-600 text-white font-semibold shadow-md"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Real-time Search Input */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by tech or keyword..."
              className="w-full pl-8 pr-7 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs font-mono text-gray-200 placeholder-gray-500 focus:outline-none focus:border-cyan-400"
            />
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 text-xs">🔍</span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Live Result Count */}
        <div className="flex items-center justify-between text-xs font-mono text-gray-400 mb-6 px-1">
          <span>
            Displaying <strong className="text-cyan-300">{filteredProjects.length}</strong> project{filteredProjects.length === 1 ? "" : "s"}
          </span>
          <span className="text-[11px] text-gray-500">
            Click 'Interactive Demo' for in-browser C tester
          </span>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group relative rounded-2xl bg-[#0c1017]/90 border border-white/10 hover:border-cyan-400/50 p-6 sm:p-7 shadow-xl shadow-black/50 transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between"
            >
              {/* Nichirin edge highlight on hover */}
              <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

              <div>
                {/* Top Badge & Breathing Form */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-[11px] font-mono text-cyan-400/90 font-medium">
                    {project.breathingStyle}
                  </span>

                  <span
                    className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border ${
                      project.badgeType === "progress"
                        ? "bg-cyan-950/80 text-cyan-300 border-cyan-500/40 animate-pulse"
                        : "bg-emerald-950/80 text-emerald-300 border-emerald-500/40"
                    }`}
                  >
                    {project.badge}
                  </span>
                </div>

                {/* Project Title */}
                <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors font-space flex items-center gap-2">
                  <span>{project.title}</span>
                </h3>

                {/* Short Description */}
                <p className="mt-3 text-sm text-gray-300 leading-relaxed">
                  {project.description}
                </p>

                {/* Extra Technical Details */}
                {project.details && (
                  <p className="mt-2 text-xs text-gray-400 leading-relaxed">
                    {project.details}
                  </p>
                )}

                {/* Technologies Badges */}
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {project.tech.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-white/5 border border-white/10 text-gray-300 group-hover:border-cyan-400/20 group-hover:text-cyan-200 transition-colors"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons: Interactive Demo & GitHub */}
              <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center gap-2">
                <button
                  onClick={() => {
                    if (window.soundManager) window.soundManager.playKatanaChime();
                    if (onOpenProjectModal) onOpenProjectModal(project);
                  }}
                  className="flex-1 min-w-[120px] inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 shadow-md shadow-cyan-950 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>{project.id === "c-programming-projects" ? "🎮 Test C Simulator" : "⚔️ Quick View"}</span>
                </button>

                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    if (window.soundManager) window.soundManager.playClick();
                  }}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-gray-300 bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/20 transition-all hover:scale-[1.02]"
                  title="View on GitHub"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                  </svg>
                  <span>Code</span>
                </a>
              </div>
            </div>
          ))}

          {/* "More Projects Coming Soon..." Card */}
          <div className="group relative rounded-2xl bg-gradient-to-b from-[#0c1017]/40 to-[#070a0f]/80 border-2 border-dashed border-white/10 hover:border-cyan-400/40 p-6 sm:p-7 shadow-lg flex flex-col justify-between transition-all duration-300 hover:-translate-y-1">
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="text-[11px] font-mono text-emerald-400/80">
                  Nichirin Forge
                </span>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-300">
                  {projects?.comingSoonCard?.badge || "In The Forge"}
                </span>
              </div>

              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                🔨
              </div>

              <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors font-space">
                {projects?.comingSoonCard?.title || "More Projects Coming Soon..."}
              </h3>

              <p className="mt-3 text-sm text-gray-400 leading-relaxed">
                {projects?.comingSoonCard?.description || "Currently working on interactive JavaScript utilities, responsive client apps, and expanding C algorithm implementations. Watch this space!"}
              </p>
            </div>

            <div className="mt-6 pt-5 border-t border-white/5 flex items-center justify-between text-xs font-mono text-gray-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                Active Development
              </span>
              <span className="font-serif text-base text-white/30">未来</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

if (typeof window !== "undefined") {
  window.Projects = Projects;
}
