import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link, useNavigate } from "react-router-dom";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const scrollToSection = (id: string) => {
    // Navigate to home first if not already there
    if (window.location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  const menuItems = [
    { label: "Home", action: () => { navigate('/'); setIsOpen(false); } },
    { label: "About", action: () => scrollToSection('about') },
    { label: "Portfolio", action: () => scrollToSection('portfolio') },
    { label: "Book Now", action: () => scrollToSection('booking') },
    { label: "Aftercare", action: () => scrollToSection('aftercare') },
  ];

  const portfolioPages = [
    { label: "Black & Grey", to: "/portfolio/black-grey" },
    { label: "Colorwork", to: "/portfolio/colorwork" },
    { label: "Portraits", to: "/portfolio/portraits" },
    { label: "Cover-Ups", to: "/portfolio/cover-ups" },
  ];

  return (
    <nav className="fixed top-0 right-0 z-50 p-4">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button 
            variant="neon" 
            size="icon"
            className="h-12 w-12"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px] bg-background/95 backdrop-blur-lg border-primary/20">
          <div className="flex flex-col gap-6 mt-8">
            <div className="space-y-3">
              <h3 className="text-lg font-orbitron font-semibold text-primary mb-4">Navigation</h3>
              {menuItems.map((item) => (
                <button
                  key={item.label}
                  onClick={item.action}
                  className="block w-full text-left px-4 py-3 text-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-300 font-inter"
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="border-t border-primary/20 pt-4 space-y-3">
              <h3 className="text-lg font-orbitron font-semibold text-primary mb-4">Portfolio</h3>
              {portfolioPages.map((page) => (
                <Link
                  key={page.to}
                  to={page.to}
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-left px-4 py-3 text-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-300 font-inter"
                >
                  {page.label}
                </Link>
              ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  );
};

export default Navigation;
