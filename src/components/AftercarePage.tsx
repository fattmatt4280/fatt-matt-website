import { Button } from "@/components/ui/button";
import productImage from "@/assets/blue-dream-budder.jpg";

const AftercarePage = () => {
  return (
    <section id="aftercare" className="py-20 px-4 bg-gradient-to-b from-card to-background">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-orbitron font-bold mb-6">
              Blue Dream Budder
            </h2>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              Vegan, dermatologist-grade tattoo aftercare created by Fatt Matt 
              for artists and collectors. Formulated with healing botanicals and 
              premium ingredients to ensure your tattoo heals beautifully and maintains 
              its vibrancy for years to come.
            </p>
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-secondary rounded-full mt-2" />
                <p className="text-muted-foreground">100% vegan and cruelty-free formula</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-secondary rounded-full mt-2" />
                <p className="text-muted-foreground">Dermatologist-tested for sensitive skin</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-secondary rounded-full mt-2" />
                <p className="text-muted-foreground">Accelerates healing and reduces inflammation</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-secondary rounded-full mt-2" />
                <p className="text-muted-foreground">Keeps colors vibrant and prevents fading</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Button 
                variant="neon" 
                size="lg"
                onClick={() => window.open('https://bluedreambudder.com', '_blank')}
              >
                Shop Now
              </Button>
              <Button variant="cyan-outline" size="lg">
                Learn More
              </Button>
            </div>
          </div>
          
          <div className="order-1 md:order-2 flex justify-center animate-fade-in-up">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full blur-3xl opacity-30 animate-pulse-glow" />
              <img
                src={productImage}
                alt="Blue Dream Budder Product"
                className="relative rounded-xl w-full max-w-md animate-float"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AftercarePage;
