import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'banner',
  title: 'Homepage Banner',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Banner Title',
      type: 'string',
      description: 'Main title for the banner announcement',
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Banner content description - will determine banner height',
      validation: (Rule) => Rule.required().max(500),
      rows: 4,
    }),
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'string',
      description: 'Hex color code for banner background (e.g., #3B82F6)',
      validation: (Rule) => Rule.regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).error('Must be a valid hex color'),
      initialValue: '#3B82F6',
    }),
    defineField({
      name: 'textColor',
      title: 'Text Color',
      type: 'string',
      description: 'Hex color code for text color (e.g., #FFFFFF)',
      validation: (Rule) => Rule.regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).error('Must be a valid hex color'),
      initialValue: '#FFFFFF',
    }),
    defineField({
      name: 'startDate',
      title: 'Start Date',
      type: 'datetime',
      description: 'When this banner should start displaying',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'endDate',
      title: 'End Date',
      type: 'datetime',
      description: 'When this banner should stop displaying',
      validation: (Rule) => Rule.required().min(Rule.valueOfField('startDate')),
    }),
    defineField({
      name: 'linkUrl',
      title: 'Link URL',
      type: 'url',
      description: 'Optional link for the banner (leave empty if no link needed)',
    }),
    defineField({
      name: 'linkText',
      title: 'Link Text',
      type: 'string',
      description: 'Text to display for the link button',
      validation: (Rule) => 
        Rule.custom((value, context) => {
          if (context?.parent?.linkUrl && !value) {
            return 'Link text is required when a link URL is provided'
          }
          return true
        }),
      hidden: ({ parent }) => !parent?.linkUrl,
    }),
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      description: 'Whether this banner should be displayed (in addition to date range)',
      initialValue: true,
    }),
    defineField({
      name: 'priority',
      title: 'Priority',
      type: 'number',
      description: 'Higher priority banners appear first (if multiple active banners)',
      validation: (Rule) => Rule.integer().min(0),
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: 'Priority (High to Low)',
      name: 'priority',
      by: [{ field: 'priority', direction: 'desc' }],
    },
    {
      title: 'Start Date (Newest First)',
      name: 'startDate',
      by: [{ field: 'startDate', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
      startDate: 'startDate',
      endDate: 'endDate',
      isActive: 'isActive',
    },
    prepare({ title, subtitle, startDate, endDate, isActive }) {
      const now = new Date()
      const start = new Date(startDate)
      const end = new Date(endDate)
      const isCurrentlyActive = isActive && start <= now && now <= end
      
      return {
        title: title,
        subtitle: `${subtitle?.slice(0, 60)}${subtitle?.length > 60 ? '...' : ''} ${isCurrentlyActive ? '🟢 Active' : '🔴 Inactive'}`,
      }
    },
  },
})
