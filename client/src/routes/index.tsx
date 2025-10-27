import { createFileRoute } from "@tanstack/react-router";
import { Code, Database, Zap, Globe, Shield, Clock } from "lucide-react";
import { Navigation, HeroSection, FeaturesGrid, CTASection, Footer } from "@/components/blocks/landing";
import { ThemeProvider } from "@/components/theme-provider";

function Index() {
  // Define features data
  const features = [
    {
      icon: Code,
      title: "Modern Frontend",
      description: "React 19 with Vite, Tailwind CSS, and shadcn/ui components for beautiful, responsive interfaces.",
      features: [
        "TypeScript with strict mode",
        "TanStack Router for routing",
        "React Hook Form + Zod"
      ],
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-600"
    },
    {
      icon: Database,
      title: "Powerful Backend",
      description: "Hono framework with PostgreSQL and Drizzle ORM for scalable, type-safe database operations.",
      features: [
        "PostgreSQL with Drizzle ORM",
        "OpenAPI documentation",
        "Built-in validation"
      ],
      iconBg: "bg-green-500/10",
      iconColor: "text-green-600"
    },
    {
      icon: Zap,
      title: "Developer Experience",
      description: "Hot reload, TypeScript strict mode, and comprehensive tooling for productive development.",
      features: [
        "Bun runtime for speed",
        "ESLint + Prettier",
        "Docker support"
      ],
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-600"
    },
    {
      icon: Globe,
      title: "Monorepo Ready",
      description: "Organized workspace structure with shared types and utilities across frontend and backend.",
      features: [
        "Turbo for build orchestration",
        "Shared TypeScript types",
        "Workspace dependencies"
      ],
      iconBg: "bg-orange-500/10",
      iconColor: "text-orange-600"
    },
    {
      icon: Shield,
      title: "Production Ready",
      description: "Built with security, performance, and scalability in mind. Deploy with confidence.",
      features: [
        "Environment-based config",
        "Error handling",
        "Logging & monitoring"
      ],
      iconBg: "bg-red-500/10",
      iconColor: "text-red-600"
    },
    {
      icon: Clock,
      title: "Start Fast",
      description: "Get up and running in minutes with our comprehensive setup guide and templates.",
      features: [
        "One-command setup",
        "Database migrations",
        "Development scripts"
      ],
      iconBg: "bg-cyan-500/10",
      iconColor: "text-cyan-600"
    }
  ];

  // Define footer sections
  const footerSections = [
    {
      title: "Product",
      links: [
        { label: "Features", href: "/features" },
        { label: "Documentation", href: "/docs" }
      ]
    },
    {
      title: "Resources",
      links: [
        { label: "Tutorials", href: "/tutorials" },
        { label: "Examples", href: "/examples" },
        { label: "Support", href: "/support" }
      ]
    },
    {
      title: "Community",
      links: [
        { label: "GitHub", href: "#", external: true },
        { label: "Discord", href: "#", external: true },
        { label: "Twitter", href: "#", external: true }
      ]
    }
  ];

  return (
    <ThemeProvider defaultTheme="system" storageKey="smart-starterkit-ui-theme">
      <>
        {/* Navigation (Fixed) */}
        <Navigation />

        {/* Subtle page background gradient */}
        <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 opacity-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900" />
        <div className="fixed inset-0 bg-gradient-to-tr from-indigo-100/20 via-transparent to-pink-100/20 dark:from-blue-900/20 dark:via-transparent dark:to-purple-900/20" />
        <div className="fixed inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.05) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.05) 0%, transparent 50%)`
        }} />

        {/* Main content */}
        <div className="min-h-screen bg-background relative pt-16">
          <div className="relative z-10">
            <HeroSection
              title={
                <>
                  Build Amazing Apps
                  <span className="block text-primary">Faster Than Ever</span>
                </>
              }
              subtitle="A modern TypeScript fullstack starterkit with React, Hono, and PostgreSQL. Ship your next project in minutes, not months."
              primaryAction={{ text: "Get Started" }}
              secondaryAction={{ text: "View Documentation" }}
            />

            <FeaturesGrid
              title="Everything You Need to Succeed"
              subtitle="Built with modern tools and best practices to help you build production-ready applications."
              features={features}
            />

            <CTASection
              title="Ready to Build Something Amazing?"
              subtitle="Join thousands of developers building production-ready applications with Smart Starterkit."
              primaryAction={{ text: "Get Started on GitHub" }}
              secondaryAction={{ text: "View Documentation" }}
            />

            <Footer sections={footerSections} />
          </div>
        </div>
      </>
    </ThemeProvider>
  );
}

export const Route = createFileRoute("/")({
  component: Index,
});