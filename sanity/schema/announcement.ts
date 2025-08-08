import {defineField, defineType} from 'sanity'
import {simpleMediaField} from './mediaField'

export default defineType({
  name: 'announcement',
  title: 'Announcement',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Announcement Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'H1', value: 'h1'},
            {title: 'H2', value: 'h2'},
            {title: 'H3', value: 'h3'},
            {title: 'Quote', value: 'blockquote'},
          ],
          lists: [
            {title: 'Bullet', value: 'bullet'},
            {title: 'Numbered', value: 'number'},
          ],
          marks: {
            decorators: [
              {title: 'Strong', value: 'strong'},
              {title: 'Emphasis', value: 'em'},
            ],
            annotations: [
              {
                title: 'URL',
                name: 'link',
                type: 'object',
                fields: [
                  {
                    title: 'URL',
                    name: 'href',
                    type: 'url',
                  },
                ],
              },
            ],
          },
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      description: 'Brief summary for listing pages',
      rows: 3,
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published Date',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'expiresAt',
      title: 'Expires Date',
      type: 'datetime',
      description: 'Optional expiration date for the announcement',
    }),
    defineField({
      name: 'region',
      title: 'Region',
      type: 'reference',
      to: [{type: 'region'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'priority',
      title: 'Priority',
      type: 'string',
      options: {
        list: [
          {title: 'Low', value: 'low'},
          {title: 'Normal', value: 'normal'},
          {title: 'High', value: 'high'},
          {title: 'Urgent', value: 'urgent'},
        ],
      },
      initialValue: 'normal',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'General', value: 'general'},
          {title: 'Policy Update', value: 'policy'},
          {title: 'Training', value: 'training'},
          {title: 'Event', value: 'event'},
          {title: 'System', value: 'system'},
          {title: 'Emergency', value: 'emergency'},
        ],
      },
      initialValue: 'general',
    }),
    defineField({
      name: 'isPinned',
      title: 'Pin to Top',
      type: 'boolean',
      description: 'Pin this announcement to the top of the list',
      initialValue: false,
    }),
    simpleMediaField('media', 'Featured Image or PDF', {
      description: 'Upload a featured image or PDF document for this announcement',
      hotspot: true,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'region.name',
      media: 'media',
      priority: 'priority',
      isPinned: 'isPinned',
    },
    prepare(selection) {
      const {title, subtitle, media, priority, isPinned} = selection
      const priorityEmoji = {
        urgent: '🔴',
        high: '🟡',
        normal: '',
        low: '🔵'
      }[priority] || ''
      
      const pinnedText = isPinned ? '📌 ' : ''
      
      return {
        title: `${pinnedText}${priorityEmoji} ${title}`,
        subtitle: subtitle,
        media: media,
      }
    },
  },
  orderings: [
    {
      title: 'Published Date, Newest',
      name: 'publishedDateDesc',
      by: [
        {field: 'isPinned', direction: 'desc'},
        {field: 'publishedAt', direction: 'desc'}
      ]
    },
    {
      title: 'Priority, High to Low',
      name: 'priorityDesc',
      by: [
        {field: 'isPinned', direction: 'desc'},
        {field: 'priority', direction: 'desc'},
        {field: 'publishedAt', direction: 'desc'}
      ]
    },
  ],
})