import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { getAllPosts } from "../../lib/content";

export const metadata: Metadata = {
  title: "Blog - GMB SEO Tools",
  description:
    "Tips, guides, and insights about Google My Business SEO tools and strategies.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="bg-white">
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white">Blog</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">
            Tips, guides, and insights to help you master Google My Business SEO.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {posts.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:shadow-lg"
              >
                {post.featuredImage && (
                  <Link href={`/blog/${post.slug}`}>
                    <Image
                      src={post.featuredImage}
                      alt={post.title}
                      width={600}
                      height={300}
                      className="h-48 w-full object-cover transition group-hover:scale-105"
                    />
                  </Link>
                )}
                <div className="p-6">
                  {post.category && (
                    <Link
                      href={`/categories/${post.category}`}
                      className="text-xs font-medium uppercase tracking-wide text-blue-600 hover:underline"
                    >
                      {post.category}
                    </Link>
                  )}
                  <Link href={`/blog/${post.slug}`}>
                    <h2 className="mt-2 font-semibold text-gray-900 group-hover:text-blue-600">
                      {post.title}
                    </h2>
                  </Link>
                  {post.description && (
                    <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                      {post.description}
                    </p>
                  )}
                  <div className="mt-4 flex items-center justify-between text-sm">
                    {post.author && (
                      <span className="text-gray-500">{post.author}</span>
                    )}
                    {post.publishedAt && (
                      <span className="text-gray-400">
                        {new Date(post.publishedAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-gray-500">No blog posts yet. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}
