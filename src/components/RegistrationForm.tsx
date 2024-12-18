import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useSearchParams } from "react-router-dom";

const RegistrationForm = () => {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    userType: searchParams.get("userType") || "",
    airline: searchParams.get("airline") || "",
    plan: searchParams.get("plan") || "trial"
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  console.log("Registration form initialized with params:", {
    userType: searchParams.get("userType"),
    airline: searchParams.get("airline"),
    plan: searchParams.get("plan")
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log("Submitting registration form with data:", formData);
      
      // Sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // Update the profile with additional information
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            full_name: formData.fullName,
            user_type: formData.userType,
            airline: formData.airline,
            subscription_plan: formData.plan,
            query_count: 0 // Initialize query count
          })
          .eq('id', authData.user.id);

        if (profileError) throw profileError;

        toast({
          title: "Registration Successful",
          description: "Please check your email for verification.",
        });

        // Redirect to the main app after a short delay
        setTimeout(() => {
          navigate("/");
        }, 1500);
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

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center mb-4">Join SkyGuide Today</h1>
        <p className="text-center text-muted-foreground">Choose your plan and start exploring your contract details</p>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card className={`relative ${formData.plan === 'monthly' ? 'border-primary' : ''}`}>
          <CardHeader>
            <CardTitle>Monthly Plan</CardTitle>
            <CardDescription>Perfect for trying out SkyGuide</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-4">$4.99<span className="text-lg font-normal">/month</span></div>
            <RadioGroup value={formData.plan} onValueChange={(value) => setFormData({ ...formData, plan: value })}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="monthly" id="monthly" />
                <Label htmlFor="monthly">Select Monthly Plan</Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        <Card className={`relative ${formData.plan === 'annual' ? 'border-primary' : ''}`}>
          <div className="absolute -top-2 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm">
            Save $10
          </div>
          <CardHeader>
            <CardTitle>Annual Plan</CardTitle>
            <CardDescription>Best value for dedicated users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-4">$49.99<span className="text-lg font-normal">/year</span></div>
            <RadioGroup value={formData.plan} onValueChange={(value) => setFormData({ ...formData, plan: value })}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="annual" id="annual" />
                <Label htmlFor="annual">Select Annual Plan</Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>
      </div>

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <Input
            placeholder="Full Name"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            required
          />
          <Input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          <Select 
            value={formData.userType} 
            onValueChange={(value) => setFormData({ ...formData, userType: value })} 
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="flight-attendant">Flight Attendant</SelectItem>
              <SelectItem value="pilot">Pilot</SelectItem>
            </SelectContent>
          </Select>
          <Select 
            value={formData.airline} 
            onValueChange={(value) => setFormData({ ...formData, airline: value })} 
            required
          >
            <SelectTrigger>
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
        </div>
        <Button 
          type="submit" 
          className="w-full bg-primary hover:bg-primary/90 text-lg py-6"
          disabled={isLoading}
        >
          {isLoading ? "Creating Account..." : "Start Your Free Trial"}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Already have an account? <a href="/login" className="text-primary hover:underline">Sign in</a>
        </p>
      </form>
    </div>
  );
};

export default RegistrationForm;