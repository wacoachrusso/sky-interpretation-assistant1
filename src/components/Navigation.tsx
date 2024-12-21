import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { testLogin } from "@/lib/api/auth";
import { useToast } from "@/hooks/use-toast";

export const Navigation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const isDev = process.env.NODE_ENV === 'development' || import.meta.env.DEV;
  
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
              src="/logo.png"
              alt="SkyGuide Logo" 
              className="h-10 w-auto object-contain"
              loading="eager"
              onError={(e) => {
                console.error('Logo failed to load');
                e.currentTarget.style.display = 'none';
              }}
            />
            <span className="text-xl font-bold text-primary">SkyGuide</span>
          </div>
          <NavigationMenu>
            <NavigationMenuList>
              {(isDev || import.meta.env.DEV) && (
                <NavigationMenuItem>
                  <Button 
                    variant="outline" 
                    onClick={handleTestLogin}
                    className="bg-yellow-100 hover:bg-yellow-200 border-yellow-400 mr-2"
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