import type { RefObject } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Play } from "lucide-react";

// Swap this URL with your YouTube video ID once uploaded
const YOUTUBE_VIDEO_ID = "YOUR_VIDEO_ID_HERE";

const VideoShowcase = () => {
  const headingRef = useScrollReveal();
  const frameRef   = useScrollReveal(0.15);

  const isPlaceholder = YOUTUBE_VIDEO_ID === "YOUR_VIDEO_ID_HERE";

  return (
    <section id="video" className="py-24 px-4 relative overflow-hidden">
      {/* Background orbs */}

      <div className="container mx-auto max-w-4xl">
        <h2
          ref={headingRef as RefObject<HTMLHeadingElement>}
          className="reveal text-4xl md:text-5xl font-orbitron font-bold text-center mb-4 chrome-text"
        >
          The Work
        </h2>
        <p className="reveal text-center text-muted-foreground mb-12 text-lg">
          24 years. One reel.
        </p>

        {/* Video frame */}
        <div
          ref={frameRef as RefObject<HTMLDivElement>}
          className="reveal-scale glass-card-glow rounded-2xl overflow-hidden video-frame relative"
        >
          {isPlaceholder ? (
            /* Placeholder — shown until YouTube ID is added */
            <div className="aspect-video flex flex-col items-center justify-center bg-gradient-to-br from-card to-background gap-6">
              <div className="w-20 h-20 rounded-full glass-card flex items-center justify-center animate-pulse-glow">
                <Play className="w-8 h-8 text-primary fill-primary ml-1" />
              </div>
              <div className="text-center">
                <p className="font-orbitron text-foreground/60 text-sm">Video coming soon</p>
                <p className="text-muted-foreground text-xs mt-1">Swap YOUTUBE_VIDEO_ID in VideoShowcase.tsx</p>
              </div>
            </div>
          ) : (
            <div className="aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?rel=0&modestbranding=1&autoplay=0`}
                title="Fatt Matt — Featured Work"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
          )}

          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-white/25 rounded-tl-2xl pointer-events-none" />
          <div className="absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2 border-white/25 rounded-tr-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-10 h-10 border-b-2 border-l-2 border-white/25 rounded-bl-2xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 border-white/25 rounded-br-2xl pointer-events-none" />
        </div>

        <p className="text-center text-muted-foreground text-sm mt-6">
          Montgomery IL &nbsp;•&nbsp; Portage IN &nbsp;•&nbsp; Clearwater FL
        </p>
      </div>
    </section>
  );
};

export default VideoShowcase;
