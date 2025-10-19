import { Button } from "@/components/ui/button";

const About = () => {
  return (
    <section className="py-20 px-4 relative">
      <div className="container mx-auto max-w-4xl">
        <div className="card-glow rounded-xl p-8 md:p-12 relative overflow-hidden animate-fade-in-up">
          {/* Subtle glow effect */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl animate-pulse-glow" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-secondary/20 rounded-full blur-3xl animate-pulse-glow" />
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-orbitron font-bold mb-6 text-center">
              About Fatt Matt
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed text-center mb-8">
              I'm Fatt Matt — a tattooer obsessed with detail, flow, and healing. 
              My approach fuses decades of technique with modern tools and aftercare science. 
              Every piece is crafted with precision, passion, and a commitment to excellence 
              that comes from 24 years in the industry.
            </p>
            <div className="flex justify-center">
              <Button 
                variant="cyan-outline"
                size="lg"
                onClick={() => document.getElementById('aftercare')?.scrollIntoView({ behavior: 'smooth' })}
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
