import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { getAllReviews } from "../../lib/content";
import { RatingStars } from "../../components";

export const metadata: Metadata = {
  title: "Tool Reviews - GMB SEO Tools",
  description:
    "In-depth reviews of the best GMB SEO tools to help you make informed decisions.",
};

export default function ReviewsPage() {
  const reviews = getAllReviews();

  return (
    <div className="bg-white">
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white">Tool Reviews</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">
            In-depth reviews to help you choose the right GMB SEO tools for your
            needs.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {reviews.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review) => (
              <article
                key={review.slug}
                className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:shadow-lg"
              >
                {review.featuredImage && (
                  <Link href={`/reviews/${review.slug}`}>
                    <Image
                      src={review.featuredImage}
                      alt={review.name}
                      width={600}
                      height={300}
                      className="h-48 w-full object-cover transition group-hover:scale-105"
                    />
                  </Link>
                )}
                <div className="p-6">
                  <Link href={`/reviews/${review.slug}`}>
                    <h2 className="font-semibold text-gray-900 group-hover:text-blue-600">
                      {review.name} Review
                    </h2>
                  </Link>
                  {review.rating && (
                    <div className="mt-2">
                      <RatingStars rating={review.rating} size="sm" />
                    </div>
                  )}
                  {review.description && (
                    <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                      {review.description}
                    </p>
                  )}
                  <div className="mt-4 text-sm text-gray-400">
                    {review.publishedAt &&
                      new Date(review.publishedAt).toLocaleDateString("en-US", {
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
            <p className="text-gray-500">No reviews yet. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}
