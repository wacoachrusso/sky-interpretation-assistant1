import { Button } from "@/components/ui/button";
import { NavigationMenu } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <NavigationMenu />
      
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
              <Button 
                onClick={() => navigate("/signup")}
                className="bg-secondary hover:bg-secondary/90 text-lg px-8 py-6"
              >
                Start Your Journey
              </Button>
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

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose SkyGuide?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-4">Instant Answers</h3>
              <p>Get immediate, accurate interpretations of your contract clauses.</p>
            </div>
            <div className="p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-4">Expert Precision</h3>
              <p>AI-powered assistance with exact citations and references.</p>
            </div>
            <div className="p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-4">24/7 Availability</h3>
              <p>Access your contract guide anytime, anywhere.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Simple, Transparent Pricing</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="p-8 rounded-lg border bg-white">
              <h3 className="text-xl font-semibold mb-4">Monthly Plan</h3>
              <p className="text-4xl font-bold mb-4">$4.99<span className="text-lg font-normal">/month</span></p>
              <Button 
                onClick={() => navigate("/signup?plan=monthly")}
                className="w-full"
              >
                Choose Monthly
              </Button>
            </div>
            <div className="p-8 rounded-lg border bg-white relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-secondary text-white px-3 py-1 rounded-full text-sm">
                Save $10
              </div>
              <h3 className="text-xl font-semibold mb-4">Annual Plan</h3>
              <p className="text-4xl font-bold mb-4">$49.99<span className="text-lg font-normal">/year</span></p>
              <Button 
                onClick={() => navigate("/signup?plan=annual")}
                className="w-full bg-secondary hover:bg-secondary/90"
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