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
    <section className={`py-20 px-4 ${backgroundClasses[backgroundVariant]} relative overflow-hidden ${className}`}>
      {/* Subtle background pattern/shadow */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
      <div className="absolute inset-0" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 1px)`,
        backgroundSize: '40px 40px'
      }} />

      <div className="text-center space-y-6 max-w-3xl mx-auto relative z-10">
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
            className="gap-2 bg-white text-primary hover:bg-gray-50 hover:text-primary border-0 shadow-sm hover:shadow-md hover:-translate-y-px transition-all duration-200 backdrop-blur-sm bg-white/95"
          >
            {primaryAction.text}
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className={backgroundVariant === 'primary'
              ? 'border-white/70 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 hover:border-white hover:text-white hover:shadow-sm hover:-translate-y-px transition-all duration-200'
              : 'border-2 border-white/30 bg-white/5 backdrop-blur-sm text-white hover:bg-white/10 hover:border-white/50 hover:shadow-sm hover:-translate-y-px transition-all duration-200'
            }
          >
            {secondaryAction.text}
          </Button>
        </div>
      </div>
    </section>
  );
}