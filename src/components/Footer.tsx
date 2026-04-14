import { Instagram, Facebook, Music } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-12 px-4 border-t border-border">
      <div className="container mx-auto">
        <div className="flex flex-col items-center gap-6">
          {/* Social Links */}
          <div className="flex gap-6">
            <a
              href="https://instagram.com/fattmatt444"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full glass-card flex items-center justify-center hover:bg-white/8 transition-all duration-300 hover:shadow-[0_0_20px_hsl(0_0%_60%/0.2)]"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="https://www.tiktok.com/@fattmatt444?_r=1&_t=ZT-91AxAmL4znB"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full glass-card flex items-center justify-center hover:bg-white/8 transition-all duration-300 hover:shadow-[0_0_20px_hsl(0_0%_60%/0.2)]"
              aria-label="TikTok"
            >
              <Music className="w-5 h-5" />
            </a>
            <a
              href="https://www.facebook.com/share/1G1qdtGHKi/?mibextid=wwXIfr"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full glass-card flex items-center justify-center hover:bg-white/8 transition-all duration-300 hover:shadow-[0_0_20px_hsl(0_0%_60%/0.2)]"
              aria-label="Facebook"
            >
              <Facebook className="w-5 h-5" />
            </a>
          </div>
          
          {/* Divider with gradient */}
          <div className="w-full max-w-md h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          
          {/* Copyright */}
          <p className="text-muted-foreground text-center">
            © 2025 Fatt Matt — Montgomery IL • Portage IN
          </p>
          <p className="text-sm text-muted-foreground/60">
            24 Years of Precision Artistry
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
