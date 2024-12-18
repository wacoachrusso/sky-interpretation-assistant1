import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface RegistrationFormFieldsProps {
  formData: {
    fullName: string;
    email: string;
    password: string;
    userType: string;
    airline: string;
  };
  onChange: (field: string, value: string) => void;
}

const RegistrationFormFields = ({ formData, onChange }: RegistrationFormFieldsProps) => {
  return (
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
      <Select 
        value={formData.userType} 
        onValueChange={(value) => onChange('userType', value)} 
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
        onValueChange={(value) => onChange('airline', value)} 
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
  );
};

export default RegistrationFormFields;