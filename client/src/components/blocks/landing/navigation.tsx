import { Link } from '@tanstack/react-router';
import { Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface NavigationProps {
  className?: string;
}

export function Navigation({ className }: NavigationProps) {
  return (
    <nav className={className}>
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Rocket className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">Smart Starterkit</span>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/blog" className="text-sm font-medium hover:text-primary transition-colors">
              Blog
            </Link>
            <a href="/docs" className="text-sm font-medium hover:text-primary transition-colors">
              Documentation
            </a>
            <Button variant="outline" size="sm">Get Started</Button>
          </div>
        </div>
      </div>
    </nav>
  );
}