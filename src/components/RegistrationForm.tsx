import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import PricingSection from "./pricing/PricingSection";
import RegistrationFormFields from "./registration/RegistrationFormFields";

const RegistrationForm = () => {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    userType: searchParams.get("userType") || "",
    airline: searchParams.get("airline") || "",
    plan: searchParams.get("expired") ? "monthly" : (searchParams.get("plan") || "trial")
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log("Submitting registration form with data:", formData);
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            full_name: formData.fullName,
            subscription_plan: formData.plan,
            query_count: 0
          })
          .eq('id', authData.user.id);

        if (profileError) throw profileError;

        toast({
          title: "Registration Successful",
          description: "Welcome to SkyGuide! Redirecting you to the chat interface...",
        });

        navigate("/chat");
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/")}
          className="text-primary hover:text-primary/90"
        >
          ← Back to Home
        </Button>
        <h1 className="text-3xl font-bold text-center">Join SkyGuide Today</h1>
      </div>

      <p className="text-center text-muted-foreground mb-8">Choose your plan and start exploring your contract details</p>

      <PricingSection 
        selectedPlan={formData.plan}
        onPlanChange={(value) => handleFieldChange('plan', value)}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <RegistrationFormFields 
          formData={formData}
          onChange={handleFieldChange}
        />
        
        <Button 
          type="submit" 
          className="w-full bg-primary hover:bg-primary/90 text-lg py-6"
          disabled={isLoading}
        >
          {isLoading ? "Creating Account..." : "Start Your Free Trial"}
        </Button>
        
        <p className="text-center text-sm text-muted-foreground">
          Already have an account? <Link to="/login" className="text-primary hover:underline">Sign in</Link>
        </p>
      </form>
    </div>
  );
};

export default RegistrationForm;
