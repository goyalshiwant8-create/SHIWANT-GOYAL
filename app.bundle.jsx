// ===== src/components/BreathingCanvas.jsx =====
/**
 * ============================================================================
 * BREATHING CANVAS COMPONENT
 * ============================================================================
 * High-performance ambient particle canvas reacting to the current Breathing Style.
 * - Water Breathing: Gentle aquatic bubbles & cyan water flow ripples
 * - Sun Breathing: Rising orange/gold Hinokami embers & heat sparks
 * - Thunder Breathing: Fast electric sparks & micro lightning streaks
 */

function BreathingCanvas({ breathingStyle }) {
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Responsive particle count
    const isMobile = width < 768;
    const particleCount = isMobile ? 32 : 65;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // Particle generator based on style
    class Particle {
      constructor(style) {
        this.reset(style);
      }

      reset(style) {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 3 + 1;
        this.alpha = Math.random() * 0.5 + 0.2;
        this.life = 0;
        this.maxLife = Math.random() * 200 + 100;

        if (style === "water") {
          // Slow floating, swaying slightly
          this.vx = (Math.random() - 0.5) * 0.6;
          this.vy = -(Math.random() * 0.8 + 0.2); // drifts upward gently
          this.color = Math.random() > 0.4 ? "6, 182, 212" : "16, 185, 129"; // cyan or emerald
        } else if (style === "sun") {
          // Floating fire embers rising and wavering
          this.vx = (Math.random() - 0.5) * 1.2;
          this.vy = -(Math.random() * 1.5 + 0.6); // faster rise
          this.color = Math.random() > 0.5 ? "249, 115, 22" : "239, 68, 68"; // orange or crimson
          this.size = Math.random() * 3.5 + 1.2;
        } else if (style === "thunder") {
          // Rapid jittery electric sparks
          this.vx = (Math.random() - 0.5) * 2.2;
          this.vy = (Math.random() - 0.5) * 2.2;
          this.color = Math.random() > 0.3 ? "234, 179, 8" : "168, 85, 247"; // gold or purple
          this.size = Math.random() * 2.5 + 0.8;
        } else {
          this.vx = (Math.random() - 0.5) * 0.5;
          this.vy = (Math.random() - 0.5) * 0.5;
          this.color = "148, 163, 184";
        }
      }

      update(style) {
        this.x += this.vx;
        this.y += this.vy;
        this.life++;

        // Add subtle wavering
        if (style === "water") {
          this.vx += Math.sin(this.life * 0.03) * 0.02;
        } else if (style === "sun") {
          this.vx += Math.sin(this.life * 0.05) * 0.05;
          this.size = Math.max(0.5, this.size - 0.005);
        } else if (style === "thunder") {
          if (Math.random() > 0.94) {
            this.vx = (Math.random() - 0.5) * 4;
            this.vy = (Math.random() - 0.5) * 4;
          }
        }

        // Wrap around bounds
        if (this.y < 0 || this.y > height || this.x < 0 || this.x > width || this.life >= this.maxLife) {
          this.reset(style);
          if (style === "water" || style === "sun") {
            this.y = height + 10;
          }
        }
      }

      draw(ctx) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
        ctx.shadowBlur = this.size * 3;
        ctx.shadowColor = `rgba(${this.color}, 0.8)`;
        ctx.fill();
        ctx.restore();
      }
    }

    const particles = Array.from({ length: particleCount }, () => new Particle(breathingStyle));

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.update(breathingStyle);
        p.draw(ctx);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [breathingStyle]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-60 transition-opacity duration-1000"
      aria-hidden="true"
    />
  );
}

if (typeof window !== "undefined") {
  window.BreathingCanvas = BreathingCanvas;
}

// ===== src/components/Navbar.jsx =====
/**
 * ============================================================================
 * NAVBAR COMPONENT
 * ============================================================================
 * Sticky glassmorphism header with Demon Slayer breathing style switcher,
 * sound toggle, mobile responsive drawer, and prominent "Let's Connect" CTA.
 */

