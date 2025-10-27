import { ArrowRight, Shield, Star, Users, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface HeroSectionProps {
  className?: string;
  badge?: {
    text: string;
    icon: React.ReactNode;
  };
  title: React.ReactNode;
  subtitle: string;
  primaryAction?: {
    text: string;
    onClick?: () => void;
    href?: string;
  };
  secondaryAction?: {
    text: string;
    onClick?: () => void;
    href?: string;
  };
  features?: Array<{
    icon: React.ReactNode;
    text: string;
  }>;
}

export function HeroSection({
  className,
  badge = {
    text: 'Production-Ready Framework',
    icon: <Star className="h-4 w-4" />
  },
  title,
  subtitle,
  primaryAction = {
    text: 'Get Started',
  },
  secondaryAction = {
    text: 'View Documentation',
  },
  features = [
    { icon: <Shield className="h-4 w-4" />, text: 'TypeScript' },
    { icon: <Zap className="h-4 w-4" />, text: 'Lightning Fast' },
    { icon: <Users className="h-4 w-4" />, text: 'Developer First' },
  ]
}: HeroSectionProps) {
  return (
    <section className={`py-20 px-4 ${className}`}>
      <div className="text-center space-y-8 max-w-4xl mx-auto">
        <div className="space-y-4">
          {badge && (
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20">
              {badge.icon}
              <span className="ml-2">{badge.text}</span>
            </div>
          )}
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            {title}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="gap-2">
            {primaryAction.text}
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="lg">
            {secondaryAction.text}
          </Button>
        </div>

        {features && features.length > 0 && (
          <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-1">
                {feature.icon}
                {feature.text}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}