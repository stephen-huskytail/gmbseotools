import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Metadata } from 'next'
import { PortableText, PortableTextBlock } from '@portabletext/react'
import { client, urlFor } from '../../../../sanity/lib/client'
import { postBySlugQuery, postsQuery } from '../../../../sanity/lib/queries'
import { FAQAccordion, AffiliateButton } from '../../../components'
import {
  JsonLd,
  generateArticleJsonLd,
  generateBreadcrumbJsonLd,
  generateFAQJsonLd,
} from '../../../lib/jsonld'

export const revalidate = 3600

interface Post {
  _id: string
  title: string
  slug: { current: string }
  excerpt?: string
  body?: PortableTextBlock[]
  category?: { _id: string; name: string; slug: { current: string } }
  author?: {
    _id: string
    name: string
    bio?: string
    image?: { asset: { _ref: string } }
  }
  faq?: Array<{ question: string; answer: string }>
  relatedTools?: Array<{
    _id: string
    name: string
    slug: { current: string }
    logo?: { asset: { _ref: string } }
    affiliateLink?: string
  }>
  featuredImage?: { asset: { _ref: string } }
  publishedAt?: string
}

interface Props {
  params: Promise<{ slug: string }>
}

async function getPost(slug: string): Promise<Post | null> {
  return client.fetch(postBySlugQuery, { slug })
}

export async function generateStaticParams() {
  const posts: Post[] = await client.fetch(postsQuery)
  return posts.map((post) => ({ slug: post.slug.current }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return {}

  return {
    title: `${post.title} - GMB SEO Tools`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    notFound()
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gmbseotools.com'

  const articleJsonLd = generateArticleJsonLd({
    headline: post.title,
    description: post.excerpt,
    image: post.featuredImage ? urlFor(post.featuredImage).width(1200).url() : undefined,
    datePublished: post.publishedAt,
    author: {
      name: post.author?.name || 'GMBSEOTools Team',
    },
    publisher: {
      name: 'GMB SEO Tools',
      logo: `${siteUrl}/logo.png`,
    },
  })

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: 'Home', url: siteUrl },
    { name: 'Blog', url: `${siteUrl}/blog` },
    { name: post.title, url: `${siteUrl}/blog/${post.slug.current}` },
  ])

  return (
    <>
      <JsonLd data={articleJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      {post.faq && post.faq.length > 0 && (
        <JsonLd data={generateFAQJsonLd({ items: post.faq })} />
      )}

      <div className="bg-white">
        <nav className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
            <li>/</li>
            <li><Link href="/blog" className="hover:text-blue-600">Blog</Link></li>
            {post.category && (
              <>
                <li>/</li>
                <li>
                  <Link
                    href={`/categories/${post.category.slug.current}`}
                    className="hover:text-blue-600"
                  >
                    {post.category.name}
                  </Link>
                </li>
              </>
            )}
          </ol>
        </nav>

        <header className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          {post.featuredImage && (
            <Image
              src={urlFor(post.featuredImage).width(1200).height(600).url()}
              alt={post.title}
              width={1200}
              height={600}
              className="mb-8 rounded-xl object-cover"
              priority
            />
          )}
          <h1 className="text-4xl font-bold text-gray-900">{post.title}</h1>
          {post.excerpt && (
            <p className="mt-4 text-xl text-gray-600">{post.excerpt}</p>
          )}
          <div className="mt-6 flex flex-wrap items-center gap-4">
            {post.author && (
              <div className="flex items-center gap-2">
                {post.author.image && (
                  <Image
                    src={urlFor(post.author.image).width(40).height(40).url()}
                    alt={post.author.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                )}
                <span className="text-sm text-gray-600">{post.author.name}</span>
              </div>
            )}
            {post.publishedAt && (
              <span className="text-sm text-gray-500">
                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            )}
          </div>
        </header>

        <article className="mx-auto max-w-4xl px-4 pb-16 sm:px-6 lg:px-8">
          {post.body && (
            <div className="prose prose-lg max-w-none">
              <PortableText value={post.body} />
            </div>
          )}

          {post.faq && post.faq.length > 0 && (
            <section className="mt-12">
              <h2 className="mb-6 text-2xl font-bold text-gray-900">
                Frequently Asked Questions
              </h2>
              <FAQAccordion items={post.faq} />
            </section>
          )}

          {post.relatedTools && post.relatedTools.length > 0 && (
            <section className="mt-12 rounded-xl bg-gray-50 p-6">
              <h2 className="mb-4 text-xl font-bold text-gray-900">
                Tools Mentioned in This Article
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {post.relatedTools.map((tool) => (
                  <div
                    key={tool._id}
                    className="flex items-center justify-between rounded-lg bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      {tool.logo && (
                        <Image
                          src={urlFor(tool.logo).width(40).height(40).url()}
                          alt={tool.name}
                          width={40}
                          height={40}
                          className="rounded-lg"
                        />
                      )}
                      <Link
                        href={`/tools/${tool.slug.current}`}
                        className="font-medium text-gray-900 hover:text-blue-600"
                      >
                        {tool.name}
                      </Link>
                    </div>
                    {tool.affiliateLink && (
                      <AffiliateButton
                        href={tool.affiliateLink}
                        toolName={tool.name}
                        articleType="blog"
                        size="sm"
                        variant="secondary"
                      >
                        Try It
                      </AffiliateButton>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </article>
      </div>
    </>
  )
}
