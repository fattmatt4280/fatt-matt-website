import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import Spline from "@splinetool/react-spline";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Spline 3D Background */}
      <div className="absolute inset-0 w-full h-full">
        <Spline
          scene="https://prod.spline.design/neonorbexample-0235a0e3-3d0d-4dbf-9749-8844892ffa15/scene.splinecode"
          className="w-full h-full"
        />
      </div>
      
      {/* Gradient Overlay - allows pointer events to pass through */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/30 to-background/80 pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center animate-fade-in-up">
        <h1 className="text-6xl md:text-8xl font-orbitron font-bold mb-4 text-glow">
          FATT MATT
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-2 font-inter">
          Tattoo Artist • 24 Years of Precision Artistry
        </p>
        <p className="text-lg md:text-xl text-secondary font-inter mb-12">
          Montgomery IL • Portage IN
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            variant="neon" 
            size="lg"
            onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Book / Leave Deposit
          </Button>
          <Button 
            variant="neon-outline" 
            size="lg"
            onClick={() => document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })}
          >
            View Work
          </Button>
        </div>
        
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ArrowDown className="w-8 h-8 text-primary" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
