import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { differenceInDays } from "date-fns";

const AnnouncementBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  const deadline = new Date(2026, 3, 20);
  const daysLeft = differenceInDays(deadline, new Date());

  if (!isVisible || daysLeft <= 0) return null;

  const scrollToLocations = () => {
    document.getElementById("locations")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative overflow-hidden" style={{ background: "linear-gradient(90deg, hsl(0 0% 10%), hsl(0 0% 16%), hsl(0 0% 10%))", backgroundSize: "200% 100%", animation: "shimmer 4s linear infinite" }}>
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex-1 text-center font-medium text-primary-foreground">
          🔥 {daysLeft} days till Fatt Matt leaves the building!{" "}
          <button
            onClick={scrollToLocations}
            className="underline font-bold hover:opacity-80 transition-opacity"
          >
            Register your location now!
          </button>
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
