'use client'

import { useEffect, useRef } from 'react'
import { trackEvent } from '@/lib/analytics'

const DEPTH_THRESHOLDS = [25, 50, 75, 90] as const

interface ScrollDepthTrackerProps {
  articleSlug: string
  articleType?: string
}

export function ScrollDepthTracker({ articleSlug, articleType }: ScrollDepthTrackerProps) {
  const trackedDepths = useRef<Set<number>>(new Set())
  const sentinelsRef = useRef<Map<number, HTMLDivElement>>(new Map())

  useEffect(() => {
    trackedDepths.current = new Set()

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const depth = Number(entry.target.getAttribute('data-depth')) as 25 | 50 | 75 | 90
          if (trackedDepths.current.has(depth)) return

          trackedDepths.current.add(depth)
          trackEvent('scroll_depth', {
            depth,
            article_slug: articleSlug,
            article_type: articleType,
          })
        })
      },
      { threshold: 0 }
    )

    sentinelsRef.current.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [articleSlug, articleType])

  return (
    <>
      {DEPTH_THRESHOLDS.map((depth) => (
        <div
          key={depth}
          data-depth={depth}
          ref={(el) => {
            if (el) sentinelsRef.current.set(depth, el)
          }}
          style={{
            position: 'absolute',
            top: `${depth}%`,
            left: 0,
            height: '1px',
            width: '1px',
            pointerEvents: 'none',
          }}
          aria-hidden="true"
        />
      ))}
    </>
  )
}
