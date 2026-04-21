import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { getAllTools, getTool } from "../../../lib/content";
import { AffiliateButton, RatingStars, PricingCard } from "../../../components";
import {
  JsonLd,
  generateProductJsonLd,
  generateBreadcrumbJsonLd,
} from "../../../lib/jsonld";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  const tools = getAllTools();
  return tools.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) return {};

  return {
    title: `${tool.meta.name} Review - GMB SEO Tools`,
    description: tool.meta.description,
    openGraph: {
      title: `${tool.meta.name} Review`,
      description: tool.meta.description,
      type: "article",
    },
  };
}

export default async function ToolPage({ params }: Props) {
  const { slug } = await params;
  const tool = getTool(slug);

  if (!tool) {
    notFound();
  }

  const { meta, content } = tool;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://gmbseotools.com";

  const productJsonLd = generateProductJsonLd({
    name: meta.name,
    description: meta.description,
    image: meta.featuredImage,
    url: `${siteUrl}/tools/${meta.slug}`,
    aggregateRating: meta.rating ? { ratingValue: meta.rating } : undefined,
  });

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: siteUrl },
    { name: "Tools", url: `${siteUrl}/tools` },
    { name: meta.name, url: `${siteUrl}/tools/${meta.slug}` },
  ]);

  return (
    <>
      <JsonLd data={productJsonLd} />
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
              <Link href="/tools" className="hover:text-blue-600">
                Tools
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-900">{meta.name}</li>
          </ol>
        </nav>

        <header className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{meta.name}</h1>
              {meta.rating && (
                <div className="mt-2">
                  <RatingStars rating={meta.rating} size="lg" />
                </div>
              )}
            </div>
            {meta.affiliateUrl && (
              <AffiliateButton
                href={meta.affiliateUrl}
                toolName={meta.name}
                articleType="tool"
                size="lg"
              >
                Try {meta.name} Free
              </AffiliateButton>
            )}
          </div>
          <p className="mt-6 text-lg text-gray-600">{meta.description}</p>
        </header>

        <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <article className="prose prose-lg max-w-none">{content}</article>

              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                {meta.pros && meta.pros.length > 0 && (
                  <section className="rounded-lg border border-green-200 bg-green-50 p-4">
                    <h3 className="font-semibold text-green-800">Pros</h3>
                    <ul className="mt-2 space-y-1">
                      {meta.pros.map((pro, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-sm text-green-700"
                        >
                          <span className="mt-0.5">✓</span>
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
                {meta.cons && meta.cons.length > 0 && (
                  <section className="rounded-lg border border-red-200 bg-red-50 p-4">
                    <h3 className="font-semibold text-red-800">Cons</h3>
                    <ul className="mt-2 space-y-1">
                      {meta.cons.map((con, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-sm text-red-700"
                        >
                          <span className="mt-0.5">✗</span>
                          {con}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
              </div>
            </div>

            <aside className="space-y-6">
              {meta.pricing && (
                <PricingCard
                  hasFree={meta.pricing.includes("Free")}
                  startingPrice={
                    parseInt(meta.pricing.replace(/\D/g, "")) || undefined
                  }
                />
              )}

              {meta.affiliateUrl && (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <h3 className="font-semibold text-gray-900">
                    Ready to try {meta.name}?
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    Get started with a free trial today.
                  </p>
                  <AffiliateButton
                    href={meta.affiliateUrl}
                    toolName={meta.name}
                    articleType="tool"
                    className="mt-4 w-full"
                  />
                </div>
              )}
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
