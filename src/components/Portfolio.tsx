import { Link } from "react-router-dom";
import portfolio1 from "@/assets/portfolio-1.jpg";
import portfolio2 from "@/assets/portfolio-2.jpg";
import portfolio3 from "@/assets/portfolio-3.jpg";
import portfolio4 from "@/assets/portfolio-4.jpg";

const portfolioItems = [
  {
    title: "Black & Grey",
    image: portfolio1,
    description: "Timeless realism in grayscale",
    link: "/portfolio/black-grey"
  },
  {
    title: "Colorwork",
    image: portfolio2,
    description: "Vibrant and bold color tattoos",
    link: "/portfolio/colorwork"
  },
  {
    title: "Portraits",
    image: portfolio3,
    description: "Realistic portrait work",
    link: "/portfolio/portraits"
  },
  {
    title: "Cover-Ups",
    image: portfolio4,
    description: "Transforming old tattoos",
    link: "/portfolio/cover-ups"
  }
];

const Portfolio = () => {
  return (
    <section id="portfolio" className="py-20 px-4 bg-gradient-to-b from-background to-card">
      <div className="container mx-auto">
        <h2 className="text-4xl md:text-5xl font-orbitron font-bold text-center mb-12 animate-fade-in-up">
          Portfolio
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {portfolioItems.map((item, index) => (
            <Link
              key={index}
              to={item.link}
              className="group relative overflow-hidden rounded-xl card-glow transition-all duration-500 hover:scale-105 animate-fade-in-up block"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-90" />
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary transition-all duration-500 rounded-xl group-hover:shadow-[0_0_20px_rgba(138,43,226,0.6)]" />
              
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-2xl font-orbitron font-semibold mb-2 text-glow">
                  {item.title}
                </h3>
                <p className="text-muted-foreground">
                  {item.description}
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
