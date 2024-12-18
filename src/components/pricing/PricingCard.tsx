import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface PricingCardProps {
  title: string;
  description: string;
  price: string;
  interval: string;
  value: string;
  isSelected: boolean;
  onValueChange: (value: string) => void;
  showSaveBadge?: boolean;
}

const PricingCard = ({
  title,
  description,
  price,
  interval,
  value,
  isSelected,
  onValueChange,
  showSaveBadge = false,
}: PricingCardProps) => {
  return (
    <Card className={`relative ${isSelected ? 'border-primary' : ''}`}>
      {showSaveBadge && (
        <div className="absolute -top-2 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm">
          Save $10
        </div>
      )}
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold mb-4">
          {price}<span className="text-lg font-normal">/{interval}</span>
        </div>
        <RadioGroup value={value} onValueChange={onValueChange}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value={value} id={value} />
            <Label htmlFor={value}>Select {title}</Label>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default PricingCard;