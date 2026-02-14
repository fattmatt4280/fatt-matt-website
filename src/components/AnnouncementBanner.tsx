import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { differenceInDays } from "date-fns";

const AnnouncementBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  const deadline = new Date(2026, 3, 30);
  const daysLeft = differenceInDays(deadline, new Date());

  if (!isVisible || daysLeft <= 0) return null;

  const scrollToLocations = () => {
    document.getElementById("locations")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] animate-[shimmer_3s_linear_infinite] relative overflow-hidden">
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
