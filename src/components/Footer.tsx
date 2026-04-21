import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="col-span-1 md:col-span-2">
            <span className="text-lg font-bold text-gray-900">
              Best AI SEO Tools
            </span>
            <p className="mt-4 text-sm text-gray-600">
              Your trusted source for discovering and comparing the best AI-powered
              SEO tools to boost your search rankings and grow your business.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Resources</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/tools" className="text-sm text-gray-600 hover:text-gray-900">
                  All Tools
                </Link>
              </li>
              <li>
                <Link href="/reviews" className="text-sm text-gray-600 hover:text-gray-900">
                  Reviews
                </Link>
              </li>
              <li>
                <Link href="/comparisons" className="text-sm text-gray-600 hover:text-gray-900">
                  Comparisons
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Company</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/about" className="text-sm text-gray-600 hover:text-gray-900">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-600 hover:text-gray-900">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-gray-600 hover:text-gray-900">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-8">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Best AI SEO Tools. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
