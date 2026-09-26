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
