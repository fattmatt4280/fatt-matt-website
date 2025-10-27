import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Camera, Gift, Calendar } from "lucide-react";

const Contests = () => {
  const contests = [
    {
      id: 1,
      title: "Ink Photo Contest 2025",
      description: "Show off your Fatt Matt tattoo! Submit your best photo for a chance to win $500 in tattoo credit.",
      prize: "$500 Credit",
      deadline: "February 28, 2025",
      status: "active",
      icon: Camera,
      entries: 47
    },
    {
      id: 2,
      title: "Gaming Night Raffle",
      description: "Join our monthly gaming stream and enter to win a free 4-hour tattoo session with Fatt Matt.",
      prize: "4-Hour Session",
      deadline: "January 25, 2025",
      status: "active",
      icon: Trophy,
      entries: 132
    },
    {
      id: 3,
      title: "Design Challenge",
      description: "Submit your original tattoo design concept. Winner gets their design tattooed for free!",
      prize: "Free Tattoo",
      deadline: "March 15, 2025",
      status: "upcoming",
      icon: Gift,
      entries: 0
    }
  ];

  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Contests & <span className="text-primary">Raffles</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Win amazing prizes and exclusive tattoo sessions
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {contests.map((contest) => {
              const Icon = contest.icon;
              return (
                <Card key={contest.id} className="relative overflow-hidden border-primary/20 hover:shadow-xl transition-all">
                  {contest.status === "active" && (
                    <div className="absolute top-0 right-0">
                      <Badge className="rounded-none rounded-bl-lg bg-green-600">
                        ACTIVE
                      </Badge>
                    </div>
                  )}
                  {contest.status === "upcoming" && (
                    <div className="absolute top-0 right-0">
                      <Badge variant="secondary" className="rounded-none rounded-bl-lg">
                        UPCOMING
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader>
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">{contest.title}</CardTitle>
                    <CardDescription className="text-base pt-2">
                      {contest.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Prize</p>
                        <p className="text-lg font-bold text-primary">{contest.prize}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Entries</p>
                        <p className="text-lg font-bold">{contest.entries}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>Deadline: {contest.deadline}</span>
                    </div>
                    
                    <Button 
                      className="w-full" 
                      disabled={contest.status === "upcoming"}
                    >
                      {contest.status === "active" ? "Enter Now" : "Coming Soon"}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card className="mt-12 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">🎮 Monthly Gaming Nights</CardTitle>
              <CardDescription className="text-base">
                Join Fatt Matt for gaming streams every month. Participate for automatic entry into exclusive raffles and contests!
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center gap-4">
              <Button size="lg" variant="outline" className="gap-2">
                View Schedule
              </Button>
              <Button size="lg" className="gap-2">
                <Trophy className="w-5 h-5" />
                Join Community
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Contests;
