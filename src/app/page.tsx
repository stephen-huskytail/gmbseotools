import Link from "next/link";
import {
  getAllTools,
  getAllReviews,
  getCategories,
} from "../lib/content";
import { RatingStars } from "../components";

export default function Home() {
  const tools = getAllTools();
  const reviews = getAllReviews();
  const categories = getCategories();

  return (
    <div className="bg-white">
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            Find the Best <span className="text-blue-600">GMB SEO Tools</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
            Discover and compare the most powerful GMB tools to boost
            your rankings, save time, and grow your organic traffic.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/tools"
              className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
            >
              Browse All Tools
            </Link>
            <Link
              href="/comparisons"
              className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
            >
              Compare Tools
            </Link>
          </div>
        </div>
      </section>

      {tools.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900">Featured Tools</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {tools.slice(0, 6).map((tool) => (
                <Link
                  key={tool.slug}
                  href={`/tools/${tool.slug}`}
                  className="group rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
                >
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">
                    {tool.name}
                  </h3>
                  <p className="mt-4 line-clamp-2 text-sm text-gray-600">
                    {tool.description}
                  </p>
                  {tool.rating && (
                    <div className="mt-4 flex items-center gap-1">
                      <RatingStars rating={tool.rating} size="sm" />
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {categories.length > 0 && (
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Browse by Category
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {categories.map((category) => (
                <Link
                  key={category}
                  href={`/categories/${category}`}
                  className="rounded-lg border border-gray-200 p-4 text-center transition hover:border-blue-300 hover:bg-blue-50"
                >
                  <h3 className="font-medium text-gray-900">{category}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {reviews.length > 0 && (
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Latest Reviews
              </h2>
              <Link
                href="/reviews"
                className="text-sm font-medium text-blue-600 hover:underline"
              >
                View all reviews &rarr;
              </Link>
            </div>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {reviews.slice(0, 3).map((review) => (
                <Link
                  key={review.slug}
                  href={`/reviews/${review.slug}`}
                  className="group rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
                >
                  <span className="text-sm text-gray-500">{review.name}</span>
                  <h3 className="mt-3 font-semibold text-gray-900 group-hover:text-blue-600">
                    {review.name} Review
                  </h3>
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
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {tools.length === 0 && categories.length === 0 && (
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <p className="text-gray-500">
              Content coming soon. Add MDX files to the content directory to get
              started.
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
