import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentDir = path.join(process.cwd(), "content");

export interface PostMeta {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  author?: string;
  featuredImage?: string;
  category?: string;
  tags?: string[];
}

export interface ToolMeta {
  slug: string;
  name: string;
  description: string;
  rating: number;
  affiliateUrl: string;
  pricing: string;
  featuredImage?: string;
  pros?: string[];
  cons?: string[];
}

export interface ReviewMeta extends ToolMeta {
  verdict: string;
  publishedAt: string;
}

export interface ComparisonMeta {
  slug: string;
  title: string;
  description: string;
  tools: string[];
  publishedAt: string;
  winner?: string;
}

function getContentFiles(type: string): string[] {
  const dir = path.join(contentDir, type);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));
}

export function getAllPosts(): PostMeta[] {
  const files = getContentFiles("blog");
  return files
    .map((filename) => {
      const filePath = path.join(contentDir, "blog", filename);
      const source = fs.readFileSync(filePath, "utf8");
      const { data } = matter(source);
      return {
        slug: filename.replace(/\.mdx$/, ""),
        ...data,
      } as PostMeta;
    })
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
}

export function getPost(slug: string): { meta: PostMeta; content: string } | null {
  const filePath = path.join(contentDir, "blog", `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const source = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(source);
  return {
    meta: { slug, ...data } as PostMeta,
    content,
  };
}

export function getAllTools(): ToolMeta[] {
  const files = getContentFiles("tools");
  return files.map((filename) => {
    const filePath = path.join(contentDir, "tools", filename);
    const source = fs.readFileSync(filePath, "utf8");
    const { data } = matter(source);
    return {
      slug: filename.replace(/\.mdx$/, ""),
      ...data,
    } as ToolMeta;
  });
}

export function getTool(slug: string): { meta: ToolMeta; content: string } | null {
  const filePath = path.join(contentDir, "tools", `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const source = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(source);
  return {
    meta: { slug, ...data } as ToolMeta,
    content,
  };
}

export function getAllReviews(): ReviewMeta[] {
  const files = getContentFiles("reviews");
  return files.map((filename) => {
    const filePath = path.join(contentDir, "reviews", filename);
    const source = fs.readFileSync(filePath, "utf8");
    const { data } = matter(source);
    return {
      slug: filename.replace(/\.mdx$/, ""),
      ...data,
    } as ReviewMeta;
  });
}

export function getReview(slug: string): { meta: ReviewMeta; content: string } | null {
  const filePath = path.join(contentDir, "reviews", `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const source = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(source);
  return {
    meta: { slug, ...data } as ReviewMeta,
    content,
  };
}

export function getAllComparisons(): ComparisonMeta[] {
  const files = getContentFiles("comparisons");
  return files.map((filename) => {
    const filePath = path.join(contentDir, "comparisons", filename);
    const source = fs.readFileSync(filePath, "utf8");
    const { data } = matter(source);
    return {
      slug: filename.replace(/\.mdx$/, ""),
      ...data,
    } as ComparisonMeta;
  });
}

export function getComparison(
  slug: string
): { meta: ComparisonMeta; content: string } | null {
  const filePath = path.join(contentDir, "comparisons", `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const source = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(source);
  return {
    meta: { slug, ...data } as ComparisonMeta,
    content,
  };
}

export function getCategories(): string[] {
  const posts = getAllPosts();
  const categories = new Set(posts.map((p) => p.category).filter(Boolean));
  return Array.from(categories) as string[];
}

export function getPostsByCategory(category: string): PostMeta[] {
  return getAllPosts().filter((p) => p.category === category);
}
