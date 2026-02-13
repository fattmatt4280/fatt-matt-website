import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MapPin, Check } from "lucide-react";

const locations = [
  { id: "montgomery-il", label: "Montgomery, IL", state: "Illinois" },
  { id: "portage-in", label: "Portage, IN", state: "Indiana" },
  { id: "clearwater-fl", label: "Clearwater, FL", state: "Florida" },
];

const LocationRegistration = () => {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registered, setRegistered] = useState<string[]>([]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLocation) return;
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("location_registrations").insert({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || null,
        location: selectedLocation,
      });

      if (error) throw error;

      setRegistered((prev) => [...prev, selectedLocation]);
      setFormData({ name: "", email: "", phone: "" });
      setSelectedLocation(null);
      toast.success("You're on the list! 🎉", {
        description: `We'll notify you about promos & travel dates for ${locations.find((l) => l.id === selectedLocation)?.label}.`,
      });
    } catch (err: any) {
      console.error("Registration error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="locations" className="py-20 px-4">
      <div className="container mx-auto max-w-4xl text-center">
        <h2 className="text-4xl md:text-5xl font-orbitron font-bold mb-4 animate-fade-in-up">
          Join the Crew
        </h2>
        <p className="text-muted-foreground mb-12 text-lg">
          Register at your nearest location for exclusive promos, travel dates & flash deals.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {locations.map((loc) => {
            const isRegistered = registered.includes(loc.id);
            return (
              <button
                key={loc.id}
                onClick={() => !isRegistered && setSelectedLocation(loc.id)}
                disabled={isRegistered}
                className={`card-glow rounded-xl p-8 flex flex-col items-center gap-4 transition-all duration-300 ${
                  isRegistered
                    ? "opacity-70 cursor-default"
                    : "hover:scale-105 hover:neon-border cursor-pointer"
                }`}
              >
                {isRegistered ? (
                  <Check className="w-10 h-10 text-primary" />
                ) : (
                  <MapPin className="w-10 h-10 text-accent" />
                )}
                <div>
                  <h3 className="text-xl font-orbitron font-semibold text-foreground">
                    {loc.state}
                  </h3>
                  <p className="text-muted-foreground text-sm mt-1">{loc.label}</p>
                </div>
                <span className="text-xs font-medium text-foreground uppercase tracking-wider">
                  {isRegistered ? "Registered ✓" : "Tap to Register"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <Dialog open={!!selectedLocation} onOpenChange={(open) => !open && setSelectedLocation(null)}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader>
            <DialogTitle className="font-orbitron text-foreground">
              Register — {locations.find((l) => l.id === selectedLocation)?.label}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Get notified about promos, travel dates & flash deals at this location.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleRegister} className="space-y-4 mt-2">
            <div>
              <Label htmlFor="reg-name">Name</Label>
              <Input
                id="reg-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your name"
                className="bg-muted/50 border-border"
                required
              />
            </div>
            <div>
              <Label htmlFor="reg-email">Email</Label>
              <Input
                id="reg-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your@email.com"
                className="bg-muted/50 border-border"
                required
              />
            </div>
            <div>
              <Label htmlFor="reg-phone">Phone (optional)</Label>
              <Input
                id="reg-phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(555) 123-4567"
                className="bg-muted/50 border-border"
              />
            </div>
            <Button
              variant="neon"
              size="lg"
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Registering..." : "Join the List"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default LocationRegistration;
