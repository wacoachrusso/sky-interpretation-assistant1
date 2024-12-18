import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

const jobTitles = [
  "Pilot",
  "Flight Attendant",
  "Ground Staff",
  "Maintenance Technician",
  "Air Traffic Controller",
  "Other",
];

const airlines = [
  "American Airlines",
  "Delta Air Lines",
  "United Airlines",
  "Southwest Airlines",
  "JetBlue Airways",
  "Alaska Airlines",
  "Spirit Airlines",
  "Frontier Airlines",
  "Other",
];

const RegistrationFormFields = ({ formData, onChange }: RegistrationFormFieldsProps) => {
  console.log("Registration form fields rendered with data:", formData);
  
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

        <div className="space-y-2">
          <Label>Job Title</Label>
          <Select
            value={formData.userType}
            onValueChange={(value) => onChange('userType', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select your job title" />
            </SelectTrigger>
            <SelectContent>
              {jobTitles.map((title) => (
                <SelectItem key={title} value={title.toLowerCase()}>
                  {title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Airline</Label>
          <Select
            value={formData.airline}
            onValueChange={(value) => onChange('airline', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select your airline" />
            </SelectTrigger>
            <SelectContent>
              {airlines.map((airline) => (
                <SelectItem key={airline} value={airline.toLowerCase()}>
                  {airline}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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