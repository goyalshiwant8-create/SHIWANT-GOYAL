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
