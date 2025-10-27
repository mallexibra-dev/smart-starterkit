import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  gradient?: string;
}

export interface BlogPreviewProps {
  className?: string;
  title: string;
  subtitle: string;
  posts: BlogPost[];
  viewAllLink?: string;
  viewAllText?: string;
}

export function BlogPreview({
  className,
  title,
  subtitle,
  posts,
  viewAllLink = '/blog',
  viewAllText = 'View All Posts'
}: BlogPreviewProps) {
  return (
    <section className={`py-20 px-4 ${className}`}>
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          {title}
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
        {posts.map((post) => (
          <article key={post.id} className="group cursor-pointer">
            <div className="aspect-[16/9] bg-muted rounded-lg mb-4 overflow-hidden">
              <div
                className={`w-full h-full ${post.gradient || 'bg-gradient-to-br from-blue-500 to-purple-600'} opacity-20`}
              />
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">{post.date}</div>
              <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                {post.title}
              </h3>
              <p className="text-muted-foreground">
                {post.excerpt}
              </p>
            </div>
          </article>
        ))}
      </div>

      <div className="text-center">
        <Button variant="outline" size="lg" asChild>
          <Link to={viewAllLink}>{viewAllText}</Link>
        </Button>
      </div>
    </section>
  );
}