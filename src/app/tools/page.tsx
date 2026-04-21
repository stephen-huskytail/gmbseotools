import Image from 'next/image'
import Link from 'next/link'
import { Metadata } from 'next'
import { client, urlFor } from '../../../sanity/lib/client'
import { toolsQuery, categoriesQuery } from '../../../sanity/lib/queries'
import { RatingStars, AffiliateButton } from '../../components'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'All AI SEO Tools - Best AI SEO Tools',
  description: 'Browse and compare all AI-powered SEO tools to find the perfect solution for your needs.',
}

interface Tool {
  _id: string
  name: string
  slug: { current: string }
  description?: string
  logo?: { asset: { _ref: string } }
  affiliateLink?: string
  category?: { _id: string; name: string; slug: { current: string } }
  pricing?: {
    hasFree?: boolean
    startingPrice?: number
  }
  rating?: number
  featured?: boolean
}

interface Category {
  _id: string
  name: string
  slug: { current: string }
}

export default async function ToolsPage() {
  const [tools, categories] = await Promise.all([
    client.fetch<Tool[]>(toolsQuery),
    client.fetch<Category[]>(categoriesQuery),
  ])

  return (
    <div className="bg-white">
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white">All AI SEO Tools</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">
            Compare the best AI-powered SEO tools to boost your rankings and grow organic traffic.
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
                  <li key={category._id}>
                    <Link
                      href={`/categories/${category.slug.current}`}
                      className="text-sm text-gray-600 hover:text-blue-600"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <div className="lg:col-span-3">
            <p className="mb-6 text-sm text-gray-500">{tools.length} tools</p>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {tools.map((tool) => (
                <article
                  key={tool._id}
                  className="group rounded-lg border border-gray-200 bg-white p-4 transition hover:border-blue-300 hover:shadow-md"
                >
                  <div className="flex items-start gap-4">
                    {tool.logo && (
                      <Image
                        src={urlFor(tool.logo).width(48).height(48).url()}
                        alt={tool.name}
                        width={48}
                        height={48}
                        className="rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <Link
                        href={`/tools/${tool.slug.current}`}
                        className="font-semibold text-gray-900 group-hover:text-blue-600"
                      >
                        {tool.name}
                      </Link>
                      {tool.category && (
                        <p className="text-xs text-gray-500">{tool.category.name}</p>
                      )}
                    </div>
                    {tool.featured && (
                      <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">
                        Featured
                      </span>
                    )}
                  </div>
                  {tool.rating && (
                    <div className="mt-3">
                      <RatingStars rating={tool.rating} size="sm" />
                    </div>
                  )}
                  {tool.description && (
                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                      {tool.description}
                    </p>
                  )}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm">
                      {tool.pricing?.startingPrice ? (
                        <span className="font-medium text-gray-900">
                          ${tool.pricing.startingPrice}/mo
                        </span>
                      ) : tool.pricing?.hasFree ? (
                        <span className="font-medium text-emerald-600">Free</span>
                      ) : null}
                    </div>
                    {tool.affiliateLink && (
                      <AffiliateButton
                        href={tool.affiliateLink}
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
          </div>
        </div>
      </div>
    </div>
  )
}
