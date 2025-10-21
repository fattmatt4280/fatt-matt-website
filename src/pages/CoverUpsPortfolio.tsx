import { Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Footer from "@/components/Footer";

const CoverUpsPortfolio = () => {
  const { data: portfolioItems, isLoading } = useQuery({
    queryKey: ["portfolio-items", "Cover-Ups"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("portfolio_items")
        .select("*")
        .eq("category", "Cover-Ups")
        .order("display_order", { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
  });

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

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : portfolioItems && portfolioItems.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {portfolioItems.map((item) => (
                <div
                  key={item.id}
                  className="group relative overflow-hidden rounded-xl card-glow transition-all duration-500 hover:scale-105"
                >
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-96 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-90" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-2xl font-orbitron font-semibold mb-2 text-glow">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-muted-foreground">No portfolio items in this category yet.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CoverUpsPortfolio;