function Navbar({ breathingStyle, setBreathingStyle, sfxEnabled, onToggleSfx, activeSection }) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = React.useState(false);

  const { personal, breathingStyles } = window.portfolioData || {};
  const currentStyleData = breathingStyles ? breathingStyles[breathingStyle] : null;

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

          {/* Sound FX Toggle */}
          <button
            onClick={onToggleSfx}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-colors"
            title={sfxEnabled ? "Audio Effects: On" : "Audio Effects: Muted"}
            aria-label="Toggle sound effects"
          >
            <span className="text-sm">{sfxEnabled ? "🔊" : "🔇"}</span>
          </button>

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

// ===== src/components/Hero.jsx =====
/**
 * ============================================================================
 * HERO SECTION COMPONENT
 * ============================================================================
 * Features:
 * - "Hi, I'm Shiwant Goyal 👋"
 * - Large heading: "Building My Journey in Web Development."
 * - Supporting text
 * - Action buttons: "View My Projects" & "Let's Connect"
 * - Social pills: Instagram, LinkedIn, GitHub
 * - Interactive Nichirin Code Terminal with tabs (main.c, App.jsx, journey.md)
 *   and simulated execution output!
 */

function Hero({ breathingStyle }) {
  const { personal, socials, codeSnippets } = window.portfolioData || {};
  const [activeTab, setActiveTab] = React.useState(codeSnippets ? codeSnippets[0].id : "main.c");
  const [terminalOutput, setTerminalOutput] = React.useState(null);
  const [isRunning, setIsRunning] = React.useState(false);

  const currentSnippet = (codeSnippets || []).find((s) => s.id === activeTab) || codeSnippets[0];

  const handleTabChange = (snippetId) => {
    setActiveTab(snippetId);
    setTerminalOutput(null);
    if (window.soundManager) window.soundManager.playClick();
  };

  const handleRunCode = () => {
    if (window.soundManager) window.soundManager.playKatanaChime();
    setIsRunning(true);
    setTerminalOutput(null);

    setTimeout(() => {
      setIsRunning(false);
      setTerminalOutput(currentSnippet.output);
    }, 600);
  };

  const scrollToSection = (e, id) => {
    e.preventDefault();
    if (window.soundManager) window.soundManager.playClick();
    const elem = document.querySelector(id);
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
  };

  const themeGlowClass =
    breathingStyle === "water"
      ? "shadow-[0_0_35px_rgba(6,182,212,0.25)] border-cyan-500/30"
      : breathingStyle === "sun"
      ? "shadow-[0_0_35px_rgba(249,115,22,0.25)] border-orange-500/30"
      : "shadow-[0_0_35px_rgba(234,179,8,0.25)] border-yellow-500/30";

  return (
    <section id="top" className="relative min-h-[90vh] flex items-center justify-center pt-28 pb-16 lg:py-24 overflow-hidden">
      {/* Background radial ambiance */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-900/20 via-emerald-950/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Hero Typography & CTAs */}
          <div className="lg:col-span-6 flex flex-col items-start space-y-6 text-left">
            
            {/* Status pill with Tanjiro badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-xs font-mono font-medium tracking-wider text-emerald-300">
                {personal?.badge || "TOTAL CONCENTRATION // BCA 1ST YEAR"}
              </span>
              <span className="text-xs opacity-50 font-serif">滅</span>
            </div>

            {/* Greeting */}
            <div className="space-y-1">
              <span className="text-base sm:text-lg text-cyan-400 font-mono tracking-wide font-medium flex items-center gap-2">
                Hi, I'm Shiwant Goyal <span className="animate-wave inline-block origin-[70%_70%]">👋</span>
              </span>
              
              {/* Primary Large Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-space leading-[1.12]">
                Building My Journey in{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 inline-block">
                  Web Development.
                </span>
              </h1>
            </div>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-gray-300 font-sans leading-relaxed max-w-xl">
              I'm a BCA student passionate about programming, web development, and creating modern digital experiences. Currently learning, building, and improving every day.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2 w-full sm:w-auto">
              <a
                href="#projects"
                onClick={(e) => scrollToSection(e, "#projects")}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 shadow-lg shadow-cyan-500/25 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>View My Projects</span>
                <span className="text-base">🚀</span>
              </a>

              <a
                href="#contact"
                onClick={(e) => scrollToSection(e, "#contact")}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-sm text-gray-200 bg-white/5 hover:bg-white/10 border border-white/15 hover:border-white/30 backdrop-blur-md transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Let's Connect</span>
                <span className="text-base">⚔️</span>
              </a>
            </div>

            {/* Social Icons / Links */}
            <div className="pt-4 border-t border-white/10 w-full flex flex-col sm:flex-row sm:items-center gap-3">
              <span className="text-xs font-mono text-gray-400 tracking-wider uppercase">Channels:</span>
              <div className="flex items-center gap-2.5">
                {/* Instagram */}
                <a
                  href={socials?.instagram?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-pink-500/15 border border-white/10 hover:border-pink-500/40 text-xs text-gray-300 hover:text-pink-300 transition-all"
                  title="Follow on Instagram"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  <span>@shiwant_goyal_</span>
                </a>

                {/* LinkedIn */}
                <a
                  href={socials?.linkedin?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-blue-500/15 border border-white/10 hover:border-blue-500/40 text-xs text-gray-300 hover:text-blue-300 transition-all"
                  title="Connect on LinkedIn"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                  <span>LinkedIn</span>
                </a>

                {/* GitHub */}
                <a
                  href={socials?.github?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/30 text-xs text-gray-300 hover:text-white transition-all"
                  title="Visit GitHub Profile"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                  </svg>
                  <span>GitHub</span>
                </a>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Nichirin Code Terminal */}
          <div className="lg:col-span-6 w-full">
            <div className={`relative rounded-2xl bg-[#0c1017]/90 border backdrop-blur-xl p-1 shadow-2xl transition-all duration-500 ${themeGlowClass}`}>
              
              {/* Terminal Window Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/[0.02]">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                  <span className="ml-2 text-xs font-mono text-gray-400 font-semibold tracking-tight">
                    nichirin-blade-terminal.sh
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-cyan-300">
                    滅 CONCENTRATION
                  </span>
                </div>
              </div>

              {/* Code Tabs */}
              <div className="flex items-center justify-between px-3 pt-2 border-b border-white/5 bg-[#090d13]">
                <div className="flex items-center gap-1 overflow-x-auto">
                  {(codeSnippets || []).map((snippet) => (
                    <button
                      key={snippet.id}
                      onClick={() => handleTabChange(snippet.id)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-t-lg text-xs font-mono transition-all ${
                        activeTab === snippet.id
                          ? "bg-[#111722] text-cyan-300 border-t-2 border-cyan-400 font-medium"
                          : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
                      }`}
                    >
                      <span>{snippet.label}</span>
                      <span className="text-[9px] px-1 py-0.2 rounded bg-white/10 text-gray-300">
                        {snippet.badge}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Run / Compile Button */}
                <button
                  onClick={handleRunCode}
                  disabled={isRunning}
                  className="flex items-center gap-1.5 px-3 py-1 mb-1 rounded-md text-xs font-mono font-medium text-emerald-300 bg-emerald-950/60 border border-emerald-500/40 hover:bg-emerald-900/60 transition-all hover:scale-105 active:scale-95"
                  title="Run code in simulated environment"
                >
                  <span>{isRunning ? "⏳" : "▶"}</span>
                  <span>{isRunning ? "Compiling..." : "Run"}</span>
                </button>
              </div>

              {/* Code Editor Body */}
              <div className="p-4 sm:p-5 font-mono text-xs sm:text-[13px] leading-relaxed bg-[#0b0f15] rounded-b-xl overflow-x-auto min-h-[260px]">
                <div className="flex">
                  {/* Line Numbers */}
                  <div className="select-none pr-4 text-right text-gray-600 border-r border-white/10 mr-4 font-mono text-xs">
                    {currentSnippet.code.split("\n").map((_, i) => (
                      <div key={i}>{i + 1}</div>
                    ))}
                  </div>

                  {/* Code Content */}
                  <pre className="text-gray-200 font-mono whitespace-pre flex-1 overflow-x-auto">
                    <code>
                      {currentSnippet.code.split("\n").map((line, idx) => {
                        // Minimal color decoration
                        let coloredLine = line;
                        const isComment = line.trim().startsWith("//") || line.trim().startsWith("#");
                        const isInclude = line.trim().startsWith("#include") || line.trim().startsWith("import");
                        
                        return (
                          <div
                            key={idx}
                            className={
                              isComment
                                ? "text-emerald-400/80 italic"
                                : isInclude
                                ? "text-purple-400"
                                : "text-gray-200"
                            }
                          >
                            {line}
                          </div>
                        );
                      })}
                    </code>
                  </pre>
                </div>

                {/* Execution Output Box */}
                {terminalOutput && (
                  <div className="mt-4 pt-3 border-t border-dashed border-emerald-500/30 animate-fadeIn bg-emerald-950/20 p-3 rounded-lg border border-emerald-500/20">
                    <div className="flex items-center justify-between text-[11px] font-mono text-emerald-400 mb-1">
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        TERMINAL EXECUTION // WATER BREATHING STRIKE
                      </span>
                      <button
                        onClick={() => setTerminalOutput(null)}
                        className="text-gray-400 hover:text-white text-xs"
                      >
                        ✕
                      </button>
                    </div>
                    <pre className="text-emerald-200/90 text-xs font-mono whitespace-pre-wrap">
                      {terminalOutput}
                    </pre>
                  </div>
                )}
              </div>

              {/* Bottom status bar */}
              <div className="px-4 py-2 border-t border-white/5 bg-[#080c12] text-[11px] font-mono text-gray-500 flex items-center justify-between">
                <span>UTF-8 // LF // GCC 14.2 & Node v20</span>
                <span className="flex items-center gap-1 text-gray-400">
                  <span className="text-cyan-400">刀</span> Total Concentration: Active
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

if (typeof window !== "undefined") {
  window.Hero = Hero;
}

// ===== src/components/About.jsx =====
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

// ===== src/components/Skills.jsx =====
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

// ===== src/components/Projects.jsx =====
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

function Projects({ breathingStyle }) {
  const { projects } = window.portfolioData || {};

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
        <div className="text-center max-w-3xl mx-auto mb-16">
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

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(projects?.items || []).map((project) => (
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

              {/* Action Buttons: View Project & GitHub */}
              <div className="mt-6 pt-5 border-t border-white/10 flex items-center gap-3">
                <a
                  href={project.liveUrl}
                  onClick={(e) => handleLinkClick(e, project.liveUrl)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 shadow-md shadow-cyan-950 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>View Project</span>
                  <span className="text-xs">↗</span>
                </a>

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
                  <span>GitHub</span>
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

// ===== src/components/Education.jsx =====
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

// ===== src/components/LearningJourney.jsx =====
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

// ===== src/components/Contact.jsx =====
/**
 * ============================================================================
 * CONTACT SECTION COMPONENT
 * ============================================================================
 * Features:
 * - Heading: "Let's Build Something Together"
 * - Subtext
 * - Social Cards: Instagram (@shiwant_goyal_), LinkedIn, Placeholder Email with Copy Button
 * - Functional Contact Form:
 *   - Name, Email, Message
 *   - Frontend validation
 *   - Success toast / error alerts
 * - Demon Slayer scroll theme styling
 */

function Contact({ breathingStyle, onShowToast }) {
  const { contact, socials } = window.portfolioData || {};

  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = React.useState({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [copiedEmail, setCopiedEmail] = React.useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) {
      errs.name = "Please enter your name.";
    }
    if (!formData.email.trim()) {
      errs.email = "Please enter your email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = "Please enter a valid email address.";
    }
    if (!formData.message.trim()) {
      errs.message = "Please write a brief message.";
    } else if (formData.message.trim().length < 6) {
      errs.message = "Message must be at least 6 characters.";
    }
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (window.soundManager) window.soundManager.playClick();

    const formErrors = validate();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsSubmitting(true);

    // Simulate reliable submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      if (window.soundManager) window.soundManager.playKatanaChime();
      if (onShowToast) {
        onShowToast("Message transmitted! Shiwant will get back to you soon. ⚔️");
      }
      setFormData({ name: "", email: "", message: "" });
    }, 800);
  };

  const handleCopyEmail = () => {
    const emailToCopy = socials?.email?.address || "your-email@example.com";
    if (navigator.clipboard) {
      navigator.clipboard.writeText(emailToCopy).then(() => {
        setCopiedEmail(true);
        if (window.soundManager) window.soundManager.playClick();
        if (onShowToast) onShowToast("Email address copied to clipboard!");
        setTimeout(() => setCopiedEmail(false), 3000);
      });
    }
  };

  return (
    <section id="contact" className="relative py-20 lg:py-28 overflow-hidden bg-white/[0.01]">
      {/* Decorative Katana Slash Divider at top */}
      <div className="max-w-7xl mx-auto px-4 mb-16">
        <div className="relative flex items-center justify-center">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent"></div>
          <span className="absolute px-4 bg-[#080c11] text-xs font-mono text-cyan-400/80 tracking-widest uppercase flex items-center gap-2">
            <span>信</span> SECTION 06 // TRANSMISSION <span>信</span>
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-cyan-300 mb-3">
            <span className="font-serif">通信</span> {contact?.kanjiSubtitle || "COMMUNICATION SCROLL"}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-space tracking-tight">
            {contact?.heading || "Let's Build Something Together"}
          </h2>
          <p className="mt-4 text-base text-gray-300 leading-relaxed">
            {contact?.subtext || "Have a project idea, collaboration opportunity, or simply want to connect? Feel free to reach out."}
          </p>
          <div className="w-16 h-1 mx-auto mt-4 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-6xl mx-auto">
          
          {/* Left Column: Direct Contact & Social Channels */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="p-6 rounded-2xl bg-[#0c1017]/90 border border-white/10 shadow-xl space-y-6">
              <h3 className="text-lg font-bold text-white font-space flex items-center gap-2">
                <span>Connect Directly</span>
                <span className="text-cyan-400 text-sm">⚔️</span>
              </h3>

              {/* Instagram Card */}
              <a
                href={socials?.instagram?.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] hover:bg-pink-500/10 border border-white/5 hover:border-pink-500/30 transition-all duration-300 group"
              >
                <div className="w-11 h-11 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
                <div>
                  <span className="text-xs text-gray-400 font-mono block">Instagram</span>
                  <span className="text-sm font-bold text-white group-hover:text-pink-300 transition-colors">
                    {socials?.instagram?.username || "@shiwant_goyal_"}
                  </span>
                </div>
              </a>

              {/* LinkedIn Card */}
              <a
                href={socials?.linkedin?.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] hover:bg-blue-500/10 border border-white/5 hover:border-blue-500/30 transition-all duration-300 group"
              >
                <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </div>
                <div>
                  <span className="text-xs text-gray-400 font-mono block">LinkedIn</span>
                  <span className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">
                    shiwant-goyal-8a3926412
                  </span>
                </div>
              </a>

              {/* Email Card with Copy Button */}
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400 font-mono">Email Placeholder</span>
                  <button
                    onClick={handleCopyEmail}
                    className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-900 transition-colors"
                  >
                    {copiedEmail ? "✓ Copied!" : "📋 Copy"}
                  </button>
                </div>
                <div className="font-mono text-sm text-gray-200 break-all select-all font-medium">
                  {socials?.email?.address || "your-email@example.com"}
                </div>
                <p className="text-[11px] text-gray-500 italic">
                  * Replace this placeholder with your personal email in <code>src/data/portfolioData.js</code> when ready.
                </p>
              </div>
            </div>

            {/* Quick Slayer Quote Card */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-gray-400 flex items-center gap-3">
              <span className="font-serif text-2xl text-emerald-400">滅</span>
              <span>
                "No matter how many times you fall, keep your heart burning and forge ahead."
              </span>
            </div>

          </div>

          {/* Right Column: Interactive Contact Form */}
          <div className="lg:col-span-7">
            <div className="relative rounded-2xl bg-[#0c1017]/90 border border-white/10 hover:border-cyan-400/40 p-6 sm:p-8 shadow-2xl transition-all duration-300">
              
              <h3 className="text-xl font-bold text-white font-space mb-2">
                Send a Message
              </h3>
              <p className="text-xs text-gray-400 font-mono mb-6">
                Fill out the transmission scroll below.
              </p>

              {submitted ? (
                <div className="p-6 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-3 animate-fadeIn">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-2xl mx-auto">
                    ✓
                  </div>
                  <h4 className="text-lg font-bold text-white font-space">
                    Message Sent Successfully!
                  </h4>
                  <p className="text-sm text-gray-300">
                    Thank you for reaching out. I'll read your transmission and reply promptly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 px-4 py-2 rounded-lg text-xs font-mono text-emerald-300 bg-white/5 hover:bg-white/10 border border-emerald-500/30 transition-colors"
                  >
                    Send Another Transmission
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  {/* Name Input */}
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="block text-xs font-mono text-gray-300 uppercase tracking-wider mb-2"
                    >
                      Your Name <span className="text-cyan-400">*</span>
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Tanjiro Kamado"
                      className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${
                        errors.name ? "border-red-500/80 focus:border-red-400" : "border-white/10 focus:border-cyan-400"
                      } text-white text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all font-sans placeholder-gray-500`}
                    />
                    {errors.name && (
                      <p className="text-xs text-red-400 mt-1 font-mono">{errors.name}</p>
                    )}
                  </div>

                  {/* Email Input */}
                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block text-xs font-mono text-gray-300 uppercase tracking-wider mb-2"
                    >
                      Your Email <span className="text-cyan-400">*</span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. yourname@domain.com"
                      className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${
                        errors.email ? "border-red-500/80 focus:border-red-400" : "border-white/10 focus:border-cyan-400"
                      } text-white text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all font-sans placeholder-gray-500`}
                    />
                    {errors.email && (
                      <p className="text-xs text-red-400 mt-1 font-mono">{errors.email}</p>
                    )}
                  </div>

                  {/* Message Input */}
                  <div>
                    <label
                      htmlFor="contact-message"
                      className="block text-xs font-mono text-gray-300 uppercase tracking-wider mb-2"
                    >
                      Your Message <span className="text-cyan-400">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows="4"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell me about your project, idea, or collaboration..."
                      className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${
                        errors.message ? "border-red-500/80 focus:border-red-400" : "border-white/10 focus:border-cyan-400"
                      } text-white text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all font-sans placeholder-gray-500 resize-none`}
                    ></textarea>
                    {errors.message && (
                      <p className="text-xs text-red-400 mt-1 font-mono">{errors.message}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full relative group overflow-hidden py-3.5 px-6 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 shadow-lg shadow-cyan-950 transition-all duration-300 hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <span>{isSubmitting ? "Transmitting..." : "Send Message"}</span>
                      <span>{isSubmitting ? "⏳" : "⚔️"}</span>
                    </span>
                  </button>
                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

if (typeof window !== "undefined") {
  window.Contact = Contact;
}

// ===== src/components/Footer.jsx =====
/**
 * ============================================================================
 * FOOTER COMPONENT
 * ============================================================================
 * Features:
 * - "© 2026 Shiwant Goyal. Built with passion & code."
 * - Social icons: Instagram, LinkedIn, GitHub
 * - Demon Slayer motto & back-to-top smooth scroll
 */

function Footer() {
  const { personal, socials } = window.portfolioData || {};

  const scrollToTop = () => {
    if (window.soundManager) window.soundManager.playClick();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-[#070a0e] border-t border-white/10 pt-12 pb-10 overflow-hidden">
      {/* Tanjiro checkered bottom border accent */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-500"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Brand & Copyright */}
          <div className="flex flex-col items-center md:items-start space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-wider uppercase font-space text-white">
                Shiwant Goyal
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-cyan-300">
                滅 BCA 1ST YEAR
              </span>
            </div>
            
            <p className="text-xs text-gray-400 font-sans">
              © 2026 Shiwant Goyal. Built with passion &amp; code.
            </p>
            <p className="text-[11px] text-gray-500 font-mono">
              {personal?.demonSlayerMotto || "滅 — Slay the Bugs, Forge the Future."}
            </p>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-4">
            {/* Instagram */}
            <a
              href={socials?.instagram?.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-lg bg-white/5 hover:bg-pink-500/15 border border-white/10 hover:border-pink-500/40 text-gray-400 hover:text-pink-400 flex items-center justify-center transition-all hover:scale-105"
              aria-label="Instagram"
              title="Instagram"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>

            {/* LinkedIn */}
            <a
              href={socials?.linkedin?.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-lg bg-white/5 hover:bg-blue-500/15 border border-white/10 hover:border-blue-500/40 text-gray-400 hover:text-blue-400 flex items-center justify-center transition-all hover:scale-105"
              aria-label="LinkedIn"
              title="LinkedIn"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>

            {/* GitHub */}
            <a
              href={socials?.github?.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/30 text-gray-400 hover:text-white flex items-center justify-center transition-all hover:scale-105"
              aria-label="GitHub"
              title="GitHub"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
            </a>

            {/* Back to top button */}
            <button
              onClick={scrollToTop}
              className="w-9 h-9 rounded-lg bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-400/40 text-gray-400 hover:text-cyan-300 flex items-center justify-center transition-all hover:scale-105"
              title="Return to peak"
              aria-label="Back to top"
            >
              ↑
            </button>
          </div>

        </div>
      </div>
    </footer>
  );
}

if (typeof window !== "undefined") {
  window.Footer = Footer;
}

// ===== src/App.jsx =====
/**
 * ============================================================================
 * MAIN APP COMPONENT
 * ============================================================================
 * Orchestrates:
 * - Breathing Style Theme Engine (Water, Sun, Thunder)
 * - Web Audio procedural sound effects
 * - Ambient dynamic particle canvas
 * - Scroll spy for active navbar link
 * - Universal toast notifications
 */

function App() {
  const [breathingStyle, setBreathingStyle] = React.useState("water");
  const [sfxEnabled, setSfxEnabled] = React.useState(true);
  const [toastMessage, setToastMessage] = React.useState(null);
  const [activeSection, setActiveSection] = React.useState("top");

  // Sync SFX state on mount
  React.useEffect(() => {
    if (window.soundManager) {
      setSfxEnabled(window.soundManager.isEnabled());
    }
  }, []);

  // Update HTML data-breathing attribute for CSS theme variable cascading
  React.useEffect(() => {
    document.documentElement.setAttribute("data-breathing", breathingStyle);
  }, [breathingStyle]);

  // Scroll spy to update active section
  React.useEffect(() => {
    const sections = ["top", "about", "skills", "projects", "education", "journey", "contact"];
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const id = sections[i];
        const elem = document.getElementById(id);
        if (elem && elem.offsetTop <= scrollPosition) {
          setActiveSection(id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // SFX toggle handler
  const handleToggleSfx = () => {
    if (window.soundManager) {
      const newState = window.soundManager.toggle();
      setSfxEnabled(newState);
      showToast(newState ? "Audio Effects: Activated 🔊" : "Audio Effects: Muted 🔇");
    }
  };

  // Toast handler
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3500);
  };

  return (
    <div className="relative min-h-screen bg-[#080c11] text-gray-100 selection:bg-cyan-500 selection:text-black font-sans overflow-x-hidden">
      {/* Dynamic Ambient Breathing Canvas */}
      <window.BreathingCanvas breathingStyle={breathingStyle} />

      {/* Sticky Glassmorphic Navbar */}
      <window.Navbar
        breathingStyle={breathingStyle}
        setBreathingStyle={setBreathingStyle}
        sfxEnabled={sfxEnabled}
        onToggleSfx={handleToggleSfx}
        activeSection={activeSection}
      />

      {/* Main Content Sections */}
      <main className="relative z-10">
        <window.Hero breathingStyle={breathingStyle} />
        <window.About breathingStyle={breathingStyle} />
        <window.Skills breathingStyle={breathingStyle} />
        <window.Projects breathingStyle={breathingStyle} />
        <window.Education breathingStyle={breathingStyle} />
        <window.LearningJourney breathingStyle={breathingStyle} />
        <window.Contact breathingStyle={breathingStyle} onShowToast={showToast} />
      </main>

      {/* Footer */}
      <window.Footer />

      {/* Floating Interactive Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-[#0c121a]/95 border border-cyan-500/40 text-white text-xs sm:text-sm font-mono shadow-2xl backdrop-blur-xl animate-slideUp">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}

if (typeof window !== "undefined") {
  window.App = App;
}

// ===== src/main.jsx =====
/**
 * ============================================================================
 * MAIN ENTRYPOINT (REACT 18 ROOT)
 * ============================================================================
 */

(function () {
  const rootElement = document.getElementById("root");
  if (!rootElement) return;

  if (window.ReactDOM && window.ReactDOM.createRoot) {
    const root = window.ReactDOM.createRoot(rootElement);
    root.render(React.createElement(window.App));
  } else if (window.ReactDOM && window.ReactDOM.render) {
    window.ReactDOM.render(React.createElement(window.App), rootElement);
  }
})();
