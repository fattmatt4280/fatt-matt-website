import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "./ui/button";

const AnnouncementBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);

  const announcements = [
    "🎮 New Gaming Night Raffle - Win Exclusive Tattoo Session!",
    "🎨 50% Off Small Tattoos This Month Only",
    "🏆 Photo Contest: Show Your Ink & Win $500 Credit",
    "🎁 Refer a Friend - Both Get 25% Off",
    "⚡ Flash Sale: Walk-ins Welcome on Saturdays"
  ];

  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setScrollPosition((prev) => (prev + 1) % announcements.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isVisible, announcements.length]);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] animate-[shimmer_3s_linear_infinite] relative overflow-hidden">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex-1 overflow-hidden">
          <div
            className="transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${scrollPosition * 100}%)` }}
          >
            <div className="flex whitespace-nowrap">
              {announcements.map((announcement, index) => (
                <div
                  key={index}
                  className="min-w-full text-center font-medium text-primary-foreground"
                >
                  {announcement}
                </div>
              ))}
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsVisible(false)}
          className="ml-4 text-primary-foreground hover:bg-primary-foreground/20"
          aria-label="Close announcement"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default AnnouncementBanner;
