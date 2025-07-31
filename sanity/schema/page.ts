import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
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
      title: 'Page Content',
      type: 'text',
      rows: 10,
    }),
    defineField({
      name: 'showOnNavigation',
      title: 'Show in Navigation',
      type: 'boolean',
      description: 'Display this page in the main navigation menu',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      slug: 'slug',
    },
    prepare({title, slug}) {
      return {
        title,
        subtitle: `/${slug?.current || ''}`,
      }
    },
  },
})
