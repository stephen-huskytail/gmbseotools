interface PricingCardProps {
  hasFree?: boolean
  startingPrice?: number
  pricingModel?: 'freemium' | 'subscription' | 'one-time' | 'usage-based' | 'free'
  className?: string
}

export function PricingCard({
  hasFree,
  startingPrice,
  pricingModel,
  className = '',
}: PricingCardProps) {
  const modelLabels: Record<string, string> = {
    freemium: 'Freemium',
    subscription: 'Subscription',
    'one-time': 'One-time',
    'usage-based': 'Usage-based',
    free: 'Free',
  }

  const modelColors: Record<string, string> = {
    freemium: 'bg-green-100 text-green-800',
    subscription: 'bg-blue-100 text-blue-800',
    'one-time': 'bg-purple-100 text-purple-800',
    'usage-based': 'bg-orange-100 text-orange-800',
    free: 'bg-emerald-100 text-emerald-800',
  }

  return (
    <div className={`rounded-lg border border-gray-200 bg-white p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          {startingPrice !== undefined && startingPrice > 0 ? (
            <div className="text-2xl font-bold text-gray-900">
              ${startingPrice}
              <span className="text-sm font-normal text-gray-500">/mo</span>
            </div>
          ) : hasFree || pricingModel === 'free' ? (
            <div className="text-2xl font-bold text-emerald-600">Free</div>
          ) : (
            <div className="text-lg text-gray-500">Contact for pricing</div>
          )}
          {hasFree && startingPrice && startingPrice > 0 && (
            <p className="text-sm text-gray-500">Free tier available</p>
          )}
        </div>
        {pricingModel && (
          <span className={`rounded-full px-3 py-1 text-xs font-medium ${modelColors[pricingModel] || 'bg-gray-100 text-gray-800'}`}>
            {modelLabels[pricingModel] || pricingModel}
          </span>
        )}
      </div>
    </div>
  )
}
