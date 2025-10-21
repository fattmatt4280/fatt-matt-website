import Hero from "@/components/Hero";
import About from "@/components/About";
import Portfolio from "@/components/Portfolio";
import Booking from "@/components/Booking";
import AftercarePage from "@/components/AftercarePage";
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <About />
      <Portfolio />
      <Booking />
      <AftercarePage />
      <Footer />
    </main>
  );
};

export default Index;
