import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Tag, Zap } from "lucide-react";

const Deals = () => {
  const deals = [
    {
      id: 1,
      title: "Small Tattoo Special",
      description: "Get 50% off any tattoo under 2 inches. Perfect for minimalist designs!",
      discount: "50% OFF",
      expiry: "Ends Jan 31, 2025",
      type: "flash",
      icon: Zap
    },
    {
      id: 2,
      title: "Refer a Friend",
      description: "Both you and your friend get 25% off your next session when they book.",
      discount: "25% OFF",
      expiry: "Ongoing",
      type: "referral",
      icon: Tag
    },
    {
      id: 3,
      title: "Saturday Walk-ins",
      description: "No appointment needed on Saturdays. First come, first served with special rates.",
      discount: "15% OFF",
      expiry: "Every Saturday",
      type: "weekly",
      icon: Clock
    }
  ];

  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Current <span className="text-primary">Deals</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Save on premium tattoo work from a master artist
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {deals.map((deal) => {
              const Icon = deal.icon;
              return (
                <Card key={deal.id} className="relative overflow-hidden border-primary/20 hover:border-primary/50 transition-all">
                  <div className="absolute top-4 right-4">
                    <Badge variant="destructive" className="text-lg px-3 py-1">
                      {deal.discount}
                    </Badge>
                  </div>
                  <CardHeader className="pt-8">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle>{deal.title}</CardTitle>
                    <CardDescription className="text-base pt-2">
                      {deal.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-muted-foreground flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {deal.expiry}
                      </span>
                    </div>
                    <Button className="w-full">
                      Claim Deal
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">💌 Want Exclusive Offers?</CardTitle>
              <CardDescription className="text-base">
                Join our VIP list and be the first to know about flash sales, special discounts, and limited-time offers.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Button size="lg" className="gap-2">
                <Tag className="w-5 h-5" />
                Subscribe for Deals
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Deals;
