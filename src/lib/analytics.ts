import posthog from 'posthog-js'

export interface AffiliateClickEvent {
  tool_name: string
  affiliate_url: string
  affiliate_network?: string
  destination_url?: string
  article_type?: string
}

export interface ScrollDepthEvent {
  depth: 25 | 50 | 75 | 90
  article_slug: string
  article_type?: string
}

export interface ComparisonInteractionEvent {
  action: 'expand' | 'sort' | 'filter' | 'tab'
  comparison_slug?: string
  tool_names?: string[]
  sort_column?: string
  filter_value?: string
  tab_name?: string
}

export interface SiteSearchEvent {
  query: string
  results_count: number
}

type AnalyticsEvent =
  | { name: 'affiliate_click'; properties: AffiliateClickEvent }
  | { name: 'scroll_depth'; properties: ScrollDepthEvent }
  | { name: 'comparison_interaction'; properties: ComparisonInteractionEvent }
  | { name: 'site_search'; properties: SiteSearchEvent }

export function trackEvent<T extends AnalyticsEvent['name']>(
  name: T,
  properties: Extract<AnalyticsEvent, { name: T }>['properties']
) {
  if (typeof window === 'undefined') return

  if (window.posthog) {
    posthog.capture(name, properties)
  }

  if (window.gtag) {
    window.gtag('event', name, properties)
  }
}

export function initPostHog() {
  if (typeof window === 'undefined') return
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return

  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
    person_profiles: 'identified_only',
    capture_pageview: false,
    capture_pageleave: true,
  })

  window.posthog = posthog
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    posthog?: typeof posthog
  }
}
