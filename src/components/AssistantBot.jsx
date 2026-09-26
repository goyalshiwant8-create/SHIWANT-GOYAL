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
