import matter from 'gray-matter';

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  updatedAt?: string;
  tags: string[];
  coverImage?: string;
  readingTime: number;
}

// Cache for posts to avoid reprocessing
let postsCache: BlogPost[] | null = null;

// Get all blog posts using Vite's import.meta.glob
export async function getAllPosts(): Promise<BlogPost[]> {
  if (postsCache) {
    return postsCache;
  }

  try {
    const modules = import.meta.glob('/content/blog/*.md', { as: 'raw' });

    const posts: BlogPost[] = await Promise.all(
      Object.entries(modules).map(async ([path, loader]) => {
        const slug = path.split('/').pop()?.replace('.md', '') || '';
        const fileContents = await loader();
        const { data, content } = matter(fileContents);

        // Calculate reading time (average 200 words per minute)
        const wordsPerMinute = 200;
        const words = content.trim().split(/\s+/).length;
        const readingTime = Math.ceil(words / wordsPerMinute);

        return {
          slug,
          title: data.title || slug,
          excerpt: data.excerpt || content.slice(0, 160) + '...',
          content,
          author: data.author || 'Anonymous',
          publishedAt: data.publishedAt || new Date().toISOString(),
          updatedAt: data.updatedAt,
          tags: data.tags || [],
          coverImage: data.coverImage,
          readingTime,
        };
      })
    );

    // Sort by date (newest first)
    postsCache = posts.sort((a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

    return postsCache;
  } catch (error) {
    console.error('Error reading blog posts:', error);
    return [];
  }
}

// Get a single blog post by slug
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const modules = import.meta.glob('/content/blog/*.md', { as: 'raw' });
    const path = `/content/blog/${slug}.md`;

    if (!(path in modules)) {
      return null;
    }

    const fileContents = await modules[path]();
    const { data, content } = matter(fileContents);

    // Calculate reading time
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    const readingTime = Math.ceil(words / wordsPerMinute);

    return {
      slug,
      title: data.title || slug,
      excerpt: data.excerpt || content.slice(0, 160) + '...',
      content,
      author: data.author || 'Anonymous',
      publishedAt: data.publishedAt || new Date().toISOString(),
      updatedAt: data.updatedAt,
      tags: data.tags || [],
      coverImage: data.coverImage,
      readingTime,
    };
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error);
    return null;
  }
}

// Get posts by tag
export async function getPostsByTag(tag: string): Promise<BlogPost[]> {
  const posts = await getAllPosts();
  return posts.filter(post =>
    post.tags.some(postTag =>
      postTag.toLowerCase() === tag.toLowerCase()
    )
  );
}

// Get all unique tags
export async function getAllTags(): Promise<string[]> {
  const posts = await getAllPosts();
  const tags = new Set<string>();

  posts.forEach(post => {
    post.tags.forEach(tag => tags.add(tag));
  });

  return Array.from(tags).sort();
}