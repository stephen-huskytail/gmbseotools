import Link from 'next/link'

export function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-gray-900">
              Best AI SEO Tools
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/tools"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Tools
            </Link>
            <Link
              href="/reviews"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Reviews
            </Link>
            <Link
              href="/comparisons"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Comparisons
            </Link>
            <Link
              href="/categories"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Categories
            </Link>
            <Link
              href="/blog"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Blog
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
