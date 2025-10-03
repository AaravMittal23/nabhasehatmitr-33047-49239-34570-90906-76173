import { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  buttonText: string;
  onClick: () => void;
  variant?: 'default' | 'emergency' | 'pharmacy' | 'health-records';
}

export function ServiceCard({ 
  icon: Icon, 
  title, 
  description, 
  buttonText, 
  onClick,
  variant = 'default'
}: ServiceCardProps) {
  return (
    <Card className="transition-smooth hover:shadow-lg hover:-translate-y-1 cursor-pointer group flex flex-col h-full" onClick={onClick}>
      <CardHeader className="pb-2">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 transition-smooth group-hover:scale-110 ${
          variant === 'emergency' 
            ? 'bg-medical-red/10 text-medical-red group-hover:bg-medical-red group-hover:text-white'
            : variant === 'pharmacy'
            ? 'bg-blue-600/10 text-blue-600 group-hover:bg-blue-600 group-hover:text-white'
            : variant === 'health-records'
            ? 'bg-orange-500/10 text-orange-500 group-hover:bg-orange-500 group-hover:text-white'
            : 'bg-healthcare-green/10 text-healthcare-green group-hover:bg-healthcare-green group-hover:text-white'
        }`}>
          <Icon className="h-6 w-6" />
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0 mt-auto">
        <Button 
          variant={variant === 'emergency' ? 'destructive' : 'default'}
          className="w-full transition-smooth"
          size="sm"
        >
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
}