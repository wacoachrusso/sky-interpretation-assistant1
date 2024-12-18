import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import HeroSection from "@/components/home/HeroSection";
import PricingCards from "@/components/home/PricingCards";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <HeroSection />

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Simple, Transparent Pricing</h2>
          <PricingCards />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;