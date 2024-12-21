import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox"; 
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { signIn } from "@/lib/api/auth";
import { persistSession } from "@/lib/session";
import { supabase } from "@/integrations/supabase/client";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    stayLoggedIn: false,
  });
  const [resetEmail, setResetEmail] = useState("");
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleResetPassword = async () => {
    if (!resetEmail) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    setIsResetting(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast({
        title: "Password Reset Email Sent",
        description: "Check your email for the password reset link",
        duration: 5000
      });
      setShowResetDialog(false);
    } catch (error: any) {
      let errorMessage = error.message;
      if (error.message.includes('User not found')) {
        errorMessage = 'No account found with this email address.';
      }
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
        duration: 5000
      });
    } finally {
      setIsResetting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await signIn(
        formData.email.trim().toLowerCase(),
        formData.password,
        formData.stayLoggedIn
      );

      toast({
        title: "Login Successful",
        description: formData.stayLoggedIn 
          ? "Welcome back! You'll stay logged in on this device."
          : "Welcome back! You'll need to log in again next time.",
      });

      navigate("/chat");
    } catch (error: any) {
      console.error('Login error:', error);
      let errorMessage = error.message;
      
      // Improve error messages
      if (error.message?.toLowerCase().includes('invalid login credentials') || 
          error.message?.toLowerCase().includes('invalid password')) {
        errorMessage = 'Invalid email or password.';
        // Show reset password dialog
        setResetEmail(formData.email);
        setShowResetDialog(true);
      } else if (error.message?.toLowerCase().includes('email not confirmed')) {
        errorMessage = 'Please verify your email address before logging in.';
      } else if (error.message?.toLowerCase().includes('too many attempts')) {
        errorMessage = 'Too many login attempts. Please try again later.';
      }
      
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
        duration: 5000
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-white p-6 flex flex-col items-center justify-center">
      <div className="fixed top-4 left-4">
        <img
          src="/favicon.png"
          alt="SkyGuide Logo"
          className="h-12 w-auto object-contain"
        />
      </div>
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
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
          <CardDescription className="text-center text-gray-600">
            Enter your credentials to continue or reset your password if needed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="lowercase"
              autoComplete="email"
              autoFocus
            />
            <Input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              autoComplete="current-password"
            />
            <div className="flex items-center space-x-2">
              <Checkbox
                id="stayLoggedIn"
                checked={formData.stayLoggedIn}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, stayLoggedIn: checked as boolean })
                }
                className="border-gray-400"
              />
              <Label 
                htmlFor="stayLoggedIn"
                className="text-sm text-gray-600 cursor-pointer"
              >
                Stay logged in
              </Label>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 transition-all duration-300"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
            <p className="text-center mt-4 text-sm text-muted-foreground">
              Don't have an account? <a href="/signup" className="text-primary hover:underline">Sign up</a>
              <br />
              <button
                type="button"
                onClick={() => setShowResetDialog(true)}
                className="text-primary hover:underline mt-2"
              >
                Forgot password?
              </button>
            </p>
          </form>
        </CardContent>

        {/* Password Reset Dialog */}
        <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reset Password</DialogTitle>
              <DialogDescription className="text-gray-600">
                Enter your email address and we'll send you a password reset link.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <Input
                type="email"
                placeholder="Email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="w-full"
              />
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowResetDialog(false)}
                  className="hover:bg-gray-100"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleResetPassword}
                  disabled={isResetting}
                  className="bg-primary hover:bg-primary/90"
                >
                  {isResetting ? "Sending..." : "Send Reset Link"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </Card>
    </div>
  );
};

export default LoginForm;