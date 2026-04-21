import { createClient, type SanityClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || ''
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01'

function createSanityClient(): SanityClient | null {
  if (!projectId) {
    return null
  }
  return createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: process.env.NODE_ENV === 'production',
    token: process.env.SANITY_API_READ_TOKEN,
  })
}

const sanityClient = createSanityClient()

export const client = {
  fetch: async <T>(query: string, params?: Record<string, string>): Promise<T> => {
    if (!sanityClient) {
      return [] as unknown as T
    }
    if (params) {
      return sanityClient.fetch<T>(query, params)
    }
    return sanityClient.fetch<T>(query)
  },
}

export function urlFor(source: Parameters<ReturnType<typeof imageUrlBuilder>['image']>[0]) {
  if (!sanityClient) {
    throw new Error('Sanity client not configured')
  }
  return imageUrlBuilder(sanityClient).image(source)
}
