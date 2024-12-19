import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const JOB_TITLES = ["Pilot", "Flight Attendant"];

const AIRLINES = [
  "United Airlines",
  "American Airlines",
  "Delta Air Lines",
  "Southwest Airlines",
  "Alaska Airlines",
  "Spirit Airlines",
  "JetBlue Airways",
  "Frontier Airlines",
  "Other"
];

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    jobTitle: "",
    airline: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const validateForm = () => {
    if (!formData.jobTitle || !formData.airline) {
      toast({
        title: "Missing Information",
        description: "Please select both your job title and airline.",
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
      const { data, error } = await supabase.auth.signUp({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            job_title: formData.jobTitle,
            airline: formData.airline,
          },
        },
      });

      if (error) throw error;

      if (data?.user) {
        toast({
          title: "Registration Successful",
          description: "Welcome to SkyGuide!",
        });
        navigate("/chat");
      }
    } catch (error: any) {
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
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-white p-6 flex flex-col items-center justify-center">
      <div className="mb-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/")}
          className="text-primary hover:text-primary/90 bg-white/50 backdrop-blur-sm"
        >
          ← Back to Home
        </Button>
      </div>
      <Card className="w-full max-w-md bg-white/70 backdrop-blur-sm border-white/20 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Create Account</CardTitle>
          <p className="text-center text-sm text-gray-600">Enter your details to get started</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
              className="lowercase"
            />
            <Input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
            <div className="space-y-2">
              <Select
                value={formData.jobTitle}
                onValueChange={(value) => setFormData({ ...formData, jobTitle: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Job Title" />
                </SelectTrigger>
                <SelectContent>
                  {JOB_TITLES.map((title) => (
                    <SelectItem key={title} value={title.toLowerCase()}>
                      {title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Select
                value={formData.airline}
                onValueChange={(value) => setFormData({ ...formData, airline: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Airline" />
                </SelectTrigger>
                <SelectContent>
                  {AIRLINES.map((airline) => (
                    <SelectItem key={airline} value={airline.toLowerCase()}>
                      {airline}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 transition-all duration-300"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Sign Up"}
            </Button>
          </form>
          <p className="text-center mt-4 text-sm text-muted-foreground">
            Already have an account? <a href="/login" className="text-primary hover:underline">Login</a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegistrationForm;