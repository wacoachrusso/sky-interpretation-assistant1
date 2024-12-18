import PricingCard from "./PricingCard";

interface PricingSectionProps {
  selectedPlan: string;
  onPlanChange: (plan: string) => void;
}

const PricingSection = ({ selectedPlan, onPlanChange }: PricingSectionProps) => {
  return (
    <div className="grid md:grid-cols-2 gap-6 mb-8">
      <PricingCard
        title="Monthly Plan"
        description="Perfect for trying out SkyGuide"
        price="$4.99"
        interval="month"
        value="monthly"
        isSelected={selectedPlan === 'monthly'}
        onValueChange={onPlanChange}
      />
      <PricingCard
        title="Annual Plan"
        description="Best value for dedicated users"
        price="$49.99"
        interval="year"
        value="annual"
        isSelected={selectedPlan === 'annual'}
        onValueChange={onPlanChange}
        showSaveBadge
      />
    </div>
  );
};

export default PricingSection;