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

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
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
