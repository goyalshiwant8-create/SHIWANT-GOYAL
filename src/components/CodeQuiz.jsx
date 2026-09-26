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
