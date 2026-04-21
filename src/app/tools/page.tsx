import Link from "next/link";
import { Metadata } from "next";
import { getAllTools, getCategories } from "../../lib/content";
import { RatingStars, AffiliateButton } from "../../components";

export const metadata: Metadata = {
  title: "All GMB SEO Tools - GMB SEO Tools",
  description:
    "Browse and compare all Google My Business SEO tools to find the perfect solution for your needs.",
};

export default function ToolsPage() {
  const tools = getAllTools();
  const categories = getCategories();

  return (
    <div className="bg-white">
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white">All GMB SEO Tools</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">
            Compare the best Google My Business SEO tools to boost your rankings and
            grow organic traffic.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-4">
          <aside className="space-y-6">
            <div>
              <h2 className="font-semibold text-gray-900">Categories</h2>
              <ul className="mt-4 space-y-2">
                {categories.map((category) => (
                  <li key={category}>
                    <Link
                      href={`/categories/${category}`}
                      className="text-sm text-gray-600 hover:text-blue-600"
                    >
                      {category}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <div className="lg:col-span-3">
            <p className="mb-6 text-sm text-gray-500">{tools.length} tools</p>
            {tools.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {tools.map((tool) => (
                  <article
                    key={tool.slug}
                    className="group rounded-lg border border-gray-200 bg-white p-4 transition hover:border-blue-300 hover:shadow-md"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <Link
                          href={`/tools/${tool.slug}`}
                          className="font-semibold text-gray-900 group-hover:text-blue-600"
                        >
                          {tool.name}
                        </Link>
                      </div>
                    </div>
                    {tool.rating && (
                      <div className="mt-3">
                        <RatingStars rating={tool.rating} size="sm" />
                      </div>
                    )}
                    {tool.description && (
                      <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                        {tool.description}
                      </p>
                    )}
                    <div className="mt-4 flex items-center justify-between">
                      <div className="text-sm">
                        {tool.pricing && (
                          <span className="font-medium text-gray-900">
                            {tool.pricing}
                          </span>
                        )}
                      </div>
                      {tool.affiliateUrl && (
                        <AffiliateButton
                          href={tool.affiliateUrl}
                          toolName={tool.name}
                          size="sm"
                        >
                          Try It
                        </AffiliateButton>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <p className="text-gray-500">No tools yet. Check back soon!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
