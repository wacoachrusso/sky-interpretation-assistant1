import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    employeeId: "",
    email: "",
    password: "",
    userType: "",
    airline: "",
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    toast({
      title: "Registration Submitted",
      description: "Please check your email for verification.",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md">
      <div className="space-y-4">
        <Input
          placeholder="Full Name"
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
        />
        <Input
          placeholder="Employee ID"
          value={formData.employeeId}
          onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
        />
        <Input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <Input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
        <Select onValueChange={(value) => setFormData({ ...formData, userType: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="flight-attendant">Flight Attendant</SelectItem>
            <SelectItem value="pilot">Pilot</SelectItem>
          </SelectContent>
        </Select>
        <Select onValueChange={(value) => setFormData({ ...formData, airline: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select Airline" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="united">United Airlines</SelectItem>
            <SelectItem value="delta">Delta Airlines</SelectItem>
            <SelectItem value="american">American Airlines</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
        Register
      </Button>
    </form>
  );
};

export default RegistrationForm;