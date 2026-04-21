'use client'

import { useCallback } from 'react'
import { trackEvent } from '@/lib/analytics'

interface AffiliateButtonProps {
  href: string
  toolName: string
  affiliateNetwork?: string
  destinationUrl?: string
  articleType?: string
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  children?: React.ReactNode
}

export function AffiliateButton({
  href,
  toolName,
  affiliateNetwork,
  destinationUrl,
  articleType,
  variant = 'primary',
  size = 'md',
  className = '',
  children,
}: AffiliateButtonProps) {
  const handleClick = useCallback(() => {
    trackEvent('affiliate_click', {
      tool_name: toolName,
      affiliate_url: href,
      affiliate_network: affiliateNetwork,
      destination_url: destinationUrl,
      article_type: articleType,
    })
  }, [href, toolName, affiliateNetwork, destinationUrl, articleType])

  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-lg transition-colors'

  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
  }

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer sponsored"
      onClick={handleClick}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children || `Try ${toolName}`}
      <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
    </a>
  )
}

