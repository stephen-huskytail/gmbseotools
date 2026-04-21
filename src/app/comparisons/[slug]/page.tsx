import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Metadata } from 'next'
import { PortableText, PortableTextBlock } from '@portabletext/react'
import { client, urlFor } from '../../../../sanity/lib/client'
import { comparisonBySlugQuery, comparisonsQuery } from '../../../../sanity/lib/queries'
import { ComparisonTable, AffiliateButton } from '../../../components'
import { JsonLd, generateBreadcrumbJsonLd } from '../../../lib/jsonld'

export const revalidate = 3600

interface Tool {
  _id: string
  name: string
  slug: { current: string }
  logo?: { asset: { _ref: string } }
  description?: string
  rating?: number
  pricing?: {
    hasFree?: boolean
    startingPrice?: number
    pricingModel?: string
  }
  affiliateLink?: string
}

interface Comparison {
  _id: string
  title: string
  slug: { current: string }
  tools: Tool[]
  excerpt?: string
  body?: PortableTextBlock[]
  comparisonTable?: Array<{
    criterion: string
    description?: string
  }>
  winner?: Tool
  winnerReason?: string
  author?: {
    _id: string
    name: string
    image?: { asset: { _ref: string } }
  }
  featuredImage?: { asset: { _ref: string } }
  publishedAt?: string
}

interface Props {
  params: Promise<{ slug: string }>
}

async function getComparison(slug: string): Promise<Comparison | null> {
  return client.fetch(comparisonBySlugQuery, { slug })
}

export async function generateStaticParams() {
  const comparisons: Comparison[] = await client.fetch(comparisonsQuery)
  return comparisons.map((comparison) => ({ slug: comparison.slug.current }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const comparison = await getComparison(slug)
  if (!comparison) return {}

  return {
    title: `${comparison.title} - GMB SEO Tools`,
    description: comparison.excerpt,
    openGraph: {
      title: comparison.title,
      description: comparison.excerpt,
      type: 'article',
    },
  }
}

export default async function ComparisonPage({ params }: Props) {
  const { slug } = await params
  const comparison = await getComparison(slug)

  if (!comparison) {
    notFound()
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gmbseotools.com'

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: 'Home', url: siteUrl },
    { name: 'Comparisons', url: `${siteUrl}/comparisons` },
    { name: comparison.title, url: `${siteUrl}/comparisons/${comparison.slug.current}` },
  ])

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />

      <div className="bg-white">
        <nav className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
            <li>/</li>
            <li><Link href="/comparisons" className="hover:text-blue-600">Comparisons</Link></li>
            <li>/</li>
            <li className="text-gray-900 truncate max-w-[200px]">{comparison.title}</li>
          </ol>
        </nav>

        <header className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {comparison.featuredImage && (
            <Image
              src={urlFor(comparison.featuredImage).width(1200).height(600).url()}
              alt={comparison.title}
              width={1200}
              height={600}
              className="mb-8 rounded-xl object-cover"
              priority
            />
          )}
          <h1 className="text-4xl font-bold text-gray-900">{comparison.title}</h1>
          {comparison.excerpt && (
            <p className="mt-4 text-xl text-gray-600">{comparison.excerpt}</p>
          )}
          <div className="mt-6 flex flex-wrap items-center gap-4">
            {comparison.author && (
              <div className="flex items-center gap-2">
                {comparison.author.image && (
                  <Image
                    src={urlFor(comparison.author.image).width(40).height(40).url()}
                    alt={comparison.author.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                )}
                <span className="text-sm text-gray-600">By {comparison.author.name}</span>
              </div>
            )}
            {comparison.publishedAt && (
              <span className="text-sm text-gray-500">
                {new Date(comparison.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            )}
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          {comparison.tools && comparison.tools.length > 0 && (
            <section className="mb-12">
              <h2 className="mb-6 text-2xl font-bold text-gray-900">Quick Comparison</h2>
              <ComparisonTable
                tools={comparison.tools}
                criteria={comparison.comparisonTable}
                winner={comparison.winner}
                comparisonSlug={comparison.slug.current}
              />
            </section>
          )}

          {comparison.winner && (
            <section className="mb-12 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 p-8">
              <div className="flex flex-col items-center gap-4 sm:flex-row">
                {comparison.winner.logo && (
                  <Image
                    src={urlFor(comparison.winner.logo).width(80).height(80).url()}
                    alt={comparison.winner.name}
                    width={80}
                    height={80}
                    className="rounded-xl"
                  />
                )}
                <div className="text-center sm:text-left">
                  <p className="text-sm font-medium uppercase tracking-wide text-blue-600">Our Pick</p>
                  <h3 className="text-2xl font-bold text-gray-900">{comparison.winner.name}</h3>
                  {comparison.winnerReason && (
                    <p className="mt-2 text-gray-700">{comparison.winnerReason}</p>
                  )}
                </div>
                {comparison.winner.affiliateLink && (
                  <div className="ml-auto">
                    <AffiliateButton
                      href={comparison.winner.affiliateLink}
                      toolName={comparison.winner.name}
                      articleType="comparison"
                      size="lg"
                    />
                  </div>
                )}
              </div>
            </section>
          )}

          {comparison.body && (
            <article className="prose prose-lg mx-auto max-w-4xl">
              <PortableText value={comparison.body} />
            </article>
          )}

          <section className="mt-12">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">Explore These Tools</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {comparison.tools?.map((tool) => (
                <Link
                  key={tool._id}
                  href={`/tools/${tool.slug.current}`}
                  className="group rounded-lg border border-gray-200 p-4 transition hover:border-blue-300 hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    {tool.logo && (
                      <Image
                        src={urlFor(tool.logo).width(48).height(48).url()}
                        alt={tool.name}
                        width={48}
                        height={48}
                        className="rounded-lg"
                      />
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">
                        {tool.name}
                      </h3>
                      {tool.rating && (
                        <p className="text-sm text-yellow-500">
                          {'★'.repeat(Math.round(tool.rating))} {tool.rating.toFixed(1)}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  )
}
