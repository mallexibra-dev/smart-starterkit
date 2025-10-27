import { createFileRoute, Link, notFound } from '@tanstack/react-router';
import { getPostBySlug, getAllPosts, type BlogPost } from '@/lib/blog';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import { Clock, Calendar, User, ArrowLeft, Share2, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ContainerLayout } from '@/components/layout/container-layout';
import { useState, useEffect } from 'react';
import 'highlight.js/styles/github-dark.css';

function BlogPostPage() {
  const { slug } = Route.useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPost() {
      try {
        const [postData, allPosts] = await Promise.all([
          getPostBySlug(slug),
          getAllPosts()
        ]);

        if (!postData) {
          throw notFound();
        }

        setPost(postData);

        // Get related posts (same tags, exclude current)
        const related = allPosts
          .filter(p =>
            p.slug !== slug &&
            p.tags.some(tag => postData.tags.includes(tag))
          )
          .slice(0, 3);

        setRelatedPosts(related);
      } catch (error) {
        console.error('Error loading post:', error);
        throw notFound();
      } finally {
        setLoading(false);
      }
    }

    loadPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <section className="py-16 px-4">
          <ContainerLayout title="">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold">Loading post...</h1>
            </div>
          </ContainerLayout>
        </section>
      </div>
    );
  }

  if (!post) {
    throw notFound();
  }

  // Generate table of contents from markdown
  const generateTableOfContents = (content: string) => {
    const headings = content.match(/^###?\s+(.+)$/gm) || [];
    return headings.map(heading => {
      const level = heading.startsWith('###') ? 3 : 2;
      const title = heading.replace(/^###?\s+/, '');
      const id = title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
      return { level, title, id };
    });
  };

  const tableOfContents = generateTableOfContents(post.content);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-16 px-4">
        <ContainerLayout title="">
          <div className="max-w-4xl mx-auto">
            <Link to="/blog">
              <Button variant="ghost" className="gap-2 mb-8">
                <ArrowLeft className="h-4 w-4" />
                Back to Blog
              </Button>
            </Link>

            <article className="space-y-8">
              {/* Post Header */}
              <header className="space-y-6">
                {post.coverImage && (
                  <div className="aspect-[16/9] rounded-xl overflow-hidden">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map(tag => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                    {post.title}
                  </h1>

                  <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <time dateTime={post.publishedAt}>
                        {format(new Date(post.publishedAt), 'MMMM dd, yyyy')}
                      </time>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{post.readingTime} min read</span>
                    </div>
                  </div>
                </div>
              </header>

              {/* Table of Contents */}
              {tableOfContents.length > 0 && (
                <nav className="bg-muted/30 rounded-lg p-6 sticky top-24">
                  <h3 className="font-semibold mb-4">Table of Contents</h3>
                  <ul className="space-y-2">
                    {tableOfContents.map(item => (
                      <li key={item.id} className={item.level === 3 ? 'ml-4' : ''}>
                        <a
                          href={`#${item.id}`}
                          className="text-muted-foreground hover:text-primary transition-colors text-sm"
                        >
                          {item.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              )}

              {/* Post Content */}
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight, rehypeRaw]}
                  components={{
                    h2: ({ children, ...props }) => (
                      <h2
                        id={String(children).toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')}
                        className="text-3xl font-bold mt-12 mb-6 scroll-mt-24"
                        {...props}
                      >
                        {children}
                      </h2>
                    ),
                    h3: ({ children, ...props }) => (
                      <h3
                        id={String(children).toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')}
                        className="text-2xl font-semibold mt-8 mb-4 scroll-mt-24"
                        {...props}
                      >
                        {children}
                      </h3>
                    ),
                    p: ({ children, ...props }) => (
                      <p className="text-lg leading-relaxed mb-6" {...props}>
                        {children}
                      </p>
                    ),
                    code: ({ inline, children, ...props }) => (
                      inline ? (
                        <code className="bg-muted px-2 py-1 rounded text-sm font-mono" {...props}>
                          {children}
                        </code>
                      ) : (
                        <code className="block bg-muted p-4 rounded-lg overflow-x-auto text-sm font-mono" {...props}>
                          {children}
                        </code>
                      )
                    ),
                    pre: ({ children, ...props }) => (
                      <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-6" {...props}>
                        {children}
                      </pre>
                    ),
                    blockquote: ({ children, ...props }) => (
                      <blockquote className="border-l-4 border-primary pl-6 italic text-muted-foreground my-6" {...props}>
                        {children}
                      </blockquote>
                    ),
                    ul: ({ children, ...props }) => (
                      <ul className="list-disc pl-6 mb-6 space-y-2" {...props}>
                        {children}
                      </ul>
                    ),
                    ol: ({ children, ...props }) => (
                      <ol className="list-decimal pl-6 mb-6 space-y-2" {...props}>
                        {children}
                      </ol>
                    ),
                    a: ({ href, children, ...props }) => (
                      <a
                        href={href}
                        className="text-primary hover:underline"
                        target={href?.startsWith('http') ? '_blank' : undefined}
                        rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                        {...props}
                      >
                        {children}
                      </a>
                    ),
                  }}
                >
                  {post.content}
                </ReactMarkdown>
              </div>

              {/* Post Footer */}
              <footer className="border-t pt-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Share2 className="h-4 w-4" />
                      Share
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Heart className="h-4 w-4" />
                      Like
                    </Button>
                  </div>
                </div>

                {post.updatedAt && (
                  <div className="text-sm text-muted-foreground">
                    Last updated: {format(new Date(post.updatedAt), 'MMMM dd, yyyy')}
                  </div>
                )}
              </footer>
            </article>
          </div>
        </ContainerLayout>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-16 px-4 bg-muted/30">
          <ContainerLayout title="">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">Related Posts</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedPosts.map(relatedPost => (
                  <article
                    key={relatedPost.slug}
                    className="group bg-background border rounded-lg p-6 hover:shadow-lg transition-all duration-200"
                  >
                    <Link to="/blog/$slug" params={{ slug: relatedPost.slug }}>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {format(new Date(relatedPost.publishedAt), 'MMM dd, yyyy')}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {relatedPost.readingTime} min
                          </div>
                        </div>

                        <h3 className="text-lg font-semibold group-hover:text-primary transition-colors line-clamp-2">
                          {relatedPost.title}
                        </h3>

                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {relatedPost.excerpt}
                        </p>

                        {relatedPost.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {relatedPost.tags.slice(0, 2).map(tag => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          </ContainerLayout>
        </section>
      )}
    </div>
  );
}

export const Route = createFileRoute('/blog/$slug')({
  component: BlogPostPage,
});