import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const Navigation = () => {
  const navigate = useNavigate();

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