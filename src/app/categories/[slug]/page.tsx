import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { getCategories, getPostsByCategory } from "../../../lib/content";
import { JsonLd, generateBreadcrumbJsonLd } from "../../../lib/jsonld";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  const categories = getCategories();
  return categories.map((category) => ({ slug: category }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const categories = getCategories();
  if (!categories.includes(slug)) return {};

  return {
    title: `${slug} - GMB SEO Tools`,
    description: `Browse all posts in the ${slug} category.`,
    openGraph: {
      title: `${slug} Posts`,
      description: `Browse all posts in the ${slug} category.`,
      type: "website",
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const categories = getCategories();

  if (!categories.includes(slug)) {
    notFound();
  }

  const posts = getPostsByCategory(slug);
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://gmbseotools.com";

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: siteUrl },
    { name: "Categories", url: `${siteUrl}/categories` },
    { name: slug, url: `${siteUrl}/categories/${slug}` },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />

      <div className="bg-white">
        <nav className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <Link href="/" className="hover:text-blue-600">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/categories" className="hover:text-blue-600">
                Categories
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-900">{slug}</li>
          </ol>
        </nav>

        <header className="bg-gradient-to-r from-blue-600 to-blue-800 py-16">
          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-white">{slug}</h1>
            <p className="mt-6 text-blue-200">
              {posts.length} post{posts.length !== 1 ? "s" : ""}
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
                  <div className="p-6">
                    <Link href={`/blog/${post.slug}`}>
                      <h2 className="font-semibold text-gray-900 group-hover:text-blue-600">
                        {post.title}
                      </h2>
                    </Link>
                    {post.description && (
                      <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                        {post.description}
                      </p>
                    )}
                    <div className="mt-4 text-sm text-gray-400">
                      {post.publishedAt &&
                        new Date(post.publishedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-gray-500">No posts in this category yet.</p>
              <Link
                href="/blog"
                className="mt-4 inline-block text-blue-600 hover:underline"
              >
                Browse all posts
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
