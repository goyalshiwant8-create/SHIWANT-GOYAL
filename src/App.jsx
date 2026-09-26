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
