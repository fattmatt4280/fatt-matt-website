import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import portfolio4 from "@/assets/portfolio-4.jpg";
import Footer from "@/components/Footer";

const CoverUpsPortfolio = () => {
  const images = [
    { src: portfolio4, title: "Floral Cover-Up", description: "Transforming old ink into beauty" },
    { src: portfolio4, title: "Geometric Cover-Up", description: "Strategic design placement" },
    { src: portfolio4, title: "Blackout Cover-Up", description: "Bold solutions for old tattoos" },
    { src: portfolio4, title: "Color Correction", description: "Refreshing faded work" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="py-8 px-4 border-b border-primary/20">
        <div className="container mx-auto">
          <Link to="/#portfolio">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Portfolio
            </Button>
          </Link>
        </div>
      </header>

      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-4xl md:text-5xl font-orbitron font-bold text-center mb-6 text-glow">
            Cover-Ups Portfolio
          </h1>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Expert cover-up work transforming unwanted tattoos into beautiful new art with creative solutions.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {images.map((image, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-xl card-glow transition-all duration-500 hover:scale-105"
              >
                <img
                  src={image.src}
                  alt={image.title}
                  className="w-full h-96 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-90" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-2xl font-orbitron font-semibold mb-2 text-glow">
                    {image.title}
                  </h3>
                  <p className="text-muted-foreground">{image.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CoverUpsPortfolio;
