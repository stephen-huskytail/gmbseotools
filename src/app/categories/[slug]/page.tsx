import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Metadata } from 'next'
import { client, urlFor } from '../../../../sanity/lib/client'
import { categoryBySlugQuery, categoriesQuery, toolsByCategoryQuery } from '../../../../sanity/lib/queries'
import { RatingStars, AffiliateButton } from '../../../components'
import { JsonLd, generateBreadcrumbJsonLd } from '../../../lib/jsonld'

export const revalidate = 3600

interface Category {
  _id: string
  name: string
  slug: { current: string }
  description?: string
  icon?: string
}

interface Tool {
  _id: string
  name: string
  slug: { current: string }
  description?: string
  logo?: { asset: { _ref: string } }
  affiliateLink?: string
  pricing?: {
    hasFree?: boolean
    startingPrice?: number
  }
  rating?: number
}

interface Props {
  params: Promise<{ slug: string }>
}

async function getCategory(slug: string): Promise<Category | null> {
  return client.fetch(categoryBySlugQuery, { slug })
}

async function getToolsByCategory(categoryId: string): Promise<Tool[]> {
  return client.fetch(toolsByCategoryQuery, { categoryId })
}

export async function generateStaticParams() {
  const categories: Category[] = await client.fetch(categoriesQuery)
  return categories.map((category) => ({ slug: category.slug.current }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategory(slug)
  if (!category) return {}

  return {
    title: `Best ${category.name} Tools - GMB SEO Tools`,
    description: category.description || `Discover the best ${category.name} tools for your SEO needs.`,
    openGraph: {
      title: `Best ${category.name} Tools`,
      description: category.description,
      type: 'website',
    },
  }
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  const category = await getCategory(slug)

  if (!category) {
    notFound()
  }

  const tools = await getToolsByCategory(category._id)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gmbseotools.com'

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: 'Home', url: siteUrl },
    { name: 'Categories', url: `${siteUrl}/categories` },
    { name: category.name, url: `${siteUrl}/categories/${category.slug.current}` },
  ])

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />

      <div className="bg-white">
        <nav className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
            <li>/</li>
            <li><Link href="/categories" className="hover:text-blue-600">Categories</Link></li>
            <li>/</li>
            <li className="text-gray-900">{category.name}</li>
          </ol>
        </nav>

        <header className="bg-gradient-to-r from-blue-600 to-blue-800 py-16">
          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-white">
              Best {category.name} Tools in {new Date().getFullYear()}
            </h1>
            {category.description && (
              <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">
                {category.description}
              </p>
            )}
            <p className="mt-6 text-blue-200">
              {tools.length} tool{tools.length !== 1 ? 's' : ''} reviewed
            </p>
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {tools.length > 0 ? (
            <div className="space-y-6">
              {tools.map((tool, index) => (
                <article
                  key={tool._id}
                  className="flex flex-col gap-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md sm:flex-row sm:items-center"
                >
                  <div className="flex items-center gap-4 sm:w-16">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-600">
                      {index + 1}
                    </span>
                  </div>

                  <div className="flex flex-1 items-center gap-4">
                    {tool.logo && (
                      <Image
                        src={urlFor(tool.logo).width(64).height(64).url()}
                        alt={tool.name}
                        width={64}
                        height={64}
                        className="rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <Link
                        href={`/tools/${tool.slug.current}`}
                        className="text-xl font-semibold text-gray-900 hover:text-blue-600"
                      >
                        {tool.name}
                      </Link>
                      {tool.rating && (
                        <div className="mt-1">
                          <RatingStars rating={tool.rating} size="sm" />
                        </div>
                      )}
                      {tool.description && (
                        <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                          {tool.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 sm:w-48">
                    <div className="text-right">
                      {tool.pricing?.startingPrice ? (
                        <p className="text-lg font-semibold text-gray-900">
                          ${tool.pricing.startingPrice}/mo
                        </p>
                      ) : tool.pricing?.hasFree ? (
                        <p className="text-lg font-semibold text-emerald-600">Free</p>
                      ) : null}
                    </div>
                    {tool.affiliateLink && (
                      <AffiliateButton
                        href={tool.affiliateLink}
                        toolName={tool.name}
                        size="sm"
                      />
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-gray-500">No tools in this category yet.</p>
              <Link href="/tools" className="mt-4 inline-block text-blue-600 hover:underline">
                Browse all tools
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
