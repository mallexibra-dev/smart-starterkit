import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Code, Database, Zap, Globe, Shield, Rocket, Star, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContainerLayout } from "@/components/layout/container-layout";

function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
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
            <Link to="/docs" className="text-sm font-medium hover:text-primary transition-colors">
              Documentation
            </Link>
            <Button variant="outline" size="sm">Get Started</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <ContainerLayout title="">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <div className="space-y-4">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20">
                <Star className="h-4 w-4 mr-2" />
                Production-Ready Framework
              </div>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
                Build Amazing Apps
                <span className="block text-primary">Faster Than Ever</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                A modern TypeScript fullstack starterkit with React, Hono, and PostgreSQL.
                Ship your next project in minutes, not months.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="gap-2">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg">
                View Documentation
              </Button>
            </div>

            <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Shield className="h-4 w-4" />
                TypeScript
              </div>
              <div className="flex items-center gap-1">
                <Zap className="h-4 w-4" />
                Lightning Fast
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                Developer First
              </div>
            </div>
          </div>
        </ContainerLayout>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-muted/50">
        <ContainerLayout title="">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built with modern tools and best practices to help you build production-ready applications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-background p-8 rounded-xl border shadow-sm">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-6">
                <Code className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Modern Frontend</h3>
              <p className="text-muted-foreground mb-4">
                React 19 with Vite, Tailwind CSS, and shadcn/ui components for beautiful, responsive interfaces.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• TypeScript with strict mode</li>
                <li>• TanStack Router for routing</li>
                <li>• React Hook Form + Zod</li>
              </ul>
            </div>

            <div className="bg-background p-8 rounded-xl border shadow-sm">
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-6">
                <Database className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Powerful Backend</h3>
              <p className="text-muted-foreground mb-4">
                Hono framework with PostgreSQL and Drizzle ORM for scalable, type-safe database operations.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• PostgreSQL with Drizzle ORM</li>
                <li>• OpenAPI documentation</li>
                <li>• Built-in validation</li>
              </ul>
            </div>

            <div className="bg-background p-8 rounded-xl border shadow-sm">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-6">
                <Zap className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Developer Experience</h3>
              <p className="text-muted-foreground mb-4">
                Hot reload, TypeScript strict mode, and comprehensive tooling for productive development.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Bun runtime for speed</li>
                <li>• ESLint + Prettier</li>
                <li>• Docker support</li>
              </ul>
            </div>

            <div className="bg-background p-8 rounded-xl border shadow-sm">
              <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center mb-6">
                <Globe className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Monorepo Ready</h3>
              <p className="text-muted-foreground mb-4">
                Organized workspace structure with shared types and utilities across frontend and backend.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Turbo for build orchestration</li>
                <li>• Shared TypeScript types</li>
                <li>• Workspace dependencies</li>
              </ul>
            </div>

            <div className="bg-background p-8 rounded-xl border shadow-sm">
              <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center mb-6">
                <Shield className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Production Ready</h3>
              <p className="text-muted-foreground mb-4">
                Built with security, performance, and scalability in mind. Deploy with confidence.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Environment-based config</li>
                <li>• Error handling</li>
                <li>• Logging & monitoring</li>
              </ul>
            </div>

            <div className="bg-background p-8 rounded-xl border shadow-sm">
              <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center mb-6">
                <Clock className="h-6 w-6 text-cyan-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Start Fast</h3>
              <p className="text-muted-foreground mb-4">
                Get up and running in minutes with our comprehensive setup guide and templates.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• One-command setup</li>
                <li>• Database migrations</li>
                <li>• Development scripts</li>
              </ul>
            </div>
          </div>
        </ContainerLayout>
      </section>

      {/* Blog Preview Section */}
      <section className="py-20 px-4">
        <ContainerLayout title="">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Latest from the Blog
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Tips, tutorials, and insights on modern web development with our stack.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
            <article className="group cursor-pointer">
              <div className="aspect-[16/9] bg-muted rounded-lg mb-4 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 opacity-20"></div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Nov 15, 2024</div>
                <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                  Getting Started with TypeScript in 2024
                </h3>
                <p className="text-muted-foreground">
                  Learn the best practices and latest features for building type-safe applications.
                </p>
              </div>
            </article>

            <article className="group cursor-pointer">
              <div className="aspect-[16/9] bg-muted rounded-lg mb-4 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-green-500 to-cyan-600 opacity-20"></div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Nov 10, 2024</div>
                <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                  Building REST APIs with Hono
                </h3>
                <p className="text-muted-foreground">
                  Discover how to create fast, type-safe APIs using the modern Hono framework.
                </p>
              </div>
            </article>

            <article className="group cursor-pointer">
              <div className="aspect-[16/9] bg-muted rounded-lg mb-4 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-orange-500 to-red-600 opacity-20"></div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Nov 5, 2024</div>
                <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                  PostgreSQL Best Practices
                </h3>
                <p className="text-muted-foreground">
                  Essential tips for designing and optimizing PostgreSQL databases for modern apps.
                </p>
              </div>
            </article>
          </div>

          <div className="text-center">
            <Button variant="outline" size="lg" asChild>
              <Link to="/blog">View All Posts</Link>
            </Button>
          </div>
        </ContainerLayout>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <ContainerLayout title="">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Build Something Amazing?
            </h2>
            <p className="text-xl opacity-90">
              Join thousands of developers building production-ready applications with Smart Starterkit.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="gap-2">
                Get Started on GitHub <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="border-current text-current hover:bg-current hover:text-primary">
                View Documentation
              </Button>
            </div>
          </div>
        </ContainerLayout>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/50 py-12 px-4">
        <ContainerLayout title="">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Rocket className="h-6 w-6 text-primary" />
                <span className="font-bold text-xl">Smart Starterkit</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Production-ready TypeScript fullstack starterkit for modern web applications.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/features" className="hover:text-foreground">Features</Link></li>
                <li><Link to="/docs" className="hover:text-foreground">Documentation</Link></li>
                <li><Link to="/blog" className="hover:text-foreground">Blog</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/tutorials" className="hover:text-foreground">Tutorials</Link></li>
                <li><Link to="/examples" className="hover:text-foreground">Examples</Link></li>
                <li><Link to="/support" className="hover:text-foreground">Support</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Community</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">GitHub</a></li>
                <li><a href="#" className="hover:text-foreground">Discord</a></li>
                <li><a href="#" className="hover:text-foreground">Twitter</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Smart Starterkit. Built with ❤️ using modern web technologies.</p>
          </div>
        </ContainerLayout>
      </footer>
    </div>
  );
}

export const Route = createFileRoute("/")({
  component: Index,
});