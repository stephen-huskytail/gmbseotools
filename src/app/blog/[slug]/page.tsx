import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { getAllPosts, getPost } from "../../../lib/content";
import {
  JsonLd,
  generateArticleJsonLd,
  generateBreadcrumbJsonLd,
} from "../../../lib/jsonld";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  return {
    title: `${post.meta.title} - GMB SEO Tools`,
    description: post.meta.description,
    openGraph: {
      title: post.meta.title,
      description: post.meta.description,
      type: "article",
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) {
    notFound();
  }

  const { meta, content } = post;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://gmbseotools.com";

  const articleJsonLd = generateArticleJsonLd({
    headline: meta.title,
    description: meta.description,
    image: meta.featuredImage,
    datePublished: meta.publishedAt,
    author: {
      name: meta.author || "GMBSEOTools Team",
    },
    publisher: {
      name: "GMB SEO Tools",
      logo: `${siteUrl}/logo.png`,
    },
  });

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: siteUrl },
    { name: "Blog", url: `${siteUrl}/blog` },
    { name: meta.title, url: `${siteUrl}/blog/${meta.slug}` },
  ]);

  return (
    <>
      <JsonLd data={articleJsonLd} />
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
              <Link href="/blog" className="hover:text-blue-600">
                Blog
              </Link>
            </li>
            {meta.category && (
              <>
                <li>/</li>
                <li>
                  <Link
                    href={`/categories/${meta.category}`}
                    className="hover:text-blue-600"
                  >
                    {meta.category}
                  </Link>
                </li>
              </>
            )}
          </ol>
        </nav>

        <header className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          {meta.featuredImage && (
            <Image
              src={meta.featuredImage}
              alt={meta.title}
              width={1200}
              height={600}
              className="mb-8 rounded-xl object-cover"
              priority
            />
          )}
          <h1 className="text-4xl font-bold text-gray-900">{meta.title}</h1>
          {meta.description && (
            <p className="mt-4 text-xl text-gray-600">{meta.description}</p>
          )}
          <div className="mt-6 flex flex-wrap items-center gap-4">
            {meta.author && (
              <span className="text-sm text-gray-600">{meta.author}</span>
            )}
            {meta.publishedAt && (
              <span className="text-sm text-gray-500">
                {new Date(meta.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            )}
          </div>
        </header>

        <article className="mx-auto max-w-4xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">{content}</div>
        </article>
      </div>
    </>
  );
}
