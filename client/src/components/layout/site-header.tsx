"use client";

import * as React from "react";
import { Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface SiteHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
}

export function SiteHeader({
  className,
  title = "Smart Starterkit",
  description,
  ...props
}: SiteHeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className,
      )}
      {...props}
    >
      <div className="container flex h-14 items-center">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 font-semibold">
            <Home className="h-5 w-5" />
            <span>{title}</span>
          </div>
          {description && (
            <span className="text-sm text-muted-foreground hidden lg:inline">
              {description}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
