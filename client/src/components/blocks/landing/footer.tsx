import { Link } from '@tanstack/react-router';
import { Rocket } from 'lucide-react';

export interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

export interface FooterProps {
  className?: string;
  brand?: {
    name: string;
    description: string;
    icon?: React.ReactNode;
  };
  sections: FooterSection[];
  copyright?: string;
}

export function Footer({
  className,
  brand = {
    name: 'Smart Starterkit',
    description: 'Production-ready TypeScript fullstack starterkit for modern web applications.',
    icon: <Rocket className="h-6 w-6 text-primary" />
  },
  sections,
  copyright = '© 2024 Smart Starterkit. Built with ❤️ using modern web technologies.'
}: FooterProps) {
  return (
    <footer className={`border-t bg-muted/50 py-12 px-4 ${className}`}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              {brand.icon}
              <span className="font-bold text-xl">{brand.name}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {brand.description}
            </p>
          </div>

          {sections.map((section, index) => (
            <div key={index}>
              <h4 className="font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    {link.external ? (
                      <a
                        href={link.href}
                        className="hover:text-foreground transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        className="hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>{copyright}</p>
        </div>
      </div>
    </footer>
  );
}