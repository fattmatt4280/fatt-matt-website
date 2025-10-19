import { Instagram, Facebook, Music } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-12 px-4 border-t border-border">
      <div className="container mx-auto">
        <div className="flex flex-col items-center gap-6">
          {/* Social Links */}
          <div className="flex gap-6">
            <a
              href="#"
              className="w-12 h-12 rounded-full border-2 border-primary flex items-center justify-center hover:bg-primary/10 transition-all duration-300 hover:shadow-[0_0_20px_rgba(138,43,226,0.6)]"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="w-12 h-12 rounded-full border-2 border-primary flex items-center justify-center hover:bg-primary/10 transition-all duration-300 hover:shadow-[0_0_20px_rgba(138,43,226,0.6)]"
              aria-label="TikTok"
            >
              <Music className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="w-12 h-12 rounded-full border-2 border-primary flex items-center justify-center hover:bg-primary/10 transition-all duration-300 hover:shadow-[0_0_20px_rgba(138,43,226,0.6)]"
              aria-label="Facebook"
            >
              <Facebook className="w-5 h-5" />
            </a>
          </div>
          
          {/* Divider with gradient */}
          <div className="w-full max-w-md h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent" />
          
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
