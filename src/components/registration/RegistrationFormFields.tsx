import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface RegistrationFormFieldsProps {
  formData: {
    fullName: string;
    email: string;
    password: string;
    userType: string;
    airline: string;
    plan: string;
  };
  onChange: (field: string, value: string) => void;
}

const RegistrationFormFields = ({ formData, onChange }: RegistrationFormFieldsProps) => {
  console.log("Registration form fields rendered with plan:", formData.plan);
  
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card className={`relative ${formData.plan === 'monthly' ? 'border-primary' : ''}`}>
          <CardHeader>
            <CardTitle>Monthly Plan</CardTitle>
            <CardDescription>Perfect for trying out SkyGuide</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-4">
              $4.99<span className="text-lg font-normal">/month</span>
            </div>
            <RadioGroup value={formData.plan} onValueChange={(value) => onChange('plan', value)}>
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
            <div className="text-3xl font-bold mb-4">
              $49.99<span className="text-lg font-normal">/year</span>
            </div>
            <RadioGroup value={formData.plan} onValueChange={(value) => onChange('plan', value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="annual" id="annual" />
                <Label htmlFor="annual">Select Annual Plan</Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <Input
          placeholder="Full Name"
          value={formData.fullName}
          onChange={(e) => onChange('fullName', e.target.value)}
          required
        />
        <Input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => onChange('email', e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => onChange('password', e.target.value)}
          required
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="trial"
            checked={formData.plan === 'trial'}
            onCheckedChange={(checked) => {
              if (checked) onChange('plan', 'trial');
            }}
          />
          <Label htmlFor="trial">Start with Free Trial (2 queries)</Label>
        </div>
      </div>
    </div>
  );
};

export default RegistrationFormFields;