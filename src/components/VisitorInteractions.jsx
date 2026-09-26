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
