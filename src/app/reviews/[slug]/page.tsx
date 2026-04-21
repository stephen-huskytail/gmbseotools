import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { getAllReviews, getReview } from "../../../lib/content";
import { AffiliateButton, RatingStars } from "../../../components";
import {
  JsonLd,
  generateReviewJsonLd,
  generateBreadcrumbJsonLd,
} from "../../../lib/jsonld";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  const reviews = getAllReviews();
  return reviews.map((review) => ({ slug: review.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const review = getReview(slug);
  if (!review) return {};

  return {
    title: `${review.meta.name} Review - GMB SEO Tools`,
    description: review.meta.description,
    openGraph: {
      title: `${review.meta.name} Review`,
      description: review.meta.description,
      type: "article",
    },
  };
}

export default async function ReviewPage({ params }: Props) {
  const { slug } = await params;
  const review = getReview(slug);

  if (!review) {
    notFound();
  }

  const { meta, content } = review;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://gmbseotools.com";

  const reviewJsonLd = generateReviewJsonLd({
    name: `${meta.name} Review`,
    description: meta.description,
    itemReviewed: {
      name: meta.name,
      image: meta.featuredImage,
    },
    reviewRating: {
      ratingValue: meta.rating || 0,
    },
    author: {
      name: "GMBSEOTools Team",
    },
    datePublished: meta.publishedAt,
  });

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: siteUrl },
    { name: "Reviews", url: `${siteUrl}/reviews` },
    { name: `${meta.name} Review`, url: `${siteUrl}/reviews/${meta.slug}` },
  ]);

  return (
    <>
      <JsonLd data={reviewJsonLd} />
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
              <Link href="/reviews" className="hover:text-blue-600">
                Reviews
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-900">{meta.name}</li>
          </ol>
        </nav>

        <header className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {meta.featuredImage && (
            <Image
              src={meta.featuredImage}
              alt={meta.name}
              width={1200}
              height={600}
              className="mb-8 rounded-xl object-cover"
              priority
            />
          )}
          <h1 className="text-4xl font-bold text-gray-900">
            {meta.name} Review
          </h1>
          {meta.description && (
            <p className="mt-4 text-xl text-gray-600">{meta.description}</p>
          )}
          <div className="mt-6 flex flex-wrap items-center gap-4">
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

        <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            <article className="lg:col-span-2">
              <div className="prose prose-lg max-w-none">{content}</div>

              {meta.verdict && (
                <section className="mt-8 rounded-lg border-l-4 border-blue-500 bg-blue-50 p-6">
                  <h2 className="text-lg font-semibold text-blue-900">
                    Our Verdict
                  </h2>
                  <p className="mt-2 text-blue-800">{meta.verdict}</p>
                </section>
              )}
            </article>

            <aside className="space-y-6">
              <div className="rounded-lg border border-gray-200 bg-white p-6">
                <h3 className="font-semibold text-gray-900">{meta.name}</h3>
                {meta.rating && (
                  <div className="mt-2">
                    <RatingStars rating={meta.rating} size="md" />
                  </div>
                )}

                {meta.affiliateUrl && (
                  <AffiliateButton
                    href={meta.affiliateUrl}
                    toolName={meta.name}
                    articleType="review"
                    className="mt-6 w-full"
                  />
                )}
              </div>

              <Link
                href={`/tools/${meta.slug}`}
                className="block rounded-lg border border-gray-200 p-4 text-center text-sm font-medium text-blue-600 hover:bg-gray-50"
              >
                View Full Tool Profile &rarr;
              </Link>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
