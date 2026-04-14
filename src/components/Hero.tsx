import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import heroImage from "@/assets/hero-tattoo.jpg";

// Ink particle canvas
function InkParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    type Particle = {
      x: number; y: number;
      vx: number; vy: number;
      r: number; alpha: number;
      decay: number;
      color: string;
    };

    const colors = [
      "255,60,30",
      "255,120,40",
      "220,40,20",
      "255,160,60",
      "200,200,200",
    ];

    const particles: Particle[] = [];

    const spawn = () => {
      particles.push({
        x: Math.random() * canvas.width,
        y: canvas.height + 10,
        vx: (Math.random() - 0.5) * 0.6,
        vy: -(Math.random() * 1.2 + 0.4),
        r: Math.random() * 3 + 1,
        alpha: Math.random() * 0.5 + 0.2,
        decay: Math.random() * 0.003 + 0.002,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    };

    let frame = 0;
    let animId: number;

    const tick = () => {
      animId = requestAnimationFrame(tick);
      frame++;
      if (frame % 3 === 0) spawn();

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0 || p.y < -10) {
          particles.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
        ctx.fill();

        // soft glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.alpha * 0.12})`;
        ctx.fill();
      }
    };

    tick();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
    />
  );
}

// Staggered letter reveal
function AnimatedTitle({ text }: { text: string }) {
  return (
    <h1 className="text-6xl md:text-8xl lg:text-9xl font-orbitron font-bold mb-4 overflow-hidden">
      {text.split("").map((char, i) => (
        <span
          key={i}
          className="inline-block animate-[letter-reveal_0.6s_cubic-bezier(0.16,1,0.3,1)_both]"
          style={{
            animationDelay: `${i * 0.06}s`,
            background: "linear-gradient(135deg, hsl(0,0%,55%) 0%, hsl(0,0%,96%) 35%, hsl(35,60%,80%) 55%, hsl(0,0%,82%) 75%, hsl(0,0%,50%) 100%)",
            backgroundSize: "200% auto",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            textShadow: "none",
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </h1>
  );
}

const Hero = () => {
  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Hero Image */}
      <div className="relative h-[75vh] md:h-[80vh] w-full">
        <img
          src={heroImage}
          alt="Fatt Matt Tattoo Artistry"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/40 to-background pointer-events-none z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/30 via-transparent to-background/30 pointer-events-none z-[1]" />

        {/* Ink particles */}
        <InkParticles />

        {/* Floating orbs */}
        <div className="orb w-96 h-96 bg-red-600/20 top-20 -left-32 animate-orb-drift" style={{ animationDelay: "0s" }} />
        <div className="orb w-64 h-64 bg-orange-500/15 bottom-40 right-10 animate-orb-drift" style={{ animationDelay: "-7s" }} />

        {/* Title */}
        <div className="absolute bottom-0 left-0 right-0 z-20 pb-8 md:pb-12">
          <div className="container mx-auto px-4 text-center">
            <AnimatedTitle text="FATT MATT" />

            <p
              className="text-xl md:text-2xl text-foreground/80 mb-2 font-inter animate-[fade-in-up_0.6s_ease-out_0.8s_both]"
            >
              Tattoo Artist &nbsp;•&nbsp; 24 Years of Precision Artistry
            </p>
            <p
              className="text-lg md:text-xl font-inter animate-[fade-in-up_0.6s_ease-out_1s_both]"
              style={{
                background: "linear-gradient(135deg, hsl(0 85% 55%), hsl(35 100% 58%))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Montgomery IL &nbsp;•&nbsp; Portage IN
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="relative flex-1 flex flex-col items-center justify-center py-12 md:py-16">
        {/* Glass pill stats */}
        <div
          className="flex gap-6 mb-10 flex-wrap justify-center animate-[fade-in-up_0.6s_ease-out_1.2s_both]"
        >
          {[
            { value: "24", label: "Years" },
            { value: "3", label: "Locations" },
            { value: "∞", label: "Custom Pieces" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="glass-card rounded-full px-6 py-2 text-center min-w-[90px]"
            >
              <div className="text-xl font-orbitron font-bold neon-text">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        <div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8 animate-[fade-in-up_0.6s_ease-out_1.4s_both]"
        >
          <Button
            variant="neon"
            size="lg"
            onClick={() => document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" })}
          >
            Book / Leave Deposit
          </Button>
          <Button
            variant="neon-outline"
            size="lg"
            onClick={() => document.getElementById("portfolio")?.scrollIntoView({ behavior: "smooth" })}
          >
            View Work
          </Button>
        </div>

        <div className="animate-bounce">
          <ArrowDown className="w-8 h-8 text-primary" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
