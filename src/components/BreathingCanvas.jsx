/**
 * ============================================================================
 * BREATHING CANVAS COMPONENT
 * ============================================================================
 * High-performance ambient particle canvas reacting to the current Breathing Style.
 * - Water Breathing: Gentle aquatic bubbles & cyan water flow ripples
 * - Sun Breathing: Rising orange/gold Hinokami embers & heat sparks
 * - Thunder Breathing: Fast electric sparks & micro lightning streaks
 */

function BreathingCanvas({ breathingStyle }) {
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Responsive particle count
    const isMobile = width < 768;
    const particleCount = isMobile ? 32 : 65;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // Particle generator based on style
    class Particle {
      constructor(style) {
        this.reset(style);
      }

      reset(style) {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 3 + 1;
        this.alpha = Math.random() * 0.5 + 0.2;
        this.life = 0;
        this.maxLife = Math.random() * 200 + 100;

        if (style === "water") {
          // Slow floating, swaying slightly
          this.vx = (Math.random() - 0.5) * 0.6;
          this.vy = -(Math.random() * 0.8 + 0.2); // drifts upward gently
          this.color = Math.random() > 0.4 ? "6, 182, 212" : "16, 185, 129"; // cyan or emerald
        } else if (style === "sun") {
          // Floating fire embers rising and wavering
          this.vx = (Math.random() - 0.5) * 1.2;
          this.vy = -(Math.random() * 1.5 + 0.6); // faster rise
          this.color = Math.random() > 0.5 ? "249, 115, 22" : "239, 68, 68"; // orange or crimson
          this.size = Math.random() * 3.5 + 1.2;
        } else if (style === "thunder") {
          // Rapid jittery electric sparks
          this.vx = (Math.random() - 0.5) * 2.2;
          this.vy = (Math.random() - 0.5) * 2.2;
          this.color = Math.random() > 0.3 ? "234, 179, 8" : "168, 85, 247"; // gold or purple
          this.size = Math.random() * 2.5 + 0.8;
        } else {
          this.vx = (Math.random() - 0.5) * 0.5;
          this.vy = (Math.random() - 0.5) * 0.5;
          this.color = "148, 163, 184";
        }
      }

      update(style) {
        this.x += this.vx;
        this.y += this.vy;
        this.life++;

        // Add subtle wavering
        if (style === "water") {
          this.vx += Math.sin(this.life * 0.03) * 0.02;
        } else if (style === "sun") {
          this.vx += Math.sin(this.life * 0.05) * 0.05;
          this.size = Math.max(0.5, this.size - 0.005);
        } else if (style === "thunder") {
          if (Math.random() > 0.94) {
            this.vx = (Math.random() - 0.5) * 4;
            this.vy = (Math.random() - 0.5) * 4;
          }
        }

        // Wrap around bounds
        if (this.y < 0 || this.y > height || this.x < 0 || this.x > width || this.life >= this.maxLife) {
          this.reset(style);
          if (style === "water" || style === "sun") {
            this.y = height + 10;
          }
        }
      }

      draw(ctx) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
        ctx.shadowBlur = this.size * 3;
        ctx.shadowColor = `rgba(${this.color}, 0.8)`;
        ctx.fill();
        ctx.restore();
      }
    }

    const particles = Array.from({ length: particleCount }, () => new Particle(breathingStyle));

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.update(breathingStyle);
        p.draw(ctx);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [breathingStyle]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-60 transition-opacity duration-1000"
      aria-hidden="true"
    />
  );
}

if (typeof window !== "undefined") {
  window.BreathingCanvas = BreathingCanvas;
}
