import { groq } from 'next-sanity'

export const toolsQuery = groq`
  *[_type == "tool" && defined(slug.current)] | order(featured desc, rating desc) {
    _id,
    name,
    slug,
    description,
    logo,
    website,
    affiliateLink,
    category->{_id, name, slug},
    pricing,
    rating,
    featured,
    publishedAt
  }
`

export const toolBySlugQuery = groq`
  *[_type == "tool" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    description,
    longDescription,
    logo,
    website,
    affiliateLink,
    category->{_id, name, slug},
    pricing,
    features,
    pros,
    cons,
    rating,
    featured,
    publishedAt
  }
`

export const featuredToolsQuery = groq`
  *[_type == "tool" && featured == true] | order(rating desc)[0...6] {
    _id,
    name,
    slug,
    description,
    logo,
    affiliateLink,
    category->{_id, name, slug},
    rating
  }
`

export const categoriesQuery = groq`
  *[_type == "category"] | order(order asc) {
    _id,
    name,
    slug,
    description,
    icon
  }
`

export const toolsByCategoryQuery = groq`
  *[_type == "tool" && category._ref == $categoryId] | order(rating desc) {
    _id,
    name,
    slug,
    description,
    logo,
    affiliateLink,
    pricing,
    rating
  }
`

export const reviewsQuery = groq`
  *[_type == "review" && defined(slug.current)] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    tool->{_id, name, slug, logo},
    author->{_id, name, image},
    ratings,
    featuredImage,
    publishedAt
  }
`

export const reviewBySlugQuery = groq`
  *[_type == "review" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    tool->{_id, name, slug, logo, website, affiliateLink},
    author->{_id, name, bio, image, social},
    excerpt,
    body,
    ratings,
    verdict,
    featuredImage,
    publishedAt
  }
`

export const comparisonsQuery = groq`
  *[_type == "comparison" && defined(slug.current)] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    tools[]->{_id, name, slug, logo},
    winner->{_id, name, slug},
    author->{_id, name, image},
    featuredImage,
    publishedAt
  }
`

export const comparisonBySlugQuery = groq`
  *[_type == "comparison" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    tools[]->{_id, name, slug, logo, description, rating, pricing, affiliateLink},
    excerpt,
    body,
    comparisonTable,
    winner->{_id, name, slug},
    winnerReason,
    author->{_id, name, bio, image, social},
    featuredImage,
    publishedAt
  }
`

export const postsQuery = groq`
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    category->{_id, name, slug},
    author->{_id, name, image},
    featuredImage,
    publishedAt
  }
`

export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    excerpt,
    body,
    category->{_id, name, slug},
    author->{_id, name, bio, image, social},
    faq,
    relatedTools[]->{_id, name, slug, logo, affiliateLink},
    featuredImage,
    publishedAt
  }
`

export const categoryBySlugQuery = groq`
  *[_type == "category" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    description,
    icon
  }
`

export const latestReviewsQuery = groq`
  *[_type == "review" && defined(slug.current)] | order(publishedAt desc)[0...3] {
    _id,
    title,
    slug,
    excerpt,
    tool->{_id, name, slug, logo},
    ratings,
    publishedAt
  }
`
