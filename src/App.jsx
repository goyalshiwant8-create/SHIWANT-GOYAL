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
