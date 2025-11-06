import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import heroImage from "@/assets/hero-tattoo.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Hero Image Section */}
      <div className="relative h-[75vh] md:h-[80vh] w-full">
        {/* Background Image */}
        <img 
          src={heroImage} 
          alt="Fatt Matt Tattoo Artistry" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        {/* Dark Gradient Overlay - stronger at bottom for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/50 to-background pointer-events-none" />
        
        {/* Title Overlapping at Bottom */}
        <div className="absolute bottom-0 left-0 right-0 z-10 pb-8 md:pb-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-orbitron font-bold mb-4 text-glow">
              FATT MATT
            </h1>
            <p className="text-xl md:text-2xl text-foreground/90 mb-2 font-inter">
              Tattoo Artist • 24 Years of Precision Artistry
            </p>
            <p className="text-lg md:text-xl text-secondary font-inter">
              Montgomery IL • Portage IN
            </p>
          </div>
        </div>
      </div>
      
      {/* Action Buttons Section */}
      <div className="relative flex-1 flex flex-col items-center justify-center py-12 md:py-16 animate-fade-in-up">
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
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
        
        <div className="animate-bounce">
          <ArrowDown className="w-8 h-8 text-primary" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
