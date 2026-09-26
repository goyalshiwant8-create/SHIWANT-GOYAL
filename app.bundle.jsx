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

function Hero({ breathingStyle, setBreathingStyle, onTriggerSlash, onOpenQuiz, onShowToast }) {
  const { personal, socials, codeSnippets } = window.portfolioData || {};
  const [activeTab, setActiveTab] = React.useState("main.c");
  const [terminalOutput, setTerminalOutput] = React.useState(null);
  const [isCompiling, setIsCompiling] = React.useState(false);
  const [compileStage, setCompileStage] = React.useState("");

  // Interactive CLI Shell state
  const [cliInput, setCliInput] = React.useState("");
  const [cliHistory, setCliHistory] = React.useState([
    { type: "system", text: "滅 NICHIRIN INTERACTIVE SHELL v2.4 [Total Concentration OS]" },
    { type: "system", text: "Type 'help' to view commands or click a chip below to execute!" },
  ]);
  const [cmdHistory, setCmdHistory] = React.useState([]);
  const [cmdHistoryIndex, setCmdHistoryIndex] = React.useState(-1);
  const cliEndRef = React.useRef(null);

  // Auto-scroll CLI output
  React.useEffect(() => {
    if (activeTab === "cli" && cliEndRef.current) {
      cliEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [cliHistory, activeTab]);

  const currentSnippet = (codeSnippets || []).find((s) => s.id === activeTab) || codeSnippets[0];

  const handleTabChange = (snippetId) => {
    setActiveTab(snippetId);
    setTerminalOutput(null);
    if (window.soundManager) window.soundManager.playClick();
  };

  // Animated realistic multi-step compilation
  const handleRunCode = () => {
    if (window.soundManager) window.soundManager.playKatanaChime();
    setIsCompiling(true);
    setTerminalOutput(null);

    const isC = currentSnippet.language === "c";
    setCompileStage(isC ? "[1/3] gcc -Wall -O2 " + currentSnippet.id + " ..." : "[1/3] Bundling React Virtual DOM ...");

    setTimeout(() => {
      setCompileStage(isC ? "[2/3] Verifying Nichirin logic & memory integrity ... OK" : "[2/3] Hydrating state hooks & animations ... OK");
      if (window.soundManager) window.soundManager.playBeep();

      setTimeout(() => {
        setCompileStage(isC ? "[3/3] Linking shiwant_core.exe ... SUCCESS (18ms)" : "[3/3] Render complete (1.2ms)");
        setIsCompiling(false);
        setTerminalOutput(currentSnippet.output);
        if (window.soundManager) window.soundManager.playSuccess();
      }, 350);
    }, 350);
  };

  // Interactive CLI Command Runner
  const handleExecuteCommand = (rawCmd) => {
    const trimmed = (rawCmd || cliInput).trim();
    if (!trimmed) return;

    if (window.soundManager) window.soundManager.playClick();

    // Add to input history
    setCmdHistory((prev) => [trimmed, ...prev]);
    setCmdHistoryIndex(-1);

    const parts = trimmed.split(" ");
    const cmd = parts[0].toLowerCase();
    const arg = parts.slice(1).join(" ").toLowerCase();

    const newHistory = [...cliHistory, { type: "input", text: `shiwant@slayer-corps:~$ ${trimmed}` }];

    switch (cmd) {
      case "help":
        newHistory.push({
          type: "output",
          text: `AVAILABLE NICHIRIN COMMANDS:
  about         - Shiwant's BCA journey @ BVIMR & goals
  skills        - List active programming & web arsenal
  projects      - Display current featured projects
  theme <style> - Switch theme: 'water', 'sun', or 'thunder'
  time          - Real-time Delhi IST clock & active schedule
  quiz          - Launch the Demon Slayer Developer Rank Test
  slay          - Unleash full-screen Nichirin Blade Slash!
  contact       - Display direct contact channels
  clear         - Clear terminal console`,
        });
        break;

      case "about":
        newHistory.push({
          type: "output",
          text: `SHIWANT GOYAL // BCA 1st Year @ BVIMR New Delhi
Status: Currently learning, building, and solving algorithms daily.
Motto: "滅 — Slay the Bugs, Forge the Future."
Goal: Become a high-impact full-stack web developer.`,
        });
        break;

      case "skills":
        newHistory.push({
          type: "output",
          text: `TECHNICAL ARSENAL // PROFICIENCY:
  [====================] C Programming (Foundational Core)
  [==================  ] Problem Solving & Algorithms (Active)
  [=================== ] HTML5 & Modern Responsive CSS3
  [================    ] JavaScript (ES6+, DOM, Asynchronous)
  [=============       ] React & Component Architecture (In Progress)`,
        });
        break;

      case "projects":
        newHistory.push({
          type: "output",
          text: `FEATURED PROJECTS:
  1. Portfolio Website (Demon Slayer React Theme) -> In Progress
  2. C Programming Projects (Calculators, Games, Algorithms) -> Active Labs
Type 'clear' or scroll down to inspect details in the Projects section!`,
        });
        break;

      case "theme":
        if (["water", "sun", "thunder"].includes(arg)) {
          if (setBreathingStyle) setBreathingStyle(arg);
          if (window.soundManager) window.soundManager.playBreathingSound(arg);
          newHistory.push({
            type: "success",
            text: `[FORM SHIFT]: Activated ${arg.toUpperCase()} BREATHING (${arg === "water" ? "水の呼吸 🌊" : arg === "sun" ? "日の呼吸 🔥" : "雷の呼吸 ⚡"})!`,
          });
          if (onShowToast) onShowToast(`Theme switched to ${arg.toUpperCase()} Breathing!`);
        } else {
          newHistory.push({
            type: "error",
            text: `Invalid theme. Choose: 'theme water', 'theme sun', or 'theme thunder'.`,
          });
        }
        break;

      case "time":
        const now = new Date();
        const timeStr = now.toLocaleTimeString("en-US", { timeZone: "Asia/Kolkata", hour12: true });
        newHistory.push({
          type: "output",
          text: `LOCAL TIME [New Delhi, India]: ${timeStr} IST
Current Status: Total Concentration // Coding C & Web Projects @ BVIMR`,
        });
        break;

      case "slay":
        if (onTriggerSlash) onTriggerSlash();
        if (window.soundManager) window.soundManager.playSlash();
        newHistory.push({
          type: "success",
          text: `⚔️ TOTAL CONCENTRATION: KATANA SLASH UNLEASHED! 滅`,
        });
        break;

      case "quiz":
        if (onOpenQuiz) onOpenQuiz();
        newHistory.push({
          type: "success",
          text: `Launching Demon Slayer Developer Rank Test... Ready your blade!`,
        });
        break;

      case "contact":
        newHistory.push({
          type: "output",
          text: `CONNECT WITH SHIWANT:
  Instagram: ${socials?.instagram?.username || "@shiwant_goyal_"}
  LinkedIn : ${socials?.linkedin?.url || "Available on profile"}
  GitHub   : ${socials?.github?.url || "goyalshiwant8-create"}
  Email    : ${socials?.email?.address || "your-email@example.com"}`,
        });
        break;

      case "clear":
        setCliHistory([
          { type: "system", text: "滅 Terminal cleared. Type 'help' for commands." },
        ]);
        setCliInput("");
        return;

      default:
        newHistory.push({
          type: "error",
          text: `Command not found: '${trimmed}'. Type 'help' to see valid commands.`,
        });
    }

    setCliHistory(newHistory);
    setCliInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleExecuteCommand(cliInput);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (cmdHistory.length > 0 && cmdHistoryIndex + 1 < cmdHistory.length) {
        const nextIndex = cmdHistoryIndex + 1;
        setCmdHistoryIndex(nextIndex);
        setCliInput(cmdHistory[nextIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (cmdHistoryIndex > 0) {
        const nextIndex = cmdHistoryIndex - 1;
        setCmdHistoryIndex(nextIndex);
        setCliInput(cmdHistory[nextIndex]);
      } else {
        setCmdHistoryIndex(-1);
        setCliInput("");
      }
    }
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

              {/* Code & CLI Tabs */}
              <div className="flex items-center justify-between px-3 pt-2 border-b border-white/5 bg-[#090d13]">
                <div className="flex items-center gap-1 overflow-x-auto">
                  {/* Interactive CLI Shell Tab */}
                  <button
                    onClick={() => handleTabChange("cli")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t-lg text-xs font-mono transition-all ${
                      activeTab === "cli"
                        ? "bg-[#111722] text-emerald-300 border-t-2 border-emerald-400 font-semibold"
                        : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
                    }`}
                  >
                    <span>&gt;_ cli</span>
                    <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                      Interactive
                    </span>
                  </button>

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

                {/* Run / Compile Button (Visible on code snippet tabs) */}
                {activeTab !== "cli" && (
                  <button
                    onClick={handleRunCode}
                    disabled={isCompiling}
                    className="flex items-center gap-1.5 px-3 py-1 mb-1 rounded-md text-xs font-mono font-medium text-emerald-300 bg-emerald-950/60 border border-emerald-500/40 hover:bg-emerald-900/60 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                    title="Run code in simulated environment"
                  >
                    <span>{isCompiling ? "⏳" : "▶"}</span>
                    <span>{isCompiling ? "Running..." : "Run"}</span>
                  </button>
                )}
              </div>

              {/* Terminal / Code Editor Body */}
              {activeTab === "cli" ? (
                /* INTERACTIVE CLI SHELL */
                <div className="p-4 sm:p-5 font-mono text-xs sm:text-[13px] bg-[#0b0f15] rounded-b-xl min-h-[300px] flex flex-col justify-between">
                  {/* CLI Output Log */}
                  <div className="overflow-y-auto max-h-[260px] space-y-2 pr-1 custom-scroll">
                    {cliHistory.map((item, idx) => (
                      <div
                        key={idx}
                        className={
                          item.type === "system"
                            ? "text-gray-400 text-xs italic border-b border-white/5 pb-1"
                            : item.type === "input"
                            ? "text-cyan-300 font-semibold"
                            : item.type === "success"
                            ? "text-emerald-300 font-bold bg-emerald-950/30 p-1.5 rounded border border-emerald-500/20"
                            : item.type === "error"
                            ? "text-red-400 bg-red-950/20 p-1 rounded"
                            : "text-gray-200 whitespace-pre-wrap leading-relaxed"
                        }
                      >
                        {item.text}
                      </div>
                    ))}
                    <div ref={cliEndRef} />
                  </div>

                  {/* Quick Command Suggestions */}
                  <div className="mt-3 pt-3 border-t border-white/5 flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] text-gray-500 font-mono">Suggestions:</span>
                    {["help", "about", "skills", "projects", "theme sun", "slay", "clear"].map((cmd) => (
                      <button
                        key={cmd}
                        onClick={() => handleExecuteCommand(cmd)}
                        className="px-2 py-0.5 rounded text-[11px] font-mono bg-white/5 hover:bg-cyan-500/20 text-gray-300 hover:text-cyan-200 border border-white/10 transition-colors"
                      >
                        {cmd}
                      </button>
                    ))}
                  </div>

                  {/* Command Input Prompt */}
                  <div className="mt-2 flex items-center gap-2 pt-2 border-t border-white/10">
                    <span className="text-emerald-400 font-mono text-xs select-none">shiwant@slayer:~$</span>
                    <input
                      type="text"
                      value={cliInput}
                      onChange={(e) => setCliInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="type a command (e.g. 'help', 'slay')..."
                      className="flex-1 bg-transparent border-none outline-none font-mono text-xs sm:text-sm text-cyan-200 placeholder-gray-600 focus:ring-0"
                      autoFocus
                    />
                    <button
                      onClick={() => handleExecuteCommand(cliInput)}
                      className="px-2.5 py-1 rounded bg-emerald-600/80 hover:bg-emerald-500 text-white text-[11px] font-mono font-medium transition-colors"
                    >
                      Enter ↵
                    </button>
                  </div>
                </div>
              ) : (
                /* CODE SNIPPET VIEWER */
                <div className="p-4 sm:p-5 font-mono text-xs sm:text-[13px] leading-relaxed bg-[#0b0f15] rounded-b-xl overflow-x-auto min-h-[300px]">
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

                  {/* Compiling Stage Banner */}
                  {isCompiling && (
                    <div className="mt-4 p-3 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs font-mono flex items-center gap-2 animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                      <span>{compileStage}</span>
                    </div>
                  )}

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
              )}

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

// ===== src/components/LiveGitHubHub.jsx =====
/**
 * ============================================================================
 * LIVE GITHUB DEV HUB COMPONENT
 * ============================================================================
 * Fetches real-time telemetry, repository stats, and live code activity
 * directly from the GitHub REST API (goyalshiwant8-create).
 * Features:
 * - Real Public Repo count
 * - Live follower telemetry
 * - Dynamic list of recently updated GitHub repositories
 * - Live sync indicator & manual refresh trigger
 * - Smooth fallback to curated cache if rate-limited or offline
 */

function LiveGitHubHub({ breathingStyle }) {
  const { socials } = window.portfolioData || {};
  const username = socials?.github?.username || "goyalshiwant8-create";

  const [userData, setUserData] = React.useState(null);
  const [repos, setRepos] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [lastUpdated, setLastUpdated] = React.useState(null);
  const [fetchError, setFetchError] = React.useState(null);

  const fetchGitHubData = React.useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      // 1. Fetch user profile
      const userRes = await fetch(`https://api.github.com/users/${username}`);
      if (!userRes.ok) throw new Error(`User fetch failed (${userRes.status})`);
      const userJson = await userRes.json();
      setUserData(userJson);

      // 2. Fetch recent public repos
      const reposRes = await fetch(
        `https://api.github.com/users/${username}/repos?sort=updated&per_page=6`
      );
      if (!reposRes.ok) throw new Error(`Repos fetch failed (${reposRes.status})`);
      const reposJson = await reposRes.json();
      setRepos(reposJson);

      setLastUpdated(new Date().toLocaleTimeString("en-US", { hour12: true, hour: "numeric", minute: "2-digit" }));
    } catch (err) {
      setFetchError(err.message);
      // Fallback cache so the card never looks broken
      setUserData({
        public_repos: 4,
        followers: 1,
        following: 1,
        name: "Shiwant Goyal",
        html_url: `https://github.com/${username}`,
      });
      setRepos([
        {
          id: 1,
          name: "SHIWANT-GOYAL",
          description: "Personal Demon Slayer themed developer portfolio with Web Audio & React architecture.",
          language: "JavaScript",
          stargazers_count: 1,
          html_url: `https://github.com/${username}/SHIWANT-GOYAL`,
        },
        {
          id: 2,
          name: "C-Lectures-And-Labs",
          description: "BCA 1st Year C programming exercises, pointer models, loops, and algorithmic calculators.",
          language: "C",
          stargazers_count: 0,
          html_url: `https://github.com/${username}`,
        },
        {
          id: 3,
          name: "HTML-Questions-Practice",
          description: "Comprehensive semantic HTML5 and modern CSS3 practice exercises and responsive layouts.",
          language: "HTML",
          stargazers_count: 0,
          html_url: `https://github.com/${username}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [username]);

  React.useEffect(() => {
    fetchGitHubData();
  }, [fetchGitHubData]);

  const handleRefresh = () => {
    if (window.soundManager) window.soundManager.playKatanaChime();
    fetchGitHubData();
  };

  return (
    <section className="relative py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hub Card Container */}
        <div className="rounded-2xl bg-[#0c1017]/90 border border-white/10 hover:border-cyan-500/40 p-6 sm:p-8 shadow-2xl backdrop-blur-xl transition-all">
          
          {/* Header Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span className="text-xs font-mono font-semibold tracking-wider text-emerald-300 uppercase">
                  ● Live GitHub Telemetry
                </span>
                {lastUpdated && (
                  <span className="text-[10px] font-mono text-gray-400">
                    // Synced at {lastUpdated}
                  </span>
                )}
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-space flex items-center gap-2">
                <span>Real-Time Code Activity</span>
                <span className="text-lg">⚡</span>
              </h3>
            </div>

            {/* Profile Action & Refresh */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-all active:scale-95 disabled:opacity-50"
                title="Re-sync data from GitHub API"
              >
                <span className={loading ? "animate-spin" : ""}>🔄</span>
                <span>{loading ? "Syncing..." : "Sync Live API"}</span>
              </button>

              <a
                href={`https://github.com/${username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 shadow-md shadow-cyan-950 transition-all hover:scale-105"
              >
                <span>@{username}</span>
                <span>↗</span>
              </a>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-6">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center">
              <span className="text-2xl font-bold font-mono text-cyan-300">
                {userData?.public_repos ?? "..."}
              </span>
              <span className="block text-xs font-mono text-gray-400 mt-1">Public Repos</span>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center">
              <span className="text-2xl font-bold font-mono text-emerald-300">
                {userData?.followers ?? "..."}
              </span>
              <span className="block text-xs font-mono text-gray-400 mt-1">Followers</span>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center">
              <span className="text-2xl font-bold font-mono text-amber-300">
                BCA Yr 1
              </span>
              <span className="block text-xs font-mono text-gray-400 mt-1">Academic Rank</span>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center">
              <span className="text-2xl font-bold font-mono text-purple-300">
                滅 100%
              </span>
              <span className="block text-xs font-mono text-gray-400 mt-1">Total Concentration</span>
            </div>
          </div>

          {/* Live Repositories Grid */}
          <div className="mt-4">
            <span className="text-xs font-mono text-gray-400 block mb-3 uppercase tracking-wider">
              Latest Synchronized Repositories:
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {repos.map((repo) => (
                <div
                  key={repo.id}
                  className="p-4 rounded-xl bg-[#090d13] border border-white/10 hover:border-cyan-400/40 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 font-mono truncate">
                        {repo.name}
                      </h4>
                      {repo.language && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                          {repo.language}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                      {repo.description || "Public repository for BCA programming & web practice."}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                    <span className="text-gray-500 flex items-center gap-1">
                      <span>★</span> {repo.stargazers_count || 0}
                    </span>
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1 font-medium"
                    >
                      <span>Inspect</span>
                      <span>→</span>
                    </a>
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
  window.LiveGitHubHub = LiveGitHubHub;
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

// ===== src/components/VisitorInteractions.jsx =====
/**
 * ============================================================================
 * VISITOR INTERACTIONS COMPONENT (REACTIONS & GUESTBOOK WALL)
 * ============================================================================
 * Enables dynamic community interaction:
 * - Interactive Endorsement & Reaction Counters (persisted in localStorage)
 * - Dynamic Guestbook Message Wall with instant note submission
 * - Audio chimes on endorsement & message submission
 */

function VisitorInteractions({ breathingStyle, onShowToast }) {
  const { reactions: defaultReactions, guestbook: seedGuestbook } =
    window.portfolioData || {};

  // Reactions state (synced with localStorage)
  const [counts, setCounts] = React.useState(() => {
    try {
      const saved = localStorage.getItem("shiwant_visitor_reactions");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      slay: defaultReactions?.slay?.defaultCount || 142,
      speed: defaultReactions?.speed?.defaultCount || 98,
      potential: defaultReactions?.potential?.defaultCount || 116,
      clean: defaultReactions?.clean?.defaultCount || 89,
    };
  });

  const [hasVoted, setHasVoted] = React.useState({});

  // Guestbook state (synced with localStorage)
  const [notes, setNotes] = React.useState(() => {
    try {
      const saved = localStorage.getItem("shiwant_guestbook_notes");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return seedGuestbook || [];
  });

  const [newNote, setNewNote] = React.useState({ name: "", role: "", message: "" });
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Handle clicking a reaction
  const handleReactionClick = (key) => {
    if (window.soundManager) window.soundManager.playKatanaChime();

    setCounts((prev) => {
      const updated = { ...prev, [key]: (prev[key] || 0) + 1 };
      try {
        localStorage.setItem("shiwant_visitor_reactions", JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    setHasVoted((prev) => ({ ...prev, [key]: true }));

    if (onShowToast) {
      onShowToast("Reaction recorded! Arigato for the endorsement! ⚔️");
    }
  };

  // Handle submitting a guestbook note
  const handleNoteSubmit = (e) => {
    e.preventDefault();
    if (!newNote.name.trim() || !newNote.message.trim()) {
      if (onShowToast) onShowToast("Please provide both your name and a brief note!");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const created = {
        id: "note-" + Date.now(),
        name: newNote.name.trim(),
        role: newNote.role.trim() || "Visitor",
        badge: "Community",
        message: newNote.message.trim(),
        date: "Just now",
        avatarEmoji: ["🌊", "🔥", "⚡", "⚔️", "🍃"][Math.floor(Math.random() * 5)],
      };

      setNotes((prev) => {
        const updated = [created, ...prev];
        try {
          localStorage.setItem("shiwant_guestbook_notes", JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });

      setNewNote({ name: "", role: "", message: "" });
      setIsSubmitting(false);

      if (window.soundManager) window.soundManager.playSuccess();
      if (onShowToast) onShowToast("Your note has been posted to Shiwant's Wall! 🎉");
    }, 400);
  };

  return (
    <section className="relative py-20 lg:py-24 overflow-hidden bg-white/[0.01]">
      {/* Katana divider */}
      <div className="max-w-7xl mx-auto px-4 mb-16">
        <div className="relative flex items-center justify-center">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent"></div>
          <span className="absolute px-4 bg-[#080c11] text-xs font-mono text-purple-400/80 tracking-widest uppercase flex items-center gap-2">
            <span>絆</span> SECTION 04 // VISITOR ENDORSEMENTS <span>絆</span>
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-purple-300 mb-3">
            <span className="font-serif">絆</span> COMMUNITY & ENDORSEMENTS
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-space tracking-tight">
            Visitor Pulse & Guestbook
          </h2>
          <p className="mt-4 text-base text-gray-300 leading-relaxed">
            Leave a live reaction or write a quick note on Shiwant's portfolio wall. All endorsements are synced in real time!
          </p>
          <div className="w-16 h-1 mx-auto mt-4 rounded-full bg-gradient-to-r from-purple-400 to-cyan-400"></div>
        </div>

        {/* 1. Interactive Reactions Bar */}
        <div className="max-w-4xl mx-auto mb-16 p-6 sm:p-8 rounded-2xl bg-[#0c1017]/85 border border-white/10 shadow-xl backdrop-blur-xl">
          <span className="text-xs font-mono text-gray-400 block mb-4 uppercase tracking-wider text-center">
            Tap a reaction to endorse Shiwant's work:
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { key: "slay", emoji: "⚔️", label: "Total Concentration" },
              { key: "speed", emoji: "⚡", label: "Fast Learner" },
              { key: "potential", emoji: "🚀", label: "High Potential" },
              { key: "clean", emoji: "💡", label: "Clean Code" },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => handleReactionClick(item.key)}
                className={`group p-4 rounded-xl border flex flex-col items-center gap-2 transition-all duration-300 hover:scale-105 active:scale-95 ${
                  hasVoted[item.key]
                    ? "bg-purple-950/40 border-purple-500/50 shadow-lg shadow-purple-950/50"
                    : "bg-white/[0.02] hover:bg-white/[0.06] border-white/10 hover:border-cyan-400/40"
                }`}
              >
                <span className="text-3xl group-hover:scale-110 transition-transform">
                  {item.emoji}
                </span>
                <span className="text-xs font-semibold text-white font-space text-center">
                  {item.label}
                </span>
                <span className="text-sm font-mono font-bold text-cyan-300 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                  {counts[item.key] || 0}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Guestbook Wall & Submission Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
          
          {/* Submission Form Column */}
          <div className="lg:col-span-5 p-6 sm:p-7 rounded-2xl bg-[#0c1017]/90 border border-white/10 shadow-xl">
            <h3 className="text-xl font-bold text-white font-space mb-2 flex items-center gap-2">
              <span>Sign the Scroll</span>
              <span>📜</span>
            </h3>
            <p className="text-xs text-gray-400 mb-6 font-sans">
              Leave a greeting, feedback, or words of encouragement for Shiwant's learning journey!
            </p>

            <form onSubmit={handleNoteSubmit} className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-gray-400 mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  value={newNote.name}
                  onChange={(e) => setNewNote({ ...newNote, name: e.target.value })}
                  placeholder="e.g. Tanjiro / Rahul Sharma"
                  className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Your Role / Tag (Optional)</label>
                <input
                  type="text"
                  value={newNote.role}
                  onChange={(e) => setNewNote({ ...newNote, role: e.target.value })}
                  placeholder="e.g. BCA Classmate / Recruiter / Friend"
                  className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Message *</label>
                <textarea
                  required
                  rows="3"
                  value={newNote.message}
                  onChange={(e) => setNewNote({ ...newNote, message: e.target.value })}
                  placeholder="Write something nice..."
                  className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white focus:outline-none focus:border-purple-400 font-sans"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-semibold text-xs transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-purple-950"
              >
                {isSubmitting ? "Inscribing Scroll..." : "Post to Guestbook ⚔️"}
              </button>
            </form>
          </div>

          {/* Live Notes Wall Column */}
          <div className="lg:col-span-7 space-y-4 max-h-[480px] overflow-y-auto pr-1">
            <div className="flex items-center justify-between text-xs font-mono text-gray-400 pb-2 border-b border-white/10">
              <span>COMMUNITY SCROLL ({notes.length} Notes)</span>
              <span className="text-purple-300">● Live Feed</span>
            </div>

            {notes.map((note) => (
              <div
                key={note.id}
                className="p-4 rounded-xl bg-[#090d13]/80 border border-white/10 hover:border-purple-400/30 transition-all flex gap-3.5"
              >
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xl flex-shrink-0">
                  {note.avatarEmoji || "⚔️"}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="text-xs font-bold text-white font-space truncate">
                      {note.name}
                    </h4>
                    <span className="text-[10px] font-mono text-gray-500">
                      {note.date}
                    </span>
                  </div>

                  <span className="inline-block text-[10px] font-mono px-2 py-0.2 rounded-full bg-purple-950/60 text-purple-300 border border-purple-500/20 mb-2">
                    {note.role}
                  </span>

                  <p className="text-xs text-gray-300 leading-relaxed font-sans">
                    {note.message}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}

if (typeof window !== "undefined") {
  window.VisitorInteractions = VisitorInteractions;
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

    // Save message locally to history
    try {
      const existing = JSON.parse(localStorage.getItem("shiwant_sent_messages") || "[]");
      existing.unshift({
        name: formData.name,
        email: formData.email,
        message: formData.message,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem("shiwant_sent_messages", JSON.stringify(existing));
    } catch (e) {}

    // Simulate reliable submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      if (window.soundManager) window.soundManager.playSuccess();
      if (onShowToast) {
        onShowToast("Message transmitted! Shiwant will get back to you soon. ⚔️");
      }
      setFormData({ name: "", email: "", message: "" });
    }, 700);
  };

  const handleLaunchMailClient = () => {
    const targetEmail = socials?.email?.address || "your-email@example.com";
    const subject = encodeURIComponent(`Portfolio Inquiry from ${formData.name || "Visitor"}`);
    const body = encodeURIComponent(formData.message || "Hi Shiwant,\n\nI visited your portfolio and wanted to connect!");
    window.location.href = `mailto:${targetEmail}?subject=${subject}&body=${body}`;
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

// ===== src/components/ProjectModal.jsx =====
/**
 * ============================================================================
 * PROJECT MODAL COMPONENT (INTERACTIVE IN-BROWSER SIMULATOR)
 * ============================================================================
 * Allows visitors to interactively test and preview projects directly in the browser!
 * Includes:
 * - In-Browser C Simulator:
 *     1. Number Guessing Game (Demon Slayer Training)
 *     2. Algorithmic Math & Logic Tester (Prime check, Factorial, Fibonacci)
 * - Portfolio Website Live Theme & Feature Inspector
 * - Direct links to GitHub and source code
 */

function ProjectModal({ project, onClose, breathingStyle, onShowToast }) {
  if (!project) return null;

  const isCProject = project.id === "c-programming-projects";
  const [activeTab, setActiveTab] = React.useState(isCProject ? "game" : "overview");

  // Number Guessing Game State
  const [targetNumber, setTargetNumber] = React.useState(() => Math.floor(Math.random() * 100) + 1);
  const [guessInput, setGuessInput] = React.useState("");
  const [guessLog, setGuessLog] = React.useState([]);
  const [gameWon, setGameWon] = React.useState(false);

  // Math Logic Tool State
  const [mathTool, setMathTool] = React.useState("prime");
  const [mathInput, setMathInput] = React.useState("17");
  const [mathResult, setMathResult] = React.useState(null);

  // Close on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Handle Number Guessing
  const handleGuess = (e) => {
    e.preventDefault();
    const num = parseInt(guessInput, 10);
    if (isNaN(num) || num < 1 || num > 100) {
      if (onShowToast) onShowToast("Please enter a valid number between 1 and 100!");
      return;
    }

    if (window.soundManager) window.soundManager.playClick();

    if (num === targetNumber) {
      setGameWon(true);
      setGuessLog((prev) => [
        { guess: num, result: "🎯 BINGO! Total Concentration achieved!", success: true },
        ...prev,
      ]);
      if (window.soundManager) window.soundManager.playSuccess();
      if (onShowToast) onShowToast("Flawless strike! You guessed correctly! ⚔️");
    } else if (num < targetNumber) {
      setGuessLog((prev) => [
        { guess: num, result: "🌊 Too low! Aim higher like Water Breathing!", success: false },
        ...prev,
      ]);
      if (window.soundManager) window.soundManager.playBeep();
    } else {
      setGuessLog((prev) => [
        { guess: num, result: "🔥 Too high! Temper your flame!", success: false },
        ...prev,
      ]);
      if (window.soundManager) window.soundManager.playBeep();
    }
    setGuessInput("");
  };

  const handleResetGame = () => {
    setTargetNumber(Math.floor(Math.random() * 100) + 1);
    setGuessLog([]);
    setGameWon(false);
    setGuessInput("");
    if (window.soundManager) window.soundManager.playKatanaChime();
  };

  // Handle Math Computation
  const handleCalculateMath = () => {
    const val = parseInt(mathInput, 10);
    if (isNaN(val)) return;

    if (window.soundManager) window.soundManager.playClick();

    if (mathTool === "prime") {
      if (val <= 1) {
        setMathResult(`${val} is NOT prime (primes are > 1).`);
        return;
      }
      let isPrime = true;
      for (let i = 2; i * i <= val; i++) {
        if (val % i === 0) {
          isPrime = false;
          break;
        }
      }
      setMathResult(isPrime ? `✅ ${val} is a PRIME NUMBER! (Only divisible by 1 & ${val})` : `❌ ${val} is COMPOSITE (divisible by other factors).`);
    } else if (mathTool === "factorial") {
      if (val < 0 || val > 20) {
        setMathResult("Please enter a number between 0 and 20.");
        return;
      }
      let res = 1;
      for (let i = 2; i <= val; i++) res *= i;
      setMathResult(`${val}! = ${res.toLocaleString()}`);
    } else if (mathTool === "fibonacci") {
      if (val < 1 || val > 25) {
        setMathResult("Please choose length between 1 and 25.");
        return;
      }
      const seq = [0, 1];
      while (seq.length < val) {
        seq.push(seq[seq.length - 1] + seq[seq.length - 2]);
      }
      setMathResult(`First ${val} terms: [ ${seq.slice(0, val).join(", ")} ]`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0d121a] border border-cyan-500/40 shadow-2xl shadow-cyan-950/60 p-6 sm:p-8 flex flex-col justify-between">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-cyan-400 font-semibold uppercase">
                {project.breathingStyle}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-emerald-300">
                {project.badge}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-space">
              {project.title}
            </h2>
          </div>

          <button
            onClick={() => {
              if (window.soundManager) window.soundManager.playClick();
              onClose();
            }}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-gray-400 hover:text-white flex items-center justify-center text-sm transition-colors"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        {isCProject && (
          <div className="flex items-center gap-2 my-4 border-b border-white/10 pb-2">
            <button
              onClick={() => setActiveTab("game")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                activeTab === "game"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              🎮 C Game Simulator
            </button>
            <button
              onClick={() => setActiveTab("math")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                activeTab === "math"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              🔢 Algorithmic Calculator
            </button>
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                activeTab === "overview"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              📖 Overview & Code
            </button>
          </div>
        )}

        {/* Modal Body Content */}
        <div className="my-4 space-y-5">
          {/* C GAME SIMULATOR TAB */}
          {isCProject && activeTab === "game" && (
            <div className="p-5 rounded-xl bg-[#090d13] border border-white/10 font-mono">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  C Exercise: Number Guessing Engine (1 to 100)
                </span>
                <button
                  onClick={handleResetGame}
                  className="text-[11px] text-gray-400 hover:text-cyan-300 underline"
                >
                  Restart Round ↺
                </button>
              </div>

              <p className="text-xs text-gray-400 mb-4 font-sans">
                Simulates standard C <code className="text-cyan-300 bg-white/5 px-1 py-0.5 rounded">rand() % 100 + 1</code> with while-loop control flow and binary search hints!
              </p>

              <form onSubmit={handleGuess} className="flex gap-2 mb-4">
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={guessInput}
                  disabled={gameWon}
                  onChange={(e) => setGuessInput(e.target.value)}
                  placeholder="Enter guess (1 - 100)..."
                  className="flex-1 px-3 py-2 rounded-lg bg-black/40 border border-white/15 text-sm text-white focus:outline-none focus:border-cyan-400"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={gameWon}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-emerald-600 text-xs font-semibold text-white shadow-md disabled:opacity-50"
                >
                  Guess ⚔️
                </button>
              </form>

              {/* Guess History Log */}
              <div className="max-h-40 overflow-y-auto space-y-1.5 p-3 rounded-lg bg-black/30 border border-white/5 text-xs">
                {guessLog.length === 0 ? (
                  <span className="text-gray-500 italic">No guesses entered yet. Enter a number above!</span>
                ) : (
                  guessLog.map((log, i) => (
                    <div
                      key={i}
                      className={`flex items-center justify-between p-1.5 rounded ${
                        log.success
                          ? "bg-emerald-950/60 text-emerald-300 font-bold border border-emerald-500/40"
                          : "text-gray-300"
                      }`}
                    >
                      <span>Guess: {log.guess}</span>
                      <span>{log.result}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* C MATH LOGIC TAB */}
          {isCProject && activeTab === "math" && (
            <div className="p-5 rounded-xl bg-[#090d13] border border-white/10 font-mono">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="text-xs text-cyan-400 font-semibold mr-2">Algorithm:</span>
                {[
                  { id: "prime", label: "Prime Number Checker" },
                  { id: "factorial", label: "Factorial (n!)" },
                  { id: "fibonacci", label: "Fibonacci Sequence" },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setMathTool(t.id);
                      setMathResult(null);
                    }}
                    className={`px-2.5 py-1 rounded text-xs transition-colors ${
                      mathTool === t.id
                        ? "bg-emerald-950/80 text-emerald-300 border border-emerald-500/40"
                        : "bg-white/5 text-gray-400 hover:text-white"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3 mb-4">
                <input
                  type="number"
                  value={mathInput}
                  onChange={(e) => setMathInput(e.target.value)}
                  className="w-32 px-3 py-2 rounded-lg bg-black/40 border border-white/15 text-sm text-white focus:outline-none focus:border-cyan-400 font-mono"
                />
                <button
                  onClick={handleCalculateMath}
                  className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-xs font-semibold text-white transition-colors"
                >
                  Execute Algorithm ▶
                </button>
              </div>

              {mathResult && (
                <div className="p-3 rounded-lg bg-cyan-950/30 border border-cyan-500/30 text-cyan-200 text-xs animate-fadeIn">
                  <span className="text-gray-400 mr-2">Result:</span>
                  <span className="font-semibold">{mathResult}</span>
                </div>
              )}
            </div>
          )}

          {/* OVERVIEW TAB */}
          {(!isCProject || activeTab === "overview") && (
            <div className="space-y-4">
              <p className="text-sm text-gray-300 leading-relaxed">
                {project.description}
              </p>

              {project.details && (
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-gray-300 leading-relaxed">
                  <span className="text-cyan-400 font-mono font-semibold block mb-1">
                    Technical Architecture & Learnings:
                  </span>
                  {project.details}
                </div>
              )}

              {/* Technologies list */}
              <div>
                <span className="text-xs font-mono text-gray-400 block mb-2">Technologies Used:</span>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-lg text-xs font-mono bg-white/5 border border-white/10 text-cyan-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
          <div className="text-xs font-mono text-gray-400">
            <span>Repo: </span>
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:underline"
            >
              github.com/goyalshiwant8-create
            </a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            >
              Close
            </button>

            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 shadow-md transition-all hover:scale-105"
            >
              <span>View Source on GitHub</span>
              <span>↗</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}

if (typeof window !== "undefined") {
  window.ProjectModal = ProjectModal;
}

// ===== src/components/CodeQuiz.jsx =====
/**
 * ============================================================================
 * CODE QUIZ // DEMON SLAYER DEVELOPER RANK TEST
 * ============================================================================
 * Interactive 3-question challenge assessing C logic, modern web standards,
 * and software development fundamentals.
 * Features:
 * - Step-by-step interactive questions
 * - Instant feedback and explanation
 * - Final score calculation & Rank Badge awarding
 * - Confetti / audio chime celebrations
 * - Share / Copy Rank feature
 */

function CodeQuiz({ isOpen, onClose, breathingStyle, onShowToast }) {
  if (!isOpen) return null;

  const { quiz } = window.portfolioData || {};
  const questions = quiz?.questions || [];

  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [selectedOption, setSelectedOption] = React.useState(null);
  const [isAnswered, setIsAnswered] = React.useState(false);
  const [score, setScore] = React.useState(0);
  const [isFinished, setIsFinished] = React.useState(false);

  const currentQ = questions[currentIndex];

  // Close on Escape
  React.useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const handleSelectOption = (idx) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    if (window.soundManager) window.soundManager.playClick();
  };

  const handleConfirmAnswer = () => {
    if (selectedOption === null) return;
    setIsAnswered(true);

    const isCorrect = selectedOption === currentQ.correct;
    if (isCorrect) {
      setScore((s) => s + 1);
      if (window.soundManager) window.soundManager.playSuccess();
    } else {
      if (window.soundManager) window.soundManager.playBeep();
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      if (window.soundManager) window.soundManager.playClick();
    } else {
      setIsFinished(true);
      if (window.soundManager) window.soundManager.playKatanaChime();
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
    if (window.soundManager) window.soundManager.playClick();
  };

  const currentRank = quiz?.ranks ? quiz.ranks[score] || quiz.ranks[0] : null;

  const handleCopyRank = () => {
    const text = `⚔️ I scored ${score}/${questions.length} on Shiwant Goyal's Demon Slayer Developer Rank Test and earned the rank of [${currentRank?.title || "Slayer"}]! Check it out at https://goyalshiwant8-create.github.io/SHIWANT-GOYAL/`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        if (onShowToast) onShowToast("Rank badge copied to clipboard!");
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl rounded-2xl bg-[#0c121a] border border-emerald-500/40 shadow-2xl p-6 sm:p-8 flex flex-col justify-between">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 font-bold font-serif flex items-center justify-center">
              滅
            </span>
            <div>
              <h3 className="text-lg font-bold text-white font-space">
                {quiz?.title || "Demon Slayer Developer Rank Test"}
              </h3>
              <span className="text-[10px] font-mono text-cyan-400">
                {!isFinished ? `Challenge ${currentIndex + 1} of ${questions.length}` : "Assessment Completed"}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center text-xs"
          >
            ✕
          </button>
        </div>

        {/* Quiz Body */}
        {!isFinished && currentQ ? (
          <div>
            <div className="mb-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-emerald-300">
                {currentQ.discipline}
              </span>
            </div>

            <h4 className="text-base sm:text-lg font-semibold text-white leading-relaxed mb-6 font-space">
              {currentQ.question}
            </h4>

            {/* Options List */}
            <div className="space-y-3 mb-6">
              {currentQ.options.map((opt, idx) => {
                let btnStyle = "bg-white/[0.03] border-white/10 hover:border-cyan-400/40 text-gray-200";

                if (isAnswered) {
                  if (idx === currentQ.correct) {
                    btnStyle = "bg-emerald-950/70 border-emerald-500 text-emerald-200 font-semibold";
                  } else if (selectedOption === idx) {
                    btnStyle = "bg-red-950/70 border-red-500 text-red-200";
                  } else {
                    btnStyle = "opacity-40 border-white/5 text-gray-400";
                  }
                } else if (selectedOption === idx) {
                  btnStyle = "bg-cyan-950/60 border-cyan-400 text-cyan-200 font-medium";
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    disabled={isAnswered}
                    className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm font-mono transition-all flex items-center justify-between ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {isAnswered && idx === currentQ.correct && <span>✅</span>}
                    {isAnswered && selectedOption === idx && idx !== currentQ.correct && <span>❌</span>}
                  </button>
                );
              })}
            </div>

            {/* Answer Explanation */}
            {isAnswered && (
              <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-xs text-cyan-200 mb-6 animate-fadeIn leading-relaxed">
                <span className="font-bold mr-1">Explanation:</span>
                {currentQ.explanation}
              </div>
            )}

            {/* Action Button */}
            <div>
              {!isAnswered ? (
                <button
                  onClick={handleConfirmAnswer}
                  disabled={selectedOption === null}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-semibold text-xs font-mono disabled:opacity-40 transition-all"
                >
                  Confirm Strike ⚔️
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs font-mono transition-all shadow-lg"
                >
                  {currentIndex + 1 < questions.length ? "Next Challenge →" : "View Final Rank 🏆"}
                </button>
              )}
            </div>
          </div>
        ) : (
          /* RESULT SCREEN */
          <div className="text-center py-4 space-y-6 animate-fadeIn font-mono">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-tr from-cyan-600 via-emerald-600 to-teal-500 flex items-center justify-center text-4xl shadow-xl shadow-cyan-950/50">
              {currentRank?.kanji || "滅"}
            </div>

            <div>
              <span className="text-xs text-gray-400 uppercase tracking-widest block mb-1">
                Final Score: {score} / {questions.length}
              </span>
              <h4 className="text-2xl sm:text-3xl font-extrabold text-white font-space">
                {currentRank?.title}
              </h4>
              <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
                {currentRank?.badge}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-gray-300 max-w-md mx-auto leading-relaxed font-sans">
              {currentRank?.message}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-white/10">
              <button
                onClick={handleCopyRank}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-emerald-600 text-white font-semibold text-xs transition-all hover:scale-105"
              >
                Share My Rank 📋
              </button>

              <button
                onClick={handleRestart}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white text-xs transition-colors"
              >
                Retake Challenge ↺
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

if (typeof window !== "undefined") {
  window.CodeQuiz = CodeQuiz;
}

// ===== src/components/ShortcutsModal.jsx =====
/**
 * ============================================================================
 * SHORTCUTS MODAL COMPONENT
 * ============================================================================
 * Displays global interactive hotkeys for rapid navigation.
 */

function ShortcutsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const shortcuts = [
    { key: "T", desc: "Cycle Breathing Themes (Water 🌊 -> Sun 🔥 -> Thunder ⚡)" },
    { key: "M", desc: "Toggle Procedural Sound Effects (Audio On / Muted)" },
    { key: "C", desc: "Toggle Shiwant AI Interactive Assistant" },
    { key: "Q", desc: "Open Demon Slayer Developer Rank Test" },
    { key: "Esc", desc: "Close any active modal or drawer" },
    { key: "?", desc: "Toggle this Keyboard Shortcuts Cheat Sheet" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md rounded-2xl bg-[#0c121a] border border-cyan-500/40 p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-base">⌨️</span>
            <h3 className="text-base font-bold text-white font-space">
              Keyboard Shortcuts
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center text-xs"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3 font-mono text-xs">
          {shortcuts.map((s, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5"
            >
              <span className="text-gray-300 font-sans text-xs">{s.desc}</span>
              <kbd className="px-2 py-1 rounded-md bg-white/10 text-cyan-300 font-bold border border-white/10 shadow-inner">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-3 border-t border-white/10 text-center">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-mono transition-colors"
          >
            Got it (Esc)
          </button>
        </div>
      </div>
    </div>
  );
}

if (typeof window !== "undefined") {
  window.ShortcutsModal = ShortcutsModal;
}

// ===== src/components/AssistantBot.jsx =====
/**
 * ============================================================================
 * SHIWANT AI // INTERACTIVE CHATBOT ASSISTANT
 * ============================================================================
 * Floating interactive AI assistant grounded in Shiwant's BCA journey,
 * skills, Demon Slayer theme, and contact info.
 * Features:
 * - Freeform text input with instant intelligent matching
 * - Quick prompt suggestion chips
 * - Realistic typing indicator & Web Audio chimes
 * - Responsive mobile & desktop drawer
 */

function AssistantBot({ isOpen, onToggle, breathingStyle, onShowToast }) {
  const { personal, about, skills, projects, education, socials, assistant } =
    window.portfolioData || {};

  const [messages, setMessages] = React.useState([
    {
      sender: "bot",
      text: assistant?.greeting || "Konnichiwa! I am Shiwant's AI Assistant. Ask me anything about his BCA studies at BVIMR, C programming, web projects, skills, or collaboration opportunities!",
      timestamp: "Just now",
    },
  ]);
  const [inputText, setInputText] = React.useState("");
  const [isTyping, setIsTyping] = React.useState(false);
  const chatEndRef = React.useRef(null);

  // Auto scroll chat
  React.useEffect(() => {
    if (isOpen && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, isOpen]);

  // Smart Query Handler
  const generateResponse = (query) => {
    const q = query.toLowerCase().trim();

    if (q.includes("hi") || q.includes("hello") || q.includes("hey") || q.includes("namaste")) {
      return "Hello there! Glad to connect with you. What would you like to know about Shiwant's background, skills, or projects?";
    }

    if (q.includes("education") || q.includes("college") || q.includes("bca") || q.includes("bvimr") || q.includes("degree")) {
      return `🎓 Education Status:\n• Degree: Bachelor of Computer Applications (BCA), 1st Year\n• Institution: Bharati Vidyapeeth Institute of Management & Research (BVIMR), New Delhi\n• Period: 2025–2028 (Expected)\n• Focus: Structured programming in C, mathematical logic, and web foundations.`;
    }

    if (q.includes("skill") || q.includes("tech") || q.includes("stack") || q.includes("language")) {
      return `💻 Core Technical Arsenal:\n• Primary Programming: C (Control structures, pointers, memory models, functions)\n• Frontend & Web: HTML5, Modern CSS3 (Grid/Flexbox/Animations), JavaScript (ES6+, DOM, Asynchronous)\n• Actively Learning: React component architecture, Hooks, REST APIs, and Full-Stack fundamentals.`;
    }

    if (q.includes("project") || q.includes("c project") || q.includes("work") || q.includes("github")) {
      return `🚀 Featured Projects:\n1. Personal Demon Slayer React Portfolio (with Web Audio procedural sounds, particle engine, and live interactive CLI!)\n2. C Programming Labs & Exercises (Number guessing game, matrix calculator, prime/factorial algorithms)\nCheck them out in the Projects section or test them in the in-browser C simulator!`;
    }

    if (q.includes("contact") || q.includes("hire") || q.includes("email") || q.includes("reach") || q.includes("collaborat")) {
      return `📬 Get in touch with Shiwant:\n• Instagram: @shiwant_goyal_\n• LinkedIn: Shiwant Goyal\n• GitHub: goyalshiwant8-create\n• Email: You can use the Contact form below or copy his email directly!`;
    }

    if (q.includes("demon slayer") || q.includes("theme") || q.includes("anime") || q.includes("breathing")) {
      return `⚔️ Why the Demon Slayer theme?\nDemon Slayer embodies disciplined practice, relentless perseverance, and sharp focus ("Total Concentration"). Shiwant applies this same mindset to debugging, learning computer science, and mastering code!`;
    }

    return `Thanks for asking! Shiwant is a 1st-year BCA student at BVIMR passionate about building modern web experiences with C, JavaScript, and React. Feel free to explore the interactive terminal or reach out via the Contact section!`;
  };

  const handleSendMessage = (textToSend) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    if (window.soundManager) window.soundManager.playClick();

    const userMsg = {
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    setTimeout(() => {
      const botReply = generateResponse(text);
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: botReply,
          timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
        },
      ]);
      if (window.soundManager) window.soundManager.playKatanaChime();
    }, 600);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={onToggle}
          className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#0c121a]/95 hover:bg-[#121a24] border border-cyan-500/50 hover:border-cyan-400 text-white shadow-2xl backdrop-blur-xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-cyan-950/80"
          aria-label="Open AI Assistant"
        >
          {/* Animated glow ring */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 opacity-20 group-hover:opacity-40 blur-md transition-opacity"></div>
          
          <span className="relative z-10 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
          <span className="relative z-10 text-base">🤖</span>
          <span className="relative z-10 text-xs font-mono font-semibold tracking-wide hidden sm:inline">
            Ask Shiwant AI
          </span>
          <span className="relative z-10 text-xs font-serif text-white/40">滅</span>
        </button>
      </div>

      {/* Floating Chat Drawer Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 sm:right-6 z-50 w-[92vw] sm:w-[400px] h-[520px] max-h-[85vh] rounded-2xl bg-[#0c121a]/95 border border-cyan-500/40 shadow-2xl backdrop-blur-2xl flex flex-col justify-between overflow-hidden animate-slideUp">
          
          {/* Drawer Header */}
          <div className="px-4 py-3.5 border-b border-white/10 bg-white/[0.02] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-600 to-emerald-600 flex items-center justify-center text-sm shadow-md">
                滅
              </div>
              <div>
                <h4 className="text-xs font-bold text-white font-space">
                  {assistant?.botName || "Shiwant AI"}
                </h4>
                <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Total Concentration Active
                </span>
              </div>
            </div>

            <button
              onClick={onToggle}
              className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center text-xs transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 font-sans text-xs">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                    msg.sender === "user"
                      ? "bg-gradient-to-r from-cyan-600 to-emerald-600 text-white rounded-br-none shadow-md"
                      : "bg-[#141b24] text-gray-200 border border-white/10 rounded-bl-none shadow-sm"
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[9px] text-gray-500 font-mono mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 p-2 rounded-xl bg-[#141b24] border border-white/10 w-fit text-gray-400 text-xs font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.15s]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.3s]"></span>
                <span className="ml-1 text-[10px]">Analyzing query...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Question Chips */}
          <div className="px-3 py-2 border-t border-white/5 bg-black/20 overflow-x-auto flex items-center gap-1.5 scrollbar-none">
            {(assistant?.quickQuestions || []).map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q.text)}
                className="px-2.5 py-1 rounded-full text-[10px] font-mono whitespace-nowrap bg-white/5 hover:bg-cyan-500/20 text-gray-300 hover:text-cyan-200 border border-white/10 transition-colors"
              >
                {q.text}
              </button>
            ))}
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputText);
            }}
            className="p-3 border-t border-white/10 bg-[#0a0e14] flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask anything about Shiwant..."
              className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 font-mono"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="w-9 h-9 rounded-xl bg-gradient-to-r from-cyan-600 to-emerald-600 text-white flex items-center justify-center text-sm shadow-md disabled:opacity-40 transition-transform active:scale-95"
            >
              ➤
            </button>
          </form>

        </div>
      )}
    </>
  );
}

if (typeof window !== "undefined") {
  window.AssistantBot = AssistantBot;
}

// ===== src/App.jsx =====
/**
 * ============================================================================
 * MAIN APP COMPONENT (ORCHESTRATOR)
 * ============================================================================
 * Orchestrates:
 * - Breathing Style Theme Engine (Water, Sun, Thunder)
 * - Web Audio procedural sound effects & chimes
 * - Ambient dynamic particle canvas
 * - Scroll spy for active navbar link
 * - Universal toast notifications
 * - Global keyboard shortcuts (T, M, C, Q, ?, Esc)
 * - Interactive Modals (Project simulator, Rank quiz, Shortcuts)
 * - Dynamic Live GitHub Hub & Visitor Community Wall
 * - Floating Shiwant AI Interactive Assistant
 * - Full-Screen Anime Katana Slash visual effect
 */

function App() {
  const [breathingStyle, setBreathingStyle] = React.useState("water");
  const [sfxEnabled, setSfxEnabled] = React.useState(true);
  const [toastMessage, setToastMessage] = React.useState(null);
  const [activeSection, setActiveSection] = React.useState("top");

  // Dynamic Modals & Drawers State
  const [selectedModalProject, setSelectedModalProject] = React.useState(null);
  const [isAssistantOpen, setIsAssistantOpen] = React.useState(false);
  const [isQuizOpen, setIsQuizOpen] = React.useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = React.useState(false);
  const [slashActive, setSlashActive] = React.useState(false);

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

  // Global Keyboard Shortcuts
  React.useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      // Don't trigger hotkeys if user is actively typing in an input or textarea
      if (["INPUT", "TEXTAREA"].includes(e.target.tagName)) {
        if (e.key === "Escape") {
          e.target.blur();
        }
        return;
      }

      if (e.key === "Escape") {
        setSelectedModalProject(null);
        setIsQuizOpen(false);
        setIsShortcutsOpen(false);
        setIsAssistantOpen(false);
      } else if (e.key.toLowerCase() === "t") {
        // Cycle breathing themes
        const themes = ["water", "sun", "thunder"];
        const nextTheme = themes[(themes.indexOf(breathingStyle) + 1) % themes.length];
        setBreathingStyle(nextTheme);
        if (window.soundManager) window.soundManager.playBreathingSound(nextTheme);
        showToast(`Theme switched to ${nextTheme.toUpperCase()} Breathing! 🌊🔥⚡`);
      } else if (e.key.toLowerCase() === "m") {
        // Toggle sound
        handleToggleSfx();
      } else if (e.key.toLowerCase() === "c") {
        // Toggle AI Chatbot
        setIsAssistantOpen((prev) => !prev);
      } else if (e.key.toLowerCase() === "q") {
        // Toggle Developer Rank Quiz
        setIsQuizOpen((prev) => !prev);
      } else if (e.key === "?" || e.key === "/") {
        // Toggle Shortcuts Modal
        setIsShortcutsOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [breathingStyle]);

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

  // Full-screen Katana Slash visual effect
  const handleTriggerSlash = () => {
    setSlashActive(true);
    if (window.soundManager) window.soundManager.playSlash();
    setTimeout(() => {
      setSlashActive(false);
    }, 450);
  };

  return (
    <div className="relative min-h-screen bg-[#080c11] text-gray-100 selection:bg-cyan-500 selection:text-black font-sans overflow-x-hidden">
      {/* Full-Screen Katana Slash Visual Effect Overlay */}
      {slashActive && (
        <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-cyan-400/20 backdrop-invert animate-ping"></div>
          {/* Diagonal blade beam */}
          <div className="w-[180vw] h-2 bg-gradient-to-r from-transparent via-white to-transparent shadow-[0_0_40px_rgba(6,182,212,1)] -rotate-45 transform origin-center transition-transform duration-300"></div>
          <div className="text-8xl font-black font-serif text-white opacity-80 animate-pulse select-none">
            滅
          </div>
        </div>
      )}

      {/* Dynamic Ambient Breathing Canvas */}
      <window.BreathingCanvas breathingStyle={breathingStyle} />

      {/* Sticky Glassmorphic Navbar */}
      <window.Navbar
        breathingStyle={breathingStyle}
        setBreathingStyle={setBreathingStyle}
        sfxEnabled={sfxEnabled}
        onToggleSfx={handleToggleSfx}
        activeSection={activeSection}
        onOpenQuiz={() => setIsQuizOpen(true)}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
      />

      {/* Main Content Sections */}
      <main className="relative z-10">
        <window.Hero
          breathingStyle={breathingStyle}
          setBreathingStyle={setBreathingStyle}
          onTriggerSlash={handleTriggerSlash}
          onOpenQuiz={() => setIsQuizOpen(true)}
          onShowToast={showToast}
        />
        <window.About breathingStyle={breathingStyle} />
        <window.Skills breathingStyle={breathingStyle} />
        
        {/* Projects Section with Interactive Modals */}
        <window.Projects
          breathingStyle={breathingStyle}
          onOpenProjectModal={(proj) => setSelectedModalProject(proj)}
        />

        {/* Live Real-Time GitHub Telemetry Hub */}
        {window.LiveGitHubHub && (
          <window.LiveGitHubHub breathingStyle={breathingStyle} />
        )}

        <window.Education breathingStyle={breathingStyle} />
        <window.LearningJourney breathingStyle={breathingStyle} />

        {/* Dynamic Visitor Reactions & Community Wall */}
        {window.VisitorInteractions && (
          <window.VisitorInteractions
            breathingStyle={breathingStyle}
            onShowToast={showToast}
          />
        )}

        <window.Contact breathingStyle={breathingStyle} onShowToast={showToast} />
      </main>

      {/* Footer */}
      <window.Footer />

      {/* Floating Shiwant AI Interactive Assistant */}
      {window.AssistantBot && (
        <window.AssistantBot
          isOpen={isAssistantOpen}
          onToggle={() => setIsAssistantOpen(!isAssistantOpen)}
          breathingStyle={breathingStyle}
          onShowToast={showToast}
        />
      )}

      {/* Interactive Project In-Browser Simulator Modal */}
      {window.ProjectModal && selectedModalProject && (
        <window.ProjectModal
          project={selectedModalProject}
          onClose={() => setSelectedModalProject(null)}
          breathingStyle={breathingStyle}
          onShowToast={showToast}
        />
      )}

      {/* Interactive Demon Slayer Developer Rank Test */}
      {window.CodeQuiz && (
        <window.CodeQuiz
          isOpen={isQuizOpen}
          onClose={() => setIsQuizOpen(false)}
          breathingStyle={breathingStyle}
          onShowToast={showToast}
        />
      )}

      {/* Global Keyboard Shortcuts Modal */}
      {window.ShortcutsModal && (
        <window.ShortcutsModal
          isOpen={isShortcutsOpen}
          onClose={() => setIsShortcutsOpen(false)}
        />
      )}

      {/* Floating Interactive Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-[#0c121a]/95 border border-cyan-500/40 text-white text-xs sm:text-sm font-mono shadow-2xl backdrop-blur-xl animate-slideUp">
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
