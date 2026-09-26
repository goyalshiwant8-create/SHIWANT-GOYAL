/**
 * ============================================================================
 * NAVBAR COMPONENT
 * ============================================================================
 * Sticky glassmorphism header with Demon Slayer breathing style switcher,
 * sound toggle, mobile responsive drawer, and prominent "Let's Connect" CTA.
 */

function Navbar({ breathingStyle, setBreathingStyle, sfxEnabled, onToggleSfx, activeSection, onOpenQuiz, onOpenShortcuts }) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState("");

  const { personal, breathingStyles } = window.portfolioData || {};
  const currentStyleData = breathingStyles ? breathingStyles[breathingStyle] : null;

  // Real-time Delhi IST clock
  React.useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const timeFormatter = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Kolkata",
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
      setCurrentTime(timeFormatter.format(now));
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", href: "#top", id: "top" },
    { label: "About", href: "#about", id: "about" },
    { label: "Skills", href: "#skills", id: "skills" },
    { label: "Projects", href: "#projects", id: "projects" },
    { label: "Education", href: "#education", id: "education" },
    { label: "Journey", href: "#journey", id: "journey" },
    { label: "Contact", href: "#contact", id: "contact" },
  ];

  const handleNavClick = (e, href) => {
    e.preventDefault();
    if (window.soundManager) window.soundManager.playClick();
    setMobileMenuOpen(false);

    if (href === "#top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const target = document.querySelector(href);
      if (target) {
        const offset = 80;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = target.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    }
  };

  const selectBreathingStyle = (styleKey) => {
    setBreathingStyle(styleKey);
    setThemeDropdownOpen(false);
    if (window.soundManager) {
      window.soundManager.playBreathingSound(styleKey);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0b0f14]/85 backdrop-blur-md border-b border-white/10 shadow-lg shadow-black/40 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand / Logo */}
        <a
          href="#top"
          onClick={(e) => handleNavClick(e, "#top")}
          className="group flex items-center gap-3 text-white transition-transform hover:scale-105"
          aria-label="Shiwant Goyal Home"
        >
          <div className="relative w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg font-mono bg-gradient-to-br from-[#121820] to-[#1e293b] border border-white/15 shadow-md shadow-black/50 group-hover:border-cyan-400/60 transition-colors overflow-hidden">
            {/* Subtle Tanjiro checker corner motif */}
            <div className="absolute top-0 right-0 w-3 h-3 opacity-30 bg-emerald-500 pattern-checkered"></div>
            <span className="relative z-10 text-cyan-300 group-hover:text-cyan-200">SG</span>
            <span className="absolute -bottom-1 -right-1 text-[9px] text-white/30 font-serif font-black">滅</span>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm sm:text-base tracking-wider uppercase font-space text-white group-hover:text-cyan-400 transition-colors">
                Shiwant Goyal
              </span>
              <span className="hidden sm:inline-block text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                滅 1ST YEAR
              </span>
            </div>
            <span className="text-[11px] text-gray-400 font-mono tracking-tight flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              {currentStyleData ? currentStyleData.japanese : "水の呼吸"} // ACTIVE
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2 bg-white/[0.03] backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-inner shadow-black/40">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`relative px-3.5 py-1.5 rounded-full text-xs xl:text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "text-white font-semibold bg-white/10 shadow-sm"
                    : "text-gray-300 hover:text-white hover:bg-white/5"
                }`}
              >
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]"></span>
                )}
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Action Controls & Breathing Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Breathing Style Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-xs font-mono text-gray-200 transition-all shadow-sm"
              title="Change Demon Slayer Breathing Form"
              aria-label="Change Demon Slayer Breathing Style"
            >
              <span className="text-sm">
                {breathingStyle === "water" ? "🌊" : breathingStyle === "sun" ? "🔥" : "⚡"}
              </span>
              <span className="hidden md:inline font-sans text-xs font-medium">
                {currentStyleData ? currentStyleData.name.split(" ")[0] : "Water"}
              </span>
              <span className="text-[10px] text-gray-400">▼</span>
            </button>

            {themeDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl bg-[#0f141c] border border-white/15 shadow-2xl p-1.5 z-50 animate-fadeIn backdrop-blur-xl">
                <div className="px-2.5 py-1 text-[10px] font-mono text-gray-400 uppercase tracking-wider border-b border-white/10 mb-1">
                  Breathing Discipline
                </div>
                {breathingStyles &&
                  Object.entries(breathingStyles).map(([key, style]) => (
                    <button
                      key={key}
                      onClick={() => selectBreathingStyle(key)}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition-colors ${
                        breathingStyle === key
                          ? "bg-white/10 text-white font-semibold"
                          : "text-gray-300 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{key === "water" ? "🌊" : key === "sun" ? "🔥" : "⚡"}</span>
                        <span>{style.name}</span>
                      </div>
                      <span className="font-serif text-sm opacity-50">{style.kanji}</span>
                    </button>
                  ))}
              </div>
            )}
          </div>

          {/* Live Indian Standard Time & Status */}
          {currentTime && (
            <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-xs font-mono text-gray-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[11px] text-gray-400">Delhi:</span>
              <span className="text-cyan-300 font-semibold">{currentTime}</span>
              <span className="text-[10px] text-gray-500 font-sans">IST</span>
            </div>
          )}

          {/* Interactive Demon Slayer Rank Quiz Button */}
          {onOpenQuiz && (
            <button
              onClick={() => {
                if (window.soundManager) window.soundManager.playKatanaChime();
                onOpenQuiz();
              }}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/40 hover:border-emerald-400/70 text-xs font-mono text-emerald-300 transition-all hover:scale-105 active:scale-95 shadow-sm"
              title="Test Your Developer Rank with 3 Quick Challenges"
            >
              <span className="text-xs">⚔️</span>
              <span className="hidden md:inline">Rank Test</span>
            </button>
          )}

          {/* Sound FX Toggle */}
          <button
            onClick={onToggleSfx}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-colors"
            title={sfxEnabled ? "Audio Effects: On (Press M)" : "Audio Effects: Muted (Press M)"}
            aria-label="Toggle sound effects"
          >
            <span className="text-sm">{sfxEnabled ? "🔊" : "🔇"}</span>
          </button>

          {/* Keyboard Shortcuts Helper */}
          {onOpenShortcuts && (
            <button
              onClick={() => {
                if (window.soundManager) window.soundManager.playClick();
                onOpenShortcuts();
              }}
              className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white text-xs font-mono transition-colors"
              title="Keyboard Shortcuts (Press ?)"
              aria-label="View keyboard shortcuts"
            >
              ?
            </button>
          )}

          {/* Prominent "Let's Connect" CTA Button */}
          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, "#contact")}
            className="relative group hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs sm:text-sm font-semibold text-white rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
          >
            {/* Background gradient reacting to theme */}
            <div
              className={`absolute inset-0 transition-opacity duration-500 ${
                breathingStyle === "water"
                  ? "bg-gradient-to-r from-cyan-600 to-emerald-600"
                  : breathingStyle === "sun"
                  ? "bg-gradient-to-r from-orange-600 to-red-600"
                  : "bg-gradient-to-r from-yellow-600 to-amber-600"
              }`}
            ></div>
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            {/* Katana gleam highlight */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>

            <span className="relative z-10 flex items-center gap-1.5 font-medium tracking-wide">
              <span>Let's Connect</span>
              <span className="transition-transform group-hover:translate-x-0.5">⚔️</span>
            </span>
          </a>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-colors"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[65px] bg-[#0b0f14]/95 backdrop-blur-2xl border-b border-white/10 p-5 shadow-2xl animate-fadeIn">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  activeSection === link.id
                    ? "bg-white/10 text-white font-semibold"
                    : "text-gray-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span>{link.label}</span>
                <span className="text-gray-500 font-mono text-xs">→</span>
              </a>
            ))}

            <div className="pt-3 mt-2 border-t border-white/10">
              <a
                href="#contact"
                onClick={(e) => handleNavClick(e, "#contact")}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-cyan-600 to-emerald-600 shadow-lg text-center"
              >
                <span>Let's Connect</span>
                <span>⚔️</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

if (typeof window !== "undefined") {
  window.Navbar = Navbar;
}
