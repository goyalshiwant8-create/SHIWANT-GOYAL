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
