import type { MetadataRoute } from 'next'
import { client } from '../../sanity/lib/client'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://gmbseotools.com'

interface SlugItem {
  slug: { current: string }
  _updatedAt?: string
}

async function getAllSlugs(): Promise<{
  tools: SlugItem[]
  reviews: SlugItem[]
  comparisons: SlugItem[]
  posts: SlugItem[]
  categories: SlugItem[]
}> {
  const [tools, reviews, comparisons, posts, categories] = await Promise.all([
    client.fetch<SlugItem[]>(`*[_type == "tool" && defined(slug.current)] { slug, _updatedAt }`),
    client.fetch<SlugItem[]>(`*[_type == "review" && defined(slug.current)] { slug, _updatedAt }`),
    client.fetch<SlugItem[]>(`*[_type == "comparison" && defined(slug.current)] { slug, _updatedAt }`),
    client.fetch<SlugItem[]>(`*[_type == "post" && defined(slug.current)] { slug, _updatedAt }`),
    client.fetch<SlugItem[]>(`*[_type == "category" && defined(slug.current)] { slug, _updatedAt }`),
  ])
  return { tools, reviews, comparisons, posts, categories }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { tools, reviews, comparisons, posts, categories } = await getAllSlugs()

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/tools`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/reviews`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${SITE_URL}/comparisons`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${SITE_URL}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: `${SITE_URL}/categories`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
  ]

  const toolPages: MetadataRoute.Sitemap = tools.map((item) => ({
    url: `${SITE_URL}/tools/${item.slug.current}`,
    lastModified: item._updatedAt ? new Date(item._updatedAt) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const reviewPages: MetadataRoute.Sitemap = reviews.map((item) => ({
    url: `${SITE_URL}/reviews/${item.slug.current}`,
    lastModified: item._updatedAt ? new Date(item._updatedAt) : new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  const comparisonPages: MetadataRoute.Sitemap = comparisons.map((item) => ({
    url: `${SITE_URL}/comparisons/${item.slug.current}`,
    lastModified: item._updatedAt ? new Date(item._updatedAt) : new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  const postPages: MetadataRoute.Sitemap = posts.map((item) => ({
    url: `${SITE_URL}/blog/${item.slug.current}`,
    lastModified: item._updatedAt ? new Date(item._updatedAt) : new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  const categoryPages: MetadataRoute.Sitemap = categories.map((item) => ({
    url: `${SITE_URL}/categories/${item.slug.current}`,
    lastModified: item._updatedAt ? new Date(item._updatedAt) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.5,
  }))

  return [...staticPages, ...toolPages, ...reviewPages, ...comparisonPages, ...postPages, ...categoryPages]
}
