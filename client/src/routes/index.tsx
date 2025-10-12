import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import type { UsersResponse } from "@/services/user.service";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { userService } from "@/services/user.service";
import { ArrowRight, FileCode, Sparkles, Zap } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [data, setData] = useState<UsersResponse | undefined>();

  const { mutate: sendRequest } = useMutation({
    mutationFn: async () => {
      return await userService.getUsers();
    },
    onSuccess: (res) => {
      setData(res);
    },
    onError: (err) => {
      console.error("Request error:", err);
    },
  });

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center p-8">
      {/* Animated Mesh Background */}
      <div className="absolute inset-0 bg-[image:var(--gradient-mesh)] animate-gradient" style={{ backgroundSize: "200% 200%" }} />
      <div className="absolute inset-0 bg-background/95 backdrop-blur-3xl" />
      
      {/* Floating Orbs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "0s" }} />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
      
      <main className="relative max-w-4xl w-full text-center space-y-8 animate-fade-in z-10">
        {/* Logo/Title */}
        <div className="space-y-6">          
          <div className="inline-block">
            <h1 className="text-7xl md:text-8xl font-bold bg-gradient-to-br from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient pb-2" style={{ backgroundSize: "200% 200%" }}>
              Fullstack Starter
            </h1>
          </div>
          
          <div className="flex items-center justify-center gap-3 text-sm">
            <div className="px-3 py-1.5 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 font-mono text-foreground hover:border-primary/50 transition-all hover:scale-105">
              Bun
            </div>
            <Zap className="w-4 h-4 text-primary" />
            <div className="px-3 py-1.5 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 font-mono text-foreground hover:border-primary/50 transition-all hover:scale-105">
              Hono
            </div>
            <Zap className="w-4 h-4 text-primary" />
            <div className="px-3 py-1.5 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 font-mono text-foreground hover:border-primary/50 transition-all hover:scale-105">
              React
            </div>
            <Zap className="w-4 h-4 text-primary" />
            <div className="px-3 py-1.5 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 font-mono text-foreground hover:border-primary/50 transition-all hover:scale-105">
              Vite
            </div>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="space-y-6 pt-12">
          <h2 className="text-2xl font-semibold text-foreground/90 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            Get started by editing
          </h2>
          <div className="relative group inline-block animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-500" />
            <div className="relative flex items-center gap-3 px-8 py-4 bg-card/80 backdrop-blur-xl border border-border/50 rounded-xl font-mono text-base text-foreground shadow-card">
              <FileCode className="w-5 h-5 text-primary" />
              <span className="font-medium">client/src/route/index.ts</span>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid md:grid-cols-2 gap-5 pt-12">
          <a
            href="https://bun.sh/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative p-6 bg-card/40 backdrop-blur-xl border border-border/50 rounded-2xl hover:border-primary/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-glow animate-slide-in"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex items-start justify-between">
              <div className="text-left space-y-2">
                <h3 className="font-semibold text-foreground text-lg">Bun Docs</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Learn about Bun runtime and tooling
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
            </div>
          </a>

          <a
            href="https://hono.dev/"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative p-6 bg-card/40 backdrop-blur-xl border border-border/50 rounded-2xl hover:border-primary/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-glow animate-slide-in"
            style={{ animationDelay: "0.5s" }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex items-start justify-between">
              <div className="text-left space-y-2">
                <h3 className="font-semibold text-foreground text-lg">Hono Docs</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Explore the ultrafast web framework
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
            </div>
          </a>

          <a
            href="https://react.dev/"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative p-6 bg-card/40 backdrop-blur-xl border border-border/50 rounded-2xl hover:border-primary/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-glow animate-slide-in"
            style={{ animationDelay: "0.6s" }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex items-start justify-between">
              <div className="text-left space-y-2">
                <h3 className="font-semibold text-foreground text-lg">React Docs</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Build modern user interfaces
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
            </div>
          </a>

          <a
            href="https://vite.dev/"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative p-6 bg-card/40 backdrop-blur-xl border border-border/50 rounded-2xl hover:border-primary/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-glow animate-slide-in"
            style={{ animationDelay: "0.7s" }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex items-start justify-between">
              <div className="text-left space-y-2">
                <h3 className="font-semibold text-foreground text-lg">Vite Docs</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Next generation frontend tooling
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
            </div>
          </a>
        </div>
      </main>
    </div>
  );
}

export default Index;
