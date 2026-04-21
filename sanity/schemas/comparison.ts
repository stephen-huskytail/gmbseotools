import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'comparison',
  title: 'Comparison',
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
      name: 'tools',
      title: 'Tools to Compare',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'tool' }] }],
      validation: (Rule) => Rule.min(2).max(5),
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
      name: 'comparisonTable',
      title: 'Comparison Criteria',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'criterion', title: 'Criterion', type: 'string' },
          { name: 'description', title: 'Description', type: 'text' },
        ],
      }],
    }),
    defineField({
      name: 'winner',
      title: 'Winner',
      type: 'reference',
      to: [{ type: 'tool' }],
    }),
    defineField({
      name: 'winnerReason',
      title: 'Why They Win',
      type: 'text',
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'author' }],
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
      media: 'featuredImage',
    },
  },
})
