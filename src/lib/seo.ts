import type { Metadata } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://gmbseotools.com'
const SITE_NAME = 'GMB SEO Tools'

interface SeoConfig {
  title: string
  description: string
  path?: string
  ogImage?: string
  noIndex?: boolean
  article?: {
    publishedTime?: string
    modifiedTime?: string
    authors?: string[]
    tags?: string[]
  }
}

export function generateMetadata({
  title,
  description,
  path = '',
  ogImage,
  noIndex = false,
  article,
}: SeoConfig): Metadata {
  const url = `${SITE_URL}${path}`
  const fullTitle = path === '' ? title : `${title} | ${SITE_NAME}`

  const metadata: Metadata = {
    title: fullTitle,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      locale: 'en_US',
      type: article ? 'article' : 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
    },
  }

  if (ogImage) {
    metadata.openGraph = {
      ...metadata.openGraph,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    }
    metadata.twitter = {
      ...metadata.twitter,
      images: [ogImage],
    }
  }

  if (article) {
    metadata.openGraph = {
      ...metadata.openGraph,
      type: 'article',
      publishedTime: article.publishedTime,
      modifiedTime: article.modifiedTime,
      authors: article.authors,
      tags: article.tags,
    } as Metadata['openGraph']
  }

  if (noIndex) {
    metadata.robots = { index: false, follow: false }
  }

  return metadata
}

export function generateToolMetadata(tool: {
  name: string
  description?: string
  slug: string
  logo?: string
}): Metadata {
  return generateMetadata({
    title: `${tool.name} Review`,
    description: tool.description || `Discover ${tool.name} - an AI-powered SEO tool. Read our in-depth review and compare features.`,
    path: `/tools/${tool.slug}`,
    ogImage: tool.logo,
  })
}

export function generateReviewMetadata(review: {
  title: string
  excerpt?: string
  slug: string
  publishedAt?: string
  author?: string
  featuredImage?: string
}): Metadata {
  return generateMetadata({
    title: review.title,
    description: review.excerpt || `Read our detailed review and analysis.`,
    path: `/reviews/${review.slug}`,
    ogImage: review.featuredImage,
    article: {
      publishedTime: review.publishedAt,
      authors: review.author ? [review.author] : undefined,
    },
  })
}

export function generateComparisonMetadata(comparison: {
  title: string
  excerpt?: string
  slug: string
  toolNames?: string[]
  featuredImage?: string
}): Metadata {
  const description = comparison.excerpt ||
    (comparison.toolNames?.length
      ? `Compare ${comparison.toolNames.join(' vs ')} - features, pricing, and which is best for you.`
      : 'Compare top AI SEO tools side by side.')

  return generateMetadata({
    title: comparison.title,
    description,
    path: `/comparisons/${comparison.slug}`,
    ogImage: comparison.featuredImage,
  })
}

export function generateBlogMetadata(post: {
  title: string
  excerpt?: string
  slug: string
  publishedAt?: string
  author?: string
  category?: string
  featuredImage?: string
}): Metadata {
  return generateMetadata({
    title: post.title,
    description: post.excerpt || `Read about ${post.title} on GMB SEO Tools blog.`,
    path: `/blog/${post.slug}`,
    ogImage: post.featuredImage,
    article: {
      publishedTime: post.publishedAt,
      authors: post.author ? [post.author] : undefined,
      tags: post.category ? [post.category] : undefined,
    },
  })
}

export function generateCategoryMetadata(category: {
  name: string
  description?: string
  slug: string
}): Metadata {
  return generateMetadata({
    title: `${category.name} Tools`,
    description: category.description || `Discover the best AI-powered ${category.name.toLowerCase()} tools for SEO.`,
    path: `/categories/${category.slug}`,
  })
}
