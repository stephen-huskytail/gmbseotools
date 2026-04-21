import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'review',
  title: 'Review',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tool',
      title: 'Tool',
      type: 'reference',
      to: [{ type: 'tool' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'author' }],
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        { type: 'block' },
        { type: 'image', options: { hotspot: true } },
      ],
    }),
    defineField({
      name: 'ratings',
      title: 'Ratings',
      type: 'object',
      fields: [
        { name: 'features', title: 'Features', type: 'number', validation: (Rule) => Rule.min(0).max(5) },
        { name: 'easeOfUse', title: 'Ease of Use', type: 'number', validation: (Rule) => Rule.min(0).max(5) },
        { name: 'valueForMoney', title: 'Value for Money', type: 'number', validation: (Rule) => Rule.min(0).max(5) },
        { name: 'support', title: 'Support', type: 'number', validation: (Rule) => Rule.min(0).max(5) },
        { name: 'overall', title: 'Overall', type: 'number', validation: (Rule) => Rule.min(0).max(5) },
      ],
    }),
    defineField({
      name: 'verdict',
      title: 'Verdict',
      type: 'text',
    }),
    defineField({
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      tool: 'tool.name',
      media: 'featuredImage',
    },
    prepare({ title, tool, media }) {
      return {
        title,
        subtitle: tool ? `Review of ${tool}` : '',
        media,
      }
    },
  },
})
