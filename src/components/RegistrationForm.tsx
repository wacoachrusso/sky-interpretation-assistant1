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
    userType: "",
    airline: "",
    plan: ""
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const validateForm = () => {
    if (!formData.plan) {
      toast({
        title: "Plan Selection Required",
        description: "Please select a subscription plan to continue.",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.userType || !formData.airline) {
      toast({
        title: "Missing Information",
        description: "Please select both your job title and airline.",
        variant: "destructive",
      });
      return false;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Invalid Password",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      console.log("Submitting registration form with data:", formData);
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      if (authError) throw authError;

      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            full_name: formData.fullName,
            subscription_plan: formData.plan,
            user_type: formData.userType,
            airline: formData.airline,
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
    } catch (error: any) {
      console.error('Registration error:', error);
      
      let errorMessage = error.message;
      if (error.message.includes("weak_password")) {
        errorMessage = "Password must be at least 6 characters long.";
      }
      
      toast({
        title: "Registration Failed",
        description: errorMessage,
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
          {isLoading ? "Creating Account..." : "Create Account"}
        </Button>
        
        <p className="text-center text-sm text-muted-foreground">
          Already have an account? <Link to="/login" className="text-primary hover:underline">Sign in</Link>
        </p>
      </form>
    </div>
  );
};

export default RegistrationForm;