import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const PricingCards = () => {
  const navigate = useNavigate();

  const handleStartTrial = () => {
    console.log("Starting free trial signup flow");
    navigate("/signup?plan=trial");
  };

  const handleChooseMonthly = () => {
    console.log("Starting monthly plan signup flow");
    navigate("/signup?plan=monthly");
  };

  const handleChooseAnnual = () => {
    console.log("Starting annual plan signup flow");
    navigate("/signup?plan=annual");
  };

  return (
    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      <div className="p-8 rounded-lg border bg-white">
        <h3 className="text-xl font-semibold mb-4">Free Trial</h3>
        <p className="text-4xl font-bold mb-4">Free</p>
        <ul className="mb-8 space-y-2">
          <li>✓ 2 Contract Queries</li>
          <li>✓ Basic Features</li>
          <li>✓ No Credit Card Required</li>
        </ul>
        <Button 
          onClick={handleStartTrial}
          className="w-full"
          type="button"
        >
          Start Free Trial
        </Button>
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
  );
};

export default PricingCards;