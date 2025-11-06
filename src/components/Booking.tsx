import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Booking = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    location: "Montgomery IL"
  });
  const [aiFormData, setAiFormData] = useState({
    name: "",
    email: "",
    idea: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent, consultType: string) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const data = consultType === "AI Consult" ? {
        name: aiFormData.name,
        email: aiFormData.email,
        message: aiFormData.idea,
        location: "Not specified",
        consultType,
      } : {
        ...formData,
        consultType,
      };

      // Create Stripe checkout session
      const { data: sessionData, error } = await supabase.functions.invoke('create-checkout-session', {
        body: data,
      });

      if (error) throw error;

      if (sessionData?.url) {
        // Open Stripe checkout in new tab (more reliable on mobile)
        const opened = window.open(sessionData.url, '_blank');
        
        // Show notification with fallback link
        if (opened) {
          toast.success("Opening payment page...", {
            description: "If the page doesn't open, click here",
            action: {
              label: "Open Payment",
              onClick: () => window.open(sessionData.url, '_blank')
            }
          });
        } else {
          toast.error("Popup blocked", {
            description: "Please click the button below to complete payment",
            action: {
              label: "Open Payment",
              onClick: () => window.open(sessionData.url, '_blank')
            }
          });
        }
        
        // Reset submitting state so form is usable again
        setIsSubmitting(false);
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error: any) {
      console.error('Error creating checkout:', error);
      toast.error("Failed to create checkout session. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <section id="booking" className="py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-4xl md:text-5xl font-orbitron font-bold text-center mb-4 animate-fade-in-up">
          Booking & Deposits
        </h2>
        <p className="text-center text-muted-foreground mb-12 text-lg">
          Ready to bring your vision to life? Let's connect.
        </p>
        
        <div className="card-glow rounded-xl p-6 md:p-10 animate-fade-in-up">
          <Tabs defaultValue="manual" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="ai">AI Consult</TabsTrigger>
              <TabsTrigger value="manual">Manual Consult</TabsTrigger>
            </TabsList>
            
            <TabsContent value="ai">
              <form onSubmit={(e) => handleSubmit(e, "AI Consult")} className="space-y-6">
                <div>
                  <Label htmlFor="ai-name">Name</Label>
                  <Input
                    id="ai-name"
                    value={aiFormData.name}
                    onChange={(e) => setAiFormData({ ...aiFormData, name: e.target.value })}
                    placeholder="Your name"
                    className="bg-muted/50 border-border"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="ai-email">Email</Label>
                  <Input
                    id="ai-email"
                    type="email"
                    value={aiFormData.email}
                    onChange={(e) => setAiFormData({ ...aiFormData, email: e.target.value })}
                    placeholder="your@email.com"
                    className="bg-muted/50 border-border"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="ai-idea">Tattoo Idea Description</Label>
                  <Textarea
                    id="ai-idea"
                    value={aiFormData.idea}
                    onChange={(e) => setAiFormData({ ...aiFormData, idea: e.target.value })}
                    placeholder="Describe your tattoo concept, placement, size..."
                    rows={4}
                    className="bg-muted/50 border-border"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="ai-photo">Reference Photo (Optional)</Label>
                  <Input
                    id="ai-photo"
                    type="file"
                    accept="image/*"
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
                  {isSubmitting ? "Processing..." : "Pay Deposit & Book Consultation"}
                </Button>
                <p className="text-sm text-muted-foreground text-center">
                  Secure deposit payment required to confirm your consultation
                </p>
              </form>
            </TabsContent>
            
            <TabsContent value="manual">
              <form onSubmit={(e) => handleSubmit(e, "Manual Consult")} className="space-y-6">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your name"
                    className="bg-muted/50 border-border"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your@email.com"
                    className="bg-muted/50 border-border"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="location">Preferred Location</Label>
                  <select
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full h-10 px-3 py-2 rounded-md bg-muted/50 border border-border text-foreground"
                  >
                    <option value="Montgomery IL">Montgomery IL</option>
                    <option value="Portage IN">Portage IN</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell me about your tattoo idea..."
                    rows={4}
                    className="bg-muted/50 border-border"
                    required
                  />
                </div>
                <Button 
                  variant="neon" 
                  size="lg" 
                  type="submit" 
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing..." : "Pay Deposit & Book Consultation"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default Booking;
