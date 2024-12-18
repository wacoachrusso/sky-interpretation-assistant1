import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { testLogin } from "@/lib/api/auth";
import { useToast } from "@/hooks/use-toast";

export const Navigation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleTestLogin = async () => {
    try {
      await testLogin();
      toast({
        title: "Test Mode Activated",
        description: "You can now use the app without authentication",
      });
      navigate("/chat");
    } catch (error) {
      console.error("Test login failed:", error);
      toast({
        title: "Test Login Failed",
        description: "Could not activate test mode. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <img
              src="/lovable-uploads/4d0b5f1f-ee3c-422d-81df-9db600490aec.png"
              alt="SkyGuide Logo"
              className="h-8"
            />
            <span className="text-xl font-bold text-primary">SkyGuide</span>
          </div>
          <NavigationMenu>
            <NavigationMenuList>
              {process.env.NODE_ENV === 'development' && (
                <NavigationMenuItem>
                  <Button 
                    variant="outline" 
                    onClick={handleTestLogin}
                    className="bg-yellow-100 hover:bg-yellow-200 border-yellow-400"
                  >
                    Test Mode
                  </Button>
                </NavigationMenuItem>
              )}
              <NavigationMenuItem>
                <Button variant="ghost" onClick={() => navigate("/login")}>
                  Login
                </Button>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Button onClick={() => navigate("/signup")}>
                  Sign Up
                </Button>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </header>
  );
};