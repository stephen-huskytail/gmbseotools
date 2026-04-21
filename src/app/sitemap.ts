import type { MetadataRoute } from "next";
import {
  getAllPosts,
  getAllTools,
  getAllReviews,
  getAllComparisons,
  getCategories,
} from "../lib/content";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://gmbseotools.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const tools = getAllTools();
  const reviews = getAllReviews();
  const comparisons = getAllComparisons();
  const categories = getCategories();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/tools`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/reviews`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/comparisons`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/categories`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
  ];

  const toolPages: MetadataRoute.Sitemap = tools.map((item) => ({
    url: `${SITE_URL}/tools/${item.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const reviewPages: MetadataRoute.Sitemap = reviews.map((item) => ({
    url: `${SITE_URL}/reviews/${item.slug}`,
    lastModified: item.publishedAt ? new Date(item.publishedAt) : new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const comparisonPages: MetadataRoute.Sitemap = comparisons.map((item) => ({
    url: `${SITE_URL}/comparisons/${item.slug}`,
    lastModified: item.publishedAt ? new Date(item.publishedAt) : new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const postPages: MetadataRoute.Sitemap = posts.map((item) => ({
    url: `${SITE_URL}/blog/${item.slug}`,
    lastModified: item.publishedAt ? new Date(item.publishedAt) : new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const categoryPages: MetadataRoute.Sitemap = categories.map((item) => ({
    url: `${SITE_URL}/categories/${item}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  return [
    ...staticPages,
    ...toolPages,
    ...reviewPages,
    ...comparisonPages,
    ...postPages,
    ...categoryPages,
  ];
}
