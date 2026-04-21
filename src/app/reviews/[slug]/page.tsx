import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Metadata } from 'next'
import { PortableText, PortableTextBlock } from '@portabletext/react'
import { client, urlFor } from '../../../../sanity/lib/client'
import { reviewBySlugQuery, reviewsQuery } from '../../../../sanity/lib/queries'
import { AffiliateButton, RatingStars } from '../../../components'
import { JsonLd, generateReviewJsonLd, generateBreadcrumbJsonLd } from '../../../lib/jsonld'

export const revalidate = 3600

interface Review {
  _id: string
  title: string
  slug: { current: string }
  tool: {
    _id: string
    name: string
    slug: { current: string }
    logo?: { asset: { _ref: string } }
    website?: string
    affiliateLink?: string
  }
  author?: {
    _id: string
    name: string
    bio?: string
    image?: { asset: { _ref: string } }
  }
  excerpt?: string
  body?: PortableTextBlock[]
  ratings?: {
    features?: number
    easeOfUse?: number
    valueForMoney?: number
    support?: number
    overall?: number
  }
  verdict?: string
  featuredImage?: { asset: { _ref: string } }
  publishedAt?: string
}

interface Props {
  params: Promise<{ slug: string }>
}

async function getReview(slug: string): Promise<Review | null> {
  return client.fetch(reviewBySlugQuery, { slug })
}

export async function generateStaticParams() {
  const reviews: Review[] = await client.fetch(reviewsQuery)
  return reviews.map((review) => ({ slug: review.slug.current }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const review = await getReview(slug)
  if (!review) return {}

  return {
    title: `${review.title} - GMB SEO Tools`,
    description: review.excerpt,
    openGraph: {
      title: review.title,
      description: review.excerpt,
      type: 'article',
    },
  }
}

export default async function ReviewPage({ params }: Props) {
  const { slug } = await params
  const review = await getReview(slug)

  if (!review) {
    notFound()
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gmbseotools.com'

  const reviewJsonLd = generateReviewJsonLd({
    name: review.title,
    description: review.excerpt || '',
    itemReviewed: {
      name: review.tool.name,
      image: review.tool.logo ? urlFor(review.tool.logo).width(200).url() : undefined,
      url: review.tool.website,
    },
    reviewRating: {
      ratingValue: review.ratings?.overall || 0,
    },
    author: {
      name: review.author?.name || 'GMBSEOTools Team',
    },
    datePublished: review.publishedAt,
  })

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: 'Home', url: siteUrl },
    { name: 'Reviews', url: `${siteUrl}/reviews` },
    { name: review.title, url: `${siteUrl}/reviews/${review.slug.current}` },
  ])

  const ratingCategories = [
    { key: 'features', label: 'Features' },
    { key: 'easeOfUse', label: 'Ease of Use' },
    { key: 'valueForMoney', label: 'Value for Money' },
    { key: 'support', label: 'Support' },
  ] as const

  return (
    <>
      <JsonLd data={reviewJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />

      <div className="bg-white">
        <nav className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
            <li>/</li>
            <li><Link href="/reviews" className="hover:text-blue-600">Reviews</Link></li>
            <li>/</li>
            <li className="text-gray-900">{review.tool.name}</li>
          </ol>
        </nav>

        <header className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {review.featuredImage && (
            <Image
              src={urlFor(review.featuredImage).width(1200).height(600).url()}
              alt={review.title}
              width={1200}
              height={600}
              className="mb-8 rounded-xl object-cover"
              priority
            />
          )}
          <h1 className="text-4xl font-bold text-gray-900">{review.title}</h1>
          {review.excerpt && (
            <p className="mt-4 text-xl text-gray-600">{review.excerpt}</p>
          )}
          <div className="mt-6 flex flex-wrap items-center gap-4">
            {review.author && (
              <div className="flex items-center gap-2">
                {review.author.image && (
                  <Image
                    src={urlFor(review.author.image).width(40).height(40).url()}
                    alt={review.author.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                )}
                <span className="text-sm text-gray-600">By {review.author.name}</span>
              </div>
            )}
            {review.publishedAt && (
              <span className="text-sm text-gray-500">
                {new Date(review.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            )}
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            <article className="lg:col-span-2">
              {review.body && (
                <div className="prose prose-lg max-w-none">
                  <PortableText value={review.body} />
                </div>
              )}

              {review.verdict && (
                <section className="mt-8 rounded-lg border-l-4 border-blue-500 bg-blue-50 p-6">
                  <h2 className="text-lg font-semibold text-blue-900">Our Verdict</h2>
                  <p className="mt-2 text-blue-800">{review.verdict}</p>
                </section>
              )}
            </article>

            <aside className="space-y-6">
              <div className="rounded-lg border border-gray-200 bg-white p-6">
                <div className="flex items-center gap-4">
                  {review.tool.logo && (
                    <Image
                      src={urlFor(review.tool.logo).width(60).height(60).url()}
                      alt={review.tool.name}
                      width={60}
                      height={60}
                      className="rounded-lg"
                    />
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900">{review.tool.name}</h3>
                    {review.ratings?.overall && (
                      <RatingStars rating={review.ratings.overall} size="md" />
                    )}
                  </div>
                </div>

                {review.ratings && (
                  <div className="mt-6 space-y-3">
                    {ratingCategories.map(({ key, label }) => (
                      review.ratings?.[key] !== undefined && (
                        <div key={key} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{label}</span>
                          <RatingStars rating={review.ratings[key]!} size="sm" />
                        </div>
                      )
                    ))}
                  </div>
                )}

                {review.tool.affiliateLink && (
                  <AffiliateButton
                    href={review.tool.affiliateLink}
                    toolName={review.tool.name}
                    articleType="review"
                    className="mt-6 w-full"
                  />
                )}
              </div>

              <Link
                href={`/tools/${review.tool.slug.current}`}
                className="block rounded-lg border border-gray-200 p-4 text-center text-sm font-medium text-blue-600 hover:bg-gray-50"
              >
                View Full Tool Profile →
              </Link>
            </aside>
          </div>
        </div>
      </div>
    </>
  )
}
