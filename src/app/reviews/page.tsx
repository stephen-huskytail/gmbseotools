import Image from 'next/image'
import Link from 'next/link'
import { Metadata } from 'next'
import { client, urlFor } from '../../../sanity/lib/client'
import { reviewsQuery } from '../../../sanity/lib/queries'
import { RatingStars } from '../../components'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Tool Reviews - Best AI SEO Tools',
  description: 'In-depth reviews of the best AI SEO tools to help you make informed decisions.',
}

interface Review {
  _id: string
  title: string
  slug: { current: string }
  excerpt?: string
  tool?: {
    _id: string
    name: string
    slug: { current: string }
    logo?: { asset: { _ref: string } }
  }
  author?: {
    _id: string
    name: string
    image?: { asset: { _ref: string } }
  }
  ratings?: { overall?: number }
  featuredImage?: { asset: { _ref: string } }
  publishedAt?: string
}

export default async function ReviewsPage() {
  const reviews = await client.fetch<Review[]>(reviewsQuery)

  return (
    <div className="bg-white">
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white">Tool Reviews</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">
            In-depth reviews to help you choose the right AI SEO tools for your needs.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {reviews.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review) => (
              <article
                key={review._id}
                className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:shadow-lg"
              >
                {review.featuredImage && (
                  <Link href={`/reviews/${review.slug.current}`}>
                    <Image
                      src={urlFor(review.featuredImage).width(600).height(300).url()}
                      alt={review.title}
                      width={600}
                      height={300}
                      className="h-48 w-full object-cover transition group-hover:scale-105"
                    />
                  </Link>
                )}
                <div className="p-6">
                  {review.tool && (
                    <div className="mb-3 flex items-center gap-2">
                      {review.tool.logo && (
                        <Image
                          src={urlFor(review.tool.logo).width(24).height(24).url()}
                          alt={review.tool.name}
                          width={24}
                          height={24}
                          className="rounded"
                        />
                      )}
                      <span className="text-sm text-gray-500">{review.tool.name}</span>
                    </div>
                  )}
                  <Link href={`/reviews/${review.slug.current}`}>
                    <h2 className="font-semibold text-gray-900 group-hover:text-blue-600">
                      {review.title}
                    </h2>
                  </Link>
                  {review.ratings?.overall && (
                    <div className="mt-2">
                      <RatingStars rating={review.ratings.overall} size="sm" />
                    </div>
                  )}
                  {review.excerpt && (
                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                      {review.excerpt}
                    </p>
                  )}
                  <div className="mt-4 flex items-center justify-between text-sm">
                    {review.author && (
                      <div className="flex items-center gap-2">
                        {review.author.image && (
                          <Image
                            src={urlFor(review.author.image).width(24).height(24).url()}
                            alt={review.author.name}
                            width={24}
                            height={24}
                            className="rounded-full"
                          />
                        )}
                        <span className="text-gray-500">{review.author.name}</span>
                      </div>
                    )}
                    {review.publishedAt && (
                      <span className="text-gray-400">
                        {new Date(review.publishedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-gray-500">No reviews yet. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  )
}
