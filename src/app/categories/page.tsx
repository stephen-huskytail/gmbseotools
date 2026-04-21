import Link from 'next/link'
import { Metadata } from 'next'
import { client } from '../../../sanity/lib/client'
import { categoriesQuery } from '../../../sanity/lib/queries'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Categories - Best AI SEO Tools',
  description: 'Browse AI SEO tools by category to find the perfect solution for your needs.',
}

interface Category {
  _id: string
  name: string
  slug: { current: string }
  description?: string
  icon?: string
}

export default async function CategoriesPage() {
  const categories = await client.fetch<Category[]>(categoriesQuery)

  return (
    <div className="bg-white">
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white">Browse by Category</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">
            Find AI SEO tools organized by use case and functionality.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {categories.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Link
                key={category._id}
                href={`/categories/${category.slug.current}`}
                className="group rounded-xl border border-gray-200 bg-white p-6 transition hover:border-blue-300 hover:shadow-lg"
              >
                <div className="flex items-center gap-4">
                  {category.icon && (
                    <span className="text-3xl">{category.icon}</span>
                  )}
                  <h2 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600">
                    {category.name}
                  </h2>
                </div>
                {category.description && (
                  <p className="mt-3 text-gray-600">{category.description}</p>
                )}
                <div className="mt-4 text-sm font-medium text-blue-600">
                  View tools →
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-gray-500">No categories yet. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  )
}
