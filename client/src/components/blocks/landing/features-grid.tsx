import { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  features: string[];
  iconBg: string;
  iconColor: string;
}

export interface FeaturesGridProps {
  className?: string;
  title: string;
  subtitle: string;
  features: Feature[];
}

export function FeaturesGrid({ className, title, subtitle, features }: FeaturesGridProps) {
  return (
    <section className={`py-20 px-4 bg-muted/50 ${className}`}>
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          {title}
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Card key={index} className="bg-background border shadow-sm">
              <CardHeader>
                <div className={`w-12 h-12 ${feature.iconBg} rounded-lg flex items-center justify-center mb-6`}>
                  <Icon className={`h-6 w-6 ${feature.iconColor}`} />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
                <CardDescription className="text-muted-foreground">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {feature.features.map((item, itemIndex) => (
                    <li key={itemIndex}>• {item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}