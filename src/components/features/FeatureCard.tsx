import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick?: () => void;
  className?: string;
}

const FeatureCard = ({ icon: Icon, title, description, onClick, className }: FeatureCardProps) => {
  return (
    <Card 
      className={cn(
        "glass-card p-6 hover-scale cursor-pointer flex flex-col items-center text-center",
        className
      )}
      onClick={onClick}
    >
      <Icon className="w-12 h-12 text-primary mb-4" />
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </Card>
  );
};

export default FeatureCard;