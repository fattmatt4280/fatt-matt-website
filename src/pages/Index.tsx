import Hero from "@/components/Hero";
import About from "@/components/About";
import Portfolio from "@/components/Portfolio";
import VideoShowcase from "@/components/VideoShowcase";
import LocationRegistration from "@/components/LocationRegistration";
import Booking from "@/components/Booking";
import AftercarePage from "@/components/AftercarePage";
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import AnnouncementBanner from "@/components/AnnouncementBanner";
import SEO from "@/components/SEO";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <SEO
        title="Fatt Matt — Color Realism Tattoo Artist | Largo FL"
        description="26 years of color realism & neon pop culture tattooing. Now at Revival Tattoo Collective, Largo FL. Book your consultation."
        path="/"
      />
      <Navigation />
      <AnnouncementBanner />
      <Hero />
      <About />
      <Portfolio />
      <VideoShowcase />
      <LocationRegistration />
      <Booking />
      <AftercarePage />
      <Footer />
    </main>
  );
};

export default Index;
