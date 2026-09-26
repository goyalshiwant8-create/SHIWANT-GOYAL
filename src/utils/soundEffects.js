/**
 * ============================================================================
 * DEMON SLAYER WEB AUDIO SYNTHESIZER
 * ============================================================================
 * Pure client-side procedural sound effects using the Web Audio API.
 * Zero external audio assets required. Safe, lightweight, and toggleable.
 */

class SoundSynthesizer {
  constructor() {
    this.audioCtx = null;
    this.enabled = true;

    // Check localStorage preference
    try {
      const saved = localStorage.getItem("shiwant_sfx_enabled");
      if (saved !== null) {
        this.enabled = JSON.parse(saved);
      }
    } catch (e) {
      // Local storage fallback
    }
  }

  init() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === "suspended") {
      this.audioCtx.resume();
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    try {
      localStorage.setItem("shiwant_sfx_enabled", JSON.stringify(this.enabled));
    } catch (e) {}
    if (this.enabled) {
      this.playKatanaChime();
    }
    return this.enabled;
  }

  isEnabled() {
    return this.enabled;
  }

  // Subtle metallic katana unsheathe chime
  playKatanaChime() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.audioCtx) return;
      const ctx = this.audioCtx;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1760, now + 0.15);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch (e) {}
  }

  // Subtle clean water droplet sound
  playWaterDrop() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.audioCtx) return;
      const ctx = this.audioCtx;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(900, now);
      osc.frequency.exponentialRampToValueAtTime(450, now + 0.1);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch (e) {}
  }

  // Subtle flame crackle / whoosh
  playFlameFlare() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.audioCtx) return;
      const ctx = this.audioCtx;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(540, now + 0.08);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.18);
    } catch (e) {}
  }

  // Subtle electric strike tick
  playThunderStrike() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.audioCtx) return;
      const ctx = this.audioCtx;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.08);

      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch (e) {}
  }

  // Minimal UI click
  playClick() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.audioCtx) return;
      const ctx = this.audioCtx;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(600, now);
      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch (e) {}
  }

  // Play sound specific to breathing style
  playBreathingSound(style) {
    if (style === "water") this.playWaterDrop();
    else if (style === "sun") this.playFlameFlare();
    else if (style === "thunder") this.playThunderStrike();
    else this.playKatanaChime();
  }
}

const soundManager = new SoundSynthesizer();

if (typeof module !== "undefined" && module.exports) {
  module.exports = soundManager;
}
if (typeof window !== "undefined") {
  window.soundManager = soundManager;
}
