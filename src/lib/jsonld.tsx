interface ReviewJsonLdProps {
  name: string
  description: string
  itemReviewed: {
    name: string
    image?: string
    url?: string
  }
  reviewRating: {
    ratingValue: number
    bestRating?: number
  }
  author: {
    name: string
  }
  datePublished?: string
}

export function generateReviewJsonLd(props: ReviewJsonLdProps) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    name: props.name,
    description: props.description,
    itemReviewed: {
      '@type': 'SoftwareApplication',
      name: props.itemReviewed.name,
      image: props.itemReviewed.image,
      url: props.itemReviewed.url,
      applicationCategory: 'BusinessApplication',
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: props.reviewRating.ratingValue,
      bestRating: props.reviewRating.bestRating || 5,
    },
    author: {
      '@type': 'Person',
      name: props.author.name,
    },
    datePublished: props.datePublished,
  }
}

interface ProductJsonLdProps {
  name: string
  description: string
  image?: string
  url?: string
  brand?: string
  aggregateRating?: {
    ratingValue: number
    reviewCount?: number
  }
  offers?: {
    price?: number
    priceCurrency?: string
    availability?: 'InStock' | 'OutOfStock' | 'PreOrder'
  }
}

export function generateProductJsonLd(props: ProductJsonLdProps) {
  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: props.name,
    description: props.description,
    image: props.image,
    url: props.url,
    applicationCategory: 'BusinessApplication',
  }

  if (props.brand) {
    jsonLd.brand = {
      '@type': 'Brand',
      name: props.brand,
    }
  }

  if (props.aggregateRating) {
    jsonLd.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: props.aggregateRating.ratingValue,
      bestRating: 5,
      reviewCount: props.aggregateRating.reviewCount || 1,
    }
  }

  if (props.offers) {
    jsonLd.offers = {
      '@type': 'Offer',
      price: props.offers.price || 0,
      priceCurrency: props.offers.priceCurrency || 'USD',
      availability: `https://schema.org/${props.offers.availability || 'InStock'}`,
    }
  }

  return jsonLd
}

interface FAQJsonLdProps {
  items: Array<{
    question: string
    answer: string
  }>
}

export function generateFAQJsonLd(props: FAQJsonLdProps) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: props.items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}

interface BreadcrumbItem {
  name: string
  url: string
}

export function generateBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

interface ArticleJsonLdProps {
  headline: string
  description?: string
  image?: string
  datePublished?: string
  dateModified?: string
  author: {
    name: string
    url?: string
  }
  publisher?: {
    name: string
    logo?: string
  }
}

export function generateArticleJsonLd(props: ArticleJsonLdProps) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: props.headline,
    description: props.description,
    image: props.image,
    datePublished: props.datePublished,
    dateModified: props.dateModified || props.datePublished,
    author: {
      '@type': 'Person',
      name: props.author.name,
      url: props.author.url,
    },
    publisher: props.publisher ? {
      '@type': 'Organization',
      name: props.publisher.name,
      logo: props.publisher.logo ? {
        '@type': 'ImageObject',
        url: props.publisher.logo,
      } : undefined,
    } : undefined,
  }
}

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
