import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface CTASectionProps {
  className?: string;
  title: string;
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
  backgroundVariant?: 'primary' | 'secondary' | 'muted';
}

export function CTASection({
  className,
  title,
  subtitle,
  primaryAction = {
    text: 'Get Started',
  },
  secondaryAction = {
    text: 'View Documentation',
  },
  backgroundVariant = 'primary'
}: CTASectionProps) {
  const backgroundClasses = {
    primary: 'bg-primary text-primary-foreground',
    secondary: 'bg-secondary text-secondary-foreground',
    muted: 'bg-muted text-muted-foreground'
  };

  return (
    <section className={`py-20 px-4 ${backgroundClasses[backgroundVariant]} ${className}`}>
      <div className="text-center space-y-6 max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold">
          {title}
        </h2>
        <p className="text-xl opacity-90">
          {subtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            variant={backgroundVariant === 'primary' ? 'secondary' : 'default'}
            className="gap-2"
          >
            {primaryAction.text}
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className={backgroundVariant === 'primary'
              ? 'border-current text-current hover:bg-current hover:text-primary'
              : ''
            }
          >
            {secondaryAction.text}
          </Button>
        </div>
      </div>
    </section>
  );
}