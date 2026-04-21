import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { getAllComparisons, getComparison } from "../../../lib/content";
import { JsonLd, generateBreadcrumbJsonLd } from "../../../lib/jsonld";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  const comparisons = getAllComparisons();
  return comparisons.map((comparison) => ({ slug: comparison.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const comparison = getComparison(slug);
  if (!comparison) return {};

  return {
    title: `${comparison.meta.title} - GMB SEO Tools`,
    description: comparison.meta.description,
    openGraph: {
      title: comparison.meta.title,
      description: comparison.meta.description,
      type: "article",
    },
  };
}

export default async function ComparisonPage({ params }: Props) {
  const { slug } = await params;
  const comparison = getComparison(slug);

  if (!comparison) {
    notFound();
  }

  const { meta, content } = comparison;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://gmbseotools.com";

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: siteUrl },
    { name: "Comparisons", url: `${siteUrl}/comparisons` },
    { name: meta.title, url: `${siteUrl}/comparisons/${meta.slug}` },
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
              <Link href="/comparisons" className="hover:text-blue-600">
                Comparisons
              </Link>
            </li>
            <li>/</li>
            <li className="max-w-[200px] truncate text-gray-900">
              {meta.title}
            </li>
          </ol>
        </nav>

        <header className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900">{meta.title}</h1>
          {meta.description && (
            <p className="mt-4 text-xl text-gray-600">{meta.description}</p>
          )}
          <div className="mt-6 flex flex-wrap items-center gap-4">
            {meta.tools && meta.tools.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Comparing:</span>
                <span className="text-sm font-medium text-gray-700">
                  {meta.tools.join(" vs ")}
                </span>
              </div>
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

        <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          {meta.winner && (
            <section className="mb-12 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 p-8">
              <div className="text-center">
                <p className="text-sm font-medium uppercase tracking-wide text-blue-600">
                  Our Pick
                </p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {meta.winner}
                </h3>
              </div>
            </section>
          )}

          <article className="prose prose-lg mx-auto max-w-4xl">
            {content}
          </article>

          {meta.tools && meta.tools.length > 0 && (
            <section className="mt-12">
              <h2 className="mb-6 text-2xl font-bold text-gray-900">
                Explore These Tools
              </h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {meta.tools.map((tool) => (
                  <Link
                    key={tool}
                    href={`/tools/${tool.toLowerCase().replace(/\s+/g, "-")}`}
                    className="group rounded-lg border border-gray-200 p-4 transition hover:border-blue-300 hover:shadow-md"
                  >
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">
                      {tool}
                    </h3>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
