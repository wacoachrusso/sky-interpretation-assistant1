import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import HeroSection from "@/components/home/HeroSection";
import PricingCards from "@/components/home/PricingCards";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navigation />
      
      <HeroSection />

      {/* Pricing Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-indigo-50/50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,theme(colors.primary/5),transparent_50%)]" />
        <div className="container mx-auto px-4">
          <h2 className="relative text-3xl font-bold text-center mb-12 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Simple, Transparent Pricing
          </h2>
          <PricingCards />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;