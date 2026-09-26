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
