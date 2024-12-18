import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

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
              if (checked) {
                onChange('plan', 'trial');
              } else {
                onChange('plan', '');
              }
            }}
          />
          <Label htmlFor="trial">Start with Free Trial (2 queries)</Label>
        </div>
      </div>
    </div>
  );
};

export default RegistrationFormFields;