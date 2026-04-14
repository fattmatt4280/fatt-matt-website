import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import type { RefObject } from "react";

const stats = [
  { value: "24", suffix: "yrs", label: "In the Industry" },
  { value: "3",  suffix: "",    label: "Active Locations" },
  { value: "10k", suffix: "+",  label: "Pieces Completed" },
];

const About = () => {
  const sectionRef = useScrollReveal();
  const statsRef   = useScrollReveal(0.2);

  return (
    <section id="about" className="py-24 px-4 relative overflow-hidden">
      {/* Background orbs */}
      <div className="orb w-[500px] h-[500px] bg-white/3 -top-40 -right-60 animate-orb-drift" style={{ animationDelay: "-5s" }} />
      <div className="orb w-80 h-80 bg-white/2 bottom-0 -left-40 animate-orb-drift" style={{ animationDelay: "-12s" }} />

      <div className="container mx-auto max-w-4xl">
        {/* Main card */}
        <div
          ref={sectionRef as RefObject<HTMLDivElement>}
          className="reveal glass-card-glow rounded-2xl p-8 md:p-12 relative"
        >
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-orbitron font-bold mb-6 text-center chrome-text">
              About Fatt Matt
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed text-center mb-10 max-w-2xl mx-auto">
              I'm Fatt Matt — a tattooer obsessed with detail, flow, and healing.
              My approach fuses decades of technique with modern tools and aftercare science.
              Every piece is crafted with precision, passion, and a commitment to excellence
              that comes from 24 years in the industry.
            </p>

            {/* Stats */}
            <div
              ref={statsRef as RefObject<HTMLDivElement>}
              className="reveal grid grid-cols-3 gap-4 mb-10"
            >
              {stats.map((stat, i) => (
                <div
                  key={stat.label}
                  className="glass-card rounded-xl p-4 md:p-6 text-center delay-[${i * 100}ms]"
                  style={{ transitionDelay: `${i * 0.1 + 0.2}s` }}
                >
                  <div className="text-3xl md:text-4xl font-orbitron font-bold chrome-text">
                    {stat.value}
                    <span className="text-xl">{stat.suffix}</span>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="flex justify-center">
              <Button
                variant="cyan-outline"
                size="lg"
                onClick={() => document.getElementById("aftercare")?.scrollIntoView({ behavior: "smooth" })}
              >
                Learn About Blue Dream Budder
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
