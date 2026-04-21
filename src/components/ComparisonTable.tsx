"use client";

import { useCallback } from "react";
import { RatingStars } from "./RatingStars";
import { AffiliateButton } from "./AffiliateButton";
import { trackEvent, ComparisonInteractionEvent } from "@/lib/analytics";

interface Tool {
  slug: string;
  name: string;
  description?: string;
  rating?: number;
  pricing?: string;
  affiliateUrl?: string;
}

interface ComparisonTableProps {
  tools: Tool[];
  criteria?: Array<{
    criterion: string;
    description?: string;
  }>;
  winner?: string | null;
  comparisonSlug?: string;
  className?: string;
}

export function ComparisonTable({
  tools,
  criteria,
  winner,
  comparisonSlug,
  className = "",
}: ComparisonTableProps) {
  const trackInteraction = useCallback(
    (
      action: ComparisonInteractionEvent["action"],
      extra?: Partial<ComparisonInteractionEvent>
    ) => {
      trackEvent("comparison_interaction", {
        action,
        comparison_slug: comparisonSlug,
        tool_names: tools.map((t) => t.name),
        ...extra,
      });
    },
    [comparisonSlug, tools]
  );

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:bg-gray-100"
              onClick={() => trackInteraction("sort", { sort_column: "feature" })}
            >
              Feature
            </th>
            {tools.map((tool) => (
              <th
                key={tool.slug}
                scope="col"
                className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                <div className="flex flex-col items-center gap-2">
                  <span
                    className={
                      winner === tool.name ? "font-semibold text-blue-600" : ""
                    }
                  >
                    {tool.name}
                    {winner === tool.name && (
                      <span className="ml-1 text-xs text-blue-600">
                        ★ Winner
                      </span>
                    )}
                  </span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          <tr>
            <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
              Rating
            </td>
            {tools.map((tool) => (
              <td key={tool.slug} className="px-6 py-4 text-center">
                {tool.rating ? (
                  <div className="flex justify-center">
                    <RatingStars rating={tool.rating} size="sm" />
                  </div>
                ) : (
                  <span className="text-gray-400">N/A</span>
                )}
              </td>
            ))}
          </tr>
          <tr>
            <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
              Pricing
            </td>
            {tools.map((tool) => (
              <td
                key={tool.slug}
                className="px-6 py-4 text-center text-sm text-gray-700"
              >
                {tool.pricing || <span className="text-gray-400">N/A</span>}
              </td>
            ))}
          </tr>
          {criteria?.map((c, index) => (
            <tr key={index}>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                <div>{c.criterion}</div>
                {c.description && (
                  <p className="mt-1 text-xs text-gray-500">{c.description}</p>
                )}
              </td>
              {tools.map((tool) => (
                <td
                  key={tool.slug}
                  className="px-6 py-4 text-center text-sm text-gray-700"
                >
                  -
                </td>
              ))}
            </tr>
          ))}
          <tr className="bg-gray-50">
            <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
              Try It
            </td>
            {tools.map((tool) => (
              <td key={tool.slug} className="px-6 py-4 text-center">
                {tool.affiliateUrl ? (
                  <AffiliateButton
                    href={tool.affiliateUrl}
                    toolName={tool.name}
                    size="sm"
                  />
                ) : (
                  <span className="text-gray-400">N/A</span>
                )}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
