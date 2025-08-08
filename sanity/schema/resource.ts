import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'resource',
  title: 'Resource',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Short title for the resource',
      validation: (Rule) => Rule.required().max(60),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Brief description of the resource',
      validation: (Rule) => Rule.max(150),
    }),
    defineField({
      name: 'region',
      title: 'Region',
      type: 'reference',
      to: [{ type: 'region' }],
      description: 'Select a specific region for this resource. Leave empty to show on Home Page.',
    }),
    defineField({
      name: 'linkType',
      title: 'Link Type',
      type: 'string',
      options: {
        list: [
          { title: 'External Website', value: 'external' },
          { title: 'PDF Document', value: 'pdf' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'externalUrl',
      title: 'External URL',
      type: 'url',
      description: 'Link to external website or resource',
      hidden: ({ parent }) => parent?.linkType !== 'external',
      validation: (Rule) => 
        Rule.custom((value, context) => {
          if (context?.parent?.linkType === 'external' && !value) {
            return 'External URL is required when link type is External Website'
          }
          return true
        }),
    }),
    defineField({
      name: 'pdfFile',
      title: 'PDF File',
      type: 'file',
      description: 'Upload a PDF document',
      options: {
        accept: '.pdf',
      },
      hidden: ({ parent }) => parent?.linkType !== 'pdf',
      validation: (Rule) => 
        Rule.custom((value, context) => {
          if (context?.parent?.linkType === 'pdf' && !value) {
            return 'PDF file is required when link type is PDF Document'
          }
          return true
        }),
    }),
    defineField({
      name: 'displayOrder',
      title: 'Display Order',
      type: 'number',
      description: 'Order in which this resource appears (lower numbers appear first)',
      validation: (Rule) => Rule.integer().min(0),
    }),
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      description: 'Whether this resource should be displayed',
      initialValue: true,
    }),
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'displayOrder',
      by: [{ field: 'displayOrder', direction: 'asc' }],
    },
    {
      title: 'Title',
      name: 'title',
      by: [{ field: 'title', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      description: 'description',
      linkType: 'linkType',
      isActive: 'isActive',
      regionName: 'region.name',
    },
    prepare({ title, description, linkType, isActive, regionName }) {
      const location = regionName || 'Home Page'
      return {
        title: title,
        subtitle: `${linkType === 'external' ? '🔗' : '📄'} ${location} • ${description || 'No description'} ${isActive ? '' : '(Inactive)'}`,
      }
    },
  },
})