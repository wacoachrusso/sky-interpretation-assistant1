import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userType, setUserType] = useState("");
  const [airline, setAirline] = useState("");

  const handleStartTrial = async () => {
    console.log("Starting trial with:", { userType, airline });
    
    if (!userType || !airline) {
      toast({
        title: "Missing Information",
        description: "Please select both your role and airline before continuing.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      console.log("Current user:", user);
      
      if (!user) {
        const params = new URLSearchParams({
          userType,
          airline,
          plan: 'trial'
        }).toString();
        console.log("Navigating to signup with params:", params);
        navigate(`/signup?${params}`);
      } else {
        console.log("Navigating to chat");
        navigate("/chat");
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleChooseMonthly = async () => {
    console.log("Choosing monthly plan");
    try {
      const { data: { user } } = await supabase.auth.getUser();
      console.log("Current user:", user);
      
      if (!user) {
        const params = new URLSearchParams({
          plan: 'monthly'
        }).toString();
        console.log("Navigating to signup with monthly plan");
        navigate(`/signup?${params}`);
      } else {
        console.log("Navigating to chat");
        navigate("/chat");
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleChooseAnnual = async () => {
    console.log("Choosing annual plan");
    try {
      const { data: { user } } = await supabase.auth.getUser();
      console.log("Current user:", user);
      
      if (!user) {
        const params = new URLSearchParams({
          plan: 'annual'
        }).toString();
        console.log("Navigating to signup with annual plan");
        navigate(`/signup?${params}`);
      } else {
        console.log("Navigating to chat");
        navigate("/chat");
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-primary py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="flex-1 text-white">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Your Personal Contract Guide
              </h1>
              <p className="text-xl mb-8 text-gray-200">
                Instant, accurate contract interpretation for airline professionals. Get the answers you need, when you need them.
              </p>
            </div>
            <div className="flex-1 flex justify-center">
              <img
                src="/lovable-uploads/4d0b5f1f-ee3c-422d-81df-9db600490aec.png"
                alt="SkyGuide Logo"
                className="w-64 md:w-96"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Simple, Transparent Pricing</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="p-8 rounded-lg border bg-white">
              <h3 className="text-xl font-semibold mb-4">Free Trial</h3>
              <p className="text-4xl font-bold mb-4">Free</p>
              <ul className="mb-8 space-y-2">
                <li>✓ 2 Contract Queries</li>
                <li>✓ Basic Features</li>
                <li>✓ No Credit Card Required</li>
              </ul>
              <div className="space-y-4">
                <Select value={userType} onValueChange={setUserType}>
                  <SelectTrigger className="w-full bg-white text-gray-900 border-gray-300">
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flight-attendant">Flight Attendant</SelectItem>
                    <SelectItem value="pilot">Pilot</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={airline} onValueChange={setAirline}>
                  <SelectTrigger className="w-full bg-white text-gray-900 border-gray-300">
                    <SelectValue placeholder="Select Airline" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="united">United Airlines</SelectItem>
                    <SelectItem value="american">American Airlines</SelectItem>
                    <SelectItem value="southwest">Southwest Airlines</SelectItem>
                    <SelectItem value="alaska">Alaska Airlines</SelectItem>
                    <SelectItem value="spirit">Spirit Airlines</SelectItem>
                    <SelectItem value="jetblue">JetBlue Airways</SelectItem>
                  </SelectContent>
                </Select>

                <Button 
                  onClick={handleStartTrial}
                  className="w-full"
                  type="button"
                >
                  Start Free Trial
                </Button>
              </div>
            </div>
            <div className="p-8 rounded-lg border bg-white">
              <h3 className="text-xl font-semibold mb-4">Monthly Plan</h3>
              <p className="text-4xl font-bold mb-4">$4.99<span className="text-lg font-normal">/month</span></p>
              <ul className="mb-8 space-y-2">
                <li>✓ Unlimited Queries</li>
                <li>✓ All Features</li>
                <li>✓ Priority Support</li>
              </ul>
              <Button 
                onClick={handleChooseMonthly}
                className="w-full"
                type="button"
              >
                Choose Monthly
              </Button>
            </div>
            <div className="p-8 rounded-lg border bg-white relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-secondary text-white px-3 py-1 rounded-full text-sm">
                Best Value
              </div>
              <h3 className="text-xl font-semibold mb-4">Annual Plan</h3>
              <p className="text-4xl font-bold mb-4">$49.99<span className="text-lg font-normal">/year</span></p>
              <ul className="mb-8 space-y-2">
                <li>✓ Unlimited Queries</li>
                <li>✓ All Features</li>
                <li>✓ Priority Support</li>
                <li>✓ Save $10</li>
              </ul>
              <Button 
                onClick={handleChooseAnnual}
                className="w-full bg-secondary hover:bg-secondary/90"
                type="button"
              >
                Choose Annual
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
