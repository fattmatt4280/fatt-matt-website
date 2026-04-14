import { Link } from "react-router-dom";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import portfolio1 from "@/assets/portfolio-1.jpg";
import colorworkImage from "@/assets/colorwork-portfolio.jpg";
import portfolio3 from "@/assets/portfolio-3.jpg";
import portfolio4 from "@/assets/portfolio-4.jpg";

const portfolioItems = [
  { title: "Black & Grey",  image: portfolio1,     description: "Timeless realism in grayscale",   link: "/portfolio/black-grey" },
  { title: "Colorwork",     image: colorworkImage, description: "Vibrant and bold color tattoos",   link: "/portfolio/colorwork" },
  { title: "Portraits",     image: portfolio3,     description: "Realistic portrait work",          link: "/portfolio/portraits" },
  { title: "Cover-Ups",     image: portfolio4,     description: "Transforming old tattoos",         link: "/portfolio/cover-ups" },
];

const Portfolio = () => {
  const headingRef = useScrollReveal();
  const gridRef    = useScrollReveal(0.1);

  return (
    <section id="portfolio" className="py-24 px-4 relative overflow-hidden">
      {/* Background orbs */}
      <div className="orb w-[600px] h-[600px] bg-red-900/8 top-0 left-1/2 -translate-x-1/2 animate-orb-drift" style={{ animationDelay: "-3s" }} />

      <div className="container mx-auto">
        <h2
          ref={headingRef as React.RefObject<HTMLHeadingElement>}
          className="reveal text-4xl md:text-5xl font-orbitron font-bold text-center mb-4 chrome-text"
        >
          Portfolio
        </h2>
        <p className="text-center text-muted-foreground mb-14 text-lg">
          Click any style to explore the full gallery
        </p>

        <div
          ref={gridRef as React.RefObject<HTMLDivElement>}
          className="reveal grid md:grid-cols-2 gap-6 max-w-6xl mx-auto"
        >
          {portfolioItems.map((item, index) => (
            <Link
              key={index}
              to={item.link}
              className="group relative overflow-hidden rounded-2xl tilt-card glass-card block"
              style={{ transitionDelay: `${index * 0.08}s` }}
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent transition-opacity duration-500" />

              {/* Iridescent hover border */}
              <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-primary/60 transition-all duration-500 group-hover:shadow-[0_0_30px_hsl(0_85%_50%/0.3),inset_0_0_30px_hsl(0_85%_50%/0.05)]" />

              {/* Shine sweep on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                style={{
                  background: "linear-gradient(105deg, transparent 40%, hsl(0 0% 100% / 0.06) 50%, transparent 60%)",
                  backgroundSize: "200% 100%",
                  animation: "chrome-shine 1.5s linear",
                }}
              />

              <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-2xl font-orbitron font-semibold mb-2 neon-text">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                  {item.description} →
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
