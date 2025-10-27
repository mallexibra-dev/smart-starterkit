import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { TableOfContentsProps } from './table-of-contents.types';

export function TableOfContents({ items, className }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0% -70% 0%',
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    }, observerOptions);

    // Observe all heading elements
    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      items.forEach((item) => {
        const element = document.getElementById(item.id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [items]);

  const handleClick = (id: string) => {
    setActiveId(id);
    setIsMobileOpen(false);

    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Adjust for sticky header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <>
      {/* Mobile toggle button */}
      <div className="md:hidden sticky top-20 z-40 mb-4">
        <Button
          variant="outline"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="w-full justify-start gap-2"
        >
          {isMobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          Table of Contents
        </Button>
      </div>

      {/* Desktop and mobile content */}
      <div className={cn(
        "md:sticky md:top-24",
        isMobileOpen ? "block" : "hidden md:block",
        className
      )}>
        <Card className="bg-gradient-to-br from-background to-muted/20 border-primary/10 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <div className="w-2 h-6 bg-gradient-to-b from-primary to-primary/50 rounded-full" />
              Contents
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ScrollArea className="h-[calc(100vh-200px)] max-h-[400px]">
              <nav className="space-y-1">
                {items.map((item) => {
                  const isActive = activeId === item.id;
                  const levelClass = item.level === 3 ? 'ml-4' : '';

                  return (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleClick(item.id);
                      }}
                      className={cn(
                        "block py-2 px-3 text-sm rounded-md transition-all duration-200",
                        levelClass,
                        isActive
                          ? "bg-primary/10 text-primary font-medium border-l-2 border-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50 border-l-2 border-transparent"
                      )}
                    >
                      <span className="line-clamp-2">{item.title}</span>
                    </a>
                  );
                })}
              </nav>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </>
  );
}