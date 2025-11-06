import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

const BookingSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("session_id");
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (!sessionId) {
      navigate("/");
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [sessionId, navigate]);

  if (!sessionId) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="max-w-2xl w-full">
        <div className="card-glow rounded-xl p-8 md:p-12 text-center space-y-6 animate-fade-in-up">
          <div className="flex justify-center">
            <div className="rounded-full bg-primary/10 p-4">
              <CheckCircle className="w-16 h-16 text-primary" />
            </div>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-orbitron font-bold text-foreground">
            Payment Successful!
          </h1>
          
          <div className="space-y-4 text-muted-foreground">
            <p className="text-lg">
              Your tattoo deposit has been received and your consultation is confirmed.
            </p>
            <p>
              We'll send you a confirmation email shortly with your booking details and next steps.
            </p>
            <p className="text-sm">
              Session ID: <span className="font-mono text-xs">{sessionId}</span>
            </p>
          </div>

          <div className="pt-6 space-y-4">
            <p className="text-sm text-muted-foreground">
              Redirecting to homepage in {countdown} seconds...
            </p>
            <Button
              onClick={() => navigate("/")}
              variant="neon"
              size="lg"
              className="w-full md:w-auto"
            >
              Return to Homepage
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;
