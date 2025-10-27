import { createFileRoute, Link } from '@tanstack/react-router';
import { getAllPosts, getAllTags, type BlogPost } from '@/lib/blog';
import { format } from 'date-fns';
import { Clock, Calendar, User, Tag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ContainerLayout } from '@/components/layout/container-layout';
import { useState, useMemo, useEffect } from 'react';

function BlogPage() {
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    async function loadData() {
      try {
        const [posts, tags] = await Promise.all([
          getAllPosts(),
          getAllTags()
        ]);
        setAllPosts(posts);
        setAllTags(tags);
      } catch (error) {
        console.error('Error loading blog data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const filteredPosts = useMemo(() => {
    return allPosts.filter(post => {
      const matchesTag = !selectedTag || post.tags.includes(selectedTag);
      const matchesSearch = !searchTerm ||
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesTag && matchesSearch;
    });
  }, [allPosts, selectedTag, searchTerm]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <section className="py-16 px-4 bg-muted/30">
          <ContainerLayout title="">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold">Loading...</h1>
            </div>
          </ContainerLayout>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-16 px-4 bg-muted/30">
        <ContainerLayout title="">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold">
              Blog & Insights
            </h1>
            <p className="text-xl text-muted-foreground">
              Tips, tutorials, and insights on modern web development, TypeScript, React, and building amazing products.
            </p>
          </div>
        </ContainerLayout>
      </section>

      {/* Search and Filter */}
      <section className="py-8 px-4 border-b">
        <ContainerLayout title="">
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={!selectedTag ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTag('')}
                >
                  All Posts
                </Button>
                {allTags.map(tag => (
                  <Button
                    key={tag}
                    variant={selectedTag === tag ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTag(tag)}
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            </div>

            {filteredPosts.length !== allPosts.length && (
              <div className="text-sm text-muted-foreground">
                Showing {filteredPosts.length} of {allPosts.length} posts
              </div>
            )}
          </div>
        </ContainerLayout>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16 px-4">
        <ContainerLayout title="">
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {filteredPosts.map(post => (
                <article
                  key={post.slug}
                  className="group bg-background border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer"
                >
                  <Link to="/blog/$slug" params={{ slug: post.slug }}>
                    {post.coverImage ? (
                      <div className="aspect-[16/9] overflow-hidden">
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      </div>
                    ) : (
                      <div className="aspect-[16/9] bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                        <div className="text-4xl font-bold text-primary/30">
                          {post.title.charAt(0)}
                        </div>
                      </div>
                    )}

                    <div className="p-6 space-y-4">
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {format(new Date(post.publishedAt), 'MMM dd, yyyy')}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {post.readingTime} min read
                        </div>
                      </div>

                      <h3 className="text-xl font-semibold group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h3>

                      <p className="text-muted-foreground line-clamp-3">
                        {post.excerpt}
                      </p>

                      {post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {post.tags.slice(0, 3).map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {post.tags.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{post.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <User className="h-4 w-4" />
                          {post.author}
                        </div>
                        <div className="flex items-center gap-1 text-primary group-hover:gap-2 transition-all">
                          <span className="text-sm font-medium">Read more</span>
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 max-w-2xl mx-auto">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-2xl font-semibold mb-2">No posts found</h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm || selectedTag
                  ? "Try adjusting your search or filter criteria"
                  : "No blog posts available yet. Check back soon!"}
              </p>
              {(searchTerm || selectedTag) && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedTag('');
                  }}
                >
                  Clear filters
                </Button>
              )}
            </div>
          )}
        </ContainerLayout>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 px-4 bg-muted/30">
        <ContainerLayout title="">
          <div className="text-center space-y-6 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold">
              Stay Updated
            </h2>
            <p className="text-lg text-muted-foreground">
              Get the latest posts and updates delivered straight to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input placeholder="Enter your email" className="flex-1" />
              <Button>Subscribe</Button>
            </div>
          </div>
        </ContainerLayout>
      </section>
    </div>
  );
}

export const Route = createFileRoute('/blog')({
  component: BlogPage,
});