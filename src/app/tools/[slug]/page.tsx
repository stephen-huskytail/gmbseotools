import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Metadata } from 'next'
import { client, urlFor } from '../../../../sanity/lib/client'
import { toolBySlugQuery, toolsQuery } from '../../../../sanity/lib/queries'
import { AffiliateButton, RatingStars, PricingCard } from '../../../components'
import { JsonLd, generateProductJsonLd, generateBreadcrumbJsonLd } from '../../../lib/jsonld'
import { PortableText, PortableTextBlock } from '@portabletext/react'

export const revalidate = 3600

interface Tool {
  _id: string
  name: string
  slug: { current: string }
  description: string
  longDescription?: PortableTextBlock[]
  logo?: { asset: { _ref: string } }
  website?: string
  affiliateLink?: string
  category?: { _id: string; name: string; slug: { current: string } }
  pricing?: {
    hasFree?: boolean
    startingPrice?: number
    pricingModel?: 'freemium' | 'subscription' | 'one-time' | 'usage-based' | 'free'
  }
  features?: string[]
  pros?: string[]
  cons?: string[]
  rating?: number
  publishedAt?: string
}

interface Props {
  params: Promise<{ slug: string }>
}

async function getTool(slug: string): Promise<Tool | null> {
  return client.fetch(toolBySlugQuery, { slug })
}

export async function generateStaticParams() {
  const tools: Tool[] = await client.fetch(toolsQuery)
  return tools.map((tool) => ({ slug: tool.slug.current }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const tool = await getTool(slug)
  if (!tool) return {}

  return {
    title: `${tool.name} Review - GMB SEO Tools`,
    description: tool.description,
    openGraph: {
      title: `${tool.name} Review`,
      description: tool.description,
      type: 'article',
    },
  }
}

export default async function ToolPage({ params }: Props) {
  const { slug } = await params
  const tool = await getTool(slug)

  if (!tool) {
    notFound()
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gmbseotools.com'
  const logoUrl = tool.logo ? urlFor(tool.logo).width(200).url() : undefined

  const productJsonLd = generateProductJsonLd({
    name: tool.name,
    description: tool.description,
    image: logoUrl,
    url: `${siteUrl}/tools/${tool.slug.current}`,
    aggregateRating: tool.rating ? { ratingValue: tool.rating } : undefined,
    offers: tool.pricing?.startingPrice
      ? { price: tool.pricing.startingPrice, priceCurrency: 'USD' }
      : undefined,
  })

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: 'Home', url: siteUrl },
    { name: 'Tools', url: `${siteUrl}/tools` },
    { name: tool.name, url: `${siteUrl}/tools/${tool.slug.current}` },
  ])

  return (
    <>
      <JsonLd data={productJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />

      <div className="bg-white">
        <nav className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
            <li>/</li>
            <li><Link href="/tools" className="hover:text-blue-600">Tools</Link></li>
            <li>/</li>
            <li className="text-gray-900">{tool.name}</li>
          </ol>
        </nav>

        <header className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="flex items-center gap-6">
              {tool.logo && (
                <Image
                  src={urlFor(tool.logo).width(100).height(100).url()}
                  alt={tool.name}
                  width={100}
                  height={100}
                  className="rounded-xl"
                />
              )}
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{tool.name}</h1>
                {tool.category && (
                  <Link
                    href={`/categories/${tool.category.slug.current}`}
                    className="mt-1 inline-block text-sm text-blue-600 hover:underline"
                  >
                    {tool.category.name}
                  </Link>
                )}
                {tool.rating && (
                  <div className="mt-2">
                    <RatingStars rating={tool.rating} size="lg" />
                  </div>
                )}
              </div>
            </div>
            {tool.affiliateLink && (
              <AffiliateButton
                href={tool.affiliateLink}
                toolName={tool.name}
                articleType="tool"
                size="lg"
              >
                Try {tool.name} Free
              </AffiliateButton>
            )}
          </div>
          <p className="mt-6 text-lg text-gray-600">{tool.description}</p>
        </header>

        <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              {tool.longDescription && (
                <section className="prose prose-lg max-w-none">
                  <PortableText value={tool.longDescription} />
                </section>
              )}

              {tool.features && tool.features.length > 0 && (
                <section className="mt-8">
                  <h2 className="text-xl font-bold text-gray-900">Key Features</h2>
                  <ul className="mt-4 space-y-2">
                    {tool.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <svg className="mt-1 h-5 w-5 flex-shrink-0 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                {tool.pros && tool.pros.length > 0 && (
                  <section className="rounded-lg border border-green-200 bg-green-50 p-4">
                    <h3 className="font-semibold text-green-800">Pros</h3>
                    <ul className="mt-2 space-y-1">
                      {tool.pros.map((pro, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-green-700">
                          <span className="mt-0.5">✓</span>
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
                {tool.cons && tool.cons.length > 0 && (
                  <section className="rounded-lg border border-red-200 bg-red-50 p-4">
                    <h3 className="font-semibold text-red-800">Cons</h3>
                    <ul className="mt-2 space-y-1">
                      {tool.cons.map((con, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-red-700">
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
              {tool.pricing && (
                <PricingCard
                  hasFree={tool.pricing.hasFree}
                  startingPrice={tool.pricing.startingPrice}
                  pricingModel={tool.pricing.pricingModel}
                />
              )}

              {tool.affiliateLink && (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <h3 className="font-semibold text-gray-900">Ready to try {tool.name}?</h3>
                  <p className="mt-2 text-sm text-gray-600">
                    Get started with {tool.pricing?.hasFree ? 'a free account' : 'a free trial'} today.
                  </p>
                  <AffiliateButton
                    href={tool.affiliateLink}
                    toolName={tool.name}
                    articleType="tool"
                    className="mt-4 w-full"
                  />
                </div>
              )}

              {tool.website && (
                <div className="text-sm text-gray-500">
                  <a
                    href={tool.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-600"
                  >
                    Visit official website →
                  </a>
                </div>
              )}
            </aside>
          </div>
        </div>
      </div>
    </>
  )
}
