import Image from 'next/image'
import Link from 'next/link'
import { Metadata } from 'next'
import { client, urlFor } from '../../../sanity/lib/client'
import { postsQuery } from '../../../sanity/lib/queries'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Blog - Best AI SEO Tools',
  description: 'Tips, guides, and insights about AI-powered SEO tools and strategies.',
}

interface Post {
  _id: string
  title: string
  slug: { current: string }
  excerpt?: string
  category?: { _id: string; name: string; slug: { current: string } }
  author?: {
    _id: string
    name: string
    image?: { asset: { _ref: string } }
  }
  featuredImage?: { asset: { _ref: string } }
  publishedAt?: string
}

export default async function BlogPage() {
  const posts = await client.fetch<Post[]>(postsQuery)

  return (
    <div className="bg-white">
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white">Blog</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">
            Tips, guides, and insights to help you master AI-powered SEO.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {posts.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article
                key={post._id}
                className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:shadow-lg"
              >
                {post.featuredImage && (
                  <Link href={`/blog/${post.slug.current}`}>
                    <Image
                      src={urlFor(post.featuredImage).width(600).height(300).url()}
                      alt={post.title}
                      width={600}
                      height={300}
                      className="h-48 w-full object-cover transition group-hover:scale-105"
                    />
                  </Link>
                )}
                <div className="p-6">
                  {post.category && (
                    <Link
                      href={`/categories/${post.category.slug.current}`}
                      className="text-xs font-medium uppercase tracking-wide text-blue-600 hover:underline"
                    >
                      {post.category.name}
                    </Link>
                  )}
                  <Link href={`/blog/${post.slug.current}`}>
                    <h2 className="mt-2 font-semibold text-gray-900 group-hover:text-blue-600">
                      {post.title}
                    </h2>
                  </Link>
                  {post.excerpt && (
                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                      {post.excerpt}
                    </p>
                  )}
                  <div className="mt-4 flex items-center justify-between text-sm">
                    {post.author && (
                      <div className="flex items-center gap-2">
                        {post.author.image && (
                          <Image
                            src={urlFor(post.author.image).width(24).height(24).url()}
                            alt={post.author.name}
                            width={24}
                            height={24}
                            className="rounded-full"
                          />
                        )}
                        <span className="text-gray-500">{post.author.name}</span>
                      </div>
                    )}
                    {post.publishedAt && (
                      <span className="text-gray-400">
                        {new Date(post.publishedAt).toLocaleDateString('en-US', {
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
            <p className="text-gray-500">No blog posts yet. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  )
}
