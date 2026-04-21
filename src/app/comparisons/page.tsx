import Link from "next/link";
import { Metadata } from "next";
import { getAllComparisons } from "../../lib/content";

export const metadata: Metadata = {
  title: "Tool Comparisons - GMB SEO Tools",
  description:
    "Side-by-side comparisons of popular GMB SEO tools to help you choose the best option.",
};

export default function ComparisonsPage() {
  const comparisons = getAllComparisons();

  return (
    <div className="bg-white">
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white">Tool Comparisons</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">
            Side-by-side comparisons to help you find the best GMB SEO tool for
            your needs.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {comparisons.length > 0 ? (
          <div className="space-y-8">
            {comparisons.map((comparison) => (
              <article
                key={comparison.slug}
                className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:shadow-lg md:flex-row"
              >
                <div className="flex flex-1 flex-col p-6">
                  <Link href={`/comparisons/${comparison.slug}`}>
                    <h2 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600">
                      {comparison.title}
                    </h2>
                  </Link>
                  {comparison.tools && comparison.tools.length > 0 && (
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-sm text-gray-500">Comparing:</span>
                      <span className="text-sm text-gray-600">
                        {comparison.tools.join(" vs ")}
                      </span>
                    </div>
                  )}
                  {comparison.description && (
                    <p className="mt-3 flex-1 line-clamp-2 text-gray-600">
                      {comparison.description}
                    </p>
                  )}
                  {comparison.winner && (
                    <p className="mt-3 text-sm">
                      <span className="text-gray-500">Winner:</span>{" "}
                      <span className="font-medium text-blue-600">
                        {comparison.winner}
                      </span>
                    </p>
                  )}
                  <div className="mt-4 text-sm text-gray-400">
                    {comparison.publishedAt &&
                      new Date(comparison.publishedAt).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }
                      )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-gray-500">No comparisons yet. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}
