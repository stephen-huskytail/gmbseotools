'use client'

import { useState } from 'react'

interface FAQItem {
  question: string
  answer: string
}

interface FAQAccordionProps {
  items: FAQItem[]
  className?: string
}

export function FAQAccordion({ items, className = '' }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className={`divide-y divide-gray-200 rounded-lg border border-gray-200 ${className}`}>
      {items.map((item, index) => (
        <div key={index} className="bg-white">
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="flex w-full items-center justify-between px-4 py-4 text-left"
          >
            <span className="font-medium text-gray-900">{item.question}</span>
            <svg
              className={`h-5 w-5 text-gray-500 transition-transform ${openIndex === index ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {openIndex === index && (
            <div className="px-4 pb-4 text-gray-600">
              {item.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
